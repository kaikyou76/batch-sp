# RegisterController HTTP リクエスト処理

### (src/main/java/com/example/orgchart_api/controller/RegisterController.java)

```java
/*
 * Copyright (c) 2025, kaikyou DX, LIMITED All Rights Reserved.
 *
 *
 * RegisterController.java
 *
 * @date 2025/06/29
 * @version 1.0
 * @author kaikyou
 */
package com.example.orgchart_api.controller;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.AuthResponse;
import com.example.orgchart_api.service.AuthenticationService;
import com.example.orgchart_api.util.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@Tag(name = "登録 API", description = "新規ユーザー登録用API")
public class RegisterController {

 private final AuthenticationService authenticationService;
 private final JwtUtil jwtUtil;

 @Autowired
 public RegisterController(AuthenticationService authenticationService, JwtUtil jwtUtil) {
     this.authenticationService = authenticationService;
     this.jwtUtil = jwtUtil;
 }

 @PostMapping("/register")
 @Operation(
     summary = "ユーザー登録",
     description = "新規ユーザーを登録し、自動的にログインしてJWTトークンを発行します。",
     responses = {
         @ApiResponse(responseCode = "200", description = "登録成功", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
         @ApiResponse(responseCode = "400", description = "登録エラー", content = @Content(mediaType = "application/json"))
     }
 )
 public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
     try {
         User user = authenticationService.register(
                 request.getEmail(),
                 request.getName(),
                 request.getPassword()
         );

         Map<String, Object> claims = new HashMap<>();
         claims.put("role", user.getRole());
         claims.put("name", user.getName());

         String token = jwtUtil.generateToken(claims, user.getEmail());

         return ResponseEntity.ok(AuthResponse.of(token, user.getEmail(), user.getName(), user.getRole()));
     } catch (Exception e) {
         throw new RuntimeException(e);
     }
 }
}
```

#### 已深度思考

> このクラスはユーザー登録を処理するコントローラーです。`/api/register` エンドポイントを提供し、新規ユーザーを登録すると同時にログイン状態（JWT トークンの発行）も行います。
> クラスの役割:

- ユーザー登録リクエストを受け付け、認証サービスを呼び出してユーザーを登録する。
- 登録が成功したら、そのユーザーの情報を含む JWT トークンを生成し、クライアントに返す。
  > フィールド:
- `authenticationService`: ユーザー登録のビジネスロジックを担当するサービス
- `jwtUtil`: JWT トークンの生成を行うユーティリティ
  > メソッドの分析:
  >
  > 1. コンストラクタ:


    ```java
    @Autowired
    public RegisterController(AuthenticationService authenticationService, JwtUtil jwtUtil) {
        this.authenticationService = authenticationService;
        this.jwtUtil = jwtUtil;
    }
    ```
    - 依存性注入（DI）により`AuthenticationService`と`JwtUtil`のインスタンスを受け取る。

> 2. `register`メソッド:

    ```java
    @PostMapping("/register")
    @Operation(
        summary = "ユーザー登録",
        description = "新規ユーザーを登録し、自動的にログインしてJWTトークンを発行します。",
        responses = {
            @ApiResponse(responseCode = "200", description = "登録成功", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
            @ApiResponse(responseCode = "400", description = "登録エラー", content = @Content(mediaType = "application/json"))
        }
    )
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
        try {
            User user = authenticationService.register(
                    request.getEmail(),
                    request.getName(),
                    request.getPassword()
            );

>             Map<String, Object> claims = new HashMap<>();

            claims.put("role", user.getRole());
            claims.put("name", user.getName());

>             String token = jwtUtil.generateToken(claims, user.getEmail());
>             return ResponseEntity.ok(AuthResponse.of(token, user.getEmail(), user.getName(), user.getRole()));

        } catch (Exception e) {
            throw new RuntimeException(e);
        }
    }
    ```
    - **アノテーション**:
        - `@PostMapping("/register")`: `/api/register`へのPOSTリクエストを処理する。
        - `@Operation`: OpenAPI（Swagger）用のメタデータ。このメソッドの概要やレスポンスを定義。
        - `@RequestBody`: リクエストボディを`RegisterRequest`オブジェクトにマッピング。

>     - **処理の流れ**:

        1. `authenticationService.register`を呼び出し、リクエストから得たメールアドレス、名前、パスワードでユーザーを登録する。
        2. 登録に成功すると、登録されたユーザー情報（`User`オブジェクト）が返される。
        3. JWTトークンのクレームとしてユーザーの役割（role）と名前（name）を設定する。
        4. `jwtUtil.generateToken`でクレームとサブジェクト（メールアドレス）を含むトークンを生成する。
        5. 生成したトークンとユーザー情報（メールアドレス、名前、役割）を`AuthResponse`オブジェクトに詰め、HTTP 200レスポンスとして返す。

>     - **エラーハンドリング**:

        - 例外が発生した場合は`RuntimeException`としてスローされる。ただし、実際のアプリケーションではより適切な例外処理（例: 特定の例外クラスを投げる、エラーレスポンスを返す）が望ましい。

> 補足:

- `RegisterRequest`クラスはリクエストボディの構造を表す（コードは提示されていないが、おそらく email, name, password のフィールドを持つ）。
- `AuthResponse`クラスはレスポンスの構造を表す（トークン、メールアドレス、名前、役割を含む）。
  > 改善点の提案:
- 現在、例外が発生した場合に`RuntimeException`をスローしているが、コントローラー内で例外をキャッチして適切なエラーレスポンス（例: HTTP 400 Bad Request）を返すべき。
- 登録時に発生しうる具体的な例外（例: メールアドレスが既に存在する）をハンドリングし、クライアントに詳細なエラーメッセージを返すと親切。

## RegisterController クラスの分析

### クラスの役割

RegisterController は **ユーザー登録機能を提供する REST コントローラー** で、以下の主要な役割を持ちます：

1. 新規ユーザー登録処理の実行
2. 登録後の自動ログインと JWT トークン発行
3. Swagger/OpenAPI による API ドキュメンテーションの提供
4. クライアントへの認証情報の返却

### メソッド詳細分析

---

#### 1. コンストラクタ

```java
@Autowired
public RegisterController(AuthenticationService authenticationService, JwtUtil jwtUtil) {
    this.authenticationService = authenticationService;
    this.jwtUtil = jwtUtil;
}
```

- **役割**: 依存性注入
- **注入されるコンポーネント**:
  - `AuthenticationService`: ユーザー登録ビジネスロジックを担当
  - `JwtUtil`: JWT トークン生成ユーティリティ

---

#### 2. register() メソッド

```java
@PostMapping("/register")
@Operation(
    summary = "ユーザー登録",
    description = "新規ユーザーを登録し、自動的にログインしてJWTトークンを発行します。",
    responses = {
        @ApiResponse(responseCode = "200", description = "登録成功", content = @Content(mediaType = "application/json", schema = @Schema(implementation = AuthResponse.class))),
        @ApiResponse(responseCode = "400", description = "登録エラー", content = @Content(mediaType = "application/json"))
    }
)
public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest request) {
    try {
        // 1. ユーザー登録処理
        User user = authenticationService.register(
                request.getEmail(),
                request.getName(),
                request.getPassword()
        );

        // 2. JWTクレームの準備
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", user.getRole());
        claims.put("name", user.getName());

        // 3. JWTトークン生成
        String token = jwtUtil.generateToken(claims, user.getEmail());

        // 4. レスポンス作成
        return ResponseEntity.ok(AuthResponse.of(token, user.getEmail(), user.getName(), user.getRole()));
    } catch (Exception e) {
        throw new RuntimeException(e);
    }
}
```

##### 処理フロー

1. **ユーザー登録**:

   - `AuthenticationService.register()`を呼び出し
   - リクエストから取得した email, name, password を渡す
   - 登録された`User`エンティティを取得

2. **JWT クレーム準備**:

   - ユーザーのロール(`role`)と名前(`name`)をクレームとして追加
   - 例: `{"role": "USER", "name": "John Doe"}`

3. **トークン生成**:

   - `JwtUtil.generateToken()`でクレームを含む JWT を生成
   - サブジェクト(Subject)にはユーザーの email を設定

4. **レスポンス作成**:
   - 生成したトークンとユーザー情報を`AuthResponse`オブジェクトに格納
   - HTTP 200 OK でクライアントに返却

##### Swagger アノテーション

- `@Operation`: API のメタデータ定義
  - summary: 簡潔な説明
  - description: 詳細な機能説明
  - responses: レスポンス仕様
- `@ApiResponse`: ステータスコードごとのレスポンス定義
  - 成功時(200): `AuthResponse`スキーマ
  - エラー時(400): エラーコンテンツ

---

### クラスの特徴

1. **ワンステップ認証フロー**:

   - 登録とログインを単一の API で実現
   - ユーザー登録後、即時ログイン状態になる

2. **JWT クレームのカスタマイズ**:

   - ユーザーのロールと名前をトークンに埋め込み
   - クライアント側でユーザー情報を取得可能に

3. **RESTful 設計**:

   - POST メソッドでリソース作成を表現
   - 適切な HTTP ステータスコード(200/400)を返却

4. **ドキュメンテーション統合**:
   - Swagger アノテーションによる API 仕様の明文化
   - クライアント開発者向けの明確なインターフェース提供

---

### 使用される DTO クラス（推測）

#### RegisterRequest

```java
public class RegisterRequest {
    private String email;
    private String name;
    private String password;
    // getters/setters
}
```

#### AuthResponse

```java
public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String role;

    public static AuthResponse of(String token, String email, String name, String role) {
        // インスタンス生成ロジック
    }
    // getters
}
```

---

### 改善提案

1. **例外処理の強化**:

   ```java
   catch (EmailAlreadyExistsException ex) {
       return ResponseEntity.status(HttpStatus.CONFLICT).body(...);
   }
   catch (InvalidDataException ex) {
       return ResponseEntity.badRequest().body(...);
   }
   ```

2. **パスワードセキュリティ**:

   - コントローラーで平文パスワードを扱わないようサービス層で暗号化

3. **ロギングの追加**:

   ```java
   logger.info("New user registered: {}", request.getEmail());
   ```

4. **バリデーション追加**:
   ```java
   public ResponseEntity<AuthResponse> register(
           @Valid @RequestBody RegisterRequest request) {
       // ...
   }
   ```

このコントローラーはユーザー登録と認証を効率的に統合し、モダンな API 設計原則に沿った実装となっています。
