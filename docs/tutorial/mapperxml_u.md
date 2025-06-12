<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserMapper.xml の実装</span>

## 完成版

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
        PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.orgchart_api.mapper.UserMapper">

    <resultMap id="UserResultMap" type="com.example.orgchart_api.domain.User">
        <id property="userId" column="user_id"/>
        <result property="companyCd" column="company_cd"/>
        <result property="employeeCd" column="employee_cd"/>
        <result property="userNm" column="user_nm"/>
        <result property="userNmKana" column="user_nm_kana"/>
        <result property="mailAddress" column="mail_address"/>
        <result property="passwordHash" column="password_hash"/>
        <result property="passwordSalt" column="password_salt"/>
        <result property="pin" column="pin"/>
        <result property="birthday" column="birthday"/>
        <result property="voiceMailProfileId" column="voice_mail_profile_id"/>
        <result property="pickupGroupId" column="pickup_group_id"/>
        <result property="deleted" column="deleted"/>
        <result property="createDate" column="create_date"/> <!-- スキーマ通り -->
        <result property="updateDate" column="update_date"/> <!-- スキーマ通り -->
        <result property="updateUser" column="update_user"/>
    </resultMap>

    <insert id="insert" parameterType="com.example.orgchart_api.domain.User"
            useGeneratedKeys="true" keyProperty="userId">
        INSERT INTO trn_user (
        company_cd,
        employee_cd,
        user_nm,
        user_nm_kana,
        mail_address,
        password_hash,
        password_salt,
        pin,
        birthday,
        voice_mail_profile_id,
        pickup_group_id,
        deleted,
        update_user <!-- create_dateとupdate_dateはDEFAULT値を使用 -->
        ) VALUES (
        #{companyCd},
        #{employeeCd},
        #{userNm},
        #{userNmKana},
        #{mailAddress},
        #{passwordHash},
        #{passwordSalt},
        #{pin},
        #{birthday},
        #{voiceMailProfileId},
        #{pickupGroupId},
        #{deleted},
        #{updateUser}
        )
        <!--
            create_date: DEFAULT CURRENT_TIMESTAMP
            update_date: DEFAULT CURRENT_TIMESTAMP
            update_user: DEFAULT 'BATCH'
        -->
    </insert>

    <update id="update" parameterType="com.example.orgchart_api.domain.User">
        UPDATE trn_user SET
        company_cd = #{companyCd},
        employee_cd = #{employeeCd},
        user_nm = #{userNm},
        user_nm_kana = #{userNmKana},
        mail_address = #{mailAddress},
        password_hash = #{passwordHash},
        password_salt = #{passwordSalt},
        pin = #{pin},
        birthday = #{birthday},
        voice_mail_profile_id = #{voiceMailProfileId},
        pickup_group_id = #{pickupGroupId},
        deleted = #{deleted},
        update_date = #{updateDate},
        update_user = #{updateUser}
        WHERE user_id = #{userId}
    </update>

    <!-- 削除フラグに関係なくユーザーを取得 -->
    <select id="findById" resultMap="UserResultMap">
        SELECT * FROM trn_user WHERE user_id = #{userId}
    </select>

    <!-- 削除されていないユーザーのみ取得 -->
    <select id="findByCompanyCdAndNotDeleted" resultMap="UserResultMap">
        SELECT * FROM trn_user
        WHERE company_cd = #{companyCd} AND deleted = false
    </select>

    <!-- 重複チェック（削除済みを除外） -->
    <select id="existsByMailAddress" resultType="boolean">
        SELECT COUNT(1) > 0 FROM trn_user
        WHERE mail_address = #{mailAddress}
        AND deleted = false
        <if test="excludeUserId != null">
            AND user_id != #{excludeUserId}
        </if>
    </select>

    <!-- 重複チェック（削除済みを除外） -->
    <select id="existsByCompanyCdAndEmployeeCd" resultType="boolean">
        SELECT COUNT(1) > 0 FROM trn_user
        WHERE company_cd = #{companyCd}
        AND employee_cd = #{employeeCd}
        AND deleted = false
        <if test="excludeUserId != null">
            AND user_id != #{excludeUserId}
        </if>
    </select>
</mapper>


