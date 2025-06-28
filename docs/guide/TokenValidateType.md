# TokenValidateType

### (src/main/java/com/example/orgchart_api/security/TokenValidateType.java)

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * TokenValidateType.java
 *
 * @date 2013/08/15
 * @version 1.1
 * @author Yao Kaikyou
 */
package com.example.orgchart_api.security;

/**
 * ワンタイムトークンの検証タイプを定義する列挙型。
 *
 * <ul>
 *   <li>NONE - トークン検証を行わない</li>
 *   <li>REMOVE - 検証後にトークンを削除する</li>
 *   <li>KEEP - 検証後もトークンを保持する</li>
 * </ul>
 *
 * @author Yao Kaikyou
 * @version 1.1 2025/06/13
 */
public enum TokenValidateType {
    /** トークン検証を行わない */
    NONE,

    /** トークンを検証して削除する */
    REMOVE,

    /** トークンを検証するが削除しない */
    KEEP
}


```

このコードは、**トークン検証の挙動を制御するための列挙型（`enum`）** を定義しています。`TokenValidateType` は、`@TokenHandler` アノテーション（前回解説したもの）で使用され、**「トークンをどのように検証するか」** を指定する役割を持ちます。以下に詳細を解説します。

---

### **1. 列挙型（`enum`）の基本構造**

```java
public enum TokenValidateType {
    NONE,
    REMOVE,
    KEEP
}
```

- **`enum`** は、事前に定義された定数の集合を表す型です。
- ここでは `NONE`、`REMOVE`、`KEEP` の 3 つの定数（検証タイプ）を定義しています。

---

### **2. 各定数の意味と用途**

#### **(1) `NONE`**

```java
/** トークン検証を行わない */
NONE
```

- **用途**: トークンの検証を**完全にスキップ**します。
- **使用例**:
  - トークン生成のみ行いたい場合（例: トークンを発行する API）。
  - セキュリティ検証が不要な簡易な処理。

#### **(2) `REMOVE`**

```java
/** トークンを検証して削除する */
REMOVE
```

- **用途**: トークンを検証した後、**削除**します（**ワンタイムトークン**として機能）。
- **使用例**:
  - CSRF 対策（例: フォーム送信時に 1 回限りのトークンを要求）。
  - 重複送信防止（例: 注文処理で同じトークンの再利用を防ぐ）。

#### **(3) `KEEP`**

```java
/** トークンを検証するが削除しない */
KEEP
```

- **用途**: トークンを検証しますが、**削除せず保持**します。
- **使用例**:
  - 同じトークンを複数回検証する必要がある場合（例: マルチステップ処理）。
  - トークンの有効期限を別途管理する場合。

---

### **3. 実際の使い方（`@TokenHandler` との連携）**

この `enum` は、`@TokenHandler` アノテーションの `validate()` パラメータで使用されます。  
例:

```java
@TokenHandler(validate = TokenValidateType.REMOVE)
public void processPayment() {
    // トークン検証後に削除される（ワンタイム利用）
}
```

#### **動作フロー**

1. **`validate = TokenValidateType.REMOVE` の場合**

   - リクエストで送信されたトークンを検証 → 成功後にトークンを削除。
   - 同じトークンで再度リクエストするとエラーになる。

2. **`validate = TokenValidateType.KEEP` の場合**

   - トークンを検証するが削除しないため、同じトークンで複数回リクエスト可能。

3. **`validate = TokenValidateType.NONE` の場合**
   - トークン検証自体がスキップされる。

---

### **4. なぜこの `enum` が必要か？**

- **コードの明確化**: `"REMOVE"` のような文字列ではなく、型安全な定数を使用することで、誤りを防ぐ。
- **拡張性**: 新しい検証タイプを追加する場合、`enum` に定数を追加するだけで済む（例: `EXPIRE_AFTER_USE` を追加可能）。
- **ドキュメント化**: JavaDoc コメントにより、各定数の役割が明確になる。

---

### **5. 補足: トークン管理の実装例**

実際のトークン検証は、以下のような処理が背後で動く想定です。

```java
public boolean validateToken(String token, TokenValidateType type) {
    if (type == TokenValidateType.NONE) {
        return true; // 検証スキップ
    }

    boolean isValid = checkTokenInStorage(token); // トークンを検索

    if (isValid && type == TokenValidateType.REMOVE) {
        deleteToken(token); // 検証後に削除
    }

    return isValid;
}
```

---

### **まとめ**

- `TokenValidateType` は、**トークン検証の挙動を制御する列挙型**。
- **`NONE`（検証しない）**、**`REMOVE`（検証後削除）**、**`KEEP`（検証後保持）** の 3 種類。
- `@TokenHandler` と組み合わせることで、**CSRF 対策や重複リクエスト防止**を簡潔に実装できる。

この設計により、トークンを使ったセキュリティ対策を柔軟かつ安全に実装できます。
