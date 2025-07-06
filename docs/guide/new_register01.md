# ✅ 新規ユーザー登録の連携関係と処理フロー

### ✅ 　**関連ディレクトリ構造**

```
src/
├── main/
│   ├── java/
│   │   └── com.example.orgchart_api/
│   │       ├── controller/
│   │       │   ├── AuthController.java
│   │       │   └── RegisterController.java
│   │       ├── security/
│   │       │   ├── JwtAuthenticationFilter.java
│   │       │   └── SecurityHandlerInterceptor.java
│   │       ├── util/
│   │       │   └── JwtUtil.java
│   │       ├── config/
│   │       │   ├── SecurityConfig.java
│   │       │   └── WebConfig.java
│   │       ├── domain/
│   │       │   └── User.java
│   │       ├── dto/
│   │       │   ├── AuthRequest.java   # 追加
│   │       │   ├── AuthResponse.java
│   │       │   └── RegisterRequest.java  # 追加
│   │       └── service/
│   │           └── AuthenticationService.java
│   ├── resources/
│   │   ├── application.properties
│   │   └── data.sql
│   └── test/                      # テストディレクトリ
│       └── java/
│           └── com.example.orgchart_api/
│               └── controller/    # コントローラテスト
└── test/                          # 追加のテストディレクトリ

```

### ✅ **新規ユーザー登録の連携関係と処理フロー**

#### 📌 **全体の流れ**

```
[フロントエンド]
     ↓
[RegisterController.java]
     ↓
[AuthenticationService.java]
     ↓
[UserRepository.java (JPA)]
     ↓
[users テーブル (PostgreSQL)]
     ↓
[JwtUtil.java → トークン生成]
     ↓
[AuthResponse.java → JSON レスポンス]
```

---

## 🔧 **各クラスの役割と関係図**

| クラス名                    | 役割                                                      | 呼び出されるメソッド              |
| --------------------------- | --------------------------------------------------------- | --------------------------------- |
| **`RegisterController`**    | HTTP リクエストを受け取り、DTO 経由でサービス層を呼び出す | `register(RegisterRequest)`       |
| **`AuthenticationService`** | メール重複チェック・ユーザー登録処理を実行                | `register(email, name, password)` |
| **`UserRepository`**        | JPA 経由で DB に保存                                      | `save(user)`                      |
| **`JwtUtil`**               | 登録成功時に JWT トークンを生成                           | `generateToken(claims, subject)`  |
| **`AuthResponse`**          | トークン + ユーザー情報を JSON 形式で返却                 | `of(token, email, name, role)`    |

---

## ✅ **1. [RegisterController.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\RegisterController.java)：HTTP リクエスト処理**

```java
@PostMapping("/register")
public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request)
```

- **担当層**: Controller 層
- **役割**: フロントからの `/api/register` リクエストを受け取る
- **内部処理**:
  - `AuthenticationService.register(...)` を呼び出し
  - 成功時、`JwtUtil.generateToken(...)` でトークン発行
  - `AuthResponse.of(...)` でレスポンス構築

---

## ✅ **2. [AuthenticationService.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\service\AuthenticationService.java)：業務ロジック実行**

```java
public User register(String email, String name, String password)
```

- **担当層**: Service 層
- **役割**: メール重複チェック + パスワードハッシュ化 + ユーザー登録
- **主な処理**:
  - `userRepository.findByEmail()` でメール重複チェック
  - `passwordEncoder.encode(password)` でパスワードハッシュ化
  - `userRepository.save()` で DB に保存
  - 登録日時 (`create_date`) / 更新日時 (`update_date`) / 更新者 (`update_user`) を明示的に設定

---

## ✅ **3. [User.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\domain\User.java)：エンティティ定義**

```java
@Entity
@Table(name = "users")
@Data
@Builder
public class User {
    // フィールド定義
}
```

