# useAuth.ts は将来使用のため、了解しておけばいい

## useAuth.ts

### (src/hooks/useAuth.ts)

```ts
// src/app/auth/hooks/useAuth.ts
import { useContext } from "react";
import AuthContext from "../components/AuthProvider";

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

この `useAuth.ts` ファイルに定義されている `useAuth` フックの役割は、
**React の Context（`AuthContext`）にアクセスするためのカスタムフック**を提供することです。

---

## ✅ まとめ：`useAuth` の役割とは？

| 項目     | 内容                                                                                       |
| -------- | ------------------------------------------------------------------------------------------ |
| 名前     | `useAuth`（カスタム React フック）                                                         |
| 目的     | コンポーネントから簡単に認証状態（ログイン中のユーザー情報など）へアクセスできるようにする |
| 前提     | 必ず `<AuthProvider>` によってラップされた範囲内で使う必要がある                           |
| 仕組み   | `useContext()` を使って `AuthContext` にアクセスし、値を返す                               |
| メリット | 認証関連の状態取得が簡潔に書ける（`const { user, login, logout } = useAuth()` のように）   |

---

## 🔍 各コード行の解説

```ts
import { useContext } from "react";
import AuthContext from "../components/AuthProvider";
```

- `useContext`: React の組み込みフック。Context の値を取得する。
- `AuthContext`: 認証状態（ログイン中のユーザー・ログイン関数など）を保持するコンテキスト。

---

```ts
export const useAuth = () => {
  const context = useContext(AuthContext);
```

- `AuthContext` から現在のコンテキスト値（例：`{ user, login, logout }`）を取得。

---

```ts
if (!context) {
  throw new Error("useAuth must be used within an AuthProvider");
}
```

- セーフガード（保護処理）。
  もし `AuthProvider` にラップされていない場所で `useAuth()` を使ってしまったら、
  わかりやすいエラーメッセージを出して、問題に早く気づけるようにしている。

---

```ts
  return context;
};
```

- `AuthContext` の値をそのまま返す。
  たとえば、次のように使える：

```ts
const { user, login, logout } = useAuth();
```

---

## 🧠 なぜカスタムフックにするのか？

```ts
// カスタムフックを使わない場合：
const { user } = useContext(AuthContext);

// カスタムフックを使った場合：
const { user } = useAuth();
```

👉 **`useAuth()` のほうが簡潔・安全・再利用性が高い**ため、React ではこのようにカスタムフックを定義するのが一般的です。

---

## ✅ よくある使い方（ログイン状態の取得やログアウト処理）

```tsx
import { useAuth } from "@/app/auth/hooks/useAuth";

export default function Dashboard() {
  const { user, logout } = useAuth();

  return (
    <div>
      <p>ようこそ、{user.name} さん！</p>
      <button onClick={logout}>ログアウト</button>
    </div>
  );
}
```

---

## ✅ まとめ

| 項目             | 内容                                                                           |
| ---------------- | ------------------------------------------------------------------------------ |
| コンポーネント名 | `useAuth`（カスタムフック）                                                    |
| 主な機能         | `AuthContext` にアクセスし、認証状態（ログイン・ユーザー情報・関数など）を取得 |
| 使用条件         | `AuthProvider` にラップされている必要がある                                    |
| メリット         | 安全・簡潔・再利用しやすい認証状態の取得方法を提供                             |

---

もしご希望があれば、`AuthProvider.tsx` の中身や `user`, `login`, `logout` の構成も一緒に解説できます！
