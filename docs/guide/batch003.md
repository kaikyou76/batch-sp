<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">人事システムバッチ処理細設計</span>

#### 已深度思考

````
えられた業務フロー概要とスキーマに基づいて、人事バッチ処理を実装する手順を考えます。バッチ処理の主な流れは以下の通りです：

### バッチ処理全体の流れ
1. **事前準備**：必須ファイルの存在確認
2. **ロック処理**：二重起動防止
3. **データ取込**：CSVファイルをステージングテーブルにロード（全件置換）
4. **ビジネスデータ更新**：ステージングからビジネステーブルへデータ反映（ダミーデータ除外など適用）
5. **データ整合性チェック**：閾値チェック（入社/退社/異動者数）
6. **店部課マスタ同期**：mst_sectionテーブルの更新
7. **社員ステータス管理**：退職処理・入社処理・情報更新
8. **組織変更対応**：拠点統廃合時のリソース移行
9. **終了処理**：正常時（コミット、ファイル移動）、異常時（ロールバック）
10. **退職者一覧出力**

### スキーマに基づく実装のポイント

#### 1. 必須ファイルチェック
- 以下の6ファイルが指定ディレクトリに存在するか確認：
 - `organization.csv` → `stg_organization`
 - `department.csv` → `stg_department`
 - `employee.csv` → `stg_employee`
 - `ad.csv` → `stg_ad`
 - `shift.csv` → `biz_shift`（機構改革情報）
 - `EOFAD`または`EOFAM`（終了フラグファイル）

#### 2. ロック処理
- ロックファイル名を`BatchSettings.getLockFile()`から取得
- ロックファイルが存在しない場合のみ作成して処理続行

