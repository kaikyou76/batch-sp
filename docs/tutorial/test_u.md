<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">テストの計画</span>

#### 已深度思考

````
を行うには、以下のような方法があります。
1. 単体テスト（Unit Test）: 各クラス（Service, Controller, Mapper）を個別にテストします。
2. 統合テスト（Integration Test）: アプリケーションを起動して、APIレベルやデータベース接続を含めたテストを行います。

ここでは、主要なクラスに対する単体テストの例を提供します。

テストの準備：
- テストフレームワーク: JUnit 5
- モックライブラリ: Mockito
- テストデータ構築: 必要に応じて手動で作成

テスト対象クラス：
1. UserServiceImpl (サービスクラス)
2. UserController (コントローラークラス)
3. UserMapper (データアクセス層) → MyBatisのMapperは通常、統合テストで実際のデータベースに対してテストする

まず、`UserServiceImpl` の単体テスト例です。

### UserServiceImpl のテスト

```java
package com.example.orgchart_api.service.impl;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import com.example.orgchart_api.mapper.UserMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

   @Mock
   private UserMapper userMapper;

   @InjectMocks
   private UserServiceImpl userService;

   private PasswordEncoder passwordEncoder;

   @BeforeEach
   void setUp() {
       passwordEncoder = new BCryptPasswordEncoder();
       userService = new UserServiceImpl(userMapper, passwordEncoder);
   }

   @Test
   void createUser_Success() {
       // テストデータ準備
       UserDto userDto = new UserDto();
       userDto.setCompanyCd("001");
       userDto.setEmployeeCd("EMP001");
       userDto.setUserNm("山田太郎");
       userDto.setMailAddress("taro.yamada@example.com");
       userDto.setPassword("password");
       userDto.setPin("1234");
       userDto.setBirthday(LocalDate.of(1990, 1, 1));

       User user = userDto.toEntity(passwordEncoder);
       user.setUserId(1L);

       when(userMapper.insert(any(User.class))).thenReturn(1);
       when(userMapper.existsByMailAddress(anyString(), any())).thenReturn(false);
       when(userMapper.existsByCompanyCdAndEmployeeCd(anyString(), anyString(), any())).thenReturn(false);

       // テスト実行
       UserDto result = userService.createUser(userDto);

       // 検証
       assertNotNull(result);
       assertEquals("山田太郎", result.getUserNm());
       verify(userMapper, times(1)).insert(any(User.class));
   }

   @Test
   void createUser_DuplicateMailAddress() {
       // テストデータ準備
       UserDto userDto = new UserDto();
       userDto.setMailAddress("taro.yamada@example.com");
       // ... 他のフィールドも設定 ...

       when(userMapper.existsByMailAddress(eq("taro.yamada@example.com"), eq(null))).thenReturn(true);

       // 検証: 例外がスローされること
       assertThrows(DuplicateResourceException.class, () -> userService.createUser(userDto));
   }

   @Test
   void getUserById_Success() {
       Long userId = 1L;
       User user = new User();
       user.setUserId(userId);
       user.setDeleted(false);

       when(userMapper.findById(userId)).thenReturn(Optional.of(user));

       UserDto result = userService.getUserById(userId);

       assertNotNull(result);
       assertEquals(userId, result.getUserId());
   }

   @Test
   void getUserById_NotFound() {
       Long userId = 1L;
       when(userMapper.findById(userId)).thenReturn(Optional.empty());

       assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(userId));
   }

   @Test
   void getUserById_UserDeleted() {
       Long userId = 1L;
       User user = new User();
       user.setUserId(userId);
       user.setDeleted(true);

       when(userMapper.findById(userId)).thenReturn(Optional.of(user));

       assertThrows(ResourceNotFoundException.class, () -> userService.getUserById(userId));
   }

   @Test
   void getActiveUsersByCompany_Success() {
       String companyCd = "001";
       User user = new User();
       user.setCompanyCd(companyCd);
       user.setDeleted(false);

       when(userMapper.findByCompanyCdAndNotDeleted(companyCd)).thenReturn(List.of(user));

       List<UserDto> result = userService.getActiveUsersByCompany(companyCd);

       assertFalse(result.isEmpty());
       assertEquals(1, result.size());
       assertEquals(companyCd, result.get(0).getCompanyCd());
   }

   @Test
   void updateUser_Success() {
       Long userId = 1L;
       UserDto userDto = new UserDto();
       userDto.setUserId(userId);
       userDto.setUserNm("更新された名前");

       User existingUser = new User();
       existingUser.setUserId(userId);
       existingUser.setDeleted(false);

       when(userMapper.findById(userId)).thenReturn(Optional.of(existingUser));
       when(userMapper.existsByMailAddress(anyString(), anyLong())).thenReturn(false);
       when(userMapper.existsByCompanyCdAndEmployeeCd(anyString(), anyString(), anyLong())).thenReturn(false);

       UserDto result = userService.updateUser(userId, userDto);

       assertNotNull(result);
       assertEquals("更新された名前", result.getUserNm());
       verify(userMapper, times(1)).update(any(User.class));
   }

   @Test
   void deleteUser_Success() {
       Long userId = 1L;
       String updateUser = "user123";
       User user = new User();
       user.setUserId(userId);
       user.setDeleted(false);

       when(userMapper.findById(userId)).thenReturn(Optional.of(user));

       userService.deleteUser(userId, updateUser);

       assertTrue(user.isDeleted());
       assertEquals(updateUser, user.getUpdateUser());
       verify(userMapper, times(1)).update(user);
   }

   @Test
   void resetPassword_Success() {
       Long userId = 1L;
       User user = new User();
       user.setUserId(userId);
       user.setDeleted(false);
       String originalPasswordHash = user.getPasswordHash();

       when(userMapper.findById(userId)).thenReturn(Optional.of(user));

       userService.resetPassword(userId);

       assertNotEquals(originalPasswordHash, user.getPasswordHash());
       verify(userMapper, times(1)).update(user);
   }
}
````

### UserController のテスト

```java
package com.example.orgchart_api.controller;

