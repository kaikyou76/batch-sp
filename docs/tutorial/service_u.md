<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserService インタフェースの実装</span>

## 完成版

`src/main/java/com/example/orgchart_api/service/UserService.java`

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.dto.UserDto;

import java.util.List;

public interface UserService {
    /**
     * 新しいユーザーを作成する
     * @param userDto 作成するユーザーの情報を含むDTO
     * @return 作成されたユーザーの情報を含むDTO
     */
    UserDto createUser(UserDto userDto);

    /**
     * ユーザーIDでユーザーを取得する
     * @param userId ユーザーID
     * @return ユーザー情報DTO (存在しない場合は例外)
     */
    UserDto getUserById(Long userId);

    /**
     * 企業コードに基づいてアクティブなユーザーのリストを取得する
     * @param companyCd 企業コード
     * @return ユーザー情報DTOのリスト
     */
    List<UserDto> getActiveUsersByCompany(String companyCd);

    /**
     * ユーザーを論理削除する
     * @param userId 削除対象のユーザーID
     * @param updateUser 更新を実行するユーザー（操作者）
     */
    void deleteUser(Long userId, String updateUser);

    /**
     * ユーザー情報を更新する
     * @param userId 更新対象のユーザーID
     * @param userDto 更新する情報を含むDTO
     * @return 更新されたユーザー情報DTO
     */
    UserDto updateUser(Long userId, UserDto userDto);

    /**
     * ユーザーのパスワードをリセットし、一時パスワードを生成する（生成したパスワードはメール送信される想定）
     * @param userId パスワードをリセットするユーザーID
     * @return 成功メッセージを含むレスポンス（セキュリティ上、一時パスワードは返さない）
     */
    void resetPassword(Long userId);
}
```

## 実装の流れ

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.dto.UserDto;

import java.util.List;

public interface UserService {
    /**
     * ユーザーを作成する
     * @param userDto ユーザー情報DTO
     * @return 作成されたユーザー情報DTO
     */
    UserDto createUser(UserDto userDto);
    UserDto getUserById(Long userId);
    List<UserDto> getUsersByCompany(String companyCd);
    void deleteUser(Long userId, String updateUser);
    /**
     * ユーザーを更新する
     * @param userId ユーザーID
     * @param userDto 更新するユーザー情報DTO
     * @return 更新されたユーザー情報DTO
     */
    UserDto updateUser(Long userId, UserDto userDto);
    UserDto resetPassword(Long userId);
}
```

#### 已深度思考

````
ーザーサービスインターフェースの定義についてレビューします。以下は、提供されたインターフェースです。

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.dto.UserDto;

import java.util.List;

public interface UserService {
   UserDto createUser(UserDto userDto);
   UserDto getUserById(Long userId);
   List<UserDto> getUsersByCompany(String companyCd);
   void deleteUser(Long userId, String updateUser);
   UserDto updateUser(Long userId, UserDto userDto);
   UserDto resetPassword(Long userId);
}
````

### 改善点と提案

1. **メソッドのドキュメンテーション**: 一部のメソッドには Javadoc が不足しています。サービスインターフェースは実装の契約を定義するため、各メソッドの役割を明確にするためにドキュメントを追加することをお勧めします。

2. **更新ユーザーの指定**: `deleteUser`メソッドで更新ユーザーを指定できるようになっていますが、他の更新操作（`updateUser`や`resetPassword`）でも更新ユーザーを指定できるようにするべきでしょうか？ ただし、現在の実装では`updateUser`や`resetPassword`の更新ユーザーはシステム（"SYSTEM"）で固定されています。設計方針に応じて検討が必要です。

3. **パスワードリセットの戻り値**: `resetPassword`メソッドが`UserDto`を返しています。セキュリティ上、パスワード（一時パスワード）を返すのは避けるべきですが、インターフェース設計上は問題ありません。ただし、実装では一時パスワードを直接返さないようにする必要があります（代わりに成功メッセージや空のレスポンスを返すなど）。

4. **一貫性**:

   - `deleteUser`は更新ユーザーを引数にとりますが、`updateUser`はとりません。更新操作のたびに更新ユーザーを指定するようにするか、システム全体で認証されたユーザーの情報（セキュリティコンテキスト）から取得する方法が考えられます。

5. **メソッド名の明確化**:
   - `getUsersByCompany`: 企業コード（companyCd）でユーザーを取得するメソッドですが、削除済みユーザーを含むかどうかが不明確です。メソッド名を`getActiveUsersByCompany`にするか、削除済みを含む場合はパラメータを追加するなどの検討が必要です。

