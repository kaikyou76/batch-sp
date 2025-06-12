<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">006 ゴール第 3 段階 雛形版完了</span>

# 第 3 段階：全体的に纏めた雛形版完了

## ✅ pom.xml の更新

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>
	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.5.0</version>
		<relativePath/> <!-- lookup parent from repository -->
	</parent>
	<groupId>com.example</groupId>
	<artifactId>orgchart-api</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>orgchart-api</name>
	<description>Demo project for Spring Boot</description>
	<url/>
	<licenses>
		<license/>
	</licenses>
	<developers>
		<developer/>
	</developers>
	<scm>
		<connection/>
		<developerConnection/>
		<tag/>
		<url/>
	</scm>
	<properties>
		<java.version>21</java.version>
	</properties>
	<dependencies>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>


		<!-- MyBatis と Spring Boot の統合 -->
		<dependency>
			<groupId>org.mybatis.spring.boot</groupId>
			<artifactId>mybatis-spring-boot-starter</artifactId>
			<version>3.0.3</version> <!-- Spring Boot 3.x 対応バージョン -->
		</dependency>

		<!-- Spring JDBC（DataIntegrityViolationException などの例外） -->
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-jdbc</artifactId>
		</dependency>

		<!-- トランザクション基盤 -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-jdbc</artifactId>
		</dependency>

		<!-- 明示的なトランザクション管理 -->
		<dependency>
			<groupId>org.springframework</groupId>
			<artifactId>spring-tx</artifactId>
		</dependency>

		<!-- PostgreSQLドライバ -->
		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<scope>runtime</scope>
		</dependency>

		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
		</plugins>
	</build>

</project>

```

## ✅ 起動クラス（`OrgchartApiApplication`） の更新

`src/main/java/com/example/orgchart_api/OrgchartApiApplication.java`

```java
package com.example.orgchart_api;

import org.mybatis.spring.annotation.MapperScan;// ← DepartmentMapper
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
@MapperScan("com.example.orgchart_api.repository") // ← DepartmentMapper のパッケージを指定
public class OrgchartApiApplication {

	public static void main(String[] args) {
		SpringApplication.run(OrgchartApiApplication.class, args);
	}

}

```

### ポイント

- `@MapperScan` の引数は `DepartmentMapper` の **パッケージ名**（つまり `.repository`）です。
- これを書くことで、Spring Boot が自動的にそのパッケージ内の MyBatis Mapper インターフェースをスキャンし、Bean として登録してくれます。
- そのため、`DepartmentServiceImpl` のコンストラクタで `@Autowired` できるようになります。

---

## ✅ 機能仕様（REST API）

| HTTP   | パス                               | 機能                             |
| ------ | ---------------------------------- | -------------------------------- |
| GET    | `/api/departments`                 | 部署一覧を取得                   |
| GET    | `/api/departments/{id}`            | 指定 ID の部署情報を取得         |
| GET    | `/api/departments/{id}/children`   | 指定 ID の部署の子部署一覧を取得 |
| GET    | `/api/departments/hierarchy`       | 部署の階層構造（ツリー）を取得   |
| GET    | `/api/departments/search?name=xxx` | 部署名で検索                     |
| POST   | `/api/departments`                 | 新規部署を登録                   |
| PUT    | `/api/departments/{id}`            | 指定 ID の部署を更新             |
| DELETE | `/api/departments/{id}`            | 指定 ID の部署を削除             |

---

## ✅ ステップ構成

1. **PostgreSQL テーブル定義**
2. **Java エンティティ**
3. **Mapper インタフェース（アノテーションなし）**
4. **Mapper XML（resources/mapper/DepartmentMapper.xml）**
5. **Service 層（任意）**
6. **REST Controller 層**
7. **`application.properties` 設定（MyBatis + PostgreSQL）**

---

## ✅ 1. PostgreSQL テーブル定義

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

## ✅ 2. Java エンティティ

`src/main/java/com/example/orgchart_api/domain/Department.java`

```java
package com.example.orgchart_api.domain;