import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserControllerTest {

    @Mock
    private UserService userService;

    @InjectMocks
    private UserController userController;

    @Test
    void createUser() {
        UserDto userDto = new UserDto();
        userDto.setUserNm("山田太郎");
        UserDto createdUser = new UserDto();
        createdUser.setUserId(1L);
        createdUser.setUserNm("山田太郎");

        when(userService.createUser(userDto)).thenReturn(createdUser);

        ResponseEntity<UserDto> response = userController.createUser(userDto);

        assertEquals(HttpStatus.CREATED, response.getStatusCode());
        assertEquals(1L, response.getBody().getUserId());
        assertNotNull(response.getHeaders().getLocation());
    }

    @Test
    void getUserById() {
        Long userId = 1L;
        UserDto user = new UserDto();
        user.setUserId(userId);
        user.setUserNm("山田太郎");

        when(userService.getUserById(userId)).thenReturn(user);

        ResponseEntity<UserDto> response = userController.getUserById(userId);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(userId, response.getBody().getUserId());
    }

    @Test
    void getActiveUsersByCompany() {
        String companyCd = "001";
        UserDto user = new UserDto();
        user.setCompanyCd(companyCd);
        List<UserDto> users = List.of(user);

        when(userService.getActiveUsersByCompany(companyCd)).thenReturn(users);

        ResponseEntity<List<UserDto>> response = userController.getActiveUsersByCompany(companyCd);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals(1, response.getBody().size());
        assertEquals(companyCd, response.getBody().get(0).getCompanyCd());
    }

    @Test
    void updateUser() {
        Long userId = 1L;
        UserDto userDto = new UserDto();
        userDto.setUserNm("更新された名前");
        UserDto updatedUser = new UserDto();
        updatedUser.setUserId(userId);
        updatedUser.setUserNm("更新された名前");

        when(userService.updateUser(userId, userDto)).thenReturn(updatedUser);

        ResponseEntity<UserDto> response = userController.updateUser(userId, userDto);

        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertEquals("更新された名前", response.getBody().getUserNm());
    }

    @Test
    void deleteUser() {
        Long userId = 1L;
        String updateUser = "user123";

        ResponseEntity<Void> response = userController.deleteUser(userId, updateUser);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(userService, times(1)).deleteUser(userId, updateUser);
    }

    @Test
    void resetPassword() {
        Long userId = 1L;

        ResponseEntity<Void> response = userController.resetPassword(userId);

        assertEquals(HttpStatus.NO_CONTENT, response.getStatusCode());
        verify(userService, times(1)).resetPassword(userId);
    }
}
```

### UserMapper のテスト（統合テスト）

Mapper のテストは、実際のデータベースに接続して行う統合テストが一般的です。Spring Boot Test を使用します。

```java
package com.example.orgchart_api.mapper;

