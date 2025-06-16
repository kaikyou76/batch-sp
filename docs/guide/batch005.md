## 人事システムバッチ処理細設計 03

### ジョブ全体構成

```java
@Configuration
public class HumanResourceJobConfig {

    private final JobBuilderFactory jobBuilderFactory;
    private final StepBuilderFactory stepBuilderFactory;
    private final BatchSettings batchSettings;
    private final DataSource dataSource;
    private final PlatformTransactionManager transactionManager;

    public HumanResourceJobConfig(
        JobBuilderFactory jobBuilderFactory,
        StepBuilderFactory stepBuilderFactory,
        BatchSettings batchSettings,
        DataSource dataSource,
        PlatformTransactionManager transactionManager
    ) {
        this.jobBuilderFactory = jobBuilderFactory;
        this.stepBuilderFactory = stepBuilderFactory;
        this.batchSettings = batchSettings;
        this.dataSource = dataSource;
        this.transactionManager = transactionManager;
    }

    // メインジョブ定義
    @Bean
    public Job humanResourceBatchJob() {
        return jobBuilderFactory.get("humanResourceBatchJob")
                .start(fileValidationStep())
                .next(lockAcquisitionStep())
                .next(truncateStagingTablesStep())
                .next(organizationCsvToStagingStep())
                .next(departmentCsvToStagingStep())
                .next(employeeCsvToStagingStep())
                .next(adCsvToStagingStep())
                .next(shiftCsvToStagingStep())
                .next(businessDataUpdateStep())
                .next(thresholdCheckStep())
                .next(sectionMasterSyncStep())
                .next(userStatusManagementStep())
                .next(organizationalChangeStep())
                .next(retirementReportStep())
                .next(cleanupStep())
                .listener(jobLockListener())
                .listener(errorNotificationListener())
                .build();
    }

    // 各ステップのBean定義...
}
```

### ステップ 1: ファイル検証ステップ

```java
@Bean
public Step fileValidationStep() {
    return stepBuilderFactory.get("fileValidationStep")
            .tasklet(fileValidationTasklet())
            .build();
}

@Bean
public Tasklet fileValidationTasklet() {
    return new FileValidationTasklet(batchSettings);
}
```

`FileValidationTasklet.java`:

```java
public class FileValidationTasklet implements Tasklet {
    private final BatchSettings batchSettings;

    public FileValidationTasklet(BatchSettings batchSettings) {
        this.batchSettings = batchSettings;
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        Path csvDir = Paths.get(batchSettings.getCsvFtpDir());
        String[] requiredFiles = {
            batchSettings.getOrganizationCsv(),
            batchSettings.getDepartmentCsv(),
            batchSettings.getEmployeeCsv(),
            batchSettings.getAdCsv(),
            batchSettings.getShiftCsv(),
            batchSettings.getEofFlagCsv()
        };

        for (String file : requiredFiles) {
            Path filePath = csvDir.resolve(file);
            if (!Files.exists(filePath)) {
                throw new BatRuntimeException("必須ファイルが存在しません: " + file);
            }
        }
        return RepeatStatus.FINISHED;
    }
}
```

### ステップ 2: ロック取得ステップ

```java
@Bean
public Step lockAcquisitionStep() {
    return stepBuilderFactory.get("lockAcquisitionStep")
            .tasklet(lockAcquisitionTasklet())
            .build();
}

@Bean
public Tasklet lockAcquisitionTasklet() {
    return new LockAcquisitionTasklet(batchSettings);
}
```

`LockAcquisitionTasklet.java`:

```java
public class LockAcquisitionTasklet implements Tasklet {
    private final BatchSettings batchSettings;

    public LockAcquisitionTasklet(BatchSettings batchSettings) {
        this.batchSettings = batchSettings;
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        try {
            LockFileManager.lock(batchSettings);
            return RepeatStatus.FINISHED;
        } catch (IOException e) {
            throw new BatRuntimeException("ロックファイルの作成に失敗しました", e);
        }
    }
}
```

### ステップ 3: ステージングテーブル初期化ステップ

```java
@Bean
public Step truncateStagingTablesStep() {
    return stepBuilderFactory.get("truncateStagingTablesStep")
            .tasklet(truncateStagingTablesTasklet())
            .build();
}

@Bean
public Tasklet truncateStagingTablesTasklet() {
    return new TruncateStagingTablesTasklet(dataSource);
}
```

`TruncateStagingTablesTasklet.java`:

