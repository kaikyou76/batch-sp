# 非同期エラー発生

java.lang.IllegalArgumentException: Invalid return type for async method (only Future and void supported): class org.springframework.http.ResponseEntity

## ❌ 問題の原因

`@Async` がクラスレベルに付与されており、**非同期メソッドが `ResponseEntity` を返している**ことが問題です。

Spring の `@Async` は、デフォルトで以下の戻り値型のみをサポートします：

- `void`
- `Future`, `CompletableFuture`

したがって、以下のようなエラーが発生しています：

```
java.lang.IllegalArgumentException: Invalid return type for async method (only Future and void supported): class org.springframework.http.ResponseEntity
```

---

## ✅ 対応策

### ✨ 修正方針

1. **コントローラークラスから `@Async` 削除**
   - コントローラー層での非同期処理は推奨されません。
2. **バッチ実行ロジックを Service 層に移動し、非同期化する**
   - Spring Batch 実行処理を Service レイヤーで `@Async` 付きメソッドとして分離
3. **Service 側で非同期実行 + 例外ハンドリングを委譲**

---

## 🛠 修正コード一覧

### ✅ 1. [BatchJobController.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\BatchJobController.java)（修正版）

```java|CODE_EDIT_BLOCK|d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\BatchJobController.java
// ... existing code ...
package com.example.orgchart_api.controller;

import com.example.orgchart_api.service.BatchJobService;
import org.springframework.batch.core.*;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/batch")
public class BatchJobController {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job humanResourceBatchJob;

    @Autowired
    private JobExplorer jobExplorer;

    @Autowired
    private BatchJobService batchJobService; // サービス層注入

    @PostMapping("/run-human-resource-job")
    public ResponseEntity<Map<String, Object>> runHumanResourceJob() {
        try {
            Map<String, Object> response = batchJobService.runHumanResourceJob();
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            Map<String, Object> errorResponse = Map.of(
                    "status", "error",
                    "message", "ジョブの実行に失敗しました: " + e.getMessage()
            );
            return ResponseEntity.status(500).body(errorResponse);
        }
    }

    @GetMapping("/status/{jobId}")
    public ResponseEntity<Map<String, Object>> getJobStatus(@PathVariable Long jobId) {
        try {
            JobInstance jobInstance = jobExplorer.getJobInstance(jobId);
            if (jobInstance == null) {
                return ResponseEntity.status(404).body(Map.of(
                        "status", "not_found",
                        "message", "指定されたジョブIDは存在しません"
                ));
            }

            JobExecution jobExecution = jobExplorer.getLastJobExecution(jobInstance);
            if (jobExecution == null) {
                return ResponseEntity.status(404).body(Map.of(
                        "status", "no_execution",
                        "message", "このジョブには実行情報がありません"
                ));
            }

            String message;
            switch (jobExecution.getStatus()) {
                case STARTED:
                    message = "ジョブは現在実行中です";
                    break;
                case COMPLETED:
                    message = "ジョブは正常に完了しました";
                    break;
                case FAILED:
                    message = "ジョブはエラーで終了しました: " +
                            jobExecution.getFailureExceptions().stream()
                                    .map(Throwable::getMessage)
                                    .findFirst()
                                    .orElse("不明なエラー");
                    break;
                default:
                    message = "その他のステータス: " + jobExecution.getStatus();
            }

            return ResponseEntity.ok(Map.of(
                    "status", jobExecution.getStatus().toString(),
                    "message", message
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "critical",
                    "message", "ステータス取得中にシステムエラーが発生しました"
            ));
        }
    }

    @GetMapping("/logs/{jobId}")
    public ResponseEntity<List<String>> getJobLogs(@PathVariable Long jobId) {
        try {
            JobInstance jobInstance = jobExplorer.getJobInstance(jobId);
            if (jobInstance == null) {
                return ResponseEntity.notFound().build();
            }

            List<JobExecution> executions = jobExplorer.getJobExecutions(jobInstance);
            if (executions.isEmpty()) {
                return ResponseEntity.noContent().build();
            }

            JobExecution latest = executions.get(0);
            List<String> logLines = latest.getAllFailureExceptions().stream()
                    .map(Throwable::getMessage)
                    .collect(Collectors.toList());

            return ResponseEntity.ok(logLines);

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Collections.emptyList());
        }
    }
}
```

---

### ✅ 2. 新規作成：`BatchJobService.java`

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.controller.BatchJobController;
import org.springframework.batch.core.*;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.util.Map;
import java.util.HashMap;

@Service
public class BatchJobService {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job humanResourceBatchJob;

    @Async
    public Map<String, Object> runHumanResourceJob() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters();

            JobExecution jobExecution = jobLauncher.run(humanResourceBatchJob, jobParameters);

            return Map.of(
                    "status", "success",
                    "jobId", jobExecution.getJobId(),
                    "message", "ジョブが正常に開始されました"
            );

        } catch (Exception e) {
            return Map.of(
                    "status", "error",
                    "message", "ジョブの実行に失敗しました: " + e.getMessage()
            );
        }
    }
}
```

---

### ✅ 3. Spring Configuration に `@EnableAsync` を追加（必要であれば）

`OrgchartApiApplication.java` または `BatchConfig.java` などに以下を追加：

```java
@EnableAsync
@SpringBootApplication
public class OrgchartApiApplication { ... }
```

---

## 📌 理由と設計原則

| 修正内容                        | 理由                                                                                                                          |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| `@Async` を Controller から削除 | コントローラー層は HTTP リクエストを受け取り、レスポンスを返すのが責務。非同期制御はサービス層に委譲するのが SOLID 原則に沿う |
| 非同期処理を Service 層へ移動   | 本来の業務ロジックの実装場所であり、非同期処理も安全に適用可能                                                                |
| `@EnableAsync` の追加           | Spring の非同期処理を有効にするために必須                                                                                     |

---

## ✅ 次のステップ

- [x] 上記修正を反映してください。
- [x] 再ビルドして、再度テストを行います。
- [ ] 成功すれば、次回以降は WebSocket / SSE 導入やログ出力拡張も可能です。

---

何か他にも Spring Boot / Spring Batch の不整合や挙動不安があれば、即座に対応いたします。  
引き続きよろしくお願いいたします！