import com.example.orgchart_api.domain.User;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.junit.jupiter.api.extension.ExtendWith;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(SpringExtension.class)
@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    void insertAndFindById() {
        User user = new User();
        user.setCompanyCd("001");
        user.setEmployeeCd("EMP001");
        user.setUserNm("山田太郎");
        user.setMailAddress("taro.yamada@example.com");
        user.setPin("1234");
        user.setBirthday(LocalDate.of(1990, 1, 1));
        user.setDeleted(false);
        user.setCreateDate(LocalDateTime.now());
        user.setUpdateDate(LocalDateTime.now());
        user.setUpdateUser("SYSTEM");

        userMapper.insert(user);
        assertNotNull(user.getUserId());

        Optional<User> found = userMapper.findById(user.getUserId());
        assertTrue(found.isPresent());
        assertEquals("山田太郎", found.get().getUserNm());
    }

    @Test
    void findByCompanyCdAndNotDeleted() {
        // テストデータをセットアップ
        User activeUser = new User();
        activeUser.setCompanyCd("001");
        activeUser.setDeleted(false);
        // ... 他のフィールドを設定 ...
        userMapper.insert(activeUser);

        User deletedUser = new User();
        deletedUser.setCompanyCd("001");
        deletedUser.setDeleted(true);
        // ... 他のフィールドを設定 ...
        userMapper.insert(deletedUser);

        List<User> activeUsers = userMapper.findByCompanyCdAndNotDeleted("001");
        assertEquals(1, activeUsers.size());
        assertFalse(activeUsers.get(0).isDeleted());
    }

    // 他のメソッドのテストも同様に追加
}
```

### テストの実行方法

- プロジェクトルートで `mvn test` を実行
- IDE からテストクラスを右クリックで実行

### テスト環境の設定

`src/test/resources/application-test.properties` にテスト用のデータベース設定を記述します。

```properties
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=
spring.jpa.database-platform=org.hibernate.dialect.H2Dialect
```

### 注意点

- MyBatis の Mapper テストは、`@MybatisTest`アノテーションを使用し、H2 などのインメモリデータベースを利用するのが一般的です。
- サービスやコントローラーのテストでは、実際のデータベース接続はモックに置き換えます。
- 統合テストでは、テストデータのセットアップとクリーンナップ（@BeforeEach, @AfterEach）を適切に行ってください。

これらのテストを実装することで、主要な機能が正しく動作することを確認できます。

````

上記システムのテスト方法を以下のように段階的に説明します。テストはユニットテストと統合テストに分けて行います。

### 1. UserMapperのテスト（ユニットテスト - MyBatis Test）

MyBatis Mapperの動作を検証するテスト：

```java
package com.example.orgchart_api.mapper;

import com.example.orgchart_api.domain.User;
import org.junit.jupiter.api.Test;
import org.mybatis.spring.boot.test.autoconfigure.MybatisTest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.jdbc.AutoConfigureTestDatabase;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.jdbc.Sql;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

@MybatisTest
@AutoConfigureTestDatabase(replace = AutoConfigureTestDatabase.Replace.NONE)
@ActiveProfiles("test")
class UserMapperTest {

    @Autowired
    private UserMapper userMapper;

    @Test
    @Sql(scripts = "/test-data.sql")
    void findByCompanyCdAndNotDeleted() {
        // テストデータ実行（company_cd=001のアクティブユーザー2件、削除済み1件）
        List<User> users = userMapper.findByCompanyCdAndNotDeleted("001");

        assertThat(users).hasSize(2);
        users.forEach(user -> assertFalse(user.isDeleted()));
    }

