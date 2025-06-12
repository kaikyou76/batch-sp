<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserServiceImplMockTest と UserServiceIntegrationTest の違い</span>

以下に、2 つのサービス層テストクラスの目的と違いを比較して説明します：

### 1. **UserServiceImplMockTest**

#### 目的：

- **単体テスト（モックテスト）**として、サービスクラスのビジネスロジックを隔離して検証
- 依存コンポーネント（Mapper など）をモック化し、サービス層のロジックに集中
- **メソッドレベルの振る舞いと例外処理**に焦点

#### 特徴：

- `@ExtendWith(MockitoExtension.class)`で Mockito を使用
- `@Mock`で`UserMapper`と`PasswordEncoder`をモック化
- `@InjectMocks`でテスト対象サービスをインスタンス化
- テスト対象：
  - ビジネスロジックの正しさ
  - 例外スローの条件
  - 依存コンポーネントの呼び出し方法
- テストデータ：
  - メモリ上に作成されたテストデータを使用
- 検証方法：
  - `verify()`で Mapper メソッド呼び出しを確認
  - `when().thenReturn()`でモックの振る舞いを制御
  - `assertThrows`で例外を検証

#### 主なテストケース：

```java
// モックの振る舞いを設定
when(userMapper.existsByMailAddress(anyString(), isNull())).thenReturn(false);
// サービスメソッド呼び出し
UserDto result = userService.createUser(testUserDto);
// 検証
verify(userMapper, times(1)).insert(any(User.class));
```

---

### 2. **UserServiceIntegrationTest**

#### 目的：

- **統合テスト**として、実際のデータベース連携を含むサービス層全体を検証
- Spring の DI コンテナを使用し、実際のコンポーネントを連携させてテスト
- **永続化層との統合動作とデータ一貫性**に焦点

#### 特徴：

- `@SpringBootTest`で完全なアプリケーションコンテキストを起動
- `@Autowired`で実際のサービスと Mapper を注入
- `@ActiveProfiles("test")`でテスト用設定を適用
- テスト対象：
  - データベースへの永続化
  - トランザクション管理
  - 実際のパスワードエンコーディング
  - 一意制約の検証
- テストデータ：
  - テスト用データベースに実際にデータを挿入
- 検証方法：
  - データベースからの取得結果を直接検証
  - 例外が適切にスローされることを確認
  - 複数メソッドにまたがるライフサイクルテスト

#### 主なテストケース：

```java
// 実際にサービスを呼び出し
UserDto createdUser = userService.createUser(testUserDto1);
// データベースから直接検証
UserDto retrievedUser = userService.getUserById(createdUser.getUserId());
assertEquals("user1@example.com", retrievedUser.getMailAddress());
```

---

### 主な違いの比較表

| 項目                   | UserServiceImplMockTest            | UserServiceIntegrationTest         |
| ---------------------- | ---------------------------------- | ---------------------------------- |
| **テストの種類**       | 単体テスト（サービスロジック単体） | 統合テスト（永続化層含む）         |
| **テスト範囲**         | サービス層のみ                     | サービス層＋ Mapper ＋ DB          |
| **依存コンポーネント** | モック化                           | 実際のコンポーネントを使用         |
| **データベース**       | 使用しない（モック）               | 実際のテスト用 DB を使用           |
| **実行速度**           | 高速（ms 単位）                    | 低速（秒単位）                     |
| **主な用途**           | 開発中の迅速なフィードバック       | CI/CD パイプラインでの結合テスト   |
| **検証の焦点**         | メソッド呼び出しとロジックフロー   | データ永続化と一貫性制約           |
| **テストデータ管理**   | メモリ内オブジェクト               | データベースのクリーンアップが必要 |
| **アノテーション**     | `@Mock`, `@InjectMocks`            | `@SpringBootTest`, `@Autowired`    |
| **例外テスト**         | モックで強制                       | 実際の制約違反で発生               |

---

### 補足

- **MockTest**は「ユーザー作成時にメール重複チェックが正しく行われるか」といった**ビジネスルールの検証**に最適です。
- **IntegrationTest**は「ユーザー作成後にデータベースに正しく保存されるか」といった**データ整合性の検証**に適しています。
- 一般的に、MockTest は TDD（テスト駆動開発）サイクルで頻繁に実行し、IntegrationTest はコミット前や PR 時に実行します。
- IntegrationTest では`@Transactional`を付与せず、`@AfterEach`で明示的にデータをクリーンアップする方法を採用している点に注目（テストごとの独立性を確保）。
