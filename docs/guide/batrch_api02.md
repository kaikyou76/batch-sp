# バッチ実行 API に対して「認証」「ワンタイムトークン検証」「非同期処理」の連携フロー

以下に、これらのファイルが連携して処理を行う際の**フロー順序と相互作用**を詳細に説明します。CSRF トークン管理とバッチ処理の連携に焦点を当てています。

---

### **1. 全体フローの概要図**

```
[クライアント]
→ (リクエスト送信)
→ [SecurityFilterChain]
→ [SecurityHandlerInterceptor]
→ [TokenManager]
→ [BatchJobController]
→ [Spring Batch実行]
```

---

### **2. 処理の詳細ステップ**

#### **ステップ 1: クライアントからのリクエスト受信**

- **URL**: `POST /api/batch/run-human-resource-job?_RequestVerificationToken=xxxx`
- **HTTP メソッド**: POST
- **必須パラメータ**: `_RequestVerificationToken` (CSRF トークン)

#### **ステップ 2: Spring Security のフィルタチェーン通過 (`SecurityConfig`)**

```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(AbstractHttpConfigurer::disable) // CSRF無効化（※TokenHandlerで独自管理）
        .authorizeHttpRequests(auth -> auth
            .anyRequest().authenticated() // 認証必須
        );
}
```

- **重要なポイント**:
  - `csrf().disable()` されているが、`TokenHandler` で独自の CSRF 対策を実装。
  - 基本認証 (`httpBasic`) が有効。

#### **ステップ 3: インターセプターによる前処理 (`SecurityHandlerInterceptor`)**

```java
public boolean preHandle(HttpServletRequest request, ...) {
    // 1. クリックジャッキング対策ヘッダー設定
    response.setHeader("X-FRAME-OPTIONS", "SAMEORIGIN");

    // 2. トークン検証（TokenHandlerアノテーションを解析）
    TokenValidateType type = getValidateTokenType(handlerMethod);
    if (!type.equals(TokenValidateType.NONE)) {
        boolean isValid = TokenManager.validate(request, tokenName, removeToken);
        if (!isValid) response.sendError(400, "Bad token");
    }
}
```

- **動作**:
  1. `@TokenHandler` アノテーションから `validate = REMOVE` を検出。
  2. `TokenManager` でセッションとリクエストのトークンを照合。
  3. 検証失敗時は即時エラー応答。

#### **ステップ 4: トークン管理 (`TokenManager`)**

```java
public static boolean validate(HttpServletRequest request, String tokenName, boolean removeToken) {
    String sessionToken = getSessionToken(request, tokenName); // セッションから取得
    String requestToken = request.getParameter(tokenName);     // リクエストから取得

    if (sessionToken.equals(requestToken)) {
        if (removeToken) removeSessionToken(request, tokenName); // REMOVE時は削除
        return true;
    }
    return false;
}
```

- **トークンのライフサイクル**:
  - 生成: `UUID.randomUUID()`
  - 保存: HTTP セッションに格納
  - 削除: `REMOVE` 指定時のみ

#### **ステップ 5: バッチ処理の実行 (`BatchJobController`)**

```java
@TokenHandler(save=true, validate=REMOVE, handleError=true)
@PostMapping("/run-human-resource-job")
public ResponseEntity<String> runHumanResourceJob(...) {
    jobLauncher.run(humanResourceBatchJob, jobParameters);
    return ResponseEntity.accepted().body("ジョブ開始");
}
```

- **連携条件**:
  - トークン検証成功時のみ処理継続。
  - バッチパラメータにタイムスタンプ付与。

#### **ステップ 6: 非同期バッチ実行 (`BatchConfig`)**

```java
@Bean
public TaskExecutor taskExecutor() {
    ThreadPoolTaskExecutor executor = new ThreadPoolTaskExecutor();
    executor.setCorePoolSize(5); // 並列処理用スレッドプール
}
```

- **スレッド管理**:
  - バックグラウンドでジョブを実行。
  - リクエストスレッドとは分離。

#### **ステップ 7: レスポンス返却**

- **成功時**: `202 Accepted` + メッセージ
- **失敗時**: `500 Internal Server Error` + エラー詳細

---

### **3. ファイル間の依存関係**

| ファイル                     | 主な役割                 | 依存先                              |
| ---------------------------- | ------------------------ | ----------------------------------- |
| `BatchJobController`         | バッチ起動エンドポイント | `TokenHandler`, `JobLauncher`       |
| `SecurityHandlerInterceptor` | リクエストインターセプト | `TokenManager`, `TokenValidateType` |
| `TokenManager`               | トークン生成/検証        | セッション管理                      |
| `TokenHandler`               | アノテーション定義       | `TokenValidateType`                 |
| `BatchConfig`                | スレッドプール設定       | Spring Batch                        |

---

### **4. 典型的なユースケース例**

#### **ケース 1: 正常なバッチ実行**

1. クライアントがトークン付きでリクエスト
2. インターセプターがトークンを検証（セッション vs リクエスト）
3. 検証成功 → バッチジョブ起動 → トークン削除（REMOVE）
4. `202 Accepted` を返却

#### **ケース 2: 無効なトークン**

1. トークン不一致 or 未送信
2. インターセプターが `400 Bad Request` で即時終了
3. コントローラーの処理は実行されない

#### **ケース 3: 並列リクエスト**

1. 同じトークンで連続リクエスト
2. 1 回目: 成功（トークン REMOVE）
3. 2 回目: トークン不在で失敗

---

### **5. 設計上の特徴**

1. **CSRF 対策の独自実装**:
   - Spring Security のデフォルト CSRF を無効化し、`TokenHandler`で柔軟に制御。
2. **ワンタイムトークン**:
   - `REMOVE` 指定により、トークンの再利用を防止。
3. **非同期バッチ実行**:
   - 即時応答とバックグラウンド処理を分離。
4. **拡張性**:
   - `TokenValidateType` に新しい動作を追加可能（例: `EXPIRE_AFTER_10MIN`）。

この連携により、セキュアでスケーラブルなバッチ処理 API が実現されています。