- **担当層**: Entity 層
- **役割**: DB とのマッピングを行うためのオブジェクト
- **フィールド**:
  - [id](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\domain\User.java#L14-L16), [email](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\domain\User.java#L18-L19), `password_hash`, [name](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\domain\User.java#L24-L24), [role](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\domain\User.java#L26-L26), `create_date`, `update_date`, `update_user`
- **制約**:
  - [email](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\domain\User.java#L18-L19): 一意性制約あり（DB 側でも Java 側でも検証）
  - [role](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\domain\User.java#L26-L26): `user` or `admin` のみ許可（DB CHECK 制約）

---

## ✅ **4. [UserRepository.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\repository\UserRepository.java)：データベース操作**

```java
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
}
```

- **担当層**: Repository 層
- **役割**: ユーザー情報の永続化（INSERT / SELECT）
- **使用例**:
  - [findByEmail(email)](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\repository\UserRepository.java#L17-L17) → メール重複チェック用
  - [save(user)](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\security\TokenManager.java#L13-L17) → 新規ユーザー登録用

---

## ✅ **5. [JwtUtil.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\util\JwtUtil.java)：JWT トークン生成**

```java
public String generateToken(Map<String, Object> claims, String subject)
```

- **担当層**: Util 層
- **役割**: 登録後の自動ログインに使う JWT トークンを生成
- **使用例**:
  - `claims.put("role", user.getRole())`
  - `claims.put("name", user.getName())`
  - `signWith(getSigningKey(), SignatureAlgorithm.HS512)`

---

## ✅ **6. [AuthResponse.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\dto\AuthResponse.java)：レスポンス構造**

```java
public static AuthResponse of(String token, String email, String name, String role)
```

- **担当層**: DTO 層
- **役割**: API レスポンスの統一された構造体として返却
- **JSON 構造**:

```json
{
  "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.xxxxx",
  "email": "test@example.com",
  "name": "山田 太郎",
  "role": "user"
}
```

---

## ✅ **7. [SecurityConfig.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\config\SecurityConfig.java)：セキュリティ設定**

```java
.antMatchers("/api/auth/**", "/api/register").permitAll()
.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class)
```

- **担当層**: Security 層
- **役割**:
  - `/api/register` は認証不要
  - JWT フィルターを適用し、以降の API アクセスを制限
- **CORS 設定**:
  - フロント側オリジン（`http://localhost:3000`）を許可

---

## ✅ **8. [JwtAuthenticationFilter.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\security\JwtAuthenticationFilter.java)：JWT 認証フィルター**

```java
if (request.getServletPath().contains("/api/register")) {
    filterChain.doFilter(request, response);
    return;
}
```

- **担当層**: Security 層
- **役割**: `/api/register` では JWT 検証をスキップ

---

## ✅ **9. [SecurityHandlerInterceptor.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\security\SecurityHandlerInterceptor.java)：インターセプター**

```java
@Override
public boolean preHandle(...) {
    if (request.getServletPath().contains("/api/register")) {
        return true; // トークン検証をスキップ
    }
    ...
}
```

- **担当層**: Interceptor 層
- **役割**: `/api/register` ではワンタイムトークン検証をスキップ

---

## ✅ **10. [WebConfig.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\config\WebConfig.java)：インターセプター登録**

```java
registry.addInterceptor(securityHandlerInterceptor)
        .addPathPatterns("/api/**")
        .excludePathPatterns("/api/auth/login");
```

- **担当層**: Web 層
- **役割**: `/api/register` にもセキュリティインターセプターを適用（ただし除外リストには含まれない）

---

## ✅ **11. [AuthController.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\AuthController.java)：ログイン処理**

```java
@PostMapping("/login")
public ResponseEntity<AuthResponse> login(...)
```

- **担当層**: Controller 層
- **役割**: ログイン後も `AuthResponse.of(...)` で同様のレスポンスを返す

---

## ✅ **12. [AuthRequest.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\AuthRequest.java)：ログインリクエスト DTO**

```java
public class AuthRequest {
    private String email;
    private String password;
}
```

- **役割**: `/api/auth/login` 用のリクエストパラメータ受け口

---

## ✅ **全体の処理フロー図（テキスト版）**

```
[フロントページ]
      ↓
[page.tsx POST /api/register]
      ↓
[JwtAuthenticationFilter → /api/register はスキップ]
      ↓
[SecurityHandlerInterceptor → トークン検証なし]
      ↓
[RegisterController#register()]
      ↓
[AuthenticationService#register()]
      ↓
[UserRepository.save()]
      ↓
[users テーブルにINSERT]
      ↓
[JwtUtil.generateToken()]
      ↓
[AuthResponse.of()]
      ↓
[JSONレスポンスをフロントへ送信]
```

---

## ✅ **補足：Swagger UI 上での表示内容**

| エンドポイント    | 認証必要？ | レスポンス構造                 |
| ----------------- | ---------- | ------------------------------ |
| `/api/register`   | ❌ 不要    | `AuthResponse`（トークン付き） |
| `/api/auth/login` | ❌ 不要    | `AuthResponse`（トークン付き） |
| `/api/batch/**`   | ✅ 必須    | `AuthResponse`（トークン必須） |

🔗 [Swagger UI](http://localhost:8081/swagger-ui/index.html)

---

## ✅ **結論**

| 項目                         | 内容                                                                         |
| ---------------------------- | ---------------------------------------------------------------------------- |
| ✅ **登録 API の全プロセス** | フロント → Controller → Service → Repository → JWT 生成 → JSON レスポンス    |
| ✅ **セキュリティ設定**      | `/api/register` は認証不要。JWT フィルターとインターセプターは除外           |
| ✅ **DTO 構造の統一性**      | `AuthResponse` が `/api/register` と `/api/auth/login` 両方で共通            |
| ✅ **Swagger 対応**          | 各フィールドに `@Schema` アノテーションを追加し、UI 上でも説明が表示されます |

---

## 📝 **次に推奨するアクション**

- ✅ Swagger UI 上で `/api/register` のテスト実施
- ✅ Postman などで `/api/auth/login` から取得したトークンで `/api/batch/execute` などへのアクセス権限確認
- ✅ ログイン後のトークン再利用やリフレッシュトークン機能の拡張案作成（要望があれば提供します）

ご希望があれば、**JWT リフレッシュトークン機能** や  
**CSRF 保護強化設定** も提供いたします 😊