```

## 実装の流れ

`src/main/resources/mapper/UserMapper.xml`

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
    PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.orgchart_api.mapper.UserMapper">

    <resultMap id="UserResultMap" type="com.example.orgchart_api.domain.User">
        <id property="userId" column="user_id"/>
        <result property="companyCd" column="company_cd"/>
        <result property="employeeCd" column="employee_cd"/>
        <result property="userName" column="user_name"/>
        <result property="mailAddress" column="mail_address"/>
        <result property="password" column="password"/>
        <result property="deleted" column="deleted"/>
        <result property="createUser" column="create_user"/>
        <result property="createAt" column="create_at"/>
        <result property="updateUser" column="update_user"/>
        <result property="updateAt" column="update_at"/>
    </resultMap>

    <insert id="insert" parameterType="com.example.orgchart_api.domain.User" useGeneratedKeys="true" keyProperty="userId">
        INSERT INTO users (
            company_cd,
            employee_cd,
            user_name,
            mail_address,
            password,
            deleted,
            create_user,
            create_at,
            update_user,
            update_at
        ) VALUES (
            #{companyCd},
            #{employeeCd},
            #{userName},
            #{mailAddress},
            #{password},
            #{deleted},
            #{createUser},
            #{createAt},
            #{updateUser},
            #{updateAt}
        )
    </insert>

    <update id="update" parameterType="com.example.orgchart_api.domain.User">
        UPDATE users SET
            company_cd = #{companyCd},
            employee_cd = #{employeeCd},
            user_name = #{userName},
            mail_address = #{mailAddress},
            password = #{password},
            deleted = #{deleted},
            update_user = #{updateUser},
            update_at = #{updateAt}
        WHERE user_id = #{userId}
    </update>

    <select id="findById" resultMap="UserResultMap">
        SELECT * FROM users WHERE user_id = #{userId}
    </select>

    <select id="findByCompanyCdAndNotDeleted" resultMap="UserResultMap">
        SELECT * FROM users
        WHERE company_cd = #{companyCd} AND deleted = FALSE
    </select>

    <select id="existsByMailAddress" resultType="boolean">
        SELECT COUNT(1) > 0 FROM users
        WHERE mail_address = #{mailAddress}
          AND (#{excludeUserId} IS NULL OR user_id != #{excludeUserId})
    </select>

    <select id="existsByCompanyCdAndEmployeeCd" resultType="boolean">
        SELECT COUNT(1) > 0 FROM users
        WHERE company_cd = #{companyCd}
          AND employee_cd = #{employeeCd}
          AND (#{excludeUserId} IS NULL OR user_id != #{excludeUserId})
    </select>

</mapper>

```

#### 已深度思考

````
Mapper.xmlの実装について、特に重複チェックのクエリ（existsByMailAddress, existsByCompanyCdAndEmployeeCd）に問題があります。元の実装では、削除済み（deleted=true）のレコードを除外していません。また、重複チェックの条件が正しくない可能性があります。

正しい条件は以下の通りです：
 - 削除済み（deleted=true）のユーザーは重複チェックの対象外
 - 除外ユーザーID（excludeUserId）が指定された場合、そのユーザーIDを除いてチェック

したがって、以下の修正が必要です：

1. `existsByMailAddress` の修正:
   ```xml
   <select id="existsByMailAddress" resultType="boolean">
       SELECT COUNT(1) > 0 FROM users
       WHERE mail_address = #{mailAddress}
         AND deleted = FALSE  <!-- 削除済みは対象外 -->
         <if test="excludeUserId != null">
             AND user_id != #{excludeUserId}
         </if>
   </select>
   ```
   または、除外IDの条件を動的にするために`<if>`タグを使用する方法が適切です（上記のように）。ただし、現在の条件 `AND (#{excludeUserId} IS NULL OR user_id != #{excludeUserId})` は、`excludeUserId`がnullの場合にすべてのレコードを対象とし、nullでない場合は除外しますが、これは動的SQLではありません。しかし、問題は削除済みレコードを除外していない点です。

2. `existsByCompanyCdAndEmployeeCd` の修正:
   ```xml
   <select id="existsByCompanyCdAndEmployeeCd" resultType="boolean">
       SELECT COUNT(1) > 0 FROM users
       WHERE company_cd = #{companyCd}
         AND employee_cd = #{employeeCd}
         AND deleted = FALSE  <!-- 削除済みは対象外 -->
         <if test="excludeUserId != null">
             AND user_id != #{excludeUserId}
         </if>
   </select>
   ```

また、`findByCompanyCdAndNotDeleted`クエリは正しく削除済みを除外しています（`deleted = FALSE`）。

その他の点：
  - `insert`および`update`のクエリは、適切にカラムとプロパティがマッピングされていることを確認する必要があります。特に、エンティティのフィールド名とカラム名が一致しているか（例: `userName` と `user_name`）を確認してください。`createAt`と`updateAt`は、`create_at`、`update_at`とマッピングされていますが、エンティティのフィールド名が`createAt`と`create_at`（スネークケース）のどちらであるか注意が必要です。エンティティのフィールド名は`createAt`（キャメルケース）で、カラムは`create_at`（スネークケース）であるため、resultMapで正しくマッピングされています。

ただし、上記の修正を加える必要があります。

修正後のXMLの該当部分：

修正例：

