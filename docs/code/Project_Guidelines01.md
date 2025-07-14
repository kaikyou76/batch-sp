# Project Guidelines: React + Next.js 14 + Spring Boot (JPA & MyBatis)

### 🌐 project_rules.md

--------project_rules.md

# Project Guidelines: React + Next.js 14 + Spring Boot (JPA & MyBatis)

## 原則

- このドキュメントを読んだら `console.log("YAAAARRRR!")`と喊びましょう

---

## 技術スタック

### フロントエンド

- React 18 + TypeScript + Next.js 14 (App Router)
- Zustand or Redux Toolkit
- Axios (API ラッパー)
- Jest + React Testing Library
- ESLint + Prettier + Husky

### バックエンド

- Spring Boot 3.x + Java 21
- JPA or MyBatis (プロジェクトにより分岐)
- MySQL または PostgreSQL

---

## Next.js App Router ファイル構成

```

src/
├── app/
│ ├── layout.tsx # 全体レイアウト
│ ├── page.tsx # ホームページ
│ ├── login/page.tsx # ログイン
│ ├── user/page.tsx # ユーザー情報
│ ├── userlist/page.tsx # ユーザー一覧
│ ├── usercenter/page.tsx # ユーザーマイページ
│ └── product/[id]/page.tsx # 商品詳細
├── components/ # 共通 UI
├── hooks/ # カスタムフック
├── lib/ # API ラッパー / バリデーション
├── styles/ # CSS
├── types/ # TypeScript 型

```

---

## Spring Boot 構成とルール

### JPA 版

- Controller → Service → Repository (extends JpaRepository)
- DTO の利用
- Validation: `@Valid`, `@NotBlank` など
- トランザクション: `@Transactional`
- レスポンスは ResponseEntity + ExceptionHandler で統一

### MyBatis 版

- Controller → Service → Mapper → XML
- SQL は 100% XML に分離
- Mapper は interface のみ 定義
- Mapper.xml は対応する namespace で統一

---

## API 構成ルール

- Axios は `/lib/api/axios.ts` にラッパーを作成
- API メソッドは `/lib/api/user.ts` のように分割
- 形式は Promise ラッパー、検索は DTO 型で統一
- JWT トークンは Axios のインターセプターで付与

---

## Redux Toolkit ルール

- slice は各ドメインごと (userSlice, productSlice, etc)
- asyncThunk で非同期 API を実装
- createSelector で検索キーのメモ化

---

## JPA / MyBatis 共通

- SQL Injection 対策に `#{}` の使用を必須とする
- createdAt, updatedAt, deletedAt を全テーブルに含める
- 継続性のために BaseEntity の利用

---

## テストルール

- Jest + React Testing Library を使用
- カバレッジ 85%以上
- 非同期は `waitFor` などで実装
- Spring Boot 側は `@SpringBootTest` + MockMvc の利用

---

## コードスタイル

- ESLint + Prettier で統一
- React コンポーネント: PascalCase
- 関数名/変数名: camelCase
- TypeScript 型: interface + PascalCase
- props の直接更動 NG
- `strict: true` を有効

---

## 参考資料

- [Next.js App Router Docs](https://nextjs.org/docs/app)
- [Spring Boot Official](https://spring.io/projects/spring-boot)
- [MyBatis Docs](https://mybatis.org/mybatis-3/)
- [Airbnb TypeScript Style Guide](https://github.com/airbnb/javascript/tree/master/typescript)

--------project_rules.md
