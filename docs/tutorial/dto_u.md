<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserDto クラスの実装</span>

## 完成版

`src/main/java/com/example/orgchart_api/dto/UserDto.java`

```java
package com.example.orgchart_api.dto;

import com.example.orgchart_api.domain.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.context.annotation.Profile;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class UserDto {
    // === 基本情報 ===
    private Long userId;

    @NotBlank(message = "企業コードは必須です")
    @Size(max = 3, message = "企業コードは3文字以内で入力してください") // テーブル定義に合わせて3文字に修正
    private String companyCd;

    @NotBlank(message = "従業員コードは必須です")
    @Size(max = 7, message = "従業員コードは7文字以内で入力してください") // テーブル定義に合わせて7文字に修正
    private String employeeCd;

    // === 個人情報 ===
    @NotBlank(message = "ユーザー名は必須です")
    @Size(max = 40, message = "ユーザー名は40文字以内で入力してください") // テーブル定義に合わせて40文字に修正
    private String userNm;

    @Size(max = 80, message = "ユーザー名（カナ）は80文字以内で入力してください") // テーブル定義に合わせて80文字に修正
    private String userNmKana;

    @NotBlank(message = "メールアドレスは必須です") // 追加: テーブル定義でNOT NULL
    @Email(message = "有効なメールアドレスを入力してください")
    @Size(max = 256, message = "メールアドレスは256文字以内で入力してください") // テーブル定義に合わせて256文字に修正
    private String mailAddress;

    // === 認証情報 ===
    @Size(min = 8, max = 30, message = "パスワードは8～30文字で入力してください")
    private String password; // リクエスト時のみ使用（生パスワード）

    // 注意: パスワードハッシュとソルトはDTOで扱わない（セキュリティ上、クライアントに返さない）

    @NotBlank(message = "PINは必須です") // 追加: テーブル定義でNOT NULL
    @Size(min = 4, max = 8, message = "PINは4～8桁で入力してください") // 8桁まで許容
    private String pin;

    @NotNull(message = "生年月日は必須です") // 追加: テーブル定義でNOT NULL
    @Past(message = "生年月日は過去の日付を入力してください")
    private LocalDate birthday;

    // === システム情報 ===
    private Integer voiceMailProfileId;
    private Integer pickupGroupId;
    private Boolean deleted;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private String updateUser;

    // === 変換メソッド ===

    /**
     * DTO → Entity 変換（新規作成用）
     * @param passwordEncoder パスワードエンコーダ
     * @return Userエンティティ
     */
    public User toEntity(PasswordEncoder passwordEncoder) {
        User entity = new User();
        entity.setUserId(this.userId);
        entity.setCompanyCd(this.companyCd);
        entity.setEmployeeCd(this.employeeCd);
        entity.setUserNm(this.userNm);
        entity.setUserNmKana(this.userNmKana);
        entity.setMailAddress(this.mailAddress);
        entity.setPin(this.pin);
        entity.setBirthday(this.birthday);
        entity.setVoiceMailProfileId(this.voiceMailProfileId);
        entity.setPickupGroupId(this.pickupGroupId);
        entity.setDeleted(this.deleted != null ? this.deleted : false);

        // パスワードが設定されている場合のみハッシュ化
        if (this.password != null) {
            entity.updatePassword(this.password, passwordEncoder);
        }

        return entity;
    }

    /**
     * DTO → Entity 変換（更新用）
     * @param existingEntity 既存のエンティティ
     * @param passwordEncoder パスワードエンコーダ
     */
    public void updateEntity(User existingEntity, PasswordEncoder passwordEncoder) {
        if (this.userNm != null) existingEntity.setUserNm(this.userNm);
        if (this.userNmKana != null) existingEntity.setUserNmKana(this.userNmKana);
        if (this.mailAddress != null) existingEntity.setMailAddress(this.mailAddress);
        if (this.pin != null) existingEntity.setPin(this.pin);
        if (this.birthday != null) existingEntity.setBirthday(this.birthday);
        if (this.voiceMailProfileId != null) existingEntity.setVoiceMailProfileId(this.voiceMailProfileId);
        if (this.pickupGroupId != null) existingEntity.setPickupGroupId(this.pickupGroupId);
        if (this.deleted != null) existingEntity.setDeleted(this.deleted);

        // パスワードが設定されている場合のみ更新
        if (this.password != null) {
            existingEntity.updatePassword(this.password, passwordEncoder);
        }
    }

    /**
     * Entity → DTO 変換
     * @param entity ユーザーエンティティ
     * @return UserDto
     */
    public static UserDto fromEntity(User entity) {
        UserDto dto = new UserDto();
        dto.setUserId(entity.getUserId());
        dto.setCompanyCd(entity.getCompanyCd());
        dto.setEmployeeCd(entity.getEmployeeCd());
        dto.setUserNm(entity.getUserNm());
        dto.setUserNmKana(entity.getUserNmKana());
        dto.setMailAddress(entity.getMailAddress());
        // パスワード関連は設定しない（セキュリティのため）
        dto.setPin(entity.getPin());
        dto.setBirthday(entity.getBirthday());
        dto.setVoiceMailProfileId(entity.getVoiceMailProfileId());
        dto.setPickupGroupId(entity.getPickupGroupId());
        dto.setDeleted(entity.isDeleted());
        dto.setCreateDate(entity.getCreateDate());
        dto.setUpdateDate(entity.getUpdateDate());
        dto.setUpdateUser(entity.getUpdateUser());
        return dto;
    }

    // テスト専用メソッド
    @Profile("test")
    public static UserDto fromEntityWithPassword(User entity) {
        UserDto dto = fromEntity(entity);
        dto.setPassword(entity.getPasswordHash());
        return dto;
    }
}
```

