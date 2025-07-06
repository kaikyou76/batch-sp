# AuthProvider.tsx

## AuthProvider.tsx

### (src/components/AuthProvider.tsx)

```tsx
// src/components/AuthProvider.tsx
"use client";

import { createContext, useState, useEffect, useContext } from "react";
import { useRouter } from "next/navigation"; // ✅ Next.js 13+ App Router用ルーターインポート

// 🔹 ユーザー情報の型定義
interface AuthUser {
  email: string;
  role: string;
  name: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

type AuthContextType = {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: AuthUser & { token: string }) => void;
  logout: () => void;
};

// 🔹 JWT解析用ヘルパー
const parseJwt = (token: string): AuthUser & { exp: number } => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    const payload = JSON.parse(jsonPayload);

    return {
      email: payload.sub ?? payload.email ?? "", // sub（subject）を優先し、emailもフォールバック
      role: payload.role ?? "",
      name: payload.name ?? "",
      exp: payload.exp ?? 0,
    };
  } catch (e) {
    console.error("JWTのパースに失敗しました", e);
    return { email: "", role: "", name: "", exp: 0 };
  }
};

// 🔹 初期値
const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

// 🔹 AuthContext の作成
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter(); // ✅ Next.js 13+ App Router用ルーター取得
  const [state, setState] = useState<AuthState>(initialAuthState);

  // 🔐 ログイン処理
  const login = (data: AuthUser & { token: string }) => {
    localStorage.setItem("auth_token", data.token);
    const decoded = parseJwt(data.token);

    const user = {
      email: decoded.email || data.email || "",
      role: decoded.role || data.role || "",
      name: decoded.name || data.name || "",
    };

    setState({
      user,
      token: data.token,
      isAuthenticated: true,
      isLoading: false,
    });

    router.push("/user");
  };

  // 🔐 ログアウト処理
  const logout = () => {
    localStorage.removeItem("auth_token");
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // 📦 初期ロード時にトークンを復元
  useEffect(() => {
    const storedToken = localStorage.getItem("auth_token");

    if (storedToken) {
      const decoded = parseJwt(storedToken);
      const currentTime = Math.floor(Date.now() / 1000);

      if (decoded.exp < currentTime) {
        localStorage.removeItem("auth_token");
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else {
        setState({
          user: {
            email: decoded.email || "",
            role: decoded.role || "",
            name: decoded.name || "",
          },
          token: storedToken,
          isAuthenticated: true,
          isLoading: false,
        });
      }
    } else {
      setState({
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      });
    }

    // ✅ RSCリクエストの監視を追加（URLSearchParamsを使用）
    const handleRSCRequest = () => {
      const search = window.location.search;
      const params = new URLSearchParams(search);
      if (params.has("_rsc")) {
        console.log("RSC request detected:", params.get("_rsc"));
      }
    };

    handleRSCRequest();
    window.addEventListener("hashchange", handleRSCRequest);

    return () => {
      window.removeEventListener("hashchange", handleRSCRequest);
    };
  }, []);

  const value = {
    user: state.user,
    token: state.token,
    isAuthenticated: state.isAuthenticated,
    isLoading: state.isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
```

この `AuthProvider.tsx` は、**Next.js アプリにログイン機能（JWT ベースの認証）を追加するための「認証管理の中枢」コンポーネント**です。初心者の方でも理解しやすいように、**段階的に、各構成と実装方法を順に解説**します。

---

## 🧭 ステップごとの全体像（やること）

| ステップ | 説明                                                   |
| -------- | ------------------------------------------------------ |
| ✅ 1     | Context（`AuthContext`）の作成と初期化                 |
| ✅ 2     | `AuthProvider` でアプリ全体をラップし、状態を共有      |
| ✅ 3     | `login()` 関数でログイン処理とトークン保存             |
| ✅ 4     | `logout()` 関数でログアウト処理                        |
| ✅ 5     | `useEffect()` でリロード時にログイン状態を復元         |
| ✅ 6     | `useAuth()` カスタムフックでどこでも認証状態にアクセス |

---

