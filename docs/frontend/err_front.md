# 登録とログイン画面で入力ミスがある場合、エラー明示したいための実装

## **バックエンド確認提案**

フロントエンドで表示される「このメールアドレスは既に使用されています」と「パスワードが正しくありません」のエラーメッセージは、以下のバックエンドクラスとメソッドで生成されています。

---

### 1. メールアドレス重複チェック

**発生箇所:**  
[AuthenticationService.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\service\AuthenticationService.java) の [register](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\service\AuthenticationService.java#L33-L52) メソッド

```java
if (userRepository.findByEmail(email).isPresent()) {
    throw new IllegalArgumentException("このメールアドレスは既に使用されています");
}
```

- **説明:**
  - ユーザー登録時に、指定されたメールアドレスがすでに存在する場合に `IllegalArgumentException` をスロー。
  - フロントエンドでは `response.json()` 経由で `"message"` フィールドとして返却され、UI 上に表示されます。

---

### 2. パスワード不一致チェック

**発生箇所:**  
[AuthController.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\AuthController.java) の [login](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\AuthController.java#L45-L75) メソッド

```java
if (!authenticationService.checkPassword(request.getPassword(), user.getPasswordHash())) {
    throw new RuntimeException("パスワードが正しくありません");
}
```

- **説明:**
  - ログイン処理時に、入力されたパスワードと DB 保存済みのハッシュ値を照合し、不一致の際に例外をスロー。
  - この `RuntimeException` も JSON 形式でフロントエンドに返却され、`data.message` として利用可能です。

---

## ✅ フロントエンドでのエラー表示確認（修正案）

### `/register` 登録画面：`page.tsx`

```tsx
if (response.ok) {
  router.push("/login");
} else {
  setError(data.message || "登録に失敗しました");
}
```

✅ **現状でも問題なし。**  
API レスポンス内の `message` フィールドが正しく表示されているため、「このメールアドレスは既に使用されています」も正常に表示できます。

---

### `/login` ログイン画面：`page.jsx`

```jsx
if (response.ok) {
  login(data);
  router.push("/user");
} else {
  setError(data.message || "ログインに失敗しました");
}
```

✅ **現状でも問題なし。**  
同様に `message` フィールドを使用しているので、「パスワードが正しくありません」も正しく表示されます。

---

## 🔁 改善提案（オプション）

### API 側で統一されたエラー構造を返すようにすると、フロント側の扱いがより簡単になります。

#### 例: エラーレスポンス形式を統一する

```json
{
  "success": false,
  "message": "このメールアドレスは既に使用されています",
  "errorCode": "EMAIL_ALREADY_EXISTS"
}
```

または：

```json
{
  "error": "Bad Request",
  "message": "パスワードが正しくありません",
  "status": 400
}
```

---

### ✅ 推奨対応策（Spring Boot 側）

以下のように `@ControllerAdvice` で共通エラーハンドリングを行い、メッセージを統一構造で返すことができます。

#### 新規作成ファイル:

```java
// ... existing code ...
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmail(IllegalArgumentException ex) {
        ErrorResponse error = new ErrorResponse(false, ex.getMessage(), "EMAIL_ALREADY_EXISTS");
        return ResponseEntity.status(HttpStatus.CONFLICT).body(error); // HTTP 409 Conflict
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<ErrorResponse> handleInvalidPassword(RuntimeException ex) {
        ErrorResponse error = new ErrorResponse(false, ex.getMessage(), "INVALID_CREDENTIALS");
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(error); // HTTP 401 Unauthorized
    }
}

class ErrorResponse {
    private boolean success;
    private String message;
    private String errorCode;

    public ErrorResponse(boolean success, String message, String errorCode) {
        this.success = success;
        this.message = message;
        this.errorCode = errorCode;
    }

    // getters and setters...
}
```

---

### 📌 結論

- **現在の実装でも要件は満たされています。**
- ただし、今後の拡張性や保守性向上のために、**エラーレスポンスの統一構造を導入することを推奨します。**
- フロントエンドは `data.message` でエラーを表示しているため、バックエンドから同じキー名で返していれば問題ありません。

## **フロントエンド確認提案**

指定されたクラスを確認した結果、**フロントエンドに `message` フィールドを返しているのは `AuthController` と `RegisterController` クラス**です。これらのコントローラーは例外メッセージをレスポンスとして返しており、実際には **Spring のデフォルトのエラーハンドリングによって JSON 構造が決定されています**。

---

### 🔍 各コントローラーでのエラー送出箇所

#### ✅ `AuthController.java`

```java
// 認証失敗時のケース
User user = authenticationService.getUserByEmail(request.getEmail())
        .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

if (!authenticationService.checkPassword(request.getPassword(), user.getPasswordHash())) {
    throw new RuntimeException("パスワードが正しくありません");
}
```

このように `RuntimeException` で直接文字列メッセージを投げています。  
→ Spring Boot では未捕捉の例外は以下の形式で `/error` エンドポイントを通じて返却されます：

```json
{
  "timestamp": "2025-07-03T14:30:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "exception": "java.lang.RuntimeException",
  "message": "パスワードが正しくありません",
  "path": "/api/auth/login"
}
```

#### ✅ `RegisterController.java`

```java
try {
    User user = authenticationService.register(
            request.getEmail(),
            request.getName(),
            request.getPassword()
    );
    // ... success path
} catch (Exception e) {
    throw new RuntimeException(e);
}
```

このコードでは `RuntimeException` で任意の例外を再スローしています。
→ こちらも同様に上記のような構造の JSON レスポンスが返却されます（`message` には `e.getMessage()` が含まれる）。

---

### 📦 実際のレスポンス構造（例）

#### 🔒 ログイン失敗時 (`/api/auth/login`)

```json
{
  "timestamp": "2025-07-03T14:30:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "exception": "java.lang.RuntimeException",
  "message": "パスワードが正しくありません",
  "path": "/api/auth/login"
}
```

#### 📝 登録失敗時 (`/api/register`)

```json
{
  "timestamp": "2025-07-03T14:35:00.000+00:00",
  "status": 500,
  "error": "Internal Server Error",
  "exception": "java.lang.IllegalArgumentException",
  "message": "このメールアドレスは既に使用されています",
  "path": "/api/register"
}
```

---

### ✅ 解決策：フロントエンド側でこの構造を扱う

#### 前提：

- `response.json()` で取得できるデータには `message` フィールドが存在する

#### 🔁 適用例（ログインページ）

```tsx|CODE_EDIT_BLOCK|d:\nextjs_orgchart_api\src\app\login\page.tsx
// ... existing code ...

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const errorData = await response.json(); // ← JSON全体を受け取る
      const errorMessage = errorData.message || "ログインに失敗しました";
      setError(errorMessage);
      return;
    }

    const data = await response.json();
    login(data); // ✅ AuthContextにユーザー情報を更新する
    router.push("/user"); // user画面へ遷移する
  } catch (err) {
    setError("ネットワークエラーが発生しました");
    console.error("Login error:", err);
  } finally {
    setLoading(false);
  }
};

// ... existing code ...
```

#### 📌 登録ページにも同様の処理を適用（参考）

```tsx
const handleRegister = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || "登録に失敗しました";
      setError(errorMessage);
      return;
    }

    router.push("/login");
  } catch (err) {
    setError("ネットワークエラーが発生しました");
    console.error("Registration error:", err);
  } finally {
    setLoading(false);
  }
};
```

---

### 💡 結論

- ✅ `AuthController` と `RegisterController` は `message` フィールドを持つ JSON レスポンスを返します
- ❗ 現状の `AuthController#login` は `RuntimeException` を直接投げており、より明確なステータスコードやエラー種別を返すために `@ControllerAdvice` による統一エラーハンドリングを導入するとよいです
- ✅ フロントエンドでは `errorData.message` を使って UI 表示すれば OK です

必要であれば、バックエンドのエラーハンドリングを改善するコードも提供できます。
