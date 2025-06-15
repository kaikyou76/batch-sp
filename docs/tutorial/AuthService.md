## AuthService

```java
package com.example.orgchart_api.service;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.orgchart_api.constants.Constants;
import com.example.orgchart_api.mapper.AppCommonMapper;
import com.example.orgchart_api.mapper.CommonMapper;
import com.example.orgchart_api.model.LoginUserModel;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@Transactional(readOnly = true)
public class AuthService extends BaseService {

    private final AppCommonMapper appCommonMapper;

    public AuthService(CommonMapper commonMapper, AppCommonMapper appCommonMapper) {
        super(commonMapper);
        this.appCommonMapper = appCommonMapper;
    }

    public LoginUserModel authenticate(String loginId) {
        return authenticate(loginId, null);
    }

    public LoginUserModel authenticate(String loginId, String password) {
        Map<String, String> searchMap = new HashMap<>();
        searchMap.put("loginId", loginId);
        searchMap.put("password", password);
        searchMap.put("deleted", Constants.COM_FLG_OFF);

        // ユーザー情報の取得（Optionalで受け取る）
        Optional<Map<String, Object>> resultOptional = appCommonMapper.getUserInfo(searchMap);

        // 認証チェック
        if (resultOptional.isEmpty() || Constants.ROLE_DIV_NOTHING.equals(resultOptional.get().get("userRole"))) {
            log.debug("Authentication failed for loginId: {}", loginId);
            return null;
        }

        // OptionalからMapを取得
        Map<String, Object> resultMap = resultOptional.get();

        // 権限設定
        List<GrantedAuthority> authorities = buildAuthorities((String) resultMap.get("userRole"));

        // BuilderパターンでLoginUserModelを構築
        return new LoginUserModel.Builder(loginId, (String) resultMap.get("password"), authorities)
                .userId(BigDecimal.valueOf((Integer) resultMap.get("userId")))
                .loginId(loginId)
                .kanjiUserName((String) resultMap.get("kanjiUserName"))
                .kanaUserName((String) resultMap.get("kanaUserName"))
                .userRole((String) resultMap.get("userRole"))
                .lastPasswordUpdateTime(((Timestamp) resultMap.get("lastPasswordUpdatetime")).toInstant())
                .build();
    }

    private List<GrantedAuthority> buildAuthorities(String userRole) {
        List<GrantedAuthority> authorities = new ArrayList<>();

        switch (userRole) {
            case Constants.ROLE_DIV_ADMIN:
                authorities.add(new SimpleGrantedAuthority(Constants.ROLE_ADMIN));
                authorities.add(new SimpleGrantedAuthority(Constants.ROLE_CHANGE));
                authorities.add(new SimpleGrantedAuthority(Constants.ROLE_USER));
                break;
            case Constants.ROLE_DIV_CHANGE:
                authorities.add(new SimpleGrantedAuthority(Constants.ROLE_CHANGE));
                authorities.add(new SimpleGrantedAuthority(Constants.ROLE_USER));
                break;
            case Constants.ROLE_DIV_USER:
                authorities.add(new SimpleGrantedAuthority(Constants.ROLE_USER));
                break;
            default:
                log.warn("Unknown role type: {}", userRole);
        }

        return authorities;
    }
}

```
