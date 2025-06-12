<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">006-1 整合性確認</span>

## 今回はサービスメソッドとマッパー定義の整合性を確認します。

## ✅ Mapper インタフェース

`src/main/java/com/example/orgchart_api/repository/DepartmentMapper.java`

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

}


```

---

## ✅ Mapper XML（src/main/resources/mapper/DepartmentMapper.xml）

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

---

## ✅ Service 層

`src/main/java/com/example/orgchart_api/service/DepartmentService.java`

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.domain.Department;
import com.example.orgchart_api.exception.DepartmentNotFoundException;
import com.example.orgchart_api.exception.OperationNotAllowedException;

import java.util.List;

public interface DepartmentService {
    List<Department> findAll();
    Department findById(Long id) throws DepartmentNotFoundException;
    List<Department> findChildren(Long parentId);
    List<Department> findHierarchy();
    List<Department> searchByName(String name);
    Department create(Department department);
    Department update(Department department) throws DepartmentNotFoundException, OperationNotAllowedException;
    void delete(Long id) throws DepartmentNotFoundException, OperationNotAllowedException;
}
```

`src/main/java/com/example/orgchart_api/service/impl/DepartmentServiceImpl.java`

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

以下に、**サービスメソッドとマッパー定義の整合性**を一覧でまとめました：

| サービス層メソッド名   | `DepartmentMapper` インターフェース定義          | `DepartmentMapper.xml` 内の定義 ID | 整合性 |
| ---------------------- | ------------------------------------------------ | ---------------------------------- | ------ |
| `findAll()`            | `List<Department> findAll()`                     | `<select id="findAll" ...>`        | ✅     |
| `findById(Long id)`    | `Optional<Department> findById(long id)`         | `<select id="findById" ...>`       | ✅     |
| `findChildren(Long)`   | `List<Department> findByParentId(Long parentId)` | `<select id="findByParentId" ...>` | ✅     |
| `findHierarchy()`      | `List<Department> findHierarchy()`               | `<select id="findHierarchy" ...>`  | ✅     |
| `searchByName(String)` | `List<Department> findByName(String name)`       | `<select id="findByName" ...>`     | ✅     |
| `create(Department)`   | `void insert(Department department)`             | `<insert id="insert" ...>`         | ✅     |
| `update(Department)`   | `void update(Department department)`             | `<update id="update" ...>`         | ✅     |
| `delete(Long id)`      | `void delete(Department department)`             | `<delete id="delete" ...>`         | ✅     |

### 備考:

- `delete()` は `Long id` を受け取っていますが、マッパー定義は `Department` を引数にしており、サービス層で `findById(id)` により `Department` オブジェクトを取得してから渡しているため整合性ありと判断できます。
- すべてのメソッドは、マッパーインターフェースおよび XML 定義と **型・ID・パラメータ**の面で一致しており、**整合性はすべて ✅ です**。

ご希望の形式で再構成しましたが、他にも確認したい観点（例：エラーハンドリング、トランザクション境界など）があればお知らせください。
