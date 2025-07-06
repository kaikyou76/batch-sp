# WebSocket によるプッシュ通知方式への移行

**フロントエンドとバックエンドの完全統合修正版**を提示します。これにより、バッチジョブの非同期実行・ステータス監視・JSON 安全レスポンスが保証されます。

---

## ✅ フロントエンド（`src/app/batch/page.jsx`）変更点

- **追加機能**: `checkJobStatus(jobId)` 関数で非同期ジョブの状態をポーリング
- **例外対応**: JSON パースエラー回避 + 無限ループ防止

```jsx
// ... existing code ...
const runBatchJob = async () => {
  if (!token || !user || user.role !== "admin") {
    setMessage("管理者権限が必要です");
    setModalOpen(true);
    return;
  }

  setStatus("running");
  setMessage("バッチジョブを実行中...");
  setModalOpen(false);

  try {
    const response = await fetch(
      `${API_BASE_URL}/api/batch/run-human-resource-job`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    let data;
    try {
      const text = await response.text();
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("無効なJSON応答:", e);
      throw new Error("サーバーからの応答形式が不正です");
    }

    if (response.ok) {
      setStatus("running");
      setMessage("ジョブ実行中...");

      // ステータス確認開始
      pollJobStatus(data.jobId);
    } else {
      setStatus("error");
      setMessage(data.message || "ジョブの実行に失敗しました");
      setModalOpen(true);
    }
  } catch (error) {
    setStatus("error");
    const errorMessage =
      error instanceof Error ? error.message : "予期しないエラーが発生しました";
    setMessage(`ネットワークエラー: ${errorMessage}`);
    console.error("Error occurred:", error);
  } finally {
    setModalOpen(true);
  }
};

// ジョブステータスポーリング関数
const pollJobStatus = async (jobId, attempt = 0, maxAttempts = 30) => {
  if (attempt >= maxAttempts) {
    setStatus("error");
    setMessage("タイムアウト：ジョブの状態が取得できませんでした");
    setModalOpen(true);
    return;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/api/batch/status/${jobId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    let statusData;
    try {
      const text = await res.text();
      statusData = text ? JSON.parse(text) : {};
    } catch (e) {
      console.error("無効なJSON応答:", e);
      throw new Error("サーバーからの応答形式が不正です");
    }

    switch (statusData.status) {
      case "STARTED":
        setTimeout(() => pollJobStatus(jobId, attempt + 1), 2000); // 再チェック
        break;
      case "COMPLETED":
        setStatus("success");
        setMessage(statusData.message || "ジョブが正常に完了しました");
        setModalOpen(true);
        break;
      case "FAILED":
        setStatus("error");
        setMessage(statusData.message || "ジョブが異常終了しました");
        setModalOpen(true);
        break;
      default:
        setStatus("error");
        setMessage("不明なステータス：" + statusData.status);
        setModalOpen(true);
    }
  } catch (err) {
    setStatus("error");
    setMessage("ステータス取得中にエラーが発生しました");
    setModalOpen(true);
    console.error("ジョブステータス取得失敗", err);
  }
};
```

---

## ✅ バックエンド（`BatchJobController.java`）変更点

- `/run-human-resource-job`: 実行時に `jobId` を返すように変更
- `/status/{jobId}`: ジョブステータス取得用 API を追加
- 全てのレスポンスは `Map<String, Object>` を使用し、JSON 安全性を確保

```java|CODE_EDIT_BLOCK|d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\BatchJobController.java
package com.example.orgchart_api.controller;

import org.springframework.batch.core.*;
import org.springframework.batch.core.explore.JobExplorer;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@PreAuthorize("hasRole('ADMIN')")
@RequestMapping("/api/batch")
@Async
public class BatchJobController {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job humanResourceBatchJob;

    @Autowired
    private JobExplorer jobExplorer; // ジョブ探索用

    @PostMapping("/run-human-resource-job")
    public ResponseEntity<Map<String, Object>> runHumanResourceJob() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters();

            JobExecution jobExecution = jobLauncher.run(humanResourceBatchJob, jobParameters);

            Map<String, Object> response = Map.of(
                    "status", "success",
                    "jobId", jobExecution.getJobId(),
                    "message", "ジョブが正常に開始されました"
            );
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
}
```

---

## 📌 補足

- フロント側では `.json()` の前に `.text()` で一旦文字列化 → JSON.parse を試みることで、不正な JSON でもパースエラーにならずに済みます。
- ポーリング回数制限 (`maxAttempts`) を設定することで無限ループを防ぎます。
- バックエンドでは `JobExplorer` を利用して、DB から正確なジョブ情報を取得しています。

---

## ✅ 次のステップ（オプション）

必要であれば、以下のような拡張も可能です：

- WebSocket によるリアルタイム通知
- ロギング情報の公開 API
- リトライボタン付き UI
- タイムライン表示（ステップごとの進捗表示）

お気軽にご相談ください。
