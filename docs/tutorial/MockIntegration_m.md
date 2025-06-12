<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserMapperMockTest と UserMapperIntegrationTest の違い</span>
以下に、2 つのテストクラスの目的と違いを比較して説明します：

### 1. **UserMapperMockTest**

#### 目的：

- **単体テスト（モックテスト）**として、`UserMapper`インターフェースの各メソッドが正しく呼び出されることを検証
- 実際のデータベースアクセスを行わず、モックを使用して振る舞いをテスト
- ビジネスロジックではなく、**メソッド呼び出しの正しさ**に焦点

#### 特徴：

- `@ExtendWith(MockitoExtension.class)`で Mockito を使用
- `@Mock`で`UserMapper`をモック化
- テスト対象：
  - メソッドが正しい引数で呼び出されるか（`verify`）
  - モックが設定した値を正しく返すか（`when...thenReturn`）
- テストデータ：
  - メモリ上に作成されたテストデータを使用
- 検証内容：
  - メソッド呼び出し回数
  - 引数の値や条件
  - 戻り値の期待値

#### 主なテストケース：

```java
verify(userMapper, times(1)).insert(testUser); // 1回呼ばれたか
verify(userMapper).insert(argThat(user -> ...)); // 正しい引数か
when(userMapper.findById(1L)).thenReturn(Optional.of(testUser)); // モックの振る舞い設定
```

---

### 2. **UserMapperIntegrationTest**

#### 目的：

- **統合テスト**として、実際のデータベースを使用した`UserMapper`の実装を検証
- MyBatis の SQL マッピングやデータベースの制約（外部キー、ユニーク制約など）をテスト
- **データベース連携の正しさ**に焦点

#### 特徴：

- `@SpringBootTest`で実際のアプリケーションコンテキストを起動
- `@Autowired`で実際の`UserMapper`実装を注入
- `@Transactional`でテストごとにロールバック
- テスト対象：
  - SQL の実行結果（INSERT/UPDATE の影響行数）
  - データベースの一貫性制約
  - 自動生成される ID や日時
- テストデータ：
  - テスト用データベースに実際にデータを挿入
- 検証内容：
  - データベースからの取得結果
  - 外部キー制約の遵守
  - トランザクションの整合性

#### 主なテストケース：

```java
userMapper.insert(newUser); // 実際にDBに挿入
assertNotNull(newUser.getUserId()); // IDが自動生成されたか
Optional<User> retrieved = userMapper.findById(newUser.getUserId()); // DBから再取得
assertEquals("新規ユーザー", retrieved.get().getUserNm()); // 値が正しく保存されたか
```

---

### 主な違いの比較表

| 項目               | UserMapperMockTest                             | UserMapperIntegrationTest              |
| ------------------ | ---------------------------------------------- | -------------------------------------- |
| **テストの種類**   | 単体テスト（モックテスト）                     | 統合テスト                             |
| **データベース**   | 使用しない（モック）                           | 実際のテスト用 DB を使用               |
| **テストの焦点**   | メソッド呼び出しの検証                         | データベース連携の検証                 |
| **アノテーション** | `@Mock`, `@ExtendWith(MockitoExtension.class)` | `@SpringBootTest`, `@Transactional`    |
| **検証方法**       | `verify()`, `when().thenReturn()`              | データベースからの実際の取得結果を検証 |
| **実行速度**       | 高速                                           | 低速（DB アクセスあり）                |
| **主な用途**       | 開発中の迅速なフィードバック                   | CI/CD パイプラインでの結合テスト       |
| **テストデータ**   | メモリ上のオブジェクト                         | 実際の DB に挿入されたデータ           |
| **外部キー制約**   | 検証しない                                     | 厳密に検証                             |

---

### 補足

- **MockTest**はリポジトリ層のインターフェースが仕様通りに実装されているか（コンパイル時のチェックに近い）を確認するのに適しています。
- **IntegrationTest**は実際の SQL 文やデータベースの制約（外部キー、トランザクションなど）が正しく動作するかを検証します。
- 一般的に、MockTest は開発中に頻繁に実行し、IntegrationTest はコミット前や PR 時に実行するのが効率的です。
