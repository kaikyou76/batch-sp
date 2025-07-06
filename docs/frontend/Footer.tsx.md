# Footer.tsx

## Footer.tsx

### (src/components/layout/Footer.tsx)

```tsx
// src/app/components/Footer.tsx
import React from "react";

interface FooterProps {
  onLogout: () => void;
}

const Footer: React.FC<FooterProps> = ({ onLogout }) => {
  return (
    <div className="mt-6">
      <button
        className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none"
        onClick={onLogout}
      >
        ログアウト
      </button>
    </div>
  );
};

export default Footer;
```

この `Footer` コンポーネントの**役割**は、アプリケーションの\*\*画面下部に配置される「ログアウトボタン」\*\*を表示し、ユーザーのログアウト操作を親コンポーネントに通知することです。

---

## ✅ コンポーネントの役割まとめ

| 項目       | 内容                                                                                             |
| ---------- | ------------------------------------------------------------------------------------------------ |
| 名前       | `Footer`                                                                                         |
| 役割       | ログアウトボタンを表示し、クリック時にログアウト処理（親の関数）を実行する                       |
| 使いどころ | 管理者画面やダッシュボードの下部に配置され、ユーザーがアプリから安全にログアウトできるようにする |
| UI の特徴  | ボタンを画面いっぱいに広げ、見やすく・押しやすくしている（アクセシビリティ・UX 配慮）            |

---

## 🔍 各コード行の説明

### \`\`\`tsx

interface FooterProps {
onLogout: () => void;
}

````

- `Footer` に渡される props の型を定義。
- `onLogout`: ログアウト処理を実行する**親コンポーネントから渡される関数**。

---

### ```tsx
const Footer: React.FC<FooterProps> = ({ onLogout }) => {
````

- `Footer` は React の関数コンポーネントで、`FooterProps` を受け取る。
- `{ onLogout }` は props の分割代入：親から渡された関数を取得。

---

### \`\`\`tsx

<button onClick={onLogout}>...</button>

````

- ボタンをクリックすると `onLogout()` を実行。
- **自分では処理せず、処理の実装は親に任せる（＝責務の分離）**。
- 通常、この `onLogout` は：
  - ユーザー状態の初期化（ログアウト処理）
  - トークン削除、Cookie削除
  - `/login` 画面へのリダイレクト
  を含む関数です。

---

### ```tsx
className="w-full px-4 py-2 bg-gray-200 ... "
````

- 見た目を整えるための Tailwind CSS クラス。
- 幅いっぱい・グレー背景・角丸・ホバー時に色が変わる・アクセシビリティ対応。

---

## 📌 業務上の役割・流れ（業務フロー）

```text
[ユーザー]
  ↓（クリック）
[Footer の「ログアウト」ボタン]
  ↓（onClick 実行）
[onLogout 関数発火]
  ↓
[親コンポーネントがログアウト処理を実施]
  - トークン破棄
  - 認証情報クリア
  - ページ遷移（例：/login）
```

---

## ✅ 結論：Footer の責務は？

### 💡 役割：

- ログアウト UI を提供する。
- ロジックは一切持たず、親から受け取った `onLogout` をトリガーとして実行するだけ。

### 🧠 設計のメリット：

- **再利用性が高い**：どの画面でも使える
- **テストしやすい**：親コンポーネントで `onLogout` を差し替えれば、動作を簡単に確認できる
- **責務の分離**：UI とロジックが分離されていて保守性が高い

---

必要であれば、この `Footer` を他の UI コンポーネントと組み合わせて使う方法や、`onLogout` の実装例（例えば `useAuth().logout()`）もご説明できます。
