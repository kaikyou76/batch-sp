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
          ],
        },
      ],
      "/code/": [
        {
          text: "開発ツール",
          collapsed: true,
          items: [
            { text: "Gemini CLI", link: "/code/gemini-cli" },
            { text: "Tailwind CSSセットアップ", link: "/code/css" },
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
            { text: "データベース削除", link: "/code/db_delete" },
            { text: "データベーススキーマ取得", link: "/code/db_schema" },
            { text: "pg_adminセキュリティー", link: "/code/pg_admin" },
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
    },

    socialLinks: [{ icon: "github", link: "https://github.com/your-account" }],
  },
});
