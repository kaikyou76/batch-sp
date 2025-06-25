# Jira 提案-3

承知しました！
以下に、**Jira 連携 + GitHub 運用に最適化された開発テンプレート一式**をまとめました。すぐにプロジェクトに導入可能です。

---

# ✅ Jira 連携 × GitHub 運用 × Next.js 開発テンプレート一式

## 📁 ディレクトリ構成（推奨）

```
your-project/
├── .github/
│   ├── workflows/
│   │   └── ci.yml
│   └── pull_request_template.md
├── CONTRIBUTING.md
├── package.json
└── ...
```

---

## ① GitHub Actions（CI）設定：`.github/workflows/ci.yml`

```yaml
name: CI

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop]

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install dependencies
        run: npm ci

      - name: Type check
        run: npm run typecheck || true

      - name: Lint
        run: npm run lint || true

      - name: Build
        run: npm run build
```

> ※ `typecheck`, `lint`, `build` は `package.json` にスクリプトが必要です。

---

## ② Pull Request テンプレート：`.github/pull_request_template.md`

```md
# 📌 Pull Request テンプレート

## 🎯 チケット番号（Jira）

- Jira キー: ORG-XXX

## 🔧 概要

- 実装/修正した内容の要約を記述

## ✅ チェックリスト

- [ ] 動作確認済み
- [ ] コードレビュー済み
- [ ] CI 通過済み
- [ ] Jira チケットにリンク済み

## 📷 スクリーンショット（UI 変更がある場合）

（必要に応じて貼り付けてください）
```

---

## ③ コミット・ブランチルール：`CONTRIBUTING.md`

```md
# ✅ コミットルール

## ✅ ブランチ名の命名規則

- `feature/ORG-123-[機能名]`
- `fix/ORG-456-[修正内容]`
- `chore/ORG-789-[雑務]`

## ✅ コミットメッセージの書き方（Conventional Commits）

<type>(ORG-123): 説明
```

---

```
### 例

- `feat(ORG-101): add login page UI`
- `fix(ORG-203): resolve CORS issue`

## ✅ タイプ一覧

| タイプ   | 説明                     |
| -------- | ------------------------ |
| feat     | 新機能の追加             |
| fix      | バグ修正                 |
| chore    | ビルド設定、依存の更新等 |
| docs     | ドキュメントのみ変更     |
| style    | フォーマット調整など     |
| refactor | 機能変更を伴わない整理   |
| test     | テスト追加・修正         |
```

---

## ④（任意）CI でブランチ名に Jira チケット番号が含まれているかチェック

### 👉 `.github/workflows/validate-branch.yml`

```yaml
name: Validate Branch Name

on:
  pull_request:
    branches: [develop, main]

jobs:
  check-branch:
    runs-on: ubuntu-latest
    steps:
      - name: Validate branch name contains Jira key (ORG-xxx)
        run: |
          BRANCH_NAME=${{ github.head_ref }}
          if [[ ! $BRANCH_NAME =~ ORG-[0-9]+ ]]; then
            echo "❌ Branch name must include Jira key like ORG-123"
            exit 1
          fi
```

---

## ✅ 最後に

このテンプレートを導入すると：

- 🔗 **Jira と GitHub が完全に連携**
- 🔍 **コミット・PR・CI が一貫性ある運用に**
- 🔐 **チーム開発の品質が自動的に担保**

---

## 💬 ご希望あれば...

- GitHub Actions で「コミットメッセージに Jira チケットキーが含まれているか」チェックする仕組み
- PR 作成時の Slack 通知
- Jira チケットの自動ステータス遷移

も拡張できます。さらに必要でしたらお気軽にお知らせください！
