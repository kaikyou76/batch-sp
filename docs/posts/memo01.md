<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">Entity と DTO の違い</span>
はい、`UserDto` と `User` のクラスは非常によく似ていますが、**役割**と**用途**が明確に異なります。以下にそれぞれの違いと役割を説明します。

---

## ✅ **違いの概要**

| 項目           | `User`（Entity）                                                     | `UserDto`（データ転送用）                                                     |
| -------------- | -------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| 役割           | データベースのテーブルと直接対応する「永続化対象クラス」             | クライアントや他の層とのやり取り用「データ転送オブジェクト」                  |
| アノテーション | `@Entity`, `@Table`, `@Column`, `@Id`, `@CreationTimestamp` など多数 | `@Getter`, `@Setter`, `@Builder`, `@NoArgsConstructor`, `@AllArgsConstructor` |
| DB との関係    | ORM（JPA）によって DB の`trn_user`テーブルとマッピング               | DB とは無関係、データだけ持つ POJO                                            |
| フィールド名   | `createdDate`, `updateDate`, `boolean deleted`                       | `createDate`, `updateDate`, `Boolean deleted`                                 |
| ロジック       | `updatePassword(...)` などのドメインロジック含む                     | ロジックなし、純粋なデータ入出力用                                            |

---

## 🔍 **それぞれの役割の詳細**

### 🧱 `User` クラス（Entity）

- JPA（Hibernate）によって**テーブル `trn_user` にマッピングされる**。
- データベースに格納されるデータの構造と一致する。
- `@Entity` や `@Column` などの JPA アノテーションを使って、DB 列と Java フィールドを対応させている。
- アプリケーション内で**ドメインロジック**（例: `updatePassword()`）も実装可能。
- JPA の仕組みによって永続化・更新が自動的に行われる。

### 📦 `UserDto` クラス（DTO）

- **API のリクエストやレスポンスで使用されるデータ構造**。
- DB とは無関係に、必要なフィールドだけを持つ「データの入れ物」。
- 例: REST API の JSON 入出力、サービス間通信、画面とのデータやり取りなど。
- フィールドが Entity と似ていても、データの整形・省略・変換などが柔軟にできる。
- `boolean` → `Boolean` にしているのは、**null 許容にするため**（例：更新 API で省略可）。

---

## ✅ **使い分けのパターン**

- **データベース操作（永続化、検索、更新）** ⇒ `User`（Entity）
- **API で外部とデータやりとりする** ⇒ `UserDto`（DTO）

---

## 🔄 よくある対応パターン（MapStruct などを使って）

```java
// Entity → DTO
UserDto dto = UserDto.builder()
    .userId(user.getUserId())
    .companyCd(user.getCompanyCd())
    .employeeCd(user.getEmployeeCd())
    .userNm(user.getUserNm())
    ...
    .build();

// DTO → Entity（更新などのとき）
User user = userRepository.findById(dto.getUserId()).orElseThrow();
user.setUserNm(dto.getUserNm());
user.setUpdateUser(dto.getUpdateUser());
```

または MapStruct を使えば自動マッピングできます。

---

## ✅ 結論

| クラス    | 目的                                                                              |
| --------- | --------------------------------------------------------------------------------- |
| `User`    | データベースと連携するためのエンティティ。保存・検索・更新などに使う。            |
| `UserDto` | フロントエンドや外部 API とのやり取り用データ転送オブジェクト。入力・出力に使用。 |

両者の責務を分けることで、データベース層とプレゼンテーション層の**疎結合**が保たれ、保守性とテスト性が向上します。
