<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserControllerMockTest と UserControllerIntegrationTest の違い</span>

以下に、2 つのコントローラーテストクラスの目的と違いを比較して説明します：

### 1. **UserControllerMockTest**

#### 目的：

- **単体テスト（モックテスト）**として、コントローラーの HTTP リクエスト処理とサービス層の呼び出しを検証
- 実際の HTTP リクエスト/レスポンスをシミュレートしつつ、サービス層はモックで置き換え
- **コントローラーのロジックと HTTP インターフェース**に焦点

#### 特徴：

- `@ExtendWith(MockitoExtension.class)`で Mockito を使用
- `MockMvc`を使用してコントローラーを単体テスト
- `@Mock`で`UserService`をモック化
- テスト対象：
  - HTTP ステータスコード
  - レスポンスボディの内容
  - ヘッダー情報（Location など）
  - サービスメソッドの呼び出し回数と引数
- テストデータ：
  - メモリ上に作成されたテストデータを使用
- 認証：
  - モックなので認証不要（必要に応じて模擬可能）
- 検証方法：
  - `mockMvc.perform()`でリクエストをシミュレート
  - `andExpect()`でレスポンスを検証
  - `verify()`でサービス呼び出しを確認

#### 主なテストケース：

```java
mockMvc.perform(post("/api/users").content(json)).andExpect(status().isCreated());
verify(userService).createUser(any(UserDto.class));
```

---

### 2. **UserControllerIntegrationTest**

#### 目的：

- **統合テスト（E2E テスト）**として、実際の HTTP リクエストからデータベースまで含めたフローを検証
- Spring Boot の完全なアプリケーションコンテキストを起動
- **システム全体の統合動作**に焦点

#### 特徴：

- `@SpringBootTest(webEnvironment = RANDOM_PORT)`で実際のサーバーを起動
- `TestRestTemplate`を使用して実際の HTTP リクエストを送信
- テスト対象：
  - 実際の HTTP 通信（ステータスコード、ヘッダー、ボディ）
  - データベース連携（作成/更新/削除の永続化）
  - トランザクション管理
  - セキュリティ（認証/認可）
  - 例外ハンドリング
- テストデータ：
  - テスト用データベースに実際にデータを挿入
- 認証：
  - 実際の Basic 認証ヘッダーを付与
- 検証方法：
  - `restTemplate.exchange()`で実際の API を呼び出し
  - レスポンスのステータスコードと内容を検証
  - データベースの状態を直接確認

#### 主なテストケース：

```java
ResponseEntity<UserDto> response = restTemplate.exchange("/api/users", POST, request, UserDto.class);
assertEquals(HttpStatus.CREATED, response.getStatusCode());
```

---

### 主な違いの比較表

| 項目               | UserControllerMockTest                         | UserControllerIntegrationTest              |
| ------------------ | ---------------------------------------------- | ------------------------------------------ |
| **テストの種類**   | 単体テスト（コントローラー単体）               | 統合テスト（E2E）                          |
| **テスト範囲**     | コントローラー層のみ                           | コントローラー → サービス → リポジトリ →DB |
| **使用ツール**     | MockMvc                                        | TestRestTemplate                           |
| **アノテーション** | `@Mock`, `@ExtendWith(MockitoExtension.class)` | `@SpringBootTest`, `@ActiveProfiles`       |
| **サーバー起動**   | しない（コントローラー単体）                   | 実際に起動（RANDOM_PORT）                  |
| **データベース**   | 使用しない（モック）                           | 実際のテスト用 DB を使用                   |
| **認証**           | 不要（必要なら模擬）                           | 実際の Basic 認証を実施                    |
| **実行速度**       | 高速（ms 単位）                                | 低速（秒単位）                             |
| **主な用途**       | 開発中の迅速なフィードバック                   | CI/CD パイプラインでの結合テスト           |
| **検証の焦点**     | HTTP インターフェースとコントローラーロジック  | システム全体の統合動作                     |

---

### 補足

- **MockTest**は開発中に頻繁に実行するのに適しており、コントローラーの入力検証やルーティングが正しいか素早く確認できます。
- **IntegrationTest**は実際の API エンドポイントとしての動作を保証するもので、リリース前の最終チェックに重要です。
- 一般的に、MockTest は 1 日数十回実行し、IntegrationTest はコミット前や PR 時に実行するのが効率的です。
- IntegrationTest では実際の認証機構やデータベース制約（ユニークキーなど）も検証可能ですが、テストデータの管理が重要になります。
