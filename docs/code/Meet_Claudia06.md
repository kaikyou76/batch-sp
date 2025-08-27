# 起動加速

はい、`bun run tauri dev` を毎回起動するたびに **7 分以上かかってしまう原因**と、その改善方法について詳しく解説します。

---

## 🔍 問題の原因：なぜ再起動後は遅いのか？

以下のような理由で時間がかかっています：

### ❶ Rust のビルドキャッシュが無効化されている

- 再起動で `target/` ディレクトリや `.cargo` キャッシュがクリアされた（または RAM Disk 等）
- 初回ビルドや dev ビルドは、依存関係も含めた**全コンパイル**になるため数分かかる

### ❷ WebAssembly / Claude CLI を毎回再ビルドしている

- Claudia は起動時に `bun build` で `claude-code-x86_64-pc-windows-msvc.exe` を **再ビルド**している
- これは WebAssembly（`yoga.wasm`）やバイナリ（Claude CLI）が毎回再生成されているからです

---

## ✅ 改善方法（おすすめ順）

---

### 🔧 方法 ①：**一度ビルドして、そのまま再利用する**

#### ✅ 対応手順：

```bash
# 1. 一度だけ実行（production build）
bun run tauri build
```

これで `src-tauri/target/release/bundle/windows/claudia.exe` が生成されます。

#### ✅ 次回以降の起動方法：

```bash
# 単純に実行するだけ（超高速起動）
./src-tauri/target/release/bundle/windows/claudia.exe
```

> 📌 `bun run tauri dev` は **開発用ホットリロード付きのコマンド**なので、通常使用時は不要です。

---

### 🧠 方法 ②：**Claude CLI を事前にバンドルして再ビルドを避ける**

#### 対応策：

1. `src-tauri/binaries/claude-code-x86_64-pc-windows-msvc.exe` を生成済みのものとして保存
2. `predev` スクリプトを無効化 or `bun run dev` だけ実行

```bash
bun run dev
./src-tauri/target/debug/claudia.exe
```

あるいは `tauri.conf.json` 内の `beforeDevCommand` をコメントアウトでも可。

---

### 💡 方法 ③：**Rust ビルドのキャッシュを有効に保つ**

#### 対策例：

- `target/` ディレクトリを削除しない
- ディスクの `cleaner` や `CCleaner` 等で `.cargo` キャッシュを消さない
- SSD にプロジェクトを保存する（HDD だとビルド遅い）
- `cargo install sccache` を使うとビルド時間を短縮できます

```bash
cargo install sccache
set RUSTC_WRAPPER=sccache
```

---

## ⏱️ 起動速度比較（参考）

| 実行方法                 | 起動時間目安        | 備考                     |
| ------------------------ | ------------------- | ------------------------ |
| `bun run tauri dev`      | 5〜10 分            | フルビルド＆開発モード   |
| `bun run tauri build`    | 初回数分 → 以後すぐ | 本番用ビルド（1 回だけ） |
| `claudia.exe` を直接実行 | 数秒                | 最も速い・実用向け       |

---

## 🧩 まとめ

| 改善方法                      | 効果                 |
| ----------------------------- | -------------------- |
| ✅ 本番ビルド後 `.exe` を起動 | 毎回数秒で起動可能に |
| ✅ Claude CLI をバンドル保存  | `bun build` 毎回回避 |
| ✅ Rust ビルドキャッシュ維持  | 再ビルド時間大幅短縮 |
| ✅ SSD + sccache 使用         | Rust ビルド高速化    |

---

必要であれば、**スタートメニューに Claudia.exe を登録**する方法もご案内できます！やってみますか？
Claudia を \*\*Windows のスタートメニューやタスクバーに登録（ショートカット作成）\*\*して、毎回 `bun run tauri dev` をしなくてもすぐ起動できるようにする方法をご案内します。

---

## ✅ 目標

`src-tauri/target/release/bundle/windows/claudia.exe` を簡単に起動できるように：

- スタートメニューから起動できる
- タスクバーにピン留めできる
- デスクトップにショートカットを作れる

---

## 🧭 手順（Windows 10/11 共通）

### ① Claudia.exe の場所を確認する

まず `claudia.exe` があるか確認します：

```bash
D:\claudia\src-tauri\target\release\bundle\windows\claudia.exe
```

この場所を開いておいてください。

---

### ② ショートカットを作成

1. `claudia.exe` を**右クリック**
2. 「送る」→「デスクトップ (ショートカットを作成)」を選択
3. デスクトップにショートカットができる

---

### ③ スタートメニューやタスクバーに登録

#### 🌟 スタートメニューにピン留め

1. 作成したショートカットを右クリック
2. 「スタートメニューにピン留め」を選択

