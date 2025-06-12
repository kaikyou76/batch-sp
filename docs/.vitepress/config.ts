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
          text: "要件定義",
          collapsed: false,
          items: [
            { text: "001-プロジェクトセットアップ", link: "/guide/kekaku1" },
            { text: "推奨パッケージ一覧", link: "/guide/tools" },
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
          ],
        },
        {
          text: "frontend開発",
          collapsed: false,
          items: [
            { text: "商品一覧", link: "/guide/pr_list" },
            { text: "ナビゲーション1.0", link: "/guide/nb" },
            { text: "ナビゲーション2.0", link: "/guide/nb2" },
            { text: "登録", link: "/guide/register" },
            { text: "ログイン", link: "/guide/login" },
            { text: "JWT認証開発", link: "/guide/jwt_ns" },
            { text: "グローバル状態管理凡例", link: "/guide/groball" },
            {
              text: "状態管理AuthProvider1.0",
              link: "/guide/auth_provider",
            },
            {
              text: "状態管理AuthProvider2.0",
              link: "/guide/auth_provider2",
            },
            {
              text: "状態管理AuthProvider3.0",
              link: "/guide/auth_provider3",
            },
            {
              text: "状態管理AuthProvider4.0",
              link: "/guide/auth_provider4",
            },
            {
              text: "状態管理AuthProviderバッグ修正",
              link: "/guide/auth_provider5",
            },
            { text: "ダッシュボード（管理画面）", link: "/guide/dashboard" },
            { text: "会員管理画面1.0", link: "/guide/member1" },
            { text: "管理者管理画面1.0", link: "/guide/admin1" },
            { text: "管理者商品編集0.1", link: "/guide/product01" },
          ],
        },
        {
          text: "backend開発",
          collapsed: false,
          items: [
            { text: "バッチ処理の開発1.0", link: "/guide/b_k01" },
            { text: "バッチ処理の開発3.0", link: "/guide/b_k03" },
            { text: "1. 🔐 認証系API開発", link: "/guide/api1" },
            { text: "商品作成🌟", link: "/guide/product_create" },
            { text: "商品編集🌟", link: "/guide/product_edit" },
            { text: "カテゴリ作成 API", link: "/guide/categories_create" },
            { text: "api作成", link: "/guide/api5" },
            { text: "api作成", link: "/guide/api6" },
            { text: "api作成", link: "/guide/api7" },
            { text: "api作成", link: "/guide/api8" },
            { text: "api作成", link: "/guide/api9" },
            { text: "api作成", link: "/guide/api10" },
            { text: "api作成", link: "/guide/api11" },
          ],
        },
        {
          text: "単体テスト",
          collapsed: false,
          items: [
            { text: "0. 🔐 APIテスト設計簡略版", link: "/guide/api1_sekei" },
            { text: "0. 🔐 APIテストコピペ", link: "/guide/api1_copi" },
            { text: "1. 🔐 認証系API_登録・ログイン", link: "/guide/api1plan" },
            { text: "1. 🔐 認証系API_ログアウト", link: "/guide/api1test" },
            { text: "api作成", link: "/guide/api2" },
            { text: "api作成", link: "/guide/api3" },
            { text: "api作成", link: "/guide/api4" },
            { text: "api作成", link: "/guide/api5" },
            { text: "api作成", link: "/guide/api6" },
            { text: "api作成", link: "/guide/api7" },
            { text: "api作成", link: "/guide/api8" },
            { text: "api作成", link: "/guide/api9" },
            { text: "api作成", link: "/guide/api10" },
            { text: "api作成", link: "/guide/api11" },
          ],
        },
        {
          text: "その他",
          collapsed: true,
          items: [
            { text: "使い方ガイド", link: "/guide/" },
            { text: "破棄予定002-基本ページの作成", link: "/guide/keikaku2" },
            { text: "006-RestAPIの開発", link: "/guide/keikaku6" },
            { text: "007-RestAPIのバージョンアップ", link: "/guide/keikaku7" },
            { text: "工作目标", link: "/posts/memo" },
            { text: "Next.js购物网站开发", link: "/posts/hello-react" },
          ],
        },
      ],
      "/tutorial/": [
        {
          text: "チュートリアル",
          collapsed: true,
          items: [
            { text: "DC-001", link: "/tutorial/react-basics" },
            { text: "CG-001", link: "/tutorial/nextjs-project" },
            { text: "DC-002", link: "/tutorial/dc2" },
            { text: "cg-002", link: "/tutorial/cg2" },
            { text: "メモ―", link: "/tutorial/memeomeimo" },
            { text: "メモ―2", link: "/tutorial/memo2" },
            { text: "メモ―3", link: "/tutorial/memo3" },
            { text: "メモ―3追加女神", link: "/tutorial/memo3_2" },
            { text: "メモ―4", link: "/tutorial/memo4" },
            { text: "天坑水库监狱", link: "/tutorial/memo5" },
            { text: "DeekSeek-R1", link: "/tutorial/dcr1" },
            { text: "DeekSeek-V3", link: "/tutorial/dcv3" },
            { text: "chatGPT-Zo", link: "/tutorial/cgzo" },
          ],
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
      "/posts/": [
        {
          text: "記事",
          collapsed: true,
          items: [
            { text: "ゴール", link: "/posts/memo" },
            {
              text: "Next.js で買い物サイトを作る",
              link: "/posts/hello-react",
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
      ],
      "/about/": [
        {
          text: "私について",
          collapsed: true,
          items: [
            { text: "プロフィール", link: "/about/me" },
            { text: "ブログの歴史", link: "/about/history" },
            { text: "Cloudflare本番D1作成", link: "/about/cd1" },
            { text: "中レベルAPI設計", link: "/about/tes1" },
            { text: "高レベルAPI設計", link: "/about/tes2" },
            { text: "中高レベルAPI設計の採点", link: "/about/tes3" },
            { text: "chatGPT開発流れ説明", link: "/about/tes4" },
            { text: "DeepSeek V3 テーブル説明", link: "/about/tes6" },
            { text: "DeepSeek R1 テーブル説明", link: "/about/tes5" },
            { text: "ローカル開発とクラウド同期", link: "/about/douki" },
            { text: "1. 🔐 認証系API開発", link: "/about/api1" },
            { text: "2. 👤 ユーザー管理API開発", link: "/about/api2" },
            { text: "3. 🛒 商品（Products）API開発", link: "/about/api3" },
            { text: "4. 🖼️ 商品画像API開発", link: "/about/api4" },
            { text: "5. 🏷️ タグAPI開発", link: "/about/api5" },
            { text: "6. 📂 カテゴリAPI開発", link: "/about/api6" },
            { text: "7. 🛍️ カートAPI開発", link: "/about/api7" },
            { text: "8. 📦 注文API開発", link: "/about/api8" },
            { text: "9. ✍️ レビューAPI開発", link: "/about/api9" },
            { text: "10. 💖 お気に入りAPI開発", link: "/about/api10" },
            {
              text: "11. 📝 管理ログ（Admin Logs）API開発",
              link: "/about/api11",
            },
          ],
        },
      ],
      "/code/": [
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
    },

    socialLinks: [{ icon: "github", link: "https://github.com/your-account" }],
  },
});
