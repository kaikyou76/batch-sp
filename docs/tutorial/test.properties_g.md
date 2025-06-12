<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">テスト環境用の設定ファイル（application-test.properties）実践編</span>

### 最終完成版(本番と同じ構造のテスト DB 採用)

`src/test/resources/application-test.properties`

```properties
# PostgreSQL接続設定
spring.datasource.url=jdbc:postgresql://localhost:5432/testirdb
spring.datasource.username=postgres
spring.datasource.password=AM2013japan
spring.datasource.driver-class-name=org.postgresql.Driver

# Hibernate設定
spring.jpa.hibernate.ddl-auto=validate
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true

# テスト用設定
spring.test.database.replace=none

```

## 完成版 ❌← もう破棄しています。

`src/test/resources/application-test.properties`

```properties
# ========================
# 基本設定
# ========================
spring.application.name=orgchart-api-test

# ========================
# データベース設定
# ========================
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# ========================
# 接続プール設定
# ========================
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=1
spring.datasource.hikari.idle-timeout=10000

# ========================
# MyBatis設定
# ========================
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.example.orgchart_api.domain
mybatis.configuration.map-underscore-to-camel-case=true

# ========================
# ログ設定
# ========================
logging.level.root=INFO
logging.level.org.springframework=WARN
logging.level.org.springframework.jdbc.core=DEBUG
logging.level.org.springframework.transaction=TRACE
logging.level.com.example.orgchart_api=DEBUG
logging.level.org.mybatis=TRACE
logging.level.sql=DEBUG

# ========================
# エラーハンドリング設定
# ========================
server.error.include-message=always
server.error.include-binding-errors=never
server.error.include-stacktrace=never
server.error.include-exception=false

# ========================
# JSONシリアライゼーション設定
# ========================
spring.jackson.serialization.indent-output=true
spring.jackson.default-property-inclusion=non_null

# ========================
# データベース初期化設定
# ========================
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema-test.sql
spring.sql.init.data-locations=classpath:data-test.sql

# ========================
# H2コンソール設定
# ========================
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

## 設定の流れ

```properties
# src/test/java/com/example/orgchart_api/application-test.properties
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

#### 已深度思考

```
ファイルの配置場所と内容について検討します。

### 1. 設定ファイルの配置場所:
`src/test/java/com/example/orgchart_api/application-test.properties` というパスに設定ファイルを置くのは適切ではありません。

Spring Bootの慣例では、**テスト用の設定ファイルは `src/test/resources` ディレクトリ直下** に配置します。

正しいパス:
```

src/test/resources/application-test.properties

````

### 2. 設定内容について:
設定内容自体はほぼ適切ですが、いくつか修正点があります。

#### 修正が必要な点:
- **H2のDialect設定**: `spring.jpa.database-platform` はJPA（Hibernate）用の設定です。MyBatisのみを使用している場合は不要です。もしJPAも使用しているのであれば必要ですが、MyBatisのみの場合は削除して問題ありません。
- **スキーマ初期化スクリプト**: `schema-test.sql` と `data-test.sql` は `src/test/resources` ディレクトリに配置する必要があります。
- **ログレベル設定**: テスト時に詳細なログを出すことは問題ありませんが、必要に応じて調整してください。
- **H2コンソール**: テスト中にH2コンソールを有効にするのは便利ですが、通常は不要です。必要に応じて有効化してください。

#### 具体的な修正案:

##### `application-test.properties` の内容:
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
logging.level.org.springframework.jdbc.core=DEBUG
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
````

### 3. テストクラスでのプロファイル有効化:

テストクラスに `@ActiveProfiles("test")` を追加して、テスト用プロファイルを有効化する必要があります。

例:

```java
@SpringBootTest
@ActiveProfiles("test") // 追加
public class UserServiceImplTest {
    // ...
}
```

### 4. 初期化スクリプトの作成:

- `src/test/resources/schema-test.sql`: テスト用データベースのスキーマ作成スクリプト
- `src/test/resources/data-test.sql`: テスト用の初期データ投入スクリプト

例 (schema-test.sql):

```sql
-- テスト用テーブル作成
CREATE TABLE trn_user (
    user_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    user_nm VARCHAR(40) NOT NULL,
    user_nm_kana VARCHAR(80) NOT NULL,
    mail_address VARCHAR(256) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    password_salt VARCHAR(32) NOT NULL,
    pin VARCHAR(8) NOT NULL,
    birthday DATE NOT NULL,
    voice_mail_profile_id INTEGER,
    pickup_group_id INTEGER,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_user_company_cd_employee_cd_key UNIQUE (company_cd, employee_cd),
    CONSTRAINT trn_user_mail_address_key UNIQUE (mail_address)
);

-- 参照テーブルの簡易版 (外部キー制約用)
CREATE TABLE mst_cucm_voice_mail_profile (
    voice_mail_profile_id SERIAL PRIMARY KEY,
    profile_name VARCHAR(50) NOT NULL
);

CREATE TABLE mst_cucm_pickup_group (
    pickup_group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(50) NOT NULL
);

-- 外部キー制約の追加
ALTER TABLE trn_user
ADD CONSTRAINT fk_voice_mail_profile
FOREIGN KEY (voice_mail_profile_id)
REFERENCES mst_cucm_voice_mail_profile(voice_mail_profile_id);

ALTER TABLE trn_user
ADD CONSTRAINT fk_pickup_group
FOREIGN KEY (pickup_group_id)
REFERENCES mst_cucm_pickup_group(pickup_group_id);

-- テスト用参照データ
INSERT INTO mst_cucm_voice_mail_profile (profile_name) VALUES ('Default Profile');
INSERT INTO mst_cucm_pickup_group (group_name) VALUES ('Group A');
```

例 (data-test.sql):

```sql
-- テストユーザーデータ
INSERT INTO trn_user (
    user_id, company_cd, employee_cd,
    user_nm, user_nm_kana, mail_address,
    password_hash, password_salt, pin,
    birthday, voice_mail_profile_id, pickup_group_id,
    deleted, create_date, update_date, update_user
) VALUES
(
    1, '001', 'EMP001',
    '山田 太郎', 'ヤマダ タロウ', 'taro.yamada@example.com',
    '5f4dcc3b5aa765d61d8327deb882cf99', 'somesalt1', '12345678',
    '1980-05-15', 1, 1,
    false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin'
),
(
    2, '001', 'EMP002',
    '佐藤 花子', 'サトウ ハナコ', 'hanako.sato@example.com',
    '5f4dcc3b5aa765d61d8327deb882cf00', 'somesalt2', '87654321',
    '1990-12-24', 1, 1,
    false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP, 'admin'
);

-- シーケンス調整 (自動採番の同期)
SELECT setval('trn_user_user_id_seq', (SELECT MAX(user_id) FROM trn_user));

```

### 5. 注意点:

- テスト用プロファイルを有効にすると、メインの `application.properties` は読み込まれません。共通設定は `application-test.properties` にすべて記述する必要があります。
- H2 の PostgreSQL 互換モードは完全ではないため、PostgreSQL 固有の機能を使用している場合はテストが失敗する可能性があります。

### まとめ:

以下の手順で設定を完了させてください:

1. ファイル配置先: `src/test/resources/application-test.properties`
2. 初期化スクリプト: `src/test/resources/schema-test.sql` と `data-test.sql` を作成
3. テストクラスに `@ActiveProfiles("test")` を追加
4. 必要に応じて H2 の Dialect 設定を削除（MyBatis のみの場合）

これでテスト環境が正しくセットアップされます。

````

設定ファイルの場所と内容について適切かどうかを評価します。

### ✅ 設定場所について
`src/test/java/com/example/orgchart_api/application-test.properties` は**適切ではありません**。

