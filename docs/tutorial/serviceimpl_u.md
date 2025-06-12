<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserServiceImpl 実現 クラスの実装</span>

## 完成版

`src/main/java/com/example/orgchart_api/service/impl/UserServiceImpl.java`

```java
package com.example.orgchart_api.service.impl;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import com.example.orgchart_api.mapper.UserMapper;
import com.example.orgchart_api.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        User user = userDto.toEntity(passwordEncoder);
        user.initializeForCreate();

        // 重複チェック（作成時は除外ユーザーIDなし）
        checkForDuplicates(user, null);

        userMapper.insert(user);
        return UserDto.fromEntity(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        return userMapper.findById(userId)
                .filter(u -> !u.isDeleted()) // 削除済みは除外
                .map(UserDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));
    }

    // メソッド名をインターフェースに合わせて修正
    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getActiveUsersByCompany(String companyCd) {
        return userMapper.findByCompanyCdAndNotDeleted(companyCd).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUser(Long userId, String updateUser) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));

        if (user.isDeleted()) {
            throw new ResourceNotFoundException("ユーザーは既に削除されています: " + userId);
        }

        user.setDeleted(true);
        user.setUpdateUser(updateUser);
        user.prepareForUpdate();
        userMapper.update(user);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long userId, UserDto userDto) {
        if (userDto.getUserId() == null || !userId.equals(userDto.getUserId())) {
            throw new IllegalArgumentException("ユーザーIDが不正です");
        }

        User existingUser = userMapper.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));

        if (existingUser.isDeleted()) {
            throw new ResourceNotFoundException("削除済みのユーザーは更新できません: " + userId);
        }

        // 重複チェック（更新対象のユーザーIDを除外）
        checkForDuplicates(userDto.toEntity(passwordEncoder), userId);

        userDto.updateEntity(existingUser, passwordEncoder);
        existingUser.prepareForUpdate();

        userMapper.update(existingUser);
        return UserDto.fromEntity(existingUser);
    }

    @Override
    @Transactional
    public void resetPassword(Long userId) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));

        if (user.isDeleted()) {
            throw new ResourceNotFoundException("削除済みのユーザーのパスワードはリセットできません: " + userId);
        }

        // ランダムパスワード生成（セキュリティ上の理由でクライアントには返さない）
        String temporaryPassword = UUID.randomUUID().toString().substring(0, 8);
        user.updatePassword(temporaryPassword, passwordEncoder);
        user.setUpdateUser("SYSTEM");
        user.prepareForUpdate();

        userMapper.update(user);

        // 実際のアプリケーションではここでメール送信などを行う
        // emailService.sendPasswordReset(user.getMailAddress(), temporaryPassword);
    }

    // 重複チェックヘルパーメソッド
    private void checkForDuplicates(User user, Long excludeUserId) {
        // メールアドレス重複チェック
        if (userMapper.existsByMailAddress(user.getMailAddress(), excludeUserId)) {
            throw new DuplicateResourceException("このメールアドレスは既に使用されています");
        }

        // 社員コード重複チェック
        if (userMapper.existsByCompanyCdAndEmployeeCd(
                user.getCompanyCd(),
                user.getEmployeeCd(),
                excludeUserId)) {

            throw new DuplicateResourceException("この企業コードと従業員コードの組み合わせは既に存在します");
        }
    }
}

```

## 実装の流れ

```java
package com.example.orgchart_api.service.impl;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.mapper.UserMapper;
import com.example.orgchart_api.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        User user = userDto.toEntity(passwordEncoder);
        user.initializeForCreate();

        if (userMapper.existsByMailAddress(user.getMailAddress())) {
            throw new IllegalArgumentException("このメールアドレスは既に使用されています");
        }

        if (userMapper.existsByCompanyCdAndEmployeeCd(user.getCompanyCd(), user.getEmployeeCd())) {
            throw new IllegalArgumentException("この企業コードと従業員コードの組み合わせは既に存在します");
        }

        userMapper.insert(user);
        return UserDto.fromEntity(user);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        return userMapper.findById(userId)
                .map(UserDto::fromEntity)
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getUsersByCompany(String companyCd) {
        return userMapper.findByCompanyCd(companyCd).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUser(Long userId, String updateUser) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません: " + userId));

        user.setDeleted(true);
        user.setUpdateUser(updateUser);
        user.prepareForUpdate();

        userMapper.update(user);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long userId, UserDto userDto) {
        if (userDto.getUserId() == null) {
            throw new IllegalArgumentException("ユーザーIDが指定されていません");
        }

        User existingUser = userMapper.findById(userDto.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません: " + userDto.getUserId()));

        userDto.updateEntity(existingUser, passwordEncoder);
        existingUser.prepareForUpdate();

        userMapper.update(existingUser);
        return UserDto.fromEntity(existingUser);
    }

    @Override
    @Transactional
    public UserDto resetPassword(Long userId) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("ユーザーが見つかりません: " + userId));

        // ランダムなパスワードを生成（例: UUIDの最初の8文字）
        String temporaryPassword = UUID.randomUUID().toString().substring(0, 8);
        user.updatePassword(temporaryPassword, passwordEncoder);
        user.setUpdateUser("SYSTEM");
        user.prepareForUpdate();

        userMapper.update(user);

        // リセット後のユーザー情報を返す（実際の運用ではパスワードはメール送信など別途処理）
        UserDto result = UserDto.fromEntity(user);
        result.setPassword(temporaryPassword); // 一時パスワードをDTOにセット（実際はセキュリティ上注意が必要）
        return result;
    }
}

```

