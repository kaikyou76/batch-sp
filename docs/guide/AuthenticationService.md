# AuthenticationService 業務ロジック

### (src/main/java/com/example/orgchart_api/service/AuthenticationService.java)

```java
/*
 * Copyright (c) 2025, kaikyou DX, LIMITED All Rights Reserved.
 *
 *
 * AuthenticationService.java
 *
 * @date 2025/06/29
 * @version 1.0
 * @author kaikyou
 */
package com.example.orgchart_api.service;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class AuthenticationService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public Optional<User> authenticate(String email, String rawPassword) {
        return userRepository.findByEmail(email)
                .filter(user -> passwordEncoder.matches(rawPassword, user.getPasswordHash()));
    }

    public User register(String email, String name, String password) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new IllegalArgumentException("このメールアドレスは既に使用されています");
        }

        String hashedPassword = passwordEncoder.encode(password);

        LocalDateTime now = LocalDateTime.now();

        return userRepository.save(User.builder()
                .email(email)
                .name(name)
                .passwordHash(hashedPassword)
                .role("user")
                // ✅ 登録日時を明示的に設定
                .createDate(now)
                .updateDate(now)
                .updateUser(email)
                .build());
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public boolean checkPassword(String rawPassword, String encodedPassword) {
        return passwordEncoder.matches(rawPassword, encodedPassword);
    }
}
```

#### 已深度思考

> このクラスは認証関連のビジネスロジックを担当するサービスです。主な機能はユーザーの認証（ログイン）、新規登録、メールアドレスによるユーザー取得、パスワードチェックです。
> フィールド:

- `UserRepository`: ユーザーデータへのアクセスを担当
- `PasswordEncoder`: パスワードのハッシュ化と照合を担当
  > メソッド分析:
  >
  > 1. `authenticate`メソッド:
- 引数: メールアドレスと平文パスワード
- 処理:
  a. メールアドレスでユーザーを検索
  b. 見つかったユーザーのパスワードハッシュと引数の平文パスワードを照合（`passwordEncoder.matches`）
- 戻り値: 認証成功時はユーザーの Optional、失敗時は空の Optional
  > 2. `register`メソッド:
- 引数: メールアドレス、名前、平文パスワード
- 処理:
  a. メールアドレスの重複チェック（重複なら例外スロー）
  b. 平文パスワードをハッシュ化
  c. 現在時刻を取得（登録日時と更新日時に使用）
  d. ユーザーオブジェクトをビルダーで構築（ロールはデフォルトで"user"、登録日時と更新日時は現在時刻、更新ユーザーは登録メールアドレス）
  e. ユーザーを保存して返す
- 例外: メールアドレス重複時は`IllegalArgumentException`
  > 3. `getUserByEmail`メソッド:
- 引数: メールアドレス
- 戻り値: 該当ユーザーの Optional（存在しなければ空）
  > 4. `checkPassword`メソッド:
- 引数: 平文パスワードとハッシュ化されたパスワード
- 戻り値: パスワードが一致すれば true、そうでなければ false
  > このサービスでは、パスワードは常にハッシュ化されて扱われ、平文で保存されることはありません。また、登録時には重複メールアドレスのチェックが行われます。
  > 注意点:
- 登録メソッドで設定している`updateUser`にはメールアドレスを設定していますが、登録時はまだユーザーが確定していないため、システムであることを示す値（例えば "system"）を設定する方が適切かもしれません。
- 登録日時と更新日時はサービス層で設定していますが、エンティティ側で自動設定（`@CreationTimestamp`など）を使う方法もあります。

## AuthenticationService クラスの分析

### クラスの役割

AuthenticationService は **認証関連のビジネスロジックを担当するサービス層** で、以下の主要な機能を提供します：

1. ユーザー認証（ログイン）
2. 新規ユーザー登録
3. メールアドレスによるユーザー取得
4. パスワード検証

### メソッド詳細分析

---

#### 1. authenticate() - ユーザー認証

```java
public Optional<User> authenticate(String email, String rawPassword) {
    return userRepository.findByEmail(email)
            .filter(user -> passwordEncoder.matches(rawPassword, user.getPasswordHash()));
}
```

- **役割**: メールアドレスとパスワードによる認証
- **処理フロー**:
  1. メールアドレスでユーザー検索
  2. パスワード照合: 入力パスワードとハッシュ化済みパスワードを比較
