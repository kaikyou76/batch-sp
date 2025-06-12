<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">UserMapperIntegrationTest のテスト（統合テスト）</span>

### ポイントメッソドの説明

`@BeforeEach` メソッド

以下は、マスタデータのセットアップとテストユーザーデータの挿入を統合した完成版の `@BeforeEach` メソッドです：

```java
    @BeforeEach
    public void setUp() {
        // 関連マスタデータのセットアップ
        // 1. 支店マスタデータの挿入
        jdbcTemplate.update("INSERT INTO mst_branch (branch_cd, branch_nm, create_date, update_date, update_user) " +
                "VALUES ('001', 'テスト支店', NOW(), NOW(), 'BATCH') " +
                "ON CONFLICT (branch_cd) DO NOTHING");

        // 2. ボイスメールプロファイルマスタデータの挿入 (ID=1,2,3)
        jdbcTemplate.update("INSERT INTO mst_cucm_voice_mail_profile " +
                "(voice_mail_profile_id, voice_mail_profile_nm, create_date, update_date, update_user) " +
                "VALUES (1, 'デフォルトプロファイル1', NOW(), NOW(), 'BATCH'), " +
                "(2, 'デフォルトプロファイル2', NOW(), NOW(), 'BATCH'), " +
                "(3, 'デフォルトプロファイル3', NOW(), NOW(), 'BATCH') " + // ID=3を追加
                "ON CONFLICT (voice_mail_profile_id) DO NOTHING");

        // 3. ピックアップグループマスタデータの挿入 (ID=1,2,3)
        jdbcTemplate.update("INSERT INTO mst_cucm_pickup_group (" +
                "pickup_group_id, pickup_group_nm, pickup_group_no, " +
                "branch_cd, section_cd, create_date, update_date, update_user) " +
                "VALUES (1, 'テストピックアップグループ1', 9999, '001', 'S0001', NOW(), NOW(), 'BATCH'), " +
                "(2, 'テストピックアップグループ2', 8888, '001', 'S0002', NOW(), NOW(), 'BATCH'), " +
                "(3, 'テストピックアップグループ3', 7777, '001', 'S0003', NOW(), NOW(), 'BATCH') " + // ID=3を追加
                "ON CONFLICT (pickup_group_id) DO UPDATE SET " +
                "pickup_group_nm = EXCLUDED.pickup_group_nm, " +
                "pickup_group_no = EXCLUDED.pickup_group_no, " +
                "branch_cd = EXCLUDED.branch_cd, " +
                "section_cd = EXCLUDED.section_cd, " +
                "update_date = NOW()");

        // テスト用ユーザー1の作成
        testUser1 = new User();
        testUser1.setCompanyCd("001");
        testUser1.setEmployeeCd("E100001");
        testUser1.setUserNm("テストユーザー1");
        testUser1.setUserNmKana("てすとゆーざー1");
        testUser1.setMailAddress("user1@example.com");
        testUser1.setPasswordHash("hash1");
        testUser1.setPasswordSalt("salt1");
        testUser1.setPin("12345678");
        testUser1.setBirthday(LocalDate.of(1990, 1, 1));
        testUser1.setVoiceMailProfileId(1);
        testUser1.setPickupGroupId(1);
        testUser1.setDeleted(false);
        testUser1.setUpdateUser("TEST");

        // テスト用ユーザー2の作成 (削除済みユーザー)
        testUser2 = new User();
        testUser2.setCompanyCd("001");
        testUser2.setEmployeeCd("E100002");
        testUser2.setUserNm("テストユーザー2");
        testUser2.setUserNmKana("てすとゆーざー2");
        testUser2.setMailAddress("user2@example.com");
        testUser2.setPasswordHash("hash2");
        testUser2.setPasswordSalt("salt2");
        testUser2.setPin("87654321");
        testUser2.setBirthday(LocalDate.of(1995, 5, 5));
        testUser2.setVoiceMailProfileId(2);  // マスタに追加したID=2を参照
        testUser2.setPickupGroupId(2);       // マスタに追加したID=2を参照
        testUser2.setDeleted(true);
        testUser2.setUpdateUser("TEST");

        // テストデータクリア
        jdbcTemplate.execute("TRUNCATE TABLE trn_user RESTART IDENTITY CASCADE");

        // ユーザーをDBに挿入
        userMapper.insert(testUser1);
        userMapper.insert(testUser2);
    }

```

### 主なポイントと特徴：

