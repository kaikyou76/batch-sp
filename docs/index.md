# Hello World

⛅️♥️🌀💪💦🎧🙇🚣🔁🎯🍪▼👇❗✍️📁🚀🔥⚠️🌐🚨🙌🛡️🌟🏆🧩🛡️🔔⏱️🗃️⚛️📣🤝🏗️ 🧭🪜 ⭕️🔚💬🔜📌👑 ❓✨❌🥇🥈🥉🛠📊⚙️ 🧪🧠🔧✔✅🚫🔍🧭 🧱
💥

### 正しい設定ファイルのバックアップ

`pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
		 xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
		 xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
	<modelVersion>4.0.0</modelVersion>

	<parent>
		<groupId>org.springframework.boot</groupId>
		<artifactId>spring-boot-starter-parent</artifactId>
		<version>3.5.0</version>
		<relativePath/>
	</parent>

	<groupId>com.example</groupId>
	<artifactId>orgchart-api</artifactId>
	<version>0.0.1-SNAPSHOT</version>
	<name>orgchart-api</name>
	<description>Demo project for Spring Boot</description>

	<properties>
		<java.version>21</java.version>
		<mapstruct.version>1.5.5.Final</mapstruct.version>
		<testcontainers.version>1.19.7</testcontainers.version>
		<postgresql.version>42.7.3</postgresql.version>
		<lombok.version>1.18.30</lombok.version>
		<!-- 追加プロパティ -->
		<mockito.version>5.11.0</mockito.version>
		<byte-buddy.version>1.14.11</byte-buddy.version>
		<maven-surefire.version>2.22.2</maven-surefire.version>
	</properties>

	<dependencyManagement>
		<dependencies>
			<dependency>
				<groupId>org.testcontainers</groupId>
				<artifactId>testcontainers-bom</artifactId>
				<version>${testcontainers.version}</version>
				<type>pom</type>
				<scope>import</scope>
			</dependency>
		</dependencies>
	</dependencyManagement>

	<dependencies>
		<!-- Spring Boot Starters -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-web</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-jdbc</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-security</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-batch</artifactId>
		</dependency>

		<!-- Database -->
		<dependency>
			<groupId>org.mybatis.spring.boot</groupId>
			<artifactId>mybatis-spring-boot-starter</artifactId>
			<version>3.0.3</version>
		</dependency>
		<dependency>
			<groupId>org.postgresql</groupId>
			<artifactId>postgresql</artifactId>
			<version>${postgresql.version}</version>
			<scope>runtime</scope>
			<exclusions>
				<exclusion>
					<groupId>org.checkerframework</groupId>
					<artifactId>checker-qual</artifactId>
				</exclusion>
			</exclusions>
		</dependency>

		<!-- Utilities -->
		<dependency>
			<groupId>org.projectlombok</groupId>
			<artifactId>lombok</artifactId>
			<version>${lombok.version}</version>
			<scope>provided</scope>
		</dependency>
		<dependency>
			<groupId>org.mapstruct</groupId>
			<artifactId>mapstruct</artifactId>
			<version>${mapstruct.version}</version>
		</dependency>
		<dependency>
			<groupId>jakarta.validation</groupId>
			<artifactId>jakarta.validation-api</artifactId>
		</dependency>
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-devtools</artifactId>
			<scope>runtime</scope>
			<optional>true</optional>
		</dependency>

		<!-- Test -->
		<dependency>
			<groupId>org.springframework.boot</groupId>
			<artifactId>spring-boot-starter-test</artifactId>
			<scope>test</scope>
			<exclusions>
				<exclusion>
					<groupId>org.junit.vintage</groupId>
					<artifactId>junit-vintage-engine</artifactId>
				</exclusion>
			</exclusions>
		</dependency>
		<dependency>
			<groupId>org.springframework.security</groupId>
			<artifactId>spring-security-test</artifactId>
			<version>6.2.1</version>
			<scope>test</scope>
		</dependency>
		<!-- 明示的なMockito依存関係 -->
		<dependency>
			<groupId>org.mockito</groupId>
			<artifactId>mockito-core</artifactId>
			<version>${mockito.version}</version>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.mockito</groupId>
			<artifactId>mockito-junit-jupiter</artifactId>
			<version>${mockito.version}</version>
			<scope>test</scope>
		</dependency>
		<!-- Byte Buddy依存関係 -->
		<dependency>
			<groupId>net.bytebuddy</groupId>
			<artifactId>byte-buddy</artifactId>
			<version>${byte-buddy.version}</version>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>net.bytebuddy</groupId>
			<artifactId>byte-buddy-agent</artifactId>
			<version>${byte-buddy.version}</version>
			<scope>test</scope>
		</dependency>
		<!-- その他のテスト依存関係 -->
		<dependency>
			<groupId>org.junit.jupiter</groupId>
			<artifactId>junit-jupiter-api</artifactId>
			<scope>test</scope>
		</dependency>
		<dependency>
			<groupId>org.hamcrest</groupId>
			<artifactId>hamcrest</artifactId>
			<version>2.2</version>
			<scope>test</scope>
		</dependency>
	</dependencies>

	<build>
		<plugins>
			<plugin>
				<groupId>org.springframework.boot</groupId>
				<artifactId>spring-boot-maven-plugin</artifactId>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-compiler-plugin</artifactId>
				<configuration>
					<annotationProcessorPaths>
						<path>
							<groupId>org.mapstruct</groupId>
							<artifactId>mapstruct-processor</artifactId>
							<version>${mapstruct.version}</version>
						</path>
						<path>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok</artifactId>
							<version>${lombok.version}</version>
						</path>
						<path>
							<groupId>org.projectlombok</groupId>
							<artifactId>lombok-mapstruct-binding</artifactId>
							<version>0.2.0</version>
						</path>
					</annotationProcessorPaths>
				</configuration>
			</plugin>
			<plugin>
				<groupId>org.apache.maven.plugins</groupId>
				<artifactId>maven-surefire-plugin</artifactId>
				<version>${maven-surefire.version}</version>
				<configuration>
					<argLine>
						-Djdk.instrument.traceUsage
						-XX:+EnableDynamicAgentLoading
					</argLine>
					<includes>
						<include>**/*Test.java</include>
					</includes>
				</configuration>
			</plugin>
		</plugins>
	</build>
</project>
```

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

