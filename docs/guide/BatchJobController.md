# BatchJobController

### (src/main/java/com/example/orgchart_api/controller/BatchJobController.java)

```java
package com.example.orgchart_api.controller;

import com.example.orgchart_api.security.TokenHandler;
import com.example.orgchart_api.security.TokenValidateType;
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.JobParametersInvalidException;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
import org.springframework.batch.core.repository.JobRestartException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/batch")
public class BatchJobController {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job humanResourceBatchJob;

    @TokenHandler(
            save = true,
            validate = TokenValidateType.REMOVE,
            handleError = true
    )
    @PostMapping("/run-human-resource-job")
    public ResponseEntity<String> runHumanResourceJob(
            @RequestParam("_RequestVerificationToken") String token) {

        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters();

            jobLauncher.run(humanResourceBatchJob, jobParameters);

            return ResponseEntity.accepted().body("ジョブが開始されました");
        } catch (JobExecutionAlreadyRunningException | JobRestartException |
                 JobInstanceAlreadyCompleteException | JobParametersInvalidException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ジョブの実行に失敗しました: " + e.getMessage());
        }
    }
}

```

このコードは、Spring Batch を使用してバッチジョブを実行するための REST API コントローラークラスです。以下に詳細な解説をします。

### クラスの概要

- `BatchJobController`は、`/api/batch`パスでマッピングされた REST API コントローラーです。
- Spring Batch のジョブを起動するためのエンドポイントを提供します。

### 主要なコンポーネント

1. **`@Autowired` 依存性注入**

   - `JobLauncher`: Spring Batch ジョブを起動するためのインターフェース
   - `Job` (`humanResourceBatchJob`): 実行する具体的なバッチジョブ（ここでは人事関連のジョブ）

2. **`@TokenHandler` カスタムアノテーション**

   - トークン処理を行うためのカスタムアノテーション
   - パラメータ:
     - `save = true`: トークンを保存
     - `validate = TokenValidateType.REMOVE`: トークンを検証後に削除
     - `handleError = true`: エラーをハンドリング

3. **`runHumanResourceJob` メソッド**
   - POST リクエストで`/run-human-resource-job`にマッピング
   - リクエストパラメータから`_RequestVerificationToken`を受け取る
   - ジョブを非同期的に起動し、結果を返す

### ジョブ実行の流れ

1. ジョブパラメータを作成（タイムスタンプを追加）

   ```java
   JobParameters jobParameters = new JobParametersBuilder()
           .addLong("timestamp", System.currentTimeMillis())
           .toJobParameters();
   ```

2. `JobLauncher`でジョブを実行

   ```java
   jobLauncher.run(humanResourceBatchJob, jobParameters);
   ```

3. レスポンスを返す
   - 成功: 202 Accepted（ジョブ開始メッセージ）
   - 失敗: 500 Internal Server Error（エラーメッセージ）

### 例外処理

以下の Spring Batch 固有の例外をキャッチ:

- `JobExecutionAlreadyRunningException`: ジョブが既に実行中
- `JobRestartException`: ジョブの再起動ができない
- `JobInstanceAlreadyCompleteException`: 完了済みのジョブインスタンス
- `JobParametersInvalidException`: 無効なジョブパラメータ

### セキュリティ

- `@TokenHandler`アノテーションにより、CSRF 対策トークンの検証を行っています
- トークンはリクエストごとに検証され、使用後は削除されます

### 使用例

```bash
POST /api/batch/run-human-resource-job?_RequestVerificationToken=your_token
```

この API は、人事関連のバッチ処理を起動するために使用され、非同期でジョブを実行し、即座にレスポンスを返します。ジョブの実際の進捗や結果は別途確認する必要があります。
