<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserServiceImpl のテスト（ユニットテスト - Mockito）</span>

### サービス層のビジネスロジックを検証（ユニットテスト - Mockito）

`src/test/java/com/example/orgchart_api/service/UserServiceImplMockTest.java`

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import com.example.orgchart_api.mapper.UserMapper;
import com.example.orgchart_api.service.impl.UserServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class UserServiceImplMockTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private UserDto testUserDto;
    private User testUser;

    @BeforeEach
    public void setUp() {
        // DTOの設定
        testUserDto = new UserDto();
        testUserDto.setUserId(1L);
        testUserDto.setCompanyCd("001");
        testUserDto.setEmployeeCd("E123456");
        testUserDto.setUserNm("テストユーザー");
        testUserDto.setUserNmKana("てすとゆーざー");
        testUserDto.setMailAddress("test@example.com");
        testUserDto.setPassword("password123");
        testUserDto.setPin("12345678");
        testUserDto.setBirthday(LocalDate.of(1990, 1, 1));

        // ドメインモデルの設定
        testUser = new User();
        testUser.setUserId(1L);
        testUser.setCompanyCd("001");
        testUser.setEmployeeCd("E123456");
        testUser.setUserNm("テストユーザー");
        testUser.setUserNmKana("てすとゆーざー");
        testUser.setMailAddress("test@example.com");
        testUser.setPasswordHash("encodedPassword");
        testUser.setPasswordSalt("somesaltvalue");
        testUser.setPin("12345678");
        testUser.setBirthday(LocalDate.of(1990, 1, 1));
        testUser.setVoiceMailProfileId(1);
        testUser.setPickupGroupId(2);
        testUser.setDeleted(false);
        testUser.setCreateDate(LocalDateTime.now());
        testUser.setUpdateDate(LocalDateTime.now());
        testUser.setUpdateUser("TEST_USER");
    }

    @Test
    public void createUser_shouldSucceed_whenValidInput() {
        // モック設定
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userMapper.existsByMailAddress(anyString(), isNull())).thenReturn(false);
        when(userMapper.existsByCompanyCdAndEmployeeCd(anyString(), anyString(), isNull())).thenReturn(false);

        doAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(1L);
            return null;
        }).when(userMapper).insert(any(User.class));

        // 実行
        UserDto result = userService.createUser(testUserDto);

        // 検証
        assertNotNull(result);
        assertEquals(1L, result.getUserId().longValue());
        assertEquals("テストユーザー", result.getUserNm());
        assertEquals("12345678", result.getPin());
        verify(userMapper, times(1)).insert(any(User.class));
    }

    @Test
    public void createUser_shouldThrow_whenMailDuplicate() {
        when(userMapper.existsByMailAddress(eq("test@example.com"), isNull()))
                .thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            userService.createUser(testUserDto);
        });
    }

    @Test
    public void createUser_shouldThrow_whenEmployeeDuplicate() {
        when(userMapper.existsByCompanyCdAndEmployeeCd(eq("001"), eq("E123456"), isNull()))
                .thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> {
            userService.createUser(testUserDto);
        });
    }

    @Test
    public void getUserById_shouldReturnUser_whenExists() {
        when(userMapper.findById(1L)).thenReturn(Optional.of(testUser));

        UserDto result = userService.getUserById(1L);

        assertNotNull(result);
        assertEquals("test@example.com", result.getMailAddress());
        assertEquals("てすとゆーざー", result.getUserNmKana());
        assertEquals(LocalDate.of(1990, 1, 1), result.getBirthday());
    }

    @Test
    public void getUserById_shouldThrow_whenNotFound() {
        when(userMapper.findById(999L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(999L);
        });
    }

    @Test
    public void getUserById_shouldThrow_whenUserDeleted() {
        testUser.setDeleted(true);
        when(userMapper.findById(1L)).thenReturn(Optional.of(testUser));

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(1L);
        });
    }

    @Test
    public void updateUser_shouldSucceed_whenValidInput() {
        // モック設定
        when(userMapper.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode(anyString())).thenReturn("newEncodedPassword");
        when(userMapper.existsByMailAddress("new@example.com", 1L)).thenReturn(false);
        when(userMapper.existsByCompanyCdAndEmployeeCd("002", "E654321", 1L)).thenReturn(false);

        // 更新用DTO
        UserDto updateDto = new UserDto();
        updateDto.setUserId(1L);
        updateDto.setCompanyCd("002");
        updateDto.setEmployeeCd("E654321");
        updateDto.setUserNm("更新ユーザー");
        updateDto.setUserNmKana("こうしんゆーざー");
        updateDto.setMailAddress("new@example.com");
        updateDto.setPassword("newPassword");
        updateDto.setPin("87654321");
        updateDto.setBirthday(LocalDate.of(1995, 5, 15));

        // 実行
        UserDto result = userService.updateUser(1L, updateDto);

        // 検証
        assertEquals("new@example.com", result.getMailAddress());
        assertEquals("更新ユーザー", result.getUserNm());
        assertEquals(LocalDate.of(1995, 5, 15), result.getBirthday());
        verify(userMapper, times(1)).update(testUser);
    }

    @Test
    public void updateUser_shouldThrow_whenIdMismatch() {
        UserDto updateDto = new UserDto();
        updateDto.setUserId(999L); // 不正なID

        assertThrows(IllegalArgumentException.class, () -> {
            userService.updateUser(1L, updateDto);
        });
    }

    @Test
    public void resetPassword_shouldUpdatePassword() {
        when(userMapper.findById(1L)).thenReturn(Optional.of(testUser));
        when(passwordEncoder.encode(anyString())).thenReturn("resetPassword");

        userService.resetPassword(1L);

        verify(userMapper, times(1)).update(testUser);
        assertEquals("resetPassword", testUser.getPasswordHash());
    }

    @Test
    public void resetPassword_shouldThrow_whenUserDeleted() {
        testUser.setDeleted(true);
        when(userMapper.findById(1L)).thenReturn(Optional.of(testUser));

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.resetPassword(1L);
        });
    }

    @Test
    public void deleteUser_shouldMarkAsDeleted() {
        when(userMapper.findById(1L)).thenReturn(Optional.of(testUser));

        userService.deleteUser(1L, "admin");

        assertTrue(testUser.isDeleted());
        assertEquals("admin", testUser.getUpdateUser());
        verify(userMapper, times(1)).update(testUser);
    }

    @Test
    public void deleteUser_shouldThrow_whenAlreadyDeleted() {
        testUser.setDeleted(true);
        when(userMapper.findById(1L)).thenReturn(Optional.of(testUser));

        assertThrows(ResourceNotFoundException.class, () -> {
            userService.deleteUser(1L, "admin");
        });
    }
}
```

#### 已深度思考

````
クラスの作成は確かに初心者にとっては難しく感じるかもしれません。しかし、段階的に進めていくことで理解しやすくなります。以下では、このテストクラス（UserServiceImplMockTest）を作成する手順をステップバイステップで説明します。

### 前提
- テスト対象: `UserServiceImpl`（ビジネスロジックを含むサービス実装）
- 使用するテストフレームワーク: JUnit 5（Jupiter）
- モックライブラリ: Mockito

### ステップ 0: 依存関係の追加 (Mavenの場合)
プロジェクトの`pom.xml`に以下の依存関係を追加します。
```xml
<dependencies>
   <!-- Spring Boot Starter Test (JUnit 5, Mockito, etc.) -->
   <dependency>
       <groupId>org.springframework.boot</groupId>
       <artifactId>spring-boot-starter-test</artifactId>
       <scope>test</scope>
   </dependency>
