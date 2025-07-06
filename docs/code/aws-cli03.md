# 一機能ごとに手動で AWS にデプロイ

**一機能ごとに手動で AWS にデプロイ**しながら開発を進めることは可能です！
GitHub Actions のような CI/CD 自動化を使わず、**手動で Next.js + Spring Boot + PostgreSQL を個別にデプロイ**する方法を以下にステップごとに解説します。

---

## ✅ 1. 全体の構成と前提

| コンポーネント     | デプロイ先                     | 方法                         | 頻度                |
| ------------------ | ------------------------------ | ---------------------------- | ------------------- |
| Next.js (フロント) | AWS Amplify or S3 + CloudFront | 手動ビルド → アップロード    | 機能単位で更新可 ✅ |
| Spring Boot (API)  | AWS Elastic Beanstalk or EC2   | 手動で `.jar` をアップロード | 任意 ✅             |
| PostgreSQL         | AWS RDS                        | 一度セットアップして常時稼働 | 基本固定            |

---

## 🛠️ 2. 各レイヤーの手動デプロイ方法

---

### 【①】Next.js（フロントエンド）の手動デプロイ

#### 🔸 方法 A: AWS Amplify Hosting（GUI ベース）

1. AWS Amplify にアクセス
2. 「アプリの作成」→「GitHub 連携」→ 一旦 `main` 連携する（初回のみ）
3. 以後、手元で `npm run build` → GUI から「手動再デプロイ」ボタンを押すだけ

#### 🔸 方法 B: S3 + CloudFront へ静的ホスティング

```bash
# Next.jsを静的出力（必要なら export モード）
npm run build
npx next export  # out/ フォルダ生成

# S3 に手動アップロード（AWS CLIでもGUIでも可）
aws s3 sync out/ s3://your-bucket-name
```

※CloudFront を使うなら、キャッシュの無効化も忘れずに。

---

### 【②】Spring Boot（バックエンド）の手動デプロイ

#### 🔸 方法 A: Elastic Beanstalk に `.jar` をアップロード

```bash
# JARをビルド
./gradlew bootJar

# AWS CLI で EB に手動デプロイ（初回のみ EB 環境作成が必要）
eb init -p java your-app-name
eb deploy
```

または、Elastic Beanstalk コンソール画面から `.jar` をアップロードして「Deploy」するだけでも OK。

#### 🔸 方法 B: EC2 に手動で転送・実行

```bash
# EC2 に JAR 転送
scp build/libs/your-app.jar ec2-user@your-ec2-ip:/home/ec2-user/

# EC2にSSHして実行
ssh ec2-user@your-ec2-ip
java -jar your-app.jar
```

---

### 【③】PostgreSQL（データベース）は 1 回だけセットアップすれば OK

#### 手順：

1. AWS RDS で「PostgreSQL インスタンス」作成（無料枠あり）
2. セキュリティグループで EC2 や Amplify からのアクセスを許可
3. Spring Boot の `application.properties` に DB 接続設定記述

```properties
spring.datasource.url=jdbc:postgresql://your-db-endpoint:5432/yourdb
spring.datasource.username=admin
spring.datasource.password=yourpass
```

---

## 🔁 手動開発・運用フロー（例）

| 手順 | 内容                          | 操作例                                   |
| ---- | ----------------------------- | ---------------------------------------- |
| 1    | フロントの機能追加完了        | `npm run build` → Amplify で再デプロイ   |
| 2    | API の変更完了（Spring Boot） | `./gradlew bootJar` → `eb deploy`        |
| 3    | DB 変更がある場合             | ローカル or `psql` で RDS にマイグレート |
| 4    | ブラウザで動作確認            | `/user`, `/batch` など確認               |

---

## 💡 補足：頻繁な変更に便利なコマンド類

- AWS CLI（`aws s3`, `aws rds`, `aws deploy`）
- `eb cli`（Elastic Beanstalk 用）
- `scp` / `ssh`（EC2 に手動アップロード）

---

## ✅ 結論：**少しずつ手動で進めるのは問題なく可能！**

- GUI だけでも作業できるので初心者にも優しい
- トラブル時にも「何が起きたか分かりやすい」
- 自動化は後で必要になったときで十分！

---

## ご希望があれば：

- `Spring Boot` → `Elastic Beanstalk` デプロイ手順の詳細
- `Next.js` → `S3` or `Amplify` 手動アップロード手順
- RDS に接続するためのセキュリティ設定

など、具体的なハンズオンもお手伝いします！お気軽に「次はこれをやりたい」と教えてください。
