<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">改修企画案 001</span>

バックエンドとフロントエンドを完全に分離した構成で、AWS 対応のバックエンドディレクトリ構成を 100%詳細に出力します。

```plaintext
orgchart-backend/  # Spring Boot バックエンド (AWSデプロイ用)
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/example/orgchart/
│   │   │       ├── api/
│   │   │       │   ├── controller/
│   │   │       │   │   ├── BatchApiController.java
│   │   │       │   │   ├── DepartmentApiController.java
│   │   │       │   │   ├── PhoneApiController.java
│   │   │       │   │   └── UserApiController.java
│   │   │       │   ├── dto/
│   │   │       │   │   ├── BatchJobResponse.java
│   │   │       │   │   ├── DepartmentDto.java
│   │   │       │   │   ├── PhoneDto.java
│   │   │       │   │   └── UserDto.java
│   │   │       │   └── exception/
│   │   │       │       ├── ApiError.java
│   │   │       │       └── GlobalExceptionHandler.java
│   │   │       ├── batch/
│   │   │       │   ├── config/
│   │   │       │   │   ├── BatchConfig.java
│   │   │       │   │   └── CsvImportConfig.java
│   │   │       │   ├── job/
│   │   │       │   │   ├── DepartmentImportJob.java
│   │   │       │   │   ├── PhoneImportJob.java
│   │   │       │   │   └── UserImportJob.java
│   │   │       │   ├── listener/
│   │   │       │   │   ├── ImportJobListener.java
│   │   │       │   │   └── LoggingStepListener.java
│   │   │       │   ├── processor/
│   │   │       │   │   ├── DepartmentProcessor.java
│   │   │       │   │   ├── PhoneProcessor.java
│   │   │       │   │   └── UserProcessor.java
│   │   │       │   ├── reader/
│   │   │       │   │   ├── CsvItemReader.java
│   │   │       │   │   ├── DepartmentReader.java
│   │   │       │   │   ├── PhoneReader.java
│   │   │       │   │   └── UserReader.java
│   │   │       │   └── writer/
│   │   │       │       ├── DepartmentWriter.java
│   │   │       │       ├── PhoneWriter.java
│   │   │       │       └── UserWriter.java
│   │   │       ├── domain/
│   │   │       │   ├── Department.java
│   │   │       │   ├── Phone.java
│   │   │       │   └── User.java
│   │   │       ├── mapper/
│   │   │       │   ├── DepartmentMapper.java
│   │   │       │   ├── PhoneMapper.java
│   │   │       │   ├── UserMapper.java
│   │   │       │   ├── batch/
│   │   │       │   │   ├── DepartmentBatchMapper.java
│   │   │       │   │   ├── PhoneBatchMapper.java
│   │   │       │   │   └── UserBatchMapper.java
│   │   │       ├── repository/
│   │   │       │   ├── DepartmentRepository.java
│   │   │       │   ├── PhoneRepository.java
│   │   │       │   └── UserRepository.java
│   │   │       ├── service/
│   │   │       │   ├── DepartmentService.java
│   │   │       │   ├── PhoneService.java
│   │   │       │   ├── UserService.java
│   │   │       │   ├── batch/
│   │   │       │   │   ├── DepartmentBatchService.java
│   │   │       │   │   ├── PhoneBatchService.java
│   │   │       │   │   └── UserBatchService.java
│   │   │       │   └── impl/
│   │   │       │       ├── DepartmentBatchServiceImpl.java
│   │   │       │       ├── PhoneBatchServiceImpl.java
│   │   │       │       ├── UserBatchServiceImpl.java
│   │   │       │       ├── DepartmentServiceImpl.java
│   │   │       │       ├── PhoneServiceImpl.java
│   │   │       │       └── UserServiceImpl.java
│   │   ├── resources/
│   │   │   ├── application-aws.yml    # AWS用設定
│   │   │   ├── application-local.yml  # ローカル開発用
│   │   │   ├── application.yml        # 共通設定
│   │   │   ├── batch/
│   │   │   │   ├── csv/
│   │   │   │   │   ├── departments.csv
│   │   │   │   │   ├── phones.csv
│   │   │   │   │   └── users.csv
│   │   │   │   └── sql/
│   │   │   │       ├── department-insert.sql
│   │   │   │       ├── phone-insert.sql
│   │   │   │       └── user-insert.sql
│   │   │   ├── mybatis/
│   │   │   │   ├── mybatis-config.xml
│   │   │   │   └── mappers/
│   │   │   │       ├── DepartmentMapper.xml
│   │   │   │       ├── PhoneMapper.xml
│   │   │   │       ├── UserMapper.xml
│   │   │   │       ├── batch/
│   │   │   │       │   ├── DepartmentBatchMapper.xml
│   │   │   │       │   ├── PhoneBatchMapper.xml
│   │   │   │       │   └── UserBatchMapper.xml
│   │   ├── webapp/
│   │   │   └── WEB-INF/
│   │   │       └── views/
│   │   │           └── (必要に応じてJSPファイルなど)
│   ├── test/
│   │   ├── java/
│   │   │   └── com/example/orgchart/
│   │   │       ├── api/
│   │   │       │   ├── controller/
│   │   │       │   │   ├── BatchApiControllerTest.java
│   │   │       │   │   ├── DepartmentApiControllerTest.java
│   │   │       │   │   ├── PhoneApiControllerTest.java
│   │   │       │   │   └── UserApiControllerTest.java
│   │   │       │   └── service/
│   │   │       │       └── (サービス層のテスト)
│   │   │       ├── batch/
│   │   │       │   ├── job/
│   │   │       │   │   ├── DepartmentImportJobTest.java
│   │   │       │   │   ├── PhoneImportJobTest.java
│   │   │       │   │   └── UserImportJobTest.java
│   │   │       │   └── writer/
│   │   │       │       ├── DepartmentWriterTest.java
│   │   │       │       ├── PhoneWriterTest.java
│   │   │       │       └── UserWriterTest.java
│   │   │       └── mapper/
│   │   │           ├── DepartmentMapperTest.java
│   │   │           ├── PhoneMapperTest.java
│   │   │           └── UserMapperTest.java
│   │   └── resources/
│   │       ├── test-application.yml
│   │       ├── test-data/
│   │       │   ├── departments-test.csv
│   │       │   ├── phones-test.csv
│   │       │   └── users-test.csv
│   │       └── mybatis/
│   │           └── test-mappers/
│   │               ├── DepartmentMapperTest.xml
│   │               ├── PhoneMapperTest.xml
│   │               └── UserMapperTest.xml
├── Dockerfile              # AWS ECS/Fargate用
├── build.gradle            # Gradleビルド設定
├── deploy/                 # AWSデプロイ関連スクリプト
│   ├── ecs-deploy.sh
│   ├── cloudformation/
│   │   ├── network.yml
│   │   ├── database.yml
│   │   └── ecs-cluster.yml
│   └── task-definition.json
├── scripts/                # バッチ処理用スクリプト
│   ├── s3-file-upload.sh
│   └── batch-trigger.sh
├── .github/workflows/      # GitHub Actions設定
│   └── aws-deploy.yml
├── aws-config/             # AWS設定ファイル
│   ├── alb-security-group.json
│   └── rds-params.json
├── .gitignore
├── settings.gradle
├── gradlew
├── gradlew.bat
└── README.md
```