</dependencies>
````

### ステップ 1: テストクラスの基本構造作成

テストクラスを作成し、必要なアノテーションを追加します。

```java
package com.example.orgchart_api.service;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.doAnswer;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import com.example.orgchart_api.mapper.UserMapper;
import com.example.orgchart_api.service.impl.UserServiceImpl;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Optional;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class) // MockitoをJUnit5で使うための拡張
public class UserServiceImplMockTest {

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserServiceImpl userService;

    private UserDto testUserDto;
    private User testUser;

    @BeforeEach
    public void setUp() {
        // テストデータの初期化
        // DTOオブジェクト
        testUserDto = new UserDto();
        // ドメインオブジェクト
        testUser = new User();
        // ... フィールドを設定
    }

    // テストメソッドをここに追加
}
```

### ステップ 2: 各テストメソッドの作成

テストケースごとにメソッドを作成します。ここでは、以下のテストを作成します。

1. ユーザー作成が成功する場合
2. メールアドレスが重複している場合の例外
3. 社員コードが重複している場合の例外
4. ID でユーザーを取得する（存在する場合）
5. ID でユーザーを取得する（存在しない場合）
6. ID でユーザーを取得する（削除済みの場合）
7. ユーザー更新が成功する場合
8. ユーザー更新で ID が一致しない場合の例外
9. パスワードリセットが成功する場合
10. パスワードリセットでユーザーが削除済みの場合の例外
11. ユーザー削除（論理削除）が成功する場合
12. ユーザー削除で既に削除済みの場合の例外

### ステップ 3: テストメソッドの実装例

