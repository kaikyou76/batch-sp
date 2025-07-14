# 別のパソコンにコピーして使う

はい、**Claudia GUI + Claude CLI のフルセットアップを別のパソコンにコピーして使うことは** **_理論的に可能_**ですが、いくつか重要なポイントと注意点があります。

---

### ✅ **コピー可能なもの**

以下のようなものは物理的にコピーできます：

| 種類                    | 説明                                                                                             |
| ----------------------- | ------------------------------------------------------------------------------------------------ |
| `claudia/` ディレクトリ | Claudia GUI アプリのソースとビルド済み実行ファイル（`src-tauri/target/release/claudia.exe`）など |
| `~/.claude/` フォルダ   | Claude CLI のセッション・プロジェクト・設定など                                                  |
| `node_modules` フォルダ | Claude CLI の npm グローバルインストールに依存しない場合（ただし再インストール推奨）             |
| `~/.cargo/bin/` 配下    | Rust コンパイル済みバイナリなど（Rust 事前インストール必要）                                     |

---

### ⚠️ **注意点と制約**

#### 1. 📦 **依存関係は再インストール推奨**

- 他のパソコンでは Rust, Bun, Node.js, Visual C++ Build Tools, WebView2 などが**未インストール**の可能性があります。
- コピーよりも、**セットアップスクリプトで自動化** or README に従って再構築するのが確実です。

#### 2. 🔗 **グローバルインストールはコピーできない**

- `npm install -g @anthropic-ai/claude-code` などはグローバル環境に入るため、**コピーしても動作しない可能性が高い**です。

  - ⇒ 新しい PC でも `npm install -g @anthropic-ai/claude-code` を実行するのがベストです。

#### 3. ⚙️ **環境変数や PATH の設定**

- `~/.cargo/bin`, `bun`, `claude` などが PATH に入っていないと動作しません。

  - ⇒ 必要に応じて PowerShell や `.bashrc` / `.zshrc` に PATH を追加。

---

### 💡 **おすすめのアプローチ**

#### ✅ 方法 1: **バックアップ + セットアップスクリプト方式**

1. 以下のフォルダを `.zip` でバックアップ

   - `claudia/`
   - `~/.claude/`

2. 新しい PC に以下をインストール：

   - Rust: `rustup`
   - Bun: `curl -fsSL https://bun.sh/install | bash`
   - Node.js: [https://nodejs.org](https://nodejs.org)
   - Visual Studio C++ Build Tools
   - WebView2 ランタイム

3. Claudia をビルドし直す：

   ```bash
   cd claudia
   bun install
   bun run tauri build
   ```

#### ✅ 方法 2: **インストーラー化**

- Claudia を `.exe` や `.msi` にパッケージし、別 PC でインストールする。
- `bun run tauri build` で `src-tauri/target/release/bundle/` に生成されます。

---

### ✅ github 元が変わっても影響されたくない？

大丈夫です。そのためには：

- Claudia の GitHub リポジトリをクローンした時点のソースを保管（`.git` は削除しておくと安全）
- 依存パッケージ（`bun.lockb` や `package-lock.json`）も一緒に保存
- できればオフラインで動作するように `.exe` 化しておく

---

### ✅ 確実な保存しておきたいもの一覧

| 保存対象                                | 理由                                          |
| --------------------------------------- | --------------------------------------------- |
| `claudia/` フォルダ丸ごと               | Claudia GUI のソースと実行ファイル            |
| `~/.claude/`                            | セッションやプロジェクトなどの履歴            |
| `.cargo/bin/` や Rustup                 | Rust ビルド環境（Rust は再インストールで OK） |
| `bun`, `node`, `npm` などのインストーラ | 再現性ある環境構築用に                        |

---

### 🔚 結論

> ✅ **はい、Claudia GUI + Claude CLI のフルセットアップはコピーできます。ただし環境構築は新しい PC で一部再インストールが必要であり、パッケージの依存性・PATH 設定には注意してください。**

---

もし、「インストーラー作成したい」「環境をスクリプトで自動化したい」なども希望があれば、それ用にテンプレートを提供できますよ！