#### 3. データ取込（ステージングテーブル）
- 各ステージングテーブルをTRUNCATE
- CSVファイルの内容を対応するステージングテーブルにCOPY
 ```sql
 TRUNCATE stg_organization;
 COPY stg_organization (...) FROM '...' WITH CSV HEADER;
 -- 同様に他のテーブルも処理
````

#### 4. ビジネステーブル更新（全件置換＆ダミー除外）

- **組織データ更新**（`biz_organization`）：

  ```sql
  TRUNCATE biz_organization;
  INSERT INTO biz_organization (organization_cd, organization_nm, parent_organization_cd, print_order, ...)
  SELECT
    organization_cd, organization_nm, parent_organization_cd, print_order, ...
  FROM stg_organization
  WHERE organization_cd NOT IN (SELECT organization_cd FROM dum_organization); -- ダミー組織除外
  ```

- **店部課データ更新**（`biz_department`）：

  ```sql
  TRUNCATE biz_department;
  INSERT INTO biz_department (company_cd, department_cd, department_nm, ...)
  SELECT
    company_cd, department_cd, department_nm, ...
  FROM stg_department
  WHERE
    company_cd IN ('001','002') -- 会社コード制限
    AND department_cd NOT IN (SELECT department_cd FROM dum_department); -- ダミー店部課除外
  ```

- **社員データ更新**（`biz_employee`）：

  ```sql
  TRUNCATE biz_employee;
  INSERT INTO biz_employee (company_cd, employee_cd, ...)
  SELECT
    e.company_cd, e.employee_cd, ...
  FROM stg_employee e
  WHERE
    e.company_cd IN ('001','002') -- 会社コード制限
    AND e.employee_cd NOT IN (SELECT employee_cd FROM dum_employee) -- ダミー社員除外
    AND e.post_cd NOT IN (SELECT executive_post_cd FROM stg_executive); -- 除外役職コード除外
  ```

- **AD 情報更新**（`stg_ad`はビジネステーブルなし）：

  - 後続処理で`trn_user`の更新に使用

- **機構改革情報**（`biz_shift`）：
  ```sql
  TRUNCATE biz_shift;
  COPY biz_shift (...) FROM '...' WITH CSV HEADER;
  ```

#### 5. 閾値チェック

- 変更点を計算：
  ```sql
  WITH stats AS (
    SELECT
      (SELECT COUNT(*) FROM stg_employee) AS new_count,
      (SELECT COUNT(*) FROM biz_employee) AS old_count,
      -- 変更があった社員数（例）を計算
      (SELECT COUNT(*) ...) AS changed_count
  )
  SELECT
    (new_count - old_count) AS new_employees,  -- 入社数
    (old_count - new_count) AS retired_employees, -- 退社数
    changed_count AS transferred_employees -- 異動数
  FROM stats
  ```
- 計算結果が`threshold`テーブルの閾値を超えたら例外スロー

#### 6. 店部課マスタ（`mst_section`）同期

- 新規追加：

  ```sql
  INSERT INTO mst_section (section_cd, section_nm, ...)
  SELECT
    d.department_cd, d.department_nm, ...
  FROM biz_department d
  WHERE NOT EXISTS (
    SELECT 1 FROM mst_section s
    WHERE s.section_cd = d.department_cd
  );
  ```

- 既存更新：
  ```sql
  UPDATE mst_section s
  SET
    section_nm = d.department_nm,
    ...
  FROM biz_department d
  WHERE
    s.section_cd = d.department_cd
    AND (s.section_nm <> d.department_nm OR ...);
  ```

#### 7. 社員ステータス管理（`trn_user`）

- **退社処理**：

  ```sql
  UPDATE trn_user u
  SET deleted = TRUE
  WHERE NOT EXISTS (
    SELECT 1 FROM stg_employee e
    WHERE
      u.company_cd = e.company_cd
      AND u.employee_cd = e.employee_cd
  );
  ```

- **入社処理**：

  ```sql
  INSERT INTO trn_user (company_cd, employee_cd, ...)
  SELECT
    e.company_cd, e.employee_cd, ...
  FROM stg_employee e
  WHERE NOT EXISTS (
    SELECT 1 FROM trn_user u
    WHERE
      u.company_cd = e.company_cd
      AND u.employee_cd = e.employee_cd
  );
  ```

- **社員情報更新**（所属部署など）：
  ```sql
  UPDATE trn_user u
  SET
    department_cd = e.department_cd,
    ...
  FROM stg_employee e
  WHERE
    u.company_cd = e.company_cd
    AND u.employee_cd = e.employee_cd
    AND (u.department_cd <> e.department_cd OR ...);
  ```

#### 8. 組織変更対応（拠点統廃合）

- `biz_shift`テーブルに基づきリソース移行：
  ```sql
  UPDATE trn_user u
  SET
    section_id = new_section.section_id
  FROM biz_shift s
  JOIN mst_section old_section
    ON old_section.section_cd = s.old_department_cd
  JOIN mst_section new_section
    ON new_section.section_cd = s.new_department_cd
  WHERE
    u.section_id = old_section.section_id;
  ```

#### 9. 終了処理

- **正常時**：
  - CSV ファイルリネーム（例：`organization_IMPORTED_20240520120000.csv`）
  - トランザクションコミット
  - ロックファイル削除
- **異常時**：
  - トランザクションロールバック
  - エラーログ出力

#### 10. 退職者一覧出力

- クエリ：
  ```sql
  SELECT
    family_nm, first_nm, phone_number, family_nm || first_nm AS user_id
  FROM trn_user
  WHERE deleted = TRUE
  ORDER BY phone_number;
  ```
  - 結果を`retired_users_YYYY-MM-DD.log`に出力

### 注意事項

- **パフォーマンス**：大規模データ対応のため、適宜インデックスを利用
- **エラーハンドリング**：各ステップで例外キャッチしロールバック
- **監査ログ**：`audit_log`テーブルに操作記録（任意）

````

### 続き：人事バッチ処理の詳細設計と実装方針

#### ステップ8: 組織変更対応（拠点統廃合処理）
```sql
-- 機構改革情報に基づいた拠点統廃合処理
WITH shift_data AS (
    SELECT
        s.old_company_cd, s.old_department_cd,
        s.new_company_cd, s.new_department_cd,
        old_sec.section_id AS old_section_id,
        new_sec.section_id AS new_section_id
    FROM biz_shift s
    JOIN mst_section old_sec
        ON old_sec.company_cd = s.old_company_cd
        AND old_sec.section_cd = s.old_department_cd
    JOIN mst_section new_sec
        ON new_sec.company_cd = s.new_company_cd
        AND new_sec.section_cd = s.new_department_cd
)
UPDATE rel_user_section us
SET section_id = sd.new_section_id
FROM shift_data sd
WHERE us.section_id = sd.old_section_id;

-- 廃止部署の無効化（電話機が紐づいていない場合）
DELETE FROM mst_section sec
WHERE NOT EXISTS (
    SELECT 1 FROM rel_user_section
    WHERE section_id = sec.section_id
)
AND EXISTS (
    SELECT 1 FROM biz_shift
    WHERE old_company_cd = sec.company_cd
    AND old_department_cd = sec.section_cd
);

