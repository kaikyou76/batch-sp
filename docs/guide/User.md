# User JPA エンティティ

### (src/main/java/com/example/orgchart_api/domain/User.java)

```java
package com.example.orgchart_api.domain;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "users", schema = "public")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Column(name = "name")
    private String name;

    @Column(name = "role", nullable = false, columnDefinition = "TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))")
    private String role;

    @Column(name = "create_date", nullable = false, updatable = false, insertable = true)
    @CreationTimestamp
    private LocalDateTime createDate;

 @Column(name = "update_date", nullable = false, insertable = true)
 private LocalDateTime updateDate;

 @Column(name = "update_user", nullable = false, insertable = true)
 private String updateUser;
}
```

#### 已深度思考

> このクラスはユーザー情報を表す JPA エンティティです。データベースの"users"テーブルにマッピングされます。
> 各フィールドとアノテーションの分析を行います。
> クラスレベルアノテーション:

- @Entity: JPA エンティティであることを示す。
- @Table: マッピングするテーブル名とスキーマを指定（name="users", schema="public"）。
- @Data: Lombok のアノテーションで、getter, setter, toString, equals, hashCode を生成。
- @NoArgsConstructor: 引数なしコンストラクタを生成。
- @AllArgsConstructor: 全てのフィールドを引数に持つコンストラクタを生成。
- @Builder: ビルダーパターンを利用したインスタンス生成を可能にする。
  > フィールドとフィールドレベルのアノテーション:
  >
  > 1.  id (主キー)
      - @Id: 主キーであることを示す。
      - @GeneratedValue(strategy = GenerationType.IDENTITY): 主キーの生成戦略をデータベースのIDENTITY（自動増分）に設定。
      - @Column(name = "id"): カラム名を明示（ここでは"id"）。
  > 2.  email
      - @Column(name = "email", nullable = false, unique = true):
         - カラム名は"email"。
         - nullを許可しない（必須）。
         - ユニーク制約（重複不可）。
  > 3.  passwordHash
      - @Column(name = "password_hash", nullable = false):
         - カラム名は"password_hash"。
         - nullを許可しない（必須）。パスワードはハッシュ化された状態で保存される。
  > 4.  name
      - @Column(name = "name"): カラム名は"name"。null可（nullableが指定されていないため、デフォルトでtrue）。
  > 5.  role
      - @Column(name = "role", nullable = false, columnDefinition = "TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))")
         - カラム名は"role"。
         - nullを許可しない（必須）。
         - カラム定義: データ型はTEXT、デフォルト値は'user'。チェック制約で'user'または'admin'のみ許可。
  > 6.  createDate (作成日時)
      - @Column(name = "create_date", nullable = false, updatable = false, insertable = true)
         - カラム名は"create_date"。
         - null不可。
         - updatable=false: 更新不可（作成時にのみ設定）。
         - insertable=true: 挿入可能（デフォルトなので省略可）。
      - @CreationTimestamp: Hibernateのアノテーション。エンティティが永続化される際に現在の日時が自動設定される。
  > 7.  updateDate (更新日時)
      - @Column(name = "update_date", nullable = false, insertable = true)
         - カラム名は"update_date"。
         - null不可。
         - insertable=true: 挿入可能（新規作成時にも設定される）。
         - 注意: updatableが指定されていないのでデフォルト（true）で更新可能。
      - 注意: 更新日時を自動設定するアノテーション（@UpdateTimestamp）が付いていない。おそらく実装ミス。
  > 8.  updateUser (更新ユーザー)
      - @Column(name = "update_user", nullable = false, insertable = true)
         - カラム名は"update_user"。
         - null不可。
         - insertable=true: 新規作成時にも設定される。
         - 更新可能（updatableの指定なし、デフォルトtrue）。
  > このエンティティの特徴と注意点:
  >
  > - パスワードはハッシュ化されて保存される（平文ではない）。
- ロールは'user'と'admin'のみ許可（チェック制約）。
- 作成日時は自動設定されるが、更新日時には自動設定のアノテーションが付いていない。更新日時を自動的に更新するためには、@UpdateTimestamp を付けるか、サービス層で手動で更新する必要がある。
- 更新ユーザー（updateUser）は、誰が更新したかを記録するためのフィールド。この値を設定するロジックはサービス層などで実装する必要がある。
  > 例: 更新日時を自動記録するには、updateDate フィールドに@UpdateTimestamp を追加することを推奨。
  > 修正例:

```java
@Column(name = "update_date", nullable = false)
@UpdateTimestamp
private LocalDateTime updateDate;
```

> また、updateUser フィールドは、現在のユーザー（認証情報から取得）をセットする必要があるため、サービス層やリスナーなどで設定する必要があります。

## User エンティティクラスの分析

### クラスの役割

User クラスは **アプリケーションのユーザー情報を表す JPA エンティティ** で、データベースの"users"テーブルにマッピングされます。主に以下の役割を担います：

1. ユーザーアカウント情報の永続化
2. 認証情報（メールアドレス/パスワードハッシュ）の管理
3. ユーザー権限（ロール）の管理
4. 監査情報（作成/更新日時、更新者）の保持

---

### フィールドとアノテーションの詳細分析

#### 1. 主キー

```java
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
@Column(name = "id")
private Long id;
```

- **役割**: 一意識別子
- **戦略**: 自動インクリメント（データベース依存）
- **マッピング**: "id"カラム

#### 2. 認証情報

```java
@Column(name = "email", nullable = false, unique = true)
private String email;

@Column(name = "password_hash", nullable = false)
private String passwordHash;
```

- **制約**:
  - email: 必須・ユニーク
  - passwordHash: 必須（ハッシュ化済みパスワード）
- **セキュリティ**: パスワードは平文ではなくハッシュで保存

#### 3. 基本情報

```java
@Column(name = "name")
private String name;

@Column(name = "role", nullable = false,
        columnDefinition = "TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'))")
private String role;
```

- **特徴**:
  - name: オプション（null 可）
  - role:
    - デフォルト値: 'user'
    - チェック制約: 'user' または 'admin' のみ許可
    - 必須項目

#### 4. 監査情報

```java
@Column(name = "create_date", nullable = false, updatable = false, insertable = true)
@CreationTimestamp
private LocalDateTime createDate;

@Column(name = "update_date", nullable = false, insertable = true)
private LocalDateTime updateDate;

@Column(name = "update_user", nullable = false, insertable = true)
private String updateUser;
```

- **自動設定**:
  - createDate: 作成時に現在日時が自動設定（`@CreationTimestamp`）
- **手動設定が必要**:
  - updateDate: 更新日時（自動設定されない）
  - updateUser: 更新者（ビジネスロジックで設定必要）
- **制約**: 全て必須項目

---

### クラスの特徴

#### 1. Lombok による効率化

```java
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
```

- **機能**:
  - `@Data`: getter/setter/toString/equals/hashCode 自動生成
  - `@NoArgsConstructor`: デフォルトコンストラクタ
  - `@AllArgsConstructor`: 全フィールドコンストラクタ
  - `@Builder`: ビルダーパターンサポート

#### 2. データベース制約

- **DDL 自動生成**:
  ```sql
  CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
    create_date TIMESTAMP NOT NULL,
    update_date TIMESTAMP NOT NULL,
    update_user VARCHAR(255) NOT NULL
  );
  ```

#### 3. 監査情報の設計思想

- **不変情報**: createDate（作成日時）は更新不可
- **可変情報**: updateDate/updateUser は更新可能
- **実装漏れ**: updateDate に `@UpdateTimestamp` が不足

---

### 改善提案

#### 1. 更新日時の自動化

```java
@UpdateTimestamp // 追加推奨
private LocalDateTime updateDate;
```

#### 2. ロールの列挙型化

```java
@Enumerated(EnumType.STRING)
@Column(name = "role", nullable = false, columnDefinition = "TEXT DEFAULT 'USER'")
private UserRole role; // enum UserRole { USER, ADMIN }
```

#### 3. 監査情報の基底クラス化

```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class Auditable {
    @CreatedDate
    private LocalDateTime createdDate;

    @LastModifiedDate
    private LocalDateTime lastModifiedDate;

    @LastModifiedBy
    private String lastModifiedBy;
}

@Entity
public class User extends Auditable { ... }
```

#### 4. パスワードセキュリティ強化

```java
@Convert(converter = PasswordEncryptConverter.class)
private String passwordHash;
```

### エンティティ使用例

```java
// ユーザー作成例
User user = User.builder()
    .email("user@example.com")
    .passwordHash(encoder.encode("password"))
    .name("John Doe")
    .role("admin")
    .updateUser("system")
    .build();
```

この User エンティティは、ユーザー管理システムの中核を担い、認証・認可・監査の基本要件を満たす設計となっています。