1. **マスタデータの順序正しい挿入**：

   - 外部キー制約がある場合に備え、依存関係の順に挿入
   - 支店 → ボイスメールプロファイル → ピックアップグループ

2. **ON CONFLICT 処理の最適化**：

   - 支店とボイスメールプロファイル：`DO NOTHING`（競合時は無視）
   - ピックアップグループ：`DO UPDATE`（競合時は最新データで更新）

3. **テストユーザーとマスタの関連付け**：

   ```java
   testUser1.setVoiceMailProfileId(1);  // 挿入したマスタID=1
   testUser1.setPickupGroupId(1);       // 挿入したマスタID=1
   ```

4. **安全なテーブルクリア**：

   ```java
   // マスタは残し、ユーザーデータのみクリア
   jdbcTemplate.execute("TRUNCATE TABLE trn_user RESTART IDENTITY CASCADE");
   ```

5. **削除済みユーザーの扱い**：
   - テストユーザー 2 は削除済み（`deleted=true`）として挿入
   - 参照するマスタ ID=2 は存在しない可能性あり（削除済みユーザーなので問題なし）

### 実行順序の流れ：

1. 支店マスタ(`mst_branch`)にコード`001`のデータ挿入
2. ボイスメールプロファイルマスタ(`mst_cucm_voice_mail_profile`)に ID=1 のデータ挿入
3. ピックアップグループマスタ(`mst_cucm_pickup_group`)に ID=1 のデータ挿入/更新
4. ユーザーテーブル(`trn_user`)の全データ削除
5. アクティブユーザー（testUser1）を挿入
6. 削除済みユーザー（testUser2）を挿入

この構成により、外部キー制約がある環境でもテストが失敗せず、毎回クリーンな状態でテストを実行できます。

## UserMapperIntegrationTest のテスト（統合テスト）完成版

`src/test/java/com/example/orgchart_api/mapper/UserMapperIntegrationTest.java`

