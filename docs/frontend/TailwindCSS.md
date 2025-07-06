# TailwindCSS

## globals.css

### (src/styles/globals.css)

```css
/* Tailwind CSSの初期化 */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* 共通スタイル */
body {
  @apply font-sans antialiased;
}

h1,
h2,
h3,
h4,
h5,
h6 {
  @apply font-bold;
}

p {
  @apply text-gray-700;
}

a {
  @apply text-blue-600 hover:text-blue-800 underline;
}

.container {
  @apply max-w-6xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* ボタン関連（Tailwindのクラス名を使用するように変更） */

/* カードコンポーネント用スタイル */
.card {
  @apply bg-white shadow rounded-lg overflow-hidden;
}

.card-header {
  @apply px-6 py-3 border-b border-gray-200;
}

.card-title {
  @apply text-lg font-semibold text-gray-800;
}

.card-body {
  @apply px-6 py-4;
}

/* フッタースタイル */
.footer {
  @apply bg-white border-t border-gray-200 p-4 mt-auto;
}

.footer-content {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-500;
}

/* バッチページ専用スタイル */
.batch-container {
  @apply container mx-auto p-6 max-w-4xl;
}

.batch-header {
  @apply mb-8;
}

.batch-title {
  @apply text-3xl font-bold text-gray-800;
}

.batch-subtitle {
  @apply text-gray-600 mt-2;
}

.batch-card {
  @apply bg-white rounded-xl shadow-lg overflow-hidden;
}

.batch-card-header {
  @apply p-6 border-b border-gray-200;
}

.batch-card-title {
  @apply text-xl font-semibold text-gray-800;
}

.batch-card-desc {
  @apply text-gray-600 mt-1;
}

.batch-card-tag {
  @apply px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium;
}

.batch-execution-settings {
  @apply grid grid-cols-1 md:grid-cols-3 gap-6;
}

.batch-execution-info {
  @apply flex items-center;
}

.batch-icon-success {
  @apply w-4 h-4 mr-2 text-green-500;
}

.batch-icon-time {
  @apply w-4 h-4 mr-2 text-gray-400;
}

.batch-button {
  @apply w-full py-3 px-6 rounded-lg font-medium flex items-center justify-center transition-all;
}

.batch-button-running {
  @apply bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg;
}

.batch-button-disabled {
  @apply bg-gray-200 text-gray-500 cursor-not-allowed;
}

.batch-message {
  @apply mt-6 p-4 rounded-lg;
}

.batch-message-success {
  @apply bg-green-50 border border-green-200 text-green-700;
}

.batch-message-error {
  @apply bg-red-50 border border-red-200 text-red-700;
}

.batch-message-info {
  @apply bg-blue-50 border border-blue-200 text-blue-700;
}

.batch-security-section {
  @apply mt-8 bg-gray-50 rounded-lg p-6;
}

.batch-security-title {
  @apply font-medium text-gray-700 mb-3;
}

.batch-token-status {
  @apply flex items-center;
}

.batch-token-valid {
  @apply w-3 h-3 rounded-full bg-green-500 mr-2;
}

.batch-token-invalid {
  @apply w-3 h-3 rounded-full bg-red-500 mr-2;
}
```

このコードは、Tailwind CSS をベースにした**カスタムのグローバルスタイル定義**です。ファイルは通常 `src/styles/globals.css` のように置かれ、アプリ全体の見た目（デザイン）を統一・最適化するために使われます。

---

## ✅ **このスタイル定義の全体的な役割**

| 役割                                 | 説明                                                                            |
| ------------------------------------ | ------------------------------------------------------------------------------- |
| **Tailwind の初期化**                | `@tailwind base/components/utilities` により、Tailwind の機能を有効化           |
| **HTML タグの共通スタイル**          | `body`, `h1`, `p`, `a` などに一貫したスタイルを付与                             |
| **再利用可能なユーティリティクラス** | `.card`, `.batch-card` などを定義してコンポーネントで使いまわせるようにする     |
| **特定ページ専用スタイル**           | `.batch-*` で始まるクラス群は「バッチページ」専用の装飾（専用レイアウトや配色） |

---

## 🔍 各セクションの具体的な役割

### ① `@tailwind` ディレクティブ

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

- Tailwind CSS の基本・コンポーネント・ユーティリティをプロジェクトに読み込む初期宣言。
- これにより、Tailwind の全クラス（`text-gray-700`, `bg-white`, `flex`, など）が使えるようになります。

---

### ② 共通 HTML タグのスタイル

```css
body {
  @apply font-sans antialiased;
}

h1,
h2,
... {
  @apply font-bold;
}

p {
  @apply text-gray-700;
}

a {
  @apply text-blue-600 hover:text-blue-800 underline;
}
```

- アプリ全体の文字やリンクに統一感を持たせる。
- 例：

  - 全体にフォントを適用
  - 見出しは太字に
  - 段落はやや薄めのグレーに
  - リンクは青でホバー時に色が濃くなる

