<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">テスト環境用の設定ファイル</span>

`src/test/resources/application-test.properties`

```properties
# PostgreSQL接続設定
spring.datasource.url=jdbc:postgresql://localhost:5432/testirdb
spring.datasource.username=postgres
spring.datasource.password=AM2013japan
spring.datasource.driver-class-name=org.postgresql.Driver

# テスト用設定
spring.test.database.replace=none

# UserControllerIntegrationTestテスト用セキュリティ設定
spring.security.user.name=admin
spring.security.user.password=password
spring.security.user.roles=ADMIN

logging.level.org.springframework=DEBUG
logging.level.com.example=DEBUG
```