### 改善案のインターフェース

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.dto.UserDto;

import java.util.List;

public interface UserService {
    /**
     * 新しいユーザーを作成する
     * @param userDto 作成するユーザーの情報を含むDTO
     * @return 作成されたユーザーの情報を含むDTO
     */
    UserDto createUser(UserDto userDto);

    /**
     * ユーザーIDでユーザーを取得する
     * @param userId ユーザーID
     * @return ユーザー情報DTO (存在しない場合は例外)
     */
    UserDto getUserById(Long userId);

    /**
     * 企業コードに基づいてアクティブなユーザーのリストを取得する
     * @param companyCd 企業コード
     * @return ユーザー情報DTOのリスト
     */
    List<UserDto> getActiveUsersByCompany(String companyCd);

    /**
     * ユーザーを論理削除する
     * @param userId 削除対象のユーザーID
     * @param updateUser 更新を実行するユーザー（操作者）
     */
    void deleteUser(Long userId, String updateUser);

    /**
     * ユーザー情報を更新する
     * @param userId 更新対象のユーザーID
     * @param userDto 更新する情報を含むDTO
     * @return 更新されたユーザー情報DTO
     */
    UserDto updateUser(Long userId, UserDto userDto);

    /**
     * ユーザーのパスワードをリセットし、一時パスワードを生成する（生成したパスワードはメール送信される想定）
     * @param userId パスワードをリセットするユーザーID
     * @return 成功メッセージを含むレスポンス（セキュリティ上、一時パスワードは返さない）
     */
    void resetPassword(Long userId);
}
```

### 主な変更点

1. **メソッド名の変更**: `getUsersByCompany` → `getActiveUsersByCompany`（アクティブなユーザーのみ取得することを明示）
2. **リセットパスワードの戻り値**: `UserDto` → `void`（一時パスワードを直接返さないように変更）
3. **ドキュメンテーションの追加**: 各メソッドの機能を説明する Javadoc を追加
4. **一貫性の確保**: 更新操作の引数に`updateUser`を追加するかどうかは設計上の判断が必要ですが、現時点では`deleteUser`のみに残しています。認証コンテキストから取得する方式を推奨する場合は、`deleteUser`からも`updateUser`引数を削除し、内部でセキュリティコンテキストから取得するように変更します。

### 認証ユーザー情報の取り扱いについての提案

現在、`deleteUser`メソッドのみが`updateUser`（操作者）を引数で受取っています。他の更新系操作でも同様の仕様にしたい場合、インターフェースを以下のように変更します：

```java
UserDto updateUser(Long userId, UserDto userDto, String updateUser);
void resetPassword(Long userId, String updateUser);
```

しかし、Spring Security を利用している場合、操作者はセキュリティコンテキストから取得する方が一般的です。その場合、インターフェースから`updateUser`引数を削除し、実装クラスで`SecurityContextHolder`などから取得します。

例:

```java
@Service
public class UserServiceImpl implements UserService {
    @Override
    public void deleteUser(Long userId) {
        String updateUser = SecurityContextHolder.getContext().getAuthentication().getName();
        // ...削除処理
    }
}
```

### まとめ

提供されたインターフェースは基本的に適切ですが、以下の改善を推奨します：

- メソッド名とドキュメントで取得対象（アクティブなユーザー）を明確にする
- パスワードリセットでは一時パスワードを返さない（セキュリティ）
- 更新操作の実行ユーザーを取得する方法を統一（引数 vs セキュリティコンテキスト）

設計上の判断が必要な部分（更新ユーザーの取得方法）について、プロジェクト全体の設計方針に基づいて調整してください。

````

## ユーザーサービスインターフェースのレビューと改善提案

提供されたUserServiceインターフェースの定義は基本的に良好ですが、以下の点を考慮して改善することをお勧めします：

### 改善後のインターフェース定義

```java
package com.example.orgchart_api.service;

import com.example.orgchart_api.dto.UserDto;
import com.example.orgchart_api.exception.DuplicateResourceException;
import com.example.orgchart_api.exception.ResourceNotFoundException;

import java.util.List;

public interface UserService {
    /**
     * 新しいユーザーを作成します
     *
     * @param userDto 作成するユーザー情報を含むDTO
     * @return 作成されたユーザー情報を含むDTO
     * @throws DuplicateResourceException メールアドレスまたは社員コードが重複する場合
     */
    UserDto createUser(UserDto userDto) throws DuplicateResourceException;

