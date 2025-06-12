<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">006-2 依存関係全体像</span>

与えられたソースコードは、部署（Department）を管理するための REST API を実装しています。依存関係と処理の流れを整理します。

### 1. テーブル定義

- `departments`テーブル: 部署情報を格納。自己参照（parent_id）で階層構造を表現。
- `employees`テーブル: 従業員情報。部署 ID を外部キーとして参照。

### 2. コードの依存関係（全体の流れ）

- **Controller** (`DepartmentController`): HTTP リクエストを受け付け、Service を呼び出す。
- **Service** (`DepartmentService` インターフェースと `DepartmentServiceImpl` 実装クラス): ビジネスロジックを実行。Repository を呼び出す。
- **Repository** (`DepartmentMapper` インターフェースと `DepartmentMapper.xml` MyBatis マッパー): データベース操作を実行。

### 3. 各コンポーネントの役割と依存関係

#### 3.1. `DepartmentController` (Controller 層)

- クライアントからの HTTP リクエストを処理。
- `DepartmentService` に依存（コンストラクタインジェクション）。
- 各メソッドは対応する HTTP メソッド（GET, POST, PUT, DELETE）を処理。
- 例外ハンドリングも実装。

#### 3.2. `Department` (ドメインモデル)

- 部署のデータ構造を定義（id, name, parentId, createdAt）。

#### 3.3. `DepartmentMapper` (Repository 層: インターフェース)

- データベース操作のメソッドを定義（MyBatis の Mapper インターフェース）。
- 実装は XML ファイル(`DepartmentMapper.xml`)に記述。

#### 3.4. `DepartmentService` (Service 層: インターフェース)

- ビジネスロジックのメソッドを定義。

#### 3.5. `DepartmentServiceImpl` (Service 層: 実装クラス)

- `DepartmentService` インターフェースの実装。
- `DepartmentMapper` に依存（コンストラクタインジェクション）。
- トランザクション管理（`@Transactional`アノテーション）。
- 業務ロジック（例：部署更新時の自己参照チェック、削除時の子部署存在チェックなど）を実装。

#### 3.6. `DepartmentMapper.xml` (MyBatis Mapper XML)

- SQL クエリを定義。`DepartmentMapper`インターフェースのメソッドと対応。
- 結果マッピング（`DepartmentResultMap`）を定義。

### 4. 具体的な処理の流れ（例: 部署作成）

1. クライアントが `POST /api/departments` をリクエスト。
2. `DepartmentController` の `createDepartment` メソッドが呼ばれる。
3. リクエストボディを `Department` オブジェクトにマッピング。
4. `departmentService.create(department)` を呼び出し。
5. `DepartmentServiceImpl` の `create` メソッドが実行される。
   - 現在時刻を `createdAt` に設定。
   - `departmentMapper.insert(department)` を呼び出し。
6. `DepartmentMapper.insert` に対応する SQL（`DepartmentMapper.xml`の insert 文）が実行され、データベースに挿入。
7. 生成された ID が `Department` オブジェクトにセットされ、返される。
8. コントローラーが HTTP ステータス 201（Created）でレスポンスを返す。

### 5. その他の処理の流れ

- **部署取得**: `findAll`, `findById`, `findChildren` などは、Service を介して Mapper を呼び出し、SQL クエリを実行して結果を返す。
- **部署更新**: 更新前の部署の存在チェック、自己参照チェック（自分自身を親にできない）を行い、更新。
- **部署削除**: 削除前の存在チェック、子部署の有無チェック、従業員が関連付けられていないか（データベース制約違反をキャッチ）を確認し、削除。

### 6. 例外処理

- `DepartmentNotFoundException`: 部署が見つからない場合に Service 層でスローされ、コントローラーの例外ハンドラがキャッチして 404 を返す。
- `OperationNotAllowedException`: 業務ルール違反（例：子部署があるのに削除しようとした場合）でスローされ、400 を返す。

### 7. 依存関係のまとめ

- Controller → Service → Repository (Mapper)
- Repository (Mapper インターフェース) ↔ Mapper XML (SQL)

### 8. 補足

- MyBatis の Mapper インターフェースと XML は同じメソッド名で紐づけられる。
- Service 層でトランザクション管理（`@Transactional`）が行われている。

以上が、提供されたソースコードの依存関係と処理の流れです。

### 依存関係と処理の流れの全体図