```java
package com.example.orgchart_api.mapper;

import com.example.orgchart_api.OrgchartApiApplication;
import com.example.orgchart_api.domain.User;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;


@SpringBootTest(classes = OrgchartApiApplication.class)
@ActiveProfiles("test")
@Transactional
public class UserMapperIntegrationTest {
    @Autowired
    private UserMapper userMapper;

    @Autowired
    private JdbcTemplate jdbcTemplate;

    private User testUser1;
    private User testUser2;

    @BeforeEach
    public void setUp() {
        // 関連マスタデータのセットアップ
        // 1. 支店マスタデータの挿入
        jdbcTemplate.update("INSERT INTO mst_branch (branch_cd, branch_nm, create_date, update_date, update_user) " +
                "VALUES ('001', 'テスト支店', NOW(), NOW(), 'BATCH') " +
                "ON CONFLICT (branch_cd) DO NOTHING");

        // 2. ボイスメールプロファイルマスタデータの挿入 (ID=1,2,3)
        jdbcTemplate.update("INSERT INTO mst_cucm_voice_mail_profile " +
                "(voice_mail_profile_id, voice_mail_profile_nm, create_date, update_date, update_user) " +
                "VALUES (1, 'デフォルトプロファイル1', NOW(), NOW(), 'BATCH'), " +
                "(2, 'デフォルトプロファイル2', NOW(), NOW(), 'BATCH'), " +
                "(3, 'デフォルトプロファイル3', NOW(), NOW(), 'BATCH') " + // ID=3を追加
                "ON CONFLICT (voice_mail_profile_id) DO NOTHING");

        // 3. ピックアップグループマスタデータの挿入 (ID=1,2,3)
        jdbcTemplate.update("INSERT INTO mst_cucm_pickup_group (" +
                "pickup_group_id, pickup_group_nm, pickup_group_no, " +
                "branch_cd, section_cd, create_date, update_date, update_user) " +
                "VALUES (1, 'テストピックアップグループ1', 9999, '001', 'S0001', NOW(), NOW(), 'BATCH'), " +
                "(2, 'テストピックアップグループ2', 8888, '001', 'S0002', NOW(), NOW(), 'BATCH'), " +
                "(3, 'テストピックアップグループ3', 7777, '001', 'S0003', NOW(), NOW(), 'BATCH') " + // ID=3を追加
                "ON CONFLICT (pickup_group_id) DO UPDATE SET " +
                "pickup_group_nm = EXCLUDED.pickup_group_nm, " +
                "pickup_group_no = EXCLUDED.pickup_group_no, " +
                "branch_cd = EXCLUDED.branch_cd, " +
                "section_cd = EXCLUDED.section_cd, " +
                "update_date = NOW()");

        // テスト用ユーザー1の作成
        testUser1 = new User();
        testUser1.setCompanyCd("001");
        testUser1.setEmployeeCd("E100001");
        testUser1.setUserNm("テストユーザー1");
        testUser1.setUserNmKana("てすとゆーざー1");
        testUser1.setMailAddress("user1@example.com");
        testUser1.setPasswordHash("hash1");
        testUser1.setPasswordSalt("salt1");
        testUser1.setPin("12345678");
        testUser1.setBirthday(LocalDate.of(1990, 1, 1));
        testUser1.setVoiceMailProfileId(1);
        testUser1.setPickupGroupId(1);
        testUser1.setDeleted(false);
        testUser1.setUpdateUser("TEST");

        // テスト用ユーザー2の作成 (削除済みユーザー)
        testUser2 = new User();
        testUser2.setCompanyCd("001");
        testUser2.setEmployeeCd("E100002");
        testUser2.setUserNm("テストユーザー2");
        testUser2.setUserNmKana("てすとゆーざー2");
        testUser2.setMailAddress("user2@example.com");
        testUser2.setPasswordHash("hash2");
        testUser2.setPasswordSalt("salt2");
        testUser2.setPin("87654321");
        testUser2.setBirthday(LocalDate.of(1995, 5, 5));
        testUser2.setVoiceMailProfileId(2);  // マスタに追加したID=2を参照
        testUser2.setPickupGroupId(2);       // マスタに追加したID=2を参照
        testUser2.setDeleted(true);
        testUser2.setUpdateUser("TEST");

        // テストデータクリア
        jdbcTemplate.execute("TRUNCATE TABLE trn_user RESTART IDENTITY CASCADE");

        // ユーザーをDBに挿入
        userMapper.insert(testUser1);
        userMapper.insert(testUser2);
    }

    @AfterEach
    public void cleanUp() {
        jdbcTemplate.execute("TRUNCATE TABLE trn_user RESTART IDENTITY CASCADE");
    }

    @Test
    public void insert_shouldSaveUserWithGeneratedId() {
        // 新規ユーザー作成
        User newUser = new User();
        newUser.setCompanyCd("002");
        newUser.setEmployeeCd("E200001");
        newUser.setUserNm("新規ユーザー");
        newUser.setUserNmKana("しんきゆーざー");
        newUser.setMailAddress("new@example.com");
        newUser.setPasswordHash("newHash");
        newUser.setPasswordSalt("newSalt");
        newUser.setPin("11112222");
        newUser.setBirthday(LocalDate.of(2000, 1, 1));
        newUser.setDeleted(false);
        newUser.setUpdateUser("TEST");

        // 挿入実行
        userMapper.insert(newUser);

        // IDが自動生成されていることを確認
        assertNotNull(newUser.getUserId());
        assertTrue(newUser.getUserId() > 0);

        // データベースから再取得して検証
        Optional<User> retrieved = userMapper.findById(newUser.getUserId());
        assertTrue(retrieved.isPresent());
        assertEquals("新規ユーザー", retrieved.get().getUserNm());
        assertEquals("002", retrieved.get().getCompanyCd());
        assertFalse(retrieved.get().isDeleted());
        assertNotNull(retrieved.get().getCreateDate());
        assertNotNull(retrieved.get().getUpdateDate());
    }

    @Test
    public void update_shouldModifyExistingUser() {
        // 更新前の情報を取得
        Optional<User> original = userMapper.findById(testUser1.getUserId());
        LocalDateTime originalUpdateDate = original.get().getUpdateDate();

        // 更新内容の設定
        testUser1.setUserNm("更新されたユーザー");
        testUser1.setUserNmKana("こうしんされたゆーざー");
        testUser1.setMailAddress("updated@example.com");
        testUser1.setPasswordHash("updatedHash");
        testUser1.setPasswordSalt("updatedSalt");
        testUser1.setPin("99998888");
        testUser1.setBirthday(LocalDate.of(2000, 1, 1));
        testUser1.setVoiceMailProfileId(3);
        testUser1.setPickupGroupId(3);
        testUser1.setUpdateUser("UPDATER");
        // 更新日時を明示的に設定（重要！）
        testUser1.setUpdateDate(LocalDateTime.now().plusSeconds(1));

        // 更新実行
        userMapper.update(testUser1);

        // データベースから再取得
        Optional<User> updated = userMapper.findById(testUser1.getUserId());
        assertTrue(updated.isPresent());
        User updatedUser = updated.get();

        // 値の検証
        assertEquals("更新されたユーザー", updatedUser.getUserNm());
        assertEquals("こうしんされたゆーざー", updatedUser.getUserNmKana());
        assertEquals("updated@example.com", updatedUser.getMailAddress());
        assertEquals("updatedHash", updatedUser.getPasswordHash());
        assertEquals("updatedSalt", updatedUser.getPasswordSalt());
        assertEquals("99998888", updatedUser.getPin());
        assertEquals(LocalDate.of(2000, 1, 1), updatedUser.getBirthday());
        assertEquals(3, updatedUser.getVoiceMailProfileId());
        assertEquals(3, updatedUser.getPickupGroupId());
        assertEquals("UPDATER", updatedUser.getUpdateUser());

        // 更新日時が変わっていること
        assertTrue(updatedUser.getUpdateDate().isAfter(originalUpdateDate));
    }

    @Test
    public void findById_shouldReturnUser_whenExists() {
        Optional<User> result = userMapper.findById(testUser1.getUserId());

        assertTrue(result.isPresent());
        assertEquals("テストユーザー1", result.get().getUserNm());
        assertEquals("001", result.get().getCompanyCd());
        assertFalse(result.get().isDeleted());
    }

    @Test
    public void findById_shouldReturnDeletedUser_whenExists() {
        Optional<User> result = userMapper.findById(testUser2.getUserId());

        assertTrue(result.isPresent());
        assertEquals("テストユーザー2", result.get().getUserNm());
        assertTrue(result.get().isDeleted()); // 削除済みユーザーが取得できることを確認
    }

    @Test
    public void findById_shouldReturnEmpty_whenNotExists() {
        Optional<User> result = userMapper.findById(999L);
        assertFalse(result.isPresent());
    }

    @Test
    public void findByCompanyCdAndNotDeleted_shouldReturnOnlyActiveUsers() {
        List<User> users = userMapper.findByCompanyCdAndNotDeleted("001");

        // 削除されていないユーザーのみ取得されることを確認
        assertEquals(1, users.size());
        assertFalse(users.get(0).isDeleted());
        assertEquals("テストユーザー1", users.get(0).getUserNm());
    }

    @Test
    public void existsByMailAddress_shouldDetectDuplicates() {
        // ユニーク制約の検証
        assertTrue(userMapper.existsByMailAddress("user1@example.com", null));
        assertFalse(userMapper.existsByMailAddress("user1@example.com", testUser1.getUserId())); // 自分自身は除外

        assertFalse(userMapper.existsByMailAddress("new@example.com", null));

        // 削除済みユーザーのメールは重複とみなされない
        assertFalse(userMapper.existsByMailAddress("user2@example.com", null));
    }

    @Test
    public void existsByMailAddress_shouldExcludeSelf() {
        // 自分自身を除外した場合、重複とみなされない
        assertFalse(userMapper.existsByMailAddress("user1@example.com", testUser1.getUserId()));
    }

    @Test
    public void existsByCompanyCdAndEmployeeCd_shouldDetectDuplicates() {
        // ユニーク制約の検証
        assertTrue(userMapper.existsByCompanyCdAndEmployeeCd("001", "E100001", null));
        assertFalse(userMapper.existsByCompanyCdAndEmployeeCd("001", "E100001", testUser1.getUserId())); // 自分自身は除外

        assertFalse(userMapper.existsByCompanyCdAndEmployeeCd("002", "E100001", null));

        // 削除済みユーザーの情報は重複とみなされない
        assertFalse(userMapper.existsByCompanyCdAndEmployeeCd("001", "E100002", null));
    }

    @Test
    public void existsByCompanyCdAndEmployeeCd_shouldExcludeSelf() {
        // 自分自身を除外した場合、重複とみなされない
        assertFalse(userMapper.existsByCompanyCdAndEmployeeCd("001", "E100001", testUser1.getUserId()));
    }
}

```