#### 已深度思考

````
えられたUserServiceImplの実装について、以下の点を確認・改善します。

1. **トランザクション管理**: `@Transactional`アノテーションがクラスレベルではなくメソッドレベルで使用されていますが、Springのベストプラクティスに従っています。
2. **例外処理**: 現在、`IllegalArgumentException`が使用されていますが、より適切なカスタム例外の使用を検討します。
3. **メールアドレスと社員コードの重複チェック**: 更新時にも重複チェックが必要です。
4. **パスワードリセット**: 一時パスワードをDTOに設定して返すことはセキュリティリスクがあります。
5. **更新処理**: 更新時に存在チェックを2回行っている可能性があります（`updateUser`メソッド）。
6. **削除処理**: 論理削除が実装されていますが、削除するユーザーが存在しない場合の例外処理が適切です。
7. **メソッドの一貫性**: `updateUser`メソッドと`resetPassword`メソッドで、ユーザーの取得方法が異なります（`userId`と`userDto.getUserId()`）。

### 改善点

#### 1. カスタム例外の導入
`RuntimeException`を継承したカスタム例外を定義し、適切なエラーメッセージを設定します。

```java
public class ResourceNotFoundException extends RuntimeException {
   public ResourceNotFoundException(String message) {
       super(message);
   }
}

public class DuplicateResourceException extends RuntimeException {
   public DuplicateResourceException(String message) {
       super(message);
   }
}
````

#### 2. 重複チェックの改善

更新時にも、メールアドレスや社員コードが他のユーザーと重複しないようにチェックする必要があります。ただし、自分自身のレコードとは重複を許容します。

#### 3. パスワードリセットのセキュリティ

一時パスワードをレスポンスに含めるのは避け、代わりにメール送信などの方法を検討します。実装例では、DTO にパスワードを設定している部分を削除します。

#### 4. 更新処理の効率化

更新対象のユーザーを取得する際に、一度取得してから更新するのは適切ですが、`updateUser`メソッドで渡された`userId`と`userDto`内の`userId`が一致しない場合の処理を追加します。

#### 5. その他のポイント

- `getUsersByCompany`メソッドで`Collectors.toList()`が使用されていますが、`import java.util.stream.Collectors;`が必要です。
- 削除処理では、すでに削除済みのユーザーを再度削除しようとした場合の考慮が不足しています。

### 改善後の実装例

```java
package com.example.orgchart_api.service.impl;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import com.example.orgchart_api.mapper.UserMapper;
import com.example.orgchart_api.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service // 追加: Springのサービスとして認識されるように
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        User user = userDto.toEntity(passwordEncoder);
        user.initializeForCreate();

        // メールアドレスの重複チェック
        if (userMapper.existsByMailAddress(user.getMailAddress(), null)) {
            throw new DuplicateResourceException("このメールアドレスは既に使用されています");
        }

        // 社員コードの重複チェック
        if (userMapper.existsByCompanyCdAndEmployeeCd(user.getCompanyCd(), user.getEmployeeCd(), null)) {
            throw new DuplicateResourceException("この企業コードと従業員コードの組み合わせは既に存在します");
        }

        userMapper.insert(user);
        // 登録後のユーザーを再取得
        return UserDto.fromEntity(userMapper.findById(user.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("登録したユーザーの取得に失敗しました")));
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        return userMapper.findById(userId)
                .map(UserDto::fromEntity)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getUsersByCompany(String companyCd) {
        return userMapper.findByCompanyCd(companyCd).stream()
                .map(UserDto::fromEntity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUser(Long userId, String updateUser) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));

        if (user.isDeleted()) {
            throw new ResourceNotFoundException("ユーザーは既に削除されています: " + userId);
        }

        user.setDeleted(true);
        user.setUpdateUser(updateUser);
        user.prepareForUpdate();

        userMapper.update(user);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long userId, UserDto userDto) {
        // パス変数とDTOのユーザーIDが一致しない場合はエラー
        if (!userId.equals(userDto.getUserId())) {
            throw new IllegalArgumentException("パス変数のユーザーIDとリクエストボディのユーザーIDが一致しません");
        }

        User existingUser = userMapper.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));

        // メールアドレスの重複チェック（自分自身を除く）
        if (userMapper.existsByMailAddress(userDto.getMailAddress(), userId)) {
            throw new DuplicateResourceException("このメールアドレスは既に使用されています");
        }

        // 社員コードの重複チェック（自分自身を除く）
        if (userMapper.existsByCompanyCdAndEmployeeCd(
                userDto.getCompanyCd(), userDto.getEmployeeCd(), userId)) {
            throw new DuplicateResourceException("この企業コードと従業員コードの組み合わせは既に存在します");
        }

        userDto.updateEntity(existingUser, passwordEncoder);
        existingUser.prepareForUpdate();

        userMapper.update(existingUser);

        // 更新後のユーザーを取得して返す
        return UserDto.fromEntity(existingUser);
    }

    @Override
    @Transactional
    public void resetPassword(Long userId) {
        User user = userMapper.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));

        // ランダムなパスワードを生成
        String temporaryPassword = UUID.randomUUID().toString().substring(0, 8);
        user.updatePassword(temporaryPassword, passwordEncoder);
        user.setUpdateUser("SYSTEM");
        user.prepareForUpdate();

        userMapper.update(user);

        // 実際のアプリケーションでは、ここで生成した一時パスワードをユーザーにメール送信などする
        // 例: emailService.sendTemporaryPassword(user.getMailAddress(), temporaryPassword);
    }
}
```

### 変更点の説明

1. **カスタム例外の導入**:

   - `ResourceNotFoundException`: リソースが見つからない場合
   - `DuplicateResourceException`: 重複リソースがある場合

2. **重複チェックメソッドの拡張**:

   - 更新時にも重複をチェックできるように、対象を除外するための引数を追加（例: 更新時は自身の ID を除外）
   - Mapper のメソッドを変更して、更新時の重複チェックを可能にしました。

3. **パスワードリセットの改善**:

   - `resetPassword`メソッドで一時パスワードを返さないように変更し、代わりにメール送信などを想定。
   - 実際のメール送信処理はコメントアウトしてありますが、別途実装が必要です。

4. **更新処理の整合性チェック**:

   - パス変数`userId`と DTO 内の`userId`が一致しない場合のチェックを追加。

5. **削除済みユーザーのチェック**:

   - 削除済みのユーザーを再度削除しようとした場合の例外を追加。

6. **サービスクラスのアノテーション**:

   - `@Service`アノテーションをクラスに追加して、Spring のコンポーネントスキャンの対象にします。

7. **登録・更新後のデータ取得**:
   - 登録後、再取得して最新の状態を返すようにしました。

### Mapper インターフェースの変更例

重複チェックメソッドを以下のように変更します。

```java
public interface UserMapper {
    // メールアドレスの重複チェック（excludeUserIdを指定することで、そのユーザーIDを除外）
    boolean existsByMailAddress(String mailAddress, Long excludeUserId);

