# 一般ユーザー管理画面を追加する

ロジック修正と一般ユーザー管理画面の追加内容を以下の通りです。

---

### ✅ 実装内容

1. 一般ユーザー管理画面を作成し、ログイン後に遷移するようにルーティングを変更。
2. 管理者権限 (`user.role === "admin"`) の場合のみ、「バッチ画面」へ遷移するボタンを表示。
3. 各画面（一般ユーザー管理画面・バッチ画面）に「ログアウト」ボタンを設置。

---

## 🔧 1. ログイン後の遷移先を変更

[AuthProvider.tsx](file://d:\nextjs_orgchart_api\src\components\AuthProvider.tsx) 内の [login](file://d:\nextjs_orgchart_api\src\components\AuthProvider.tsx#L73-L88) 関数で、ログイン後に `/user` へリダイレクトするよう変更します。

```typescript|CODE_EDIT_BLOCK|d:\nextjs_orgchart_api\src\components\AuthProvider.tsx
// ... existing code ...

const login = (data: AuthUser & { token: string }) => {
  localStorage.setItem("auth_token", data.token);
  const decoded = parseJwt(data.token);
  const user = {
    email: decoded.email || data.email,
    role: decoded.role || data.role,
    name: decoded.name || data.name,
  };

  setState({
    user,
    token: data.token,
    isAuthenticated: true,
    isLoading: false,
  });

  // 🔹 ログイン後は /user へ遷移
  window.location.href = '/user';
};

// ... existing code ...
```

---

## 📄 2. 一般ユーザー管理画面の作成

新しいファイル：`src/app/user/page.tsx` を作成してください。

```typescript
NEW_FILE_CODE;
// src/app/user/page.tsx
("use client");

import { useAuth } from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function UserPage() {
  const { logout, state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push("/login");
    }
  }, [state.isAuthenticated, router]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>ようこそ、一般ユーザー管理画面</h1>
      <p>メールアドレス: {state.user?.email}</p>
      <p>名前: {state.user?.name}</p>

      {/* 管理者権限がある場合のみ表示 */}
      {state.user?.role === "admin" && (
        <button onClick={() => router.push("/batch")}>バッチ処理画面へ</button>
      )}

      <br />
      <button onClick={logout} style={{ marginTop: "20px" }}>
        ログアウト
      </button>
    </div>
  );
}
```

---

## 🛠️ 3. バッチ画面にログアウトボタンを追加

`src/app/batch/page.jsx` にログアウトボタンを追加します。

```jsx|CODE_EDIT_BLOCK|d:\nextjs_orgchart_api\src\app\batch\page.jsx
// ... existing code ...

export default function BatchPage() {
  const { logout, state } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!state.isAuthenticated) {
      router.push("/login");
    }
  }, [state.isAuthenticated, router]);

  return (
    <div style={{ padding: "20px" }}>
      <h1>バッチ処理画面</h1>
      <p>管理者専用メニューです。</p>

      {/* 🔒 ログアウトボタン */}
      <button onClick={logout} style={{ marginTop: "20px" }}>
        ログアウト
      </button>
    </div>
  );
}
```

---

## 📁 4. ファイル構造確認

```
src/
├── app/
│   ├── batch/
│   │   └── page.jsx     ← ログアウトボタンを追加
│   ├── user/
│   │   └── page.tsx     ← 新規作成（一般ユーザー管理画面）
│   └── login/
│       └── page.tsx
├── components/
│   └── AuthProvider.tsx ← login関数を編集
```

---

以上で要件 ①〜③ が実装されます。  
必要であれば `/user` と `/batch` のレイアウトやスタイルをカスタマイズできます。