import java.time.LocalDateTime;

public class Department {
    private long id;
    private String name;
    private Long parentId;
    private LocalDateTime createdAt;

    // デフォルトコンストラクタ（必須）
    public Department() {
    }

    // 新規作成用コンストラクタ
    public Department(String name, Long parentId) {
        this.name = name;
        this.parentId = parentId;
        this.createdAt = LocalDateTime.now();
    }

    // 全フィールド指定コンストラクタ（オプション）
    public Department(long id, String name, Long parentId, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.parentId = parentId;
        this.createdAt = createdAt;
    }

    // ゲッター/セッター（既存のものを保持）
    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getParentId() {
        return parentId;
    }

    public void setParentId(Long parentId) {
        this.parentId = parentId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}


```

---

## ✅ 3. Mapper インタフェース（アノテーションなし）

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

## ✅ 4. Mapper XML（src/main/resources/mapper/DepartmentMapper.xml）

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

## ✅ 5. Service 層

- Service 層の準備のためのカスタム例外クラスを実装する
  `src/main/java/com/example/orgchart_api/exception/DepartmentNotFoundException.java`

```java
package com.example.orgchart_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class DepartmentNotFoundException extends RuntimeException {
    public DepartmentNotFoundException(String message) {
        super(message);
    }
}
```

`src/main/java/com/example/orgchart_api/exception/OperationNotAllowedException.java`

```java
package com.example.orgchart_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.BAD_REQUEST)
public class OperationNotAllowedException extends RuntimeException {
    public OperationNotAllowedException(String message) {
        super(message);
    }
}

```

**Service 層実装開始**
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

**Service 層実装完了**

---

## ✅ 6. REST Controller 層

`src/main/java/com/example/orgchart_api/controller/DepartmentController.java`

```java
package com.example.orgchart_api.controller;