#### 已深度思考

```
テストコードは複雑に見えますが、段階的に理解し、実装していくことが重要です。
以下に、初心者向けの実装手順とコツを解説します。

### ステップバイステップ実装手順

1. **テストクラスの基本構造を理解する**
  - `@SpringBootTest`: テスト用のアプリケーションコンテキストをロード
  - `@ActiveProfiles("test")`: テスト用のプロファイル（application-test.properties）を適用
  - `@Transactional`: 各テストメソッド終了時にロールバック（データベースの変更を元に戻す）
  - `@BeforeEach`: 各テストメソッドの前に実行（テストデータの準備）
  - `@AfterEach`: 各テストメソッドの後に実行（クリーンアップ）
  - `@Test`: テストメソッド

2. **依存関係の把握**
  - `UserMapper` (テスト対象) と `JdbcTemplate` (データセットアップ用) を注入

3. **テストデータの準備 (`setUp` メソッド)**
  - 関連マスタテーブルにデータを挿入（外部キー制約を満たすため）
    - `mst_branch`（支店マスタ）
    - `mst_cucm_voice_mail_profile`（ボイスメールプロファイルマスタ）
    - `mst_cucm_pickup_group`（ピックアップグループマスタ）
  - テスト用ユーザーオブジェクト（`testUser1`, `testUser2`）を作成
  - テスト対象テーブル（`trn_user`）をクリア
  - テスト用ユーザーをデータベースに挿入

4. **テストメソッドの実装**
  - 各テストメソッドでは、特定の機能（挿入、更新、検索など）を検証
  - アサーション（`assertEquals`, `assertTrue` など）で期待値と実際の結果を比較

5. **テスト後のクリーンアップ (`cleanUp` メソッド)**
  - テストで変更したデータをクリア（`TRUNCATE TABLE`）

### 初心者向けのコツ

- **少しずつ進める**: 一度に全部を理解しようとせず、1つのテストメソッドから始める
- **デバッグ活用**: ブレークポイントを設定し、変数の値を確認しながら実行
- **データベースの状態を確認**: テスト実行中にpgAdminなどでデータベースを直接確認（ただし、`@Transactional` のためロールバックされる）
- **エラーメッセージを読む**: エラーが発生したらスタックトレースを丁寧に読み原因を特定
- **テストデータの可視化**: テストデータを紙に書くなどして可視化（どのデータを準備し、何を検証するか）
- **アサーションを丁寧に**: 何を検証しているかをコメントで記述（例: 「ユーザー名が更新されていること」）

### 実装の具体的なヒント

1. **`setUp` メソッドのマスタデータ挿入**
  - 外部キー制約エラーを避けるため、関連マスタに先にデータを挿入
  - `ON CONFLICT` 句で重複挿入を防止（既にデータがある場合は無視）

2. **テストデータの作成**
  - テストケースで必要となるユーザーオブジェクトを事前に作成
  - 正常系と異常系（削除済みユーザーなど）を用意

3. **テストメソッドの作成**
  - テスト対象のメソッドを呼び出し
  - 戻り値やデータベースの状態をアサーションで検証
  - 例: `insert` メソッドのテストでは、挿入後にIDが自動採番されていることを確認

4. **クリーンアップの重要性**
  - テストデータが他のテストに影響を与えないよう、各テスト後にクリーンアップ
  - `@Transactional` により自動でロールバックされるが、明示的にクリーンアップも実装

### テストメソッドの例: `insert_shouldSaveUserWithGeneratedId`

1. 新しいユーザーオブジェクトを作成
2. `userMapper.insert()` を呼び出し
3. 挿入後にユーザーIDが生成されていることを確認（`assertNotNull`, `assertTrue`）
4. データベースから同じIDでユーザーを取得し、内容が一致することを確認

### 困難な部分への対処法

- **外部キー制約エラー**: マスタテーブルに必要なデータが揃っているか確認
- **データベースの状態が予期しない**: テスト前に毎回データをクリア（`TRUNCATE`）
- **テストが失敗する理由がわからない**: デバッガでステップ実行し、各変数の値を確認

最初はシンプルなテスト（例: `findById`）から始め、徐々に複雑なテストに進むことをお勧めします。
各テストメソッドは独立しているため、1つずつ完成させていきましょう。

```

