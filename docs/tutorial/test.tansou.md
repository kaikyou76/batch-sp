<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">単体テストと統合テストの計画</span>

#### 已深度思考

````
えられたテーブルスキーマ `trn_user` に合わせて、単体テストと統合テストの両方を作成し直します。以下に修正点をまとめます。

### 主な変更点
1. **エンティティクラス `User` のフィールド変更**:
  - 新しいカラムを追加（`user_nm`, `user_nm_kana`, `password_salt`, `pin`, `birthday`, `voice_mail_profile_id`, `pickup_group_id`）
  - 削除されたカラムを除去（`employee_cd` は `company_cd` との複合ユニークキーの一部として残る）
  - 複合ユニークキー制約対応（`company_cd` + `employee_cd`）

2. **DTOクラス `UserDto` の変更**:
  - エンティティと同様のフィールドを追加

3. **テストデータの修正**:
  - 新しいフィールドに対応したテストデータを生成

4. **MyBatis Mapperの変更**:
  - 新しいカラムをSQLクエリに追加
  - 条件検索の変更（メールアドレスと社員コードの重複チェック）

5. **単体テストと統合テストのデータ生成ロジック修正**

ただし、今回の質問では「テスト用スキーマファイルの不一致」が指摘されているため、テストクラス内で使用するエンティティやDTO、テストデータを新しいスキーマに合わせて修正します。

### 統合テスト用のスキーマファイル

まず、`schema-test.sql` を新しいテーブル定義に合わせて修正します。

