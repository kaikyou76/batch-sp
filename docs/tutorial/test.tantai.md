<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">Maven + IntelliJ + Spring Boot + Mockito に対応したユニットテスト</span>

ご提示の `UserServiceImpl` クラスはしっかり作り込まれており、テストの対象として非常に良い設計になっています。

以下に、**Maven + IntelliJ + Spring Boot + Mockito** に対応した\**ユニットテスト*を示します。

---

## ✅ 単体テストクラスの作成

`src/test/java/com/example/orgchart_api/service/UserServiceImplTest.java` に以下を記述します：

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

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@SpringBootTest
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
public class UserServiceImplTest {

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
        testUserDto = new UserDto();
        testUserDto.setUserId(1L);
        testUserDto.setMailAddress("test@example.com");
        testUserDto.setCompanyCd("ABC");
        testUserDto.setEmployeeCd("E123");
        testUserDto.setPassword("password123");

        testUser = new User();
        testUser.setUserId(1L);
        testUser.setMailAddress("test@example.com");
        testUser.setCompanyCd("ABC");
        testUser.setEmployeeCd("E123");
        testUser.setPasswordHash("encodedPassword");
        testUser.setDeleted(false);
        testUser.setCreateDate(LocalDateTime.now());
        testUser.setUpdateDate(LocalDateTime.now());
        testUser.setUpdateUser("TEST_USER");
    }

    @Test
    public void createUser_shouldSucceed_whenValidInput() {
        // モック設定 - void メソッド用に修正
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userMapper.existsByMailAddress(anyString(), isNull())).thenReturn(false);
        when(userMapper.existsByCompanyCdAndEmployeeCd(anyString(), anyString(), isNull())).thenReturn(false);

        // ここを doAnswer に変更
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
        verify(userMapper, times(1)).insert(any(User.class));
    }

    @Test
    public void createUser_shouldThrow_whenMailDuplicate() {
        when(userMapper.existsByMailAddress(eq("test@example.com"), isNull()))
                .thenReturn(true);

// 実行 & 検証
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
        when(userMapper.existsByCompanyCdAndEmployeeCd("XYZ", "E456", 1L)).thenReturn(false);

        // 更新用DTO
        UserDto updateDto = new UserDto();
        updateDto.setUserId(1L);
        updateDto.setMailAddress("new@example.com");
        updateDto.setCompanyCd("XYZ");
        updateDto.setEmployeeCd("E456");
        updateDto.setPassword("newPassword");

        // 実行
        UserDto result = userService.updateUser(1L, updateDto);

        // 検証
        assertEquals("new@example.com", result.getMailAddress());
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

## ✅ テスト実行方法

### IntelliJ 上で

- ファイル上で右クリック → `Run 'UserServiceImplTest'`
- 各テストメソッドの横にある ▶ ボタンをクリックしても OK

### Maven CLI から

```bash
mvn test
```

特定のテストクラスだけ実行：

```bash
mvn -Dtest=UserServiceImplTest test
```

---
