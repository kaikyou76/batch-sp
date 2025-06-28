# TokenHandler

### (src/main/java/com/example/orgchart_api/security/TokenHandler.java)

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * TokenHandler.java
 *
 * @date 2013/08/15
 * @version 1.0
 * @author Yao Kaikyou
 */
package com.example.orgchart_api.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <pre>
 * ワンタイムトークン制御アノテーション
 *
 * 使用例:
 *   - save = true の場合、リクエスト時にトークンをセッションなどに保存
 *   - validate に指定がある場合、トークンの検証を実施
 *   - name にトークン名を指定可能（省略時は空文字）
 *   - handleError が true の場合、検証失敗時に自動エラーハンドリングを行う
 * </pre>
 *
 * @author Yao Kaikyou
 * @version 1.1 2025/06/13
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TokenHandler {

    /** トークンを生成する */
    boolean save() default false;

    /** トークンをValidateする */
    TokenValidateType validate() default TokenValidateType.NONE;

    /** トークンの名前を指定する */
    String name() default "";

    /** エラーのハンドリングを実装する */
    boolean handleError() default false;
}


```

このコードは、カスタムアノテーション `@TokenHandler` を定義する Java コードです。このアノテーションは、主に**ワンタイムトークン（CSRF 対策トークンなど）の生成・検証**を制御するために使用されます。以下に詳細な解説をします。

---

### **1. アノテーションの基本構造**

```java
@Target(ElementType.METHOD)  // メソッドに適用可能
@Retention(RetentionPolicy.RUNTIME)  // 実行時まで保持
public @interface TokenHandler { ... }
```

- **`@Target(ElementType.METHOD)`**  
  → このアノテーションは **メソッド** に対してのみ使用可能です（クラスやフィールドには使えない）。
- **`@Retention(RetentionPolicy.RUNTIME)`**  
  → アノテーションの情報が **実行時（Runtime）まで保持** され、リフレクションで取得可能です。

---

### **2. アノテーションのパラメータ**

`@TokenHandler` は以下の 4 つのオプションパラメータを持ちます。

#### **(1) `save()`**

```java
boolean save() default false;
```

- **用途**: トークンを生成してセッションなどに保存するかどうか。
- **デフォルト**: `false`（保存しない）。
- **例**:
  ```java
  @TokenHandler(save = true)  // トークンを生成＆保存
  public void someMethod() { ... }
  ```

#### **(2) `validate()`**

```java
TokenValidateType validate() default TokenValidateType.NONE;
```

- **用途**: トークンの検証方法を指定（`TokenValidateType` 列挙型で定義）。
- **デフォルト**: `NONE`（検証しない）。
- **主な検証タイプ**:
  - `NONE`: 検証しない。
  - `REMOVE`: 検証後にトークンを削除（ワンタイムトークン向け）。
  - `KEEP`: 検証後もトークンを保持（複数回使用可能なトークン向け）。
- **例**:
  ```java
  @TokenHandler(validate = TokenValidateType.REMOVE)  // 検証後に削除
  public void someMethod() { ... }
  ```

#### **(3) `name()`**

```java
String name() default "";
```

- **用途**: トークン名を指定（複数のトークンを区別する場合など）。
- **デフォルト**: 空文字（未指定）。
- **例**:
  ```java
  @TokenHandler(name = "tokenA")  // トークン名を "tokenA" に設定
  public void someMethod() { ... }
  ```

#### **(4) `handleError()`**

```java
boolean handleError() default false;
```

- **用途**: トークン検証失敗時のエラーハンドリングを自動で行うかどうか。
- **デフォルト**: `false`（自動処理しない → 開発者が手動で処理する必要あり）。
- **例**:
  ```java
  @TokenHandler(validate = TokenValidateType.REMOVE, handleError = true)
  // 検証失敗時は自動でエラーレスポンスを返す
  public void someMethod() { ... }
  ```

---

### **3. 使用例**

#### **例 1: トークンを生成して保存**

```java
@TokenHandler(save = true)
public void generateToken() {
    // トークンが生成され、セッションなどに保存される
}
```

#### **例 2: トークンを検証（ワンタイム利用）**

```java
@TokenHandler(
    validate = TokenValidateType.REMOVE,
    handleError = true
)
public ResponseEntity<String> processRequest(@RequestParam String token) {
    // トークンが検証され、成功時のみ処理が実行される
    // 失敗時は自動でエラーレスポンスが返される
    return ResponseEntity.ok("Success");
}
```

#### **例 3: カスタムトークン名を指定**

```java
@TokenHandler(
    name = "adminToken",
    validate = TokenValidateType.KEEP,
    handleError = true
)
public void adminOperation() {
    // "adminToken" という名前のトークンを検証
}
```

---

### **4. アノテーションの動作フロー**

1. **`save = true` の場合**
   - メソッド実行前にトークンを生成し、セッションやデータベースなどに保存。
2. **`validate` が指定されている場合**
   - リクエストからトークンを取得し、検証を実施。
   - `REMOVE` の場合は検証後にトークンを削除。
3. **`handleError = true` の場合**
   - 検証失敗時は自動でエラーレスポンス（例: `403 Forbidden`）を返す。

---

### **5. 想定されるユースケース**

- **CSRF 対策**: フォーム送信時にワンタイムトークンを検証。
- **重複送信防止**: 同じリクエストが複数回実行されるのを防ぐ。
- **API セキュリティ**: トークンを使った認証・認可制御。

---

### **まとめ**

- `@TokenHandler` は **トークン管理を簡潔に実装するためのカスタムアノテーション**。
- `save`, `validate`, `name`, `handleError` の 4 つのパラメータで柔軟に制御可能。
- **セキュリティ対策（CSRF や重複リクエスト防止）** に有用。

このアノテーションを利用することで、トークン処理のボイラープレートコードを削減し、コードの可読性を向上させることができます。
