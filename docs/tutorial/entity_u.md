<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">Entity クラスの実装</span>

## 完成版

`src/main/java/com/example/orgchart_api/domain/User.java`

```java
package com.example.orgchart_api.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class User {
    private Long userId;
    private String companyCd;
    private String employeeCd;
    private String userNm;
    private String userNmKana;
    private String mailAddress;
    private String passwordHash;
    private String passwordSalt;
    private String pin;
    private LocalDate birthday;
    private Integer voiceMailProfileId;
    private Integer pickupGroupId;
    private boolean deleted = false; // デフォルト値 false
    private LocalDateTime createDate; // テーブル定義に合わせた名前に修正
    private LocalDateTime updateDate;
    private String updateUser = "BATCH"; // デフォルト値 "BATCH"

    // パスワード更新メソッド
    public void updatePassword(String rawPassword, PasswordEncoder passwordEncoder) {
        this.passwordSalt = UUID.randomUUID().toString().replace("-", "");
        this.passwordHash = passwordEncoder.encode(rawPassword + this.passwordSalt);
        this.updateDate = LocalDateTime.now();
        this.updateUser = "SYSTEM";
    }

    // 新規作成時の初期化メソッド
    public void initializeForCreate() {
        this.deleted = false;
        this.createDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
        this.updateUser = "SYSTEM"; // 初期登録時はSYSTEM
    }

    // 更新時の初期化メソッド
    public void prepareForUpdate() {
        this.updateDate = LocalDateTime.now();
    }
}
```

## 実装の流れ

### スキーマ

```sql
-- ユーザートランザクションテーブル（重要修正）
CREATE TABLE public.trn_user (
    user_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    user_nm VARCHAR(40) NOT NULL,
    user_nm_kana VARCHAR(80) NOT NULL,
    mail_address VARCHAR(256) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    -- 設計書要件: パスワードソルト追加
    password_salt VARCHAR(32) NOT NULL,
    -- 設計書要件: PIN桁数拡張(5→8桁)
    pin VARCHAR(8) NOT NULL,
    -- 設計書要件: 生年月日をDATE型に変更
    birthday DATE NOT NULL,
    voice_mail_profile_id INTEGER REFERENCES public.mst_cucm_voice_mail_profile(voice_mail_profile_id),
    pickup_group_id INTEGER REFERENCES public.mst_cucm_pickup_group(pickup_group_id),
    -- 設計書要件: 論理削除フラグ追加
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_user_company_cd_employee_cd_key
        UNIQUE (company_cd, employee_cd),
    CONSTRAINT trn_user_mail_address_key
        UNIQUE (mail_address)
);
```

### 初期実装

`src/main/java/com/example/orgchart_api/domain/User.java`

```java
package com.example.orgchart_api.domain;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;
public class User {
    private Long userId;
    private String companyCd;
    private String employeeCd;
    private String userNm;
    private String userNmKana;
    private String mailAddress;
    private String passwordHash;
    private String passwordSalt;
    private String pin;
    private LocalDate birthday;
    private Long voiceMailProfileId;
    private Long pickupGroupId;
    private boolean deleted = false;
    private LocalDateTime createdDate;
    private LocalDateTime updateDate;
    private String updateUser = "BATCH";

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCompanyCd() {
        return companyCd;
    }

    public void setCompanyCd(String companyCd) {
        this.companyCd = companyCd;
    }

    public String getEmployeeCd() {
        return employeeCd;
    }

    public void setEmployeeCd(String employeeCd) {
        this.employeeCd = employeeCd;
    }

    public String getUserNm() {
        return userNm;
    }

    public void setUserNm(String userNm) {
        this.userNm = userNm;
    }

    public String getUserNmKana() {
        return userNmKana;
    }

    public void setUserNmKana(String userNmKana) {
        this.userNmKana = userNmKana;
    }

    public String getMailAddress() {
        return mailAddress;
    }

    public void setMailAddress(String mailAddress) {
        this.mailAddress = mailAddress;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPasswordSalt() {
        return passwordSalt;
    }

    public void setPasswordSalt(String passwordSalt) {
        this.passwordSalt = passwordSalt;
    }

    public String getPin() {
        return pin;
    }

    public void setPin(String pin) {
        this.pin = pin;
    }

    public LocalDate getBirthday() {
        return birthday;
    }

    public void setBirthday(LocalDate birthday) {
        this.birthday = birthday;
    }

    public Long getVoiceMailProfileId() {
        return voiceMailProfileId;
    }

    public void setVoiceMailProfileId(Long voiceMailProfileId) {
        this.voiceMailProfileId = voiceMailProfileId;
    }

    public Long getPickupGroupId() {
        return pickupGroupId;
    }

    public void setPickupGroupId(Long pickupGroupId) {
        this.pickupGroupId = pickupGroupId;
    }

    public boolean isDeleted() {
        return deleted;
    }

    public void setDeleted(boolean deleted) {
        this.deleted = deleted;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getUpdateDate() {
        return updateDate;
    }

    public void setUpdateDate(LocalDateTime updateDate) {
        this.updateDate = updateDate;
    }

    public String getUpdateUser() {
        return updateUser;
    }

    public void setUpdateUser(String updateUser) {
        this.updateUser = updateUser;
    }

    // パスワード更新メソッド
    public void updatePassword(String rawPassword, PasswordEncoder passwordEncoder) {
        this.passwordSalt = UUID.randomUUID().toString();
        this.passwordHash = passwordEncoder.encode(rawPassword + this.passwordSalt);
        this.updateDate = LocalDateTime.now();
        this.updateUser = "SYSTEM";
    }

}

```