## 実装の流れ

```java
package com.example.orgchart_api.dto;

import lombok.Getter;
import lombok.Setter;
import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * ユーザー情報のデータ転送オブジェクト（DTO）
 * - APIリクエスト/レスポンス専用
 * - ビルダーパターン不使用
 */
@Getter
@Setter
public class UserDto {
    // === 基本情報 ===
    private Long userId;

    @NotBlank(message = "企業コードは必須です")
    @Size(max = 10, message = "企業コードは10文字以内で入力してください")
    private String companyCd;

    @NotBlank(message = "従業員コードは必須です")
    @Size(max = 20, message = "従業員コードは20文字以内で入力してください")
    private String employeeCd;

    // === 個人情報 ===
    @NotBlank(message = "ユーザー名は必須です")
    @Size(max = 50, message = "ユーザー名は50文字以内で入力してください")
    private String userNm;

    @Size(max = 100, message = "ユーザー名（カナ）は100文字以内で入力してください")
    private String userNmKana;

    @Email(message = "有効なメールアドレスを入力してください")
    @Size(max = 255, message = "メールアドレスは255文字以内で入力してください")
    private String mailAddress;

    // === 認証情報 ===
    @Size(min = 8, max = 30, message = "パスワードは8～30文字で入力してください")
    private String password; // リクエスト時のみ使用

    @Size(min = 4, max = 6, message = "PINは4～6桁の数字で入力してください")
    private String pin;

    @Past(message = "生年月日は過去の日付を入力してください")
    private LocalDate birthday;

    // === システム情報 ===
    private Long voiceMailProfileId;
    private Long pickupGroupId;
    private Boolean deleted;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private String updateUser;

    // === 変換メソッド ===
    /**
     * DTO → Entity 変換
     */
    public User toEntity() {
        User entity = new User();
        entity.setUserId(this.userId);
        entity.setCompanyCd(this.companyCd);
        entity.setEmployeeCd(this.employeeCd);
        entity.setUserNm(this.userNm);
        entity.setUserNmKana(this.userNmKana);
        entity.setMailAddress(this.mailAddress);
        entity.setPin(this.pin);
        entity.setBirthday(this.birthday);
        entity.setVoiceMailProfileId(this.voiceMailProfileId);
        entity.setPickupGroupId(this.pickupGroupId);
        return entity;
    }

    /**
     * Entity → DTO 変換
     */
    public static UserDto fromEntity(User entity) {
        UserDto dto = new UserDto();
        dto.setUserId(entity.getUserId());
        dto.setCompanyCd(entity.getCompanyCd());
        dto.setEmployeeCd(entity.getEmployeeCd());
        dto.setUserNm(entity.getUserNm());
        dto.setUserNmKana(entity.getUserNmKana());
        dto.setMailAddress(entity.getMailAddress());
        dto.setPin(entity.getPin());
        dto.setBirthday(entity.getBirthday());
        dto.setVoiceMailProfileId(entity.getVoiceMailProfileId());
        dto.setPickupGroupId(entity.getPickupGroupId());
        dto.setDeleted(entity.isDeleted());
        dto.setCreateDate(entity.getCreateDate());
        dto.setUpdateDate(entity.getUpdateDate());
        dto.setUpdateUser(entity.getUpdateUser());
        return dto;
    }
}

```

