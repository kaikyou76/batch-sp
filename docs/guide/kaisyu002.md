<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">改修企画案 002</span>

以下に AWS 環境と連携する Spring Boot バックエンドと、React+Next.js フロントエンドの完全なディレクトリ構成を示します。フロントエンドは Next.js の App Router を使用し、バックエンドとは完全に分離しています。

### バックエンド構成 (Spring Boot - AWS デプロイ用)

```plaintext
orgchart-backend/
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
│   ├── test/
│   │   └── ... # テストコード
├── Dockerfile              # AWS ECS/Fargate用
├── build.gradle
├── deploy/                 # AWSデプロイ関連
│   ├── ecs-deploy.sh
│   ├── cloudformation/
│   │   ├── network.yml
│   │   ├── database.yml
│   │   └── ecs-cluster.yml
│   └── task-definition.json
└── ... # その他の設定ファイル
```

### フロントエンド構成 (Next.js App Router)

```plaintext
orgchart-frontend/
├── app/
│   ├── (dashboard)/               # ダッシュボード関連
│   │   ├── orgchart/
│   │   │   └── page.tsx           # 組織図メインページ
│   │   ├── departments/
│   │   │   └── page.tsx           # 部署管理ページ
│   │   ├── users/
│   │   │   └── page.tsx           # ユーザー管理ページ
│   │   └── layout.tsx             # ダッシュボード用レイアウト
│   ├── batch/
│   │   └── page.tsx               # バッチ処理管理
│   ├── api/
│   │   └── proxy/
│   │       └── route.ts           # バックエンドAPIプロキシ
│   ├── auth/
│   │   ├── login/
│   │   │   └── page.tsx           # ログインページ
│   │   └── layout.tsx             # 認証用レイアウト
│   ├── layout.tsx                 # 全体レイアウト
│   └── page.tsx                   # ホームページ
├── components/
│   ├── orgchart/
│   │   ├── OrgChart.tsx           # 組織図コンポーネント
│   │   ├── DepartmentTree.tsx     # 部署ツリー
│   │   ├── UserCard.tsx           # ユーザーカード
│   │   └── PhoneList.tsx          # 電話番号リスト
│   ├── batch/
│   │   └── BatchStatus.tsx        # バッチステータス表示
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Table.tsx
│   │   └── Card.tsx
│   └── providers/
│       └── OrgChartProvider.tsx   # 状態管理プロバイダー
├── hooks/
│   └── useOrgChart.ts             # 組織図データ取得フック
├── lib/
│   ├── api.ts                     # APIクライアント
│   └── aws-config.ts              # AWS設定
├── public/
│   ├── images/
│   │   └── logo.svg
│   └── favicon.ico
├── styles/
│   ├── globals.css
│   └── components/
│       └── orgchart.css
├── types/
│   └── orgchart.d.ts              # 型定義
├── .env.local                     # 環境変数
├── next.config.js
├── package.json
└── tsconfig.json
```

### 主なファイルの説明

#### バックエンド (Spring Boot)

1. **AWS 設定ファイル (application-aws.yml)**

```yaml
spring:
  datasource:
    url: jdbc:postgresql://${DB_ENDPOINT}:5432/orgchartdb
    username: ${DB_USERNAME}
    password: ${DB_PASSWORD}
  jpa:
    hibernate:
      ddl-auto: validate

aws:
  s3:
    bucket: orgchart-data-${AWS_REGION}
    region: ${AWS_REGION}
    access-key: ${AWS_ACCESS_KEY}
    secret-key: ${AWS_SECRET_KEY}
```

2. **Dockerfile (AWS ECS 用)**

```dockerfile
FROM amazoncorretto:17
VOLUME /tmp
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-Dspring.profiles.active=aws","-jar","/app.jar"]
```

#### フロントエンド (Next.js)

1. **API プロキシ (app/api/proxy/route.ts)**

```typescript
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const backendUrl = process.env.BACKEND_API_URL;
  const path = request.nextUrl.pathname.replace("/api/proxy", "");

  const res = await fetch(`${backendUrl}${path}`, {
    headers: request.headers,
  });

  const data = await res.json();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  // 同様の実装
}
```

2. **組織図データ取得フック (hooks/useOrgChart.ts)**

```typescript
import { useEffect, useState } from "react";
import { Department, User } from "@/types/orgchart";

const useOrgChart = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptRes, userRes] = await Promise.all([
          fetch("/api/proxy/departments"),
          fetch("/api/proxy/users"),
        ]);

        const deptData = await deptRes.json();
        const userData = await userRes.json();

        setDepartments(deptData);
        setUsers(userData);
      } catch (error) {
        console.error("Error fetching org chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { departments, users, loading };
};

export default useOrgChart;
```

3. **環境変数設定 (.env.local)**

```env
# バックエンドAPIのベースURL (AWS ALBのエンドポイント)
BACKEND_API_URL=https://your-alb-endpoint.ap-northeast-1.elb.amazonaws.com

# AWS Cognito設定 (認証用)
NEXT_PUBLIC_AWS_COGNITO_REGION=ap-northeast-1
NEXT_PUBLIC_AWS_COGNITO_USER_POOL_ID=your-user-pool-id
NEXT_PUBLIC_AWS_COGNITO_CLIENT_ID=your-client-id
```

4. **Next.js 設定 (next.config.js)**

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // AWS CloudFront/S3用アセットパス
  assetPrefix: process.env.ASSET_PREFIX || "",
  // バックエンドAPIへのプロキシ設定
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${process.env.BACKEND_API_URL}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
```

### AWS 連携ポイント

1. **バックエンドデプロイ**

   - ECR: Docker コンテナレジストリ
   - ECS/Fargate: コンテナ実行環境
   - RDS: PostgreSQL データベース
   - ALB: アプリケーションロードバランサー

2. **フロントエンドデプロイ**

   - S3: 静的ホスティング
   - CloudFront: CDN 配信
   - Route53: DNS 管理
   - ACM: SSL 証明書管理

3. **認証連携**

   - Cognito: ユーザー認証管理
   - IAM: アクセス制御

4. **バッチ処理**
   - S3: CSV ファイルストレージ
   - SQS: ジョブキュー管理
   - Lambda: バッチ処理トリガー

この構成により、バックエンドとフロントエンドが完全に分離され、AWS 環境で効率的に動作します。フロントエンドは Next.js の App Router を活用した最新の構成で、組織図表示やバッチ管理などの機能を実装できます。
