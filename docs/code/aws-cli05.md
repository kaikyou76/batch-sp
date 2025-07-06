# 詳細手順書

ありがとうございます。では、**EC2 インスタンス上で Java 21 + Spring Boot 3.5.0 + PostgreSQL（RDS）** の環境を構築する手順をご案内いたします。

---

## 🛠️ EC2 インスタンス作成手順

### 1. AWS コンソールで EC2 インスタンスを作成

- **AMI**: Amazon Linux 2023 (最新版)
- **インスタンスタイプ**: t3.micro（無料枠対象）
- **ストレージ**: 8GB 以上（必要に応じて増やす）
- **セキュリティグループ設定**:
  - SSH: 自分の IP のみ許可（ポート 22）
  - HTTP: 0.0.0.0/0（開発時のみ。本番は制限要）
  - HTTPS: 0.0.0.0/0（開発時のみ。本番は制限要）

---

## 🔧 Java 21 インストール手順（EC2 ログイン後）

```bash
# OS更新
sudo yum update -y

# Java 21 インストール
sudo yum install java-21-amazon-corretto -y

# Javaバージョン確認
java --version
# 出力例: openjdk 21.0.x 2025-04-15 LTS
```

---

## 🐘 PostgreSQL（RDS）接続準備

### 1. RDS インスタンス作成（AWS コンソール）

- **データベースエンジン**: PostgreSQL
- **インスタンスクラス**: db.t4g.micro（無料枠対象）
- **公開アクセス**: はい（開発時のみ）
- **VPC セキュリティグループ**: EC2 インスタンスと同じセキュリティグループを指定

### 2. EC2 から PostgreSQL 接続確認

```bash
# PostgreSQLクライアントインストール
sudo yum install postgresql -y

# 接続テスト
psql "host=<rds-endpoint> port=5432 dbname=<db-name> user=<user> password=<password>"
```

---

## 📦 Spring Boot アプリケーションを EC2 にデプロイ

### 1. ローカルで JAR ビルド

```bash
mvn clean package
```

生成されたファイル：`target/orgchart-api-0.0.1-SNAPSHOT.jar`

### 2. JAR ファイルを EC2 に転送

```powershell
scp -i your-key.pem target/orgchart-api-0.0.1-SNAPSHOT.jar ec2-user@<ec2-ip>:/home/ec2-user/app.jar
```

### 3. EC2 で Spring Boot アプリ起動

```bash
# アプリケーション起動（バックグラウンド実行）
nohup java -jar app.jar > app.log 2>&1 &

# 起動状況確認
tail -f app.log
```

> 💡 [application.properties](file://d:\eclipse-workspace\orgchart-api\src\main\resources\application.properties) は事前に RDS 接続情報に変更しておく必要があります。

---

## ✅ application.properties（RDS 接続用に修正済み例）

```properties|CODE_EDIT_BLOCK|d:\eclipse-workspace\orgchart-api\src\main\resources\application.properties
// ... existing code ...
# AWS RDSへの接続情報
spring.datasource.url=jdbc:postgresql://<rds-endpoint>:5432/<database-name>
spring.datasource.username=<rds-master-username>
spring.datasource.password=<rds-master-password>

# 接続プール最適化
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
```

---

## 📊 動作確認方法

### 1. API エンドポイントにアクセス

ブラウザや curl で以下にアクセス：

```
http://<ec2-public-ip>:8080/api/users
```

### 2. Swagger UI 確認

```
http://<ec2-public-ip>:8080/swagger-ui/index.html
```

---

## 🔄 自動起動設定（オプション）

### 1. systemd サービスファイル作成

```bash
sudo vi /etc/systemd/system/orgchart.service
```

#### `/etc/systemd/system/orgchart.service` 内容：

```ini
[Unit]
Description=OrgChart API Application
After=syslog.target

[Service]
User=ec2-user
ExecStart=/usr/bin/java -jar /home/ec2-user/app.jar
SuccessExitStatus=143
StandardOutput=file:/home/ec2-user/app.log
StandardError=file:/home/ec2-user/app-error.log

[Install]
WantedBy=multi-user.target
```

### 2. サービス有効化と起動

```bash
sudo systemctl daemon-reload
sudo systemctl enable orgchart
sudo systemctl start orgchart
```

---

## 🎯 次のステップ

以下のサポートも可能ですので、必要であればお知らせください：

1. **Docker 化 + ECS/Fargate での運用**
2. **CI/CD パイプライン構築（GitHub Actions or CodePipeline）**
3. **HTTPS 化（Let's Encrypt + CloudFront + ACM）**
4. **監視・アラート設定（CloudWatch + SNS）**

この手順で進めることで、**Java 21 + Spring Boot 3.5.0 + PostgreSQL（RDS）** 環境が正しく AWS 上に構築できます。何か不明点や追加要望があれば、いつでもご相談ください！