## ✅ 1. `AuthContext` の作成と初期状態の定義

```ts
interface AuthUser { ... }
interface AuthState { ... }

const initialAuthState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
```

### 📌 役割

- `AuthContext` は、**ログイン情報（ユーザー、トークン、ログイン状態）をグローバルに共有**するための箱。
- `initialAuthState` は、初期値（ログインしていない状態）。

---

## ✅ 2. `AuthProvider` でアプリ全体を囲む

```tsx
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialAuthState);
  ...
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

### 📌 役割

- React アプリの最上位で `<AuthProvider>` を使って囲むことで、

  - `useAuth()` を使えばどのコンポーネントでも「ログイン情報」を取得・変更できるようになります。

---

## ✅ 3. `login()` の実装（ログイン成功時の処理）

```ts
const login = (data: AuthUser & { token: string }) => {
  localStorage.setItem("auth_token", data.token);
  const decoded = parseJwt(data.token); // JWTトークンからユーザー情報を抽出
  ...
  setState({ user, token: data.token, isAuthenticated: true, ... });
  router.push("/user"); // ログイン後に画面遷移
};
```

### 📌 役割

- API から返ってきた JWT トークンを保存（`localStorage`）。
- トークンを解析して `email`, `role`, `name` を取り出し、ログイン状態に更新。

---

## ✅ 4. `logout()` の実装（ログアウト処理）

```ts
const logout = () => {
  localStorage.removeItem("auth_token");
  setState({ user: null, token: null, isAuthenticated: false, ... });
};
```

### 📌 役割

- ログイン状態をリセット
- トークンを削除して、画面の状態もリセット

---

## ✅ 5. `useEffect()` で初回読み込み時にログイン状態を復元

```ts
useEffect(() => {
  const storedToken = localStorage.getItem("auth_token");
  if (storedToken) {
    const decoded = parseJwt(storedToken);
    ...
    setState({ ...ログイン状態... });
  } else {
    setState({ ...未ログイン状態... });
  }
}, []);
```

### 📌 役割

- ページをリロードしてもログアウト状態にならないように、トークンを復元してログイン状態を再構築する。
- トークンが期限切れなら自動ログアウト。

---

## ✅ 6. `useAuth()` カスタムフックで使いやすくする

```ts
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
```

### 📌 役割

- これでどこからでも以下のように呼び出せる：

  ```tsx
  const { user, login, logout, isAuthenticated } = useAuth();
  ```

---

## 🔁 認証の流れまとめ（図式）

```plaintext
[ログインAPI成功]
   ↓
JWTトークン保存（localStorage）
   ↓
トークンからユーザー情報を抽出
   ↓
useState でグローバル状態に反映
   ↓
全画面にログイン状態が共有される
   ↓
useAuth() でどこからでも参照可能
```

---

## ✅ 実装ステップまとめ（初心者向け）

| ステップ | 具体的にやること                                     |
| -------- | ---------------------------------------------------- |
| ①        | `AuthContext` と初期状態を定義する                   |
| ②        | `AuthProvider` を作成し、アプリ全体を囲む            |
| ③        | `login()` 関数を実装してログイン状態を作る           |
| ④        | `logout()` 関数で状態リセットできるようにする        |
| ⑤        | `useEffect()` でトークン復元と有効期限チェック       |
| ⑥        | `useAuth()` でどこからでも認証情報を使えるようにする |

---

## 🔧 実際に使うとこうなる

```tsx
import { useAuth } from "@/components/AuthProvider";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <div>
      {isAuthenticated && (
        <>
          <span>{user?.name} さん</span>
          <button onClick={logout}>ログアウト</button>
        </>
      )}
    </div>
  );
}
```

---

## ご希望があれば…

- ✅ `login` を呼び出すページ（例：`LoginPage.tsx`）の実装手順
- ✅ `AuthProvider` をどこで呼び出すか（`app/layout.tsx`など）
- ✅ テスト用のダミーユーザーとトークンの作成方法
- ✅ `parseJwt()` 関数の中身の詳しい分解

なども、わかりやすく段階的にサポートできます！お気軽にご相談ください。
