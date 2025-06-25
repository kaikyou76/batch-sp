# ActiveDirectory 情報(ad.csv)読込み流れメモ―

### ActiveDirectory 情報 スキーマ

```sql
-- ADステージングテーブル（stg_ad）
CREATE TABLE public.stg_ad (
    ad_id SERIAL PRIMARY KEY,
    user_logon_name VARCHAR(20) NOT NULL,  -- login_nm → user_logon_name
    display_name VARCHAR(100),             -- disp_nm → display_name
    last_name VARCHAR(50),                 -- last_nm → last_name
    first_name VARCHAR(50),                -- first_nm → first_name
    mail VARCHAR(256),
    position_name VARCHAR(50),             -- position → position_name (予約語回避)
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT false NOT NULL,
    CONSTRAINT stg_ad_user_logon_name_key UNIQUE (user_logon_name)
);
-- ビジネスADテーブル（biz_ad）
CREATE TABLE public.biz_ad (
    ad_id SERIAL PRIMARY KEY,
    user_logon_name VARCHAR(20) NOT NULL,
    display_name VARCHAR(100),
    last_name VARCHAR(50),
    first_name VARCHAR(50),
    mail VARCHAR(256),
    position_name VARCHAR(50),             -- position → position_name (予約語回避)
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT false NOT NULL,
    CONSTRAINT biz_ad_user_logon_name_key UNIQUE (user_logon_name)
);
```

### ActiveDirectory 情報 csv ファイル

```
C:\batch\files\importfiles

ad.csv
user_logon_name,display_name,last_name,first_name,mail,position_name,deleted
568AW745,tanaka hiroshi,hiroshi,tanaka,tanaka@ttp.co.jp,AW975-023,false
129XZ811,suzuki yuko,yuko,suzuki,suzuki@ttp.co.jp,XZ456-789,false
786QW532,kimura takeshi,takeshi,kimura,kimura@ttp.co.jp,QW123-456,false
375DF235,yamada sato,sato,yamada,yamada@ttp.co.jp,DF987-654,false
904JK613,ito aya,aya,ito,ito@ttp.co.jp,JK321-654,false
```

### 手順 1

`src/main/java/com/example/orgchart_api/batch/step/writer/LoadStaffInfoWriter.java`

```java
    private void processBizTables() throws Exception {
        logger.info("BIZテーブルの更新を開始");

        // BIZ_AD取込
        loadStaffMapper.deleteBizAD();
        loadStaffInfoLogic.importAdData();
```

### 手順 2

`src/main/java/com/example/orgchart_api/batch/persistence/LoadStaffMapper.java`

```java
    /**
     * BizAD削除
     *
     * @return 件数
     */
    int deleteBizAD();
```

### 手順３

`src/main/resources/mapper/LoadStaffMapper.xml`

```xml
    <!-- 取込前削除 -->
    <delete id="deleteBizAD" parameterType="Map">
        delete from biz_ad;
    </delete>
```

### 手順４

`src/main/java/com/example/orgchart_api/batch/component/LoadStaffInfoLogic.java`