#### 已深度思考

````
されたサービスクラスの使用例（UserServiceImpl）と、テーブル定義、Userエンティティを考慮して、UserDtoの実装を評価します。

### 現状のUserDto実装の問題点

1. **パスワード関連フィールドの欠落**
  - エンティティには`passwordHash`と`passwordSalt`があるが、DTOには`password`（生パスワード）のみ存在
  - ハッシュ化されたパスワードやソルトをクライアントに返すべきではない（セキュリティリスク）

2. **変換ロジックの不備**
  - `toEntity()`メソッドでパスワード関連フィールドを設定していない
  - `fromEntity()`メソッドでパスワード関連フィールドを除外している（正しい）

3. **バリデーションの抜け**
  - PINの桁数バリデーションが4～6桁だが、テーブル定義ではVARCHAR(8) → 最大8桁まで許容
  - 生年月日の`@Past`制約は正しいが、NULL許容かどうかテーブル定義と一致しているか注意

4. **削除フラグの型**
  - DTOの`deleted`が`Boolean`（ラッパー型）→ エンティティは`boolean`（プリミティブ型）
  - NULLが入る可能性があり、変換時にNPEが発生するリスク

### 改善提案

#### 1. パスワード関連フィールドの扱い
- **DTOの変更点**:
 ```java
 // リクエスト用の生パスワード（登録・更新時にのみ使用）
 @Size(min = 8, max = 30, message = "パスワードは8～30文字で入力してください")
 private String password;

 // レスポンスでは絶対に返さない（DTOから削除不要）
 // エンティティ変換時にのみ使用
````

- **エンティティ変換時の対応**:

  ```java
  public User toEntity(PasswordEncoder passwordEncoder) {
      User entity = new User();
      // ...他のフィールド設定

      // パスワードが設定されている場合のみハッシュ化
      if (this.password != null) {
          entity.updatePassword(this.password, passwordEncoder);
      }
      return entity;
  }
  ```

#### 2. PIN のバリデーション修正

```java
@Size(min = 4, max = 8, message = "PINは4～8桁で入力してください") // 最大8桁に変更
private String pin;
```

#### 3. 削除フラグの型統一

```java
// DTO側をプリミティブ型に変更（デフォルトfalse）
private boolean deleted = false;
```

#### 4. 変換メソッドの強化

- パスワードエンコーダーの依存性解決のため、`toEntity`メソッドに引数を追加

### 修正後の UserDto

```java
package com.example.orgchart_api.dto;

