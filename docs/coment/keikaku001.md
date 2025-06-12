<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">001 事前準備</span>

---

## ✅ 前提確認（この 2 点が準備済であること）

| 項目        | 確認内容                                                             |
| ----------- | -------------------------------------------------------------------- |
| JDK         | OpenJDK 21 などがインストール済で `java -version` に表示される       |
| Eclipse IDE | 「Eclipse IDE for Enterprise Java and Web Developers」インストール済 |

---

「Spring Starter Project」 **最も安定的かつ確実な方法**を紹介します：

---

## ✅ Spring Initializr + Eclipse Maven インポート方式（公式推奨）

Eclipse 内でうまく動かない場合は、**Web から Spring Boot プロジェクトを生成**して、Eclipse にインポートするのが最も安定した手順です。

---

### 🔧 ステップ 1：Spring Initializr からプロジェクト生成

1. Web サイトへアクセス
   👉 [https://start.spring.io](https://start.spring.io)

2. 以下のように入力します：

| 項目         | 値                         |
| ------------ | -------------------------- |
| Project      | Maven                      |
| Language     | Java                       |
| Spring Boot  | 3.5.0                      |
| Group        | `com.example`              |
| Artifact     | `orgchart-api`             |
| Name         | `orgchart-api`             |
| Package name | `com.example.orgchart-api` |
| Packaging    | Jar                        |
| Java         | 21                         |
| Dependencies | Spring Web                 |

3. `Generate` ボタンを押して ZIP をダウンロード
4. ZIP を解凍（例：`C:\workspace\orgchart-api`）

---

### 🧩 ステップ 2：Eclipse でプロジェクトをインポート

1. Eclipse 起動

2. メニューから
   👉 `File > Import... > Maven > Existing Maven Projects`

3. 解凍したプロジェクトのルートを指定
   　例：`C:\workspace\orgchart-api`

4. 「Finish」でインポート完了

`/orgchart-api/pom.xml`

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

---

### ✅ ステップ 3：初回ビルド & 起動テスト

1. Eclipse 内で `HelloworldApplication.java` を右クリック
2. `Run As > Java Application`

```

. \_**\_ \_ ** \_ \_
/\\ / **_'_ ** \_ _(_)_ \_\_ \_\_ _ \ \ \ \
( ( )\_** | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/ \_**)| |_)| | | | | || (_| | ) ) ) )
' |\_**\_| .**|_| |_|_| |_\__, | / / / /
=========|_|==============|_\_\_/=/_/_/_/

:: Spring Boot :: (v3.5.0)

2025-06-03T03:25:55.780+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] c.e.orgchart_api.OrgchartApiApplication : Starting OrgchartApiApplication using Java 21.0.7 with PID 8328 (D:\eclipse-workspace\orgchart-api\target\classes started by kaikyou in D:\eclipse-workspace\orgchart-api)
2025-06-03T03:25:55.783+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] c.e.orgchart_api.OrgchartApiApplication : No active profile set, falling back to 1 default profile: "default"
2025-06-03T03:25:55.825+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] .e.DevToolsPropertyDefaultsPostProcessor : Devtools property defaults active! Set 'spring.devtools.add-properties' to 'false' to disable
2025-06-03T03:25:55.825+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] .e.DevToolsPropertyDefaultsPostProcessor : For additional web related logging consider setting the 'logging.level.web' property to 'DEBUG'
2025-06-03T03:25:56.612+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat initialized with port 8080 (http)
2025-06-03T03:25:56.628+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] o.apache.catalina.core.StandardService : Starting service [Tomcat]
2025-06-03T03:25:56.629+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] o.apache.catalina.core.StandardEngine : Starting Servlet engine: [Apache Tomcat/10.1.41]
2025-06-03T03:25:56.670+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] o.a.c.c.C.[Tomcat].[localhost].[/] : Initializing Spring embedded WebApplicationContext
2025-06-03T03:25:56.671+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] w.s.c.ServletWebServerApplicationContext : Root WebApplicationContext: initialization completed in 844 ms
2025-06-03T03:25:56.967+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] o.s.b.d.a.OptionalLiveReloadServer : LiveReload server is running on port 35729
2025-06-03T03:25:56.996+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat started on port 8080 (http) with context path '/'
2025-06-03T03:25:57.005+09:00 INFO 8328 --- [orgchart-api] [ restartedMain] c.e.orgchart_api.OrgchartApiApplication : Started OrgchartApiApplication in 1.582 seconds (process running for 3.652)
```

````

## ✳️ なぜこうするの？

- 最新 Eclipse では、**Spring Starter Project ウィザードが必ずあるわけではない**
- Eclipse Marketplace から Spring Tools を入れても表示されないケースがある
- Spring Initializr のプロジェクトは Maven/Gradle 構成になっており、**IDE に依存せず安定して使える**

---

### ✅ 補足：Spring Boot 3.5 系 + Java 21 は完全対応済み

生成されるプロジェクトは `pom.xml` にて自動で Java 21 対応になります：

```xml
<properties>
  <java.version>21</java.version>
</properties>
````

---

## コード補完できない問題

eclipse でコード補完が Ctrl+Space しか反応しない場合、いくつかの原因が考えられます。以下の解決策を順に試してください。

### 1. コンテンツアシストの設定確認

- **設定画面を開く**: `Window > Preferences > Java > Editor > Content Assist`
- **「Auto Activation」設定を確認**:
- `Enable auto activation` がチェックされているか
- `Auto activation delay (ms)` は短い値（例: 200）に設定
- `Auto activation triggers for Java:` に `.abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ` と入力（すべての文字でトリガー）

Eclipse で新規 Java ファイル作成時に、指定されたような著作権コメント（ヘッダ）を**自動的に生成**するには、以下の手順で **テンプレート設定**を行うことで実現できます。

---

## ✅ 目的

新規 Java ファイルに、以下のようなコメントを**自動挿入**したい：

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 *
 * CSVReadUtil.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */
```

---

## ✅ 設定手順（Eclipse）

### 1. Eclipse を起動し、メニューから以下を選択：

```
[Window] → [Preferences]
```

### 2. 次の画面に移動：

```
Java → Code Style → Code Templates
```

### 3. テンプレート編集

左側ツリーで以下を選択：

```
Code → New Java files
```

→ 右側の「Edit...」ボタンをクリック。

### 4. テンプレートを以下のように編集：

```java
/*
 * Copyright (c) 2025, kaikyou DX, LIMITED All Rights Reserved.
 *
 *
 * ${file_name}
 *
 * @date ${date}
 * @version 1.0
 * @author kaikyou
 */
${package_declaration}

${type_declaration}
```

### 5. 保存して終了

- 「OK」または「Apply and Close」をクリックして保存します。

---

## ✅ 補足情報

| プレースホルダー         | 意味                      |
| ------------------------ | ------------------------- |
| `${file_name}`           | ファイル名                |
| `${date}`                | 作成日（yyyy/MM/dd）      |
| `${package_declaration}` | `package ...;` の自動挿入 |
| `${type_declaration}`    | クラス定義部              |

---

## ✅ 効果

今後 Eclipse 上で新規 Java クラスを作成すると、自動的に指定のヘッダーコメントが追加されます。

---