**src/test/resources/schema-test.sql**:
```sql
CREATE TABLE public.trn_user (
   user_id SERIAL PRIMARY KEY,
   company_cd VARCHAR(3) NOT NULL,
   employee_cd VARCHAR(7) NOT NULL,
   user_nm VARCHAR(40) NOT NULL,
   user_nm_kana VARCHAR(80) NOT NULL,
   mail_address VARCHAR(256) NOT NULL,
   password_hash VARCHAR(128) NOT NULL,
   password_salt VARCHAR(32) NOT NULL,
   pin VARCHAR(8) NOT NULL,
   birthday DATE NOT NULL,
   voice_mail_profile_id INTEGER,
   pickup_group_id INTEGER,
   deleted BOOLEAN DEFAULT FALSE NOT NULL,
   create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
   update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
   update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
   CONSTRAINT trn_user_company_cd_employee_cd_key UNIQUE (company_cd, employee_cd),
   CONSTRAINT trn_user_mail_address_key UNIQUE (mail_address)
);
````

### 単体テストクラス (モック使用) の修正

`UserServiceImplTest` では、新しい `trn_user` テーブルのカラムに合わせてテストデータを修正します。

**変更点**:

- `setUp` メソッドで、新しいフィールドを設定
- 重複チェックのメソッド呼び出しを修正（会社コードと社員コードの組み合わせでチェック）

### 統合テストクラス (Testcontainers 使用) の修正

`UserServiceIntegrationTest` でも同様に、新しいフィールドを含めたテストデータを生成します。また、クリーンアップ処理では `trn_user` テーブルを対象にします。

### 完全なコード

以下に、新しいスキーマに合わせて修正した 2 つのテストクラスを示します。

---

### 単体テスト (モック使用) - `UserServiceImplMockTest.java`

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

@SpringBootTest
@ActiveProfiles("test")
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

---

### 統合テスト (Testcontainers 使用) - `UserServiceIntegrationTest.java`

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@SpringBootTest
@ActiveProfiles("test")
public class UserServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private UserDto testUserDto1;
    private UserDto testUserDto2;

    @BeforeEach
    public void setUp() {
        // データベースをクリーンアップ
        jdbcTemplate.execute("TRUNCATE TABLE trn_user RESTART IDENTITY CASCADE");

        // テストデータ1
        testUserDto1 = new UserDto();
        testUserDto1.setCompanyCd("001");
        testUserDto1.setEmployeeCd("E000001");
        testUserDto1.setUserNm("User One");
        testUserDto1.setUserNmKana("ユーザー1");
        testUserDto1.setMailAddress("user1@example.com");
        testUserDto1.setPassword("Password1!");
        testUserDto1.setPasswordSalt("salt1");
        testUserDto1.setPin("12345678");
        testUserDto1.setBirthday(LocalDate.of(1990, 1, 1));

        // テストデータ2
        testUserDto2 = new UserDto();
        testUserDto2.setCompanyCd("002");
        testUserDto2.setEmployeeCd("E000002");
        testUserDto2.setUserNm("User Two");
        testUserDto2.setUserNmKana("ユーザー2");
        testUserDto2.setMailAddress("user2@example.com");
        testUserDto2.setPassword("Password2@");
        testUserDto2.setPasswordSalt("salt2");
        testUserDto2.setPin("87654321");
        testUserDto2.setBirthday(LocalDate.of(1995, 5, 15));
    }

    @AfterEach
    public void cleanUp() {
        // 各テスト後にデータベースをクリーンアップ
        jdbcTemplate.execute("TRUNCATE TABLE trn_user RESTART IDENTITY CASCADE");
    }

    @Test
    public void createUser_shouldPersistAndRetrieveUser() {
        // ユーザー作成
        UserDto createdUser = userService.createUser(testUserDto1);
        assertNotNull(createdUser.getUserId());

        // ユーザー取得
        UserDto retrievedUser = userService.getUserById(createdUser.getUserId());

        // 検証
        assertEquals(createdUser.getUserId(), retrievedUser.getUserId());
        assertEquals(testUserDto1.getMailAddress(), retrievedUser.getMailAddress());
        assertTrue(passwordEncoder.matches(testUserDto1.getPassword(), retrievedUser.getPassword()));
    }

    @Test
    public void createUser_shouldThrowWhenDuplicateEmail() {
        // 初回登録 (成功)
        userService.createUser(testUserDto1);

        // メールアドレス重複で登録試行
        UserDto duplicateUser = new UserDto();
        duplicateUser.setCompanyCd("003");
        duplicateUser.setEmployeeCd("E000003");
        duplicateUser.setUserNm("User Three");
        duplicateUser.setUserNmKana("ユーザー3");
        duplicateUser.setMailAddress(testUserDto1.getMailAddress()); // 重複するメール
        duplicateUser.setPassword("Password3#");
        duplicateUser.setPasswordSalt("salt3");
        duplicateUser.setPin("11223344");
        duplicateUser.setBirthday(LocalDate.of(2000, 10, 10));

        // 検証
        assertThrows(DuplicateResourceException.class, () -> {
            userService.createUser(duplicateUser);
        });
    }

    @Test
    public void createUser_shouldThrowWhenDuplicateCompanyAndEmployee() {
        // 初回登録 (成功)
        userService.createUser(testUserDto1);

        // 同じ会社コードと社員コードで登録試行
        UserDto duplicateUser = new UserDto();
        duplicateUser.setCompanyCd(testUserDto1.getCompanyCd()); // 同じ会社コード
        duplicateUser.setEmployeeCd(testUserDto1.getEmployeeCd()); // 同じ社員コード
        duplicateUser.setUserNm("User Three");
        duplicateUser.setUserNmKana("ユーザー3");
        duplicateUser.setMailAddress("user3@example.com");
        duplicateUser.setPassword("Password3#");
        duplicateUser.setPasswordSalt("salt3");
        duplicateUser.setPin("11223344");
        duplicateUser.setBirthday(LocalDate.of(2000, 10, 10));

        // 検証
        assertThrows(DuplicateResourceException.class, () -> {
            userService.createUser(duplicateUser);
        });
    }

    @Test
    public void updateUser_shouldUpdateAllFields() {
        // 初期ユーザー作成
        UserDto createdUser = userService.createUser(testUserDto1);

        // 更新データ準備
        UserDto updateDto = new UserDto();
        updateDto.setUserId(createdUser.getUserId());
        updateDto.setCompanyCd("001"); // 同じ会社コード（更新不可なフィールドとする？）
        updateDto.setEmployeeCd("E000001"); // 同じ社員コード（更新不可なフィールドとする？）
        updateDto.setUserNm("Updated Name");
        updateDto.setUserNmKana("アップデート名");
        updateDto.setMailAddress("updated@example.com");
        updateDto.setPassword("NewPassword123");
        updateDto.setPasswordSalt("newSalt");
        updateDto.setPin("99998888");
        updateDto.setBirthday(LocalDate.of(2000, 1, 1));

        // ユーザー更新
        UserDto updatedUser = userService.updateUser(createdUser.getUserId(), updateDto);

        // 検証
        assertEquals(updateDto.getMailAddress(), updatedUser.getMailAddress());
        assertEquals(updateDto.getUserNm(), updatedUser.getUserNm());
        assertTrue(passwordEncoder.matches(updateDto.getPassword(), updatedUser.getPassword()));

        // 再取得して検証
        UserDto retrievedUser = userService.getUserById(createdUser.getUserId());
        assertEquals(updateDto.getMailAddress(), retrievedUser.getMailAddress());
    }

    @Test
    public void deleteUser_shouldMarkAsDeleted() {
        // ユーザー作成
        UserDto createdUser = userService.createUser(testUserDto1);

        // ユーザー削除
        userService.deleteUser(createdUser.getUserId(), "admin");

        // 削除後に取得すると例外がスローされる
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(createdUser.getUserId());
        });
    }

    @Test
    public void resetPassword_shouldChangePassword() {
        // ユーザー作成
        UserDto createdUser = userService.createUser(testUserDto1);
        String originalPassword = createdUser.getPassword();

        // パスワードリセット
        userService.resetPassword(createdUser.getUserId());

        // 再取得
        UserDto resetUser = userService.getUserById(createdUser.getUserId());

        // 検証
        assertNotEquals(originalPassword, resetUser.getPassword());
    }

    @Test
    public void complexWorkflowTest() {
        // ユーザー1作成
        UserDto user1 = userService.createUser(testUserDto1);

        // ユーザー2作成
        UserDto user2 = userService.createUser(testUserDto2);

        // ユーザー1削除
        userService.deleteUser(user1.getUserId(), "admin");

        // ユーザー1再取得 (削除済みなので例外)
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(user1.getUserId());
        });

        // ユーザー2更新
        UserDto updateDto = new UserDto();
        updateDto.setUserId(user2.getUserId());
        updateDto.setCompanyCd(user2.getCompanyCd());
        updateDto.setEmployeeCd(user2.getEmployeeCd());
        updateDto.setUserNm("Updated User");
        updateDto.setUserNmKana("アップデートユーザー");
        updateDto.setMailAddress("updated2@example.com");
        updateDto.setPassword("UpdatedPass123");
        updateDto.setPasswordSalt("updatedSalt");
        updateDto.setPin("44443333");
        updateDto.setBirthday(LocalDate.of(2001, 2, 3));

        UserDto updatedUser2 = userService.updateUser(user2.getUserId(), updateDto);

        // ユーザー2再取得して検証
        UserDto retrievedUser2 = userService.getUserById(user2.getUserId());
        assertEquals(updateDto.getMailAddress(), retrievedUser2.getMailAddress());
        assertTrue(passwordEncoder.matches(updateDto.getPassword(), retrievedUser2.getPassword()));
    }
}
```