import com.example.orgchart_api.domain.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class UserDto {

    // === 基本情報 ===
    private Long userId;

    @NotBlank(message = "企業コードは必須です")
    @Size(max = 10, message = "企業コードは10文字以内で入力してください")
    private String companyCd;

    @NotBlank(message = "従業員コードは必須です")
    @Size(max = 20, message = "従業員コードは20文字以内で入力してください")
    private String employeeCd;

    // === 個人情報 ===
    @NotBlank(message = "ユーザー名は必須です")
    @Size(max = 50, message = "ユーザー名は50文字以内で入力してください")
    private String userNm;

    @Size(max = 100, message = "ユーザー名（カナ）は100文字以内で入力してください")
    private String userNmKana;

    @Email(message = "有効なメールアドレスを入力してください")
    @Size(max = 255, message = "メールアドレスは255文字以内で入力してください")
    private String mailAddress;

    // === 認証情報 ===
    @Size(min = 8, max = 30, message = "パスワードは8～30文字で入力してください")
    private String password; // リクエスト時のみ使用（登録・更新用）

    @Size(min = 4, max = 8, message = "PINは4～8桁で入力してください")
    private String pin;

    @Past(message = "生年月日は過去の日付を入力してください")
    private LocalDate birthday;

    // === システム情報 ===
    private Long voiceMailProfileId;
    private Long pickupGroupId;
    private boolean deleted = false; // プリミティブ型に変更
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private String updateUser;

    // === 変換メソッド ===

    /**
     * DTO → Entity 変換（パスワードエンコーダー必須）
     * @param passwordEncoder パスワードエンコーダー
     * @return Userエンティティ
     */
    public User toEntity(PasswordEncoder passwordEncoder) {
        User entity = new User();
        entity.setUserId(this.userId);
        entity.setCompanyCd(this.companyCd);
        entity.setEmployeeCd(this.employeeCd);
        entity.setUserNm(this.userNm);
        entity.setUserNmKana(this.userNmKana);
        entity.setMailAddress(this.mailAddress);
        entity.setPin(this.pin);
        entity.setBirthday(this.birthday);
        entity.setVoiceMailProfileId(this.voiceMailProfileId);
        entity.setPickupGroupId(this.pickupGroupId);
        entity.setDeleted(this.deleted);

        // パスワードが提供されている場合はハッシュ化
        if (this.password != null && !this.password.isEmpty()) {
            entity.updatePassword(this.password, passwordEncoder);
        }

        // 日付情報はDTOで設定しない（サービス層で処理）
        // 更新ユーザーもサービス層で設定

        return entity;
    }

    /**
     * Entity → DTO 変換
     * @param entity ユーザーエンティティ
     * @return UserDto
     */
    public static UserDto fromEntity(User entity) {
        UserDto dto = new UserDto();
        dto.setUserId(entity.getUserId());
        dto.setCompanyCd(entity.getCompanyCd());
        dto.setEmployeeCd(entity.getEmployeeCd());
        dto.setUserNm(entity.getUserNm());
        dto.setUserNmKana(entity.getUserNmKana());
        dto.setMailAddress(entity.getMailAddress());
        // パスワードは変換しない（セキュリティ上、DTOに設定しない）
        dto.setPin(entity.getPin());
        dto.setBirthday(entity.getBirthday());
        dto.setVoiceMailProfileId(entity.getVoiceMailProfileId());
        dto.setPickupGroupId(entity.getPickupGroupId());
        dto.setDeleted(entity.isDeleted());
        dto.setCreateDate(entity.getCreateDate());
        dto.setUpdateDate(entity.getUpdateDate());
        dto.setUpdateUser(entity.getUpdateUser());
        return dto;
    }
}
```

### サービスクラスでの使用例

```java
public UserDto createUser(UserDto userDto) {
    // DTO → エンティティ変換（パスワードエンコーダーを渡す）
    User user = userDto.toEntity(passwordEncoder);

    // 新規作成の初期化
    user.initializeForCreate();

    // 重複チェックロジックなど...

    // DB登録
    userMapper.insert(user);

    // 登録したユーザーを取得してDTOに変換
    return UserDto.fromEntity(user);
}

public UserDto updateUser(Long userId, UserDto userDto) {
    User existingUser = userMapper.findById(userId);

    // エンティティにプロパティを設定（部分更新対応）
    // 注意: パスワード更新は別途処理
    existingUser.setUserNm(userDto.getUserNm());
    // ... 他のフィールドも同様

    // パスワードがリクエストに含まれている場合
    if (userDto.getPassword() != null) {
        existingUser.updatePassword(userDto.getPassword(), passwordEncoder);
    }

    // 更新日時設定
    existingUser.prepareForUpdate();

    userMapper.update(existingUser);
    return UserDto.fromEntity(existingUser);
}
```

### 重要な注意点

1. **パスワードの取り扱い**

   - レスポンスでパスワード情報を絶対に返さない
   - ログなどにパスワードを出力しない

2. **部分更新の考慮**

   - 更新処理では、DTO のフィールドが null でない場合のみ更新するロジックを実装（パッチリクエスト対応）

3. **エラー処理**

   - 重複チェック（メールアドレス、社員コードなど）の実装を忘れずに

4. **トランザクション管理**
   - ユーザー登録や更新は`@Transactional`でトランザクション管理

````

## UserDtoの実装評価と改善提案

提供されたUserDtoクラスは基本的に良好ですが、サービスクラスとの連携やテーブル定義を考慮すると、以下の改善点があります。

### 主な改善点

1. **パスワード関連フィールドの取り扱い**
   - ハッシュ化されたパスワード（passwordHash）がDTOに含まれていない
   - ソルト（passwordSalt）の転送が必要ないことを明示

2. **変換メソッドの拡充**
   - パスワードハッシュの設定ロジック追加
   - 新規作成フラグによる初期化処理

3. **バリデーションの調整**
   - PINの桁数制限の修正（8桁まで許容）

### 改善後のUserDto実装

```java
package com.example.orgchart_api.dto;

import com.example.orgchart_api.domain.User;
import lombok.Getter;
import lombok.Setter;
import org.springframework.security.crypto.password.PasswordEncoder;

import jakarta.validation.constraints.*;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Getter
@Setter
public class UserDto {
    // === 基本情報 ===
    private Long userId;

    @NotBlank(message = "企業コードは必須です")
    @Size(max = 3, message = "企業コードは3文字以内で入力してください") // テーブル定義に合わせて3文字に修正
    private String companyCd;

