<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">application.properties</span>

`src/main/resources/application.properties`

```

# アプリケーション基本設定
spring.application.name=orgchart-api

# データソース設定
spring.datasource.url=jdbc:postgresql://localhost:5432/irdb
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

# エラーレスポンスをJSON形式で統一
server.error.include-message=always
server.error.include-binding-errors=never
server.error.include-stacktrace=never
server.error.include-exception=false

# Jackson設定（オプション）
spring.jackson.serialization.indent-output=true
spring.jackson.default-property-inclusion=non_null

```