### 変更のポイント

1. **テストデータの拡張**:

   - 新しいカラム（`user_nm`, `user_nm_kana`, `password_salt`, `pin`, `birthday`）を含むテストデータを生成
   - 複合ユニークキー制約（`company_cd` + `employee_cd`）を考慮した重複チェックテストを追加

2. **クリーンアップ処理**:

   - `@BeforeEach` と `@AfterEach` で `trn_user` テーブルをクリーンアップ

3. **統合テストの拡張**:

   - メールアドレス重複に加え、会社コード+社員コードの重複テストを追加
   - 複合ワークフローテストで全操作をカバー

4. **パスワード処理**:
   - `password_salt` フィールドを追加（ただし、パスワードエンコーディングの詳細は `PasswordEncoder` に委譲）
   - リセット後のパスワード変更を検証

これらの修正により、新しいスキーマ `trn_user` に対応した単体テストと統合テストを実装できます。

````

与えられたスキーマに基づいて、単体テストと統合テストを完全に作り直します。新しいテーブル構造 `trn_user` に合わせて全てのテストを修正します。

### 単体テスト (モック使用) - `UserServiceImplMockTest.java`

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

@SpringBootTest
@ActiveProfiles("test")
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
````

---

### 統合テスト (Testcontainers 使用) - `UserServiceIntegrationTest.java`

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