#### 📌 タスクバーにピン留め

1. `claudia.exe` をダブルクリックして一度起動
2. 起動中のアプリアイコンをタスクバー上で右クリック
3. 「タスクバーにピン留め」を選択

---

## 🛠️ 補足（アイコンが設定されていない場合）

Tauri の `claudia.exe` にアイコンが設定されていないと、無地のアイコンになります。これを改善したい場合：

- `src-tauri/icons/icon.ico` に **正しい 256x256, 3.00 形式の ICO ファイル**を用意する
- 再度 `bun run tauri build` で再ビルドするとアイコン付きの `.exe` が生成されます

---

## ✅ 補足：完全移植のための構成まとめ（他の PC にコピーしたい場合）

- `claude-cli`: グローバルインストール済み (`npm install -g @anthropic-ai/claude-code`)
- `claudia.exe`: 本番ビルド済みの `.exe` をコピー
- `~/.claude` ディレクトリ：プロジェクト履歴・セッション保存場所（バックアップ推奨）
- `bun` / `Rust` / `cargo`：他 PC で再ビルドが必要な場合のみ必要

---

## 🎉 最後に

これで、Claudia を他の一般的なデスクトップアプリのように、すぐに使える状態になります。

もし、**インストーラー形式 (.msi / .exe)** でパッケージ化して他 PC に配布したい場合は、それも可能です。必要であればその方法もご案内します。ご希望ですか？
ありがとうございます！
それでは **Claudia を Windows 向けの `.exe` インストーラー形式（setup.exe や msi）にパッケージング**して、**他の PC に配布・インストール可能な形**にする手順をご案内します。

---

## ✅ ゴール

- `Claudia` を `.exe` または `.msi` 形式でビルド
- 他の Windows PC にコピーして GUI インストール可能にする
- Rust/Bun/Git などを**インストールせずに使用できる**

---

## 🧰 事前準備（あなたの PC ですでに完了済み）

以下がインストール済みであれば準備 OK です：

| 必要なツール | 説明                        |
| ------------ | --------------------------- |
| Rust         | `cargo`, `tauri` 用         |
| Bun          | フロントエンドビルド        |
| WebView2     | Windows 用 Tauri ランタイム |
| `claude-cli` | グローバルに導入済み        |

---

## 🛠️ 手順：Tauri アプリの Windows インストーラー化

### ① Production 用に Claudia をビルド

```bash
cd D:\claudia
bun run tauri build
```

✅ 成功すると以下にインストーラーが生成されます：

```
D:\claudia\src-tauri\target\release\bundle\windows\
```

ファイル例：

- `Claudia_0.1.0_x64_en-US.msi`
- `Claudia_0.1.0_x64_en-US.exe`

> `.msi` は標準インストーラー、`.exe` は自己解凍形式です。

---

### ② インストーラーの確認

エクスプローラーで `bundle/windows/` に移動し、以下を確認：

- Claudia\_〇〇.msi：ダブルクリックでインストール
- Claudia\_〇〇.exe：ダブルクリックでセットアップ実行

---

### ③ 他の PC へコピーして実行

- 生成された `.msi` や `.exe` を USB や クラウドで他 PC にコピー
- ダブルクリックでインストーラー起動
- **スタートメニューやデスクトップに Claudia GUI が登録されます**

---

## ✅ ヒント：バージョン番号やアイコンを設定したい場合

`src-tauri/tauri.conf.json` に以下のような設定を追加します：

```jsonc
{
  "package": {
    "productName": "Claudia",
    "version": "1.0.0"
  },
  "tauri": {
    "bundle": {
      "icon": ["icons/icon.ico"],
      "identifier": "com.example.claudia",
      "windows": {
        "certificateThumbprint": null
      }
    }
  }
}
```

---

## ✋ 注意：WebView2 が入っていない PC では？

### 解決策：

Microsoft の公式 WebView2 ランタイム（Evergreen）を一度だけインストール：

🔗 [https://developer.microsoft.com/en-us/microsoft-edge/webview2/](https://developer.microsoft.com/en-us/microsoft-edge/webview2/)

---

## 📦 まとめ

| 作業                   | 状態                       |
| ---------------------- | -------------------------- |
| Claudia GUI ビルド     | ✅ 済                      |
| CLI 導入               | ✅ 済 (`claude --version`) |
| `.exe` or `.msi` 配布  | ✅ 可能                    |
| 他 PC での再構築必要性 | ❌ 不要（バイナリのみ）    |

---

必要なら `.msi` の中に `claude-cli` や初期 `.claude` 設定を含める高度なセットアップも可能です。
ご希望があれば次のステップとしてご案内します。
