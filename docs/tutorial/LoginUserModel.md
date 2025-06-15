## LoginUserModel

```java
package com.example.orgchart_api.model;

import java.math.BigDecimal;
import java.time.Instant;
import java.util.Collection;
import java.util.Objects;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

/**
 * ログインユーザの属性情報を格納するモデルクラス
 */
public class LoginUserModel extends User {
    private static final long serialVersionUID = 1L;

    private final BigDecimal userId;
    private final String loginId;
    private final String kanjiUserName;
    private final String kanaUserName;
    private final String userRole;
    private final Instant lastPasswordUpdateTime;

    // プライベートコンストラクタ
    private LoginUserModel(Builder builder) {
        super(builder.username, builder.password,
                builder.enabled, builder.accountNonExpired,
                builder.credentialsNonExpired, builder.accountNonLocked,
                builder.authorities);

        this.userId = builder.userId;
        this.loginId = builder.loginId;
        this.kanjiUserName = builder.kanjiUserName;
        this.kanaUserName = builder.kanaUserName;
        this.userRole = builder.userRole;
        this.lastPasswordUpdateTime = builder.lastPasswordUpdateTime;
    }

    // 従来のコンストラクタも保持（既存コードとの互換性のため）
    public LoginUserModel(String username, String password,
                          Collection<? extends GrantedAuthority> authorities) {
        this(new Builder(username, password, authorities));
    }

    public LoginUserModel(String username, String password, boolean enabled,
                          boolean accountNonExpired, boolean credentialsNonExpired,
                          boolean accountNonLocked,
                          Collection<? extends GrantedAuthority> authorities) {
        this(new Builder(username, password, authorities)
                .enabled(enabled)
                .accountNonExpired(accountNonExpired)
                .credentialsNonExpired(credentialsNonExpired)
                .accountNonLocked(accountNonLocked));
    }

    // Builderクラス
    public static class Builder {
        // 必須フィールド
        private final String username;
        private final String password;
        private final Collection<? extends GrantedAuthority> authorities;

        // オプションフィールド
        private boolean enabled = true;
        private boolean accountNonExpired = true;
        private boolean credentialsNonExpired = true;
        private boolean accountNonLocked = true;
        private BigDecimal userId;
        private String loginId;
        private String kanjiUserName;
        private String kanaUserName;
        private String userRole;
        private Instant lastPasswordUpdateTime;

        public Builder(String username, String password,
                       Collection<? extends GrantedAuthority> authorities) {
            this.username = Objects.requireNonNull(username, "username must not be null");
            this.password = Objects.requireNonNull(password, "password must not be null");
            this.authorities = Objects.requireNonNull(authorities, "authorities must not be null");
        }

        public Builder enabled(boolean enabled) {
            this.enabled = enabled;
            return this;
        }

        public Builder accountNonExpired(boolean accountNonExpired) {
            this.accountNonExpired = accountNonExpired;
            return this;
        }

        public Builder credentialsNonExpired(boolean credentialsNonExpired) {
            this.credentialsNonExpired = credentialsNonExpired;
            return this;
        }

        public Builder accountNonLocked(boolean accountNonLocked) {
            this.accountNonLocked = accountNonLocked;
            return this;
        }

        public Builder userId(BigDecimal userId) {
            this.userId = Objects.requireNonNull(userId, "userId must not be null");
            return this;
        }

        public Builder loginId(String loginId) {
            this.loginId = Objects.requireNonNull(loginId, "loginId must not be null");
            return this;
        }

        public Builder kanjiUserName(String kanjiUserName) {
            this.kanjiUserName = Objects.requireNonNull(kanjiUserName, "kanjiUserName must not be null");
            return this;
        }

        public Builder kanaUserName(String kanaUserName) {
            this.kanaUserName = Objects.requireNonNull(kanaUserName, "kanaUserName must not be null");
            return this;
        }

        public Builder userRole(String userRole) {
            this.userRole = Objects.requireNonNull(userRole, "userRole must not be null");
            return this;
        }

        public Builder lastPasswordUpdateTime(Instant lastPasswordUpdateTime) {
            this.lastPasswordUpdateTime = Objects.requireNonNull(lastPasswordUpdateTime,
                    "lastPasswordUpdateTime must not be null");
            return this;
        }

        public LoginUserModel build() {
            return new LoginUserModel(this);
        }
    }

    // Getterメソッド
    public BigDecimal getUserId() {
        return userId;
    }

    public String getLoginId() {
        return loginId;
    }

    public String getKanjiUserName() {
        return kanjiUserName;
    }

    public String getKanaUserName() {
        return kanaUserName;
    }

    public String getUserRole() {
        return userRole;
    }

    public Instant getLastPasswordUpdateTime() {
        return lastPasswordUpdateTime;
    }

    // equals, hashCode, toString メソッドも実装するのがベストプラクティス
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof LoginUserModel)) return false;
        if (!super.equals(o)) return false;
        LoginUserModel that = (LoginUserModel) o;
        return Objects.equals(userId, that.userId) &&
                Objects.equals(loginId, that.loginId) &&
                Objects.equals(kanjiUserName, that.kanjiUserName) &&
                Objects.equals(kanaUserName, that.kanaUserName) &&
                Objects.equals(userRole, that.userRole) &&
                Objects.equals(lastPasswordUpdateTime, that.lastPasswordUpdateTime);
    }

    @Override
    public int hashCode() {
        return Objects.hash(super.hashCode(), userId, loginId, kanjiUserName,
                kanaUserName, userRole, lastPasswordUpdateTime);
    }

    @Override
    public String toString() {
        return "LoginUserModel{" +
                "userId=" + userId +
                ", loginId='" + loginId + '\'' +
                ", kanjiUserName='" + kanjiUserName + '\'' +
                ", kanaUserName='" + kanaUserName + '\'' +
                ", userRole='" + userRole + '\'' +
                ", lastPasswordUpdateTime=" + lastPasswordUpdateTime +
                "} " + super.toString();
    }
}

```