- **戻り値**:
  - 認証成功: ユーザー情報を含む Optional
  - 認証失敗: 空の Optional
- **セキュリティ**:
  - `passwordEncoder.matches()`で安全なパスワード比較を実装

---

#### 2. register() - ユーザー登録

```java
public User register(String email, String name, String password) {
    if (userRepository.findByEmail(email).isPresent()) {
        throw new IllegalArgumentException("このメールアドレスは既に使用されています");
    }

    String hashedPassword = passwordEncoder.encode(password);
    LocalDateTime now = LocalDateTime.now();

    return userRepository.save(User.builder()
            .email(email)
            .name(name)
            .passwordHash(hashedPassword)
            .role("user")
            .createDate(now)
            .updateDate(now)
            .updateUser(email)
            .build());
}
```

- **役割**: 新規ユーザー登録
- **処理フロー**:
  1. メールアドレス重複チェック
  2. パスワードをハッシュ化
  3. 現在日時を取得
  4. User エンティティをビルダーパターンで構築
  5. データベースに保存
- **特徴**:
  - 重複メールアドレスは例外スロー
  - デフォルトロールは"user"
  - 監査情報（作成日/更新日/更新者）を明示的に設定
- **例外処理**: `IllegalArgumentException` をスロー

---

#### 3. getUserByEmail() - ユーザー検索

```java
public Optional<User> getUserByEmail(String email) {
    return userRepository.findByEmail(email);
}
```

- **役割**: メールアドレスによるユーザー取得
- **戻り値**: 該当ユーザーの Optional オブジェクト
- **用途**: 認証前のユーザー存在チェックなど

---

#### 4. checkPassword() - パスワード検証

```java
public boolean checkPassword(String rawPassword, String encodedPassword) {
    return passwordEncoder.matches(rawPassword, encodedPassword);
}
```

- **役割**: 平文パスワードとハッシュ化パスワードの照合
- **ユースケース**:
  - パスワード変更時の現在パスワード確認
  - 認証ロジックの再利用

---

### クラスの特徴

#### 1. セキュリティ設計

- **パスワードハッシュ化**: 平文パスワードを直接扱わない
- **安全な照合**: `matches()`メソッドでタイミング攻撃対策
- **最小権限原則**: 新規ユーザーはデフォルトで"user"ロール

#### 2. トランザクション管理

- Spring のデフォルト動作でメソッド単位のトランザクションが適用
- 登録処理は原子性が保証される

#### 3. 監査情報の設定

- 登録時に明示的に作成日/更新日を設定
- 更新者には登録ユーザーのメールアドレスを設定

#### 4. エラーハンドリング

- 重複メールアドレスは即時例外スロー
- クライアントに明確なエラーメッセージを提供

---

### 使用例

#### ユーザー登録フロー

```java
// コントローラー内
User newUser = authenticationService.register(
    "user@example.com",
    "John Doe",
    "securePassword123"
);
```

#### ログイン認証フロー

```java
Optional<User> user = authenticationService.authenticate(
    "user@example.com",
    "inputPassword"
);

if (user.isPresent()) {
    // 認証成功処理
} else {
    // 認証失敗処理
}
```

#### パスワードチェック

```java
boolean isValid = authenticationService.checkPassword(
    "inputPassword",
    storedHash
);
```

---

### 改善提案

#### 1. カスタム例外の導入

```java
public class EmailAlreadyExistsException extends RuntimeException {
    public EmailAlreadyExistsException(String message) {
        super(message);
    }
}

// 使用例
throw new EmailAlreadyExistsException("このメールアドレスは既に使用されています");
```

#### 2. ロール管理の強化

```java
// ロールを列挙型で管理
public enum UserRole {
    USER, ADMIN
}

// 登録メソッド内
.role(UserRole.USER.name())
```

#### 3. 監査情報の自動化

```java
// Spring Data JPAの監査機能を活用
@CreatedDate
private LocalDateTime createDate;

@LastModifiedDate
private LocalDateTime updateDate;
```

#### 4. トランザクション明示化

```java
@Transactional
public User register(...) { ... }
```

このサービスは認証機能のコアロジックを簡潔に実装し、セキュリティベストプラクティスに沿った設計となっています。
