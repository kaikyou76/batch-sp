## 人事システムバッチ処理細設計 04

#### 已深度思考

> 既存のジョブ設定にチャンク型ステップとタスクレットステップを組み合わせて実装するには、各ステップの特性に応じて適切な方法を選択します。以下に、TRUNCATE 処理をチャンク型で実装し、他の処理をタスクレットで実装する例を示します。
>
> ### ステップの種類選択基準

- **チャンク型**: 大量データを処理する場合（CSV 取込、レポート出力など）
- **タスクレット**: 単発の処理（ファイル操作、DDL 実行、一括更新など）
  > ### ジョブ設定例（チャンク型とタスクレットの組み合わせ）
  >
  > ```java
  > @Configuration
  > @EnableBatchProcessing
  > public class HumanResourceJobConfig {
  >     private final JobRepository jobRepository;
  > ```
      private final BatchSettings batchSettings;
      private final DataSource dataSource;
      private final PlatformTransactionManager transactionManager;
      private final JdbcTemplate jdbcTemplate;
  >     public HumanResourceJobConfig(
              JobRepository jobRepository,
              BatchSettings batchSettings,
              DataSource dataSource,
              PlatformTransactionManager transactionManager,
              JdbcTemplate jdbcTemplate) {
          this.jobRepository = jobRepository;
          this.batchSettings = batchSettings;
          this.dataSource = dataSource;
          this.transactionManager = transactionManager;
          this.jdbcTemplate = jdbcTemplate;
      }
  >     @Bean
      public Job humanResourceBatchJob() {
          return new JobBuilder("humanResourceBatchJob", jobRepository)
                  .start(fileValidationStep())
                  .next(lockAcquisitionStep())
                  .next(truncateStagingTablesStep()) // チャンク型TRUNCATE
                  .next(organizationCsvToStagingStep()) // チャンク型CSV取込
                  .next(departmentCsvToStagingStep()) // チャンク型CSV取込
                  .next(businessDataUpdateStep()) // タスクレット
                  .next(thresholdCheckStep()) // タスクレット
                  // ... 他のステップ
                  .build();
      }
  >     // タスクレットステップ例: ファイル検証
      @Bean
      public Step fileValidationStep() {
          return new StepBuilder("fileValidationStep", jobRepository)
                  .tasklet((contribution, chunkContext) -> {
                      // ファイル検証処理
                      return RepeatStatus.FINISHED;
                  }, transactionManager)
                  .build();
      }
  >     // タスクレットステップ例: ロック取得
      @Bean
      public Step lockAcquisitionStep() {
          return new StepBuilder("lockAcquisitionStep", jobRepository)
                  .tasklet((contribution, chunkContext) -> {
                      // ロック取得処理
                      return RepeatStatus.FINISHED;
                  }, transactionManager)
                  .build();
      }
  >     // チャンク型ステップ例: TRUNCATE処理
      @Bean
      public Step truncateStagingTablesStep() {
          return new StepBuilder("truncateStagingTablesStep", jobRepository)
                  .<List<Integer>, List<String>>chunk(1, transactionManager)
                  .reader(truncateReader())
                  .processor(truncateProcessor())
                  .writer(truncateWriter())
                  .build();
      }
  >     // チャンク型ステップ例: CSV取込
      @Bean
      public Step organizationCsvToStagingStep() {
          return new StepBuilder("organizationCsvToStagingStep", jobRepository)
                  .<OrganizationCsv, OrganizationCsv>chunk(1000, transactionManager)
                  .reader(organizationCsvReader())
                  .writer(organizationStagingWriter())
                  .build();
      }
  >     // タスクレットステップ例: 業務データ更新
      @Bean
      public Step businessDataUpdateStep() {
          return new StepBuilder("businessDataUpdateStep", jobRepository)
                  .tasklet((contribution, chunkContext) -> {
                      // 一括更新処理
                      return RepeatStatus.FINISHED;
                  }, transactionManager)
                  .build();
      }
  >     // タスクレットステップ例: 閾値チェック
      @Bean
      public Step thresholdCheckStep() {
          return new StepBuilder("thresholdCheckStep", jobRepository)
                  .tasklet((contribution, chunkContext) -> {
                      // 閾値チェック処理
                      return RepeatStatus.FINISHED;
                  }, transactionManager)
                  .build();
      }
  >     // コンポーネントBean定義
      @Bean
      public ItemReader<List<Integer>> truncateReader() {
          return new SimpleReader();
      }
  >     @Bean
      public ItemProcessor<List<Integer>, List<String>> truncateProcessor() {
          return new TruncateProcessor();
      }
  >     @Bean
      public ItemWriter<List<String>> truncateWriter() {
          return new TruncateWriter(jdbcTemplate);
      }
  >     @Bean
      public FlatFileItemReader<OrganizationCsv> organizationCsvReader() {
          // CSVリーダー実装
      }
  >     @Bean
      public JdbcBatchItemWriter<OrganizationCsv> organizationStagingWriter() {
          // ステージングライター実装
      }
  }

