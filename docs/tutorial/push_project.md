<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">Spring Boot プロジェクトを GitHub に新規プッシュ</span>

`batch-sp`というローカルの Spring Boot プロジェクトを **GitHub に新規プッシュし、最初の自分のブランチを作成して設定する手順** を、ステップバイステップで説明します。

---

## ✅ 事前準備

- Git がインストールされていること（`git --version` で確認）
- GitHub アカウントにログイン済み
- GitHub 上で空のリポジトリ（例：`batch-sp`）を作成済み（まだなら下記で）

---

## 🌐 GitHub でリポジトリを作成（※まだ作っていない場合）

1. GitHub にログイン
2. `+` → `New repository`
3. リポジトリ名：`batch-sp`
4. Public or Private を選択
5. ✅ Initialize with README → **オフ（チェック外す）**
6. Create Repository

---

`https://github.com/kaikyou76/batch-sp`

### …or create a new repository on the command line

```bash
echo "# batch-sp" >> README.md
git init
git add README.md
git commit -m "first commit"
git branch -M main
git remote add origin https://github.com/kaikyou76/batch-sp.git
git push -u origin main
```

### …or push an existing repository from the command line

```bash
git remote add origin https://github.com/kaikyou76/batch-sp.git
git branch -M main
git push -u origin main
```

## 🖥️ ローカルでの手順（プロジェクトディレクトリで）

```bash
# ① プロジェクトディレクトリに移動
cd /path/to/batch-sp

# ② Git 初期化
git init

# ③ すべてのファイルを追加
git add .

# ④ 最初のコミット
git commit -m "Initial commit"

# ⑤ GitHub のリポジトリを origin に設定（あなたのURLに置き換えて）
git remote add origin https://github.com/あなたのユーザー名/batch-sp.git

# ⑥ 最初の自分のブランチ（例：feature/initial-setup）を作成して切り替え
git checkout -b feature/initial-setup

# ⑦ ブランチを GitHub にプッシュ（最初なので `-u` で upstream を設定）
git push -u origin feature/initial-setup
```

---

## ✅ これで完了！

- GitHub 上には `feature/initial-setup` ブランチが push されています。
- 今後は通常通り、編集 → `git add .` → `commit` → `push` の流れで作業できます。

---

## 🔁 以降の作業の流れ（参考）

```bash
# ファイル編集後
git add .
git commit -m "〇〇を追加"

# プッシュ
git push
```

---

## ✍️ 補足（ブランチ戦略）

| ブランチ名        | 用途例                     |
| ----------------- | -------------------------- |
| `main` / `master` | デプロイ可能な安定版       |
| `develop`         | 開発統合用（チームによる） |
| `feature/〇〇`    | 機能追加ごとの個別ブランチ |
| `bugfix/〇〇`     | バグ修正用ブランチ         |

---