    @Test
    @Sql(scripts = "/test-data.sql")
    void existsByMailAddress() {
        // テストデータ実行（test@example.comは存在）
        boolean exists = userMapper.existsByMailAddress("test@example.com", null);
        assertTrue(exists);

        // 除外ID指定で重複なし
        exists = userMapper.existsByMailAddress("test@example.com", 100L);
        assertFalse(exists);
    }

    @Test
    @Sql(scripts = "/test-data.sql")
    void insertAndUpdate() {
        User newUser = new User();
        newUser.setCompanyCd("002");
        newUser.setEmployeeCd("EMP200");
        newUser.setUserNm("新しいユーザー");
        newUser.setMailAddress("new@example.com");
        newUser.initializeForCreate();

        userMapper.insert(newUser);
        assertNotNull(newUser.getUserId());

        newUser.setUserNm("更新されたユーザー");
        userMapper.update(newUser);

        Optional<User> found = userMapper.findById(newUser.getUserId());
        assertTrue(found.isPresent());
        assertEquals("更新されたユーザー", found.get().getUserNm());
    }
}
````

テスト用 SQL ファイル `src/test/resources/test-data.sql`:

```sql
-- テストデータ登録
INSERT INTO users
(user_id, company_cd, employee_cd, user_nm, mail_address, deleted, create_date, update_date, update_user)
VALUES
(100, '001', 'EMP100', 'ユーザー1', 'test@example.com', false, NOW(), NOW(), 'SYSTEM'),
(101, '001', 'EMP101', 'ユーザー2', 'user2@example.com', false, NOW(), NOW(), 'SYSTEM'),
(102, '001', 'EMP102', '削除ユーザー', 'deleted@example.com', true, NOW(), NOW(), 'SYSTEM'),
(103, '002', 'EMP200', '他社ユーザー', 'other@example.com', false, NOW(), NOW(), 'SYSTEM');
```

### 2. UserServiceImpl のテスト（ユニットテスト - Mockito）

サービス層のビジネスロジックを検証：

```java
package com.example.orgchart_api.service.impl;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import com.example.orgchart_api.mapper.UserMapper;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceImplTest {

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserServiceImpl userService;

    private final PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @Test
    void createUser_Success() {
        // テストデータ準備
        UserDto userDto = new UserDto();
        userDto.setCompanyCd("001");
        userDto.setEmployeeCd("EMP100");
        userDto.setUserNm("テストユーザー");
        userDto.setMailAddress("new@example.com");

        // モック設定
        when(userMapper.existsByMailAddress(anyString(), isNull())).thenReturn(false);
        when(userMapper.existsByCompanyCdAndEmployeeCd(anyString(), anyString(), isNull())).thenReturn(false);
        when(userMapper.insert(any(User.class))).thenAnswer(invocation -> {
            User user = invocation.getArgument(0);
            user.setUserId(1L);
            return 1;
        });

        // テスト実行
        UserDto result = userService.createUser(userDto);

        // 検証
        assertNotNull(result.getUserId());
        assertEquals("テストユーザー", result.getUserNm());
        verify(userMapper).insert(any(User.class));
    }

    @Test
    void getActiveUsersByCompany_FilterDeleted() {
        // モック設定（削除済みを含むデータ）
        User activeUser = new User();
        activeUser.setUserId(1L);
        activeUser.setDeleted(false);

        User deletedUser = new User();
        deletedUser.setUserId(2L);
        deletedUser.setDeleted(true);

        when(userMapper.findByCompanyCdAndNotDeleted("001"))
            .thenReturn(List.of(activeUser));

        // テスト実行
        List<UserDto> result = userService.getActiveUsersByCompany("001");

        // 検証
        assertEquals(1, result.size());
        assertFalse(result.get(0).getDeleted());
    }

    @Test
    void deleteUser_AlreadyDeleted() {
        // モック設定（削除済みユーザー）
        User deletedUser = new User();
        deletedUser.setUserId(1L);
        deletedUser.setDeleted(true);

        when(userMapper.findById(1L)).thenReturn(Optional.of(deletedUser));

        // 検証
        assertThrows(ResourceNotFoundException.class,
            () -> userService.deleteUser(1L, "admin"));
    }
}
```

