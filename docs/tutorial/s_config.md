<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">セキュリティ設定 SecurityConfig クラスの実装</span>

`src/main/java/com/example/orgchart_api/config/SecurityConfig.java`

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
        return userMapper.findByCompanyCd(companyCd).stream()
                .filter(u -> !u.isDeleted()) // 削除済みユーザーを除外
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
        checkForDuplicates(existingUser, userId);

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