正しい場所は：
```bash
src/test/resources/application-test.properties
````

Spring Boot はテスト実行時に以下の順序で設定ファイルを読み込みます：

1. `src/test/resources/`
2. `src/main/resources/`

`src/test/java/` 以下に置かれたプロパティファイルは読み込まれませんので、必ず `resources` ディレクトリに配置してください。

---

### 🛠 設定内容の改善提案

#### 1. **不要な設定の削除**

```properties
# 削除推奨（JPAを使用していない場合）
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

#### 2. **設定の最適化**

```properties
# 改善点：スキーマ初期化設定（より明示的に）
spring.sql.init.mode=always
spring.sql.init.platform=h2
spring.sql.init.schema-locations=classpath:schema-test.sql
spring.sql.init.data-locations=classpath:data-test.sql

# ログ設定の調整（テストに適した設定）
logging.level.org.springframework.transaction=TRACE
logging.level.sql=DEBUG
```

#### 3. **H2 の PostgreSQL 互換性強化**

```properties
# 追加推奨（PostgreSQL互換性を高める）
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL;DATABASE_TO_LOWER=TRUE;CASE_INSENSITIVE_IDENTIFIERS=TRUE
```

---

### 📂 完成形の設定例 (`src/test/resources/application-test.properties`)

```properties
# ========================
# 基本設定
# ========================
spring.application.name=orgchart-api-test

# ========================
# データベース設定
# ========================
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1;MODE=PostgreSQL
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# ========================
# 接続プール設定
# ========================
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=1
spring.datasource.hikari.idle-timeout=10000

# ========================
# MyBatis設定
# ========================
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.example.orgchart_api.domain
mybatis.configuration.map-underscore-to-camel-case=true

# ========================
# ログ設定
# ========================
logging.level.root=INFO
logging.level.org.springframework=WARN
logging.level.org.springframework.jdbc.core=DEBUG
logging.level.org.springframework.transaction=TRACE
logging.level.com.example.orgchart_api=DEBUG
logging.level.org.mybatis=TRACE
logging.level.sql=DEBUG

# ========================
# エラーハンドリング設定
# ========================
server.error.include-message=always
server.error.include-binding-errors=never
server.error.include-stacktrace=never
server.error.include-exception=false

# ========================
# JSONシリアライゼーション設定
# ========================
spring.jackson.serialization.indent-output=true
spring.jackson.default-property-inclusion=non_null

# ========================
# データベース初期化設定
# ========================
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema-test.sql
spring.sql.init.data-locations=classpath:data-test.sql

# ========================
# H2コンソール設定
# ========================
spring.h2.console.enabled=true
spring.h2.console.path=/h2-console
```

---

### 📝 追加で必要な作業

1. **スキーマ初期化ファイルの作成**

   ```bash
   # テーブル作成スクリプト
   src/test/resources/schema-test.sql

   # テストデータ投入スクリプト
   src/test/resources/data-test.sql
   ```

2. **テストクラスでのプロファイル指定**

   ```java
   @SpringBootTest
   @ActiveProfiles("test") // 追加
   public class UserServiceImplTest {
       // ...
   }
   ```

3. **H2 と PostgreSQL の互換性検証**
   テスト実行前に、使用している PostgreSQL 固有の機能が H2 でサポートされているか確認が必要です。特に以下に注意：
   - `JSONB` 型
   - ウィンドウ関数
   - 独自の PL/pgSQL 関数

---

### ✅ 最終確認ポイント

1. 設定ファイルは `src/test/resources/` に配置
2. テストクラスに `@ActiveProfiles("test")` を追加
3. H2 と PostgreSQL の互換性問題がないかテスト実行
4. 初期化スクリプト `schema-test.sql`, `data-test.sql` を作成

この構成で問題なくテストが実行できるはずです。H2 の動作確認後、実際にテストを実行してデータベース操作が正しく行われることを確認してください。