### 3. UserController のテスト（統合テスト - SpringBootTest）

API エンドポイントの統合テスト：

```java
package com.example.orgchart_api.controller;

import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.Collections;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.BDDMockito.given;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(UserController.class)
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private UserService userService;

    @Test
    void createUser_ValidInput_ReturnsCreated() throws Exception {
        // テストデータ準備
        UserDto userDto = new UserDto();
        userDto.setUserId(1L);
        userDto.setUserNm("テストユーザー");

        given(userService.createUser(any(UserDto.class))).willReturn(userDto);

        // テスト実行＆検証
        mockMvc.perform(post("/api/users")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{\"userNm\":\"テストユーザー\",\"companyCd\":\"001\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.userNm").value("テストユーザー"))
                .andExpect(header().exists("Location"));
    }

    @Test
    void getActiveUsersByCompany_NoUsers_ReturnsEmptyList() throws Exception {
        // モック設定
        given(userService.getActiveUsersByCompany("001")).willReturn(Collections.emptyList());

        // テスト実行＆検証
        mockMvc.perform(get("/api/users/company/001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(0));
    }

    @Test
    void deleteUser_NotFound_Returns404() throws Exception {
        // モック設定
        doThrow(new ResourceNotFoundException("Not Found"))
            .when(userService).deleteUser(anyLong(), anyString());

        // テスト実行＆検証
        mockMvc.perform(delete("/api/users/999?updateUser=admin"))
                .andExpect(status().isNotFound());
    }
}
```

### 4. テスト実行環境の設定

`src/test/resources/application-test.properties`:

```properties
# テスト用H2データベース設定
spring.datasource.url=jdbc:h2:mem:testdb;DB_CLOSE_DELAY=-1
spring.datasource.driver-class-name=org.h2.Driver
spring.datasource.username=sa
spring.datasource.password=

# MyBatis設定
mybatis.configuration.map-underscore-to-camel-case=true
```

`build.gradle`（テスト依存関係）:

```gradle
dependencies {
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.mybatis.spring.boot:mybatis-spring-boot-starter-test:3.0.3'
    testImplementation 'com.h2database:h2'
    testImplementation 'org.mockito:mockito-core:5.4.0'
}
```

### 5. テスト実行方法

1. 単体テスト実行:

```bash
# 全テスト実行
./mvnw test

# 特定のテストクラス実行
./mvnw -Dtest="UserServiceImplTest" test

# MyBatisテストのみ
./mvnw -Dtest="UserMapperTest" test
```

2. カバレッジレポート（Jacoco）:

```gradle
// build.gradleに追加
plugins {
    id 'jacoco'
}

jacocoTestReport {
    reports {
        xml.required = true
        html.required = true
    }
}
```

生成後: `build/reports/jacoco/test/html/index.html` を確認

3. API テスト（Postman）例:

- **POST /api/users**

```json
{
  "companyCd": "001",
  "employeeCd": "EMP100",
  "userNm": "山田太郎",
  "mailAddress": "taro@example.com"
}
```

- **GET /api/users/company/001**  
  ステータス 200、削除済みユーザー含まず

- **DELETE /api/users/100?updateUser=admin**  
  ステータス 204

### テストのポイント

1. **Mapper テスト**:

   - 実データベース接続（H2）
   - SQL クエリの正確性検証
   - 削除フラグのフィルタリング確認

2. **Service テスト**:

   - ビジネスロジック検証
   - 例外パターン網羅
   - モックを使った依存性分離

3. **Controller テスト**:

   - API エンドポイントの HTTP ステータス検証
   - JSON フォーマット検証
   - 認証・バリデーションのテスト

4. **統合テスト**:
   - 実際の API 呼び出し（Postman）
   - エンドツーエンドのフロー確認
   - データベース状態の変化確認

特に重要なのは:

- 削除フラグの扱い（削除済みデータが混入しないか）
- 重複チェックロジック
- パスワードリセット機能
- エラーハンドリングの網羅性

テストカバレッジは最低でも 80%以上を目標に、ビジネスロジック中心に重点的にカバーしてください。