#### 已深度思考

````
ーブル定義とエンティティクラスを比較して、以下の点を確認します。

1. フィールド名と型の一致
2. 制約（NOT NULLなど）の反映
3. デフォルト値の設定
4. その他の要件（一意制約など）はエンティティではアノテーションで表現されていたが、JPAを使用しないため削除されているか

### 比較結果

| テーブルカラム           | エンティティフィールド        | 型               | 一致 | 備考                                                                 |
|--------------------------|-----------------------------|------------------|------|----------------------------------------------------------------------|
| user_id                  | userId                     | Long             | ○   |                                                                      |
| company_cd               | companyCd                  | String           | ○   |                                                                      |
| employee_cd              | employeeCd                 | String           | ○   |                                                                      |
| user_nm                  | userNm                     | String           | ○   |                                                                      |
| user_nm_kana             | userNmKana                 | String           | ○   |                                                                      |
| mail_address             | mailAddress                | String           | ○   |                                                                      |
| password_hash            | passwordHash               | String           | ○   |                                                                      |
| password_salt            | passwordSalt               | String           | ○   |                                                                      |
| pin                      | pin                        | String           | ○   | テーブルはVARCHAR(8)、エンティティはStringで桁数制限はないが問題ない |
| birthday                 | birthday                   | LocalDate        | ○   |                                                                      |
| voice_mail_profile_id    | voiceMailProfileId         | Long             | ○   |                                                                      |
| pickup_group_id          | pickupGroupId              | Long             | ○   |                                                                      |
| deleted                  | deleted                    | boolean          | ○   | デフォルト値はエンティティで`false`に設定                            |
| create_date              | createdDate                | LocalDateTime    | △   | **フィールド名が異なる**（create_date → createdDate）               |
| update_date              | updateDate                 | LocalDateTime    | ○   |                                                                      |
| update_user              | updateUser                 | String           | ○   | デフォルト値はエンティティで`"BATCH"`に設定                         |

### 問題点

1. **フィールド名の不一致（create_date）**:
  - テーブル: `create_date`
  - エンティティ: `createdDate`
  - MyBatisはデフォルトでフィールド名をスネークケース（created_date）として解釈しますが、フィールド名が`createdDate`であるため、マッピング時に問題が生じる可能性があります。
    - 対策: MyBatisの`@Column`アノテーションやXMLマッピングで明示的に指定するか、フィールド名を`createDate`（テーブルカラムは`create_date`）に変更することで、マッピング規約に従わせる。

2. **デフォルト値の設定場所**:
  - エンティティでデフォルト値を設定していますが、これはインスタンス生成時の初期値です。データベースのデフォルト値（DEFAULT CURRENT_TIMESTAMPなど）とは別物です。
  - 登録時にエンティティで明示的に値を設定しない場合、データベースのデフォルト値が適用されます。しかし、エンティティ側でもデフォルト値を設定しておくことは、アプリケーション内での利用時に便利です。

3. **パスワード更新メソッド**:
  - `updatePassword`メソッドで`updateDate`と`updateUser`を更新しています。これはビジネスロジックとして適切です。

### エンティティクラスの修正提案

1. `createdDate` → `createDate` にリネームして、テーブルの`create_date`と規約上マッピングされるようにする。

2. デフォルト値の設定をコンストラクタやビルダーで行うようにします。Lombokを使用しているので、`@Builder.Default`を利用できます。

### 修正後のエンティティ例

