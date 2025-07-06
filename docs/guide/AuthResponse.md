# AuthResponse レスポンス構造

### (src/main/java/com/example/orgchart_api/dto/AuthResponse.java)

```java
/*
 * Copyright (c) 2025, kaikyou DX, LIMITED All Rights Reserved.
 *
 *
 * AuthResponse.java
 *
 * @date 2025/06/30
 * @version 1.0
 * @author kaikyou
 */

package com.example.orgchart_api.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.util.Map;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 認証成功時のレスポンス形式
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "認証成功時のレスポンス")
public class AuthResponse {
    @Schema(description = "発行されたJWTトークン", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx")
    private String token;

    @Schema(description = "ユーザーのメールアドレス", example = "test@example.com")
    private String email;

    @Schema(description = "ユーザー名", example = "山田 太郎")
    private String name;

    @Schema(description = "ロール情報", example = "user")
    private String role;

    @Schema(description = "その他の詳細情報（任意）", hidden = true)
    private Map<String, Object> details;

    // ✅ 簡潔なインスタンス生成用ファクトリー（静的メソッド）
    public static AuthResponse of(String token, String email, String name, String role) {
        return new AuthResponse(token, email, name, role, null);
    }

    public static AuthResponse of(String token, String email, String name, String role, Map<String, Object> details) {
        return new AuthResponse(token, email, name, role, details);
    }
}

```

#### 已深度思考

> この AuthResponse クラスは、認証成功時のレスポンスデータを格納するための DTO（Data Transfer Object）です。主にログインやユーザー登録後の認証情報をクライアントに返すために使用されます。
> クラスの役割:

- 認証処理が成功した際に、クライアントに返すデータ構造を定義する。
- Swagger（OpenAPI）のドキュメンテーションと連携し、API レスポンスの仕様を明確にする。
  > フィールドの分析:
  >
  > 1. token (String 型)
       - 説明: 発行されたJWTトークン
       - Swagger注釈: @Schemaで説明と例を設定。APIドキュメントに表示される。
       - 例: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx"
  > 2. email (String 型)
       - 説明: ユーザーのメールアドレス
       - Swagger注釈: あり。例: "test@example.com"
  > 3. name (String 型)
       - 説明: ユーザーの名前
       - Swagger注釈: あり。例: "山田 太郎"
  > 4. role (String 型)
       - 説明: ユーザーのロール（権限）
       - Swagger注釈: あり。例: "user"
  > 5. details (Map<String, Object>型)
       - 説明: その他の詳細情報（任意）
       - Swagger注釈: `hidden = true` と設定されているため、APIドキュメントには表示されない。
  > メソッドの分析:
  >
  > 1. コンストラクタ
       - クラスにはLombokの`@AllArgsConstructor`と`@NoArgsConstructor`が付与されているため、以下のコンストラクタが自動生成される。
         - 全フィールドを引数に取るコンストラクタ
         - デフォルトコンストラクタ
  > 2. 静的ファクトリメソッド `of`
       - 2つのオーバーロードされたメソッドが定義されている。
         - メソッド1: token, email, name, role を引数に取り、detailsをnullとしてAuthResponseを生成。
         ```java
         public static AuthResponse of(String token, String email, String name, String role) {
             return new AuthResponse(token, email, name, role, null);
         }
         ```
         - メソッド2: 上記4つに加えてdetailsマップも引数に取り、AuthResponseを生成。
         ```java
         public static AuthResponse of(String token, String email, String name, String role, Map<String, Object> details) {
             return new AuthResponse(token, email, name, role, details);
         }
         ```
       - 役割: 簡潔にオブジェクトを生成するためのユーティリティメソッド。特に、detailsが不要な場合に便利。
  > Swagger ドキュメンテーション:
- クラスレベル: `@Schema(description = "認証成功時のレスポンス")` → API ドキュメントでこの DTO が認証成功時のレスポンスであることを説明。
- 各フィールド: `@Schema`注釈でフィールドごとの説明と例を提供。ただし、`details`は`hidden=true`のためドキュメントに表示されない。
  > 使用例:
- ユーザー登録やログインの API が成功した場合、この DTO のインスタンスが JSON 形式でクライアントに返される。
- 例:
  `json
    {
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
        "email": "test@example.com",
        "name": "山田 太郎",
        "role": "user"
    }
    `
  > 注意点:
- `details`フィールドは任意の追加情報を格納できるが、Swagger ドキュメントには表示されない。そのため、クライアント開発者に非公開の情報や、動的に変わる情報を渡す用途が想定される。

### AuthResponse クラスの分析

#### クラスの役割

