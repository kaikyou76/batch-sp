# 改良版 AuthProvider.tsx

現在の `AuthProvider.tsx` は状態管理として基本的な機能を備えていますが、**より型安全で保守性が高い実装に改善**できます。また、以下の点も考慮して再設計します：

---

### ✅ 改善ポイント

1. **JWT トークンの有効期限チェック**

   - JWT の `exp` フィールドから期限を取得し、無効なトークンは自動的に破棄

2. **ユーザー情報の型定義を明確化**

   - 現在は [AuthUser](file://d:\nextjs_orgchart_api\src\components\AuthProvider.tsx#L5-L9) 型が部分的に定義されていますが、より構造化されたインターフェースに変更

3. **初期認証状態の復元処理の改善**

   - トークンがある場合にユーザー情報を復元する処理を追加（将来的には API 経由でも可能）

4. **カプセル化と責務分離**
   - AuthProvider 内部のロジックを関数化し、可読性・テスト性を向上

---

### 🛠 改良版 `AuthProvider.tsx`

```tsx|CODE_EDIT_BLOCK|d:\nextjs_orgchart_api\src\components\AuthProvider.tsx
// ... existing code ...
import { createContext, useState, useEffect, useContext } from "react";

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

type AuthContextType = AuthState & {
  login: (data: AuthUser & { token: string }) => void;
  logout: () => void;
};

// 🔹 JWT解析用ヘルパー
const parseJwt = (token: string): AuthUser & { exp: number } => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("JWTのパースに失敗しました", e);
    return { exp: 0 };
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
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialAuthState);

  // 🔐 ログイン処理
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
            email: decoded.email,
            role: decoded.role,
            name: decoded.name,
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
  }, []);

  const value = {
    ...state,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
```

---

### ✅ 改善内容のまとめ

| 機能                     | 変更内容                                                                                                              |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------- |
| JWT の期限チェック       | `parseJwt()` 関数でトークンの `exp` を確認し、期限切れの場合はログアウト処理                                          |
| ユーザー情報の整合性     | データ構造を明確に定義 ([AuthUser](file://d:\nextjs_orgchart_api\src\components\AuthProvider.tsx#L5-L9), `AuthState`) |
| 認証状態の非同期読み込み | [isLoading](file://d:\nextjs_orgchart_api\src\components\ui\Button.tsx#L10-L10) ステートを導入                        |
| カプセル化               | ロジックを関数化し、AuthProvider 内部での責務分離                                                                     |

---

### 🧪 次のステップ提案

- **Axios インターセプターによるトークン自動付与**
  ```ts
  axios.interceptors.request.use((config) => {
    const { token } = useAuth();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  ```
- **SSR 対応：localStorage の代わりに cookie を使用**
- **セッションリフレッシュ機能の追加**

このように、現在のコードをより堅牢かつ拡張性のある形に整えることができました。必要に応じて、他コンポーネントや API サービスとの連携もサポートいたします。
