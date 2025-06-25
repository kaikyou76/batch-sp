## 認証クラス草案 02

#### 已深度思考

> 既存の`SecurityConfig`を利用して、バッチジョブ起動 API を保護する方法を考えます。現在の設定では、以下の点に注意が必要です：
>
> 1. **CSRF 保護が無効化されている** (`http.csrf(AbstractHttpConfigurer::disable)`)
> 2. 基本認証（HTTP Basic）が有効
> 3. ユーザーはインメモリで管理（admin/password）
>
> ### 要件整理

- バッチジョブ起動 API (`/api/batch/**`) を保護したい
- 既存のワンタイムトークン認証（CSRF 対策）を適用したい
- 基本認証と共存させる
  > ### 解決策

1. **CSRF 保護を有効化**（ワンタイムトークン認証を使用するため）
2. ワンタイムトークン認証を有効にするために、`SecurityHandlerInterceptor`を再登録
3. バッチジョブ起動 API へのアクセス権限設定
   > ### ステップバイステップ
   >
   > #### ステップ 1: SecurityConfig の修正

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {
 >     @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // CSRFを有効化（デフォルトのCSRF保護を有効にする）
            .csrf(csrf -> csrf.disable()) // 一旦は無効のまま。後で有効化するが、カスタム設定が必要
            // カスタムCSRF保護（トークンベース）を使用するため、標準のCSRFは無効のままにする
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers("/api/batch/**").hasRole("ADMIN") // バッチAPIはADMINのみ
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());
 >         return http.build();
    }
 >     // 既存のUserDetailsServiceとPasswordEncoderはそのまま
}
```

> #### ステップ 2: カスタムインタセプタの再登録
>
> `WebConfig`クラスで`SecurityHandlerInterceptor`を登録（以前と同じ）
>
> ```java
> @Configuration
> public class WebConfig implements WebMvcConfigurer {
> ```

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SecurityHandlerInterceptor())
                .addPathPatterns("/api/batch/**");
    }

}

````
 > #### ステップ3: コントローラの修正（トークン処理追加）
バッチジョブ起動メソッドに`@TokenHandler`を追加
 > ```java
@TokenHandler(save = true, validate = TokenValidateType.REMOVE, handleError = true)
@PostMapping("/run-human-resource-job")
public ResponseEntity<String> runHumanResourceJob(
        @RequestParam("_RequestVerificationToken") String token) {
    // トークン検証はインタセプタが実施
    // バッチジョブ実行処理
}
````

> #### ステップ 4: クライアント側の対応（React）

1. トークン取得リクエスト（GET `/api/batch/get-token`）を実装
2. 取得したトークンをバッチ起動 API のリクエスト時にパラメータとして送信
   > ### 注意点

- **CSRF の二重管理問題**: Spring Security の標準 CSRF とカスタムトークン認証が競合するため、標準 CSRF は無効化したままにする
- **認証方式の共存**: 基本認証でユーザー認証を行い、カスタムトークンで CSRF 対策を行う
- **権限管理**: `@EnableMethodSecurity`と`hasRole("ADMIN")`でメソッドレベルのセキュリティも追加可能
  > ### 代替案: 標準 CSRF 保護を使用する場合
  >
  > カスタムトークン認証ではなく、Spring Security の標準 CSRF 保護を使用する場合は以下のように変更します：
  >
  > ```java
  > @Bean
  > public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
  > ```
      http
          .csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()))
          .authorizeHttpRequests(auth -> auth
              .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
              .requestMatchers("/api/auth/**").permitAll()
              .requestMatchers("/api/batch/**").hasRole("ADMIN")
              .anyRequest().authenticated()
          )
          .httpBasic(Customizer.withDefaults());
      return http.build();
  }

````
 > クライアント側ではCSRFトークンをクッキーから読み取り、リクエストヘッダーに追加する必要があります。しかし、既存のカスタムトークン認証を維持したいため、この方法は推奨しません。
 > ### 結論
既存のカスタムトークン認証を維持するため、以下の構成を推奨します：
1. Spring Securityの標準CSRFは無効化
2. `SecurityHandlerInterceptor`によるカスタムトークン認証を適用
3. 基本認証でユーザー認証を実施
4. ロールベースのアクセス制御を追加
 > これで、React+Next.jsからバッチジョブ起動APIを安全に呼び出すことができます。



既存のセキュリティ設定ファイル(`SecurityConfig`)を利用してバッチジョブ起動APIを保護する方法を提案します。現在の設定では基本認証(Basic認証)が有効で、CSRF保護は無効化されています。

