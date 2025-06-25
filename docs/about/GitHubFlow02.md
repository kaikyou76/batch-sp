# GitHub 運用提案-2

了解しました！以下に、Next.js プロジェクト向けの **CI テンプレート**、**PR テンプレート**、**コミットルールテンプレート**の一式をご用意しました。
そのままプロジェクトの `.github/` ディレクトリに追加して使えます。

---

## ✅ ① GitHub Actions 用 CI 設定（`.github/workflows/ci.yml`）

```yaml
# .github/workflows/ci.yml
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

**注意：** `npm run typecheck` や `lint` は `package.json` にスクリプト定義されている前提です。なければ省略 or スクリプトを追加してください。

---

## ✅ ② PR テンプレート（`.github/pull_request_template.md`）

```md
# 📌 Pull Request テンプレート

## 🔧 目的

この PR では何を解決するか？

## 📝 内容

- 機能追加 / バグ修正の概要
- コードの主要な変更点など

## ✅ 確認事項

- [ ] ローカルでの動作確認済み
- [ ] Lint/Type Check/Build が成功する
- [ ] PR レビュー者に共有済み

## 🖼️ スクリーンショット（UI 系変更がある場合）

（貼り付けてください）
```

---

## ✅ ③ コミットルール（`CONTRIBUTING.md` or Wiki に）

```md
# ✅ コミットメッセージルール（Conventional Commits）

| タイプ   | 説明                           |
| -------- | ------------------------------ |
| feat     | 新機能の追加                   |
| fix      | バグ修正                       |
| docs     | ドキュメント変更               |
| style    | フォーマット修正（コード整形） |
| refactor | リファクタリング               |
| test     | テストの追加や修正             |
| chore    | ビルド設定や依存の更新         |

## 例：

- `feat: ログインページを追加`
- `fix: エラーメッセージの日本語対応`
- `docs: READMEの起動方法を追記`
```

---

## ✅ 設置例

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

必要があれば、以下も追加できます：

- `CODEOWNERS`：特定のファイルやディレクトリのレビュー担当者を自動割当
- `ISSUE_TEMPLATE`：バグ報告や機能要望テンプレート

ご希望があれば、そちらもすぐお渡しできます！
