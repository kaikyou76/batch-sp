# SSL/TLS 導入 について Spring Profiles を活用して環境別設定を一元管理

開発環境と本番環境で **SSL/TLS の有無や設定の差異** があると、コードや設定ファイル（例：[application.properties](file://d:\eclipse-workspace\orgchart-api\target\classes\application.properties)）に多くの差分が生じてしまい、**管理が煩雑になる**のはよくある課題です。

---

## ✅ 解決策：Spring Profiles を活用して環境別設定を一元管理

Spring Boot では `application-{profile}.properties` / `application-{profile}.yml` を使用して、**環境ごとに設定を切り替える**ことができます。

### 📁 ファイル構成の提案

```
src/
└── main/
    └── resources/
        ├── application.properties           # 共通設定
        ├── application-dev.properties       # 開発環境（HTTP）
        ├── application-prod.properties      # 本番環境（HTTPS + SSL）
        └── keystore/                        # 開発用キーストア（オプション）
            └── dev-tomcat.p12
```

---

## 🔧 手順 1: 共通設定 (`application.properties`)

```properties
# 共通設定
spring.application.name=orgchart-api
spring.datasource.url=jdbc:postgresql://localhost:5432/irdb
spring.datasource.username=postgres
spring.datasource.password=AM2013japan
spring.jpa.hibernate.ddl-auto=update

# ロギング
logging.level.org.springframework.web=DEBUG
logging.level.com.example.orgchart_api=DEBUG
```

---

## 🔧 手順 2: 開発環境 (`application-dev.properties`)

```properties
# 開発環境設定（HTTP）
server.port=8080
spring.batch.job.enabled=false
```

---

## 🔧 手順 3: 本番環境 (`application-prod.properties`)

```properties
# 本番環境設定（HTTPS + SSL）
server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore/prod-keystore.p12
server.ssl.key-store-password=${KEYSTORE_PASSWORD}
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=tomcat

# HSTS（セキュリティ強化）
spring.security.headers.hsts=max-age=31536000;include-sub-domains=true;preload
```

---

## 💡 手順 4: Spring Profile の選択方法

### 方法 ① 環境変数で指定（推奨）

```bash
export SPRING_PROFILES_ACTIVE=prod
java -jar orgchart-api.jar
```

### 方法 ② 起動引数で指定

```bash
java -jar orgchart-api.jar --spring.profiles.active=prod
```

### 方法 ③ IDE 上での設定（Eclipse/IntelliJ）

Run Configuration → VM options:

```bash
-Dspring.profiles.active=prod
```

---

## 🛠️ 手順 5: コード側の環境依存部分を統一する

例えば、`SecurityConfig.java` などで profile 判定を行い、設定を分岐できます。

```java
@Profile("prod")
@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Collections.singletonList("https://main.d13nr21kkliym6.amplifyapp.com"));
    configuration.setAllowCredentials(true);
    // ...
    return source;
}

@Profile("dev")
@Bean
public CorsConfigurationSource corsConfigurationSourceDev() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Collections.singletonList("http://localhost:3000"));
    configuration.setAllowCredentials(false);
    // ...
    return source;
}
```

---

## 🧪 手順 6: 自己署名証明書で開発用 HTTPS サーバーを立てる（オプション）

開発でも HTTPS 通信したい場合、自己署名証明書を使うことで検証可能です。

### 🔐 自己署名証明書生成コマンド（開発用）

```bash
keytool -genkeypair -alias dev-tomcat -keyalg RSA -keysize 2048 \
        -storetype PKCS12 -keystore dev-tomcat.p12 -validity 3650
```

### 📄 開発用プロファイル (`application-dev-https.properties`)

```properties
server.port=8443
server.ssl.enabled=true
server.ssl.key-store=classpath:keystore/dev-tomcat.p12
server.ssl.key-store-password=your_password
server.ssl.key-store-type=PKCS12
server.ssl.key-alias=dev-tomcat
```

---

## 📦 手順 7: プロファイル別の CI/CD 構成

| 環境             | 使用プロファイル | 証明書                  | CI/CD                  |
| ---------------- | ---------------- | ----------------------- | ---------------------- |
| 開発（ローカル） | `dev`            | 不要 or 自己署名        | IntelliJ/Eclipse など  |
| ステージング     | `staging`        | Let's Encrypt (staging) | GitHub Actions + Nginx |
| 本番             | `prod`           | Let's Encrypt or ACM    | AWS CodeDeploy + ALB   |

---

## ✅ 手順 8: Git への保存・除外設定

`.gitignore` に以下を追加：

```
# 証明書関連（パスワード含むため）
keystore/*.p12
keystore/*.jks
```

開発用の証明書は `.gitignore` で除外し、**CI/CD で動的に注入**するのが安全です。

---

## 📌 結論：Spring Profiles で環境設定をスマートに管理

| 効果                          | 内容                                       |
| ----------------------------- | ------------------------------------------ |
| ✅ 環境依存の設定を一元管理   | `application-dev`, `application-prod` など |
| ✅ コード差分を最小限に抑える | Java コード内で条件分岐を減らす            |
| ✅ 安全な運用                 | 証明書やパスワードをソースに残さない       |
| ✅ CI/CD との親和性向上       | プロファイル名でデプロイ先を制御           |

---

## 📚 参考リンク

- [Spring Boot Externalized Configuration](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.external-config)
- [Spring Profiles](https://docs.spring.io/spring-boot/docs/current/reference/html/features.html#features.profiles)
- [Spring Security and HTTPS](https://docs.spring.io/spring-security/site/docs/latest/api/org/springframework/security/config/web/server/WebHttpSecurity.HeadersSpec.HttpStrictTransportSecuritySpec.html)

---

## 📝 最終アドバイス

- [application.properties](file://d:\eclipse-workspace\orgchart-api\target\classes\application.properties) に環境差を埋め込まず、**Spring Profiles を活用**
- 証明書は環境ごとに外部注入（CI/CD または手動配置）
- コード内の `@Profile(...)` による柔軟な振る舞い切り替えも可能

---

このようにすれば、**開発環境と本番環境の設定差を最小限に抑えつつ、安全性と保守性を高めることが可能**になります。

必要であれば、自動化スクリプトや CI/CD パイプライン設定もご提供いたします。お気軽にご相談ください。
