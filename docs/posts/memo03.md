<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserRepository インターフェースについて</span>

### UserRepository インターフェースの役割について

```java
package com.example.orgchart_api.repository;

import com.example.orgchart_api.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User,Long> {
    Optional<User> findByCompanyCdAndEmployeeCd(String companyCd, String employeeCd);
    Optional<User> findByMailAddress(String mailAddress);

    @Modifying
    @Query("UPDATE User u SET u.deleted = true, u.updateDate = CURRENT_TIMESTAMP, u.updateUser = :updateUser WHERE u.userId = :userId")
    void softDelete(@Param("userId") Long userId, @Param("updateUser") String updateUser);
}

```

このコードは、Spring Data JPA を使って **`User` エンティティに対するデータベース操作（CRUD）を行うリポジトリインターフェース**です。

---

## 🔍 概要

```java
public interface UserRepository extends JpaRepository<User, Long>
```

この行で、`UserRepository` は `JpaRepository` を継承しており、以下が自動的に提供されます：

- `save()`, `findById()`, `findAll()`, `deleteById()` などの基本的な DB 操作
- ジェネリクスで対象エンティティは `User`、主キー型は `Long`

---

## 📌 各メソッドの意味

### 1. `findByCompanyCdAndEmployeeCd`

```java
Optional<User> findByCompanyCdAndEmployeeCd(String companyCd, String employeeCd);
```

- Spring Data の **クエリメソッド機能**。
- `companyCd` と `employeeCd` を両方一致させて `User` を検索。
- 該当ユーザーがいない可能性があるので `Optional<User>`。

例：

```java
userRepository.findByCompanyCdAndEmployeeCd("001", "A123456");
```

---

### 2. `findByMailAddress`

```java
Optional<User> findByMailAddress(String mailAddress);
```

- メールアドレスで `User` を検索。

---

### 3. `softDelete` メソッド

```java
@Modifying
@Query("UPDATE User u SET u.deleted = true, u.updateDate = CURRENT_TIMESTAMP, u.updateUser = :updateUser WHERE u.userId = :userId")
void softDelete(@Param("userId") Long userId, @Param("updateUser") String updateUser);
```

#### 🔹 何をしているか？

- 実データを削除せず、`deleted` フラグを `true` にする「**論理削除**」処理。
- 同時に `updateDate` を現在時刻に、`updateUser` を指定の値で更新。

#### 🔹 各アノテーションの意味：

| アノテーション | 説明                                                                   |
| -------------- | ---------------------------------------------------------------------- |
| `@Modifying`   | `@Query` が **データを変更（UPDATE/DELETE）** するものであると明示する |
| `@Query(...)`  | JPQL（エンティティベースの SQL）で直接クエリを書く                     |
| `@Param(...)`  | クエリ中の `:userId` や `:updateUser` に引数をバインドする             |

#### 使用例：

```java
userRepository.softDelete(123L, "adminUser");
```

---

## ✅ 実際の使い方（例）

```java
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    public void deactivateUser(Long id, String updater) {
        userRepository.softDelete(id, updater);
    }

    public Optional<UserDto> findUser(String companyCd, String employeeCd) {
        return userRepository.findByCompanyCdAndEmployeeCd(companyCd, employeeCd)
                .map(userMapper::toDto);
    }
}
```

---

## 💡 補足

- `@Modifying` を使う場合は、**トランザクション管理**が必要です。
  通常、呼び出し元のサービスクラスに `@Transactional` を付けます。

```java
@Transactional
public void softDeleteUser(Long id) {
    userRepository.softDelete(id, "SYSTEM");
}
```

---

## ✅ まとめ

| メソッド名                     | 説明                                                   |
| ------------------------------ | ------------------------------------------------------ |
| `findByCompanyCdAndEmployeeCd` | 会社 CD と社員 CD でユーザーを検索                     |
| `findByMailAddress`            | メールアドレスで検索                                   |
| `softDelete`                   | 論理削除（deleted を true に）＋更新時刻と更新者を変更 |

---

さらに `JpaRepository<User, Long>` によってすでに多くの便利なメソッドが使えます。必要ならそれらも一覧できます。
