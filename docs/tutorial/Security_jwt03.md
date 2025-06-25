## 認証クラス草案 03

#### 已深度思考

> 既存のセキュリティ設定（Basic 認証）とカスタムトークン認証（CSRF 対策）を統合して、より強固なセキュリティを実現する方法を考えます。
>
> ### 統合方針

1.  **基本認証（Basic 認証）**: ユーザーの認証とロールベースのアクセス制御
2.  **カスタムトークン認証（ワンタイムトークン）**: CSRF 対策として機能
    > ### 統合後のコントローラ
    >
    > ```java
    > package com.example.orgchart_api.controller;
    > import com.example.orgchart_api.security.TokenHandler;
    > import com.example.orgchart_api.security.TokenValidateType;
    > import org.springframework.batch.core.Job;
    > import org.springframework.batch.core.JobParameters;
    > import org.springframework.batch.core.JobParametersBuilder;
    > import org.springframework.batch.core.JobParametersInvalidException;
    > import org.springframework.batch.core.launch.JobLauncher;
    > import org.springframework.batch.core.repository.JobExecutionAlreadyRunningException;
    > import org.springframework.batch.core.repository.JobInstanceAlreadyCompleteException;
    > import org.springframework.batch.core.repository.JobRestartException;
    > import org.springframework.beans.factory.annotation.Autowired;
    > import org.springframework.http.HttpStatus;
    > import org.springframework.http.ResponseEntity;
    > import org.springframework.security.access.prepost.PreAuthorize;
    > import org.springframework.web.bind.annotation.PostMapping;
    > import org.springframework.web.bind.annotation.RequestMapping;
    > import org.springframework.web.bind.annotation.RequestParam;
    > import org.springframework.web.bind.annotation.RestController;
    > @RestController
    > @RequestMapping("/api/batch")
    > public class BatchJobController {
    >     @Autowired
    > ```
        private JobLauncher jobLauncher;
    >     @Autowired
        private Job humanResourceBatchJob;
    >     // 二重のセキュリティ対策を適用
        @PreAuthorize("hasRole('ADMIN')") // 基本認証による権限チェック
        @TokenHandler( // カスタムCSRFトークン認証
            save = true,
            validate = TokenValidateType.REMOVE,
            handleError = true
        )
        @PostMapping("/run-human-resource-job")
        public ResponseEntity<String> runHumanResourceJob(
                @RequestParam("_RequestVerificationToken") String token) {
    >         try {
                JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters();
    >             jobLauncher.run(humanResourceBatchJob, jobParameters);
                return ResponseEntity.accepted().body("ジョブが開始されました");
            } catch (JobExecutionAlreadyRunningException | JobRestartException |
                     JobInstanceAlreadyCompleteException | JobParametersInvalidException e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("ジョブの実行に失敗しました: " + e.getMessage());
            }
        }
    }

````
 > ### 必要な設定
 > #### 1. セキュリティ設定（SecurityConfig）の更新
```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
 >     @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // カスタムトークン認証を使用するため標準CSRFは無効化
            .csrf(AbstractHttpConfigurer::disable)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/batch/**").authenticated() // 認証が必要
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults()); // Basic認証を有効化
 >         return http.build();
    }
 >     // ユーザー詳細サービスとパスワードエンコーダは変更なし
}
````

> #### 2. インタセプタの登録（WebConfig）

```java
import com.example.orgchart_api.security.SecurityHandlerInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
 > @Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SecurityHandlerInterceptor())
                .addPathPatterns("/api/batch/**");
    }
}
```

> ### React 側の実装（統合版）
>
> ```jsx
> import React, { useState, useEffect } from 'react';
> import axios from 'axios';
> const BatchJobButton = () => {
>   const [loading, setLoading] = useState(false);
>   const [token, setToken] = useState('');
>   const [message, setMessage] = useState('');
>   // トークン取得関数
>   const fetchToken = async () => {
> ```

    try {
      const response = await axios.get('http://localhost:8080/api/batch/get-token', {
        auth: {
          username: 'admin',
          password: 'password'
        }
      });
      setToken(response.data.token);
    } catch (error) {
      console.error('トークン取得エラー', error);
    }

};

> // 初期トークン取得
> useEffect(() => {

    fetchToken();

}, []);

> const runBatchJob = async () => {

    if (!token) {
      setMessage('トークンが取得できていません');
      return;
    }

>     setLoading(true);

    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/batch/run-human-resource-job',
        new URLSearchParams({ _RequestVerificationToken: token }),
        {
          auth: {
            username: 'admin',
            password: 'password'
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );

      setMessage(response.data);

      // ジョブ実行後、新しいトークンを再取得
      fetchToken();
    } catch (error) {
      setMessage(`エラー: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }

};