---

### ③ `.container` クラス

```css
.container {
  @apply max-w-6xl mx-auto px-4 sm:px-6 lg:px-8;
}
```

- 中央寄せ＋画面幅制限を持ったレスポンシブなレイアウトコンテナを作る。

---

### ④ カードコンポーネント用スタイル（`.card`, `.card-header` など）

```css
.card {
  @apply bg-white shadow rounded-lg overflow-hidden;
}
```

- 汎用カード UI に使われる見た目のセット。
- 白背景、影、角丸、コンテンツがあふれないようにする設計。

---

### ⑤ `.footer` スタイル

```css
.footer {
  @apply bg-white border-t border-gray-200 p-4 mt-auto;
}
```

- ページ下部のフッターに白背景＋ボーダー＋余白を付与。
- `.footer-content` は中央揃え＋小さめグレー文字。

---

### ⑥ `batch-` で始まるスタイル群（バッチページ専用）

```css
.batch-container {
  ...;
}
.batch-card {
  ...;
}
.batch-message-success {
  ...;
}
.batch-token-valid {
  ...;
}
```

- 「バッチジョブ管理画面」専用の UI スタイル。
- 意図的に接頭辞 `batch-` を付けて、**他の画面と干渉しないように分離**されている。
- 内容例：

  - `.batch-card`: カード型のジョブ表示用 UI
  - `.batch-button-disabled`: 無効化された実行ボタンの見た目
  - `.batch-message-error`: エラー表示の色と背景
  - `.batch-token-valid`: トークンが有効な状態を示す緑色の小円アイコン

---

## 🧠 補足：なぜこのように書くのか？

- \*\*Tailwind CSS はユーティリティファースト（1 回限りの class を組み合わせて使う）\*\*が基本ですが、
- こうして `.card` や `.batch-message-error` など**再利用可能なクラス名を自作**することで、

  - コードの重複を避け
  - 可読性と保守性を上げる

→ `@apply` を使うことで Tailwind のスタイルをまとめて抽出できます。

---

## ✅ まとめ

| セクション                   | 役割                                    |
| ---------------------------- | --------------------------------------- |
| `@tailwind` 系               | Tailwind の基本機能を有効にする         |
| `body`, `h1`, `p`, `a`       | HTML 全体の基本スタイルを設定           |
| `.container`, `.card`        | 再利用可能なレイアウト・UI 構造スタイル |
| `.footer`, `.footer-content` | フッター用の一貫したスタイル            |
| `.batch-*` 系                | バッチ処理ページ専用のレイアウトと装飾  |
| `@apply` の活用              | Tailwind クラスを一括適用し、CSS を整理 |

---

このスタイルは**Tailwind CSS の柔軟性とカスタマイズ性を最大限に活かした全体スタイル設計**です。
ご希望であれば、この CSS を使った具体的なコンポーネント実装例もご紹介できます！

## reset.css

### (src/styles/reset.css)

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: sans-serif;
}
```

この CSS コードの役割は、**ブラウザごとのデフォルトスタイルをリセットし、要素のサイズ計算とフォントを統一する**ことです。Web ページの見た目を安定させ、意図したデザイン通りに表示するための\*\*初期化スタイル（リセット CSS やノーマライズ CSS の一部）\*\*です。

---

## ✅ 各ルールの役割

### 1. `* { margin: 0; padding: 0; box-sizing: border-box; }`

| プロパティ                | 役割                                                                                            |
| ------------------------- | ----------------------------------------------------------------------------------------------- |
| `margin: 0;`              | すべての要素の外側の余白（マージン）をリセット                                                  |
| `padding: 0;`             | すべての要素の内側の余白（パディング）をリセット                                                |
| `box-sizing: border-box;` | 要素の幅・高さに「border」や「padding」も含めてサイズを計算（＝意図したレイアウトになりやすい） |

🔸 特に `box-sizing: border-box` は、**レイアウトの崩れを防ぐための現代 CSS の定番テクニック**です。

---

### 2. `body { font-family: sans-serif; }`

| プロパティ                 | 役割                                                                                             |
| -------------------------- | ------------------------------------------------------------------------------------------------ |
| `font-family: sans-serif;` | ブラウザのデフォルトフォントをゴシック体（サンセリフ）に変更。明朝体などを避けて読みやすくする。 |

🔸 通常は、より細かく `font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", ...` などと指定しますが、ここでは簡易的に `sans-serif` を使用。

---

## 🧩 この CSS の使いどころ

- グローバルスタイルの冒頭（`globals.css` や `reset.css` など）に書いて、**すべてのページに共通適用**。
- Tailwind CSS を使う場合でも、**独自の初期化が必要なら**これを追加することがあります。

---

## ✅ まとめ

