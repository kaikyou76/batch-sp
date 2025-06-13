<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">オブジェクト構成 0.1</span>

以下は、`D:\orgchart-api` プロジェクトの **ディレクトリとファイル構造** をオブジェクト風に整理した出力です（Java パッケージ構成・Spring Boot 構成に準拠）：

---

```plaintext
orgchart-api/
├── pom.xml
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/orgchart_api/
│   │   │       ├── OrgchartApiApplication.java
│   │   │       ├── config/
│   │   │       │   └── SecurityConfig.java
│   │   │       ├── controller/
│   │   │       │   └── UserController.java
│   │   │       ├── domain/
│   │   │       │   └── User.java
│   │   │       ├── dto/
│   │   │       │   └── UserDto.java
│   │   │       ├── exception/
│   │   │       │   ├── DuplicateResourceException.java
│   │   │       │   └── ResourceNotFoundException.java
│   │   │       ├── mapper/
│   │   │       │   └── UserMapper.java
│   │   │       ├── service/
│   │   │       │   ├── UserService.java
│   │   │       │   └── impl/
│   │   │       │       └── UserServiceImpl.java
│   │   │       └── batch/
│   │   │           ├── config/
│   │   │           ├── job/
│   │   │           ├── listener/
│   │   │           ├── processor/
│   │   │           ├── reader/
│   │   │           └── writer/
│   ├── resources/
│   │   ├── application.properties
│   │   └── mapper/
│   │       └── UserMapper.xml
│
├── src/
│   ├── test/
│   │   ├── java/
│   │   │   └── com/example/orgchart_api/
│   │   │       ├── OrgchartApiApplicationTests.java
│   │   │       ├── controller/
│   │   │       │   ├── UserControllerIntegrationTest.java
│   │   │       │   └── UserControllerMockTest.java
│   │   │       ├── mapper/
│   │   │       │   ├── UserMapperIntegrationTest.java
│   │   │       │   └── UserMapperMockTest.java
│   │   │       └── service/
│   │   │           ├── UserServiceImplMockTest.java
│   │   │           └── UserServiceIntegrationTest.java
│   │   └── resources/
│   │       └── application-test.properties
```

---

### 🧩 解説（重要構成要素）

- `controller/`：REST API エンドポイント（例：`UserController.java`）
- `service/`：ビジネスロジック層（`UserService.java`, `UserServiceImpl.java`）
- `mapper/`：DB マッピング（MyBatis など、`UserMapper.java`, `UserMapper.xml`）
- `batch/`：Spring Batch の構成（ジョブ設定、リスナー、リーダーなど）
- `exception/`：独自例外（API のエラーハンドリング用）
- `resources/`：設定ファイルやマッピング XML など
- `test/`：ユニットテスト・統合テスト

---

この構成は、Spring Boot + MyBatis + Batch + テスト戦略の **標準かつ拡張性の高い構成** です。
必要に応じて、`common` や `util` パッケージの追加なども可能です。ご希望あれば、拡張提案もできます。