-- 関連リソースの更新（課金先）
UPDATE trn_charge_association ca
SET charge_item_cd = 'NEW_' || charge_item_cd -- 新しい課金コードに更新
FROM rel_user_section us
JOIN mst_section sec ON us.section_id = sec.section_id
WHERE ca.user_id = us.user_id
AND sec.section_cd = '廃止部署コード';
````

#### ステップ 9: 終了処理

```java
// 正常終了時処理
public void completeBatchSuccess() {
    // CSVファイルをリネーム
    String timestamp = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
    renameFile("organization.csv", "organization_IMPORTED_" + timestamp + ".csv");
    // 他のファイルも同様にリネーム

    // トランザクションコミット
    dbAdapter.commit();

    // ロックファイル削除
    Files.deleteIfExists(Paths.get(batchSettings.getLockFile()));
}

// 異常終了時処理
public void handleBatchError(Exception e) {
    // ロールバック
    dbAdapter.rollback();

    // エラーログ出力
    String errorLog = String.format("[ERROR] %s: %s", LocalDateTime.now(), e.getMessage());
    Files.write(Paths.get("batch_errors.log"), errorLog.getBytes(), StandardOpenOption.APPEND);

    // 管理者通知
    sendErrorEmail(e);
}
```

#### ステップ 10: 退職者一覧出力

```sql
-- 退職者一覧取得クエリ
SELECT
    u.family_nm || ' ' || u.first_nm AS employee_name,
    u.mail_address AS email,
    u.pin AS extension_number,
    u.family_nm || u.first_nm AS user_id
FROM trn_user u
LEFT JOIN stg_employee se
    ON u.company_cd = se.company_cd
    AND u.employee_cd = se.employee_cd
WHERE se.employee_cd IS NULL -- 現行データに存在しない
AND u.deleted = FALSE; -- まだ削除フラグが立っていない
```

```java
// 退職者レポート生成
public void generateRetirementReport() {
    List<RetiredUser> retiredUsers = retiredUserDao.getRetiredUsers();

    String filename = String.format("retired_users_%s.log", LocalDate.now());
    try (PrintWriter writer = new PrintWriter(filename)) {
        writer.println("従業員名,メールアドレス,内線番号,ユーザーID");
        retiredUsers.forEach(user ->
            writer.println(user.getName() + "," +
                          user.getEmail() + "," +
                          user.getExtension() + "," +
                          user.getUserId()));
    }

    // 退社処理フラグ更新
    retiredUsers.forEach(user ->
        userDao.markAsDeleted(user.getUserId()));
}
```

### 重要補足処理の詳細実装

#### 1. ダミーデータ除外処理

```sql
-- 組織データのダミー除外
DELETE FROM stg_organization
WHERE organization_cd IN (
    SELECT organization_cd FROM dum_organization
);

-- 部門データのダミー除外
DELETE FROM stg_department
WHERE department_cd IN (
    SELECT department_cd FROM dum_department
);

-- 社員データのダミー除外
DELETE FROM stg_employee
WHERE employee_cd IN (
    SELECT employee_cd FROM dum_employee
);
```

#### 2. AD 情報の特殊処理（ログオン名変換）

```sql
UPDATE stg_ad
SET login_name = RIGHT(login_name, 7) -- 末尾7桁を使用
WHERE LENGTH(login_name) = 10;

-- 重複処理（後勝ち）
WITH ranked_ad AS (
    SELECT *,
           ROW_NUMBER() OVER (
               PARTITION BY company_cd, employee_cd
               ORDER BY create_date DESC
           ) AS rn
    FROM stg_ad
)
DELETE FROM ranked_ad WHERE rn > 1;
```

#### 3. 閾値チェック処理

