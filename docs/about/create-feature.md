# ローカルで作成 → GitHub にプッシュ

## ✅ ⑥ main / develop / feature ブランチと開発者ブランチ作成

### 手順（ローカルで作成 →Push）：

```bash
cd nextjs_orgchart_api

# main ブランチを作って Push
# git checkout -b main
# git push -u origin main

# develop ブランチを作って Push
git checkout -b develop
git push -u origin develop

# feature/init-project ブランチを作成 Push
git checkout -b feature/init-project
git push -u origin feature/init-project

# 各開発者用ブランチ（例）
git checkout -b feature/SCRUM-101-kaikyou-login
git push -u origin feature/SCRUM-101-kaikyou-login

git checkout -b feature/SCRUM-102-matumura-dashboard
git push -u origin feature/SCRUM-102-matumura-dashboard
```

---

## **補足: ベストプラクティス**

### **1. ブランチの役割**

| ブランチ名  | 用途                                                   |
| ----------- | ------------------------------------------------------ |
| `main`      | 本番環境用（直接コミット禁止）                         |
| `develop`   | 開発用メインブランチ（feature ブランチはここから作成） |
| `feature/*` | 機能開発用（例: `feature/user-login`）                 |
