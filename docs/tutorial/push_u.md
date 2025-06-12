<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">自分のブランチの更新コードを push する流れ</span>

チーム開発において「**自分のブランチを最新の状態に保ちつつ、安全にプッシュする手順**」は非常に重要です。以下に **★★★★★ 安全・正確な手順** をステップごとに解説します。

---

## ✅ 想定

- **リモートの`main`（または`develop`）が常に最新**
- 自分の作業ブランチ：`feature/awesome-feature`
- 目的：**自分の変更を、他の人の最新コードと衝突しないように push する**

---

## 🔁 手順：自分のブランチに最新コードを取り込んで push する流れ（★★★★⭐ 安全版）

```sh
# ① main ブランチへ切り替え
git checkout main

# ② 最新の状態を取得
git pull origin main

# ③ 作業ブランチに戻る
git checkout feature/awesome-feature

# ④ 最新 main を取り込む（マージまたはリベース）
git merge main       # ← 複雑な履歴でも安全。 or ↓↓
# git rebase main     # ← 履歴をシンプルにしたい場合（チームルールに従う）

# ⑤ コンフリクトがあれば修正して add
# 修正後
git add .
git commit           # コンフリクト解消コミット（rebase中なら `git rebase --continue`）

# ⑥ ブランチを push
git push origin feature/awesome-feature
```

---

## 🧠 各ステップのポイント解説

| ステップ               | 説明                                                            |
| ---------------------- | --------------------------------------------------------------- |
| `git pull origin main` | 他のメンバーが更新した main のコードを取得                      |
| `git merge main`       | 自分のブランチに main の変更を取り込む（競合解消のタイミング）  |
| `git rebase main`      | 履歴をきれいに保ちたい場合。競合があると難易度 UP（上級者向け） |
| `git push`             | 安全に push。force push は原則禁止 unless instructed            |

---

## 🚫 よくある NG パターン

| やってしまいがちなこと      | なぜ危険？                                                       |
| --------------------------- | ---------------------------------------------------------------- |
| `git push -f`（force push） | チームの履歴が壊れる、他人の作業を消す危険                       |
| `pull` せずに `push`        | コンフリクト未解決で CI が失敗したり、他人の変更を上書きする危険 |
| main ブランチで直接作業     | レビューできない。テスト通らない。                               |

---

## ✅ push 前のチェックリスト

- [x] 最新の main を取り込んだか？
- [x] コンフリクトを解消したか？
- [x] テストやビルドは通っているか？
- [x] 意図しないファイルは含まれていないか？（`git status`）

---

## 🚀 補足：Git GUI or VSCode での操作

1. **main に checkout → Pull**
2. **作業ブランチに戻る**
3. **main と Merge or Rebase**
4. **Push**

---

## 🔚 結論（まとめ）

> **「pull → merge/rebase → conflict 解消 → push」この 4 ステップが最重要！**

この流れを守ることで、チーム全体の Git 履歴がきれいに保たれ、CI/CD も安定し、コードレビューもスムーズになります。

---