```java
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
@Builder
public class User {
   private Long userId;
   private String companyCd;
   private String employeeCd;
   private String userNm;
   private String userNmKana;
   private String mailAddress;
   private String passwordHash;
   private String passwordSalt;
   private String pin;
   private LocalDate birthday;
   private Long voiceMailProfileId;
   private Long pickupGroupId;
   @Builder.Default
   private boolean deleted = false;
   private LocalDateTime createDate;  // フィールド名を変更
   private LocalDateTime updateDate;
   @Builder.Default
   private String updateUser = "BATCH";

   // パスワード更新メソッド
   public void updatePassword(String rawPassword, PasswordEncoder passwordEncoder) {
       this.passwordSalt = UUID.randomUUID().toString();
       this.passwordHash = passwordEncoder.encode(rawPassword + this.passwordSalt);
       this.updateDate = LocalDateTime.now();
       this.updateUser = "SYSTEM";
   }
}
````

### MyBatis マッピングにおける注意点

1. **フィールド名とカラム名のマッピング**:

   - 特にスネークケースとキャメルケースの変換がデフォルトで行われるため、上記のように`createDate`とすれば`create_date`にマッピングされます。
   - 明示的に指定したい場合は、XML マッピングで`<result>`プロパティを設定するか、`@Column`アノテーション（MyBatis のもの）を使用します。

2. **日付のデフォルト値**:
   - `createDate`と`updateDate`は、データベースで`DEFAULT CURRENT_TIMESTAMP`が設定されていますが、エンティティで明示的に値を設定しない場合、データベースがデフォルト値を設定します。
   - 登録時にはエンティティで`createDate`と`updateDate`を設定せず、データベース任せにすることも可能です。その場合、INSERT 後に再取得する必要があります。
   - アプリケーション側で現在時刻を設定したい場合は、サービス層でエンティティのフィールドに`LocalDateTime.now()`をセットします。

### 補足: 更新日時と更新者の設定

- 更新操作のたびに`updatePassword`メソッド以外でも`updateDate`と`updateUser`を更新する必要があります。サービスの更新メソッド内で設定するようにしましょう。

### 結論

フィールド名を修正し、デフォルト値を適切に設定したことで、テーブル定義とエンティティクラスは整合性が取れています。MyBatis のマッピング規約（フィールド名のキャメルケースをスネークケースに自動変換）に従うので、特に問題はありません。

````

## テーブル定義とエンティティクラスの比較

テーブル定義とエンティティクラスを比較し、改善が必要な点を指摘します。基本的な構造は合っていますが、いくつかの重要な修正が必要です。

### 修正が必要な点

1. **フィールド名の不一致**
   - テーブル: `create_date` → エンティティ: `createdDate` (末尾の "d" が余分)
   - MyBatisのデフォルト命名規則はキャメルケース→スネークケース変換なので、この不一致がマッピングエラーの原因になります

2. **デフォルト値の欠如**
   - 以下のフィールドにデフォルト値設定ロジックが不足:
     - `deleted` (default: false)
     - `create_date` (default: CURRENT_TIMESTAMP)
     - `update_date` (default: CURRENT_TIMESTAMP)
     - `update_user` (default: 'BATCH')

3. **ビジネスロジックの不整合**
   - `updatePassword()` メソッドが `createdDate` を更新していない

4. **日付型の取り扱い**
   - テーブル: `TIMESTAMP WITHOUT TIME ZONE` → エンティティ: `LocalDateTime` で適切

### 修正後のエンティティクラス

```java
package com.example.orgchart_api.domain;

import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class User {
    private Long userId;
    private String companyCd;
    private String employeeCd;
    private String userNm;
    private String userNmKana;
    private String mailAddress;
    private String passwordHash;
    private String passwordSalt;
    private String pin;
    private LocalDate birthday;
    private Long voiceMailProfileId;
    private Long pickupGroupId;
    private boolean deleted = false; // デフォルト値 false
    private LocalDateTime createDate; // テーブル定義に合わせた名前に修正
    private LocalDateTime updateDate;
    private String updateUser = "BATCH"; // デフォルト値 "BATCH"

    // パスワード更新メソッド
    public void updatePassword(String rawPassword, PasswordEncoder passwordEncoder) {
        this.passwordSalt = UUID.randomUUID().toString();
        this.passwordHash = passwordEncoder.encode(rawPassword + this.passwordSalt);
        this.updateDate = LocalDateTime.now(); // 更新日時を現在時刻に
        this.updateUser = "SYSTEM"; // 更新ユーザーをSYSTEMに
    }

    // 新規作成時の初期化メソッド
    public void initializeForCreate() {
        this.deleted = false;
        this.createDate = LocalDateTime.now();
        this.updateDate = LocalDateTime.now();
        this.updateUser = "SYSTEM"; // 初期登録時はSYSTEM
    }

    // 更新時の初期化メソッド
    public void prepareForUpdate() {
        this.updateDate = LocalDateTime.now();
    }
}
````

