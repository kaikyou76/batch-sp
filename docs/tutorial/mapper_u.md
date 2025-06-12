<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserMapper インタフェースの実装</span>

## 完成版

`src/main/java/com/example/orgchart_api/mapper/UserMapper.java`

```java
package com.example.orgchart_api.mapper;

import com.example.orgchart_api.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {

    void insert(User user);

    void update(User user);

    Optional<User> findById(@Param("userId") Long userId);

    List<User> findByCompanyCdAndNotDeleted(@Param("companyCd") String companyCd);

    boolean existsByMailAddress(@Param("mailAddress") String mailAddress, @Param("excludeUserId") Long excludeUserId);

    boolean existsByCompanyCdAndEmployeeCd(@Param("companyCd") String companyCd,
                                           @Param("employeeCd") String employeeCd,
                                           @Param("excludeUserId") Long excludeUserId);
}


```

#### 已深度思考

````
えられたUserMapperインターフェースと、それを実装するXMLマッピング（またはアノテーション）が存在する前提です。
 UserServiceImplで使用されているメソッドとUserMapperインターフェースで宣言されているメソッドを比較し、整合性を確認します。

 UserServiceImplで使用されているUserMapperのメソッドは以下の通りです：
 - insert(user)
 - update(user)
 - findById(userId)
 - findByCompanyCdAndNotDeleted(companyCd)
 - existsByMailAddress(mailAddress, excludeUserId)
 - existsByCompanyCdAndEmployeeCd(companyCd, employeeCd, excludeUserId)

 UserMapperインターフェースで宣言されているメソッドは、上記と完全に一致しています。

 しかし、注意すべき点がいくつかあります：

 1. `findByCompanyCdAndNotDeleted`メソッド：
    実装では、削除済み（deleted=true）のユーザーを除外して取得する必要があります。
    SQLクエリで`deleted = false`を条件に追加する必要があります。

 2. 重複チェック用のメソッド（existsByMailAddress, existsByCompanyCdAndEmployeeCd）：
    実装では、除外するユーザーID（excludeUserId）が指定された場合、そのユーザーIDを除外して重複チェックを行う必要があります。
    また、削除済み（deleted=true）のユーザーは重複チェックの対象外とするかどうか（通常は削除済みは対象外）を考慮する必要があります。

 3. パラメータ名の一致：
    Mapperインターフェースでは@Paramアノテーションを使ってパラメータ名を指定しているので、XMLマッピングまたはアノテーション内で同じパラメータ名を使用する必要があります。

 4. 削除済みユーザーの扱い：
    通常、論理削除されたユーザーは取得や重複チェックの対象外とします。したがって、SQLクエリでは`deleted = false`の条件を追加する必要があります。

 ここでは、XMLマッピングの例を示します（もしアノテーションを使用している場合は適宜調整してください）。

 ### UserMapper.xmlの例

 ```xml
 <?xml version="1.0" encoding="UTF-8"?>
 <!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN" "http://mybatis.org/dtd/mybatis-3-mapper.dtd">
 <mapper namespace="com.example.orgchart_api.mapper.UserMapper">

     <insert id="insert" useGeneratedKeys="true" keyProperty="userId">
         INSERT INTO trn_user (company_cd, employee_cd, user_nm, mail_address, password, deleted, create_user, create_time, update_user, update_time)
         VALUES (#{companyCd}, #{employeeCd}, #{userNm}, #{mailAddress}, #{password}, #{deleted}, #{createUser}, #{createTime}, #{updateUser}, #{updateTime})
     </insert>

     <update id="update">
         UPDATE trn_user
         SET
           company_cd = #{companyCd},
           employee_cd = #{employeeCd},
           user_nm = #{userNm},
           mail_address = #{mailAddress},
           password = #{password},
           deleted = #{deleted},
           update_user = #{updateUser},
           update_time = #{updateTime}
         WHERE user_id = #{userId}
     </update>

     <select id="findById" resultType="User">
         SELECT * FROM trn_user WHERE user_id = #{userId}
     </select>

     <select id="findByCompanyCdAndNotDeleted" resultType="User">
         SELECT * FROM trn_user
         WHERE company_cd = #{companyCd} AND deleted = false
     </select>

     <select id="existsByMailAddress" resultType="boolean">
         SELECT COUNT(*) > 0
         FROM trn_user
         WHERE mail_address = #{mailAddress}
         AND deleted = false
         <if test="excludeUserId != null">
             AND user_id != #{excludeUserId}
         </if>
     </select>

     <select id="existsByCompanyCdAndEmployeeCd" resultType="boolean">
         SELECT COUNT(*) > 0
         FROM trn_user
         WHERE company_cd = #{companyCd}
         AND employee_cd = #{employeeCd}
         AND deleted = false
         <if test="excludeUserId != null">
             AND user_id != #{excludeUserId}
         </if>
     </select>
 </mapper>
````

上記の XML マッピングは、UserServiceImpl が期待する動作を実現するための条件を満たしています。

ただし、以下の点に注意してください：

- `insert`および`update`のクエリ：実際のデータベースのカラム名とエンティティのフィールド名が一致していることを確認してください。
- `existsByMailAddress`と`existsByCompanyCdAndEmployeeCd`：COUNT(\*) > 0 は、条件に合致するレコードが 1 件以上存在すれば true を返します。これは重複チェックの条件として適切です。
- `findByCompanyCdAndNotDeleted`：`deleted = false`を条件に追加することで、削除済みユーザーを除外しています。

また、`UserMapper`インターフェースと XML マッピングが正しく関連付けられていることも確認する必要があります。MyBatis の設定によっては、XML ファイルの配置場所や名前を規約に従っている必要があります（例：`src/main/resources/com/example/orgchart_api/mapper/UserMapper.xml`）。

もしアノテーションで実装する場合は、以下のようになります（ただし、複雑な動的クエリの場合は XML の方が可読性が高いです）：

```java
@Mapper
public interface UserMapper {
    @Insert("INSERT INTO trn_user (company_cd, employee_cd, user_nm, mail_address, password, deleted, create_user, create_time, update_user, update_time) " +
            "VALUES (#{companyCd}, #{employeeCd}, #{userNm}, #{mailAddress}, #{password}, #{deleted}, #{createUser}, #{createTime}, #{updateUser}, #{updateTime})")
    @Options(useGeneratedKeys = true, keyProperty = "userId")
    void insert(User user);

