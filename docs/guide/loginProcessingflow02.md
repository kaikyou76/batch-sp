# ⭐️ ⭐️ ⭐️ ⭐️ ⭐️ ログイン処理フローの詳細

#### 已深度思考

> このログインリクエストが Spring Boot アプリケーションに到達したときの処理の流れを、クラスの順番に沿って説明します。
>
> 1. 最初にリクエストを受け取るのは、Spring Security のフィルターチェーンです。具体的には`SecurityConfig`で設定されたフィルターが順に適用されます。

    - `SecurityConfig`の`securityFilterChain`メソッドで設定したフィルターの順序が重要です。
    - ログインリクエスト（/api/auth/login）は、`SecurityConfig`の設定で`permitAll()`となっているため、認証不要として扱われます。

> 2. 次に、CORS の設定が適用されます。`SecurityConfig`内の`corsConfigurationSource`で設定した CORS ポリシーが適用され、フロントエンド（http://localhost:3000）からのリクエストを許可します。
> 3. CSRF 保護は無効化されているため、CSRF チェックはスキップされます。
> 4. フィルターの順序として、`JwtAuthenticationFilter`が`UsernamePasswordAuthenticationFilter`の前に追加されています。しかし、ログインリクエスト（/api/auth/login）は`JwtAuthenticationFilter`内でスキップされます。

    - `JwtAuthenticationFilter`の`doFilterInternal`メソッド内で、リクエストパスが`/api/register`または`/api/auth/login`（この場合はログイン）の場合、フィルターをスキップして次のフィルターに進みます。

> 5. ログインリクエストは認証不要パスなので、`SecurityFilterChain`の設定により、直接`AuthController`の`login`メソッドが呼び出されます。
> 6. `AuthController`の`login`メソッドが実行され、`AuthenticationService`を使ってユーザー認証を行います。
> 7. `AuthenticationService`はデータベースからユーザーを検索し、パスワードを照合します。
> 8. 認証が成功すると、`JwtUtil`を使って JWT トークンを生成します。
> 9. 生成されたトークンとユーザー情報を`AuthResponse`オブジェクトに詰めて、クライアントに返します。
> 10. 一方、`WebConfig`で設定した`SecurityHandlerInterceptor`は、`/api/**`のパスに適用されるインターセプターです。ただし、ログインリクエスト（/api/auth/login）は`excludePathPatterns`で除外されているため、このインターセプターは実行されません。
>     したがって、ログインリクエストが最初に通過するクラス（コンポーネント）の順序は以下のようになります：
> 11. `SecurityConfig`で設定されたフィルターチェーン（CORS フィルター、CSRF フィルター、JwtAuthenticationFilter など）を通るが、JwtAuthenticationFilter はログインリクエストをスキップ。
> 12. その後、`AuthController`の`login`メソッドが呼び出される。
>     ただし、インターセプター（`SecurityHandlerInterceptor`）は除外パターンのためスキップされます。
>     具体的な順序を整理すると：
> 13. CORS フィルター（`SecurityConfig`の CORS 設定）
> 14. `JwtAuthenticationFilter`（ただし、ログインリクエストの場合は内部でスキップ）
> 15. ディスパッチャーサーブレットを経由して、コントローラー（`AuthController`）のメソッド実行
>     補足：`WebConfig`のインターセプターは、除外パスであるため実行されません。
>     よって、リクエストが通過する主要なコンポーネントの順序は：
> 16. `SecurityConfig`の CORS 設定
> 17. `JwtAuthenticationFilter`（スキップされるが通過はする）
> 18. `AuthController`

Spring Boot アプリケーションで`http://localhost:3000/login`から送信されたログインリクエストが処理される順序は以下の通りです。**認証不要エンドポイント**であるため、認証関連フィルターをスキップする点に注意してください。

### リクエスト処理の順序

1. **`SecurityConfig` (Spring Security フィルターチェーン)**

   - 最初にリクエストを受信
   - `corsConfigurationSource()`で CORS 設定を適用（フロントエンドからのアクセス許可）
   - `/api/auth/**`は`permitAll()`のため認証不要と判定
   - `JwtAuthenticationFilter`は**スキップ**（認証不要パスのため）

2. **`JwtAuthenticationFilter` (スキップされる)**

   - `doFilterInternal()`内のパスチェックで`/api/auth/login`を検出
   - `filterChain.doFilter()`を即時実行（後続フィルターへ委譲）

3. **`WebConfig`のインターセプター (スキップされる)**

   - `SecurityHandlerInterceptor`は`/api/**`に適用されるが
   - `excludePathPatterns("/api/auth/login")`で除外されるため実行されない

4. **`AuthController.login()`**
   - リクエストの実処理を担当
   - `AuthenticationService`で認証実行
   - 認証成功時`JwtUtil`でトークン生成
   - `AuthResponse`オブジェクトを返却

### 各コンポーネントの役割まとめ

| 順序 | クラス                    | 役割                                             | ログインリクエスト時の動作         |
| ---- | ------------------------- | ------------------------------------------------ | ---------------------------------- |
| 1    | `SecurityConfig`          | 全体のセキュリティ設定（CORS/CSRF/認可）         | CORS 適用後、認証不要と判定        |
| 2    | `JwtAuthenticationFilter` | JWT トークンの検証                               | **スキップ**（認証不要パスのため） |
| 3    | `WebConfig`               | インターセプター登録                             | 除外設定により**スキップ**         |
| 4    | `AuthController`          | ログイン処理の実装                               | 認証・トークン生成・レスポンス返却 |
| -    | `AuthenticationService`   | 認証ロジック（`AuthController`から呼び出し）     | DB 照合・パスワード検証            |
| -    | `JwtUtil`                 | JWT トークン操作（`AuthController`から呼び出し） | トークン生成                       |

### 補足ポイント

- **認証スキップの根拠**:  
  `SecurityConfig`の設定で`.requestMatchers("/api/auth/**").permitAll()`されているため、`JwtAuthenticationFilter`や Spring Security の認証プロセスがバイパスされます。
- **インターセプター除外**:  
  `WebConfig`の`excludePathPatterns("/api/auth/login")`により、CSRF トークンチェックなどの追加処理が実行されません。

- **直接コントローラー到達**:  
  セキュリティフィルターをスキップした後、リクエストは直接`AuthController.login()`メソッドに到達し、ビジネスロジックが実行されます。

このフローにより、フロントエンドからのログインリクエストは最小限のセキュリティチェック（CORS のみ）を経由して効率的に処理されます。
