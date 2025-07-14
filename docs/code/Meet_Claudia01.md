# Claudia を Windows にインストールするための簡単手順

以下は、**Claudia（Meet Claudia）** を **Windows にインストールして使うまでの簡潔な手順まとめ**です。
あなたが求めているのは「成果対コスト比の高い Claude GUI アプリをすぐに使いたい」ということなので、**最小限の構成で動かす方法**にフォーカスして整理しました。

---

## ✅ Claudia を Windows にインストールするための簡単手順

---

### 🧩 1. **前提：必要なものを準備**

| ツール名                  | 用途                               | インストール先                                                                                                                   |
| ------------------------- | ---------------------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Git                       | コード取得                         | [https://git-scm.com/downloads](https://git-scm.com/downloads)                                                                   |
| Rust                      | バックエンド構築に必要             | [https://rustup.rs/](https://rustup.rs/)                                                                                         |
| Bun                       | フロントエンド管理                 | [https://bun.sh/docs/installation](https://bun.sh/docs/installation)                                                             |
| Claude CLI                | Claudia のベースとなる AI コマンド | [https://claude.ai/（または CLI 提供元）](https://claude.ai/（またはCLI提供元）)                                                 |
| Microsoft C++ Build Tools | Rust を Windows でビルドするため   | [https://visualstudio.microsoft.com/visual-cpp-build-tools/](https://visualstudio.microsoft.com/visual-cpp-build-tools/)         |
| WebView2                  | Claudia の GUI 実行に必要          | [https://developer.microsoft.com/en-us/microsoft-edge/webview2/](https://developer.microsoft.com/en-us/microsoft-edge/webview2/) |

※ Git、Rust、Bun がインストールされたかどうかは、以下のコマンドで確認：

```bash
git --version
rustc --version
bun --version
```

---

### 📦 2. **Claudia のソースコードを取得**

```bash
git clone https://github.com/getAsterisk/claudia.git
cd claudia
```

---

### 📥 3. **必要な依存をインストール**

```bash
bun install
```

---

### 🏗️ 4. **Claudia をビルドして起動**

#### 開発モード（GUI をすぐ確認したい場合）：

```bash
bun run tauri dev
```

#### 本番ビルド（インストーラを作る場合）：

```bash
bun run tauri build
```

→ `src-tauri/target/release/bundle/windows/` に `.exe` や `.msi` が生成されます。

---

### 📋 5. **初回起動後にやること**

1. Claudia を起動
2. `~/.claude/` ディレクトリ（Claude CLI のプロジェクトフォルダ）が検出される
3. CC Agents または CC Projects を選択
4. 既存の Claude セッションが表示される or 新規作成

---

## 💡 補足：うまく動かないときは？

| エラー                      | 解決方法                                                |
| --------------------------- | ------------------------------------------------------- |
| `cargo not found`           | Rust が正しくインストールされていない → `rustup` 再実行 |
| `MSVC not found`            | Visual C++ Build Tools をインストール                   |
| `claude: command not found` | Claude CLI がインストールされていない（提供元から取得） |
| ビルド中に Out of Memory    | タスクを閉じる、または `cargo build -j 2` に変更        |

---

## 🎯 まとめ：Claudia を Windows で動かす最短手順

```bash
# 1. 準備
Install Git, Rust, Bun, Build Tools, WebView2, Claude CLI

# 2. Claudiaをクローン
git clone https://github.com/getAsterisk/claudia.git
cd claudia

# 3. 依存インストール
bun install

# 4. GUI起動（開発モード）
bun run tauri dev
```

---

## 🚀 Claudia はどんな時に便利？

- Claude のセッション履歴を GUI で見たい
- 自作の Claude エージェント（命令セット）を GUI から管理したい
- Claude の使用コスト・トークン数を分析したい
- チェックポイントやセッション分岐を管理したい

---

必要であれば：

- **Claude CLI の導入方法**
- **Claudia 上で自作エージェントを作成する手順**
- **Claude API キーの設定方法**

などもサポートできます。お気軽にお知らせください。
