<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">テスト環境用の設定ファイル（application-test.properties）</span>

#### 已深度思考

```
用の設定ファイル（application-test.properties）を、本番用の設定（application.properties）を参考に修正します。
本番用の設定ではPostgreSQLを使用していますが、テストではH2インメモリデータベースを使用するようにします。
ただし、MyBatisの設定やログ設定など、共通で使いたい設定もあるため、以下のようにします。

テスト用の設定ファイル（src/test/resources/application-test.properties）を以下のように作成します。

注意点：
  - データベースはH2インメモリを使用（テスト用）
  - 接続プール設定はテストでは不要なことが多いため、コメントアウトまたは削除
  - MyBatisの設定は本番と同じ
  - ログレベルはテスト用に調整

修正後のapplication-test.properties:

```

テスト環境用の設定ファイル（`application-test.properties`）を、本番環境設定を参考に以下のように修正します：

```properties
# ========================
# テスト環境専用設定
# ========================

# アプリケーション基本設定
spring.application.name=orgchart-api-test

# テスト用H2インメモリデータベース設定
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# H2データベースのPostgreSQL互換モード設定
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect

# ========================
# 共通設定（本番環境から継承）
# ========================

# 接続プール設定（テスト用に最適化）
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=1
spring.datasource.hikari.idle-timeout=10000

# MyBatis設定（本番と同じ）
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.example.orgchart_api.domain
mybatis.configuration.map-underscore-to-camel-case=true

# テスト用ログ設定（DEBUGレベルで詳細出力）
logging.level.root=INFO
logging.level.org.springframework=WARN
logging.level.org.springframework.jdbc.core.JdbcTemplate=DEBUG
logging.level.com.example.orgchart_api=DEBUG
logging.level.org.mybatis=TRACE

# エラーレスポンス設定
server.error.include-message=always
server.error.include-binding-errors=never
server.error.include-stacktrace=never
server.error.include-exception=false

# Jackson設定
spring.jackson.serialization.indent-output=true
spring.jackson.default-property-inclusion=non_null

# ========================
# テスト専用追加設定
# ========================

# データベース初期化設定
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema-test.sql
spring.sql.init.data-locations=classpath:data-test.sql

# テスト実行時にH2コンソールを有効化（オプション）
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

### 主な変更点の説明：

1. **H2 データベースの PostgreSQL 互換モード**  
   `MODE=PostgreSQL`オプションを追加し、H2 が PostgreSQL の文法をシミュレートするように設定

2. **接続プール設定の最適化**  
   テスト環境では小規模なプールで十分なためサイズを縮小：

   ```properties
   spring.datasource.hikari.maximum-pool-size=5
   spring.datasource.hikari.minimum-idle=1
   ```

3. **ログレベルの調整**  
   テスト中は詳細なログを出力：

   ```properties
   logging.level.com.example.orgchart_api=DEBUG
   logging.level.org.mybatis=TRACE
   ```

4. **データベース初期化設定**  
   テスト開始時にスキーマとデータを自動投入：

   ```properties
   spring.sql.init.mode=always
   spring.sql.init.schema-locations=classpath:schema-test.sql
   spring.sql.init.data-locations=classpath:data-test.sql
   ```

5. **H2 コンソールの有効化**  
   テスト中に`http://localhost:8080/h2-console`でデータベースの中身を確認可能

### テスト用初期化スクリプト例：

`src/test/resources/schema-test.sql`:

```sql
-- テスト用テーブル作成（本番スキーマの簡易版）
CREATE TABLE IF NOT EXISTS users (
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    user_nm VARCHAR(40) NOT NULL,
    mail_address VARCHAR(256) NOT NULL,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    create_date TIMESTAMP NOT NULL,
    update_date TIMESTAMP NOT NULL,
    update_user VARCHAR(50) NOT NULL
);
```

`src/test/resources/data-test.sql`:

```sql
-- テスト用初期データ
INSERT INTO users (user_id, company_cd, employee_cd, user_nm, mail_address, deleted, create_date, update_date, update_user)
VALUES
(1, '001', 'EMP001', '山田太郎', 'taro.yamada@example.com', false, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'test'),
(2, '001', 'EMP002', '佐藤花子', 'hanako.sato@example.com', false, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'test'),
(3, '002', 'EMP101', '鈴木一郎', 'ichiro.suzuki@example.com', false, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'test'),
(4, '001', 'EMP003', '削除ユーザー', 'deleted@example.com', true, CURRENT_TIMESTAMP(), CURRENT_TIMESTAMP(), 'test');
```

### テストクラスでの設定例：

```java
@SpringBootTest
@ActiveProfiles("test") // testプロファイルを有効化
@AutoConfigureMockMvc
public class UserControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void getActiveUsersTest() throws Exception {
        mockMvc.perform(get("/api/users/company/001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(2))
                .andDo(print());
    }
}
```

この設定により、以下の特徴が得られます：

- PostgreSQL 互換モードで H2 を使用
- テスト実行毎にクリーンなデータベース状態を保証
- テスト用の詳細ログ出力
- H2 コンソールでのデータ確認可能
- 実プロダクションコードの MyBatis 設定を継承
- テスト専用の小さな接続プールで効率化

テスト実行時は、以下のコマンドでテストプロファイルを指定：

```bash
./mvnw test -Dspring.profiles.active=test
```