各テストメソッドを以下のように実装していきます。

#### 例 1: ユーザー作成が成功する場合

```java
@Test
public void createUser_shouldSucceed_whenValidInput() {
    // モックの設定
    // パスワードエンコーダのモック
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");

    // 重複チェックのモック: メールアドレスと社員コードが重複していない
    when(userMapper.existsByMailAddress(anyString(), isNull())).thenReturn(false);
    when(userMapper.existsByCompanyCdAndEmployeeCd(anyString(), anyString(), isNull())).thenReturn(false);

    // 挿入処理のモック: 挿入されたユーザーにIDを設定
    doAnswer(invocation -> {
        User user = invocation.getArgument(0);
        user.setUserId(1L); // 挿入後にIDが設定されたことをシミュレート
        return null;
    }).when(userMapper).insert(any(User.class));

    // テスト実行
    UserDto result = userService.createUser(testUserDto);

    // 検証
    assertNotNull(result);
    assertEquals(1L, result.getUserId());
    assertEquals("テストユーザー", result.getUserNm());
    verify(userMapper, times(1)).insert(any(User.class));
}
```

#### 例 2: メールアドレスが重複している場合の例外

```java
@Test
public void createUser_shouldThrow_whenMailDuplicate() {
    // モック設定: メールアドレスが重複している
    when(userMapper.existsByMailAddress(eq("test@example.com"), isNull()))
            .thenReturn(true);

    // 実行と検証: 例外が投げられること
    assertThrows(DuplicateResourceException.class, () -> {
        userService.createUser(testUserDto);
    });
}
```

#### 例 3: 社員コードが重複している場合の例外

```java
@Test
public void createUser_shouldThrow_whenEmployeeDuplicate() {
    // モック設定: 社員コードが重複している
    when(userMapper.existsByCompanyCdAndEmployeeCd(eq("001"), eq("E123456"), isNull()))
            .thenReturn(true);

    // 実行と検証
    assertThrows(DuplicateResourceException.class, () -> {
        userService.createUser(testUserDto);
    });
}
```

### ステップ 4: その他のテストメソッド

他のテストメソッドも同様に実装します。各テストの流れは以下です：

1. モックの設定（when...thenReturn, doAnswer など）
2. テスト対象メソッドの実行
3. 結果の検証（アサーションとモックの呼び出し検証）

### ステップ 5: テストの実行

IDE（Eclipse, IntelliJ など）でテストを実行するか、Maven コマンド（`mvn test`）でテストを実行します。

### 補足: テストのネーミング

テストメソッドの名前は「操作*期待する結果*その条件」の形式で付けると可読性が高まります。
例: `createUser_shouldThrowException_whenMailDuplicate`

### まとめ

1. テストクラスを作成し、必要なアノテーション（`@ExtendWith`, `@Mock`, `@InjectMocks`）を付ける。
2. `@BeforeEach`でテストデータを初期化する。
3. 各テストメソッドで：
   - モックの動作を設定（`when`）
   - テスト対象メソッドを呼び出し
   - 結果を検証（`assert`系メソッド）
   - モックの呼び出しを検証（`verify`）

この手順に従って、テストケースを一つずつ書いていけば、テストクラスを完成させることができます。最初は難しく感じるかもしれませんが、慣れてくるとパターンが見えてきます。頑張ってください！

````

テストクラスの作成手順を段階的に説明します。初心者でも理解しやすいように、具体的なステップに分けて解説します。

### ステップ0: 依存関係の追加 (Mavenの場合)
```xml
<!-- pom.xml -->
<dependencies>
    <!-- Spring Boot Test Starter -->
    <dependency>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-test</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- Mockito -->
    <dependency>
        <groupId>org.mockito</groupId>
        <artifactId>mockito-core</artifactId>
        <scope>test</scope>
    </dependency>

    <!-- JUnit Jupiter -->
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <scope>test</scope>
    </dependency>
</dependencies>
````

### ステップ 1: テストクラスの基本構造作成

```java
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

@ExtendWith(MockitoExtension.class) // Mockitoを有効化
public class UserServiceImplMockTest {

    @Mock // モックオブジェクト
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks // モックを注入する対象
    private UserServiceImpl userService;

    private UserDto testUserDto;
    private User testUser;

    @BeforeEach
    public void setUp() {
        // テストデータの初期化
    }

