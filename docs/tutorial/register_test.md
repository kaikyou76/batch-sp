# register ユーザー登録テスト

### 1. mvnd（Maven Daemon）を停止する

```bash
mvnd --stop
```

### 2. mvnd が保持しているビルドキャッシュや状態ファイルをリセットするため、指定されたフォルダ（1.0.2）を強制的に再帰削除します。

```bash
Remove-Item -Recurse -Force "C:\Users\kaikyou\.m2\mvnd\registry\1.0.2"
```

### 3. Maven Daemon を使って Spring Boot アプリケーションを起動します。

```bash
mvnd spring-boot:run
```

### 4. ユーザー登録の HTTP POST リクエストを送信するテスト

```bash
$body = @{
    email = "test@example.com"
    name = "テストユーザー"
    password = "password123"
} | ConvertTo-Json

Invoke-WebRequest -Uri "http://localhost:8081/api/register" `
    -Method Post `
    -Body $body `
    -ContentType "application/json"
```