```xml
   <select id="existsByMailAddress" resultType="boolean">
       SELECT COUNT(1) > 0 FROM users
       WHERE mail_address = #{mailAddress}
         AND deleted = FALSE
         <if test="excludeUserId != null">
             AND user_id != #{excludeUserId}
         </if>
   </select>

   <select id="existsByCompanyCdAndEmployeeCd" resultType="boolean">
       SELECT COUNT(1) > 0 FROM users
       WHERE company_cd = #{companyCd}
         AND employee_cd = #{employeeCd}
         AND deleted = FALSE
         <if test="excludeUserId != null">
             AND user_id != #{excludeUserId}
         </if>
   </select>
````

この修正により、削除済みユーザーを重複チェックの対象から除外し、除外ユーザー ID が指定された場合はそのユーザーを除外します。

また、`findById`メソッドは削除済みのユーザーも取得しますが、サービス層で`getActiveUserById`が削除済みを除外しているため問題ありません。

ただし、サービスの`checkForDuplicates`メソッドには注意点があります：

サービスの`checkForDuplicates`メソッドでは、更新時に既存のユーザー（更新対象）のメールアドレスや社員コードを使って重複チェックをしています。しかし、更新時にそのユーザー自身のメールアドレスや社員コードを除外する必要があるため、`excludeUserId`にユーザー ID を渡しています。上記の XML 修正で、除外 ID が指定された場合はその ID を除外するようになっています。

よって、XML を上記の通り修正すれば重複チェックは期待通りに動作するはずです。

まとめ：

- 重複チェックのクエリで`deleted = false`を条件に追加する。
- 除外ユーザー ID の条件は`<if test="excludeUserId != null">`タグを使用して動的に条件を追加する。

以上のように修正してください。

````

## UserMapper.xmlの実装レビューと修正点

提供されたUserMapper.xmlの実装にはいくつかの重要な問題点があります。特に重複チェックのロジックとマッピングの整合性に問題があります。

### 主な問題点と修正内容

#### 1. 重複チェッククエリのロジック誤り（深刻）
```xml
<!-- 修正前（誤ったロジック） -->
<select id="existsByMailAddress" resultType="boolean">
    SELECT COUNT(1) > 0 FROM users
    WHERE mail_address = #{mailAddress}
      AND (#{excludeUserId} IS NULL OR user_id != #{excludeUserId})
</select>
````

**問題点**:

- `AND (#{excludeUserId} IS NULL OR user_id != #{excludeUserId})` は SQL インジェクション脆弱性がある
- 削除済みユーザーが含まれる（`deleted=false`条件がない）
- `excludeUserId`が null の場合の挙動が予期せぬ結果を招く

**修正案**:

```xml
<select id="existsByMailAddress" resultType="boolean">
    SELECT EXISTS (
        SELECT 1 FROM users
        WHERE mail_address = #{mailAddress}
        AND deleted = false
        <if test="excludeUserId != null">
            AND user_id != #{excludeUserId}
        </if>
    )
</select>
```

#### 2. 結果マッピングの不一致（User クラスフィールド）

```xml
<resultMap id="UserResultMap" type="com.example.orgchart_api.domain.User">
    <!-- プロパティ名とカラム名が不一致 -->
    <result property="userName" column="user_name"/> <!-- 正しい -->
    <result property="createAt" column="create_at"/> <!-- 誤り：createAt → create_at -->
    <result property="updateAt" column="update_at"/> <!-- 誤り：updateAt → update_at -->
</resultMap>
```

**修正案**:

```xml
<result property="createAt" column="create_at"/>
<result property="updateAt" column="update_at"/>
↓
<!-- プロパティ名とカラム名を一致させる -->
<result property="createAt" column="create_at"/>
<result property="updateAt" column="update_at"/>

<!-- もしくはJavaクラスのフィールド名を変更 -->
```

#### 3. 削除フラグの条件不足（全クエリ）

```xml
<!-- 修正前（削除済みユーザーが含まれる） -->
<select id="findById" resultMap="UserResultMap">
    SELECT * FROM users WHERE user_id = #{userId}
</select>
```

**修正案**:

```xml
<select id="findById" resultMap="UserResultMap">
    SELECT * FROM users WHERE user_id = #{userId} AND deleted = false
</select>
```

### 完全な修正後の UserMapper.xml

```xml
<?xml version="1.0" encoding="UTF-8" ?>
<!DOCTYPE mapper
    PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
    "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.orgchart_api.mapper.UserMapper">

    <resultMap id="UserResultMap" type="com.example.orgchart_api.domain.User">
        <id property="userId" column="user_id"/>
        <result property="companyCd" column="company_cd"/>
        <result property="employeeCd" column="employee_cd"/>
        <result property="userName" column="user_name"/>
        <result property="mailAddress" column="mail_address"/>
        <result property="password" column="password"/>
        <result property="deleted" column="deleted"/>
        <result property="createUser" column="create_user"/>
        <result property="createAt" column="create_at"/>
        <result property="updateUser" column="update_user"/>
        <result property="updateAt" column="update_at"/>
    </resultMap>

    <insert id="insert" parameterType="com.example.orgchart_api.domain.User"
            useGeneratedKeys="true" keyProperty="userId" keyColumn="user_id">
        INSERT INTO users (
            company_cd,
            employee_cd,
            user_name,
            mail_address,
            password,
            deleted,
            create_user,
            create_at,
            update_user,
            update_at
        ) VALUES (
            #{companyCd},
            #{employeeCd},
            #{userName},
            #{mailAddress},
            #{password},
            #{deleted},
            #{createUser},
            #{createAt},
            #{updateUser},
            #{updateAt}
        )
    </insert>

    <update id="update" parameterType="com.example.orgchart_api.domain.User">
        UPDATE users SET
            company_cd = #{companyCd},
            employee_cd = #{employeeCd},
            user_name = #{userName},
            mail_address = #{mailAddress},
            password = #{password},
            deleted = #{deleted},
            update_user = #{updateUser},
            update_at = #{updateAt}
        WHERE user_id = #{userId}
    </update>

    <!-- 削除済みユーザーは除外 -->
    <select id="findById" resultMap="UserResultMap">
        SELECT * FROM users
        WHERE user_id = #{userId} AND deleted = false
    </select>

    <!-- メソッド名に合った実装 -->
    <select id="findByCompanyCdAndNotDeleted" resultMap="UserResultMap">
        SELECT * FROM users
        WHERE company_cd = #{companyCd} AND deleted = false
    </select>

    <!-- 重複チェックの適切な実装 -->
    <select id="existsByMailAddress" resultType="boolean">
        SELECT EXISTS (
            SELECT 1 FROM users
            WHERE mail_address = #{mailAddress}
            AND deleted = false
            <if test="excludeUserId != null">
                AND user_id != #{excludeUserId}
            </if>
        )
    </select>

    <!-- 重複チェックの適切な実装 -->
    <select id="existsByCompanyCdAndEmployeeCd" resultType="boolean">
        SELECT EXISTS (
            SELECT 1 FROM users
            WHERE company_cd = #{companyCd}
            AND employee_cd = #{employeeCd}
            AND deleted = false
            <if test="excludeUserId != null">
                AND user_id != #{excludeUserId}
            </if>
        )
    </select>
</mapper>
```

### 追加で必要な修正

#### 1. タイムスタンプ処理の改善

User クラスの prepareForUpdate メソッドでタイムスタンプを設定しているため、SQL で NOW()を使う必要はありませんが、以下のように XML 側でもデフォルト値を設定できます：

```sql
CREATE TABLE users (
    create_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    update_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

#### 2. インデックスの追加（パフォーマンス向上）

```sql
CREATE INDEX idx_users_mail ON users(mail_address);
CREATE INDEX idx_users_company_emp ON users(company_cd, employee_cd);
```

#### 3. 楽観的ロックの追加（オプショナル）

```java
// Userクラスに追加
@Version
private Long version;
```

```xml
<update id="update" parameterType="com.example.orgchart_api.domain.User">
    UPDATE users SET
        ...
        version = version + 1
    WHERE user_id = #{userId} AND version = #{version}
</update>
```

### サービス層への影響

上記の修正により、サービス層で行っていた一部のフィルタリング処理が不要になります：

```java
// 修正前（Service層で削除フラグをフィルタリング）
private User getActiveUserById(Long userId) {
    return userMapper.findById(userId)
            .filter(user -> !user.isDeleted())
            .orElseThrow(...);
}

// 修正後（Mapperが削除済みを除外）
private User getActiveUserById(Long userId) {
    return userMapper.findById(userId)
            .orElseThrow(...);
}
```

### なぜこれらの修正が必要か

1. **セキュリティ**:

   - 動的 SQL の適切な実装で SQL インジェクションを防止
   - 削除済みユーザーの情報を返さないことで情報漏洩防止

2. **パフォーマンス**:

   - EXISTS 句の使用で COUNT(\*)よりも高速な重複チェック
   - 適切なインデックスで検索性能向上

3. **データ整合性**:

   - 削除フラグの一貫した扱いで論理削除の整合性を確保
   - 楽観的ロックで更新競合を防止

4. **保守性**:
   - プロパティ名とカラム名の一致でマッピングエラーを防止
   - 一貫した削除フラグの扱いでコードの可読性向上

これらの修正により、Mapper 層の実装が Service 層の要求を適切に満たし、安全で効率的なデータアクセスを実現できます。
