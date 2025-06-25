# Jira 提案-4

了解しました！
以下に、**GitHub × Jira × Slack** を連携しつつ、
✅ **コミットメッセージの Jira キー検証**
✅ **Slack 通知（PR 作成時）**
✅ **Jira チケットの自動ステータス遷移**
のセットアップ方法を丁寧に説明します。

---

# ✅ 拡張機能テンプレート：Jira × GitHub × Slack 連携

---

## ✅ ① コミットメッセージに Jira チケットキー（例: `ORG-123`）を含んでいるかチェック

### 🔧 `.github/workflows/validate-commit-message.yml`

```yaml
name: Validate Commit Message

on:
  push:
    branches:
      - develop
      - main

jobs:
  check-commit-msg:
    runs-on: ubuntu-latest
    steps:
      - name: Check commit messages for Jira key
        run: |
          echo "Checking commit messages..."
          git log -1 --pretty=format:"%s" > last_commit.txt
          COMMIT_MSG=$(cat last_commit.txt)
          echo "Commit: $COMMIT_MSG"

          if [[ ! "$COMMIT_MSG" =~ ORG-[0-9]+ ]]; then
            echo "❌ Commit message must include a Jira ticket key like ORG-123"
            exit 1
          else
            echo "✅ Commit message is valid."
          fi
```

📝 **ポイント：**

- `ORG-123` のような Jira キーが含まれているか検証します
- すべての `develop` / `main` への `push` で動作

---

## ✅ ② PR 作成時に Slack に通知を送る

### 🔧 事前準備

1. Slack の Webhook URL を作成：
   Slack → 「アプリを追加」 → `Incoming Webhooks` → 対象チャンネルを選択 → Webhook URL を取得

2. GitHub Secrets に Webhook URL を追加：
   `Settings > Secrets > Actions` にて

   - 名前：`SLACK_WEBHOOK_URL`
   - 値：取得した Slack の Webhook URL

---

### 🔧 `.github/workflows/slack-notify-pr.yml`

```yaml
name: Slack Notify on PR

on:
  pull_request:
    types: [opened, reopened]

jobs:
  notify:
    runs-on: ubuntu-latest
    steps:
      - name: Send message to Slack
        uses: slackapi/slack-github-action@v1.24.0
        with:
          payload: |
            {
              "text": "📢 新しい Pull Request が作成されました！",
              "attachments": [
                {
                  "title": "${{ github.event.pull_request.title }}",
                  "title_link": "${{ github.event.pull_request.html_url }}",
                  "text": "作成者: ${{ github.actor }}",
                  "color": "#36a64f"
                }
              ]
            }
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

## ✅ ③ Jira チケットのステータスを自動で変更（PR マージ時）

> ✅ Atlassian と GitHub の連携が完了していることが前提です
> （[Jira GitHub Integration](https://github.com/marketplace/jira) をインストール済）

### 💡 自動変更の動作例

| GitHub のアクション           | Jira チケットのステータス変更     |
| ----------------------------- | --------------------------------- |
| PR タイトルに `Fixes ORG-123` | Jira チケットを「完了」に自動遷移 |
| コミットに `Closes ORG-456`   | 同上                              |

### 🎯 実践ルール例

#### ✅ PR タイトル

```
feat: add login form (Fixes ORG-123)
```

#### ✅ コミット

```bash
git commit -m "fix: resolve CORS error (Closes ORG-456)"
```

---

## ✅ 統合まとめ：自動化の効果

| 自動化項目                    | 結果                                             |
| ----------------------------- | ------------------------------------------------ |
| Jira キー含むコミット強制     | コミットがチケットと常にリンクされる             |
| Slack 通知                    | チーム全体が PR の作成をリアルタイムで把握可能   |
| Jira チケットの自動遷移       | ステータス更新の手間を削減、進捗が即時に共有可能 |
| GitHub Actions で一括チェック | CI/CD と品質管理が統合                           |

---

## ✨ ご希望があれば…

- ✅ Jira 側の Webhook 設定
- ✅ PR ごとに `Jiraチケットの担当者に自動で割当`
- ✅ リリース PR に `git tag` 自動付与 → `CHANGELOG.md` 自動生成

といった**高度な自動化**も可能です。

---

🔧 ご希望の範囲に応じて、**具体的な設定ファイルの配置や、既存プロジェクトへの導入アドバイス**もできます。
次に進めたい部分を教えてください！
