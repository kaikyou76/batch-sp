<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">007 ゴール第 4 段階 雛形の改善</span>

#### 已深度思考

````
のControllerの実装と、提示されたcurlコマンドについて検討します。

### 1. 登録（POST）に関するcurlコマンド
```bash
curl -X POST http://localhost:8080/api/departments \
 -H "Content-Type: application/json" \
 -d '{"name": "開発部"}'
````

- このリクエストでは、`parentId`が指定されていません。`Department`クラスの`parentId`は`Long`型で、デフォルトは`null`です。
- そのため、このリクエストはルート部署（親部署なし）の部署を作成することを意図しています。
- 問題点:
  - サービス層の`create`メソッドでは、`parentId`が`null`の場合、データベースには`parent_id`として`NULL`が挿入されます。これはスキーマ（`parent_id`が NULL 許容）的には正しいです。
  - しかし、親部署 ID が存在しない（または無効）の場合のバリデーションが現在の実装にありません。もし親部署 ID が指定された場合、その ID が存在するかどうかのチェックが現在のサービス層の`create`メソッドにはないため、存在しない親部署 ID が指定された場合、データベースで外部キー制約違反が発生します。

### 2. 一覧取得（GET）に関する curl コマンド

```bash
curl http://localhost:8080/api/departments
```

- このコマンドは問題なく動作するはずです。

### 改善点: 親部署 ID の存在チェック

現在の`create`メソッド（サービス層）には、親部署 ID の存在チェックがありません。同様に`update`メソッドにも存在チェックがないため、存在しない親部署 ID を指定した場合、データベース制約違反が発生し、Spring が`DataIntegrityViolationException`をスローします。この例外は現在キャッチされていないため、クライアントには 500 エラーが返ります。

#### 推奨対応:

サービス層の`create`と`update`メソッドで、`parentId`が指定されている場合にその親部署が存在するかチェックする。

**DepartmentServiceImpl.java (create メソッドに追加)**

```java
@Override
@Transactional
public Department create(Department department) {
    // 親部署IDが指定されている場合、存在チェック
    if (department.getParentId() != null) {
        // 存在しない場合はDepartmentNotFoundExceptionを投げる
        if (!departmentMapper.existsById(department.getParentId())) {
            throw new DepartmentNotFoundException("Parent department not found with id: " + department.getParentId());
        }
    }

    department.setCreatedAt(LocalDateTime.now());
    departmentMapper.insert(department);
    return department;
}
```

**DepartmentServiceImpl.java (update メソッドに追加)**

```java
@Override
@Transactional
public Department update(Department department) throws ... {
    // ... 既存のチェック

    // 親部署IDが指定されている場合、存在チェック（自分自身ではないことは既にチェック済み）
    if (department.getParentId() != null) {
        // 存在しない場合は例外
        if (!departmentMapper.existsById(department.getParentId())) {
            throw new DepartmentNotFoundException("Parent department not found with id: " + department.getParentId());
        }
    }

    // ... 更新処理
}
```

## 修正コード(src/main/java/com/example/orgchart_api/service/impl/DepartmentServiceImpl.java)

```java
package com.example.orgchart_api.service.impl;