    @NotBlank(message = "従業員コードは必須です")
    @Size(max = 7, message = "従業員コードは7文字以内で入力してください") // テーブル定義に合わせて7文字に修正
    private String employeeCd;

    // === 個人情報 ===
    @NotBlank(message = "ユーザー名は必須です")
    @Size(max = 40, message = "ユーザー名は40文字以内で入力してください") // テーブル定義に合わせて40文字に修正
    private String userNm;

    @Size(max = 80, message = "ユーザー名（カナ）は80文字以内で入力してください") // テーブル定義に合わせて80文字に修正
    private String userNmKana;

    @NotBlank(message = "メールアドレスは必須です") // 追加: テーブル定義でNOT NULL
    @Email(message = "有効なメールアドレスを入力してください")
    @Size(max = 256, message = "メールアドレスは256文字以内で入力してください") // テーブル定義に合わせて256文字に修正
    private String mailAddress;

    // === 認証情報 ===
    @Size(min = 8, max = 30, message = "パスワードは8～30文字で入力してください")
    private String password; // リクエスト時のみ使用（生パスワード）

    // 注意: パスワードハッシュとソルトはDTOで扱わない（セキュリティ上、クライアントに返さない）

    @NotBlank(message = "PINは必須です") // 追加: テーブル定義でNOT NULL
    @Size(min = 4, max = 8, message = "PINは4～8桁で入力してください") // 8桁まで許容
    private String pin;

    @NotNull(message = "生年月日は必須です") // 追加: テーブル定義でNOT NULL
    @Past(message = "生年月日は過去の日付を入力してください")
    private LocalDate birthday;

    // === システム情報 ===
    private Long voiceMailProfileId;
    private Long pickupGroupId;
    private Boolean deleted;
    private LocalDateTime createDate;
    private LocalDateTime updateDate;
    private String updateUser;

    // === 変換メソッド ===

    /**
     * DTO → Entity 変換（新規作成用）
     * @param passwordEncoder パスワードエンコーダ
     * @return Userエンティティ
     */
    public User toEntity(PasswordEncoder passwordEncoder) {
        User entity = new User();
        entity.setUserId(this.userId);
        entity.setCompanyCd(this.companyCd);
        entity.setEmployeeCd(this.employeeCd);
        entity.setUserNm(this.userNm);
        entity.setUserNmKana(this.userNmKana);
        entity.setMailAddress(this.mailAddress);
        entity.setPin(this.pin);
        entity.setBirthday(this.birthday);
        entity.setVoiceMailProfileId(this.voiceMailProfileId);
        entity.setPickupGroupId(this.pickupGroupId);
        entity.setDeleted(this.deleted != null ? this.deleted : false);

        // パスワードが設定されている場合のみハッシュ化
        if (this.password != null) {
            entity.updatePassword(this.password, passwordEncoder);
        }

        return entity;
    }

    /**
     * DTO → Entity 変換（更新用）
     * @param existingEntity 既存のエンティティ
     * @param passwordEncoder パスワードエンコーダ
     */
    public void updateEntity(User existingEntity, PasswordEncoder passwordEncoder) {
        if (this.userNm != null) existingEntity.setUserNm(this.userNm);
        if (this.userNmKana != null) existingEntity.setUserNmKana(this.userNmKana);
        if (this.mailAddress != null) existingEntity.setMailAddress(this.mailAddress);
        if (this.pin != null) existingEntity.setPin(this.pin);
        if (this.birthday != null) existingEntity.setBirthday(this.birthday);
        if (this.voiceMailProfileId != null) existingEntity.setVoiceMailProfileId(this.voiceMailProfileId);
        if (this.pickupGroupId != null) existingEntity.setPickupGroupId(this.pickupGroupId);
        if (this.deleted != null) existingEntity.setDeleted(this.deleted);

        // パスワードが設定されている場合のみ更新
        if (this.password != null) {
            existingEntity.updatePassword(this.password, passwordEncoder);
        }
    }

