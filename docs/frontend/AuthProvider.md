# ❗🚨AuthProvider.tsx とバックエンド AuthControllere の連携問題の解消

ログイン後のリダイレクト問題は、フロントエンドとバックエンドの JWT ペイロード構造の不一致に起因しています。
この修正により以下の問題を解決しました：

バックエンド側：

JWT ペイロードに email という明示的なキーでユーザーデータを含める
sub(subject)と同等の意味を持つようにする
フロントエンド側：

JWT ペイロードから email を優先的に取得し、sub をフォールバックとして使用
より柔軟なユーザーデータ抽出を可能にする
これにより、ログイン後の認証状態が正しく維持され、User ページへの遷移が可能になります。AuthProvider が正しいユーザーデータを認識できるようになるため、不要なリダイレクトが発生しなくなります。

### (src\components\AuthProvider.tsx)

```typescript
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

    // 必須プロパティを保証するためにデフォルト値を設定
    //return {
    // email: payload.email ?? "",
    // role: payload.role ?? "",
    // name: payload.name ?? "",
    // exp: payload.exp ?? 0,
    //❗🚨上記破棄する
    // };
    // ✅ ❗🚨ペイロード構造を後方互換性があるように調整
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