```sql
-- 閾値取得
SELECT threshold_value
INTO movement_threshold
FROM threshold
WHERE threshold_type = 'EMPLOYEE_MOVEMENT';

-- 変更点数計算
SELECT
    (SELECT COUNT(*) FROM stg_employee) AS total_count,
    (SELECT COUNT(*)
     FROM stg_employee se
     JOIN biz_employee be
        ON se.company_cd = be.company_cd
        AND se.employee_cd = be.employee_cd
     WHERE se.department_cd != be.department_cd) AS transfer_count,
    (SELECT COUNT(*)
     FROM stg_employee se
     LEFT JOIN biz_employee be
        ON se.company_cd = be.company_cd
        AND se.employee_cd = be.employee_cd
     WHERE be.employee_id IS NULL) AS new_count,
    (SELECT COUNT(*)
     FROM biz_employee be
     LEFT JOIN stg_employee se
        ON se.company_cd = be.company_cd
        AND se.employee_cd = be.employee_cd
     WHERE se.employee_id IS NULL) AS retired_count
INTO movement_stats;

-- 閾値超過チェック
IF (movement_stats.transfer_count + movement_stats.new_count + movement_stats.retired_count) > movement_threshold THEN
    RAISE EXCEPTION '閾値超過: 変更点数=% > 閾値=%',
        (movement_stats.transfer_count + movement_stats.new_count + movement_stats.retired_count),
        movement_threshold;
END IF;
```

#### 4. パフォーマンス最適化策

1. **バッチ処理時間帯設定**:

   ```java
   @Scheduled(cron = "0 0 3 * * ?") // 毎日AM3:00に実行
   public void executeNightlyBatch() {
       // バッチ処理実行
   }
   ```

2. **バルク処理実装**:

   ```java
   public void batchUpdateUsers(List<User> users) {
       int batchSize = 1000;
       for (int i = 0; i < users.size(); i += batchSize) {
           List<User> batch = users.subList(i, Math.min(i + batchSize, users.size()));
           userDao.bulkUpdate(batch);
       }
   }
   ```

3. **一時索引の活用**:

   ```sql
   -- 一時インデックス作成
   CREATE INDEX idx_temp_employee ON stg_employee (company_cd, employee_cd);

   -- バッチ処理後削除
   DROP INDEX idx_temp_employee;
   ```

### エラー処理・監視強化

```java
// 異常検知と通知
public void validateFileFormat(File csvFile) {
    try (CSVReader reader = new CSVReader(new FileReader(csvFile))) {
        String[] header = reader.readNext();
        if (!Arrays.equals(header, EXPECTED_HEADERS)) {
            throw new BatchException("CSVヘッダーが不正: " + Arrays.toString(header));
        }
    } catch (IOException e) {
        sendErrorNotification("ファイル読み込みエラー: " + csvFile.getName(), e);
        throw e;
    }
}

// 監査ログ記録
public void logAudit(String tableName, String operation, Long recordId) {
    String sql = "INSERT INTO audit_log (table_name, record_id, operation) VALUES (?, ?, ?)";
    jdbcTemplate.update(sql, tableName, recordId, operation);
}

// ダッシュボード監視用メトリクス
public void recordBatchMetrics(BatchStats stats) {
    metricsService.gauge("batch.employee.new.count", stats.getNewEmployeeCount());
    metricsService.gauge("batch.employee.retired.count", stats.getRetiredEmployeeCount());
    metricsService.gauge("batch.employee.transfer.count", stats.getTransferCount());
    metricsService.timer("batch.execution.time", stats.getExecutionTime());
}
```

### まとめ：バッチ処理アーキテクチャ

```
                          +----------------+
                          |  CSVファイル群  |
                          | (人事システム) |
                          +--------+-------+
                                   |
                                   v
+-------------------------------------------------------------------------+
| バッチ処理フロー                                                         |
| 1. ファイル検証 → 2. ロック取得 → 3. ステージング取込 → 4. データクレンジング |
| 5. ビジネスデータ更新 → 6. 閾値チェック → 7. マスタ同期 → 8. ユーザー状態更新 |
| 9. 組織変更処理 → 10. 出力生成 → 11. クリーンアップ                        |
+-------------------------------------------------------------------------+
                                   |
                                   v
                          +-----------------+
                          |  成果物・ログ    |
                          | - 退職者一覧     |
                          | - 監査ログ       |
                          | - メトリクス     |
                          +-----------------+
```

この設計では、人事システムから提供される CSV データを基に、組織階層・社員情報・配属変更などを一貫して処理します。特に、拠点統廃合時のリソース移動や課金情報の変更を自動化することで、人的ミスを削減し業務効率を向上させます。

スキーマに合わせた主な特徴:

- 段階的なデータ処理（ステージング → ビジネス → マスタ）
- トランザクション管理によるデータ整合性保証
- 監査ログとメトリクスによる運用可視化
- パフォーマンス最適化（バッチ処理、一時索引）
- 柔軟なエラーハンドリングと通知機構

これらの処理を Spring Batch などのバッチフレームワークで実装することで、大規模データ処理にも耐えられる堅牢なシステムを構築できます。