````
 > ### コンポーネント実装の詳細
 > **`SimpleReader` (変更なし)**:
```java
public class SimpleReader implements ItemReader<List<Integer>> {
    private boolean flg = true;
 >     @Override
    public List<Integer> read() {
        if (flg) {
            flg = false;
            return Collections.singletonList(0);
        }
        return null;
    }
}
````

> **`TruncateProcessor`**:

```java
public class TruncateProcessor implements ItemProcessor<List<Integer>, List<String>> {
    @Override
    public List<String> process(List<Integer> item) {
        // テーブルリストを返す
        return Arrays.asList(
            "STG_ORGANIZATION",
            "STG_DEPARTMENT",
            "STG_EMPLOYEE",
            "STG_AD",
            "STG_SHIFT"
        );
    }
}
```

> **`TruncateWriter`**:

```java
public class TruncateWriter implements ItemWriter<List<String>> {
    private final JdbcTemplate jdbcTemplate;
 >     public TruncateWriter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }
 >     @Override
    public void write(List<? extends List<String>> items) {
        items.forEach(tableList -> {
            for (String table : tableList) {
                jdbcTemplate.execute("TRUNCATE TABLE " + table);
            }
        });
    }
}
```

> ### ポイント

1. **TRUNCATE 処理のチャンク型実装**:
   - `SimpleReader`で処理開始をトリガー
   - `TruncateProcessor`で TRUNCATE 対象テーブルリストを生成
   - `TruncateWriter`で実際の TRUNCATE 実行
     > 2. **CSV 取込処理**:
   - チャンクサイズ 1000 で効率的なバッチ処理
   - `FlatFileItemReader`で CSV 読込
   - `JdbcBatchItemWriter`でバルク挿入
     > 3. **タスクレット処理**:
   - 単発の処理はラムダ式で簡潔に実装
   - 複雑な処理は別クラスで実装可能
     > ### ジョブフローの柔軟性

- ステップの追加・削除が容易
- 各ステップが独立しているため、処理の差し替えが簡単
- 並列処理が必要なステップは`Flow`を使用して実装可能
  > この設計により、チャンク型とタスクレットを効果的に組み合わせ、大規模データ処理と単発処理の両方に対応した堅牢なバッチシステムを構築できます。

## チャンク型とタスクレットの組み合わせ実装

Spring Batch ではチャンク型ステップとタスクレットステップを柔軟に組み合わせることができます。以下に、TRUNCATE 処理をチャンク型で実装し、他の処理をタスクレットで実装する完全な例を示します。

### ジョブ設定クラス (チャンク型とタスクレットの組み合わせ)

```java
package com.example.orgchart_api.batch.job;

import com.example.orgchart_api.batch.reader.SimpleReader;
import com.example.orgchart_api.batch.processor.TruncateProcessor;
import com.example.orgchart_api.batch.writer.TruncateWriter;
import com.example.orgchart_api.batch.util.BatchSettings;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.Step;
import org.springframework.batch.core.configuration.annotation.EnableBatchProcessing;
import org.springframework.batch.core.job.builder.JobBuilder;
import org.springframework.batch.core.repository.JobRepository;
import org.springframework.batch.core.step.builder.StepBuilder;
import org.springframework.batch.core.step.tasklet.Tasklet;
import org.springframework.batch.item.ItemProcessor;
import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.ItemWriter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.transaction.PlatformTransactionManager;

import javax.sql.DataSource;

@Configuration
@EnableBatchProcessing
public class HumanResourceJobConfig {

    private final JobRepository jobRepository;
    private final BatchSettings batchSettings;
    private final DataSource dataSource;
    private final PlatformTransactionManager transactionManager;
    private final JdbcTemplate jdbcTemplate;