> return (

    <div>
      <button
        onClick={runBatchJob}
        disabled={loading || !token}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? '実行中...' : '人事データ同期ジョブ実行'}
      </button>

      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>

);
};

> export default BatchJobButton;

````
 > ### 動作フローの説明
 > 1. **初期トークン取得**:
   - コンポーネントマウント時に`/api/batch/get-token`を呼び出し
   - Basic認証で管理者クレデンシャルを送信
   - セッションにトークン保存＆レスポンスでトークン取得
 > 2. **ジョブ実行リクエスト**:
   - 取得したトークンを`_RequestVerificationToken`パラメータとして送信
   - 同じくBasic認証情報をヘッダーに追加
   - リクエスト受付後、サーバー側で二重チェック:
     - `PreAuthorize`でADMINロールを確認
     - `TokenHandler`でワンタイムトークンを検証
 > 3. **トークンの更新**:
   - ジョブ実行後に新しいトークンを再取得
   - 次の実行に備える
 > ### メリット
- **多層防御**: 基本認証（ユーザー認証）＋ ワンタイムトークン（CSRF対策）
- **既存システムとの互換性**: 現在の認証機構を最大限活用
- **セッションセキュリティ**: トークンが使い捨てでセッションハイジャック対策
 > ### 注意点
- **トークン取得APIの実装**: コントローラにトークン取得用エンドポイントが必要
  ```java
  @GetMapping("/get-token")
  public ResponseEntity<Map<String, String>> getToken() {
      // トークンはインタセプタのpostHandleで自動保存される
      return ResponseEntity.ok(Collections.singletonMap("token", "新規トークン"));
  }
````

- **セッション依存性**: サーバーをスケールアウトする場合はセッション共有化が必要
- **パフォーマンス**: 各ジョブ実行前に追加のトークン取得リクエストが発生
  > この統合アプローチにより、既存のセキュリティインフラを活かしつつ、より強固な保護を実現できます。

両方のコントローラの利点を統合して、より強固なセキュリティを実現する方法を提案します。基本認証（Basic 認証）とワンタイムトークン認証を組み合わせることで、多層防御を実装できます。

### 統合版バッチジョブコントローラ

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
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/batch")
public class BatchJobController {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job humanResourceBatchJob;

    // 二重のセキュリティ対策を適用
    @PreAuthorize("hasRole('ADMIN')") // 基本認証による権限チェック
    @TokenHandler( // カスタムCSRFトークン認証
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
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("予期せぬエラーが発生しました: " + e.getMessage());
        }
    }
}
```

### 統合のメリット

1. **多層防御の実現**:

   - `@PreAuthorize`: ロールベースのアクセス制御（基本認証）
   - `@TokenHandler`: ワンタイムトークンによる CSRF 保護
   - 二つの異なるセキュリティメカニズムで相互補完

2. **セキュリティの強化**:

   - 基本認証でユーザー認証
   - ワンタイムトークンでリクエストの正当性を確認
   - 二要素認証のような効果

3. **既存システムとの互換性**:
   - 現在のセキュリティインフラを維持
   - 追加の保護レイヤーを実装

### 必要な追加実装

#### 1. トークン取得 API の追加