### AWS 対応の主なポイント:

1. **環境別設定ファイル**

   - `application-aws.yml`: AWS 環境用設定

     ```yaml
     spring:
       datasource:
         url: jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
         username: ${DB_USER}
         password: ${DB_PASSWORD}
       jpa:
         hibernate:
           ddl-auto: validate

     aws:
       s3:
         bucket: orgchart-data-bucket
         region: ap-northeast-1
     ```

2. **AWS リソース連携**

   - RDS (PostgreSQL) 接続設定
   - S3 バケット連携 (バッチ処理の CSV ファイル保存用)
   - Parameter Store/Secrets Manager 連携設定

3. **デプロイメントファイル**

   - `Dockerfile` (ECS/Fargate 用):
     ```dockerfile
     FROM amazoncorretto:17
     VOLUME /tmp
     ARG JAR_FILE=build/libs/*.jar
     COPY ${JAR_FILE} app.jar
     ENTRYPOINT ["java","-jar","/app.jar"]
     ```
   - ECS タスク定義 (`deploy/task-definition.json`)
   - CloudFormation テンプレート (`deploy/cloudformation/*.yml`)

4. **CI/CD パイプライン**

   - GitHub Actions ワークフロー (`/.github/workflows/aws-deploy.yml`)
   - AWS CodeBuild/CodePipeline 対応用設定

5. **AWS サービス統合**

   - バッチ処理トリガー: AWS SQS/Lambda 連携
   - 監視: CloudWatch 連携
   - 認証: Amazon Cognito 連携 (オプション)

6. **インフラストラクチャコード**
   - Terraform または CloudFormation テンプレート
   - VPC/サブネット/セキュリティグループ設定
   - RDS/ElastiCache 構成

### バックエンド API エンドポイント例 (フロントエンドから呼び出す):

1. **組織図関連**

   - `GET /api/departments` - 全部署取得
   - `GET /api/departments/{id}/users` - 部署所属ユーザー取得

2. **ユーザー関連**

   - `GET /api/users` - ユーザー一覧
   - `GET /api/users/{id}` - ユーザー詳細

3. **電話番号関連**

   - `GET /api/users/{userId}/phones` - ユーザーの電話番号一覧

4. **バッチ処理関連**
   - `POST /api/batch/users` - ユーザーインポートジョブ開始
   - `GET /api/batch/jobs/{jobId}` - ジョブステータス確認

### セキュリティ対策:

- CORS 設定 (フロントエンドドメインのみ許可)
- API ゲートウェイによるレートリミット
- AWS WAF 統合
- Spring Security による JWT 認証

この構成は以下の AWS サービスでの動作を想定:

- コンテナ実行: ECS/Fargate
- データベース: RDS (PostgreSQL)
- ファイルストレージ: S3
- 監視: CloudWatch
- CI/CD: CodePipeline/CodeBuild
- ネットワーク: ALB + VPC

フロントエンドは完全に分離され、別プロジェクト/別ホスティングとなります。フロントエンドからは AWS ALB や API Gateway を経由してバックエンド API を呼び出すことを想定しています。
