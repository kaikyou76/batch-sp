# Project Guidelines

### 🌐 project_rules.md

--------project_rules.md

# Project Guidelines

## 対象技術

- **フロントエンド**: React 18 + TypeScript + Next.js 14 (App Router 構成)
- **状態管理**: Redux Toolkit（Context API 可）
- **スタイリング**: Tailwind CSS（必要に応じて CSS Modules）
- **API 通信**: Axios または Fetch + API ラッパー
- **テスト**: Jest + Testing Library
- **バックエンド**: Spring Boot 3.x (JPA 版 / MyBatis 版 両対応)

---

## ディレクトリ構成（Next.js）

```

src/
├── app/ # ページレイアウトとルーティング
│ ├── batch/
│ │ └── page.tsx # バッチ処理ページ
│ ├── login/
│ │ └── page.tsx # ログインページ
│ ├── register/
│ │ └── page.tsx # 登録ページ
│ ├── user/
│ │ └── page.tsx # ユーザー情報ページ
│ ├── layout.tsx # メインレイアウト
│ └── page.tsx # ホームページ

├── components/ # UI コンポーネント
│ ├── layout/ # レイアウト（Header, Footer など）
│ ├── ui/ # 共通 UI（Button, Card, Modal など）
│ ├── AuthProvider.tsx # 認証プロバイダー
│ ├── Footer.tsx # フッター
│ ├── Header.tsx # ヘッダー
│ └── LoginForm.tsx # ログインフォーム

├── hooks/ # カスタムフック
│ └── useAuth.ts # 認証フック

├── lib/ # ライブラリ・ユーティリティ
│ └── validation.ts # バリデーション関数

├── styles/ # スタイル
│ ├── globals.css # グローバル CSS
│ ├── reset.css # リセット CSS
│ └── theme.css # テーマ CSS

└── types/ # 型定義
└── auth.d.ts # 認証関連の型

README.md # プロジェクト概要
next.config.mjs # Next.js 設定ファイル
package.json # 依存パッケージ
tsconfig.json # TypeScript 設定

```

---

## Next.js + React18 コーディング規約

- `app/` ディレクトリを使用（App Router 構成）
- すべてのページは `page.tsx` で管理
- 状態管理は Redux Toolkit（または Context API）を使用し、useState のみの多用は避ける
- Axios は API レイヤー (`lib/api`) にまとめて定義
- データ取得には `fetch` の代わりに `getServerSideProps` / `server actions` を適宜活用

---

## Spring Boot ガイドライン（JPA 版）

- JPA + Hibernate による ORM を使用
- コントローラー・サービス・リポジトリ層を明確に分離（3 層アーキテクチャ）
- `@Transactional` はサービス層で付与
- バリデーションには `javax.validation.constraints.*` を使用
- データベースには `createdAt`, `updatedAt`, `deletedAt` フィールドを基本とする

### ディレクトリ構成

```

src/main/java/com/example/app/
├── controller/
├── service/
├── repository/
├── entity/
└── dto/

```

---

## Spring Boot ガイドライン（MyBatis 版）

- MyBatis を使用して XML に SQL を定義
- インターフェース `XxxMapper.java` と XML マッピングファイル `XxxMapper.xml` をセットで管理
- 動的 SQL には `<if>` `<where>` `<foreach>` を使用
- セキュリティ対策として `#{}` を使用し `${}` は使用禁止

### ディレクトリ構成

```

src/main/java/com/example/app/
├── controller/
├── service/
├── mapper/
├── pojo/
└── dto/

src/main/resources/mapper/
├── UserMapper.xml

```

---

## 共通ベストプラクティス

- 命名規則：CamelCase（関数・変数）、PascalCase（型名・コンポーネント名）、UPPER_CASE（定数）
- Redux `createSlice`, `createAsyncThunk`, `createSelector` を活用
- ESLint + Prettier を使用し、CI に組み込む
- テストは `@testing-library/react` + Jest、Spring は JUnit + Mockito

---

## 参考リンク

- Next.js App Router: [https://nextjs.org/docs/app/building-your-application/routing](https://nextjs.org/docs/app/building-your-application/routing)
- Redux Toolkit: [https://redux-toolkit.js.org/](https://redux-toolkit.js.org/)
- Spring Boot（JPA）: [https://spring.io/projects/spring-data-jpa](https://spring.io/projects/spring-data-jpa)
- Spring Boot（MyBatis）: [https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/](https://mybatis.org/spring-boot-starter/mybatis-spring-boot-autoconfigure/)

--------project_rules.md
