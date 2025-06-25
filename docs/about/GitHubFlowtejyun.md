# チーム・組織開発に最適なフロー：GitHub 運用手順書

## ✅ チーム・組織開発に最適なフロー

以下はプロジェクトにもっとも理想的な流れです：

| 手順                              | 内容                                                                                                                     |
| --------------------------------- | ------------------------------------------------------------------------------------------------------------------------ |
| ✅①                               | Jira プロジェクトを作成し、プロジェクトキー（例：`SCRUM`）を決定                                                         |
| ✅②                               | ローカルに `nextjs_orgchart_api` プロジェクト雛形を作成（`main`ブランチではなく、`feature/init-project` ブランチで作業） |
| ✅③                               | `.github/workflows/ci.yml`、`pull_request_template.md`、`CONTRIBUTING.md` を含め、CI・PR ルールを整備                    |
| ✅④                               | GitHub で空のリポジトリを作成（`https://github.com/kaikyou76/nextjs_orgchart_api`）                                      |
| ✅⑤                               | ローカルから `feature/init-project` を初プッシュ（main ではない！）                                                      |
| ✅⑥                               | `main`, `develop`, `feature/init-project` を作成                                                                         |
| ✅⑦                               | `Settings > Branches` → `Add branch ruleset` にて main / develop に保護ルールを追加                                      |
| ✅⑧                               | `feature/init-project` → `develop` に PR 作成（CI＆レビュー）→ マージ                                                    |
| ✅⑨                               | `develop` → `main` に PR 作成（最終確認＋ CI）→ マージ                                                                   |
| ✅ → 初めて main にコードが入る！ |                                                                                                                          |

---

## 📝 補足：feature/init-project は初期雛形ブランチ名の例

- `feature/SCRUM-1-init-project` のように Jira キーも含めると完璧です。

---

#