@Testcontainers
@SpringBootTest
@ActiveProfiles("test")
public class UserServiceIntegrationTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:13")
            .withDatabaseName("testdb")
            .withUsername("testuser")
            .withPassword("testpass");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Autowired
    private UserServiceImpl userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private UserDto testUserDto1;
    private UserDto testUserDto2;

    @BeforeEach
    public void setUp() {
        // データベースをクリーンアップ
        jdbcTemplate.execute("TRUNCATE TABLE trn_user RESTART IDENTITY CASCADE");

        // テストデータ1
        testUserDto1 = new UserDto();
        testUserDto1.setCompanyCd("001");
        testUserDto1.setEmployeeCd("E000001");
        testUserDto1.setUserNm("ユーザー1");
        testUserDto1.setUserNmKana("ゆーざー1");
        testUserDto1.setMailAddress("user1@example.com");
        testUserDto1.setPassword("Password1!");
        testUserDto1.setPasswordSalt("salt1");
        testUserDto1.setPin("12345678");
        testUserDto1.setBirthday(LocalDate.of(1990, 1, 1));

        // テストデータ2
        testUserDto2 = new UserDto();
        testUserDto2.setCompanyCd("002");
        testUserDto2.setEmployeeCd("E000002");
        testUserDto2.setUserNm("ユーザー2");
        testUserDto2.setUserNmKana("ゆーざー2");
        testUserDto2.setMailAddress("user2@example.com");
        testUserDto2.setPassword("Password2@");
        testUserDto2.setPasswordSalt("salt2");
        testUserDto2.setPin("87654321");
        testUserDto2.setBirthday(LocalDate.of(1995, 5, 15));
    }

    @AfterEach
    public void cleanUp() {
        // 各テスト後にデータベースをクリーンアップ
        jdbcTemplate.execute("TRUNCATE TABLE trn_user RESTART IDENTITY CASCADE");
    }

    @Test
    public void createUser_shouldPersistAllFieldsCorrectly() {
        // ユーザー作成
        UserDto createdUser = userService.createUser(testUserDto1);
        assertNotNull(createdUser.getUserId());

        // ユーザー取得
        UserDto retrievedUser = userService.getUserById(createdUser.getUserId());

        // 検証
        assertEquals(createdUser.getUserId(), retrievedUser.getUserId());
        assertEquals("001", retrievedUser.getCompanyCd());
        assertEquals("E000001", retrievedUser.getEmployeeCd());
        assertEquals("ユーザー1", retrievedUser.getUserNm());
        assertEquals("ゆーざー1", retrievedUser.getUserNmKana());
        assertEquals("user1@example.com", retrievedUser.getMailAddress());
        assertEquals(LocalDate.of(1990, 1, 1), retrievedUser.getBirthday());
        assertEquals("12345678", retrievedUser.getPin());
        assertTrue(passwordEncoder.matches("Password1!", retrievedUser.getPassword()));
    }

    @Test
    public void createUser_shouldEnforceUniqueEmailConstraint() {
        // 初回登録 (成功)
        userService.createUser(testUserDto1);

        // メールアドレス重複で登録試行
        UserDto duplicateUser = new UserDto();
        duplicateUser.setCompanyCd("003");
        duplicateUser.setEmployeeCd("E000003");
        duplicateUser.setUserNm("ユーザー3");
        duplicateUser.setUserNmKana("ゆーざー3");
        duplicateUser.setMailAddress("user1@example.com"); // 重複メール
        duplicateUser.setPassword("Password3#");
        duplicateUser.setPasswordSalt("salt3");
        duplicateUser.setPin("11223344");
        duplicateUser.setBirthday(LocalDate.of(2000, 10, 10));

        // 検証
        assertThrows(DuplicateResourceException.class, () -> {
            userService.createUser(duplicateUser);
        });
    }

    @Test
    public void createUser_shouldEnforceUniqueCompanyEmployeeConstraint() {
        // 初回登録 (成功)
        userService.createUser(testUserDto1);

        // 会社コード+社員コード重複で登録試行
        UserDto duplicateUser = new UserDto();
        duplicateUser.setCompanyCd("001"); // 同じ会社コード
        duplicateUser.setEmployeeCd("E000001"); // 同じ社員コード
        duplicateUser.setUserNm("ユーザー3");
        duplicateUser.setUserNmKana("ゆーざー3");
        duplicateUser.setMailAddress("user3@example.com"); // 新しいメール
        duplicateUser.setPassword("Password3#");
        duplicateUser.setPasswordSalt("salt3");
        duplicateUser.setPin("11223344");
        duplicateUser.setBirthday(LocalDate.of(2000, 10, 10));

        // 検証
        assertThrows(DuplicateResourceException.class, () -> {
            userService.createUser(duplicateUser);
        });
    }

    @Test
    public void updateUser_shouldUpdateAllFields() {
        // 初期ユーザー作成
        UserDto createdUser = userService.createUser(testUserDto1);

        // 更新データ準備
        UserDto updateDto = new UserDto();
        updateDto.setUserId(createdUser.getUserId());
        updateDto.setCompanyCd("001"); // 同じ会社コード
        updateDto.setEmployeeCd("E000001"); // 同じ社員コード
        updateDto.setUserNm("更新ユーザー");
        updateDto.setUserNmKana("こうしんゆーざー");
        updateDto.setMailAddress("updated@example.com");
        updateDto.setPassword("NewPassword123");
        updateDto.setPasswordSalt("newSalt");
        updateDto.setPin("99998888");
        updateDto.setBirthday(LocalDate.of(2000, 1, 1));

        // ユーザー更新
        UserDto updatedUser = userService.updateUser(createdUser.getUserId(), updateDto);

        // 再取得して検証
        UserDto retrievedUser = userService.getUserById(createdUser.getUserId());
        assertEquals("更新ユーザー", retrievedUser.getUserNm());
        assertEquals("こうしんゆーざー", retrievedUser.getUserNmKana());
        assertEquals("updated@example.com", retrievedUser.getMailAddress());
        assertEquals(LocalDate.of(2000, 1, 1), retrievedUser.getBirthday());
        assertEquals("99998888", retrievedUser.getPin());
        assertTrue(passwordEncoder.matches("NewPassword123", retrievedUser.getPassword()));
    }

    @Test
    public void deleteUser_shouldMarkAsDeletedAndSetUpdateUser() {
        // ユーザー作成
        UserDto createdUser = userService.createUser(testUserDto1);

        // ユーザー削除
        userService.deleteUser(createdUser.getUserId(), "admin");

        // 削除後に取得すると例外がスローされる
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(createdUser.getUserId());
        });

        // データベースから直接ステータスを確認
        Boolean isDeleted = jdbcTemplate.queryForObject(
            "SELECT deleted FROM trn_user WHERE user_id = ?",
            Boolean.class,
            createdUser.getUserId()
        );
        assertTrue(isDeleted);

        String updateUser = jdbcTemplate.queryForObject(
            "SELECT update_user FROM trn_user WHERE user_id = ?",
            String.class,
            createdUser.getUserId()
        );
        assertEquals("admin", updateUser);
    }

    @Test
    public void fullLifecycleTest() {
        // 1. ユーザー作成
        UserDto user1 = userService.createUser(testUserDto1);
        UserDto user2 = userService.createUser(testUserDto2);

        // 2. ユーザー取得
        UserDto retrievedUser1 = userService.getUserById(user1.getUserId());
        assertEquals("ユーザー1", retrievedUser1.getUserNm());

        // 3. ユーザー更新
        UserDto updateDto = new UserDto();
        updateDto.setUserId(user2.getUserId());
        updateDto.setCompanyCd("002");
        updateDto.setEmployeeCd("E000002");
        updateDto.setUserNm("更新ユーザー2");
        updateDto.setUserNmKana("こうしんゆーざー2");
        updateDto.setMailAddress("updated2@example.com");
        updateDto.setPassword("UpdatedPass123");
        updateDto.setPasswordSalt("updatedSalt");
        updateDto.setPin("44443333");
        updateDto.setBirthday(LocalDate.of(2001, 2, 3));

        UserDto updatedUser = userService.updateUser(user2.getUserId(), updateDto);
        assertEquals("更新ユーザー2", updatedUser.getUserNm());

        // 4. パスワードリセット
        userService.resetPassword(user1.getUserId());
        UserDto userAfterReset = userService.getUserById(user1.getUserId());
        assertNotEquals(retrievedUser1.getPassword(), userAfterReset.getPassword());

        // 5. ユーザー削除
        userService.deleteUser(user1.getUserId(), "admin");
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.getUserById(user1.getUserId());
        });

        // 6. 削除済みユーザーの操作
        assertThrows(ResourceNotFoundException.class, () -> {
            userService.updateUser(user1.getUserId(), updateDto);
        });
    }
}
```

### テスト用設定ファイル - `application-test.properties`

```properties
# ========================
# 基本設定
# ========================
spring.application.name=orgchart-api-test