```java
public class TruncateStagingTablesTasklet implements Tasklet {
    private final JdbcTemplate jdbcTemplate;

    public TruncateStagingTablesTasklet(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        jdbcTemplate.execute("TRUNCATE TABLE STG_ORGANIZATION");
        jdbcTemplate.execute("TRUNCATE TABLE STG_DEPARTMENT");
        jdbcTemplate.execute("TRUNCATE TABLE STG_EMPLOYEE");
        jdbcTemplate.execute("TRUNCATE TABLE STG_AD");
        jdbcTemplate.execute("TRUNCATE TABLE STG_SHIFT");
        return RepeatStatus.FINISHED;
    }
}
```

### ステップ 4-8: CSV→ ステージングテーブル取込ステップ（組織/店部課/社員/AD/機構改革）

```java
// 組織CSV取込
@Bean
public Step organizationCsvToStagingStep() {
    return stepBuilderFactory.get("organizationCsvToStagingStep")
            .<OrganizationCsv, OrganizationCsv>chunk(1000)
            .reader(organizationCsvReader())
            .writer(organizationStagingWriter())
            .transactionManager(transactionManager)
            .build();
}

@Bean
public FlatFileItemReader<OrganizationCsv> organizationCsvReader() {
    return new FlatFileItemReaderBuilder<OrganizationCsv>()
            .name("organizationCsvReader")
            .resource(new FileSystemResource(Paths.get(batchSettings.getCsvFtpDir(), batchSettings.getOrganizationCsv())))
            .delimited()
            .names("orgCode", "orgName", "dummyFlag")
            .targetType(OrganizationCsv.class)
            .build();
}

@Bean
public JdbcBatchItemWriter<OrganizationCsv> organizationStagingWriter() {
    return new JdbcBatchItemWriterBuilder<OrganizationCsv>()
            .sql("INSERT INTO STG_ORGANIZATION (org_code, org_name, dummy_flag) VALUES (:orgCode, :orgName, :dummyFlag)")
            .dataSource(dataSource)
            .beanMapped()
            .build();
}

// 他のCSVファイルについても同様の構成で作成
```

### ステップ 9: 業務データ更新ステップ

```java
@Bean
public Step businessDataUpdateStep() {
    return stepBuilderFactory.get("businessDataUpdateStep")
            .tasklet(businessDataUpdateTasklet())
            .build();
}

@Bean
public Tasklet businessDataUpdateTasklet() {
    return new BusinessDataUpdateTasklet(dataSource);
}
```

`BusinessDataUpdateTasklet.java`:

```java
public class BusinessDataUpdateTasklet implements Tasklet {
    private final JdbcTemplate jdbcTemplate;

    public BusinessDataUpdateTasklet(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        // ステージングからビジネステーブルへデータ移行
        jdbcTemplate.update("TRUNCATE TABLE BIZ_ORGANIZATION");
        jdbcTemplate.update("INSERT INTO BIZ_ORGANIZATION SELECT * FROM STG_ORGANIZATION WHERE dummy_flag = '0'");

        // 他のテーブルについても同様の処理
        return RepeatStatus.FINISHED;
    }
}
```

### ステップ 10: 閾値チェックステップ

```java
@Bean
public Step thresholdCheckStep() {
    return stepBuilderFactory.get("thresholdCheckStep")
            .tasklet(thresholdCheckTasklet())
            .build();
}

@Bean
public Tasklet thresholdCheckTasklet() {
    return new ThresholdCheckTasklet(dataSource);
}
```

`ThresholdCheckTasklet.java`:

```java
public class ThresholdCheckTasklet implements Tasklet {
    private final JdbcTemplate jdbcTemplate;

    public ThresholdCheckTasklet(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        Integer threshold = jdbcTemplate.queryForObject(
            "SELECT threshold_value FROM THRESHOLD WHERE threshold_type = 'CHANGE'", Integer.class);

        Integer changeCount = jdbcTemplate.queryForObject(
            "SELECT COUNT(*) FROM CHANGE_LOG WHERE processed_date = CURRENT_DATE", Integer.class);

        if (changeCount > threshold) {
            throw new BatRuntimeException("変更件数が閾値を超えました: " + changeCount + "/" + threshold);
        }
        return RepeatStatus.FINISHED;
    }
}
```

### ステップ 11: 店部課マスタ同期ステップ

```java
@Bean
public Step sectionMasterSyncStep() {
    return stepBuilderFactory.get("sectionMasterSyncStep")
            .tasklet(sectionMasterSyncTasklet())
            .build();
}

@Bean
public Tasklet sectionMasterSyncTasklet() {
    return new SectionMasterSyncTasklet(dataSource);
}
```

`SectionMasterSyncTasklet.java`:

