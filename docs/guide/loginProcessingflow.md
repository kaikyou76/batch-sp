# ログイン処理の流れ

ログイン処理の流れを以下に整理します。バックエンドにおける認証フローと関係するクラス・メソッドについて、順番に説明します。

---

## 🔁 ログイン処理の全体フロー

1. **フロントエンド**（`/api/auth/login` へ POST リクエスト）
2. **AuthController#login**
3. **AuthenticationService#getUserByEmail**
4. **AuthenticationService#checkPassword**
5. **JwtUtil#generateToken**
6. **SecurityFilterChain**（セキュリティ設定） → JWT フィルター経由
7. **JwtAuthenticationFilter#doFilterInternal**
8. **レスポンス返却**（[AuthResponse](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\dto\AuthResponse.java#L22-L50)）

---

## 📚 関連クラスと役割

### 1. [AuthController](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\AuthController.java#L31-L74)

- **役割**: `/api/auth/login` エンドポイントを提供。
- **主なメソッド**:
  - `login(@RequestBody AuthRequest request, HttpServletResponse response)`
    - リクエストを受け取り、メールアドレスでユーザー検索。
    - パスワードチェックを行い、トークン生成してレスポンスとして返す。

### 2. [AuthenticationService](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\service\AuthenticationService.java#L21-L61)

- **役割**: 認証・登録などのビジネスロジックを実装。
- **主なメソッド**:
  - [getUserByEmail(String email)](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\service\AuthenticationService.java#L54-L56)  
    → 指定されたメールアドレスのユーザーエンティティを取得。
  - `checkPassword(String rawPassword, String encodedPassword)`  
    → 生パスワードとハッシュ化されたパスワードを比較。

### 3. [UserRepository](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\repository\UserRepository.java#L16-L18)

- **役割**: データベースからユーザー情報を取得。
- **主なメソッド**:
  - [findByEmail(String email)](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\repository\UserRepository.java#L17-L17)  
    → メールアドレスでユーザーを検索。

### 4. [JwtUtil](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\util\JwtUtil.java#L21-L65)

- **役割**: JWT トークンの生成・解析。
- **主なメソッド**:
  - `generateToken(Map<String, Object> claims, String subject)`  
    → クレーム情報とサブジェクト（メールアドレス）を使ってトークン生成。
  - [extractEmail(String token)](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\util\JwtUtil.java#L44-L51)  
    → トークンからメールアドレスを抽出。
  - [isTokenValid(String token)](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\util\JwtUtil.java#L53-L63)  
    → トークンが有効かどうか検証。

### 5. [JwtAuthenticationFilter](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\security\JwtAuthenticationFilter.java#L30-L79)

- **役割**: 各リクエストに対して JWT の検証と認証情報をセット。
- **主なメソッド**:
  - `doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)`
    - トークンをヘッダーから取得し、検証後、Spring Security のコンテキストに認証情報を設定。
  - [getTokenFromRequest(HttpServletRequest request)](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\security\JwtAuthenticationFilter.java#L72-L78)  
    → Bearer トークンを抽出。

### 6. [SecurityConfig](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\config\SecurityConfig.java#L23-L81)

- **役割**: Spring Security の設定。
- **主な設定**:
  - `/api/auth/**` は未認証でもアクセス可。
  - JWT フィルターを追加。
  - セッション管理をステートレスに設定。

### 7. [WebConfig](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\config\WebConfig.java#L7-L23)

- **役割**: インターセプターの設定。
- **主な設定**:
  - `/api/**` にはインターセプターを適用（ただし `/api/auth/login` は除く）。

### 8. [SecurityHandlerInterceptor](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\security\SecurityHandlerInterceptor.java#L23-L159)

- **役割**: リクエスト前後の処理（クリックジャッキング対策、トークン検証など）。
- **主なメソッド**:
  - [preHandle()](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\security\SecurityHandlerInterceptor.java#L27-L72) → リクエスト前にトークン検証やセキュリティヘッダー設定。
  - [postHandle()](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\security\SecurityHandlerInterceptor.java#L74-L93) → レスポンス時に新規トークンを発行。

---

## 🔄 実際の処理フロー

1. **フロントエンド POST `/api/auth/login`**

   - メールとパスワードを含む JSON リクエスト送信。

2. **AuthController#login()**

   - `authenticationService.getUserByEmail(email)` を呼び出し。
   - メールアドレスに該当するユーザーがいない場合、例外を投げる。

3. **AuthenticationService#checkPassword()**

   - 入力されたパスワードと DB に保存されているハッシュ値を照合。

4. **JwtUtil#generateToken()**

   - ユーザー情報に基づき JWT トークンを生成。

5. **SecurityFilterChain**

   - ログイン成功後、セキュリティ設定により次のリクエストにも JWT が必要になる。

6. **JwtAuthenticationFilter#doFilterInternal()**

   - 次回以降のリクエストで Authorization ヘッダーの Bearer トークンを検証。
   - 正しければ `SecurityContextHolder` に認証情報を設定。

7. **レスポンス返却**
   - [AuthResponse.of(...)](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\dto\AuthResponse.java#L43-L45) でトークン、メール、名前、ロールを含む JSON レスポンスを返す。

---

## ✅ 図解フロー

```
[Frontend]
     ↓ POST /api/auth/login (email + password)
[AuthController]
     ↓ authenticate & generate JWT
[AuthenticationService]
     ↓ getUserByEmail(), checkPassword()
[UserRepository]
     ↓ findByEmail()
[JwtUtil]
     ↓ generateToken()
[JwtAuthenticationFilter]
     ↓ set Authentication in SecurityContext
[SecurityConfig]
     ↓ secured API access control
[SecurityHandlerInterceptor]
     ↓ security headers & token handling
[Frontend Response]
     ← JSON {token, email, name, role}
```

---

このように、各層が協調しながら安全かつ状態を持たない JWT 方式での認証を実現しています。フロントエンド側では受け取ったトークンを次回リクエストの `Authorization: Bearer <token>` ヘッダーに含めることで、API へのアクセス権限を持つことができます。

### ログイン後フロントエンドへ返却するレスポンス情報

```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9.eyJyb2xlIjoidXNlciIsIm5hbWUiOiJIQUlKSUFORyBZQU8iLCJzdWIiOiJrYWlreW91QGdtYWlsLmNvbSIsImlhdCI6MTc1MTQ0MTg2NiwiZXhwIjoxNzUxNTI4MjY2fQ.55uXNChBV8Ku6c31ZX06-x8UEuDaYL3LQ_HPa_usVQ5ufcLDMIXTLdSDm3QOlfKlGusRLOP8TIgOlRvd9cFS3g",
  "email": "kaikyou@gmail.com",
  "name": "HAIJIANG YAO",
  "role": "user"
}
```
