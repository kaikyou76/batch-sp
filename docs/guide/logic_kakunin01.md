# 既存ロジックの確認

フロントエンドからの`http://localhost:3000/login`リクエストに対応するためのバックエンド実装はすでに整っています。特に、[AuthController](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\AuthController.java#L31-L74)クラスの`/api/auth/login`エンドポイントがログイン処理を担当しており、JWT トークンを返却します。

### 確認事項

1. **フロントエンドのリクエスト先**

   - フロントエンドで送信されるログインリクエストは`/api/auth/login`に POST しています。
   - このパスは Spring Boot アプリケーションの[AuthController](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\AuthController.java#L31-L74)と一致しています。

2. **ログイン成功時のレスポンス**

   - 成功した場合、[AuthResponse](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\dto\AuthResponse.java#L22-L50)オブジェクトが JSON 形式で返され、その中に JWT トークン、メールアドレス、ユーザー名、ロールが含まれます。

3. **セキュリティ設定**

   - Spring Security の設定（[SecurityConfig](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\config\SecurityConfig.java#L23-L81)）により、`/api/auth/**`および`/api/register`へのアクセスは認証不要です。
   - それ以外の API（例：`/api/batch/**`）は認証が必要です。

4. **CORS 設定**

   - `http://localhost:3000`からのリクエストは許可されています。

5. **フロントエンドでのトークン管理**
   - フロントエンドではログイン成功時に受け取ったトークンを保存し、以降の認証が必要なリクエストに`Authorization`ヘッダーで付与する必要があります。

### 備考

- 現在の`AuthController#login`メソッドでは、不正なメールまたはパスワードの場合にランタイム例外をスローしています。これは改善の余地があり、適切な HTTP ステータスコード（例：401 Unauthorized）を返すように修正することをお勧めします。
- また、ログイン成功後のリダイレクト先（例：`/batch`）がフロントエンドに存在しているか確認してください。

以上より、現状の実装ではフロントエンドから`http://localhost:3000/login`にリクエストを送ることに対して問題ありません。追加の調整や機能拡張が必要であればお知らせください。
