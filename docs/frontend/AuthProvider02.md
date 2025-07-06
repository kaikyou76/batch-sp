# 🚀 ログアウト処理はバックエンドとの連携は不要です。

### (src\components\AuthProvider.tsx)

JWT 認証の設計上、**ステートレス性を維持する**という原則に従えば、ログアウト処理においてバックエンドでセッション情報を管理する必要はありません。したがって、フロントエンド側でトークンとユーザー情報をクリアすることで「実質的なログアウト」を実現するのは、合理的な選択です。

---

## ✅ 採用される方針

- バックエンドには一切の変更を加えません（`/api/auth/logout`も削除または無視）
- フロントエンドでは以下の処理のみ行います：
  - `localStorage`にある JWT トークンを削除
  - React Context（AuthProvider）内のユーザー情報をリセット
  - 必要であれば Cookie を明示的に削除（現在使っていないため不要）

---

## ✅ 提案された修正（フロントエンドのみ）

### 修正後の [logout()](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\controller\LogoutController.java#L23-L35) 関数（簡略化版）

```tsx
const logout = () => {
  // ローカルストレージのトークンを削除
  localStorage.removeItem("auth_token");

  // Cookieの削除（refresh_tokenなどがない場合は不要）
  // document.cookie = "refresh_token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT";

  // 状態をリセット
  setState({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: false,
  });

  // ログイン画面へリダイレクト
  router.push("/login");
};
```

---

## 🧹 余計な処理の削除（オプション）

もし今後 `/api/auth/logout` へのリクエスト処理が不要であることが確定している場合、以下のように関数内での通信処理を完全に削除できます。

#### 変更前:

```tsx
const logout = async () => {
  try {
    const xsrfToken = getCsrfTokenFromCookie();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/auth/logout`,
      ...
    );
```

#### 変更後:

```tsx
const logout = () => {
  localStorage.removeItem("auth_token");
  setState(initialAuthState);
  router.push("/login");
};
```

---

## ✅ まとめ

| 項目                     | 内容                                                       |
| ------------------------ | ---------------------------------------------------------- |
| **バックエンドの変更**   | 不要（すべてフロントで完結）                               |
| **ログアウトリクエスト** | 削除または無視                                             |
| **推奨対応**             | フロントで状態・ストレージをクリアし、リダイレクトするだけ |
| **メリット**             | 設計の単純化、予期せぬ問題の回避                           |

# 🚀✅ 修正済みの AuthProvider.tsx の全コード

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

    console.log("Login data from API:", data); // APIからのレスポンス全体
    console.log("Decoded JWT payload:", decoded); // JWTから抽出されたユーザーデータ

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

    // ✅ window.location.href の代わりに useRouter を使用して状態を維持しながら遷移
    router.push("/user");
  };

  // 🔐 ログアウト処理
  const logout = () => {
    // ローカルストレージのトークンを削除
    localStorage.removeItem("auth_token");

    // 状態をリセット
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

      console.log("decoded payload:", decoded); // 🔍 デバッグ用ログ

      if (decoded.exp < currentTime) {
        // トークンが期限切れ
        localStorage.removeItem("auth_token");
        setState({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
      } else {
        // 有効なトークン
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
        // RSCリクエスト時の特別な処理
        console.log("RSC request detected:", params.get("_rsc"));
        // 必要に応じてカスタム処理を追加
      }
    };

    handleRSCRequest();

    // ハッシュ変更イベントリスナーを追加
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
```