    /**
     * 指定されたIDのユーザー情報を取得します
     *
     * @param userId ユーザーID
     * @return ユーザー情報DTO
     * @throws ResourceNotFoundException ユーザーが見つからない場合
     */
    UserDto getUserById(Long userId) throws ResourceNotFoundException;

    /**
     * 指定された企業コードに属するアクティブなユーザーリストを取得します
     *
     * @param companyCd 企業コード
     * @return ユーザー情報DTOのリスト
     */
    List<UserDto> getActiveUsersByCompany(String companyCd);

    /**
     * ユーザーを論理削除します
     *
     * @param userId 削除対象ユーザーID
     * @param updateUser 更新を実行するユーザー（操作者）
     * @throws ResourceNotFoundException ユーザーが見つからない場合
     */
    void deleteUser(Long userId, String updateUser) throws ResourceNotFoundException;

    /**
     * ユーザー情報を更新します
     *
     * @param userId 更新対象ユーザーID
     * @param userDto 更新情報を含むDTO
     * @return 更新されたユーザー情報DTO
     * @throws ResourceNotFoundException ユーザーが見つからない場合
     * @throws DuplicateResourceException メールアドレスまたは社員コードが重複する場合
     */
    UserDto updateUser(Long userId, UserDto userDto)
        throws ResourceNotFoundException, DuplicateResourceException;

    /**
     * ユーザーのパスワードをリセットします
     *
     * @param userId パスワードリセット対象ユーザーID
     * @throws ResourceNotFoundException ユーザーが見つからない場合
     */
    void resetPassword(Long userId) throws ResourceNotFoundException;
}
````

### 主な改善点

1. **例外宣言の明示化**

   ```java
   UserDto createUser(UserDto userDto) throws DuplicateResourceException;
   ```

   - メソッドがスローする可能性のある例外を明示的に宣言
   - クライアントコードが適切に例外を処理できるように

2. **メソッド名の改善**

   ```java
   // 変更前
   List<UserDto> getUsersByCompany(String companyCd);

   // 変更後（削除済みユーザーを除外することを明確化）
   List<UserDto> getActiveUsersByCompany(String companyCd);
   ```

3. **パスワードリセットの戻り値変更**

   ```java
   // 変更前（セキュリティリスクあり）
   UserDto resetPassword(Long userId);

   // 変更後（パスワードを返さない設計）
   void resetPassword(Long userId) throws ResourceNotFoundException;
   ```

4. **Javadoc の充実**

   ```java
   /**
    * 新しいユーザーを作成します
    *
    * @param userDto 作成するユーザー情報を含むDTO
    * @return 作成されたユーザー情報を含むDTO
    * @throws DuplicateResourceException メールアドレスまたは社員コードが重複する場合
    */
   ```

   - 各メソッドの機能、パラメータ、戻り値、例外を詳細に記載

5. **一貫性の向上**
   - メソッド名の命名規則を統一（動詞で始める）
   - パラメータの順序を統一（userId が最初）

### 例外クラスの実装例

```java
// リソース重複例外
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }

    public DuplicateResourceException(String message, Throwable cause) {
        super(message, cause);
    }
}

// リソース未検出例外
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

### インターフェース設計のベストプラクティス

1. **単一責任の原則**

   - 各メソッドが 1 つの明確な責任を持つ
   - `resetPassword()`はパスワードリセット専用

2. **抽象化レベルの統一**

   - すべてのメソッドが同じ抽象度で操作を定義

3. **クライアント視点の設計**

   - クライアントが必要とする操作のみを公開
   - 内部実装詳細を隠蔽

4. **ドキュメンテーションの充実**

   - インターフェースが契約として機能するよう詳細な Javadoc

5. **拡張性の考慮**
   - 将来的な拡張を想定した柔軟な設計

### 追加検討事項

1. **ページネーションのサポート**

   ```java
   Page<UserDto> getActiveUsersByCompany(String companyCd, Pageable pageable);
   ```

2. **検索機能の追加**

   ```java
   List<UserDto> searchUsers(String companyCd, String name, boolean includeDeleted);
   ```

3. **ロールベースのアクセス制御**

   - 管理者専用メソッドの分離

4. **監査証跡のサポート**
   ```java
   void deleteUser(Long userId, String updateUser, String reason);
   ```

これらの改善により、より堅牢で使いやすいサービスインターフェースを提供できます。特に例外の明示的な宣言は、クライアントコードの品質向上に大きく貢献します。
