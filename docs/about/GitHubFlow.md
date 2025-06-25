# Next.js プロジェクトの GitHub リポジトリ作成＆ブランチ運用フロー完全版

以下は **完全版の GitHub リポジトリ作成・ブランチ運用フロー** です。

---

### **【完全版】Next.js プロジェクトの GitHub リポジトリ作成＆ブランチ運用フロー**

#### **① GitHub リポジトリ作成**

1. **リポジトリ名**: `next_orgchart_api`
2. **初期設定**:
   - `README.md` を追加
   - `.gitignore` に `node_modules/`, `.env` などを設定
   - デフォルトブランチを `main` に設定

#### **② 管理者がブランチを準備**

1. **メインブランチ**:

   - `main`（本番環境用、直接プッシュ禁止）
   - **保護ルールを適用**:  
     ✅ `Require pull request reviews before merging`（PR 必須）  
     ✅ `Require status checks to pass before merging`（CI 必須）

2. **開発ブランチ**:
   - `develop`（`kaikyou_front` の代わりに一般的な命名を推奨）

#### **③ 開発メンバーの作業手順**

1. **最新の `develop` ブランチを取得**:

   ```bash
   git fetch origin
   git checkout develop
   git pull origin develop
   ```

2. **フィーチャーブランチを作成**:

   ```bash
   git checkout -b feature/[機能名]-[メンバー名]
   # 例: feature/add-login-a
   ```

3. **開発完了後、PR（Pull Request）を作成**:
   - `develop` ブランチに向けて PR を送る
   - **必須**: **コードレビュー** を実施
   - CI（GitHub Actions など）がパスしたらマージ

#### **④ 管理者が本番環境へ反映**

1. **`develop` → `main` へのマージ**:

   - リリース準備が整ったら、`main` に向けて PR を作成
   - 最終レビュー後、マージ（`git tag` でバージョン管理推奨）

2. **本番環境デプロイ**:
   - `main` ブランチの更新をトリガーに自動デプロイ（例: Vercel）

---

### **【補足】推奨ルール**

✅ **ブランチ命名規則**:

- `feature/[機能名]`（例: `feature/user-auth`）
- `fix/[修正内容]`（例: `fix/login-error`）

✅ **コミットメッセージ**:

- **フォーマット**: `<type>: <description>`
  ```bash
  git commit -m "feat: add user login function"
  git commit -m "fix: resolve header layout issue"
  ```

✅ **保護ルール**:

- `main` と `develop` ブランチは **直接プッシュ禁止**
- PR 必須・最低 1 人の承認を設定

---

### **【フロー図】**

```
開発メンバー:
[featureブランチ] → PR → [develop]
管理者:
[develop] → レビュー → PR → [main] → デプロイ
```

この運用フローにより、**競合の最小化**と**コード品質の維持**が可能になります！