    // テストメソッド追加場所
}
```

### ステップ 2: テストデータの準備 (setUp メソッド)

```java
@BeforeEach
public void setUp() {
    // DTOテストデータ
    testUserDto = new UserDto();
    testUserDto.setUserId(1L);
    testUserDto.setCompanyCd("001");
    testUserDto.setEmployeeCd("E123456");
    testUserDto.setUserNm("テストユーザー");
    testUserDto.setMailAddress("test@example.com");
    testUserDto.setPassword("password123");
    testUserDto.setPin("12345678");

    // ドメインモデルテストデータ
    testUser = new User();
    testUser.setUserId(1L);
    testUser.setCompanyCd("001");
    testUser.setEmployeeCd("E123456");
    testUser.setUserNm("テストユーザー");
    testUser.setMailAddress("test@example.com");
    testUser.setPasswordHash("encodedPassword");
    testUser.setPin("12345678");
    testUser.setDeleted(false);
}
```

### ステップ 3: 基本 CRUD テストの作成 (簡単なものから始める)

**例: ユーザー取得テスト (成功パターン)**

```java
@Test
public void getUserById_shouldReturnUser_whenExists() {
    // 1. モックの振る舞い設定
    when(userMapper.findById(1L)).thenReturn(Optional.of(testUser));

    // 2. テスト対象メソッド実行
    UserDto result = userService.getUserById(1L);

    // 3. 結果検証
    assertNotNull(result);
    assertEquals("test@example.com", result.getMailAddress());

    // 4. モックの呼び出し検証
    verify(userMapper, times(1)).findById(1L);
}
```

**例: ユーザー取得テスト (失敗パターン)**

```java
@Test
public void getUserById_shouldThrow_whenNotFound() {
    // モック: 空のOptionalを返す
    when(userMapper.findById(999L)).thenReturn(Optional.empty());

    // 例外発生を検証
    assertThrows(ResourceNotFoundException.class, () -> {
        userService.getUserById(999L);
    });
}
```

### ステップ 4: 複雑な操作のテスト (作成/更新/削除)

**ユーザー作成テストの例**

```java
@Test
public void createUser_shouldSucceed_whenValidInput() {
    // モック設定
    when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
    when(userMapper.existsByMailAddress(anyString(), isNull())).thenReturn(false);
    when(userMapper.existsByCompanyCdAndEmployeeCd(anyString(), anyString(), isNull())).thenReturn(false);

    // 挿入メソッドのモック
    doAnswer(invocation -> {
        User user = invocation.getArgument(0);
        user.setUserId(1L); // IDを設定
        return null;
    }).when(userMapper).insert(any(User.class));

    // テスト実行
    UserDto result = userService.createUser(testUserDto);

    // 検証
    assertNotNull(result.getUserId());
    verify(userMapper, times(1)).insert(any(User.class));
}
```

### ステップ 5: 例外パターンのテスト

```java
@Test
public void createUser_shouldThrow_whenMailDuplicate() {
    // モック: メール重複をtrueに設定
    when(userMapper.existsByMailAddress("test@example.com", isNull()))
        .thenReturn(true);

    // 例外発生を検証
    assertThrows(DuplicateResourceException.class, () -> {
        userService.createUser(testUserDto);
    });
}
```

### ステップ 6: テストの実行とデバッグ

- IDE でテストクラスを右クリック → `Run Test`
- テストが失敗した場合:
  1. エラーメッセージを確認
  2. モックの設定が正しいかチェック
  3. テストデータの状態を確認
  4. 対象メソッドの実装を確認

### テスト作成のコツ

1. **1 テスト 1 アサート**: 1 つのテストでは 1 つのことに集中
2. **Given-When-Then パターン**:
   ```java
   @Test
   void testScenario() {
       // Given: テストの準備
       when(userMapper.findById(1L)).thenReturn(Optional.of(testUser));

       // When: テスト対象の実行
       UserDto result = userService.getUserById(1L);

       // Then: 結果の検証
       assertEquals("test@example.com", result.getMailAddress());
   }
   ```
3. **モックの動作確認**: `verify()`でメソッド呼び出しを検証
4. **境界値テスト**: null、空値、最大値、最小値など特殊な値を試す

### よく使う Mockito メソッド

| メソッド                                 | 用途                       |
| ---------------------------------------- | -------------------------- |
| `when(mock.method()).thenReturn(value)`  | モックの戻り値設定         |
| `doThrow(exception).when(mock).method()` | 例外発生を設定             |
| `verify(mock, times(n)).method()`        | メソッド呼び出し回数検証   |
| `ArgumentMatchers.any()`                 | 任意の引数での動作設定     |
| `@InjectMocks`                           | モックを注入するテスト対象 |

テスト作成は「小さく始めて徐々に拡張する」が基本です。まずはシンプルな成功パターンのテストから作成し、慣れてきたら例外ケースや複雑なシナリオに挑戦しましょう。
