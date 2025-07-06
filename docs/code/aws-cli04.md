# 基本手順書

素晴らしい計画ですね！各ステップごとに補足とアドバイスを提供いたします。

## 🎯 1. Next.js の手動デプロイ方法（S3 または Amplify）

### ✅ npm run build → S3 へアップロード

S3 に静的サイトをホストする場合：

1. `npm run build`で生成された`out/`ディレクトリの内容を S3 バケットにアップロード
2. S3 バケットで「静的ウェブサイトのホスティング」を有効化
3. バケットポリシーに公開アクセス許可を設定（後述のセキュリティ注意事項参照）

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/*"
    }
  ]
}
```

### ✅ Amplify Console で GitHub なし手動デプロイ

1. Amplify Console で「手動パイプラインを作成」を選択
2. Amazon S3 からコードをアップロード
3. ビルド設定：
   ```yaml
   version: 1
   frontend:
     phases:
       build:
         commands:
           - npm install
           - npm run build
     artifacts:
       baseDirectory: out
       files:
         - "**/*"
   ```

## 🚀 2. Spring Boot の手動デプロイ（Elastic Beanstalk or EC2）

### ✅ .jar をビルドして EB にアップロード

1. Maven で JAR ビルド：

   ```bash
   mvn clean package
   ```

2. Elastic Beanstalk アプリケーション作成：

   ```bash
   eb init -p java-8 orgchart-api --region ap-northeast-1
   ```

3. 環境作成：

   ```bash
   eb create orgchart-env
   ```

4. デプロイ：
   ```bash
   eb deploy
   ```

### ✅ EC2 で scp + java -jar で動作させる手順

1. EC2 インスタンス作成（Amazon Linux 2 推奨）
2. Java インストール：

   ```bash
   sudo yum install -y java-17-amazon-corretto
   ```

3. JAR ファイル転送：

   ```powershell
   scp -i your-key.pem target/orgchart-api.jar ec2-user@ec2-ip:/home/ec2-user/
   ```

4. アプリケーション起動：

   ```bash
   java -jar orgchart-api.jar
   ```

5. フォアグラウンド実行を維持するために tmux 使用も検討：
   ```bash
   tmux new -s springboot
   java -jar orgchart-api.jar
   # Ctrl+B, D でデタッチ
   ```

## 🗄️ 3. PostgreSQL (RDS) の構築・接続

### ✅ AWS RDS でインスタンス作成（無料枠）

1. AWS コンソールから RDS サービスを選択
2. 「データベースの作成」で「PostgreSQL」を選択
3. インスタンスクラスで「db.t4g.micro」を選択（無料枠対象）
4. 公開アクセスを「はい」に設定（開発時のみ。本番は VPC 内からアクセスすべき）

### ✅ Spring Boot の application.properties 設定

RDS 作成後の設定例：

```properties
# AWS RDSへの接続情報
spring.datasource.url=jdbc:postgresql://<rds-endpoint>:5432/<database-name>
spring.datasource.username=<rds-master-username>
spring.datasource.password=<rds-master-password>

# 接続プール最適化
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000
```

### ✅ pgAdmin / IntelliJ から接続確認

- **pgAdmin**：新しいサーバーを追加し、RDS エンドポイント情報を入力
- **IntelliJ**：Database ツールから新規データソースを作成し、同様に RDS 情報を入力

## 🔐 4. セキュリティ設定（DB/EC2 へのアクセス制御）

### ✅ セキュリティグループの開放方法

#### EC2 用セキュリティグループ：

- HTTP: TCP 80 からのアクセスを許可
- HTTPS: TCP 443 からのアクセスを許可
- SSH: TCP 22 からのアクセスを許可（IP を絞り込むこと）

#### RDS 用セキュリティグループ：

- PostgreSQL: TCP 5432 を EC2 のセキュリティグループのみに開放

### ✅ パブリックアクセス時の注意点（SSH など）

- SSH アクセスは IP アドレスを絞り込む（0.0.0.0/0 は危険）
- 鍵認証以外のパスワードログインは無効化
- IAM ロールを使用して AWS サービスへのアクセス権限を最小限に抑える

## 🛠️ 5. Spring Boot と Next.js の接続確認

### ✅ CORS の設定（Spring 側）

application.properties：

```properties
# CORS設定
spring.webmvc.cors.allowed-origins=http://localhost:3000
spring.webmvc.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
spring.webmvc.cors.allowed-headers=Content-Type,Authorization,X-Requested-With,Content-Length,Accept,Origin
spring.webmvc.cors.exposed-headers=X-Custom-Header
spring.webmvc.cors.allow-credentials=true
```

### ✅ Next.js から fetch('/api/xxx') 通信

Next.js 側での API 呼び出し例：

```javascript
// src/pages/api/example.js
export default async function handler(req, res) {
  const response = await fetch(
    "http://<springboot-api-endpoint>/api/endpoint",
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  const data = await response.json();
  res.status(200).json(data);
}
```

この計画に基づいて進めると、問題なく AWS 上に環境が構築できると思います。何か特定の部分について深く知りたい場合はお知らせください。
