# ローカルから feature/init-project を初プッシュ（main ではない！）

## ✅ ⑤ 初プッシュ（main ではない！）

```bash
# 新規ブランチ作成 & 作業
git checkout -b feature/SCRUM-1-init-project
# （ファイル編集後）
git add .
git commit -m "feat(SCRUM-1): initialize project"
# GitHubに接続
git remote add origin https://github.com/kaikyou76/nextjs_orgchart_api.git
# 初回プッシュ
git push -u origin feature/SCRUM-1-init-project
```
