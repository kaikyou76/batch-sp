<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserController クラスの実装</span>

## 完成版

```java

```

## 実装の流れ

```java
package com.example.orgchart_api.controller;

import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import com.example.orgchart_api.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * 新しいユーザーを作成
     * @param userDto ユーザー情報
     * @return 作成されたユーザー情報
     */
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        try {
            UserDto createdUser = userService.createUser(userDto);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdUser);
        } catch (DuplicateResourceException e) {
            throw e; // 重複エラーは例外ハンドラで処理
        }
    }

    /**
     * ユーザーIDでユーザーを取得
     * @param userId ユーザーID
     * @return ユーザー情報
     */
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        UserDto user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    /**
     * 企業コードでアクティブなユーザーを取得
     * @param companyCd 企業コード
     * @return ユーザーリスト
     */
    @GetMapping("/company/{companyCd}")
    public ResponseEntity<List<UserDto>> getActiveUsersByCompany(@PathVariable String companyCd) {
        List<UserDto> users = userService.getActiveUsersByCompany(companyCd);
        return ResponseEntity.ok(users);
    }

    /**
     * ユーザー情報を更新
     * @param userId ユーザーID
     * @param userDto 更新情報
     * @return 更新されたユーザー情報
     */
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long userId,
            @RequestBody UserDto userDto) {
        try {
            UserDto updatedUser = userService.updateUser(userId, userDto);
            return ResponseEntity.ok(updatedUser);
        } catch (ResourceNotFoundException e) {
            throw e; // リソースなしエラーは例外ハンドラで処理
        } catch (DuplicateResourceException e) {
            throw e; // 重複エラーは例外ハンドラで処理
        }
    }

    /**
     * ユーザーを論理削除
     * @param userId ユーザーID
     * @param updateUser 更新ユーザー（操作者）
     * @return 204 No Content
     */
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long userId,
            @RequestParam String updateUser) {
        userService.deleteUser(userId, updateUser);
        return ResponseEntity.noContent().build();
    }

    /**
     * パスワードリセット
     * @param userId ユーザーID
     * @return 204 No Content
     */
    @PostMapping("/{userId}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable Long userId) {
        userService.resetPassword(userId);
        return ResponseEntity.noContent().build();
    }

    /**
     * リソースが見つからない場合の例外処理
     */
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    /**
     * リソース重複の場合の例外処理
     */
    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<String> handleDuplicateResource(DuplicateResourceException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    /**
     * 不正なリクエストの場合の例外処理
     */
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}

```

#### 已深度思考

```
存のコントローラのまま、JSON形式のレスポンスを返すように修正します。ただし、成功時は通常のデータを返し、エラー時は例外ハンドラでメッセージを返す現在の形式を維持します。
ただし、RESTfulな設計にするために以下の点を修正します：

1. ユーザー作成時のレスポンス：ステータスコード201とLocationヘッダの追加
2. 削除メソッドの操作者情報：セキュリティコンテキストから取得（Spring Securityを想定）
3. エラーハンドリング：グローバル例外ハンドラ（`@ControllerAdvice`）を推奨しますが、コントローラ内の例外ハンドラをそのまま使用
4. パスワードリセットのHTTPメソッド：POSTからPUTに変更（冪等性のため）

また、コントローラ内の`deleteUser`メソッドで`updateUser`をリクエストパラメータから取得するのではなく、認証情報から取得するように変更します。

ただし、Spring Securityを導入していない場合は、一時的にリクエストパラメータを受け取る形を残すか、ダミーデータを設定します。

修正方針：
  - グローバル例外ハンドラは使用せず、コントローラ内の例外ハンドラを維持
  - レスポンスボディは現状通り（エラー時は文字列、成功時はDTOまたはリスト）
  - ユーザー作成時のみLocationヘッダを追加

以下、修正後のコード：

```

# 簡潔な REST コントローラの実装（JSON 形式）

提供いただいたコードを元に、JSON 形式のレスポンスをシンプルに保ちつつ、必要最小限の改善を施した実装です。

