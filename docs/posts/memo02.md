<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserMapper インターフェースについて</span>

### UserMapper インターフェースの役割について

```java
package com.example.orgchart_api.mapper;

import com.example.orgchart_api.domain.User;
import com.example.orgchart_api.dto.UserDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface UserMapper {
    @Mapping(target = "createDate", ignore = true)
    @Mapping(target = "updateDate", ignore = true)
    User toEntity(UserDto dto);

    UserDto toDto(User entity);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromDto(UserDto dto, @MappingTarget User entity);
}

```

この `UserMapper` インターフェースは [MapStruct](https://mapstruct.org/) という Java のコード生成ライブラリを使って、`UserDto` と `User` の間のマッピング（変換）を自動で行うためのインターフェースです。

以下で、**各アノテーションの意味**と**インターフェースの書き方**を丁寧に説明します。

---

## ✅ まず、前提：MapStruct とは？

MapStruct は、**DTO ⇔ Entity の変換コードを自動生成**してくれるライブラリです。
たとえば、`UserDto` から `User` を作るメソッドを手書きする代わりに、MapStruct が自動生成します。

---

## ✅ インターフェースの内容とアノテーションの説明

```java
package com.example.orgchart.mapper;

import com.example.orgchart.domain.User;
import com.example.orgchart.dto.UserDto;
import org.mapstruct.*;

@Mapper(componentModel = "spring") // MapStruct が Spring Bean として認識できるように
public interface UserMapper {
```

### ① `@Mapper(componentModel = "spring")`

- `UserMapperImpl` というクラスが自動生成され、それが Spring Bean（`@Component`）になります。
- これにより、`@Autowired` などで DI 可能になります。

---

### ② `@Mapping(target = "createDate", ignore = true)`

```java
@Mapping(target = "createDate", ignore = true)
@Mapping(target = "updateDate", ignore = true)
User toEntity(UserDto dto);
```

- `UserDto` → `User` へ変換するメソッド。
- `createDate` と `updateDate` は DTO にはあるけど、Entity では自動生成されるため無視（`ignore = true`）。

---

### ③ `UserDto toDto(User entity);`

- `User` → `UserDto` の単純な変換。
- 特別なマッピング指定がない場合、**名前が一致するフィールドは自動で対応**されます。

---

### ④ `@BeanMapping(...)` と `@MappingTarget`

```java
@BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
void updateUserFromDto(UserDto dto, @MappingTarget User entity);
```

- `UserDto` のデータで `User` エンティティのフィールドを**更新する**ためのメソッド。
- `@MappingTarget` によって **既存のエンティティに対して変更を加える**。
- `nullValuePropertyMappingStrategy = IGNORE` によって、

  - `dto` の中の値が `null` である場合、それは `entity` のフィールドに**上書きしない**。

---

## ✅ 使い方の例（Spring で自動注入される）

```java
@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserDto getUser(Long id) {
        User user = userRepository.findById(id).orElseThrow();
        return userMapper.toDto(user);
    }

    public void updateUser(Long id, UserDto dto) {
        User user = userRepository.findById(id).orElseThrow();
        userMapper.updateUserFromDto(dto, user);
        userRepository.save(user);
    }
}
```

---

## ✅ ビルドに必要な依存関係

### Maven の場合：

```xml
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct</artifactId>
    <version>1.5.5.Final</version>
</dependency>
<dependency>
    <groupId>org.mapstruct</groupId>
    <artifactId>mapstruct-processor</artifactId>
    <version>1.5.5.Final</version>
    <scope>provided</scope>
</dependency>
```

### Gradle の場合：

```kotlin
dependencies {
    implementation 'org.mapstruct:mapstruct:1.5.5.Final'
    annotationProcessor 'org.mapstruct:mapstruct-processor:1.5.5.Final'
}
```

**Lombok と一緒に使う場合は annotationProcessor を 2 つ指定します：**

```kotlin
annotationProcessor 'org.mapstruct:mapstruct-processor:1.5.5.Final'
annotationProcessor 'org.projectlombok:lombok-mapstruct-binding:0.2.0'
```

---

## ✅ 補足：Mapper 実装クラスの生成場所

ビルド後に `build/generated/sources/annotationProcessor/java/main/` 配下に
`UserMapperImpl.java` が自動生成されます。

---

## ✅ まとめ

| 項目                                 | 説明                                                                     |
| ------------------------------------ | ------------------------------------------------------------------------ |
| `@Mapper(componentModel = "spring")` | Spring Bean として使えるようにする                                       |
| `@Mapping(...)`                      | 個別フィールドのマッピング指定                                           |
| `@BeanMapping(...)`                  | 全体のマッピング戦略を指定                                               |
| `@MappingTarget`                     | 既存のエンティティに上書き更新する時に使う                               |
| `UserMapper`                         | DTO と Entity の双方向変換・更新ロジックを定義するためのインターフェース |

---

もし `MapStruct` を導入していない場合やエラーが出る場合は、`pom.xml` や `build.gradle` の設定、ビルド環境（特に IDE の設定）が正しいか確認してください。必要なら導入方法も案内します。