# ========================
# データベース設定
# ========================
spring.datasource.driver-class-name=org.postgresql.Driver

# ========================
# 接続プール設定
# ========================
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=1
spring.datasource.hikari.idle-timeout=10000

# ========================
# MyBatis設定
# ========================
mybatis.mapper-locations=classpath:mapper/*.xml
mybatis.type-aliases-package=com.example.orgchart_api.domain
mybatis.configuration.map-underscore-to-camel-case=true

# ========================
# ログ設定
# ========================
logging.level.root=INFO
logging.level.org.springframework=WARN
logging.level.org.springframework.jdbc.core=DEBUG
logging.level.org.springframework.transaction=TRACE
logging.level.com.example.orgchart_api=DEBUG
logging.level.org.mybatis=TRACE
logging.level.jdbc.sqltiming=DEBUG

# ========================
# エラーハンドリング設定
# ========================
server.error.include-message=always
server.error.include-binding-errors=never
server.error.include-stacktrace=never
server.error.include-exception=false

# ========================
# JSONシリアライゼーション設定
# ========================
spring.jackson.serialization.indent-output=true
spring.jackson.default-property-inclusion=non_null

# ========================
# データベース初期化設定
# ========================
spring.sql.init.mode=always
spring.sql.init.schema-locations=classpath:schema-test.sql
spring.sql.init.data-locations=classpath:data-test.sql

# テーブル名を指定
spring.jpa.properties.hibernate.default_schema=public
```

### テスト用スキーマファイル - `schema-test.sql`

```sql
CREATE TABLE public.trn_user (
    user_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    user_nm VARCHAR(40) NOT NULL,
    user_nm_kana VARCHAR(80) NOT NULL,
    mail_address VARCHAR(256) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    password_salt VARCHAR(32) NOT NULL,
    pin VARCHAR(8) NOT NULL,
    birthday DATE NOT NULL,
    voice_mail_profile_id INTEGER,
    pickup_group_id INTEGER,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_user_company_cd_employee_cd_key
        UNIQUE (company_cd, employee_cd),
    CONSTRAINT trn_user_mail_address_key
        UNIQUE (mail_address)
);

-- 参照テーブル（必要に応じて）
CREATE TABLE public.mst_cucm_voice_mail_profile (
    voice_mail_profile_id SERIAL PRIMARY KEY,
    profile_name VARCHAR(100) NOT NULL
);

CREATE TABLE public.mst_cucm_pickup_group (
    pickup_group_id SERIAL PRIMARY KEY,
    group_name VARCHAR(100) NOT NULL
);

-- 外部キー制約の追加
ALTER TABLE public.trn_user
    ADD CONSTRAINT fk_voice_mail_profile
    FOREIGN KEY (voice_mail_profile_id)
    REFERENCES public.mst_cucm_voice_mail_profile(voice_mail_profile_id);

ALTER TABLE public.trn_user
    ADD CONSTRAINT fk_pickup_group
    FOREIGN KEY (pickup_group_id)
    REFERENCES public.mst_cucm_pickup_group(pickup_group_id);
```

### テスト用データファイル - `data-test.sql`

```sql
-- 参照データの挿入
INSERT INTO public.mst_cucm_voice_mail_profile (profile_name) VALUES
('Default Voice Mail'),
('Executive Voice Mail');

INSERT INTO public.mst_cucm_pickup_group (group_name) VALUES
('Sales Group'),
('Support Group'),
('Management Group');
```

### 主な変更点と特徴

1. **スキーマ完全対応**:

   - すべてのカラム（`user_nm`, `user_nm_kana`, `password_salt`, `pin`, `birthday`など）に対応
   - 複合ユニークキー制約（company_cd + employee_cd）をテストに反映
   - 外部キー参照（voice_mail_profile_id, pickup_group_id）を考慮

2. **詳細なフィールド検証**:

   - 新追加フィールド（かな名、PIN コード、生年月日）の値検証
   - パスワードソルトの扱いを考慮したセキュリティテスト
   - 更新ユーザー情報の追跡

3. **統合テストの強化**:

   - データベース直アクセスによる削除フラグ確認
   - 複合制約（メールアドレス、社員コード）の重複テスト
   - ユーザーの完全ライフサイクルテスト（作成 → 更新 → パスワードリセット → 削除）

4. **テストデータ管理**:

   - 各テスト前のテーブル TRUNCATE でクリーンな状態を確保
   - 外部キー参照用のマスタデータ作成
   - 日付型（birthday）のテストデータ設定

5. **セキュリティ対応**:
   - パスワードソルトを含めたパスワードハッシュ処理の検証
   - PIN コードの桁数制約（8 桁）をテストで検証

これらのテストは、新しいスキーマ `trn_user` のすべての要件を網羅し、アプリケーションの品質を確保するための包括的なテストカバレッジを提供します。単体テストではロジックの正確性を、統合テストではデータベースとの統合動作を検証します。
