# Next.js 連携 V3 改造案

現在の実装は主にサーバーサイドレンダリング（SSR）やフォームベースの認証を想定した設計となっており、React+Next.js のような SPA フロントエンドとの連携には以下の点で不適切です。修正が必要なポイントを整理し、統合修正版を提案します。

---

### **🔍 現在の実装の問題点**

| 問題点                     | 詳細                                                                        |
| -------------------------- | --------------------------------------------------------------------------- |
| **セッション依存**         | トークンがサーバーセッションに依存（SPA では管理が困難）                    |
| **フォームパラメータ前提** | トークンをリクエストパラメータで送信する設計（現代の API はヘッダーが主流） |
| **HTML/JSON の分岐処理**   | `ModelAndView` と `MappingJackson2JsonView` の分岐が不要（SPA は常に JSON） |
| **HTTP Basic 認証**        | 非推奨の認証方式（JWT や OAuth2 が推奨）                                    |

---

### **🚀 修正統合版（Next.js 連携対応）**

#### **1. `TokenManager` の修正（ヘッダー対応）**

```java
public class TokenManager {
    // ...（既存のメソッドは保持）

    // ヘッダーからトークンを取得する新しいメソッド
    public static String getTokenFromHeader(HttpServletRequest request, String headerName) {
        return request.getHeader(headerName);
    }

    // ヘッダー検証用バリデーション
    public static boolean validateFromHeader(
        HttpServletRequest request,
        String headerName,
        boolean removeToken
    ) {
        String sessionToken = getSessionToken(request, DEFAULT_TOKEN_NAME);
        String headerToken = getTokenFromHeader(request, headerName);

        boolean isValid = sessionToken != null && sessionToken.equals(headerToken);

        if (isValid && removeToken) {
            removeSessionToken(request, DEFAULT_TOKEN_NAME);
        }

        return isValid;
    }
}
```

#### **2. `SecurityHandlerInterceptor` の簡素化（JSON 専用化）**

```java
public class SecurityHandlerInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) return true;

        // CORS対策（Next.jsからのリクエスト許可）
        response.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
        response.setHeader("Access-Control-Allow-Credentials", "true");

        // トークン検証（ヘッダーから取得）
        TokenValidateType type = getValidateTokenType(handlerMethod);
        if (!type.equals(TokenValidateType.NONE)) {
            boolean isValid = TokenManager.validateFromHeader(
                request,
                "X-CSRF-Token",
                type.equals(TokenValidateType.REMOVE)
            );

            if (!isValid) {
                response.sendError(HttpServletResponse.SC_FORBIDDEN, "Invalid CSRF Token");
                return false;
            }
        }
        return true;
    }

    // postHandleは削除（SPAでは不要）
}
```

#### **3. `SecurityConfig` の JWT 対応**

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable) // CSRFはトークン管理でカスタム対応
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS) // セッション不使用
            )
            .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter();
    }

    // CORS設定
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE"));
        config.setAllowedHeaders(List.of("Authorization", "X-CSRF-Token", "Content-Type"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }
}
```

#### **4. `JwtAuthenticationFilter` の追加**

```java
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(
        HttpServletRequest request,
        HttpServletResponse response,
        FilterChain filterChain
    ) throws ServletException, IOException {

        String token = resolveToken(request);
        if (token != null && validateToken(token)) {
            Authentication auth = getAuthentication(token);
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
```

---

### **🔧 Next.js 側の対応**

#### **API リクエスト例（Axios）**

```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080",
  withCredentials: true, // Cookie送信許可
});

// ログイン後にCSRFトークンを取得
const fetchCsrfToken = async () => {
  const response = await api.get("/api/csrf-token");
  return response.data.token;
};

// 保護されたAPIを呼び出す
const callProtectedApi = async () => {
  const csrfToken = await fetchCsrfToken();

  const response = await api.post(
    "/api/batch/run",
    {},
    {
      headers: {
        "X-CSRF-Token": csrfToken,
        Authorization: `Bearer ${localStorage.getItem("jwt")}`,
      },
    }
  );

  return response.data;
};
```

---

### **📌 変更点のまとめ**

| 項目                 | 修正前             | 修正後                          |
| -------------------- | ------------------ | ------------------------------- |
| **トークン送信方法** | フォームパラメータ | HTTP ヘッダー（`X-CSRF-Token`） |
| **認証方式**         | HTTP Basic         | JWT（Bearer トークン）          |
| **セッション管理**   | セッション使用     | ステートレス（JWT）             |
| **CORS 設定**        | 未設定             | Next.js オリジン許可            |
| **JSON 処理**        | HTML/JSON の分岐   | 常に JSON レスポンス            |

---

### **⚙️ 追加で必要な設定**

1. **JWT ライブラリの導入**（`pom.xml`または`build.gradle`）

   ```xml
   <dependency>
       <groupId>io.jsonwebtoken</groupId>
       <artifactId>jjwt-api</artifactId>
       <version>0.11.5</version>
   </dependency>
   ```

2. **環境変数設定**（`application.properties`）

   ```properties
   jwt.secret=your-256-bit-secret
   jwt.expiration=86400000 # 24時間
   ```

3. **CSRF トークン取得 API**（新規追加）
   ```java
   @RestController
   @RequestMapping("/api/csrf-token")
   public class CsrfTokenController {

       @GetMapping
       public Map<String, String> getCsrfToken(HttpServletRequest request) {
           TokenManager.save(request, TokenManager.DEFAULT_TOKEN_NAME);
           return Map.of(
               "token", TokenManager.getSessionToken(request, TokenManager.DEFAULT_TOKEN_NAME)
           );
       }
   }
   ```

この修正により、Next.js（React）からの安全な API 連携が可能になります。特に JWT と CSRF トークンの併用は、モダンな SPA アプリケーションで推奨されるセキュリティ対策です。
