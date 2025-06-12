<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">004 ゴール第 1 段階</span>

今後の拡張性（複雑 SQL・JOIN 対応）を考慮し、**MyBatis の SQL はすべて XML ファイルで定義**する。

---

## ✅ ゴール（第 1 段階・PostgreSQL + MyBatis XML マッパー版）

**Spring Boot アプリ `orgchart-api` の目的：**
`departments` テーブルを対象とした **REST API**（GET 全件取得 ＆ POST 新規登録）を、
**MyBatis XML マッパー**＋**PostgreSQL** で実装する。

---

## ✅ 機能仕様（REST API）

| HTTP | パス               | 機能           |
| ---- | ------------------ | -------------- |
| GET  | `/api/departments` | 部署一覧を取得 |
| POST | `/api/departments` | 新規部署を登録 |

---

## ✅ ステップ構成

1. **PostgreSQL テーブル定義**
2. **Java エンティティ**
3. **Mapper インタフェース（アノテーションなし）**
4. **Mapper XML（resources/mapper/DepartmentMapper.xml）**
5. **Service 層（任意）**
6. **REST Controller 層**
7. **`application.yml` 設定（MyBatis + PostgreSQL）**

---

## ✅ 1. PostgreSQL テーブル定義

```sql
CREATE TABLE departments (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    parent_id BIGINT REFERENCES departments(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## ✅ 2. Java エンティティ

`Department.java`

```java
package com.example.orgchart.domain;

import java.time.LocalDateTime;

public class Department {
    private Long id;
    private String name;
    private Long parentId; // 追加
    private LocalDateTime createdAt; // 追加

    // getters/setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Long getParentId() { return parentId; } // 追加
    public void setParentId(Long parentId) { this.parentId = parentId; } // 追加

    public LocalDateTime getCreatedAt() { return createdAt; } // 追加
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; } // 追加
}
```

---

## ✅ 3. Mapper インタフェース（アノテーションなし）

`DepartmentMapper.java`

```java
package com.example.orgchart.repository;

import com.example.orgchart.domain.Department;
import java.util.List;

public interface DepartmentMapper {
    List<Department> findAll();
    void insert(Department department);
}
```

---

## ✅ 4. Mapper XML（resources/mapper/DepartmentMapper.xml）

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
  PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
  "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.orgchart.repository.DepartmentMapper">

<resultMap id="DepartmentResultMap" type="com.example.orgchart.domain.Department">
  <id property="id" column="id"/>
  <result property="name" column="name"/>
  <result property="parentId" column="parent_id"/>
  <result property="createdAt" column="created_at"/>
</resultMap>

<select id="findAll" resultMap="DepartmentResultMap">
  SELECT id, name, parent_id, created_at FROM departments ORDER BY id
</select>

<insert id="insert" parameterType="com.example.orgchart.domain.Department" useGeneratedKeys="true" keyProperty="id">
  INSERT INTO departments (name, parent_id)
  VALUES (#{name}, #{parentId})
</insert>

</mapper>
```

---

## ✅ 5. Service 層（任意）

```java
package com.example.orgchart.service;

import com.example.orgchart.domain.Department;
import com.example.orgchart.repository.DepartmentMapper;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class DepartmentService {
    private final DepartmentMapper mapper;

    public DepartmentService(DepartmentMapper mapper) {
        this.mapper = mapper;
    }

    public List<Department> getAll() {
        return mapper.findAll();
    }

    public void create(Department dept) {
    dept.setCreatedAt(LocalDateTime.now()); // 作成日時設定
        mapper.insert(dept);
    }
}
```

---

## ✅ 6. REST Controller 層

```java
package com.example.orgchart.controller;

import com.example.orgchart.domain.Department;
import com.example.orgchart.service.DepartmentService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/departments")
public class DepartmentController {

    private final DepartmentService service;

    public DepartmentController(DepartmentService service) {
        this.service = service;
    }

    @GetMapping
    public List<Department> getAllDepartments() {
        return service.getAll();
    }

    @PostMapping
    public void createDepartment(@RequestBody Department dept) {
        service.create(dept);
    }
}
```

---

## ✅ 7. `application.yml` 設定（MyBatis + PostgreSQL）

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/orgdb
    username: youruser
    password: yourpassword
    driver-class-name: org.postgresql.Driver

mybatis:
  mapper-locations: classpath:mapper/*.xml
  type-aliases-package: com.example.orgchart.domain
  configuration:
    map-underscore-to-camel-case: true
```

---

## ✅ ディレクトリ構成（例）

```
orgchart-api/
├── src/
│   ├── main/
│   │   ├── java/com/example/orgchart/
│   │   │   ├── controller/DepartmentController.java
│   │   │   ├── domain/Department.java
│   │   │   ├── repository/DepartmentMapper.java
│   │   │   └── service/DepartmentService.java
│   │   └── resources/
│   │       ├── mapper/DepartmentMapper.xml
│   │       └── application.yml
```

---

## ✅ curl での動作確認

```bash
# 登録
curl -X POST http://localhost:8080/api/departments \
  -H "Content-Type: application/json" \
  -d '{"name": "開発部"}'

# 一覧取得
curl http://localhost:8080/api/departments
```

---

この設計は将来的な以下の拡張にも対応できます：

- 複雑な JOIN・サブクエリ
- SQL チューニング（Index ヒント、CTE など）
- 動的 SQL（if/choose/foreach）

---

続けて「PUT/DELETE の追加」や「バッチ設計」など進めましょうか？
