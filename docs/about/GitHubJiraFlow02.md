# Jira 提案-2

了解しました！
以下は **「Jira × GitHub × Next.js」連携ガイド（基本～実践）」** です。

---

# ✅【完全ガイド】Jira × GitHub × Next.js 連携チュートリアル

---

## 🔰 前提条件

| 項目              | 状況                                                                            |
| ----------------- | ------------------------------------------------------------------------------- |
| Jira アカウント   | [Jira Cloud](https://www.atlassian.com/software/jira) にて作成（無料プラン OK） |
| GitHub リポジトリ | Next.js プロジェクトが GitHub に存在していること（例: `next_orgchart_api`）     |

---

## 🧩 1. Jira プロジェクトを作成

1. Atlassian アカウントでログイン
2. 新しい Jira プロジェクト作成（例：名前 `OrgChartAPI`、キー `ORG`）
3. テンプレートは「スクラム」または「カンバン」を選択

---

## 🔗 2. GitHub と Jira を連携

### ✅ 方法：GitHub Marketplace アプリを使う

1. [Jira for GitHub アプリページ](https://github.com/marketplace/jira) にアクセス
2. 「Install it for free」→ 対象の GitHub アカウント/Organization を選択
3. リポジトリの選択（例: `next_orgchart_api`）
4. Atlassian アカウントにログイン → 接続

> ☑ GitHub から Jira へのアクセス許可
> ☑ Jira から GitHub へのイベント連携が可能になります

---

## 🧪 3. 実践：Jira チケットと GitHub ブランチを連携

### 🔖 Jira 側でチケット作成

- 例：チケットキー `ORG-101`、タイトル「ログイン画面の作成」

### 🌿 GitHub でブランチ作成（チケットキーを含める）

```bash
git checkout -b feature/ORG-101-login-page
```

### 💬 コミットメッセージにチケットキーを含める

```bash
git commit -m "feat(ORG-101): create login page component"
```

Jira 側の `ORG-101` チケットに **GitHub のコミットや PR が自動表示** されます！

---

## 🔁 4. GitHub Pull Request → Jira に反映

- ブランチから PR 作成：

  ```txt
  Title: feat(ORG-101): create login page
  ```

- Jira のチケットにこの PR が「関連 pull request」として自動で表示されます

- チケットのステータスを自動遷移する機能もあります（後述）

---

## ⚙️ 5. 自動ステータス変更（オプション）

GitHub の PR に「特定のキーワード」を含めることで、Jira のチケットステータスが自動で変わります。

| キーワード       | Jira の動作                                    |
| ---------------- | ---------------------------------------------- |
| `Fixes ORG-101`  | チケットが「完了」に移動する（完了条件により） |
| `Closes ORG-101` | 同上                                           |

例：

```bash
git commit -m "fix: validation bug (Fixes ORG-101)"
```

---

## 📋 おまけ：よく使うブランチ/コミットルール（Jira 連携用）

### ✅ ブランチ名：

```bash
feature/ORG-101-add-login
fix/ORG-203-fix-cors-error
```

### ✅ コミットメッセージ：

```bash
feat(ORG-101): add login form layout
fix(ORG-203): resolve incorrect CORS header
```

---

## ✅ 結果イメージ（Jira 画面）

```
[ORG-101] ログイン画面の作成

✔ Linked commit:
   - feat(ORG-101): add login layout
✔ Linked PR:
   - https://github.com/yourorg/next_orgchart_api/pull/12
```

---

## 🧩 まとめ：Jira × GitHub × Next.js の利点

| 利点                                    | 内容                                  |
| --------------------------------------- | ------------------------------------- |
| ✅ チケットとコードが常に結びつく       | 誰がどの Issue を解決しているかが明確 |
| ✅ 自動で PR/コミットが Jira に連携     | 手間なく進捗が見える化                |
| ✅ チケットからコードレビューへリンク可 | コミュニケーションの一元化            |
| ✅ スプリント単位で進捗集計も可能       | チーム開発の最適化に貢献              |

---

## 📦 必要であれば…

- CI や PR テンプレートと**組み合わせた完全開発テンプレート一式**
- GitHub Actions で PR のブランチ名に `ORG-xxx` を含んでいるか自動チェックする設定

もご提供できます。必要であれば教えてください！