AuthResponse は **認証成功時のレスポンスデータを格納する DTO（Data Transfer Object）** として設計されており、主に以下の目的で使用されます：

1. JWT 認証成功時の統一されたレスポンス形式を提供
2. クライアントに必要な認証情報を構造化して返却
3. Swagger/OpenAPI ドキュメンテーションとの統合
4. 認証結果の標準化と拡張性の確保

---

### フィールド分析

各フィールドには Swagger の`@Schema`アノテーションが付与され、API ドキュメンテーションが強化されています。

| フィールド | 型                  | 説明                         | Swagger 情報                                             |
| ---------- | ------------------- | ---------------------------- | -------------------------------------------------------- |
| `token`    | String              | 発行された JWT トークン      | 説明: "発行された JWT トークン", 例: JWT トークン文字列  |
| `email`    | String              | 認証ユーザーのメールアドレス | 説明: "ユーザーのメールアドレス", 例: "test@example.com" |
| `name`     | String              | 認証ユーザーの表示名         | 説明: "ユーザー名", 例: "山田 太郎"                      |
| `role`     | String              | ユーザーの権限ロール         | 説明: "ロール情報", 例: "user"                           |
| `details`  | Map<String, Object> | 追加の認証情報（任意）       | 説明: "その他の詳細情報", hidden: true                   |

---

### メソッド分析

#### 1. コンストラクタ

```java
@AllArgsConstructor
@NoArgsConstructor
```

- **@AllArgsConstructor**: 全フィールドを引数に取るコンストラクタを生成
- **@NoArgsConstructor**: デフォルトコンストラクタを生成
- **役割**: オブジェクトの柔軟なインスタンス化を可能にする

#### 2. ファクトリメソッド `of()`

```java
public static AuthResponse of(String token, String email, String name, String role) {
    return new AuthResponse(token, email, name, role, null);
}

public static AuthResponse of(String token, String email, String name, String role, Map<String, Object> details) {
    return new AuthResponse(token, email, name, role, details);
}
```

- **役割**: 簡潔なオブジェクト生成を提供
- **特徴**:
  - オーバーロードされた 2 つのバージョンを提供
  - `details`フィールドが不要な場合に簡潔な記述を可能にする
  - コンストラクタ呼び出しをカプセル化
- **使用例**:

  ```java
  // 基本情報のみ
  AuthResponse response = AuthResponse.of(token, email, name, role);

  // 追加情報を含む
  Map<String, Object> details = Map.of("department", "HR");
  AuthResponse response = AuthResponse.of(token, email, name, role, details);
  ```

---

### Swagger ドキュメンテーション

```java
@Schema(description = "認証成功時のレスポンス")
public class AuthResponse {
    @Schema(description = "発行されたJWTトークン", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.xxxxx")
    private String token;

    // ...他のフィールドの@Schema...
}
```

- **クラスレベル**:
  - 全体の説明: "認証成功時のレスポンス"
- **フィールドレベル**:
  - 各フィールドの詳細な説明
  - 実例データの提供（`example`属性）
  - `details`フィールドは`hidden=true`でドキュメント非表示

---

### クラスの特徴

1. **認証情報の包括的提供**:

   - 認証トークン
   - ユーザー基本情報（メール、名前、ロール）
   - 拡張可能な追加情報（details）

2. **ドキュメンテーション統合**:

   - Swagger アノテーションによる API 仕様の明文化
   - 実際の API レスポンス例をドキュメントに反映

3. **実用性と拡張性**:

   - Lombok によるボイラープレートコード削減
   - ファクトリメソッドによる簡潔なオブジェクト生成
   - 任意の追加データを格納可能な`details`マップ

4. **セキュリティ考慮**:
   - パスワードなどの機密情報を含まない設計
   - JWT トークンのみを返却

---

### 使用例（想定される API レスポンス）

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "email": "taro.yamada@example.com",
  "name": "山田 太郎",
  "role": "admin",
  "details": {
    "department": "人事部",
    "position": "マネージャー"
  }
}
```

---

### 改善提案

1. **列挙型の導入**:

   ```java
   public enum UserRole { USER, ADMIN }

   private UserRole role; // 文字列から列挙型に変更
   ```

2. **不変性の強化**:

   ```java
   @Value // Lombokの@Valueで不変オブジェクトに
   public class AuthResponse {
       // フィールドをfinalに
   }
   ```

3. **詳細情報の型安全化**:

   ```java
   public class AuthDetails {
       private String department;
       private String position;
   }

   private AuthDetails details; // Mapから専用オブジェクトに変更
   ```

この AuthResponse クラスは、認証 API の標準化とドキュメンテーションを効果的にサポートする、よく設計された DTO です。
