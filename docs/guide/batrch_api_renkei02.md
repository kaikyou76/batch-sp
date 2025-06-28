# トークン作成テスト

### テストコマンド

```bash
curl.exe -v `
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" `
  -H "Accept: application/json" `
  http://localhost:8080/api/auth/generate-token

```

### 実行結果

```
PS D:\nextjs_orgchart_api> curl.exe -v `
>>   -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" `
>>   -H "Accept: application/json" `
>>   http://localhost:8080/api/auth/generate-token
* Host localhost:8080 was resolved.
* IPv6: ::1
* IPv4: 127.0.0.1
*   Trying [::1]:8080...
* Connected to localhost (::1) port 8080
* using HTTP/1.x
> GET /api/auth/generate-token HTTP/1.1
> Host: localhost:8080
> User-Agent: curl/8.12.1
> Authorization: Basic YWRtaW46cGFzc3dvcmQ=
> Accept: application/json
>
* Request completely sent off
< HTTP/1.1 200
< Vary: Origin
< Vary: Access-Control-Request-Method
< Vary: Access-Control-Request-Headers
< Set-Cookie: JSESSIONID=BF49B5DFFA4DDD5C6A4354F24AB053A6; Path=/; HttpOnly
< X-FRAME-OPTIONS: DENY
< _RequestVerificationToken: 96b09862-d818-4416-b9b2-3a54a7b0899a
< Access-Control-Expose-Headers: _RequestVerificationToken
< X-Content-Type-Options: nosniff
< X-XSS-Protection: 0
< Cache-Control: no-cache, no-store, max-age=0, must-revalidate
< Pragma: no-cache
< Expires: 0
< Content-Length: 0
< Date: Thu, 26 Jun 2025 11:52:47 GMT
<
* Connection #0 to host localhost left intact
PS D:\nextjs_orgchart_api>
```

リクエストは成功しており、トークンが正しく生成されています。レスポンスから以下の重要な情報が得られました：

### 1. 生成されたトークン

```http
_RequestVerificationToken: 96b09862-d818-4416-b9b2-3a54a7b0899a
```

### 2. セッション情報

```http
Set-Cookie: JSESSIONID=BF49B5DFFA4DDD5C6A4354F24AB053A6; Path=/; HttpOnly
```

### 3. 成功の確認ポイント

- **HTTP ステータスコード**: `200 OK`
- **CORS 設定**:
  ```http
  Access-Control-Expose-Headers: _RequestVerificationToken
  ```
- **セキュリティヘッダー**:
  ```http
  X-FRAME-OPTIONS: DENY
  X-Content-Type-Options: nosniff
  ```

### このトークンの使用方法

#### バッチジョブ実行時（例）

```powershell
curl.exe -v `
  -H "Authorization: Basic YWRtaW46cGFzc3dvcmQ=" `
  -H "_RequestVerificationToken: 96b09862-d818-4416-b9b2-3a54a7b0899a" `
  -H "Content-Type: application/json" `
  -X POST `
  http://localhost:8080/api/batch/run-human-resource-job
```

### 注意事項

1. **トークンの有効期間**:

   - このトークンはセッション（`JSESSIONID`）に紐づいています
   - セッションが無効になるとトークンも無効になります

2. **ワンタイムトークン**:

   - `BatchJobController`では`@TokenHandler(validate = TokenValidateType.REMOVE)`が指定されているため、トークン使用後は自動的に無効化されます

3. **次のリクエストで必要な処理**:
   ```javascript
   // フロントエンドでの実装例
   fetch("/api/auth/generate-token").then((res) => {
     const newToken = res.headers.get("_RequestVerificationToken");
     // 新しいトークンを保存
   });
   ```

このレスポンスは、あなたのセキュリティ機構（CSRF 対策）が正しく機能していることを示しています。