### 初心者向けテストコード実装手順とコツ

テストコード実装は確かに複雑に見えますが、段階的に進めれば必ず理解できます。順を追って実装していきましょう。

#### 実装の 4 ステップ

1. **環境設定の確認（30 分）**

   - `@SpringBootTest`と`@ActiveProfiles("test")`の役割を理解
   - テスト用データベースの接続設定を application-test.properties で確認
   - pgAdmin でテスト用 DB に接続できることを確認

2. **テストデータ準備（1 時間）**

   ```java
   @BeforeEach
   public void setUp() {
       // 1. マスタデータ作成（外部キー制約解除のため）
       insertMasters();

       // 2. テストユーザーオブジェクト作成
       createTestUsers();

       // 3. テーブルクリア
       jdbcTemplate.execute("TRUNCATE TABLE trn_user RESTART IDENTITY CASCADE");

       // 4. テストユーザー挿入
       userMapper.insert(testUser1);
       userMapper.insert(testUser2);
   }
   ```

   **コツ**:

   - 各ステップをメソッド分割して実装
   - マスタデータ → ユーザー作成 → クリア → 挿入の順序を厳守

3. **単体テスト作成（各テスト 30 分～ 1 時間）**

   ```java
   @Test
   public void findById_shouldReturnUser_whenExists() {
       // 1. テスト実行
       Optional<User> result = userMapper.findById(testUser1.getUserId());

       // 2. 結果検証
       assertTrue(result.isPresent());
       assertEquals("テストユーザー1", result.get().getUserNm());
       assertEquals("001", result.get().getCompanyCd());
       assertFalse(result.get().isDeleted());
   }
   ```

   **コツ**:

   - Given-When-Then 形式でコメントを書く
   - 1 テストメソッドで 1 つの機能だけテスト
   - アサーションは 1 つの値につき 1 つまで

