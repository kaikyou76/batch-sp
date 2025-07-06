# ⭐️ ⭐️ ⭐️ ⭐️ ⭐️ 登録処理フローの詳細

#### 已深度思考

> 与えられたコードベースの中で、`http://localhost:3000/register`からのリクエスト（新規ユーザー登録リクエスト）が最初に処理される場所は、Spring Security のフィルターチェーンです。具体的には、`SecurityConfig`クラスで定義されたフィルターチェーンが最初にリクエストを処理します。
>
> ### 処理の流れ

1. **クライアント（React アプリ）** が`/api/register`エンドポイントに POST リクエストを送信します。
2. **Spring Security フィルターチェーン** がリクエストをインターセプトします。`SecurityConfig`クラスの`securityFilterChain`メソッドで設定されたフィルターチェーンが適用されます。
3. **CORS 設定**: `SecurityConfig`の`corsConfigurationSource`で設定された CORS ポリシーが適用されます。オリジン`http://localhost:3000`は許可されているため、CORS チェックを通過します。
4. **CSRF 無効化**: CSRF 保護が無効化されているため、CSRF チェックは行われません。
5. **認可設定**: `SecurityConfig`の`authorizeHttpRequests`で、`/api/register`は認証不要（permitAll）と設定されているため、認証チェックはスキップされます。
6. **JwtAuthenticationFilter**: フィルターチェーンに追加された`JwtAuthenticationFilter`が実行されます。ただし、このフィルター内でリクエストパスが`/api/register`を含む場合はフィルター処理をスキップするようになっています（`JwtAuthenticationFilter`の`doFilterInternal`メソッド参照）。したがって、JWT 認証は行われません。
7. **Controller へのルーティング**: フィルターチェーンを通過したリクエストは、`RegisterController`の`register`メソッドに到達し、処理されます。
   > ### 結論
   >
   > したがって、`http://localhost:3000/register`からのリクエストは、最初に**SecurityConfig クラスで設定されたフィルターチェーン**によって処理され、その後`RegisterController`に渡されます。フィルターチェーン内で認証はスキップされ、コントローラーで登録処理が行われます。
   >
   > ### 補足: 他のコンポーネントの役割

- **WebConfig**: インターセプターを登録していますが、登録エンドポイント（`/api/register`）は`SecurityHandlerInterceptor`の適用対象（`/api/**`）に含まれます。しかし、`SecurityConfig`のフィルターチェーンを通った後、DispatcherServlet に到達した段階でインターセプターが実行されます。ただし、`RegisterController`の`register`メソッドには`TokenHandler`アノテーションが付いていないため、`SecurityHandlerInterceptor`によるトークンチェックは行われません（プリハンドルで特に処理されず`true`が返る）。
- **その他のクラス**: リクエストの処理に関しては、上記のフィルターチェーンとコントローラーが主要な役割を果たします。`User`、`AuthResponse`、`JwtUtil`、`AuthenticationService`などは、コントローラーから呼び出されて登録処理を実行するためのコンポーネントです。
  > 以上のことから、最初にリクエストを検証処理するのは**SecurityConfig**のフィルターチェーン（特に CORS や認可設定）です。

`http://localhost:3000/register` からのリクエストが最初に検証処理されるのは、**SecurityConfig クラス**です。以下にその理由と処理フローを詳細に説明します：

### 処理フローの詳細

1. **最初の関門: Spring Security フィルターチェーン**

   - クライアント(React アプリ)から送信されたリクエストは、Spring Security のフィルターチェーンで最初に処理されます
   - `SecurityConfig.securityFilterChain()` メソッドで構成されたセキュリティ設定が適用されます

2. **SecurityConfig の処理内容:**

   ```java
   .authorizeHttpRequests(auth -> auth
       .requestMatchers("/api/register").permitAll()
       // ...その他の設定
   )
   ```

   - `/api/register` パスは `permitAll()` で設定されており、認証不要でアクセス可能
   - CORS 設定で `http://localhost:3000` が許可されている
   - CSRF 保護は無効化（JWT 認証では不要）
   - JWT フィルターは登録パスをスキップ

3. **他のコンポーネントとの関係:**
   - `WebConfig` のインターセプター: `/api/**` パターンにマッチするが、`/api/register` も対象になる
   - `SecurityHandlerInterceptor`: プリハンドルで処理されるが、`TokenHandler`アノテーションがないため実質的な検証は行われない
   - `JwtAuthenticationFilter`: `/api/register` を明示的にスキップ

### 各コンポーネントの役割比較

| コンポーネント             | リクエスト検証の関与 | 登録リクエストへの影響   |
| -------------------------- | -------------------- | ------------------------ |
| **SecurityConfig**         | ⭐️ **最初に処理**   | アクセス許可を決定       |
| WebConfig                  | 2 番目に処理         | インターセプター登録のみ |
| SecurityHandlerInterceptor | 3 番目に処理         | トークンチェックなし     |
| JwtAuthenticationFilter    | 4 番目に処理         | 明示的にスキップ         |
| RegisterController         | 最後に処理           | 実際の登録処理           |

### 処理の流れの詳細図

```
クライアント
   ↓ (POST /api/register)
[SecurityConfig] → CORSチェック → 認可設定(permitAll) → CSRF無効化
   ↓
[WebConfig] → インターセプター登録
   ↓
[SecurityHandlerInterceptor] → トークンチェックなし
   ↓
[JwtAuthenticationFilter] → /api/register をスキップ
   ↓
[RegisterController] → 登録処理実行
```

### 特記事項

1. **SecurityConfig の優先順位**

   - Spring Security のフィルターチェーンは DispatcherServlet より前に位置する
   - セキュリティ関連のチェックはコントローラーに到達する前に完了する

2. **登録処理の特殊性**

   - 認証前のリクエストのため、認証系コンポーネントはスキップされる
   - `permitAll()`設定により、認証チェックは一切行われない

3. **CORS の重要性**
   - フロントエンド(3000 ポート)からバックエンド(8080 ポート)へのクロスオリジンリクエスト
   - SecurityConfig の CORS 設定がないとブラウザでブロックされる

結論として、**SecurityConfig クラス**が登録リクエストに対して最初に実行される検証処理を担当し、アクセス可否を決定します。その後のコンポーネントは、登録処理自体には関与しますが、リクエストの「検証」という観点では主要な役割を果たしません。
