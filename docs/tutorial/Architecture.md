<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">Spring Boot の代表的な 3 層構成</span>

Spring Boot アプリケーションは一般的に「**レイヤードアーキテクチャ（層構造）**」で構成されており、以下のように役割が分かれています。

---

## 🔧 Spring Boot の代表的な 3 層構成

| 層の名前                                      | 主なクラス                        | 役割             | 説明                                                                                      |
| --------------------------------------------- | --------------------------------- | ---------------- | ----------------------------------------------------------------------------------------- |
| **① Presentation 層**（プレゼンテーション層） | `@Controller` / `@RestController` | 外部との窓口     | HTTP リクエスト/レスポンスのやり取りを担当。バリデーションもここで行う。                  |
| **② Service 層**（ビジネスロジック層）        | `@Service`                        | ビジネスロジック | 取引や業務ルールの処理。Controller と Repository の橋渡し。トランザクション制御もここで。 |
| **③ Repository 層（または Persistence 層）**  | `@Repository` / Mapper            | データアクセス   | DB とのやり取りを担当（CRUD）。MyBatis の `Mapper` や JPA の `JpaRepository` など。       |

---

## ✅ Mapper ＝ Repository 層の一種

- `Mapper` は、MyBatis を使う場合の **Repository（永続化層）** に該当します。
- 通常、以下のように書きます：

```java
@Mapper
public interface UserMapper {
    User selectUserById(Long userId);
}
```

このように `Mapper` は「DB とやりとりする層」として `@Repository` に近い役割を果たします。

---

## 📌 補足：DTO, Entity, VO の流れ（典型的なデータ移動）

1. `Controller` で HTTP リクエストを受け取り、`DTO` に変換
2. `Service` でビジネスロジック処理
3. `Mapper` を介して DB から `Entity` を取得
4. 結果を `DTO` に詰めて `Controller` に戻す

---

## 🧱 層の依存関係（下から上へ）

```
[DB] ← Mapper（@Mapper） ← Service（@Service） ← Controller（@RestController） ← [外部]
```

各層は**下の層にしか依存しない**のが基本です。こうすることで保守性とテスト容易性が向上します。

---

## まとめ

| 層         | Spring アノテーション      | 担当           | 代表例                  |
| ---------- | -------------------------- | -------------- | ----------------------- |
| Controller | `@RestController`          | リクエスト処理 | `UserController`        |
| Service    | `@Service`                 | 業務ロジック   | `UserService`           |
| Repository | `@Mapper` or `@Repository` | DB アクセス    | `UserMapper`（MyBatis） |

---

必要であれば、各層のコード構成例や、Spring Boot + MyBatis プロジェクトの典型構造も紹介できます。