    public HumanResourceJobConfig(
            JobRepository jobRepository,
            BatchSettings batchSettings,
            DataSource dataSource,
            PlatformTransactionManager transactionManager,
            JdbcTemplate jdbcTemplate) {
        this.jobRepository = jobRepository;
        this.batchSettings = batchSettings;
        this.dataSource = dataSource;
        this.transactionManager = transactionManager;
        this.jdbcTemplate = jdbcTemplate;
    }

    @Bean
    public Job humanResourceBatchJob() {
        return new JobBuilder("humanResourceBatchJob", jobRepository)
                .start(fileValidationStep())
                .next(lockAcquisitionStep())
                .next(truncateStagingTablesStep())     // チャンク型ステップ
                .next(organizationCsvToStagingStep())  // 別のチャンク型ステップ
                .next(businessDataUpdateStep())        // タスクレットステップ
                .next(thresholdCheckStep())            // タスクレットステップ
                .next(cleanupStep())                   // タスクレットステップ
                .build();
    }

    // タスクレットステップ: ファイル検証
    @Bean
    public Step fileValidationStep() {
        return new StepBuilder("fileValidationStep", jobRepository)
                .tasklet(fileValidationTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet fileValidationTasklet() {
        return (contribution, chunkContext) -> {
            System.out.println("ファイル検証処理を実行中...");
            // 実際のファイル検証ロジック
            return null;
        };
    }

    // タスクレットステップ: ロック取得
    @Bean
    public Step lockAcquisitionStep() {
        return new StepBuilder("lockAcquisitionStep", jobRepository)
                .tasklet(lockAcquisitionTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet lockAcquisitionTasklet() {
        return (contribution, chunkContext) -> {
            System.out.println("ロック取得処理を実行中...");
            // 実際のロック取得ロジック
            return null;
        };
    }

    // チャンク型ステップ: TRUNCATE処理
    @Bean
    public Step truncateStagingTablesStep() {
        return new StepBuilder("truncateStagingTablesStep", jobRepository)
                .<List<Integer>, List<String>>chunk(1, transactionManager)
                .reader(truncateReader())
                .processor(truncateProcessor())
                .writer(truncateWriter())
                .build();
    }

    // チャンク型ステップ: CSV取込
    @Bean
    public Step organizationCsvToStagingStep() {
        return new StepBuilder("organizationCsvToStagingStep", jobRepository)
                .<String, String>chunk(100, transactionManager)
                .reader(organizationCsvReader())
                .processor(organizationCsvProcessor())
                .writer(organizationCsvWriter())
                .build();
    }

    // タスクレットステップ: 業務データ更新
    @Bean
    public Step businessDataUpdateStep() {
        return new StepBuilder("businessDataUpdateStep", jobRepository)
                .tasklet(businessDataUpdateTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet businessDataUpdateTasklet() {
        return (contribution, chunkContext) -> {
            System.out.println("業務データ更新処理を実行中...");
            jdbcTemplate.execute("UPDATE BIZ_ORGANIZATION SET ...");
            return null;
        };
    }

    // タスクレットステップ: 閾値チェック
    @Bean
    public Step thresholdCheckStep() {
        return new StepBuilder("thresholdCheckStep", jobRepository)
                .tasklet(thresholdCheckTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet thresholdCheckTasklet() {
        return (contribution, chunkContext) -> {
            System.out.println("閾値チェック処理を実行中...");
            // 実際の閾値チェックロジック
            return null;
        };
    }

    // タスクレットステップ: クリーンアップ
    @Bean
    public Step cleanupStep() {
        return new StepBuilder("cleanupStep", jobRepository)
                .tasklet(cleanupTasklet(), transactionManager)
                .build();
    }

    @Bean
    public Tasklet cleanupTasklet() {
        return (contribution, chunkContext) -> {
            System.out.println("クリーンアップ処理を実行中...");
            // 実際のクリーンアップロジック
            return null;
        };
    }

    // チャンク型コンポーネント
    @Bean
    public ItemReader<List<Integer>> truncateReader() {
        return new SimpleReader();
    }

    @Bean
    public ItemProcessor<List<Integer>, List<String>> truncateProcessor() {
        return new TruncateProcessor();
    }

    @Bean
    public ItemWriter<List<String>> truncateWriter() {
        return new TruncateWriter(jdbcTemplate);
    }

    @Bean
    public ItemReader<String> organizationCsvReader() {
        // CSV読み込み用のリーダー実装
        return () -> "CSVデータ"; // 簡易実装
    }

    @Bean
    public ItemProcessor<String, String> organizationCsvProcessor() {
        return item -> {
            System.out.println("CSVデータ処理中: " + item);
            return item;
        };
    }

    @Bean
    public ItemWriter<String> organizationCsvWriter() {
        return items -> {
            System.out.println("CSVデータ書き込み: " + items);
            // 実際の書き込みロジック
        };
    }
}
```

### コンポーネント実装の改良版

**`TruncateProcessor` の改良**:

```java
package com.example.orgchart_api.batch.processor;

import org.springframework.batch.item.ItemProcessor;

import java.util.Arrays;
import java.util.List;

public class TruncateProcessor implements ItemProcessor<List<Integer>, List<String>> {

    @Override
    public List<String> process(List<Integer> item) {
        System.out.println("TRUNCATE前の準備処理を実行中...");
        // 実際の処理: テーブルリストを返す
        return Arrays.asList(
            "STG_ORGANIZATION",
            "STG_DEPARTMENT",
            "STG_EMPLOYEE",
            "STG_AD",
            "STG_SHIFT"
        );
    }
}
```

**`TruncateWriter` の改良**:

```java
package com.example.orgchart_api.batch.writer;

import org.springframework.batch.item.ItemWriter;
import org.springframework.jdbc.core.JdbcTemplate;

import java.util.List;

public class TruncateWriter implements ItemWriter<List<String>> {

    private final JdbcTemplate jdbcTemplate;

    public TruncateWriter(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void write(List<? extends List<String>> items) throws Exception {
        for (List<String> tableList : items) {
            for (String table : tableList) {
                System.out.println("TRUNCATE TABLE " + table);
                jdbcTemplate.execute("TRUNCATE TABLE " + table);
            }
        }
    }
}
```

### ジョブ実行フローの説明

1. **タスクレットステップ**:

   - `fileValidationStep`: ファイル存在チェック
   - `lockAcquisitionStep`: ロック取得処理
   - `businessDataUpdateStep`: 業務データ更新
   - `thresholdCheckStep`: 閾値チェック
   - `cleanupStep`: 後処理

2. **チャンク型ステップ**:
   - `truncateStagingTablesStep`: TRUNCATE 処理（チャンクサイズ 1）
   - `organizationCsvToStagingStep`: CSV 取込処理（チャンクサイズ 100）

### 組み合わせのメリット

1. **適材適所の処理実装**:

   - 単発処理 → タスクレット
   - データ処理 → チャンク型

2. **トランザクション管理**:

   - チャンク型: チャンク単位でトランザクション管理
   - タスクレット: ステップ全体で 1 トランザクション

3. **柔軟なジョブ設計**:

   ```java
   @Bean
   public Job humanResourceBatchJob() {
       return new JobBuilder("humanResourceBatchJob", jobRepository)
           .start(fileValidationStep())
           .next(lockAcquisitionStep())
           .next(truncateStagingTablesStep())  // チャンク型
           .next(organizationCsvToStagingStep()) // チャンク型
           .next(departmentCsvToStagingStep())  // 別のチャンク型ステップ
           .next(businessDataUpdateStep())      // タスクレット
           .next(thresholdCheckStep())          // タスクレット
           .next(cleanupStep())                 // タスクレット
           .build();
   }
   ```

4. **パフォーマンス最適化**:
   - チャンクサイズの調整でパフォーマンスチューニング可能
   - 大規模データ処理はチャンク型、小規模処理はタスクレットで効率化

### 重要なポイント

1. **依存性注入**:

   - タスクレット内で JdbcTemplate を使用する場合はコンストラクタで注入
   - チャンク型コンポーネントも同様

2. **トランザクション境界**:

   - チャンク型ステップでは`chunk()`メソッドでトランザクションマネージャを指定
   - タスクレットステップでは`tasklet()`メソッドでトランザクションマネージャを指定

3. **エラーハンドリング**:
   - チャンク型: `faultTolerant()`でスキップ/リトライ設定
   - タスクレット: タスクレット内で例外処理

この設計により、Spring Batch の強力な機能を最大限に活用しつつ、複雑なバッチ処理を効率的に実装できます。チャンク型とタスクレットを適切に組み合わせることで、可読性が高く保守しやすいバッチジョブを作成できます。