import com.example.orgchart_api.domain.Department;
import com.example.orgchart_api.exception.DepartmentNotFoundException;
import com.example.orgchart_api.exception.OperationNotAllowedException;
import com.example.orgchart_api.service.DepartmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService departmentService;

    @Autowired
    public DepartmentController(DepartmentService departmentService) {
        this.departmentService = departmentService;
    }

    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {
        List<Department> departments = departmentService.findAll();
        return ResponseEntity.ok(departments);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(@PathVariable Long id)
            throws DepartmentNotFoundException {
        Department department = departmentService.findById(id);
        return ResponseEntity.ok(department);
    }

    @GetMapping("/{id}/children")
    public ResponseEntity<List<Department>> getChildDepartments(@PathVariable Long id) {
        List<Department> children = departmentService.findChildren(id);
        return ResponseEntity.ok(children);
    }

    @GetMapping("/hierarchy")
    public ResponseEntity<List<Department>> getDepartmentHierarchy() {
        List<Department> hierarchy = departmentService.findHierarchy();
        return ResponseEntity.ok(hierarchy);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Department>> searchDepartmentsByName(
            @RequestParam String name) {
        List<Department> results = departmentService.searchByName(name);
        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<Department> createDepartment(@RequestBody Department department) {
        Department createdDepartment = departmentService.create(department);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdDepartment);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Department> updateDepartment(
            @PathVariable Long id,
            @RequestBody Department department)
            throws DepartmentNotFoundException, OperationNotAllowedException {

        department.setId(id); // リクエストボディにないIDを設定
        Department updatedDepartment = departmentService.update(department);
        return ResponseEntity.ok(updatedDepartment);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDepartment(@PathVariable Long id)
            throws DepartmentNotFoundException, OperationNotAllowedException {

        departmentService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // 例外ハンドラ
    @ExceptionHandler(DepartmentNotFoundException.class)
    public ResponseEntity<String> handleDepartmentNotFound(DepartmentNotFoundException ex) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(ex.getMessage());
    }

    @ExceptionHandler(OperationNotAllowedException.class)
    public ResponseEntity<String> handleOperationNotAllowed(OperationNotAllowedException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(ex.getMessage());
    }
}


```

---

## ✅ 7. `application.properties` 設定（MyBatis + PostgreSQL）

`src/main/resources/application.properties`

```properties

# アプリケーション基本設定
spring.application.name=orgchart-api

# データソース設定
spring.datasource.url=jdbc:postgresql://localhost:5432/orgchart
spring.datasource.username=postgres
spring.datasource.password=AM2013japan
spring.datasource.driver-class-name=org.postgresql.Driver

# 接続プール設定
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.idle-timeout=30000

# MyBatis設定
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.example.orgchart_api.domain
mybatis.configuration.map-underscore-to-camel-case=true

# 開発用ログ設定
logging.level.org.springframework.jdbc.core.JdbcTemplate=DEBUG
logging.level.com.example.orgchart_api.repository=TRACE

```

ありがとうございます。以下の設定は正しく見えます。

---

### ✅ **あなたの現在の `application.properties` の設定について**

| 項目                      | 値                                          | ステータス                                                           |
| ------------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| DB 接続 URL               | `jdbc:postgresql://localhost:5432/orgchart` | ✅ OK                                                                |
| MyBatis Mapper XML の場所 | `classpath:mapper/*.xml`                    | ✅ OK（`src/main/resources/mapper/DepartmentMapper.xml` がある前提） |
| `type-aliases-package`    | `com.example.orgchart_api.domain`           | ✅ OK（`Department.java` がこのパッケージにあるため）                |
| ログ出力                  | `JdbcTemplate=DEBUG` / `repository=TRACE`   | ✅ OK（SQL や Mapper 呼び出しのデバッグ用）                          |

---

### ✅ 確認するべきチェックリスト（再確認）

#### 1. **エンティティクラスのパス**

ファイル構成がこうなっていれば OK：

```
src/
└── main/
    ├── java/
    │   └── com/
    │       └── example/
    │           └── orgchart_api/
    │               └── domain/
    │                   └── Department.java
```

#### 2. **Mapper インターフェースのパス**

```java
package com.example.orgchart_api.repository;

@Mapper
public interface DepartmentMapper {
    Optional<Department> findById(Long id);
    ...
}
```

#### 3. **Mapper XML のパス**

```
src/
└── main/
    └── resources/
        └── mapper/
            └── DepartmentMapper.xml
```

#### 4. **起動クラスに `@MapperScan` があるか**

```java
@SpringBootApplication
@MapperScan("com.example.orgchart_api.repository") // ← ここが正しい
public class OrgchartApiApplication { ... }
```

---

### ✅ 起動確認方法

#### IntelliJ で確認すること：

- `OrgchartApiApplication.java` を右クリック → `Run`
- 起動ログで以下が出れば成功：

```
Tomcat started on port(s): 8080
Started OrgchartApiApplication in ...
```

---

### 🚀 動作テスト（PowerShell）

アプリが起動したら以下で POST できます：

```powershell
Invoke-RestMethod -Uri http://localhost:8080/api/departments `
  -Method POST `
  -Headers @{ "Content-Type" = "application/json" } `
  -Body '{ "name": "設計チーム", "parentId": 1 }'
```

---

### 📌 補足：POST できないときのチェックポイント

| 原因                   | 確認方法                                                               |
| ---------------------- | ---------------------------------------------------------------------- |
| アプリが起動していない | IntelliJ の実行ログにエラーがないか                                    |
| DB が起動していない    | `psql -U postgres -d orgchart` が通るか                                |
| API が間違っている     | `/api/departments` エンドポイントが存在するか（`@PostMapping` のパス） |

---

必要なら `DepartmentController` のコードも見せていただければ、さらに調整します。

---

## ✅ ディレクトリ構成

```
orgchart-api/
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/orgchart/
│   │   │       ├── OrgchartApiApplication.java
│   │   │       ├── controller/
│   │   │       │   └── DepartmentController.java
│   │   │       ├── domain/
│   │   │       │   └── Department.java
│   │   │       ├── exception/
│   │   │       │   ├── DepartmentNotFoundException.java
│   │   │       │   └── OperationNotAllowedException.java
│   │   │       ├── repository/
│   │   │       │   └── DepartmentMapper.java
│   │   │       └── service/
│   │   │           ├── DepartmentService.java
│   │   │           └── impl/
│   │   │               └── DepartmentServiceImpl.java
│   │   └── resources/
│   │       ├── mapper/
│   │       │   └── DepartmentMapper.xml
│   │       └── application.properties

```

---

提供されたコードをデータベーススキーマと照らし合わせて整合性を確認しました。以下に評価と改善点をまとめます：

### 全体的な評価

- データベーススキーマとドメインモデルのマッピングは適切に行われています
- CRUD 操作とビジネスロジックが網羅的に実装されています
- 階層構造の取得や検索機能など、組織図に必要な機能が実装されています
- 例外処理が適切に実装されています

### 整合性チェック結果

#### 1. データベーススキーマとの整合性

- `Department` クラスのフィールドはデータベースのカラムと正しくマッピングされています
- `parent_id` の参照制約が考慮されています（自己参照の防止チェックあり）
- `created_at` の扱いが適切です（新規作成時のみ設定、更新時は変更しない）

#### 2. レイヤー間の整合性

- Controller → Service → Repository の流れが適切に実装されています
- 各レイヤーの責務が明確に分離されています

#### 3. ビジネスロジックの整合性

- 部署削除時の制約チェック（子部署の存在、従業員の関連）が実装されています
- 親部署の循環参照防止チェックが実装されています

### 改善点・注意点

1. **削除処理の安全性**:

   - 現在の実装では物理削除ですが、`employees`テーブルの`department_id`に`ON DELETE SET NULL`が設定されているため、削除時に従業員の部署が NULL になる可能性があります
   - ビジネス要件に応じて、論理削除への変更を検討しても良いかもしれません

2. **階層構造取得の効率性**:

   - `findHierarchy` の再帰クエリは大規模な組織ではパフォーマンス問題が発生する可能性があります
   - 必要に応じて、階層の深さ制限やキャッシュの導入を検討してください

3. **バリデーションの強化**:

   - 部署名の重複チェックが実装されていません
   - 親部署の存在チェック（更新時に指定された親部署が存在するか）を追加することを推奨します

4. **API 設計の改善点**:

   - `GET /api/departments/{id}/children` で存在しない ID を指定した場合、空配列が返りますが、404 を返す方が適切かもしれません
   - ページネーション対応を検討してください（特に`findAll`と`searchByName`）

5. **日付処理**:
   - `createdAt` のタイムゾーン処理が明確でありません。本番環境では UTC での保存を推奨します

### 推奨追加実装

```java
// DepartmentServiceImpl.java に追加推奨のメソッド
private void validateParentDepartment(Long parentId) throws DepartmentNotFoundException {
    if (parentId != null) {
        // 親部署が存在するか確認
        if (!departmentMapper.findById(parentId).isPresent()) {
            throw new DepartmentNotFoundException("Parent department not found with id: " + parentId);
        }
    }
}

// createメソッドとupdateメソッドで呼び出す
@Override
@Transactional
public Department create(Department department) throws DepartmentNotFoundException {
    validateParentDepartment(department.getParentId());
    // 既存の処理...
}

@Override
@Transactional
public Department update(Department department) throws DepartmentNotFoundException, OperationNotAllowedException {
    validateParentDepartment(department.getParentId());
    // 既存の処理...
}
```

全体的によく設計されたコードであり、データベーススキーマとの整合性も保たれています。上記の改善点を考慮に入れることで、より堅牢なシステムになるでしょう。
