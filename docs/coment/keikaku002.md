<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">002 プロジェクト構成案</span>

了解しました。あなたのプロジェクト構成に基づき、以下のような **REST API + Batch 処理 + フロントエンド連携** を視野に入れた全体計画を提案します。

---

## ✅ プロジェクト構成案：`my-orgchart-project`

```
my-orgchart-project/
├── frontend-react/          ← React: 組織図表示・登録・検索などのUI
└── orgchart-api/            ← Spring Boot: REST API + バッチ処理 + DB連携
```

---

## 📌 プロジェクト全体の目的（例）

社内の**組織図（Org Chart）を管理・可視化するシステム**：

- 部署・役職・従業員情報の CRUD
- 組織階層のビジュアル表示
- CSV バッチ登録・更新処理
- 履歴ログ・ジョブスケジューリング

---

## ✅ `orgchart-api/` の設計（Spring Boot）

### 1. 技術構成

| 技術                | 内容                     |
| ------------------- | ------------------------ |
| Spring Boot         | メインアプリケーション   |
| Spring Web          | REST API 提供            |
| Spring Batch        | データ一括処理（CSV 等） |
| MyBatis             | DB アクセス              |
| H2/PostgreSQL/MySQL | 本番/開発 DB             |
| Lombok              | コード簡略化             |
| MapStruct（任意）   | DTO⇔Entity 変換          |

---

### 2. API 設計（REST）

| エンドポイント                | メソッド | 機能                                 |
| ----------------------------- | -------- | ------------------------------------ |
| `/api/departments`            | GET      | 部署一覧取得                         |
| `/api/departments/{id}`       | GET      | 部署詳細取得                         |
| `/api/departments`            | POST     | 部署新規作成                         |
| `/api/departments/{id}`       | PUT      | 部署更新                             |
| `/api/departments/{id}`       | DELETE   | 部署削除                             |
| `/api/employees`              | GET      | 社員一覧取得                         |
| `/api/employees`              | POST     | 社員新規登録                         |
| `/api/employees/batch-upload` | POST     | CSV アップロードバッチ開始（非同期） |

---

### 3. バッチ処理設計（Spring Batch）

#### シナリオ ①：社員 CSV の一括インポート

- 入力：CSV ファイル（名前、所属、役職、上司 ID など）
- 処理：検証・既存社員との突合・登録/更新
- 出力：登録ログ（ファイル or DB）

#### シナリオ ②：組織構成の定期バックアップ（夜間ジョブ）

- CRON 設定による定期ジョブ実行
- 全社員の階層をフラットに Export（JSON/CSV）

#### Spring Batch 設計要素：

- `Job`, `Step`, `ItemReader`, `ItemProcessor`, `ItemWriter`

---

### 4. DB スキーマ（例）

```sql
-- departments テーブル
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- employees テーブル
CREATE TABLE employees (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    department_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    position VARCHAR(100),
    manager_id BIGINT REFERENCES employees(id) ON DELETE SET NULL,
    joined_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ✅ `frontend-react/` の構成

### 1. 技術スタック

| 技術                | 内容                   |
| ------------------- | ---------------------- |
| React + TypeScript  | 基本構造               |
| React Router        | 画面遷移管理           |
| Tailwind CSS        | UI スタイリング        |
| Axios               | REST 通信              |
| Recoil/Zustand      | 状態管理               |
| D3.js or react-flow | 組織図描画（階層構造） |

### 2. ページ構成（案）

| パス           | 機能                                 |
| -------------- | ------------------------------------ |
| `/`            | ダッシュボード（部門数・社員数など） |
| `/orgchart`    | 組織図のビジュアル表示（D3）         |
| `/departments` | 部署一覧・編集                       |
| `/employees`   | 社員一覧・編集・登録                 |
| `/upload`      | CSV アップロード画面（バッチ）       |

---

## ✅ 開発ロードマップ（例）

| フェーズ            | 内容                                     |
| ------------------- | ---------------------------------------- |
| 🥇 1. 環境構築      | Maven, React, DB の接続確認、CORS 対応   |
| 🥈 2. CRUD API 実装 | 部署/社員の API 設計・MyBatis で実装     |
| 🥉 3. フロント連携  | React UI + REST 通信（Axios）            |
| 🏅 4. バッチ導入    | Spring Batch で CSV 一括処理を実装       |
| 🎯 5. 組織図描画    | D3.js や react-flow で階層を可視化       |
| 🔄 6. テストと改善  | エラーハンドリング・ログ・非同期対応など |

---

## ✅ 今後の拡張案

- 組織の変更履歴記録（監査ログ）
- 組織図の PDF エクスポート
- LDAP/SSO 連携
- モバイル対応

---

必要であれば、Spring Boot 側の各ファイル（例：Controller, Mapper, XML, Batch Job）や、React 側のフォルダ構成も具体的にご用意できます。どこから始めたいかご希望を教えてください。