```java
public class SectionMasterSyncTasklet implements Tasklet {
    private final JdbcTemplate jdbcTemplate;

    public SectionMasterSyncTasklet(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        // 新規店部課追加
        jdbcTemplate.update("INSERT INTO M_SECTION (...) SELECT ... FROM BIZ_DEPARTMENT d WHERE NOT EXISTS (...)");

        // 既存店部課更新
        jdbcTemplate.update("UPDATE M_SECTION ms SET ... FROM BIZ_DEPARTMENT d WHERE ms.id = d.id");
        return RepeatStatus.FINISHED;
    }
}
```

### ステップ 12: ユーザーステータス管理ステップ

```java
@Bean
public Step userStatusManagementStep() {
    return stepBuilderFactory.get("userStatusManagementStep")
            .tasklet(userStatusManagementTasklet())
            .build();
}

@Bean
public Tasklet userStatusManagementTasklet() {
    return new UserStatusManagementTasklet(dataSource);
}
```

`UserStatusManagementTasklet.java`:

```java
public class UserStatusManagementTasklet implements Tasklet {
    private final JdbcTemplate jdbcTemplate;

    public UserStatusManagementTasklet(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        // 退社処理
        jdbcTemplate.update("UPDATE APP_USER SET deleted = 1 WHERE employee_id IN (SELECT id FROM BIZ_EMPLOYEE WHERE status = 'retired')");

        // 入社処理
        jdbcTemplate.update("INSERT INTO APP_USER (...) SELECT ... FROM BIZ_EMPLOYBE WHERE status = 'new'");

        // 社員情報更新
        jdbcTemplate.update("UPDATE APP_USER au SET ... FROM BIZ_EMPLOYEE be WHERE au.employee_id = be.id");
        return RepeatStatus.FINISHED;
    }
}
```

### ステップ 13: 組織変更ステップ

```java
@Bean
public Step organizationalChangeStep() {
    return stepBuilderFactory.get("organizationalChangeStep")
            .tasklet(organizationalChangeTasklet())
            .build();
}

@Bean
public Tasklet organizationalChangeTasklet() {
    return new OrganizationalChangeTasklet(dataSource);
}
```

`OrganizationalChangeTasklet.java`:

```java
public class OrganizationalChangeTasklet implements Tasklet {
    private final JdbcTemplate jdbcTemplate;

    public OrganizationalChangeTasklet(DataSource dataSource) {
        this.jdbcTemplate = new JdbcTemplate(dataSource);
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        // 拠点統廃合処理
        jdbcTemplate.update("UPDATE USER_SECTION SET section_id = new_section_id WHERE section_id IN (SELECT id FROM CLOSED_SECTIONS)");

        // 関連リソース更新
        jdbcTemplate.update("UPDATE CALLING_SEARCH_SPACE SET ...");
        jdbcTemplate.update("UPDATE PICKUP_GROUP SET ...");
        jdbcTemplate.update("UPDATE BILLING_DESTINATION SET ...");
        return RepeatStatus.FINISHED;
    }
}
```

### ステップ 14: 退職レポート出力ステップ

```java
@Bean
public Step retirementReportStep() {
    return stepBuilderFactory.get("retirementReportStep")
            .<RetiredUser, RetiredUser>chunk(100)
            .reader(retiredUserReader())
            .writer(retiredUserWriter())
            .build();
}

@Bean
public JdbcCursorItemReader<RetiredUser> retiredUserReader() {
    return new JdbcCursorItemReaderBuilder<RetiredUser>()
            .name("retiredUserReader")
            .dataSource(dataSource)
            .sql("SELECT last_name, first_name, phone_number, full_name_id FROM APP_USER WHERE deleted = 1 ORDER BY phone_number")
            .rowMapper((rs, rowNum) -> new RetiredUser(
                rs.getString("last_name"),
                rs.getString("first_name"),
                rs.getString("phone_number"),
                rs.getString("full_name_id")
            ))
            .build();
}

@Bean
public FlatFileItemWriter<RetiredUser> retiredUserWriter() {
    return new FlatFileItemWriterBuilder<RetiredUser>()
            .name("retiredUserWriter")
            .resource(new FileSystemResource(Paths.get(batchSettings.getOutputDir(), "retired_users_" + LocalDate.now() + ".csv")))
            .delimited()
            .names("lastName", "firstName", "phoneNumber", "fullNameId")
            .build();
}
```

### ステップ 15: クリーンアップステップ

```java
@Bean
public Step cleanupStep() {
    return stepBuilderFactory.get("cleanupStep")
            .tasklet(cleanupTasklet())
            .build();
}

@Bean
public Tasklet cleanupTasklet() {
    return new CleanupTasklet(batchSettings);
}
```

`CleanupTasklet.java`:

```java
public class CleanupTasklet implements Tasklet {
    private final BatchSettings batchSettings;

    public CleanupTasklet(BatchSettings batchSettings) {
        this.batchSettings = batchSettings;
    }

    @Override
    public RepeatStatus execute(StepContribution contribution, ChunkContext chunkContext) {
        try {
            // CSVファイルのリネーム
            Path source = Paths.get(batchSettings.getCsvFtpDir(), batchSettings.getOrganizationCsv());
            Path target = source.resolveSibling(source.getFileName() + "_IMPORTED_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")));
            Files.move(source, target);

            // 他のファイルも同様にリネーム

            // ロックファイル削除
            LockFileManager.unlock(batchSettings);
            return RepeatStatus.FINISHED;
        } catch (IOException e) {
            throw new BatRuntimeException("クリーンアップ処理に失敗しました", e);
        }
    }
}
```

### リスナー実装

```java
@Component
public class JobLockListener extends JobExecutionListenerSupport {
    private final BatchSettings batchSettings;

    public JobLockListener(BatchSettings batchSettings) {
        this.batchSettings = batchSettings;
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        if (jobExecution.getStatus() == BatchStatus.FAILED) {
            // 異常終了時のロックファイル強制削除
            LockFileManager.forceUnlock(batchSettings);
        }
    }
}

@Component
public class ErrorNotificationListener extends JobExecutionListenerSupport {
    private final NotificationService notificationService;

    public ErrorNotificationListener(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @Override
    public void afterJob(JobExecution jobExecution) {
        if (jobExecution.getStatus() == BatchStatus.FAILED) {
            List<Throwable> exceptions = jobExecution.getAllFailureExceptions();
            String errorMessage = "バッチ処理が異常終了しました: " +
                exceptions.stream()
                    .map(Throwable::getMessage)
                    .collect(Collectors.joining(", "));

            notificationService.sendErrorNotification(errorMessage);
        }
    }
}
```

### トランザクション管理のポイント

1. **チャンクステップ**: ステージングテーブルへの挿入処理はチャンク単位でコミット
2. **タスクレットステップ**: 一括更新処理はタスクレット内で単一トランザクション
3. **ジョブ全体**: ジョブ全体を単一トランザクションにする必要はない（ステップ単位で適切にコミット）

### パフォーマンス最適化

1. **バルク挿入**: JDBC バッチモードを使用
2. **インデックス一時無効化**: 大量データ挿入前
   ```java
   jdbcTemplate.execute("ALTER TABLE STG_ORGANIZATION DISABLE KEYS");
   // データ挿入...
   jdbcTemplate.execute("ALTER TABLE STG_ORGANIZATION ENABLE KEYS");
   ```
3. **並列処理**: 独立したステップを並列実行

   ```java
   @Bean
   public Job parallelStepsJob() {
       return jobBuilderFactory.get("parallelStepsJob")
           .start(splitFlow())
           .build()
           .build();
   }

   @Bean
   public Flow splitFlow() {
       return new FlowBuilder<SimpleFlow>("splitFlow")
           .split(taskExecutor())
           .add(flow1(), flow2())
           .build();
   }
   ```

### ディレクトリ構造

```
src/main/java/
└── com
    └── example
        └── batch
            ├── config
            │   ├── BatchConfig.java
            │   └── DatabaseConfig.java
            ├── job
            │   └── HumanResourceJobConfig.java
            ├── listener
            │   ├── JobLockListener.java
            │   └── ErrorNotificationListener.java
            ├── processor
            │   ├── DummyDataFilter.java
            │   └── AdLoginProcessor.java
            ├── reader
            │   ├── OrganizationCsvReader.java
            │   ├── DepartmentCsvReader.java
            │   └── EmployeeCsvReader.java
            ├── tasklet
            │   ├── FileValidationTasklet.java
            │   ├── BusinessDataUpdateTasklet.java
            │   └── SectionMasterSyncTasklet.java
            ├── model
            │   ├── OrganizationCsv.java
            │   ├── DepartmentCsv.java
            │   └── EmployeeCsv.java
            └── util
                ├── LockFileManager.java
                └── CsvFileUtils.java
```

> この設計により、大規模な人事データ処理を効率的かつ安全に実行できます。各ステップが独立しているため、メンテナンス性も高く、特定の処理だけを再実行するなどの拡張も容易です。

この設計により、以下の利点が得られます：

1. **明確な責務分離**: 各ステップが単一責任を持ち、保守性が向上
2. **柔軟なエラーハンドリング**: リスナーによる一貫したエラー処理
3. **パフォーマンス**: チャンク処理とバルク操作による効率化
4. **信頼性**: ロック管理とトランザクション制御による安全な実行
5. **拡張性**: 新しい CSV 形式や処理の追加が容易

特に、拠点統廃合処理や所属管理などの複雑な業務ロジックはタスクレット内にカプセル化され、メンテナンス性を確保しています。
