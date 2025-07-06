# ログイン後の処理設計

フロントエンドでログイン成功後、JWT トークンを取得して認証状態を管理する必要があります。現在のプロジェクト構成では、[AuthProvider](file://d:\nextjs_orgchart_api\src\components\AuthProvider.tsx#L37-L85) と [useAuth](file://d:\nextjs_orgchart_api\src\components\AuthProvider.tsx#L28-L34) を通じて認証状態を管理していますので、この仕組みを使ってログイン状態を保持・更新するようにします。

---

### ✅ 認証状態の管理方法

#### 1. **[AuthProvider.tsx](file://d:\nextjs_orgchart_api\src\components\AuthProvider.tsx) の役割**

- ログイン時に受け取った JWT トークンをブラウザの `localStorage` または React Context 上に保存
- 有効なトークンがあるか確認し、ユーザー情報を提供
- ログアウト処理（トークン削除）

#### 2. **[useAuth](file://d:\nextjs_orgchart_api\src\components\AuthProvider.tsx#L28-L34) カスタムフック**

- 現在のユーザー情報やログイン状態 (`isAuthenticated`) を簡単に取得できるようにする

---

### 🛠 必要な変更内容

#### 変更点: [AuthProvider.tsx](file://d:\nextjs_orgchart_api\src\components\AuthProvider.tsx)

現在、`login(data)` で受け取った `data`（以下のようなレスポンス）が直接渡されています。

```json
{
  "token": "eyJhbGciOiJIUzU1MiIsInR5cCI6IkpXVCJ9.xxxxx",
  "email": "kaikyou@gmail.com",
  "name": "HAIJIANG YAO",
  "role": "user"
}
```

このままでも動作可能ですが、より明示的にするために `localStorage` にもトークンを保存し、再ログイン時などに利用できるようにしましょう。

##### 🔧 `src/components/AuthProvider.tsx` の編集例:

```tsx
// src/components/AuthProvider.tsx

import { createContext, useContext, useEffect, useState } from "react";

interface User {
  email: string;
  name: string;
  role: string;
  token: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // ページリロード時に localStorage からトークンを復元
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
  }, []);

  const login = (userData: User) => {
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem("user", JSON.stringify(userData)); // localStorage にも保存
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user"); // localStorage から削除
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
```

---

#### ✅ 備考: `localStorage` の使用理由

- ブラウザリロードしてもログイン状態を維持したい場合に有効
- トークンの期限切れチェックも必要（現段階では簡易的な実装）

---

#### ✅ 次のステップ提案

1. **ログイン状態を画面に表示する**

   - 例: ヘッダーに「ようこそ HAIJIANG YAO さん」など
   - `useAuth().user?.name` でアクセスできます

2. **認証が必要なページでのルートガード**

   - `/batch` などのページに遷移する前に `isAuthenticated` をチェック
   - 未ログインなら `/login` にリダイレクト

3. **トークンの有効期限管理**

   - JWT の `exp` フィールドを解析し、期限切れ時の自動ログアウト機能を追加

4. **Axios インターセプターでトークン付与**
   - API リクエストに自動で `Authorization: Bearer xxx` ヘッダーを追加

---

### 📌 最後に

今後の開発においては、以下の順序で進めるのが望ましいです：

1. ログイン状態の永続化とセキュアな管理（完了）
2. ログイン済ユーザ向け UI のカスタマイズ
3. バッチ画面への権限チェック機構の追加
4. エラーハンドリングと UX 改善

何か特定の機能拡張やコードの修正が必要であれば、お気軽にご相談ください！