- 以下は mst_cucm_voice_mail_profile テーブルに id=1 のレコードを挿入する SQL 文です。pgAdmin で直接実行してください：

```sql
INSERT INTO mst_cucm_voice_mail_profile
  (voice_mail_profile_id, voice_mail_profile_nm, create_date, update_date, update_user)
VALUES
  (1, 'デフォルトプロファイル', NOW(), NOW(), 'BATCH')
ON CONFLICT (voice_mail_profile_id) DO NOTHING;

```

- mst_cucm_pickup_group テーブルに id=1 のレコードを挿入する。

以下の SQL 文を pgAdmin で実行し、`pickup_group_id=1`のテストデータを挿入してください：

```sql
-- 関連テーブルmst_branchにテストデータがあることを確認
INSERT INTO mst_branch (branch_cd, branch_nm, create_date, update_date, update_user)
VALUES ('001', 'テスト支店', NOW(), NOW(), 'BATCH')
ON CONFLICT (branch_cd) DO NOTHING;

-- mst_cucm_pickup_groupへのテストデータ挿入
INSERT INTO mst_cucm_pickup_group (
    pickup_group_id,
    pickup_group_nm,
    pickup_group_no,
    branch_cd,
    section_cd,
    create_date,
    update_date,
    update_user
) VALUES (
    1,                      -- pickup_group_id (固定値1)
    'テストピックアップグループ', -- pickup_group_nm
    9999,                   -- pickup_group_no (適当な番号)
    '001',                  -- branch_cd (上記で挿入した支店コード)
    'S0001',                -- section_cd (適当な5桁部署コード)
    NOW(),                  -- create_date (現在時刻)
    NOW(),                  -- update_date (現在時刻)
    'BATCH'                 -- update_user
)
ON CONFLICT (pickup_group_id) DO UPDATE SET
    pickup_group_nm = EXCLUDED.pickup_group_nm,
    pickup_group_no = EXCLUDED.pickup_group_no,
    branch_cd = EXCLUDED.branch_cd,
    section_cd = EXCLUDED.section_cd,
    update_date = NOW();
```
