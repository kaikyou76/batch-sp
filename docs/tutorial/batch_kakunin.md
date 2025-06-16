## バッチ実装の雛形が一応出来上がったので、挙動確認しながら実装していきます。

### 読込みフェイルの準備

```
C:\batch\files\importfiles
ad.csv
department.csv
employee.csv
EOFAD
EOFAM
organization.csv
shit.csv
```

# IntelliJ で Spring Batch ジョブを実行する方法

この Spring Batch ジョブを IntelliJ で実行するには、以下の手順に従ってください。

## 前提条件

- IntelliJ IDEA がインストールされていること
- プロジェクトが正しく設定されていること（Maven/Gradle 依存関係が解決されている）
- 必要なデータベース設定が完了していること

## 実行手順

IntelliJ IDEA で Spring Batch ジョブを実行するための具体的な手順を説明します。特に、コマンドライン引数で特定のジョブを実行する方法に焦点を当てます。

## 方法 1: メインクラスから直接実行（簡単な方法）

1. `@SpringBootApplication`が付いたメインクラス（例: `OrgchartApiApplication.java`）を開く
2. クラス内の`main`メソッドを右クリック
3. 表示されるコンテキストメニューから:
   - 通常実行: 「Run 'OrgchartApiApplication.main()'」を選択
   - デバッグ実行: 「Debug 'OrgchartApiApplication.main()'」を選択

## 方法 2: コマンドライン引数で特定のジョブを実行（詳細設定）

### 実行構成の編集手順

1. **実行構成の作成/編集**:

   - IntelliJ の上部ツールバーにある実行構成ドロップダウン（通常は緑色の実行ボタンの左側）をクリック
   - 「Edit Configurations...」を選択
     > **もしくは**
   - メニューから「Run」→「Edit Configurations...」

2. **新しい構成の追加**:

   - 左ペインの「+」ボタンをクリック
   - 「Spring Boot」を選択

3. **基本設定の入力**:

   - **Name**: 任意の名前（例: "Run HumanResource Batch Job"）
   - **Main class**: メインアプリケーションクラスを指定（例: `com.example.orgchart_api.OrgchartApiApplication`）

4. **プログラム引数の追加**:

- **Modify options**: ドロップダウンをクリックして「Add Run Options」ダイアログを開きます。

- 「Java」タブ内の「Program arguments」フィールドをクリックします。
  ![alt text](image-14.png)
- 新しく表示された「Program arguments」フィールドに以下を入力

```
--spring.batch.job.names=humanResourceBatchJob
```

![alt text](image-15.png)

- 複数のジョブを指定する場合はカンマ区切り:

```
--spring.batch.job.names=humanResourceBatchJob,anotherJobName
```

5. **オプション設定（必要に応じて）**:

   - 「VM Options」: メモリ設定など（例: `-Xmx512m`）
   - 「Environment variables」: 環境変数を設定
   - 「Working directory」: プロジェクトルートを指定

6. **構成の保存と実行**:
   - 「Apply」→「OK」をクリック
   - 実行構成ドロップダウンから新しく作成した構成を選択
   - 緑色の実行ボタン（またはデバッグボタン）をクリック

## 補足情報

- **プロファイルを指定する場合**:

  ```
  --spring.batch.job.names=humanResourceBatchJob --spring.profiles.active=dev
  ```

- **ジョブパラメータを渡す場合**:

  ```
  --spring.batch.job.names=humanResourceBatchJob jobParam1=value1 jobParam2=value2
  ```

- **デバッグ時のヒント**:
  - ブレークポイントを設定したい場合は、`Debug`モードで実行
  - Spring Batch のメタデータテーブルが作成されていることを確認

この設定で、指定した`humanResourceBatchJob`がアプリケーション起動時に自動実行されます。ジョブが正常に実行されない場合は、ログを確認して設定を見直してください。

### 3. テストクラスから実行

1. テストクラスを作成（例）:

```java
@SpringBootTest
@RunWith(SpringRunner.class)
public class HumanResourceJobTest {

    @Autowired
    private JobLauncherTestUtils jobLauncherTestUtils;

    @Test
    public void testHumanResourceBatchJob() throws Exception {
        JobExecution jobExecution = jobLauncherTestUtils.launchJob();
        assertEquals(BatchStatus.COMPLETED, jobExecution.getStatus());
    }
}
```

2. テストを右クリックして実行

## 4. REST API エンドポイントから実行 (Spring Batch Admin スタイル)

Spring Boot アプリケーションに REST API を追加してジョブを実行する方法:

1. まず、`JobLauncher`と`JobExplorer`を注入するコントローラーを作成します:

```java
@RestController
@RequestMapping("/api/batch")
public class BatchJobController {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private JobExplorer jobExplorer;

    @Autowired
    @Qualifier("humanResourceBatchJob")
    private Job humanResourceBatchJob;

    @PostMapping("/run/human-resource")
    public ResponseEntity<String> runHumanResourceJob() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("time", System.currentTimeMillis())
                    .toJobParameters();

            JobExecution jobExecution = jobLauncher.run(humanResourceBatchJob, jobParameters);

            return ResponseEntity.ok("Job started with ID: " + jobExecution.getId());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Job failed to start: " + e.getMessage());
        }
    }

    @GetMapping("/status/{executionId}")
    public ResponseEntity<JobExecution> getJobStatus(@PathVariable Long executionId) {
        JobExecution jobExecution = jobExplorer.getJobExecution(executionId);
        if (jobExecution != null) {
            return ResponseEntity.ok(jobExecution);
        }
        return ResponseEntity.notFound().build();
    }
}
```

2. このコントローラーを追加したら、以下の方法でジョブを実行できます:
   - POST リクエストで `/api/batch/run/human-resource` を呼び出す
   - 実行 ID を使って `/api/batch/status/{executionId}` でステータスを確認

## 5. IntelliJ の Spring Boot 実行構成で直接実行

1. IntelliJ の右上にある実行構成ドロップダウンから「Edit Configurations...」を選択
2. 新しい「Spring Boot」構成を追加
3. メインクラスを指定
4. 「Program arguments」に以下を追加:
   ```
   --spring.batch.job.enabled=true --spring.batch.job.names=humanResourceBatchJob
   ```
5. 実行ボタンをクリック

## 6. スケジュール実行 (Spring Scheduler を使用)

定期的にジョブを実行する場合は、`@Scheduled`アノテーションを使用できます:

```java
@Configuration
@EnableScheduling
public class BatchSchedulerConfig {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job humanResourceBatchJob;

    @Scheduled(cron = "0 0 2 * * ?") // 毎日午前2時に実行
    public void scheduleHumanResourceJob() throws Exception {
        JobParameters jobParameters = new JobParametersBuilder()
                .addLong("time", System.currentTimeMillis())
                .toJobParameters();

        jobLauncher.run(humanResourceBatchJob, jobParameters);
    }
}
```

## 注意事項

1. データベース接続が正しく設定されていることを確認してください
2. Spring Batch のメタデータテーブルが作成されていることを確認
3. ジョブを再実行する場合は、新しい JobParameters が必要です（特に`time`パラメータ）
4. 本番環境ではジョブの同時実行制御を検討してください

どの方法を選択するかは、アプリケーションの要件と実行環境に依存します。開発中は IntelliJ から直接実行する方法が簡単で、本番環境では REST API やスケジューラーを使用するのが一般的です。