| 内容                  | 説明                                                                                           |
| --------------------- | ---------------------------------------------------------------------------------------------- |
| `*` セレクタ          | すべての HTML 要素の余白をゼロにリセットし、ボックスサイズの計算方式を統一                     |
| `body` のフォント指定 | ページ全体のフォントをゴシック系に統一                                                         |
| 全体の役割            | ブラウザの初期スタイルの違いによる見た目のズレを防ぎ、設計通りの UI にするための**初期化 CSS** |

---

Tailwind CSS を使っていても、このような「リセット CSS」の基本思想を理解しておくことは、レイアウトの不具合やバグを回避するうえで非常に役立ちます。
必要であれば、Tailwind における `preflight`（Tailwind 版リセット CSS）についても解説できます！

## theme.css

### (src/styles/theme.css)

```css
/* src/app/styles/theme.css */
/* テーマカラーなどの共通スタイルを定義 */

.bg-primary {
  background-color: #3b82f6; /* blue-500 */
}

.text-primary {
  color: #3b82f6; /* blue-500 */
}

.hover\:bg-primary:hover {
  background-color: #2563eb; /* blue-600 */
}

.text-green-success {
  color: #10b981; /* green-500 */
}

.bg-green-success {
  background-color: #dcfce7; /* green-100 */
}

.border-green-success {
  border-color: #a7f3d0; /* green-300 */
}
```

この `theme.css` の役割は、**アプリケーション全体で共通して使用する「テーマカラー（ブランドカラー）」をクラス名として定義すること**です。Tailwind CSS のユーティリティクラスに近い書き方で、**一貫性のあるデザイン**と**再利用性**を実現しています。

---

## ✅ 全体の役割まとめ

| 項目       | 内容                                                                         |
| ---------- | ---------------------------------------------------------------------------- |
| ファイル名 | `theme.css`                                                                  |
| 主な役割   | カラー関連の共通クラス（テーマカラー）を定義し、アプリ全体に統一感を持たせる |
| メリット   | Tailwind のカスタムクラス風に使える。再利用・変更が簡単。                    |

---

## 🔍 各クラスの説明

### 🔵 `.bg-primary`

```css
background-color: #3b82f6; /* Tailwindのblue-500 */
```

- プライマリーボタンや主要な UI パーツの背景色に使用。
- 例：ログインボタン、Submit ボタンなど。

---

### 🔵 `.text-primary`

```css
color: #3b82f6;
```

- 強調したい文字に使う「テーマカラー文字色」。

---

### 🔵 `.hover\:bg-primary:hover`

```css
background-color: #2563eb; /* Tailwindのblue-600 */
```

- `.bg-primary` のホバー時用バリエーション。
- クラス名にエスケープ文字 `\:` があるのは、Tailwind 互換で `.hover:bg-primary` のように使うため。

---

### ✅ 成功メッセージ系（緑）

#### `.text-green-success`

```css
color: #10b981; /* green-500 */
```

- 成功メッセージのテキスト（例：「保存しました」）

#### `.bg-green-success`

```css
background-color: #dcfce7; /* green-100 */
```

- 成功メッセージの背景色（薄緑）

#### `.border-green-success`

```css
border-color: #a7f3d0; /* green-300 */
```

- 成功メッセージ枠線の色（やや濃いめの緑）

---

## 🧩 使用例（HTML / JSX 内）

```jsx
<div className="bg-primary text-white p-4 rounded">
  プライマリーボタン
</div>

<p className="text-green-success">
  登録が完了しました！
</p>

<div className="bg-green-success border border-green-success p-4">
  保存に成功しました
</div>
```

---

## ✅ なぜ Tailwind を使っているのに別途 CSS を書くのか？

### 理由：

- Tailwind のユーティリティクラスだと毎回 `bg-blue-500`, `hover:bg-blue-600`, ... を書く必要がある
- `theme.css` で `.bg-primary`, `.text-green-success` などの「**意味のある名前（セマンティックな名前）**」にまとめておくと：

| Tailwind の書き方 | テーマ CSS の書き方  |
| ----------------- | -------------------- |
| `bg-blue-500`     | `bg-primary`         |
| `text-green-500`  | `text-green-success` |

→ デザイン変更時にも 1 か所で色を差し替えるだけで済む。

---

## ✅ まとめ

| 項目       | 説明                                                             |
| ---------- | ---------------------------------------------------------------- |
| ファイル名 | `theme.css`                                                      |
| 主な役割   | アプリ全体で使う色（背景色・文字色・境界線色）の共通クラスを定義 |
| メリット   | デザインの統一、再利用性アップ、メンテナンスしやすい             |
| 使用例     | 成功メッセージの表示・プライマリーボタン・強調テキストなど       |

---

さらに踏み込んで Tailwind の `tailwind.config.js` にテーマカラーを定義すれば、より統合されたテーマ管理も可能です。必要であればその方法もご案内できます！