    // 企業コードと従業員コードの重複チェック（excludeUserIdを指定）
    boolean existsByCompanyCdAndEmployeeCd(String companyCd, String employeeCd, Long excludeUserId);
}
```

### XML マッピングの例（existsByMailAddress）

```xml
<select id="existsByMailAddress" resultType="boolean">
    SELECT COUNT(*) > 0
    FROM trn_user
    WHERE mail_address = #{mailAddress}
    AND deleted = false
    <if test="excludeUserId != null">
        AND user_id <> #{excludeUserId}
    </if>
</select>
```

### 注意点

- 実際のメール送信機能は、別途`EmailService`などを実装して注入する必要があります。
- 一時パスワードは十分に複雑であり、セキュリティを考慮した生成方法を検討してください（例: 大文字・小文字・数字を含む）。

この改善により、より堅牢でセキュアなユーザー管理サービスを実装できます。

````

以下は`UserServiceImpl`の実装に対する詳細なレビューと改善提案です。全体的に良い設計ですが、いくつかの重要な点で改善が必要です。

### 主な改善点

1. **重複チェックの不足**: 更新処理でメールアドレスと社員コードの重複チェックが不足
2. **パスワードリセットのセキュリティリスク**: 一時パスワードをレスポンスで返すのは危険
3. **トランザクション境界**: ユーザー作成時の再取得ロジックが適切でない
4. **例外処理の改善**: より具体的な例外クラスの使用
5. **削除処理の論理削除**: 削除済みユーザーのチェックが不足

### 改善後の実装

```java
package com.example.orgchart_api.service.impl;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import com.example.orgchart_api.mapper.UserMapper;
import com.example.orgchart_api.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional
    public UserDto createUser(UserDto userDto) {
        // DTO → エンティティ変換
        User user = userDto.toEntity(passwordEncoder);
        user.initializeForCreate();

        // 重複チェック
        checkForDuplicates(user, null);

        userMapper.insert(user);

        // 登録後の完全な情報を再取得
        return getUserById(user.getUserId());
    }

    @Override
    @Transactional(readOnly = true)
    public UserDto getUserById(Long userId) {
        return userMapper.findById(userId)
                .map(this::convertToDtoWithSecurity)
                .orElseThrow(() -> new ResourceNotFoundException("ユーザーが見つかりません: " + userId));
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDto> getUsersByCompany(String companyCd) {
        // 削除済みユーザーは除外
        return userMapper.findByCompanyCdAndNotDeleted(companyCd).stream()
                .map(this::convertToDtoWithSecurity)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void deleteUser(Long userId, String updateUser) {
        User user = getActiveUserById(userId);
        user.setDeleted(true);
        user.setUpdateUser(updateUser);
        user.prepareForUpdate();
        userMapper.update(user);
    }

    @Override
    @Transactional
    public UserDto updateUser(Long userId, UserDto userDto) {
        // パスIDとDTOIDの整合性チェック
        if (userDto.getUserId() == null || !userId.equals(userDto.getUserId())) {
            throw new IllegalArgumentException("ユーザーIDが不正です");
        }

        // 既存ユーザーの取得
        User existingUser = getActiveUserById(userId);

        // 重複チェック（更新対象のユーザーIDを除外）
        checkForDuplicates(existingUser, userId);

        // DTOの内容でエンティティを更新
        userDto.updateEntity(existingUser, passwordEncoder);
        existingUser.prepareForUpdate();

        userMapper.update(existingUser);
        return convertToDtoWithSecurity(existingUser);
    }

    @Override
    @Transactional
    public void resetPassword(Long userId) {
        User user = getActiveUserById(userId);

        // ランダムなパスワードを生成
        String temporaryPassword = UUID.randomUUID().toString().substring(0, 8);
        user.updatePassword(temporaryPassword, passwordEncoder);
        user.setUpdateUser("SYSTEM");
        user.prepareForUpdate();

        userMapper.update(user);

        // 実際の運用ではここでメール送信などの処理を実装
        // emailService.sendPasswordReset(user.getMailAddress(), temporaryPassword);
    }

    // === プライベートヘルパーメソッド ===

    private User getActiveUserById(Long userId) {
        return userMapper.findById(userId)
                .filter(user -> !user.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("アクティブなユーザーが見つかりません: " + userId));
    }

    private void checkForDuplicates(User user, Long excludeUserId) {
        // メールアドレスの重複チェック（自分自身を除外）
        if (userMapper.existsByMailAddress(user.getMailAddress(), excludeUserId)) {
            throw new DuplicateResourceException("このメールアドレスは既に使用されています");
        }

        // 社員コードの重複チェック（自分自身を除外）
        if (userMapper.existsByCompanyCdAndEmployeeCd(
            user.getCompanyCd(),
            user.getEmployeeCd(),
            excludeUserId)) {

            throw new DuplicateResourceException("この企業コードと従業員コードの組み合わせは既に存在します");
        }
    }

    private UserDto convertToDtoWithSecurity(User user) {
        UserDto dto = UserDto.fromEntity(user);
        // セキュリティ上、パスワード関連情報はクリア
        dto.setPassword(null);
        return dto;
    }
}
````

### 主な改善内容

#### 1. 重複チェックの強化

```java
private void checkForDuplicates(User user, Long excludeUserId) {
    // メールアドレスの重複チェック（更新時は自身を除外）
    if (userMapper.existsByMailAddress(user.getMailAddress(), excludeUserId)) {
        throw new DuplicateResourceException("このメールアドレスは既に使用されています");
    }

    // 社員コードの重複チェック
    if (userMapper.existsByCompanyCdAndEmployeeCd(
        user.getCompanyCd(),
        user.getEmployeeCd(),
        excludeUserId)) {

        throw new DuplicateResourceException("この企業コードと従業員コードの組み合わせは既に存在します");
    }
}
```

#### 2. パスワードリセットのセキュリティ改善

```java
@Override
@Transactional
public void resetPassword(Long userId) {
    // ...パスワードリセット処理...

    // 実際の運用ではここでメール送信などの処理を実装
    // emailService.sendPasswordReset(user.getMailAddress(), temporaryPassword);
}
```

#### 3. トランザクション境界の適正化

```java
@Override
@Transactional
public UserDto createUser(UserDto userDto) {
    // ...登録処理...

    // 登録後の完全な情報を再取得（別トランザクションで）
    return getUserById(user.getUserId());
}
```

#### 4. カスタム例外の導入

```java
// リソース重複例外
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

// リソース未検出例外
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}
```

#### 5. 削除済みユーザーの適切な処理

```java
private User getActiveUserById(Long userId) {
    return userMapper.findById(userId)
            .filter(user -> !user.isDeleted())
            .orElseThrow(() -> new ResourceNotFoundException("アクティブなユーザーが見つかりません: " + userId));
}
```

### UserMapper インターフェースの拡張

```java
import org.apache.ibatis.annotations.Param;
import java.util.Optional;

public interface UserMapper {
    // IDによるユーザー検索（削除済み含む）
    Optional<User> findById(Long userId);

    // 企業コードと削除フラグで検索
    List<User> findByCompanyCdAndNotDeleted(String companyCd);

    // メールアドレスの重複チェック（除外ID付き）
    boolean existsByMailAddress(@Param("mailAddress") String mailAddress,
                                @Param("excludeUserId") Long excludeUserId);

    // 社員コードの重複チェック（除外ID付き）
    boolean existsByCompanyCdAndEmployeeCd(@Param("companyCd") String companyCd,
                                          @Param("employeeCd") String employeeCd,
                                          @Param("excludeUserId") Long excludeUserId);
}
```

### Mapper XML の実装例

```xml
<!-- メールアドレスの重複チェック -->
<select id="existsByMailAddress" resultType="boolean">
    SELECT EXISTS (
        SELECT 1 FROM trn_user
        WHERE mail_address = #{mailAddress}
        AND deleted = false
        <if test="excludeUserId != null">
            AND user_id != #{excludeUserId}
        </if>
    )
</select>

<!-- 企業コードと社員コードの重複チェック -->
<select id="existsByCompanyCdAndEmployeeCd" resultType="boolean">
    SELECT EXISTS (
        SELECT 1 FROM trn_user
        WHERE company_cd = #{companyCd}
        AND employee_cd = #{employeeCd}
        AND deleted = false
        <if test="excludeUserId != null">
            AND user_id != #{excludeUserId}
        </if>
    )
</select>

<!-- 企業コードと削除フラグで検索 -->
<select id="findByCompanyCdAndNotDeleted" resultType="User">
    SELECT * FROM trn_user
    WHERE company_cd = #{companyCd}
    AND deleted = false
</select>
```

### 重要な追加ポイント

1. **部分更新対応**:
   更新処理では、DTO の null フィールドを無視するロジックが必要

   ```java
   // UserDto内のメソッド
   public void updateEntity(User existingEntity, PasswordEncoder passwordEncoder) {
       if (this.userNm != null) existingEntity.setUserNm(this.userNm);
       // 他のフィールドも同様...
   }
   ```

2. **パフォーマンス改善**:
   大量データ処理にはページネーションを実装

   ```java
   @Override
   @Transactional(readOnly = true)
   public Page<UserDto> getUsersByCompany(String companyCd, Pageable pageable) {
       List<UserDto> content = userMapper.findByCompanyCd(companyCd, pageable).stream()
               .map(this::convertToDtoWithSecurity)
               .collect(Collectors.toList());

       long total = userMapper.countByCompanyCd(companyCd);
       return new PageImpl<>(content, pageable, total);
   }
   ```

3. **監査ログ**:
   重要な操作（削除、パスワード変更）には監査ログを記録
   ```java
   @Override
   @Transactional
   public void deleteUser(Long userId, String updateUser) {
       // ...削除処理...
       auditLogService.logDeletion(updateUser, "USER", userId);
   }
   ```

この改善により、より安全で堅牢なユーザー管理サービスを実装できます。特に重複チェックの拡張とパスワードリセットのセキュリティ対策は必須の改良点です。
