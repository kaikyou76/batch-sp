## 外部の React+Next.js サイトから job 実行について(草案 01)

#### 已深度思考

> 現在、Spring Batch ジョブを実行しているのは、コマンドラインから直接 JAR を実行する方法です。このジョブを外部の React+Next.js サイトから実行可能にするためには、バックエンド API を介してジョブを起動する仕組みが必要です。
>
> ### 実現方法

1. **Spring Boot Actuator を利用する**
   - `spring-boot-starter-actuator`を依存関係に追加
   - `/actuator/jobs` エンドポイントを有効化
   - ジョブを起動するためのカスタムエンドポイントを作成
     > 2. **REST API エンドポイントの作成**
   - ジョブを起動するためのコントローラを作成
   - 非同期でジョブを実行し、即時応答を返す
     > ### ステップバイステップ
     >
     > #### 1. 依存関係の追加 (pom.xml)

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-actuator</artifactId>
</dependency>
```

> #### 2. ジョブ起動用のコントローラ作成

```java
import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
 > @RestController
@RequestMapping("/api/jobs")
public class JobLauncherController {
 >     @Autowired
    private JobLauncher jobLauncher;
 >     @Autowired
    private Job humanResourceBatchJob;
 >     @PostMapping("/runHumanResourceJob")
    public String runHumanResourceJob() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(humanResourceBatchJob, jobParameters);
            return "Job started successfully";
        } catch (Exception e) {
            return "Job failed to start: " + e.getMessage();
        }
    }
}
```

> #### 3. アプリケーションプロパティの設定 (application-dev.properties)

```properties
# Actuatorエンドポイント有効化
management.endpoints.web.exposure.include=*
```

> #### 4. 非同期実行の設定（オプション）
>
> デフォルトの`TaskExecutor`を設定することで非同期実行可能

```java
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.task.TaskExecutor;
import org.springframework.scheduling.concurrent.ThreadPoolTaskExecutor;
 > @Configuration
public class BatchConfig {
 >     @Bean
    public TaskExecutor taskExecutor() {
        ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
        executor.setCorePoolSize(5);
        executor.setMaxPoolSize(10);
        executor.setQueueCapacity(25);
        return executor;
    }
}
```

> #### 5. React+Next.js からの呼び出し例

```javascript
// Reactコンポーネント内
const runBatchJob = async () => {
  try {
    const response = await fetch('http://localhost:8080/api/jobs/runHumanResourceJob', {
      method: 'POST'
    });
    const result = await response.text();
    console.log(result);
  } catch (error) {
    console.error('Error starting job:', error);
  }
};
 > // ボタンクリックで実行
<button onClick={runBatchJob}>Run Batch Job</button>
```

> ### セキュリティ対策

- ジョブ起動 API は認証・認可を追加する
- Spring Security を導入して API を保護

```java
import org.springframework.context.annotation.Bean;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.web.SecurityFilterChain;
 > @EnableWebSecurity
public class SecurityConfig {
 >     @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeRequests()
                .antMatchers("/api/jobs/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            .and()
            .httpBasic();
        return http.build();
    }
}
```

> ### 注意点

1. **非同期処理**: ジョブの実行は時間がかかる可能性があるため、即時応答を返す設計が必須
2. **ジョブの重複実行防止**: 同時実行制御が必要な場合は`JobLauncher`の設定変更
3. **エラーハンドリング**: ジョブ実行失敗時の通知機構を実装
   > この構成により、React+Next.js フロントエンドからボタンクリックでバッチジョブを起動できるようになります。

現在の Spring Batch ジョブを React+Next.js のフロントエンドから実行することは**可能です**が、適切な API エンドポイントを実装する必要があります。以下に実装方法を詳しく説明します。

### 実装手順

#### 1. バックエンド（Spring Boot）側の実装

**ジョブ起動用の REST API エンドポイントを作成：**

```java
@RestController
@RequestMapping("/api/batch")
public class BatchJobController {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job humanResourceBatchJob;

    @PostMapping("/run-human-resource-job")
    public ResponseEntity<String> runHumanResourceJob() {
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

#### 2. フロントエンド（React）側の実装

**API を呼び出す React コンポーネント例：**

```jsx
import React, { useState } from "react";
import axios from "axios";

const BatchJobButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const runBatchJob = async () => {
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:8080/api/batch/run-human-resource-job"
      );

      setMessage(response.data);
    } catch (error) {
      setMessage(`エラー: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={runBatchJob}
        disabled={loading}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "実行中..." : "人事データ同期ジョブ実行"}
      </button>

      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
};

export default BatchJobButton;
```

### 必要な設定と考慮事項

1. **CORS 設定（Spring Boot 側）**

   ```java
   @Configuration
   public class WebConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/api/**")
                   .allowedOrigins("http://localhost:3000") // Next.jsのアドレス
                   .allowedMethods("GET", "POST");
       }
   }
   ```

2. **認証・認可の追加（セキュリティ対策）**

   - Spring Security で API エンドポイントを保護
   - JWT トークンによる認証を実装
   - 管理者権限のみ実行可能にする

3. **非同期処理の考慮**

   - ジョブ実行は非同期で行われるため、即時応答を返す
   - ジョブステータス確認用の別エンドポイントを実装することを推奨

4. **Next.js API Route の利用（オプション）**
   Next.js 側で API Route を作成し、クライアントから直接 Spring API を呼び出す代わりに中継する：

   ```javascript
   // pages/api/run-batch-job.js
   export default async function handler(req, res) {
     try {
       const response = await axios.post(
         "http://localhost:8080/api/batch/run-human-resource-job",
         {},
         { headers: { Authorization: req.headers.authorization } }
       );
       res.status(200).json(response.data);
     } catch (error) {
       res.status(500).json({ error: "ジョブの実行に失敗しました" });
     }
   }
   ```

### 本番環境での考慮事項

1. **URL 設定**

   - 本番環境では相対パスを使用：
     ```jsx
     axios.post("/api/run-batch-job");
     ```

2. **環境変数の管理**

   - API エンドポイントを環境変数で管理：
     ```jsx
     const apiUrl = process.env.NEXT_PUBLIC_BATCH_API_URL;
     ```

3. **エラーハンドリングの強化**

   - ジョブの進捗監視
   - タイムアウト処理の実装
   - リトライメカニズムの追加

4. **セキュリティ**
   - HTTPS の必須化
   - CSRF 対策
   - レートリミティング

### メリット

- フロントエンドからワンクリックでバッチ処理を実行可能
- 管理者画面に統合して運用管理を簡素化
- ジョブ実行結果をリアルタイムで表示可能

この構成により、React+Next.js のフロントエンドから Spring Batch ジョブを安全かつ効率的に実行できるようになります。