### 修正後のセキュリティ設定ファイル

```java
package com.example.orgchart_api.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.provisioning.InMemoryUserDetailsManager;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                // CSRF保護を無効化（既存設定を維持）
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(auth -> auth
                        // パブリックアクセスを許可するエンドポイント
                        .requestMatchers(
                            "/swagger-ui/**",
                            "/v3/api-docs/**",
                            "/api/auth/**"
                        ).permitAll()

                        // バッチジョブAPIへのアクセス制御
                        .requestMatchers("/api/batch/**").hasRole("ADMIN")

                        // その他全てのリクエストは認証が必要
                        .anyRequest().authenticated()
                )
                // Basic認証を有効化（既存設定を維持）
                .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        // 管理者ユーザー（バッチジョブ実行権限あり）
        UserDetails admin = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("password"))
                .roles("ADMIN")
                .build();

        // 一般ユーザー（バッチジョブ実行権限なし）
        UserDetails user = User.builder()
                .username("user")
                .password(passwordEncoder().encode("password"))
                .roles("USER")
                .build();

        return new InMemoryUserDetailsManager(admin, user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
````

### バッチジョブコントローラの実装

```java
package com.example.orgchart_api.controller;

import org.springframework.batch.core.Job;
import org.springframework.batch.core.JobParameters;
import org.springframework.batch.core.JobParametersBuilder;
import org.springframework.batch.core.launch.JobLauncher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/batch")
public class BatchJobController {

    @Autowired
    private JobLauncher jobLauncher;

    @Autowired
    private Job humanResourceBatchJob;

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping("/run-human-resource-job")
    public ResponseEntity<String> runHumanResourceJob() {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

            jobLauncher.run(humanResourceBatchJob, jobParameters);

            return ResponseEntity.accepted().body("ジョブが開始されました");
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                .body("ジョブの実行に失敗しました: " + e.getMessage());
        }
    }
}
```

### React+Next.js 側の実装例

```jsx
import axios from "axios";

const BatchJobButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const runBatchJob = async () => {
    setLoading(true);
    setMessage("");

    try {
      // Basic認証情報を設定
      const username = "admin";
      const password = "password";
      const basicAuth = btoa(`${username}:${password}`);

      const response = await axios.post(
        "http://localhost:8080/api/batch/run-human-resource-job",
        {},
        {
          headers: {
            Authorization: `Basic ${basicAuth}`,
          },
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
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        {loading ? "実行中..." : "人事データ同期ジョブ実行"}
      </button>

      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
};
```

### 主な変更点と特徴

1. **アクセス制御の強化**:

   - `/api/batch/**` パスへのアクセスには`ADMIN`ロールを要求
   - `@PreAuthorize("hasRole('ADMIN')")`でメソッドレベルのセキュリティを追加

2. **ユーザー管理の拡張**:

   - 管理者ユーザー(`admin`)と一般ユーザー(`user`)を追加
   - 管理者のみバッチジョブを実行可能

3. **Basic 認証の維持**:

   - 既存の Basic 認証方式をそのまま使用
   - フロントエンドからは Base64 エンコードした認証情報を送信

4. **CSRF 保護無効化の維持**:
   - 既存の`csrf(AbstractHttpConfigurer::disable)`設定を維持
   - API クライアントがブラウザではないため、CSRF 保護は不要

### 本番環境での追加対策

1. **HTTPS の強制**:

   ```java
   @Bean
   public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
       http
           .requiresChannel(channel ->
               channel.anyRequest().requiresSecure()) // HTTPSを強制
           // ... 他の設定 ...
   }
   ```

2. **実際のユーザーストアへの変更**:

   ```java
   @Bean
   public UserDetailsService userDetailsService(DataSource dataSource) {
       return new JdbcUserDetailsManager(dataSource);
   }
   ```

3. **認証情報の環境変数管理**:

   ```javascript
   // React側
   const username = process.env.NEXT_PUBLIC_API_USER;
   const password = process.env.NEXT_PUBLIC_API_PASSWORD;
   ```

4. **API キー認証の追加（オプション）**:
   ```java
   .requestMatchers("/api/batch/**").access(
       new WebExpressionAuthorizationManager(
           "hasRole('ADMIN') and hasHeader('X-API-KEY')"
       )
   )
   ```

この構成により、既存のセキュリティ設定を維持しつつ、バッチジョブ起動 API を安全に保護できます。管理者のみがジョブを実行可能で、Basic 認証によるアクセス制御が行われます。