```
クライアント
    │
    ▼ (HTTPリクエスト)
DepartmentController (REST APIエンドポイント)
    │
    ▼ (ビジネスロジック呼び出し)
DepartmentService (インターフェース)
    │
    ▼ (実装)
DepartmentServiceImpl (サービス実装)
    │
    ▼ (データアクセス)
DepartmentMapper (MyBatisインターフェース)
    │
    ▼ (SQL実行)
DepartmentMapper.xml (MyBatisマッピングファイル)
    │
    ▼ (データ永続化)
departmentsテーブル (PostgreSQL)
```

### 詳細な依存関係と処理フロー

#### 1. **Controller → Service 依存**

- **`DepartmentController`** が **`DepartmentService`** インターフェースに依存
- 全 API メソッドが`DepartmentService`のメソッドを呼び出す
- 例：`GET /api/departments` → `departmentService.findAll()`

#### 2. **Service → Repository 依存**

- **`DepartmentServiceImpl`** が **`DepartmentMapper`** インターフェースに依存
- サービス実装が MyBatis Mapper を呼び出し DB 操作を実行
- 例：`findAll()` → `departmentMapper.findAll()`

#### 3. **Repository → XML マッピング**

- **`DepartmentMapper`** インターフェースのメソッドと **`DepartmentMapper.xml`** の SQL が 1:1 で紐づく
- 例：`findHierarchy()` → XML 内の再帰 CTE クエリ

#### 4. **Service 層のビジネスロジック**

- `DepartmentServiceImpl`に核心的なロジックが実装：

  ```java
  // 例: 更新時の自己参照チェック
  if (department.getParentId() != null &&
      department.getParentId().equals(department.getId())) {
      throw new OperationNotAllowedException("部署が自身の親になることはできません");
  }

  // 例: 削除時の制約チェック
  if (!departmentMapper.findByParentId(id).isEmpty()) {
      throw new OperationNotAllowedException("子部署を持つ部署は削除できません");
  }
  ```

#### 5. **例外処理フロー**

- Service 層でスローされた例外を Controller が捕捉：
  ```java
  @ExceptionHandler(DepartmentNotFoundException.class)
  public ResponseEntity<String> handleDepartmentNotFound(...) {
      return ResponseEntity.status(HttpStatus.NOT_FOUND).body(...);
  }
  ```

### 具体的な API 処理フローの例（部署作成）

```
1. POST /api/departments
   │
2. DepartmentController.createDepartment()
      │
3. リクエストボディ → Departmentオブジェクトにマッピング
      │
4. departmentService.create(department) 呼び出し
      │
5. DepartmentServiceImpl.create()
      │─ created_atに現在時刻設定
      │
6. departmentMapper.insert(department) 実行
      │
7. DepartmentMapper.xml の<insert>タグのSQL発行
      │
8. departmentsテーブルに新規レコード作成
      │
9. 生成されたIDがDepartmentオブジェクトにセットされ返却
      │
10. ControllerがHTTP 201 Createdでレスポンス
```

### 特徴的な処理のポイント

1. **階層構造取得の再帰処理**

   - `findHierarchy()` メソッド：

   ```sql
   WITH RECURSIVE DepartmentHierarchy AS (...)
   ```

   - ルート部署から再帰的に全階層を取得

2. **削除時の安全チェック**

   - 子部署の存在チェック（アプリケーションレベル）
   - 従業員参照のチェック（DB 制約 → `DataIntegrityViolationException`捕捉）

3. **検索の最適化**

   ```sql
   WHERE name ILIKE CONCAT('%', #{name}, '%')
   ORDER BY
     CASE WHEN name ILIKE CONCAT(#{name}, '%') THEN 0 ELSE 1 END,
     name
   ```

   - 前方一致を優先するソート

4. **更新時の不変条件保護**
   - `created_at`の変更防止：
   ```java
   department.setCreatedAt(existingDepartment.getCreatedAt());
   ```

### 依存関係の特徴

- **単方向依存**: Controller → Service → Repository（クリーンアーキテクチャ）
- **インターフェース分離**: Service と Mapper がインターフェースで分離（テスト容易性）
- **MyBatis の利点**: XML で複雑な SQL を可読性高く管理（再帰クエリ等）

この構造により、ビジネスロジック（Service）とデータアクセス（Mapper）が明確に分離され、保守性の高い設計になっています。
