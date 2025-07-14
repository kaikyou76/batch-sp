# MeetClaudia 導入実践

### Visual Studio Installer のダウンロード

https://visualstudio.microsoft.com/ja/downloads/
![alt text](image-111.png)
![alt text](image-112.png)
![alt text](image-113.png)
![alt text](image-117.png)
![alt text](image-114.png)
![alt text](image-115.png)

## 🔁PC 再起動する

### Rust のインストール

Rust 公式サイト から rustup-init.exe をダウンロードし、実行。
![alt text](image-110.png)
![alt text](image-116.png)
![alt text](image-118.png)
このまま Enter キーを押すだけで、標準インストール（推奨） が進みます。
![alt text](image-119.png)

- 今の PowerShell / コマンドプロンプトを閉じる
- 新しくターミナル（PowerShell または CMD）を開く

  🧪 動作確認

新しいターミナルで以下を入力して、Rust が正しく使えるか確認しましょう

```bash
rustc --version
cargo --version

```

![alt text](image-120.png)

### 🚀 Claudia セットアップへ準備を継続！

bun をインストール

```bash
iwr https://bun.sh/install.ps1 -useb | iex

```

![alt text](image-121.png)

WebView2 をインストール
https://developer.microsoft.com/en-us/microsoft-edge/webview2/?form=MA13LH
![alt text](image-122.png)
![alt text](image-123.png)
![alt text](image-124.png)

---

## Claude の導入について

## ✅ 結論：Claudia を使いたいなら両方必要（使う順序に意味がある）

| サイト                                                       | 目的                                 | Claudia との関係                                     | 使うタイミング                    |
| ------------------------------------------------------------ | ------------------------------------ | ---------------------------------------------------- | --------------------------------- |
| [https://claude.ai/onboarding](https://claude.ai/onboarding) | Claude アカウント作成 & API 利用設定 | **Claude CLI を使うための必須ステップ**              | Claudia を使う前に必ず必要        |
| [https://claudiacode.com](https://claudiacode.com)           | Claudia アプリのインストールと使い方 | **GUI で Claude CLI の操作を簡易化するためのツール** | Claude CLI のセットアップ後に使用 |

---

---

## 🪜 Claudia 導入のステップ順（正しい順序）

1. **[https://claude.ai/onboarding](https://claude.ai/onboarding)** で：

   - Anthropic アカウント作成
   - Claude CLI をダウンロード（もしくは API キー取得）
   - `claude` CLI コマンドをセットアップ
   - `claude --version` で動作確認

2. **[https://claudiacode.com](https://claudiacode.com)** で：

   - Claudia GUI を clone/build（または今後リリースされるバイナリを使用）
   - `.claude/` プロジェクトがあれば GUI でセッション・エージェント操作

---

![alt text](image-125.png)
![alt text](image-126.png)
![alt text](image-127.png)
![alt text](image-128.png)
![alt text](image-129.png)
![alt text](image-130.png)
![alt text](image-131.png)
![alt text](image-132.png)
![alt text](image-133.png)

## **Claudia を動かせます**

![alt text](image-134.png)
![alt text](image-135.png)

```bash
git clone https://github.com/getAsterisk/claudia.git
cd claudia
bun install
bun run tauri dev

```

![alt text](image-136.png)
![alt text](image-137.png)
![alt text](image-138.png)
![alt text](image-139.png)
![alt text](image-140.png)
![alt text](image-141.png)

### **キャッシュクリアしたい場合**

```bash
# Git Bash または PowerShell で
cd D:\claudia
rm -rf src-tauri\target
bun run tauri dev

```

http://localhost:1420/
![alt text](image-142.png)

## Claude CLI）は正しくグローバルにインストール

```bash
npm install -g @anthropic-ai/claude-code
```

![alt text](image-143.png)

```bash
Windows PowerShell
Copyright (C) Microsoft Corporation. All rights reserved.

新機能と改善のために最新の PowerShell をインストールしてください!https://aka.ms/PSWindows

PS C:\Users\kaikyou> npm install -g @anthropic-ai/claude-code

added 12 packages in 7s

11 packages are looking for funding
  run `npm fund` for details
PS C:\Users\kaikyou> claude --version
1.0.51 (Claude Code)
PS C:\Users\kaikyou> claude doctor

 Claude CLI Diagnostic
 Currently running: unknown (1.0.51)
 Path: C:\Program Files\nodejs\node.exe
 Invoked: C:\Users\kaikyou\AppData\Roaming\npm\node_modules\@anthropic-ai\claude-code\cli.js
 Config install method: unknown
 Auto-updates enabled: true
 Press Enter to continue…
```
