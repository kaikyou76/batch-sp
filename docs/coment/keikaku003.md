<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">orgchart-api の中身を REST + Batch 構成に発展させていく</span>

## ✅ 次のステップ：`orgchart-api` の中身を REST + Batch 構成に発展させていく

### 例）今後の追加予定

- `/api/departments` や `/api/employees` などの REST Controller
- `domain`, `dto`, `mapper`, `repository`, `batch` パッケージの分割
- `resources/` にバッチ処理用 CSV 配置
- `application.yml` のプロファイル設定とバッチジョブの設定

---

## ✅ フォルダ構成（案）

```
orgchart-api/
├── src/
│   ├── main/
│   │   ├── java/com/example/orgchart/
│   │   │   ├── controller/          ← REST API
│   │   │   ├── domain/              ← Entity, DTO
│   │   │   ├── repository/          ← MyBatis Mapper
│   │   │   ├── service/             ← 業務ロジック
│   │   │   ├── batch/               ← Spring Batch ジョブ
│   │   │   └── OrgchartApiApplication.java
│   │   └── resources/
│   │       ├── application.yml
│   │       └── mapper/              ← MyBatis XML
└── build.gradle or pom.xml
```

---

## ✅ 次にやることを選べます：

1. ✅ 部署エンティティ・テーブル作成（`Department`）
2. ✅ REST API 実装（例：`/api/departments` GET/POST）
3. ✅ バッチ用 CSV ファイル + 読み取りジョブ
4. ✅ フロントエンド（React）との連携部分から着手
