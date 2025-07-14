import { defineConfig } from "vitepress";

// https://vitepress.vuejs.org/config/app-configs
export default defineConfig({
  markdown: {
    theme: {
      light: "github-light", // 白背景のテーマ

      dark: "material-theme", // ダークテーマ（黒ではない）
    },
  },

  // 追加のCSSカスタマイズ

  head: [
    [
      "style",

      {},

      `

        :root {

          --vp-code-block-bg: #f6f8fa !important; /* ライトモード背景色 */

        }

        

        .dark {

          --vp-code-block-bg: #2d333b !important; /* ダークモード背景色（濃いグレー） */

        }

      `,
    ],
  ],

  vite: {
    css: {
      postcss: {
        plugins: [],
      },
    },
  },

  themeConfig: {
    nav: [
      { text: "🏠 ホーム", link: "/" },
      { text: "📚 ガイド", link: "/guide/" },
      { text: "🛠️ チュートリアル", link: "/tutorial/" },
      { text: "📒 記事一覧", link: "/posts/" },
      { text: "👤 私について", link: "/about/me" },
      { text: "📒 設定について", link: "/code/" },
      { text: "📒 説明", link: "/coment/" },
      { text: "📒 フロント", link: "/frontend/" },
    ],

    sidebar: {
      "/about/": [
        {
          text: "私について",
          collapsed: true,
          items: [
            {
              text: "11. 📝 管理ログ（Admin Logs）API開発",
              link: "/about/api11",
            },
          ],
        },
        {
          text: "GitHub運用計画",
          collapsed: true,
          items: [
            { text: "運用フロー", link: "/about/GitHubFlow" },
            { text: "提案-1", link: "/about/GitHubFlow01" },
            { text: "提案-2", link: "/about/GitHubFlow02" },
            { text: "Jira提案-1", link: "/about/GitHubJiraFlow01" },
            { text: "Jira提案-2", link: "/about/GitHubJiraFlow02" },
            { text: "Jira提案-3", link: "/about/GitHubJiraFlow03" },
            { text: "Jira提案-4", link: "/about/GitHubJiraFlow04" },
          ],
        },
        {
          text: "GitHub運用実践",
          collapsed: true,
          items: [
            { text: "GitHub運用実践手順書", link: "/about/GitHubFlowtejyun" },
            { text: "①Jira アカウント登録", link: "/about/JiraCloud" },
            { text: "③CI・PR 作業準備", link: "/about/CI_PR" },
            { text: "④空のリポジトリを作成", link: "/about/CreateRepository" },
            {
              text: "⑤初プッシュ（main ではない！）",
              link: "/about/init-project",
            },
            {
              text: "⑥各ブランチの作成）",
              link: "/about/create-feature",
            },
            {
              text: "⑦ブランチ保護設定）",
              link: "/about/branch-hogo",
            },
            {
              text: "現在作業ブランチ状況",
              link: "/about/Working_Branch",
            },
          ],
        },
        {
          text: "新規プロジェクトの計画",
          collapsed: true,
          items: [{ text: "新規プロジェクト", link: "/about/sinki01" }],
        },
      ],
      "/code/": [
        {
          text: "awsデプロイ計画",
          collapsed: true,
          items: [
            { text: "awsデプロイ方法", link: "/code/aws-cli" },
            { text: "awsプラン", link: "/code/aws-cli02" },
            { text: "手動でデプロイ", link: "/code/aws-cli03" },
            { text: "基本手順書", link: "/code/aws-cli04" },
            { text: "詳細手順書", link: "/code/aws-cli05" },
          ],
        },
        {
          text: "awsデプロイ実践",
          collapsed: true,
          items: [
            {
              text: "awsアカウントとインスタンスの作成",
              link: "/code/aws-account",
            },
            { text: "インスタンス起動後の作業", link: "/code/aws-account02" },
            { text: "データベースの構築", link: "/code/aws-account02_2" },
            { text: "起動エラー解決", link: "/code/aws-account03" },
            { text: "コマンド説明", link: "/code/aws-account04" },
            {
              text: "📌本番環境向けの HTTPS 設定",
              link: "/code/aws-account05",
            },
          ],
        },
        {
          text: "環境別設定",
          collapsed: true,
          items: [
            {
              text: "SSL/TLS 環境別設定",
              link: "/code/dev.pro",
            },
          ],
        },
        {
          text: "開発ツール",
          collapsed: true,
          items: [
            { text: "Gemini CLI", link: "/code/gemini-cli" },
            { text: "Graphiti MCP Server ", link: "/code/GraphitiMCPServer" },
            {
              text: "Graphiti MCP Server利用手順 ",
              link: "/code/GraphitiMCPServer02",
            },
            {
              text: "Project_Guidelinesパターン1",
              link: "/code/Project_Guidelines01",
            },
            {
              text: "Project_Guidelinesパターン2",
              link: "/code/Project_Guidelines02",
            },
            {
              text: "Graphiti MCP個人ルール",
              link: "/code/Graphiti_user_rules",
            },
            {
              text: "Next.jsコーダーagent",
              link: "/code/Next.js_coder",
            },
            {
              text: "SpringBootMbatisコーダーagent",
              link: "/code/SpringBootMbatis_coder",
            },
            {
              text: "Meet_Claudia導入方法",
              link: "/code/Meet_Claudia01",
            },
            {
              text: "Meet_Claudia導入実践",
              link: "/code/Meet_Claudia02",
            },
            {
              text: "Meet Claudia 導入版使用手順",
              link: "/code/Meet_Claudia03",
            },
            {
              text: "別のパソコンにコピーして使う",
              link: "/code/Meet_Claudia04",
            },
            {
              text: "Cursor（カーソル）との比較",
              link: "/code/Meet_Claudia05",
            },
          ],
        },
        {
          text: "フロントエンド設定",
          collapsed: false,
          items: [
            { text: "環境変数設定ファイル", link: "/code/kankyou" },
            { text: "Tailwind CSSセットアップ", link: "/code/css" },
          ],
        },
        {
          text: "バックエンド設定",
          collapsed: false,
          items: [
            {
              text: "（Cloudflare Workers）設定",
              link: "/code/setting",
            },
            { text: "環境変数設定", link: "/code/bk_kankyou" },
            { text: "バックエンドルート設定", link: "/code/route" },
            { text: "テスト環境の設定", link: "/code/jesttest" },
            { text: "Vitestテスト環境の設定", link: "/code/vitest" },
          ],
        },
        {
          text: "プロジェクト設定",
          collapsed: false,
          items: [
            { text: ".gitignore設定", link: "/code/anzen" },
            { text: "修正内容デプロイ手順", link: "/code/deburoi" },
            { text: "Vercel環境変数設定", link: "/code/v_kankyou" },
            { text: "Render環境変数設定", link: "/code/r_kankyou" },
            { text: "Maven の高速実行ツール", link: "/code/MavenDaemon" },
            { text: "pom.xml依存関係解決", link: "/code/pom" },
            {
              text: "ローカルPostgreSQL15のインストール",
              link: "/code/PostgreSQL15",
            },
            {
              text: "①⚠️AWSのPostgreSQL15のインストール",
              link: "/code/AWSPostgreSQL15",
            },
            {
              text: "②🔥💥❗AWSのPostgreSQL15の指摘",
              link: "/code/AWSPostgreSQL15_s",
            },
            {
              text: "③✅🏗️👑AWSのPostgreSQL15の再インストール",
              link: "/code/AWSPostgreSQL15_sis",
            },
            {
              text: "ローカルpgAdmin4とE2のPostgreSQL15連携",
              link: "/code/pgAdmin4E2",
            },
            {
              text: "postgresql自動起動設定（オプション）",
              link: "/code/vi.postgresql.service",
            },
            {
              text: "サービスを有効化エラー",
              link: "/code/start.err",
            },
            {
              text: "ポート 5432 使用中問題",
              link: "/code/port_ari",
            },
            {
              text: "SSM Session Manager",
              link: "/code/SSMSessionManager",
            },
            {
              text: "最終手段（初期化）",
              link: "/code/postgresql.reset",
            },
            { text: "データベース削除", link: "/code/db_delete" },
            { text: "データベーススキーマ取得", link: "/code/db_schema" },
            { text: "pg_adminセキュリティー", link: "/code/pg_admin" },
            {
              text: "🔴🟢🟡🧰springとnextの連携",
              collapsed: true,
              items: [
                {
                  text: "前提条件",
                  link: "/code/jyouken",
                },
              ],
            },
          ],
        },
      ],
      "/coment/": [
        {
          text: "Spring Boot開発説明",
          collapsed: false,
          items: [
            { text: "001事前準備", link: "/coment/keikaku001" },
            { text: "002プロジェクト構成案", link: "/coment/keikaku002" },
            { text: "003次のステップ", link: "/coment/keikaku003" },
            { text: "004ゴール第1段階", link: "/coment/keikaku004" },
            { text: "005ゴール第2段階", link: "/coment/keikaku005" },
            { text: "006ゴール第3段階", link: "/coment/keikaku006" },
            { text: "006-1整合性確認", link: "/coment/keikaku006_1" },
            { text: "006-2依存関係全体像", link: "/coment/keikaku006_2" },
            { text: "007ゴール第4段階", link: "/coment/keikaku007" },
            { text: "008挙動テスト", link: "/coment/keikaku008" },
          ],
        },
        {
          text: "バッチ開発",
          collapsed: false,
          items: [
            { text: "009バッチ機能実装01", link: "/coment/keikaku009" },
            { text: "グローバル状態管理", link: "/coment/groball_c" },
          ],
        },
        {
          text: "プロジェクト設定",
          collapsed: false,
          items: [{ text: "vercel.json", link: "/coment/vercel_json" }],
        },
      ],
      "/guide/": [
        {
          text: "改修企画案",
          collapsed: true,
          items: [
            { text: "改修企画案001", link: "/guide/kaisyu001" },
            { text: "改修企画案002", link: "/guide/kaisyu002" },
            { text: "スキーマ整理", link: "/guide/kaisyu003" },
            { text: "推測した要件定義", link: "/guide/kaisyu003_02" },
            { text: "🧩 提案概要", link: "/guide/kaisyu003_03" },
            { text: "ER図", link: "/guide/kaisyu004" },
            { text: "PMとしての主な役割", link: "/guide/kaisyu005" },
          ],
        },
        {
          text: "設計",
          collapsed: false,
          items: [
            { text: "003-1_設計-要件", link: "/guide/keikaku3_1" },
            { text: "003-2_設計-基本", link: "/guide/keikaku3" },
            {
              text: "003-3_2.2.4 人事情報受信バッチ処理",
              link: "/guide/batch000",
            },
            {
              text: "003-4_2.2.4 人事情報受信バッチ処理改修",
              link: "/guide/batch001",
            },
            {
              text: "003-5_2.2.4 人事情報受信バッチ処理改修前後比較",
              link: "/guide/batch002",
            },
            {
              text: "✅人事情報バッチ詳細設計01",
              link: "/guide/batch003",
            },
            {
              text: "✅人事情報バッチ詳細設計02",
              link: "/guide/batch004",
            },
            {
              text: "✅人事情報バッチ詳細設計03",
              link: "/guide/batch005",
            },
            {
              text: "✅人事情報バッチ詳細設計04",
              link: "/guide/batch006",
            },
            {
              text: "✅人事情報バッチ詳細設計05",
              link: "/guide/batch007",
            },
            {
              text: "✅人事情報バッチ詳細設計06",
              link: "/guide/batch008",
            },
          ],
        },
        {
          text: "backend開発",
          collapsed: false,
          items: [
            { text: "バッチ処理の開発1.0", link: "/guide/b_k01" },
            { text: "バッチ処理の開発3.0", link: "/guide/b_k03" },
          ],
        },
        {
          text: "バッチ実行API",
          collapsed: true,
          items: [
            {
              text: "認証・検証・非同期処理の連携",
              link: "/guide/batrch_api01",
            },
            {
              text: "SecurityConfig",
              link: "/guide/SecurityConfig",
            },
            {
              text: "SecurityHandlerInterceptor",
              link: "/guide/SecurityHandlerInterceptor",
            },
            {
              text: "TokenManager",
              link: "/guide/TokenManager",
            },
            {
              text: "BatchJobController",
              link: "/guide/BatchJobController",
            },
            {
              text: "TokenHandler",
              link: "/guide/TokenHandler",
            },
            {
              text: "TokenValidateType",
              link: "/guide/TokenValidateType",
            },
            {
              text: "認証・検証・非同期処理の連携フィロー",
              link: "/guide/batrch_api02",
            },
            {
              text: "Next.js連携V3改造案",
              link: "/guide/next_api_v3",
            },
            {
              text: "Next.js連携R1改造案",
              link: "/guide/next_api_R1",
            },
          ],
        },
        {
          text: "バッチ実行API改造版",
          collapsed: true,
          items: [
            {
              text: "連携フロー",
              link: "/guide/batrch_api_renkei01",
            },
            {
              text: "トークン作成テスト",
              link: "/guide/batrch_api_renkei02",
            },
          ],
        },
        {
          text: "新規登録について",
          collapsed: true,
          items: [
            {
              text: "✅ 新規ユーザー登録",
              link: "/guide/new_register01",
            },
            {
              text: "01_JwtAuthenticationFilter",
              link: "/guide/JwtAuthenticationFilter",
            },
            {
              text: "JwtUtil",
              link: "/guide/JwtUtil",
            },
            {
              text: "02_SecurityHandlerInterceptor",
              link: "/guide/SecurityHandlerInterceptor",
            },
            {
              text: "TokenHandler",
              link: "/guide/TokenHandler",
            },
            {
              text: "TokenManager",
              link: "/guide/TokenManager",
            },
            {
              text: "03_RegisterController",
              link: "/guide/RegisterController",
            },
            {
              text: "User",
              link: "/guide/User",
            },
            {
              text: "04_AuthenticationService",
              link: "/guide/AuthenticationService",
            },
            {
              text: "05_UserRepository",
              link: "/guide/UserRepository",
            },
            {
              text: "06_User",
              link: "/guide/User",
            },
            {
              text: "07_JwtUtil",
              link: "/guide/JwtUtil",
            },
            {
              text: "08_AuthResponse",
              link: "/guide/AuthResponse",
            },
            {
              text: "⭐️ ⭐️ ⭐️ ⭐️ ⭐️ 処理フローの詳細",
              link: "/guide/Processingflow",
            },
            {
              text: "✅⭐️登録後のアプローチ",
              link: "/guide/approach",
            },
          ],
        },
        {
          text: "ログインについて",
          collapsed: true,
          items: [
            {
              text: "既存ロジック確認",
              link: "/guide/logic_kakunin01",
            },
            {
              text: "ログイン処理の流れ",
              link: "/guide/loginProcessingflow",
            },
            {
              text: "❗🚨AuthControllereとフロントエンドの連携問題",
              link: "/guide/AuthController",
            },
            {
              text: "⭐️ ⭐️ ⭐️ ⭐️ ⭐️ 処理フローの詳細",
              link: "/guide/loginProcessingflow02",
            },
          ],
        },
      ],
      "/posts/": [
        {
          text: "記事",
          collapsed: true,
          items: [
            { text: "bean登録問題解決", link: "/posts/error_01" },
            {
              text: "プロパティの連携",
              link: "/posts/properties_settings",
            },
          ],
        },
        {
          text: "メモ帳",
          collapsed: true,
          items: [
            { text: "EntityとDTOの違い", link: "/posts/memo01" },
            {
              text: "UserMapper インターフェースについて",
              link: "/posts/memo02",
            },
            {
              text: "UserRepository インターフェースについて",
              link: "/posts/memo03",
            },
            {
              text: "UserRepositoryとUserMapper両方必要❌",
              link: "/posts/memo04",
            },
            {
              text: "重大問題見直す✅ ",
              link: "/posts/memo05",
            },
            {
              text: "実装の優先順位✅ ",
              link: "/posts/memo06",
            },
          ],
        },
        {
          text: "spring batchの一部流れ",
          collapsed: true,
          items: [
            {
              text: "HumanResourceJobConfig",
              link: "/posts/HumanResourceJobConfig",
            },
            {
              text: "ActiveDirectory情報の読み込み例",
              link: "/posts/ActiveDirectory",
            },
            {
              text: "job実行成功DEBUG情報",
              link: "/posts/job_debug",
            },
          ],
        },
      ],
      "/tutorial/": [
        {
          text: "チュートリアル",
          collapsed: true,
          items: [{ text: "高速な Maven 実行", link: "/tutorial/mvnd_tool" }],
        },
        {
          text: "trn_user 開発",
          collapsed: true,
          items: [
            {
              text: "💥 プロジェクトの新規プッシュ",
              link: "/tutorial/push_project",
            },
            { text: "💥 更新コードをpush する流れ", link: "/tutorial/push_u" },
            { text: "✅ エンティティ", link: "/tutorial/entity_u" },
            { text: "✅ UserDto", link: "/tutorial/dto_u" },
            { text: "✅ UserService", link: "/tutorial/service_u" },
            { text: "✅ UserServiceImpl", link: "/tutorial/serviceimpl_u" },
            { text: "✅ UserMapper", link: "/tutorial/mapper_u" },
            { text: "✅ UserMapper.xml", link: "/tutorial/mapperxml_u" },
            { text: "UserController", link: "/tutorial/controller_u" },
          ],
        },
        {
          text: "共通機能 開発",
          collapsed: true,
          items: [
            {
              text: "共通機能",
              link: "/tutorial/kyo_tt",
            },
            {
              text: "CSVUtilユーティリティ",
              link: "/tutorial/kyo_csvutil",
            },
            {
              text: "CSVReadUtilユーティリティ",
              link: "/tutorial/kyo_CSVReadUtil",
            },
            {
              text: "CSVWriterユーティリティ",
              link: "/tutorial/kyo_CSVWriter",
            },
            {
              text: "基底サービス",
              link: "/tutorial/kyo_baseservice",
            },
          ],
        },
        {
          text: "バッチ開発",
          collapsed: true,
          items: [
            {
              text: "メタデータテーブルの作成",
              link: "/tutorial/batch_kakunin01",
            },
            { text: "挙動確認", link: "/tutorial/batch_kakunin" },
            { text: "job実行問題について", link: "/tutorial/batch_kakunin02" },
            { text: "job実行問題解決", link: "/tutorial/batch_kakunin03" },
            {
              text: "job実行問題解決最新版",
              link: "/tutorial/batch_kakunin04",
            },
            { text: "pom.xmlの重要確認更新", link: "/tutorial/pomxml_check" },
            {
              text: "registerのtest",
              link: "/tutorial/register_test",
            },
          ],
        },
        {
          text: "バッチ開発コード分析",
          collapsed: true,
          items: [
            {
              text: "FileSystemWrite",
              link: "/tutorial/FileSystemWrite",
            },
          ],
        },
        {
          text: "next.jsでバッチ実行",
          collapsed: true,
          items: [
            {
              text: "草案0.1",
              link: "/tutorial/batch_nextjs01",
            },
            { text: "認証草案0.1", link: "/tutorial/Security_jwt01" },
            { text: "認証草案0.2", link: "/tutorial/Security_jwt02" },
            { text: "認証草案0.3", link: "/tutorial/Security_jwt03" },
            {
              text: "job実行問題解決最新版",
              link: "/tutorial/batch_kakunin04",
            },
            {
              text: "ポート 8080 使用中問題につき",
              link: "/tutorial/batch_port8080",
            },
          ],
        },
        {
          text: "SQL文の練習",
          collapsed: true,
          items: [
            {
              text: "参照制約の状態を確認",
              link: "/tutorial/batch_sql01",
            },
          ],
        },
        {
          text: "セキュリティー 開発",
          collapsed: true,
          items: [
            {
              text: "TokenValidateType",
              link: "/tutorial/TokenValidateType",
            },
            {
              text: "TokenHandler",
              link: "/tutorial/TokenHandler",
            },
            {
              text: "TokenManager",
              link: "/tutorial/TokenManager",
            },
            {
              text: "SecurityHandlerInterceptor",
              link: "/tutorial/SecurityHandlerInterceptor",
            },
          ],
        },
        {
          text: "認証サービス 開発",
          collapsed: true,
          items: [
            {
              text: "LoginUserModel",
              link: "/tutorial/LoginUserModel",
            },
            {
              text: "Constants",
              link: "/tutorial/Constants",
            },
            {
              text: "LabelValueModel",
              link: "/tutorial/LabelValueModel",
            },
            {
              text: "AppCommonMapper",
              link: "/tutorial/AppCommonMapper",
            },
            {
              text: "AuthService",
              link: "/tutorial/AuthService",
            },
          ],
        },
        {
          text: "開発詳細ページ群",
          collapsed: true,
          items: [
            {
              text: "BatchConfig",
              link: "/tutorial/BatchConfig",
            },
            {
              text: "BatchSettings",
              link: "/tutorial/BatchSettings",
            },
            {
              text: "environment.properties",
              link: "/tutorial/environment.properties",
            },
          ],
        },
        {
          text: "その他",
          collapsed: true,
          items: [
            {
              text: "SecurityConfigセキュリティ設定",
              link: "/tutorial/s_config",
            },
            {
              text: "pom.xml設定",
              link: "/tutorial/pomxml",
            },
            {
              text: "ResourceNotFoundException",
              link: "/tutorial/ResourceNotFoundException",
            },
            {
              text: "DuplicateResourceException",
              link: "/tutorial/DuplicateResourceException",
            },
            {
              text: "properties",
              link: "/tutorial/properties",
            },
          ],
        },
        {
          text: "テスト準備",
          collapsed: true,
          items: [
            { text: "テスト計画", link: "/tutorial/test_u" },
            { text: "test.properties", link: "/tutorial/test.properties" },
            {
              text: "✅ test.properties設定実践",
              link: "/tutorial/test.properties_g",
            },
            { text: "単体テスト", link: "/tutorial/test.tantai" },
            { text: "単体と総合計画", link: "/tutorial/test.tansou" },
          ],
        },
        {
          text: "🧱テストフェーズまとめ",
          collapsed: false,
          items: [
            { text: "3層構成の理解", link: "/tutorial/Architecture" },
            {
              text: "テスト環境用の設定ファイル",
              link: "/tutorial/test_properties",
            },
            { text: "pom.xml依存関係の更新", link: "/tutorial/test_pomxml" },
            { text: "オブジェクト構成0.1", link: "/tutorial/kousei0.1" },
          ],
        },
        {
          text: "ビジネスロジック層テスト実施",
          collapsed: true,
          items: [
            {
              text: "✅単体UserServiceImplMockTest",
              link: "/tutorial/UserServiceImplMockTest",
            },
            {
              text: "✅統合UserServiceIntegrationTest",
              link: "/tutorial/UserServiceIntegrationTest",
            },
            {
              text: "🔍上記単体と統合の違い",
              link: "/tutorial/MockIntegration",
            },
          ],
        },
        {
          text: "プレゼンテーション層テスト実施",
          collapsed: true,
          items: [
            {
              text: "✅ 単体UserControllerMockTest",
              link: "/tutorial/UserControllerMockTest",
            },
            {
              text: "✅統合UserControllerIntegrationTest",
              link: "/tutorial/UserControllerIntegrationTest",
            },
            {
              text: "🔍上記単体と統合の違い",
              link: "/tutorial/MockIntegration_c",
            },
          ],
        },
        {
          text: " Repository層テスト実施",
          collapsed: true,
          items: [
            {
              text: "✅単体UserMapperMockTest",
              link: "/tutorial/UserMapperMockTest",
            },
            {
              text: "✅統合UserMapperIntegrationTest",
              link: "/tutorial/UserMapperIntegrationTest",
            },
            {
              text: "🔍上記単体と統合の違い",
              link: "/tutorial/MockIntegration_m",
            },
          ],
        },
      ],
      "/frontend/": [
        {
          text: "基盤の理解",
          collapsed: true,
          items: [
            { text: "プロジェクト開発の計画", link: "/frontend/pro_pla" },
            { text: "Tailwind CSS", link: "/frontend/TailwindCSS" },
            { text: "layout.tsx", link: "/frontend/base_likai" },
            { text: "Header.tsx", link: "/frontend/Header.tsx" },
            { text: "Footer.tsx", link: "/frontend/Footer.tsx" },
            { text: "将来使用useAuth.ts", link: "/frontend/useAuth.ts" },
            { text: "AuthProvider.tsx", link: "/frontend/AuthProvider.tsx" },
            { text: "register.tsx", link: "/frontend/register.tsx" },
            { text: "login.tsx", link: "/frontend/login.tsx" },
            {
              text: "操作画面エラー明示したい場合",
              link: "/frontend/err_front",
            },
          ],
        },
        {
          text: "AWS Amplifyへのデプロイ",
          collapsed: true,
          items: [{ text: "githubからAWSへ", link: "/frontend/github_aws" }],
        },
        {
          text: "バッチ実行について",
          collapsed: true,
          items: [
            { text: "プッシュ通知追加", link: "/frontend/job_kaizan01" },
            { text: "ステップごとの進捗表示", link: "/frontend/job_kaizan02" },
            { text: "非同期エラー", link: "/frontend/job_kaizan03" },
            { text: "全体確認と修正", link: "/frontend/job_kaizan04" },
            {
              text: "✅ ジョブID ライフサイクル管理フロー",
              link: "/frontend/job_kaizan05",
            },
          ],
        },
        {
          text: "記事",
          collapsed: true,
          items: [
            { text: "フロントディレクトリの構成", link: "/frontend/fron_dir" },
            { text: "バックエンドとの連携案", link: "/frontend/front_back" },
          ],
        },
        {
          text: "フロント開発",
          collapsed: true,
          items: [
            { text: "ログイン後の処理01", link: "/frontend/login_001" },
            { text: "ログイン後の処理02", link: "/frontend/login_002" },
            { text: "ログイン後の処理03", link: "/frontend/login_003" },
            {
              text: "❗🚨AuthProvider.tsxとバックエンドAuthControllereの連携問題",
              link: "/frontend/AuthProvider",
            },
            {
              text: "🚀ログアウト処理はバックエンドと連携？",
              link: "/frontend/AuthProvider02",
            },
          ],
        },
        {
          text: "メモ帳",
          collapsed: true,
          items: [
            { text: "EntityとDTOの違い", link: "/posts/memo01" },
            {
              text: "UserMapper インターフェースについて",
              link: "/posts/memo02",
            },
            {
              text: "UserRepository インターフェースについて",
              link: "/posts/memo03",
            },
            {
              text: "UserRepositoryとUserMapper両方必要❌",
              link: "/posts/memo04",
            },
            {
              text: "重大問題見直す✅ ",
              link: "/posts/memo05",
            },
            {
              text: "実装の優先順位✅ ",
              link: "/posts/memo06",
            },
          ],
        },
        {
          text: "spring batchの一部流れ",
          collapsed: true,
          items: [
            {
              text: "HumanResourceJobConfig",
              link: "/posts/HumanResourceJobConfig",
            },
            {
              text: "ActiveDirectory情報の読み込み例",
              link: "/posts/ActiveDirectory",
            },
            {
              text: "job実行成功DEBUG情報",
              link: "/posts/job_debug",
            },
          ],
        },
      ],
    },

    socialLinks: [{ icon: "github", link: "https://github.com/your-account" }],
  },
});