    /**
     * Entity → DTO 変換
     * @param entity ユーザーエンティティ
     * @return UserDto
     */
    public static UserDto fromEntity(User entity) {
        UserDto dto = new UserDto();
        dto.setUserId(entity.getUserId());
        dto.setCompanyCd(entity.getCompanyCd());
        dto.setEmployeeCd(entity.getEmployeeCd());
        dto.setUserNm(entity.getUserNm());
        dto.setUserNmKana(entity.getUserNmKana());
        dto.setMailAddress(entity.getMailAddress());
        // パスワード関連は設定しない（セキュリティのため）
        dto.setPin(entity.getPin());
        dto.setBirthday(entity.getBirthday());
        dto.setVoiceMailProfileId(entity.getVoiceMailProfileId());
        dto.setPickupGroupId(entity.getPickupGroupId());
        dto.setDeleted(entity.isDeleted());
        dto.setCreateDate(entity.getCreateDate());
        dto.setUpdateDate(entity.getUpdateDate());
        dto.setUpdateUser(entity.getUpdateUser());
        return dto;
    }
}
````

### 主な改善内容

#### 1. バリデーションのテーブル定義への適合

```java
@Size(max = 3, message = "企業コードは3文字以内で入力してください")
private String companyCd;

@Size(max = 7, message = "従業員コードは7文字以内で入力してください")
private String employeeCd;

@Size(max = 40, message = "ユーザー名は40文字以内で入力してください")
private String userNm;

@Size(max = 80, message = "ユーザー名（カナ）は80文字以内で入力してください")
private String userNmKana;

@Size(max = 256, message = "メールアドレスは256文字以内で入力してください")
private String mailAddress;

@Size(min = 4, max = 8, message = "PINは4～8桁で入力してください")
private String pin;
```

#### 2. パスワードの安全な取り扱い

- DTO では生パスワードのみを一時的に保持
- エンティティ変換時にハッシュ化
- レスポンスではパスワード関連フィールドを返さない

#### 3. 柔軟な変換メソッドの追加

```java
// 新規作成用変換
public User toEntity(PasswordEncoder passwordEncoder) {
    // ...フィールドコピー
    if (this.password != null) {
        entity.updatePassword(this.password, passwordEncoder);
    }
}

// 更新用変換
public void updateEntity(User existingEntity, PasswordEncoder passwordEncoder) {
    // 変更があったフィールドのみ更新
    if (this.password != null) {
        existingEntity.updatePassword(this.password, passwordEncoder);
    }
}
```

### サービスクラスでの使用例（改善版）

```java
public UserDto createUser(UserDto userDto) {
    // DTO → エンティティ変換
    User user = userDto.toEntity(passwordEncoder);

    // 新規作成の初期化
    user.initializeForCreate();

    // 重複チェック
    if (userMapper.existsByCompanyAndEmployee(user.getCompanyCd(), user.getEmployeeCd())) {
        throw new DuplicateKeyException("社員番号が重複しています");
    }

    // DB登録
    userMapper.insert(user);

    // 登録したユーザーを取得してDTOに変換
    return UserDto.fromEntity(userMapper.findById(user.getUserId()));
}

public UserDto updateUser(Long userId, UserDto userDto) {
    // 既存ユーザー取得
    User existingUser = userMapper.findById(userId);

    // DTOで指定された変更をエンティティに適用
    userDto.updateEntity(existingUser, passwordEncoder);

    // 更新準備
    existingUser.prepareForUpdate();

    // DB更新
    userMapper.update(existingUser);

    // 更新後のユーザーを返却
    return UserDto.fromEntity(existingUser);
}
```

### 追加すべきロジック

1. **ユーザー存在チェックメソッド**
   `UserMapper` にユーザー存在チェックメソッドを追加:

   ```java
   public interface UserMapper {
       boolean existsByCompanyAndEmployee(String companyCd, String employeeCd);
       // 他のメソッド...
   }
   ```

2. **Mapper XML での実装**

   ```xml
   <select id="existsByCompanyAndEmployee" resultType="boolean">
       SELECT COUNT(*) > 0
       FROM trn_user
       WHERE company_cd = #{companyCd}
         AND employee_cd = #{employeeCd}
         AND deleted = false
   </select>
   ```

3. **一意制約のチェック**
   - メールアドレスの重複チェックも同様に実装
   - 更新時は自分自身を除外したチェックが必要

### セキュリティ上の注意点

1. **パスワードの取り扱い**

   - 絶対にログ出力しない
   - DTO で返さない
   - エンティティでもハッシュ化されたものを保持

2. **DTO の適切な使用**
   - 登録/更新用と参照用で同じ DTO を使用する場合、`@JsonIgnore`などを活用:
   ```java
   @JsonIgnore // レスポンスでは表示しない
   private String password;
   ```

この実装により、テーブル定義と DTO が適切に連携し、サービスクラスで安全かつ効率的にユーザー情報を扱えるようになります。