    @Update("UPDATE trn_user " +
            "SET company_cd=#{companyCd}, employee_cd=#{employeeCd}, user_nm=#{userNm}, mail_address=#{mailAddress}, password=#{password}, deleted=#{deleted}, update_user=#{updateUser}, update_time=#{updateTime} " +
            "WHERE user_id=#{userId}")
    void update(User user);

    @Select("SELECT * FROM trn_user WHERE user_id = #{userId}")
    Optional<User> findById(Long userId);

    @Select("SELECT * FROM trn_user WHERE company_cd = #{companyCd} AND deleted = false")
    List<User> findByCompanyCdAndNotDeleted(String companyCd);

    // existsByMailAddressの動的なクエリはXMLで書くか、@SelectProviderを利用する
    // ここではXMLを利用することを推奨するため、アノテーションでは省略
}
```

動的条件を含むクエリ（existsByMailAddress など）をアノテーションで書くのは複雑なので、XML での実装を推奨します。

結論として、UserMapper インターフェースは UserServiceImpl の要件を満たしており、XML マッピングが上記のように実装されていれば正しく動作するはずです。もし XML マッピングが異なる場合は、上記の例に合わせて修正する必要があります。

````

## Mapperインターフェースの実装に関するレビュー

提供されたUserMapperインターフェースは、UserServiceImplで使用されているメソッドと概ね適合していますが、いくつかの改善点があります。以下に詳細を分析します：

### 適合している点
1. **必要なメソッドの宣言**:
   - `insert()`, `update()`, `findById()`, `findByCompanyCdAndNotDeleted()`, `existsByMailAddress()`, `existsByCompanyCdAndEmployeeCd()` の全てが宣言されている

2. **パラメータの整合性**:
   - メソッドのパラメータ名が`@Param`アノテーションで正しく指定されている
   - `excludeUserId`パラメータがオプションとして適切に定義されている

### 改善が必要な点

#### 1. `findById()`メソッドの検索対象
- **問題点**: 削除済みユーザーも取得可能
- **影響**: 実装クラスでは`getActiveUserById()`で削除フラグをチェックしているが、Mapperレベルでフィルタリングすべき
- **改善案**:
  ```java
  Optional<User> findById(@Param("userId") Long userId);
  ↓
  Optional<User> findActiveById(@Param("userId") Long userId);
````

#### 2. `findByCompanyCdAndNotDeleted()`の命名

- **問題点**: メソッド名が冗長
- **改善案**:
  ```java
  List<User> findByCompanyCdAndNotDeleted(@Param("companyCd") String companyCd);
  ↓
  List<User> findActiveByCompanyCd(@Param("companyCd") String companyCd);
  ```

#### 3. 論理削除済みユーザーの取得メソッド不足

- **問題点**: 管理機能などで削除済みユーザーを取得する必要がある場合に対応できない
- **改善案**:

  ```java
  // 削除済みユーザーを含む取得
  List<User> findAllByCompanyCd(@Param("companyCd") String companyCd);

  // 削除済みユーザーのみ取得
  List<User> findDeletedByCompanyCd(@Param("companyCd") String companyCd);
  ```

#### 4. ページネーション対応の不足

- **問題点**: 大量データ取得時のパフォーマンス問題が発生する可能性
- **改善案**:
  ```java
  List<User> findActiveByCompanyCd(@Param("companyCd") String companyCd,
                                  @Param("offset") int offset,
                                  @Param("limit") int limit);
  ```

### 完全な改善後の Mapper インターフェース