```java
public void importAdData() throws IOException, CSVException {
        String csvPath = Path.of(batchSettings.getCsvFtpDir(),
                batchSettings.getBizAdCsvFileName()).toString();
        String[] headers = batchSettings.getTmpBizAdCsvHeader().split(",");

        logger.info("ADデータ取込み開始: {}", csvPath);
        logger.debug("CSVヘッダー: {}", Arrays.toString(headers));

        Map<String, Object>[] records = CSVUtil.readCSV(
                csvPath,
                true,
                DEFAULT_DELIM,
                DEFAULT_QUOTATION,
                DEFAULT_NULL_VALUE,
                DEFAULT_ENCODING
        );

        if (records != null && records.length > 0) {
            logger.debug("最初のレコードキーセット: {}", records[0].keySet());
        }

        if (records != null) {
            logger.info("ADデータ読み込み完了: {}レコード", records.length);

            List<Map<String, Object>> filteredRecords = new ArrayList<>();
            Set<String> processedCodes = new HashSet<>();
            int invalidCount = 0;

            for (int i = 0; i < records.length; i++) {
                Map<String, Object> record = records[i];
                String loginNm = (String) record.get("user_logon_name");

                // === 追加: deleted の型変換処理 ===
                String deletedStr = (String) record.get("deleted");
                if (deletedStr == null) {
                    deletedStr = "false"; // デフォルト値
                }
                boolean deleted = Boolean.parseBoolean(deletedStr);
                record.put("deleted", deleted);

                if (loginNm == null || loginNm.trim().isEmpty()) {
                    logger.debug("レコード {}: user_logon_nameが空", i);
                    invalidCount++;
                    continue;
                }

                if (!isValidEmployeeLoginName(loginNm)) {
                    logger.debug("レコード {}: 無効なログインネーム形式: {}", i, loginNm);
                    invalidCount++;
                    continue;
                }

                String code = normalizeLoginName(loginNm);
                if (!processedCodes.contains(code)) {
                    record.put("user_logon_name", code); // 正規化したコードで上書き
                    filteredRecords.add(record);
                    processedCodes.add(code);
                    logger.trace("レコード {}: 有効なADレコード追加: {}", i, code);
                } else {
                    logger.debug("レコード {}: 重複ADレコードスキップ: {}", i, code);
                }
            }

            if (invalidCount > 0) {
                logger.warn("スキップされた無効なADレコード: {}件", invalidCount);
            }

            try {
                if (!filteredRecords.isEmpty()) {
                    logger.debug("ADテーブル設定: {}", batchSettings.getTmpBizAdTableName());
                    logger.debug("部署テーブル設定: {}", batchSettings.getTmpBizDepartmentTableName());
                    logger.debug("ADデータ挿入開始: {}レコード", filteredRecords.size());
                    staffInfoDAO.insertBizTableAll(
                            filteredRecords.toArray(new Map[0]),
                            batchSettings.getTmpBizAdTableName(),
                            headers
                    );
                    logger.info("ADデータ取込み完了: {}レコード", filteredRecords.size());
                } else {
                    logger.warn("挿入対象のADレコードが0件です");
                }
            } catch (SQLException e) {
                String errorMsg = "ADデータDB登録エラー: " + e.getMessage();
                logger.error(errorMsg, e);
                throw new CSVException(errorMsg, e);
            }
        } else {
            logger.warn("ADデータファイルにレコードが存在しません: {}", csvPath);
        }
    }
```

### 手順 5

`src/main/java/com/example/orgchart_api/batch/dao/StaffInfoDAO.java`

```java
    // CSV処理
    public void insertBizTableAll(Map<String, Object>[] records, String tableName, String[] header) throws SQLException {
        if (records == null) {
            return;
        }

        try {
            for (Map<String, Object> record : records) {
                Map<String, Object> param = new HashMap<>();
                for (String field : header) {
                    param.put(field, record.get(field));
                }

                switch (tableName) {
                    case "stg_ad":
                        loadStaffMapper.insertBizAD(param);
                        break;
                    case "stg_department":
                        loadStaffMapper.insertBizDepartment(param);
                        break;
                    case "stg_employee":
                        loadStaffMapper.insertBizEmployee(param);
                        break;
                    case "stg_organization":
                        loadStaffMapper.insertBizOrganization(param);
                        break;
                    case "stg_shift":
                        loadStaffMapper.insertBizShift(param);
                        break;
                    default:
                        log.warn("Unknown table name: {}", tableName);
                }
            }
        } catch (Exception e) {
            log.error("BIZテーブル[{}]登録エラー", tableName, e);
            throw new SQLException("BIZテーブル登録エラー", e);
        }
    }
```

### 手順 6

`src/main/java/com/example/orgchart_api/batch/persistence/LoadPersonnelMapper.java`

```java
    /**
     * BizAD登録
     *
     * @param parameterValues
     * @return 件数
     */
    int insertBizAD(@Param("ad") Map<String, Object> parameterValues);

```

### 手順 7

`src/main/resources/mapper/LoadStaffMapper.xml`

```xml
    <insert id="insertBizAD" parameterType="Map">
        INSERT INTO stg_ad(
            user_logon_name,
            display_name,
            last_name,
            first_name,
            mail,
            position_name,
            deleted
        ) VALUES (
                     #{ad.user_logon_name},
                     #{ad.display_name},
                     #{ad.last_name},
                     #{ad.first_name},
                     #{ad.mail},
                     #{ad.position_name},
                     #{ad.deleted}::boolean -- PostgreSQL専用の型キャスト
                 )
    </insert>

```