import com.example.orgchart_api.domain.Department;
import com.example.orgchart_api.exception.DepartmentNotFoundException;
import com.example.orgchart_api.exception.OperationNotAllowedException;
import com.example.orgchart_api.repository.DepartmentMapper;
import com.example.orgchart_api.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class DepartmentServiceImpl implements DepartmentService {

    private final DepartmentMapper departmentMapper;

    @Autowired
    public DepartmentServiceImpl(DepartmentMapper departmentMapper) {
        this.departmentMapper = departmentMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> findAll() {
        return departmentMapper.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Department findById(Long id) throws DepartmentNotFoundException {
        Optional<Department> department = departmentMapper.findById(id);
        return department.orElseThrow(() ->
                new DepartmentNotFoundException("Department not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> findChildren(Long parentId) {
        return departmentMapper.findByParentId(parentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> findHierarchy() {
        return departmentMapper.findHierarchy();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Department> searchByName(String name) {
        return departmentMapper.findByName(name);
    }

    @Override
    @Transactional
    public Department create(Department department) {
        // 親部署IDが指定されている場合、存在チェック
        if (department.getParentId() != null) {
            // 存在しない場合はDepartmentNotFoundExceptionを投げる
            if (!departmentMapper.existsById(department.getParentId())) {
                throw new DepartmentNotFoundException("Parent department not found with id: " + department.getParentId());
            }
        }

        // 新規作成時はcreated_atを現在時刻で設定
        department.setCreatedAt(LocalDateTime.now());
        departmentMapper.insert(department);
        return department;
    }

    @Override
    @Transactional
    public Department update(Department department)
            throws DepartmentNotFoundException, OperationNotAllowedException {

        // 更新対象が存在するか確認
        Department existingDepartment = findById(department.getId());

        // 親部署が自分自身を参照していないか検証
        if (department.getParentId() != null &&
                department.getParentId().equals(department.getId())) {
            throw new OperationNotAllowedException("Department cannot be a parent of itself");
        }

        // 親部署IDが指定されている場合、存在チェック（自分自身ではないことは既にチェック済み）
        if (department.getParentId() != null) {
            // 存在しない場合は例外
            if (!departmentMapper.existsById(department.getParentId())) {
                throw new DepartmentNotFoundException("Parent department not found with id: " + department.getParentId());
            }
        }

        // 更新処理
        department.setCreatedAt(existingDepartment.getCreatedAt()); // 作成日時は変更しない
        departmentMapper.update(department);
        return department;
    }

    @Override
    @Transactional
    public void delete(Long id)
            throws DepartmentNotFoundException, OperationNotAllowedException {

        // 削除対象が存在するか確認
        Department department = findById(id);

        // 子部署が存在するか確認
        List<Department> children = departmentMapper.findByParentId(id);
        if (!children.isEmpty()) {
            throw new OperationNotAllowedException(
                    "Cannot delete department with child departments");
        }

        try {
            departmentMapper.delete(department);
        } catch (DataIntegrityViolationException e) {
            throw new OperationNotAllowedException(
                    "Cannot delete department with associated employees");
        }
    }
}

```

また、`DepartmentMapper`に`existsById`メソッドを追加する必要があります。

**DepartmentMapper.java**

```java
boolean existsById(long id);
```

## 修正コード(src/main/java/com/example/orgchart_api/repository/DepartmentMapper.java)

```java
package com.example.orgchart_api.repository;

import com.example.orgchart_api.domain.Department;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Optional;

@Mapper
public interface DepartmentMapper {

    // 全部署取得
    List<Department> findAll();

    // IDで部署取得
    Optional<Department> findById(long id);

    // 親部署IDで子部署リスト取得
    List<Department> findByParentId(Long parentId);

    // 部署登録
    void insert(Department department);

    // 部署更新
    void update(Department department);

    // 部署削除
    void delete(Department department);

    // 部署階層構造取得（オプション）
    List<Department> findHierarchy();

    // 部署名で検索（オプション）
    List<Department> findByName(String name);

    // 追加: IDで部署が存在するかチェック
    boolean existsById(long id);

}

```

**DepartmentMapper.xml**

```xml
<select id="existsById" parameterType="long" resultType="boolean">
    SELECT COUNT(*) > 0
    FROM departments
    WHERE id = #{id}
</select>
```

## 修正コード(src/main/resources/mapper/DepartmentMapper.xml)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
<mapper namespace="com.example.orgchart_api.repository.DepartmentMapper">

    <!-- 部署エンティティとデータベースカラムのマッピング -->
    <resultMap id="DepartmentResultMap" type="com.example.orgchart_api.domain.Department">
        <id property="id" column="id" />
        <result property="name" column="name" />
        <result property="parentId" column="parent_id" />
        <result property="createdAt" column="created_at" />
    </resultMap>

    <!-- 全部署取得 -->
    <select id="findAll" resultMap="DepartmentResultMap">
        SELECT id, name, parent_id, created_at
        FROM departments
        ORDER BY created_at DESC
    </select>

    <select id="findById" parameterType="long" resultMap="DepartmentResultMap">
        SELECT id, name, parent_id, created_at
        FROM departments
        WHERE id = #{id}
    </select>

    <!-- 親部署IDで子部署リスト取得 -->
    <select id="findByParentId" parameterType="Long" resultMap="DepartmentResultMap">
        SELECT id, name, parent_id, created_at
        FROM departments
        WHERE parent_id = #{parentId}
        ORDER BY name ASC
    </select>

    <!-- 指定IDの部署が存在するかチェック -->
    <select id="existsById" parameterType="long" resultType="boolean">
        SELECT COUNT(*) > 0
        FROM departments
        WHERE id = #{id}
    </select>

    <!-- 部署登録 -->
    <insert id="insert" parameterType="com.example.orgchart_api.domain.Department"
            useGeneratedKeys="true" keyProperty="id" keyColumn="id">
        INSERT INTO departments (name, parent_id, created_at)
        VALUES (#{name}, #{parentId}, #{createdAt})
    </insert>

    <!-- 部署更新 -->
    <update id="update" parameterType="com.example.orgchart_api.domain.Department">
        UPDATE departments
        SET
            name = #{name},
            parent_id = #{parentId},
            created_at = #{createdAt}
        WHERE id = #{id}
    </update>

    <!-- 部署削除（論理削除ではなく物理削除を前提） -->
    <delete id="delete" parameterType="com.example.orgchart_api.domain.Department">
        DELETE FROM departments
        WHERE id = #{id}
    </delete>

    <!-- 部署階層構造取得（再帰CTEを使用したツリー構造取得） -->
    <select id="findHierarchy" resultMap="DepartmentResultMap">
        WITH RECURSIVE DepartmentHierarchy AS (
            SELECT id, name, parent_id, created_at
            FROM departments
            WHERE parent_id IS NULL
            UNION ALL
            SELECT d.id, d.name, d.parent_id, d.created_at
            FROM departments d
                     INNER JOIN DepartmentHierarchy dh ON d.parent_id = dh.id
        )
        SELECT id, name, parent_id, created_at
        FROM DepartmentHierarchy
        ORDER BY parent_id NULLS FIRST, created_at
    </select>

    <!-- 部署名で部分一致検索 -->
    <select id="findByName" parameterType="String" resultMap="DepartmentResultMap">
        SELECT id, name, parent_id, created_at
        FROM departments
        WHERE name ILIKE CONCAT('%', #{name}, '%')
        ORDER BY
            CASE
            WHEN name ILIKE CONCAT(#{name}, '%') THEN 0
            ELSE 1
        END,
            name
    </select>
</mapper>

```

### 結論

提示された curl コマンドは、親部署を指定しない登録の例であり、現在の実装でも動作します（ルート部署として登録される）。ただし、親部署 ID を指定する場合のバリデーションが不足しているため、上記のように存在チェックを追加することを強く推奨します。

また、`update`メソッドでも同様の存在チェックが必要です（自分自身を親に設定できないチェックは既にありますが、指定した親部署が存在するかのチェックも必要です）。

### 例外処理

現在の Controller には、`DepartmentNotFoundException`と`OperationNotAllowedException`をキャッチする例外ハンドラがあります。上記の存在チェックで`DepartmentNotFoundException`をスローすれば、クライアントには 404 ステータスでメッセージが返ります。

````

現在のController実装とcurlコマンドの整合性について分析します。

### 登録（POST）処理の検証
```bash
curl -X POST http://localhost:8080/api/departments \
  -H "Content-Type: application/json" \
  -d '{"name": "開発部"}'
````

**問題点と対応**:

1. **parentId の欠如**

   - リクエスト: `parentId`フィールドがない
   - 結果: `Department`オブジェクトの`parentId`は`null`で処理される
   - 対応:
     - 親部署を持たないルート部署として登録される（問題ない）
     - 明示的に親部署を指定しない場合は、この形式で正しい

2. **createdAt の自動設定**
   - サービスの`create()`メソッドが`createdAt`を自動設定するため、リクエストに含めなくて良い（正しい動作）

**修正の必要はありません**

### 一覧取得（GET）処理の検証

```bash
curl http://localhost:8080/api/departments
```

**問題点なし**:

- エンドポイント `/api/departments` に GET リクエストを送る形式は Controller の`getAllDepartments()`メソッドと完全に一致

### 追加検証が必要なケース

#### 親部署を持つ部署を作成する場合

```bash
# 親部署IDを指定する必要あり
curl -X POST http://localhost:8080/api/departments \
  -H "Content-Type: application/json" \
  -d '{"name": "開発チーム", "parentId": 1}'  # 親部署ID=1
```

#### 更新処理の検証

```bash
# ID指定が必要（URLパスとリクエストボディのIDは一致させる）
curl -X PUT http://localhost:8080/api/departments/2 \
  -H "Content-Type: application/json" \
  -d '{"name": "開発部", "parentId": 1}'
```

### 全体的な評価

**curl コマンドの書き方は問題ありません**。理由：

1. 登録時の JSON 形式が`Department`クラスの構造と一致
   - 必須フィールド`name`が含まれている
   - オプションフィールド`parentId`が省略可能（デフォルト null）
2. 一覧取得が適切なエンドポイントを呼び出し
3. HTTP メソッド（POST/GET）が正しい

### 注意点と推奨改善

1. **バリデーションの追加推奨**（現状不足）:

   ```java
   // サービス層のcreateメソッドに追加すべきチェック
   if (department.getParentId() != null) {
       if (!departmentMapper.existsById(department.getParentId())) {
           throw new DepartmentNotFoundException("親部署が存在しません: " + department.getParentId());
       }
   }
   ```

2. **ID 生成の考慮**:

   - 登録時レスポンスに生成された ID が含まれる（正しい動作）

   ```json
   {
     "id": 1,
     "name": "開発部",
     "parentId": null,
     "createdAt": "2023-10-05T12:00:00"
   }
   ```

3. **エラーレスポンスの例**:
   ```json
   // バリデーションエラー例
   {
     "timestamp": "2023-10-05T12:00:00",
     "status": 400,
     "message": "名前は必須フィールドです"
   }
   ```

### テストカバレッジの拡充提案

```bash
# 異常系テスト例
# 存在しない親部署指定
curl -X POST http://localhost:8080/api/departments \
  -H "Content-Type: application/json" \
  -d '{"name": "不正部署", "parentId": 999}'

# 名前不足
curl -X POST http://localhost:8080/api/departments \
  -H "Content-Type: application/json" \
  -d '{"parentId": 1}'  # nameフィールド欠如

# 無効なIDでの更新
curl -X PUT http://localhost:8080/api/departments/999 \
  -H "Content-Type: application/json" \
  -d '{"name": "存在しない部署"}'
```

### 結論

**提供された curl コマンドは現在の実装と完全に互換性があり、正しい書き方です**。ただし、堅牢なシステムとするためには：

1. サービス層に親部署存在チェックを追加
2. 名前の必須チェックを強化
3. 異常系テストを追加

これらの改善を行うことで、より安全な API となりますが、現状の curl コマンド自体に問題はありません。