### 改善点の詳細説明

1. **フィールド名の修正**

   - `createdDate` → `createDate` に変更（テーブルの `create_date` に対応）

2. **デフォルト値の設定**

   - フィールド宣言時にデフォルト値を直接設定

   ```java
   private boolean deleted = false;
   private String updateUser = "BATCH";
   ```

3. **ライフサイクルメソッドの追加**

   - 新規作成用メソッド: `initializeForCreate()`

   ```java
   public void initializeForCreate() {
       this.deleted = false;
       this.createDate = LocalDateTime.now();
       this.updateDate = LocalDateTime.now();
       this.updateUser = "SYSTEM";
   }
   ```

   - 更新用メソッド: `prepareForUpdate()`

   ```java
   public void prepareForUpdate() {
       this.updateDate = LocalDateTime.now();
   }
   ```

4. **パスワード更新メソッドの改善**
   - 更新日時と更新ユーザーを確実に設定
   ```java
   public void updatePassword(String rawPassword, PasswordEncoder passwordEncoder) {
       // ...既存の処理
       this.updateDate = LocalDateTime.now(); // 更新日時を設定
       this.updateUser = "SYSTEM"; // 更新ユーザーを設定
   }
   ```

### サービスクラスでの使用例

```java
public UserDto createUser(UserDto userDto) {
    // エンティティの作成
    User user = new User();
    user.setCompanyCd(userDto.getCompanyCd());
    // ...その他のプロパティ設定

    // 新規作成の初期化
    user.initializeForCreate();

    // パスワード設定
    user.updatePassword(userDto.getPassword(), passwordEncoder);

    // DB登録
    userMapper.insert(user);

    return convertToDto(user);
}

public UserDto updateUser(Long userId, UserDto userDto) {
    User user = userMapper.findById(userId);

    // プロパティ更新
    user.setUserNm(userDto.getUserNm());
    // ...その他のプロパティ更新

    // 更新準備
    user.prepareForUpdate();

    // 必要に応じてパスワード更新
    if (userDto.getPassword() != null) {
        user.updatePassword(userDto.getPassword(), passwordEncoder);
    }

    userMapper.update(user);
    return convertToDto(user);
}
```

### MyBatis マッピングのポイント

`UserMapper.xml` で正しくマッピングするために、以下の点に注意してください：

```xml
<resultMap id="userResultMap" type="com.example.orgchart_api.domain.User">
    <id property="userId" column="user_id"/>
    <result property="companyCd" column="company_cd"/>
    <result property="employeeCd" column="employee_cd"/>
    <result property="userNm" column="user_nm"/>
    <!-- 特に注意 -->
    <result property="createDate" column="create_date"/>
    <result property="updateDate" column="update_date"/>
    <result property="updateUser" column="update_user"/>
    <!-- 他のプロパティ -->
</resultMap>
```

### 対応するテーブル定義との整合性

| テーブルカラム        | エンティティプロパティ | 型            | デフォルト値             |
| --------------------- | ---------------------- | ------------- | ------------------------ |
| user_id               | userId                 | Long          | -                        |
| company_cd            | companyCd              | String        | -                        |
| employee_cd           | employeeCd             | String        | -                        |
| user_nm               | userNm                 | String        | -                        |
| user_nm_kana          | userNmKana             | String        | -                        |
| mail_address          | mailAddress            | String        | -                        |
| password_hash         | passwordHash           | String        | -                        |
| password_salt         | passwordSalt           | String        | -                        |
| pin                   | pin                    | String        | -                        |
| birthday              | birthday               | LocalDate     | -                        |
| voice_mail_profile_id | voiceMailProfileId     | Long          | -                        |
| pickup_group_id       | pickupGroupId          | Long          | -                        |
| deleted               | deleted                | boolean       | false (エンティティ側)   |
| create_date           | createDate             | LocalDateTime | 現在日時 (メソッド経由)  |
| update_date           | updateDate             | LocalDateTime | 現在日時 (メソッド経由)  |
| update_user           | updateUser             | String        | "BATCH" (エンティティ側) |

この修正により、テーブル定義とエンティティクラスが正しく対応し、ビジネスロジック内でオブジェクトのライフサイクルを適切に管理できます。
