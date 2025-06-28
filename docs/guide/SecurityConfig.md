# SecurityConfig

### (src/main/java/com/example/orgchart_api/config/SecurityConfig.java)

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
                .csrf(AbstractHttpConfigurer::disable) // または csrf -> csrf.disable()
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                        .requestMatchers("/api/auth/**").permitAll()
                        .anyRequest().authenticated()
                )
                .httpBasic(Customizer.withDefaults()); // 非推奨のhttpBasic()を置き換え

        return http.build();
    }

    @Bean
    public UserDetailsService userDetailsService() {
        UserDetails user = User.builder()
                .username("admin")
                .password(passwordEncoder().encode("password"))
                .roles("ADMIN")
                .build();

        return new InMemoryUserDetailsManager(user);
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

```

このコードは、Spring Security を使用して Web アプリケーションのセキュリティ設定を行う Java の設定クラスです。以下に各部分の意味を説明します：

### アノテーション

1. `@Configuration` - このクラスが Spring の設定クラスであることを示します
2. `@EnableWebSecurity` - Spring Security を有効化します
3. `@EnableMethodSecurity` - メソッドレベルのセキュリティ（`@PreAuthorize`など）を有効化します

### メソッドの説明

#### 1. `securityFilterChain` メソッド

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
            .csrf(AbstractHttpConfigurer::disable) // CSRF保護を無効化
            .authorizeHttpRequests(auth -> auth
                    .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll() // Swagger関連URLは認証不要
                    .requestMatchers("/api/auth/**").permitAll() // 認証APIは認証不要
                    .anyRequest().authenticated() // それ以外のリクエストは認証必須
            )
            .httpBasic(Customizer.withDefaults()); // HTTP Basic認証を使用

    return http.build();
}
```

- **CSRF 無効化**: `csrf(AbstractHttpConfigurer::disable)`で CSRF 保護を無効にしています（REST API では一般的）
- **認可設定**:
  - Swagger UI と API ドキュメントへのアクセスは全許可
  - `/api/auth/**`パスの API は全許可
  - それ以外のリクエストは認証が必要
- **認証方式**: HTTP Basic 認証を使用

#### 2. `userDetailsService` メソッド

```java
@Bean
public UserDetailsService userDetailsService() {
    UserDetails user = User.builder()
            .username("admin")
            .password(passwordEncoder().encode("password")) // パスワードをBCryptでエンコード
            .roles("ADMIN")
            .build();

    return new InMemoryUserDetailsManager(user);
}
```

- メモリ内にユーザーを 1 人作成（ユーザー名: `admin`、パスワード: `password`、ロール: `ADMIN`）
- 実際のアプリケーションでは、通常データベースからユーザー情報を取得します

#### 3. `passwordEncoder` メソッド

```java
@Bean
public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
}
```

- パスワードを BCrypt アルゴリズムでハッシュ化するエンコーダーを提供

### 全体の動作

この設定では：

1. Swagger UI と API ドキュメントは誰でもアクセス可能
2. `/api/auth/**`パスの API は誰でも利用可能
3. それ以外の API は HTTP Basic 認証が必要
4. 認証ユーザーは`admin`（パスワード`password`）のみで、ADMIN ロールを持つ

実際のプロダクション環境では、通常：

- CSRF 保護を有効化（フォームベース認証の場合）
- データベースからユーザーを取得
- より複雑な認可ロジックを実装
- HTTPS を強制
- より安全なパスワードポリシーを適用
  する必要があります。
