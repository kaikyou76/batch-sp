<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">005 ゴール第 2 段階</span>

では次のステップとして、

---

# 第 2 段階：Department API の拡張 ＆ バッチ処理の基本設計

---

## 1. Department REST API 拡張

| HTTP   | パス                    | 機能           |
| ------ | ----------------------- | -------------- |
| PUT    | `/api/departments/{id}` | 部署情報の更新 |
| DELETE | `/api/departments/{id}` | 部署の削除     |

### 変更点

- Mapper XML に`update` と `delete` SQL を追加
- Mapper インタフェースに対応メソッド追加
- Service、Controller に該当メソッド追加

---

## 2. バッチ処理 基本設計

### 用途例

- 毎日深夜の部署データ一括バックアップ
- 古い部署データの一括削除やアーカイブ
- 他システムからの一括データ取り込み

### 技術選択肢

- Spring Batch
- シンプルなスケジューリング＋ MyBatis SQL 実行
- 外部ジョブ管理ツール（将来的に）

---

## 3. 第 2 段階ゴールイメージ

```
orgchart-api/
├── src/
│   ├── main/
│   │   ├── java/com/example/orgchart/
│   │   │   ├── batch/                        ← バッチ処理関連
│   │   │   │   └── DepartmentBackupJob.java
│   │   │   ├── controller/
│   │   │   │   └── DepartmentController.java
│   │   │   ├── domain/
│   │   │   │   └── Department.java
│   │   │   ├── repository/
│   │   │   │   └── DepartmentMapper.java     ← update/delete 追加済
│   │   │   └── service/
│   │   │       ├── DepartmentService.java
│   │   │       └── BatchService.java         ← バッチ処理サービス
│   │   └── resources/
│   │       ├── mapper/
│   │       │   └── DepartmentMapper.xml      ← update/delete SQL 追加済
│   │       └── application.yml
└── ...
```

---

## 4. 具体的な追加実装例（概要）

### Mapper XML に update/delete を追加

```xml
<update id="update" parameterType="com.example.orgchart.domain.Department">
  UPDATE departments SET name = #{name} WHERE id = #{id}
</update>

<delete id="delete" parameterType="long">
  DELETE FROM departments WHERE id = #{id}
</delete>
```

---

### repository/DepartmentMapper.java（Mapper インタフェース）

```java
package com.example.orgchart.repository;

import com.example.orgchart.domain.Department;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;

@Mapper
public interface DepartmentMapper {
    List<Department> findAll();
    Department findById(Long id);
    void insert(Department department);
    void update(Department department); // ← 追加
    void delete(Long id);               // ← 追加
}
```

---

### service/DepartmentService.java（Service 層）

```java
package com.example.orgchart.service;

import com.example.orgchart.domain.Department;
import com.example.orgchart.repository.DepartmentMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DepartmentService {

   private final DepartmentMapper mapper;

   public DepartmentService(DepartmentMapper mapper) {
       this.mapper = mapper;
   }

   public List<Department> findAll() {
       return mapper.findAll();
   }

   public Department findById(Long id) {
       return mapper.findById(id);
   }

   public void insert(Department department) {
       department.setCreatedAt(LocalDateTime.now());
       mapper.insert(department);
   }

   public void update(Department department) {
       mapper.update(department);
   }

   public void delete(Long id) {
       mapper.delete(id);
   }
}
```

---

### controller/DepartmentController.java（Controller 層）

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
    public List<Department> findAll() {
        return service.findAll();
    }

    @GetMapping("/{id}")
    public Department findById(@PathVariable Long id) {
        return service.findById(id);
    }

    @PostMapping
    public void insert(@RequestBody Department dept) {
        service.insert(dept);
    }

    @PutMapping("/{id}") // ← 追加
    public void update(@PathVariable Long id, @RequestBody Department dept) {
        dept.setId(id);
        service.update(dept);
    }

    @DeleteMapping("/{id}") // ← 追加
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
```

---

### service/BatchService.java（バッチ処理サービス）

```java
package com.example.orgchart.service;

import com.example.orgchart.domain.Department;
import com.example.orgchart.repository.DepartmentMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BatchService {

    private final DepartmentMapper departmentMapper;

    public BatchService(DepartmentMapper departmentMapper) {
        this.departmentMapper = departmentMapper;
    }

    public void backupDepartments() {
        List<Department> list = departmentMapper.findAll();
        // TODO: 実際のバックアップ処理（ファイル書き出しやDB移行など）
        System.out.println("バックアップ部門数：" + list.size());
    }
}
```

---

### バッチ実行クラス（Spring Scheduler 例）

batch/DepartmentBackupJob.java（スケジューラ）

```java
package com.example.orgchart.batch;

import com.example.orgchart.service.BatchService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class DepartmentBackupJob {

    private final BatchService batchService;

    public DepartmentBackupJob(BatchService batchService) {
        this.batchService = batchService;
    }

    // 毎日深夜1時に実行
    @Scheduled(cron = "0 0 1 * * ?")
    public void execute() {
        batchService.backupDepartments();
    }
}
```

---

## 補足：application.yml にスケジューラ有効化設定（@EnableScheduling は別途@Configuration クラスで有効化）

```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/orgchart
    username: root
    password: password
    driver-class-name: com.mysql.cj.jdbc.Driver

mybatis:
  mapper-locations: classpath:mapper/*.xml
```

## 5. 次の方針・ご希望

- このバッチ処理を Spring Batch で詳細設計しますか？
- あるいは簡易スケジューラー実装のまま進めますか？
- 他に重点的に進めたい機能はありますか？

---

ご希望を教えてください！
