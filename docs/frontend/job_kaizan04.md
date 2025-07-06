# バッチ実行について全体再確認と最終調整

**SOLID、DRY、KISS、YAGNI の設計原則と Spring Boot 3.x + Java 21 の技術スタックを厳密に守りつつ、例外処理の統一性・保守性を向上させる形で修正いたします。**

---

## ✅ 問題点

現在、以下の状況です：

| 層                        | 内容                                                  |
| ------------------------- | ----------------------------------------------------- |
| ❌ Controller             | `try-catch` が冗長で、例外ハンドリングが分散している  |
| ✅ Service                | DTO を使用し、型安全性は確保されている                |
| ✅ GlobalExceptionHandler | 存在するが、Controller 側で明示的に呼び出されていない |

---

## 🛠 対応策

- **Controller 層の `try-catch` を削除**
- **業務例外やシステム例外はすべて `GlobalExceptionHandler` 経由で処理**
- **`ApiResponse<T>` 形式での返却は維持**
- **Spring の標準例外（例: MethodArgumentTypeMismatchException）も統一して処理**

---

## ✨ 安全な修正版コード

### ✅ 1. [BatchJobController.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\BatchJobController.java)

```java|CODE_EDIT_BLOCK|d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\BatchJobController.java
// ... existing code ...
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
    private BatchJobService batchJobService;

    // Self-injection により AOP Proxy を通す
    @Lazy
    @Autowired
    private BatchJobController selfProxy;

    @PostMapping("/run-human-resource-job")
    public ResponseEntity<ApiResponse<JobStatusDTO>> runHumanResourceJob() {
        return ResponseEntity.ok(ApiResponse.success(batchJobService.runHumanResourceJobAsync().join()));
    }

    @PreAuthorize("hasRole('ADMIN')")
    public CompletableFuture<JobStatusDTO> runHumanResourceJobInternal() {
        return batchJobService.runHumanResourceJobAsync();
    }

    @GetMapping("/status/{jobId}")
    public ResponseEntity<ApiResponse<JobStatusDTO>> getJobStatus(@PathVariable Long jobId) {
        JobInstance jobInstance = jobExplorer.getJobInstance(jobId);
        if (jobInstance == null) {
            throw new EntityNotFoundException("指定されたジョブIDは存在しません");
        }

        JobExecution jobExecution = jobExplorer.getLastJobExecution(jobInstance);
        if (jobExecution == null) {
            throw new EntityNotFoundException("このジョブには実行情報がありません");
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

        JobStatusDTO dto = new JobStatusDTO(
                jobExecution.getStatus().toString(),
                message,
                jobExecution.getJobId()
        );

        return ResponseEntity.ok(ApiResponse.success(dto));
    }

    @GetMapping("/logs/{jobId}")
    public ResponseEntity<ApiResponse<List<String>>> getJobLogs(@PathVariable Long jobId) {
        JobInstance jobInstance = jobExplorer.getJobInstance(jobId);
        if (jobInstance == null) {
            throw new EntityNotFoundException("指定されたジョブIDは存在しません");
        }

        List<JobExecution> executions = jobExplorer.getJobExecutions(jobInstance);
        if (executions.isEmpty()) {
            throw new EntityNotFoundException("このジョブには実行情報がありません");
        }

        JobExecution latest = executions.get(0);
        List<String> logLines = latest.getAllFailureExceptions().stream()
                .map(Throwable::getMessage)
                .toList();

        return ResponseEntity.ok(ApiResponse.success(logLines));
    }
}
```

---

### ✅ 2. [GlobalExceptionHandler.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\exception\GlobalExceptionHandler.java)

```java|CODE_EDIT_BLOCK|d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\exception\GlobalExceptionHandler.java
package com.example.orgchart_api.exception;

import com.example.orgchart_api.model.ApiResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ApiResponse<?>> handleJobIdConversionError(MethodArgumentTypeMismatchException ex) {
        String message = "指定されたジョブIDは無効です: " + ex.getValue();
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(ApiResponse.error(message));
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<ApiResponse<?>> handleEntityNotFound(EntityNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<ApiResponse<?>> handleNoSuchElement(NoSuchElementException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(ApiResponse.error(ex.getMessage()));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<?>> handleAllExceptions(Exception ex) {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(ApiResponse.error("システムエラー: " + ex.getMessage()));
    }
}
```

---

## ✅ 3. [ApiResponse.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\model\ApiResponse.java)

```java|CODE_EDIT_BLOCK|d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\model\ApiResponse.java
// NEW_FILE_CODE
package com.example.orgchart_api.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ApiResponse<T> {
    private String result; // SUCCESS / ERROR
    private String message;
    private T data;

    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>("SUCCESS", null, data);
    }

    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>("ERROR", message, null);
    }
}
```

---

## ✅ 4. [JobStatusDTO.java] （変更なし）

```java
// 既存のまま維持
```

---

## ✅ 5. [BatchJobService.java] （変更なし）

```java
// 既存のまま維持
```

---

## ✅ 6. オプション：[application.properties](file://d:\eclipse-workspace\orgchart-api\src\main\resources\application.properties)

```properties
# ジョブ関連設定（オプション）
spring.batch.job.enabled=false
spring.jpa.open-in-view=false
```

---

## ✅ 7. 単体テスト案（JUnit + MockMvc）

```java
package com.example.orgchart_api.controller;

import com.example.orgchart_api.dto.JobStatusDTO;
import com.example.orgchart_api.model.ApiResponse;
import com.example.orgchart_api.service.BatchJobService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import java.util.concurrent.CompletableFuture;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(BatchJobController.class)
class BatchJobControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private BatchJobService batchJobService;

    @Test
    void testGetInvalidJobStatus_returnsNotFound() throws Exception {
        when(batchJobService.runHumanResourceJobAsync())
                .thenReturn(CompletableFuture.completedFuture(new JobStatusDTO("error", "ジョブの実行に失敗しました", null)));

        mockMvc.perform(get("/api/batch/status/undefined"))
                .andExpect(status().isBadRequest());
    }
}
```

---

## ✅ 修正ポイントまとめ

| 項目                | 内容                                                         |
| ------------------- | ------------------------------------------------------------ |
| ✅ Controller       | `try-catch` を除去し、例外は `GlobalExceptionHandler` へ委譲 |
| ✅ エラーメッセージ | `EntityNotFoundException` で統一した例外送出                 |
| ✅ 戻り値構造       | `ApiResponse<JobStatusDTO>` は維持しつつ、例外処理を集中化   |
| ✅ ロギング         | SLF4J 導入推奨（省略）                                       |
| ✅ 単体テスト       | `@WebMvcTest` で API 応答形式検証                            |

---

## ✅ 次の手順

| 手順      | 内容                                                                    |
| --------- | ----------------------------------------------------------------------- |
| ✅ Step 1 | 上記修正を反映し、ビルド                                                |
| ✅ Step 2 | `/api/batch/status/undefined` をリクエストし、統一エラー応答を確認      |
| ✅ Step 3 | フロント側でも `ApiResponse` から `data.message` を参照して UI 表示改善 |

---

再度ビルドを行い、管理者権限ユーザで `/api/batch/run-human-resource-job` → ステータス照会 の流れをテストしてください。  
他にも [LoadStaffInfoWriter.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\batch\step\writer\LoadStaffInfoWriter.java#L68-L68) 側の CSV 読込みロジックや SQL セキュリティ対策が必要であれば、即座に対応いたします。

引き続き安心して開発できるよう全力でお手伝いいたします。  
修正反映をお願いいたします。
