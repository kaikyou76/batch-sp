# Gemini CLI の導入

![alt text]({A5C277F4-6ADB-4E2C-BF8B-02F070AE0729}.png)

### Gemini API 取得しておきます。

Get your Gemini API key from: https://makersuite.google.com/app/apikey

GEMINI_API_KEY=AIzaSyBCrptruEPDjxcTbGxyLY4JBE-7wPWfO7A

### Run the CLI: Execute the following command in your terminal:

```bash
npx https://github.com/google-gemini/gemini-cli
```

### Or install it with:

```
npm install -g @google/gemini-cli
gemini
```

### 参照先

https://www.aivi.fyi/aiagents/introduce-Gemini-CLI

https://note.com/shu_hohoemiblog/n/n1d0240f2c6d1

### github リポジトリ

https://github.com/google-gemini/gemini-cli

## インストール

![alt text](image.png)

### テーマを選択してから Enter キーを押す

![alt text](image-1.png)

### 認証方法を選択してから Enter キーを押す

![alt text](image-2.png)

![alt text](image-3.png)

---

## ✅** Windows 環境で `taskmaster-ai` や `mcpServers` 設定を使うことは「可能」です**。

現在：

- Windows 環境
- Gemini CLI を使用中
- `@google/gemini-cli` の `settings.json` が以下の状態：

```json
{
  "theme": "Dracula",
  "selectedAuthType": "gemini-api-key"
}
```

---

## 🔧 手順：`taskmaster-ai` と `mcpServers` を使えるようにする方法

### ① settings.json に統合する

まず、 `settings.json` を以下のように統合する

```json
{
  "theme": "Dracula",
  "selectedAuthType": "gemini-api-key",
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-ここに実際のキー",
        "OPENAI_API_KEY": "sk-proj-ここに実際のキー",
        "GOOGLE_API_KEY": "sk-proj-ここに実際のキー"
      }
    }
  }
}
```

> 🔒 **注意**: API キーを取得して入力する必要があります。

---

### ② `taskmaster-ai` を使うには

Gemini CLI で次のように指定して使います：

```bash
gemini --mcp=taskmaster-ai
```

このとき、Gemini CLI は `settings.json` の `mcpServers.taskmaster-ai` を参照して、該当する CLI ツールをバックエンドとして使います。

---

### ③ API キーの取得と設定

- **OpenAI API キー**: [https://platform.openai.com/account/api-keys](https://platform.openai.com/account/api-keys)
- **Anthropic API キー（Claude）**: [https://console.anthropic.com/account](https://console.anthropic.com/account)
- **Google API キー**（Gemini 用）: [https://makersuite.google.com/app/apikey](https://makersuite.google.com/app/apikey)

API キーを取得したら、`settings.json` に直接埋めるか、以下のように環境変数として設定：

#### PowerShell:

```powershell
$env:OPENAI_API_KEY = "sk-..."
$env:ANTHROPIC_API_KEY = "sk-ant-..."
$env:GOOGLE_API_KEY = "sk-proj-..."
```

#### `.env` ファイルも可（CLI が読み込む場合）

---

## ✅ 動作確認方法

```bash
gemini --mcp=taskmaster-ai
```

または：

```bash
gemini> /mcp use taskmaster-ai
```

その後、通常通りプロンプトを打てば `taskmaster-ai` 経由で応答してくれるはずです。

---

## 💡 補足：`context7` など複数 MCP を切り替えたい場合

```bash
gemini --mcp=context7
```

またはプロンプト内で：

```bash
gemini> /mcp use context7
```

---

## ✅ 結論

- `settings.json` に `mcpServers` を追加することで、Windows でも `taskmaster-ai` などを使用可能。
- API キーは**自分で取得して**反映する必要あり。
- `gemini --mcp=name` で任意のバックエンドに切り替えて使える。

---

## ✅ 以下に、 **Windows 環境（PowerShell 使用）** に合わせて、

`settings.json` と `.env` を適切に設定し、**Gemini CLI で `taskmaster-ai` や `context7` を使う方法**を具体的に案内します。

---

## ✅ ① `settings.json` の正しい設定例

ファイルパス:
`C:\Users\kaikyou\.gemini\settings.json`

内容（自分の API キーに差し替えてください）:

```json
{
  "theme": "Dracula",
  "selectedAuthType": "gemini-api-key",
  "mcpServers": {
    "context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"]
    },
    "taskmaster-ai": {
      "command": "npx",
      "args": ["-y", "--package=task-master-ai", "task-master-ai"],
      "env": {
        "ANTHROPIC_API_KEY": "sk-ant-あなたのキー",
        "OPENAI_API_KEY": "sk-proj-あなたのキー",
        "GOOGLE_API_KEY": "sk-proj-あなたのキー"
      }
    }
  }
}
```

---

## ✅ ② `.env` の設定

ファイルパス:
`C:\Users\kaikyou\.gemini\.env`

内容（環境変数のバックアップ用途にも便利）:

```env
ANTHROPIC_API_KEY=sk-ant-あなたのキー
OPENAI_API_KEY=sk-proj-あなたのキー
GOOGLE_API_KEY=sk-proj-あなたのキー
GEMINI_API_KEY=AIza-あなたのGemini用APIキー
```

> ✅ `.env` ファイルが CLI によって自動的に読み込まれる場合があります（読み込まれない場合は次項参照）。

---

## ✅ ③ PowerShell で手動設定する方法（読み込まれない場合）

PowerShell を開いて以下を実行：

```powershell
$env:ANTHROPIC_API_KEY = "sk-ant-..."
$env:OPENAI_API_KEY = "sk-proj-..."
$env:GOOGLE_API_KEY = "sk-proj-..."
$env:GEMINI_API_KEY = "AIza..."
```

この状態で `gemini` を実行すれば、API キーが有効になります。

---

## ✅ ④ `taskmaster-ai` を使って起動する

```powershell
gemini --mcp=taskmaster-ai
```

または起動後に：

```bash
gemini> /mcp use taskmaster-ai
```

そして通常通りプロンプト入力すれば OK です。

---

## ✅ ⑤ 補足：どの MCP が使われているか確認

```bash
gemini> /mcp status
```

現在使用中の MCP（バックエンド）が表示されます。

---

## ✅ トラブル時の確認ポイント

| 確認項目             | 内容                                                     |
| -------------------- | -------------------------------------------------------- |
| ファイルの文字コード | `settings.json`・`.env` は UTF-8（BOM なし）             |
| JSON 構文            | カンマの付け忘れや `"` 抜けがないか確認                  |
| CLI のバージョン     | `npm ls -g @google/gemini-cli` または `gemini --version` |

---

## 🎁 オススメ：API キーを別管理したいとき

`.env` を安全に管理するために、[dotenv-cli](https://www.npmjs.com/package/dotenv-cli) を使っても OK です：

```bash
npm install -g dotenv-cli
dotenv -e .env -- gemini --mcp=taskmaster-ai
```

---