4. **リファクタリング（30 分）**
   - 重複コードをメソッド化
   - テストデータを定数定義
   - ヘルパーメソッド作成

#### 初心者向け重要ポイント

1. **デバッグテクニック**

   ```java
   @Test
   public void example_test() {
       System.out.println("==== テスト開始 ===="); // コンソール出力で状況確認

       // テスト実行前にデータベース状態を確認
       jdbcTemplate.query("SELECT * FROM trn_user", rs -> {
           while (rs.next()) {
               System.out.println("事前データ: " + rs.getString("user_nm"));
           }
       });

       // ブレークポイントを設定してデバッガ実行
       // ...テストコード...
   }
   ```

2. **失敗時のチェックリスト**

   - テストデータの状態確認（pgAdmin で直接 SELECT）
   - マスタデータの外部キー制約対応漏れ
   - トランザクションのコミット/ロールバック状態
   - 日時関連フィールドのタイムゾーン問題

3. **段階的学習プラン**

| 週     | 目標     | 習得内容                                 |
| ------ | -------- | ---------------------------------------- |
| 1 週目 | 環境構築 | テスト DB 接続・単純な SELECT テスト     |
| 2 週目 | 基本操作 | INSERT/DELETE のテスト実装               |
| 3 週目 | 複雑操作 | 外部キー制約・トランザクション処理       |
| 4 週目 | 応用     | バリデーション・エラーハンドリングテスト |

#### 実践的なサンプル（簡易版 setUp）

```java
@BeforeEach
public void setUp() {
    // 共通マスタデータ準備（メソッド化推奨）
    insertBranchMaster();
    insertVoiceMailProfiles();
    insertPickupGroups();

    // テストユーザー作成（メソッド化推奨）
    testUser1 = createTestUser(1, "001", "E100001", "テストユーザー1", false);
    testUser2 = createTestUser(2, "001", "E100002", "テストユーザー2", true);

    // テーブル初期化
    resetUserTable();

    // 初期データ投入
    insertTestData();
}

// ヘルパーメソッド例
private User createTestUser(int id, String companyCd, String employeeCd, String name, boolean deleted) {
    User user = new User();
    user.setCompanyCd(companyCd);
    user.setEmployeeCd(employeeCd);
    user.setUserNm(name);
    // ...他のフィールド設定...
    user.setDeleted(deleted);
    return user;
}
```

### テストコード作成の心得

1. **最初はコピー＆ペーストで OK**
   既存コードを流用しながら少しずつ改変

2. **1 日 1 テストメソッド**
   小さな達成感を積み重ねる

3. **エラーは最高の教材**
   エラーメッセージを丁寧に読む習慣を

4. **デバッグ優先**
   IDE のデバッグ機能を活用（ブレークポイント、変数監視）

5. **チームメンバーに相談**
   分からない部分は具体的に質問
   （例：「外部キー制約のテストデータ作成方法が分かりません」）

テストコードは書けば書くほど上達します。最初は大変ですが、一度コツを掴めば非常に強力なスキルになります。焦らず一歩ずつ進めてください！