```java
package com.example.orgchart_api.mapper;

import com.example.orgchart_api.domain.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Optional;

@Mapper
public interface UserMapper {
    void insert(User user);
    void update(User user);

    // アクティブユーザー専用検索
    Optional<User> findActiveById(@Param("userId") Long userId);
    List<User> findActiveByCompanyCd(@Param("companyCd") String companyCd);

    // ページネーション対応
    List<User> findActiveByCompanyCdWithPagination(
        @Param("companyCd") String companyCd,
        @Param("offset") int offset,
        @Param("limit") int limit
    );

    // 全ユーザー検索（削除済み含む）
    Optional<User> findAnyById(@Param("userId") Long userId);
    List<User> findAllByCompanyCd(@Param("companyCd") String companyCd);

    // 重複チェック
    boolean existsByMailAddress(
        @Param("mailAddress") String mailAddress,
        @Param("excludeUserId") Long excludeUserId
    );

    boolean existsByCompanyCdAndEmployeeCd(
        @Param("companyCd") String companyCd,
        @Param("employeeCd") String employeeCd,
        @Param("excludeUserId") Long excludeUserId
    );

    // 論理削除済みユーザー検索
    List<User> findDeletedByCompanyCd(@Param("companyCd") String companyCd);
}
```

### 対応する XML マッピングの実装例

```xml
<!-- アクティブユーザー検索 -->
<select id="findActiveById" resultType="User">
    SELECT * FROM trn_user
    WHERE user_id = #{userId} AND deleted = false
</select>

<select id="findActiveByCompanyCd" resultType="User">
    SELECT * FROM trn_user
    WHERE company_cd = #{companyCd} AND deleted = false
    ORDER BY employee_cd
</select>

<!-- ページネーション対応 -->
<select id="findActiveByCompanyCdWithPagination" resultType="User">
    SELECT * FROM trn_user
    WHERE company_cd = #{companyCd} AND deleted = false
    ORDER BY employee_cd
    LIMIT #{limit} OFFSET #{offset}
</select>

<!-- 全ユーザー検索（削除済み含む） -->
<select id="findAnyById" resultType="User">
    SELECT * FROM trn_user WHERE user_id = #{userId}
</select>

<select id="findAllByCompanyCd" resultType="User">
    SELECT * FROM trn_user
    WHERE company_cd = #{companyCd}
    ORDER BY deleted ASC, employee_cd
</select>

<!-- 重複チェック -->
<select id="existsByMailAddress" resultType="boolean">
    SELECT EXISTS (
        SELECT 1 FROM trn_user
        WHERE mail_address = #{mailAddress}
        AND deleted = false
        <if test="excludeUserId != null">
            AND user_id != #{excludeUserId}
        </if>
    )
</select>

<select id="existsByCompanyCdAndEmployeeCd" resultType="boolean">
    SELECT EXISTS (
        SELECT 1 FROM trn_user
        WHERE company_cd = #{companyCd}
        AND employee_cd = #{employeeCd}
        AND deleted = false
        <if test="excludeUserId != null">
            AND user_id != #{excludeUserId}
        </if>
    )
</select>

<!-- 削除済みユーザー検索 -->
<select id="findDeletedByCompanyCd" resultType="User">
    SELECT * FROM trn_user
    WHERE company_cd = #{companyCd} AND deleted = true
    ORDER BY update_time DESC
</select>
```

### UserServiceImpl への影響と対応

実装クラスでは、以下の変更が必要です：

```java
// 変更前
private User getActiveUserById(Long userId) {
    return userMapper.findById(userId)
            .filter(user -> !user.isDeleted())
            .orElseThrow(...);
}

// 変更後（パフォーマンス向上）
private User getActiveUserById(Long userId) {
    return userMapper.findActiveById(userId)
            .orElseThrow(...);
}
```

```java
// 変更前
List<UserDto> getActiveUsersByCompany(String companyCd) {
    return userMapper.findByCompanyCdAndNotDeleted(companyCd).stream()
            .map(...)
            .collect(...);
}

// 変更後（命名の簡潔化）
List<UserDto> getActiveUsersByCompany(String companyCd) {
    return userMapper.findActiveByCompanyCd(companyCd).stream()
            .map(...)
            .collect(...);
}
```

### 追加推奨事項

1. **インデックスの追加**:

   ```sql
   CREATE INDEX idx_company_cd ON trn_user(company_cd);
   CREATE INDEX idx_mail_address ON trn_user(mail_address);
   CREATE INDEX idx_company_employee ON trn_user(company_cd, employee_cd);
   ```

2. **ソフトデリートの実装**:

   ```java
   @TableLogic
   private boolean deleted;
   ```

3. **バージョニングによる楽観的ロック**:
   ```java
   @Version
   private Long version;
   ```

これらの改善により、Mapper 層と Service 層の整合性が高まり、より効率的で保守性の高いコードベースを構築できます。特に、`findActiveById`の導入は不要なフィルタリング処理を削減し、パフォーマンス向上に寄与します。