```java
@RestController
@RequestMapping("/api/security")
public class TokenController {

    @TokenHandler(save = true)
    @GetMapping("/request-token")
    public ResponseEntity<Map<String, String>> requestToken() {
        // トークンは自動的に生成・保存される（TokenHandlerのsave=trueによる）
        return ResponseEntity.ok(Collections.singletonMap("status", "Token generated"));
    }
}
```

#### 2. React 側の実装（統合版）

```jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const BatchJobButton = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState("");
  const [message, setMessage] = useState("");

  // トークン取得関数
  const fetchToken = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8080/api/security/request-token",
        {
          auth: {
            username: "admin",
            password: "password",
          },
        }
      );
      // トークンはCookieに保存される（SameSite制限に注意）
    } catch (error) {
      console.error("トークン取得エラー", error);
    }
  };

  // 初期トークン取得
  useEffect(() => {
    fetchToken();
  }, []);

  const runBatchJob = async () => {
    setLoading(true);
    setMessage("");

    try {
      // トークンを再取得（前回使用済みの場合に備えて）
      await fetchToken();

      const response = await axios.post(
        "http://localhost:8080/api/batch/run-human-resource-job",
        new URLSearchParams({ _RequestVerificationToken: "dummy" }), // ダミー値
        {
          auth: {
            username: "admin",
            password: "password",
          },
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          withCredentials: true, // Cookieを送信するために必要
        }
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
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? "実行中..." : "人事データ同期ジョブ実行"}
      </button>

      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
};

export default BatchJobButton;
```

### 重要な設定ポイント

1. **Cookie 設定 (Spring Boot 側)**:

   ```java
   @Configuration
   public class WebConfig implements WebMvcConfigurer {
       @Override
       public void addCorsMappings(CorsRegistry registry) {
           registry.addMapping("/**")
                   .allowedOrigins("http://localhost:3000")
                   .allowedMethods("GET", "POST")
                   .allowCredentials(true); // クレデンシャルを許可
       }
   }
   ```

2. **セキュリティ設定の更新**:

   ```java
   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       http
           .csrf(AbstractHttpConfigurer::disable) // カスタムトークンを使用するため無効化
           .authorizeHttpRequests(auth -> auth
               .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
               .requestMatchers("/api/auth/**").permitAll()
               .requestMatchers("/api/security/request-token").authenticated()
               .requestMatchers("/api/batch/**").hasRole("ADMIN")
               .anyRequest().authenticated()
           )
           .httpBasic(Customizer.withDefaults());
       return http.build();
   }
   ```

3. **トークンハンドラーの動作**:
   - `@TokenHandler(save=true)`: トークン取得 API で新しいトークンを生成・保存
   - `@TokenHandler(validate=REMOVE)`: ジョブ実行時にトークンを検証後、削除

### 本番環境での考慮事項

1. **SameSite Cookie 設定**:

   ```properties
   server.servlet.session.cookie.same-site=none
   server.servlet.session.cookie.secure=true
   ```

2. **トークンの有効期限管理**:

   ```java
   // TokenManagerに有効期限チェックを追加
   public static boolean validate(HttpServletRequest request, String tokenName, boolean removeToken) {
       String sessionToken = getSessionToken(request, tokenName);
       String requestToken = request.getParameter(tokenName);

       // 有効期限チェック（例: 30分以内）
       Long creationTime = (Long) request.getSession().getAttribute(tokenName + "_time");
       if (creationTime != null && System.currentTimeMillis() - creationTime > 30 * 60 * 1000) {
           removeSessionToken(request, tokenName);
           return false;
       }

       // ...既存の検証ロジック...
   }
   ```

3. **監査ログの追加**:
   ```java
   @PostMapping("/run-human-resource-job")
   public ResponseEntity<String> runHumanResourceJob(
           @RequestParam("_RequestVerificationToken") String token,
           Authentication authentication) {

       // 監査ログ
       auditLogService.log(
           "BatchJob started",
           authentication.getName(),
           humanResourceBatchJob.getName()
       );

       // ...既存の処理...
   }
   ```

この統合アプローチにより、基本認証とワンタイムトークンを組み合わせた強固なセキュリティを実現し、React+Next.js から安全にバッチジョブを実行できます。