```java
package com.example.orgchart_api.controller;

import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;
import com.example.orgchart_api.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ユーザー作成
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserDto userDto) {
        UserDto createdUser = userService.createUser(userDto);

        // 作成したリソースのURIを生成
        URI location = ServletUriComponentsBuilder
                .fromCurrentRequest()
                .path("/{id}")
                .buildAndExpand(createdUser.getUserId())
                .toUri();

        return ResponseEntity.created(location).body(createdUser);
    }

    // ユーザー取得（ID指定）
    @GetMapping("/{userId}")
    public ResponseEntity<UserDto> getUserById(@PathVariable Long userId) {
        UserDto user = userService.getUserById(userId);
        return ResponseEntity.ok(user);
    }

    // 企業別ユーザー一覧取得
    @GetMapping("/company/{companyCd}")
    public ResponseEntity<List<UserDto>> getActiveUsersByCompany(@PathVariable String companyCd) {
        List<UserDto> users = userService.getActiveUsersByCompany(companyCd);
        return ResponseEntity.ok(users);
    }

    // ユーザー情報更新
    @PutMapping("/{userId}")
    public ResponseEntity<UserDto> updateUser(
            @PathVariable Long userId,
            @RequestBody UserDto userDto) {
        UserDto updatedUser = userService.updateUser(userId, userDto);
        return ResponseEntity.ok(updatedUser);
    }

    // ユーザー削除（論理削除）
    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> deleteUser(
            @PathVariable Long userId,
            @RequestParam String updateUser) {
        userService.deleteUser(userId, updateUser);
        return ResponseEntity.noContent().build();
    }

    // パスワードリセット
    @PostMapping("/{userId}/reset-password")
    public ResponseEntity<Void> resetPassword(@PathVariable Long userId) {
        userService.resetPassword(userId);
        return ResponseEntity.noContent().build();
    }

    // === 例外ハンドリング ===
    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<String> handleResourceNotFound(ResourceNotFoundException e) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
    }

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<String> handleDuplicateResource(DuplicateResourceException e) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(e.getMessage());
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<String> handleIllegalArgument(IllegalArgumentException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(e.getMessage());
    }
}
```

## 主な改善点と特徴

### 1. ユーザー作成時のレスポンス改善

- `201 Created`ステータスコードを返す
- `Location`ヘッダに作成したリソースの URI を設定

```java
URI location = ServletUriComponentsBuilder
        .fromCurrentRequest()
        .path("/{id}")
        .buildAndExpand(createdUser.getUserId())
        .toUri();

return ResponseEntity.created(location).body(createdUser);
```

### 2. RESTful な設計の維持

- 適切な HTTP メソッドの使用（POST, GET, PUT, DELETE）
- リソース指向の URL 設計維持
- 冪等性の考慮（パスワードリセットは POST のまま）

### 3. 簡潔な JSON レスポンス

- 成功時：ユーザーオブジェクトやリストをそのまま JSON で返す
- エラー時：エラーメッセージを文字列で返す
- 追加のラッパークラスを導入せずシンプルに保つ

### 4. 例外処理の一元化

- コントローラ内で主要な例外をハンドリング
- 適切な HTTP ステータスコードを設定
- エラーメッセージをクライアントに返す

### 5. 変更しない部分の維持

- サービス層の呼び出し方法を変更せず
- 既存のビジネスロジックを尊重
- ユーザー削除時の`updateUser`パラメータ保持

## 推奨する追加設定（application.properties）

```properties
# エラーレスポンスをJSON形式で統一
server.error.include-message=always
server.error.include-binding-errors=never
server.error.include-stacktrace=never
server.error.include-exception=false

# Jackson設定（オプション）
spring.jackson.serialization.indent-output=true
spring.jackson.default-property-inclusion=non_null
```

これにより、以下のような JSON レスポンスが得られます：

**ユーザー作成成功時（201 Created）**

```json
{
  "userId": 123,
  "companyCd": "COMP001",
  "employeeCd": "EMP1001",
  "userName": "山田太郎",
  "mailAddress": "taro.yamada@example.com"
}
```

**ユーザー取得成功時（200 OK）**

```json
{
  "userId": 123,
  "companyCd": "COMP001",
  "employeeCd": "EMP1001",
  "userName": "山田太郎",
  "mailAddress": "taro.yamada@example.com"
}
```

**ユーザー一覧取得成功時（200 OK）**

```json
[
  {
    "userId": 123,
    "companyCd": "COMP001",
    "employeeCd": "EMP1001",
    "userName": "山田太郎",
    "mailAddress": "taro.yamada@example.com"
  },
  {
    "userId": 124,
    "companyCd": "COMP001",
    "employeeCd": "EMP1002",
    "userName": "佐藤花子",
    "mailAddress": "hanako.sato@example.com"
  }
]
```

**エラー時（404 Not Found）**

```text
ユーザーが見つかりません: 999
```

この実装により、既存のサービスロジックを変更せず、シンプルで効果的な REST API を提供できます。エンドポイントは最小限でありながら、基本的な CRUD 操作をカバーしており、JSON 形式のレスポンスがクライアントアプリケーションとの連携を容易にします。
