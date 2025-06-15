## BatchSettings

#### (src/main/java/com/example/orgchart_api/batch/util/BatchSettings.java)

```java
 /*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * BatchSettings.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author Yao Kaikyou
 */
package com.example.orgchart_api.batch.util;

import java.io.Serializable;
import java.util.Properties;

import com.example.orgchart_api.batch.exception.BatRuntimeException;

/**
 * <pre>
 * バッチの挙動に関する設定を保持するクラス
 *
 * Spring Boot 3.5.0対応変更点:
 * 1. フィールドインジェクション廃止
 * 2. デフォルトコンストラクタ廃止
 * 3. OS判定ロジックの共通化
 * 4. プロパティ取得処理の堅牢化
 *
 * &lt;MODIFICATION HISTORY&gt;
 * 1.0 2013/09/12 KSC Hiroaki Endo 新規作成
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public class BatchSettings implements Serializable {

    private static final long serialVersionUID = 1L;

    private final Properties props;
    private final String osType;

    /**
     * コンストラクタ（必須）
     *
     * @param p プロパティファイルの内容
     * @throws IllegalArgumentException プロパティがnullの場合
     */
    public BatchSettings(Properties p) {
        if (p == null) {
            throw new IllegalArgumentException("BatchSettings requires non-null Properties");
        }
        this.props = p;
        this.osType = determineOsType();
    }

    /**
     * OS種別を判定
     */
    private String determineOsType() {
        String osName = System.getProperty("os.name", "").toLowerCase();
        if (osName.contains("windows")) {
            return "Win32";
        } else if (osName.contains("linux") ||
                osName.contains("mac") ||
                osName.contains("unix")) {
            return "Linux";
        }
        return "Win32"; // デフォルト値
    }

    /**
     * プロパティ取得（共通チェック付き）
     *
     * @param key プロパティキー
     * @param propertyName 表示用プロパティ名（エラーメッセージ用）
     * @return プロパティ値
     * @throws BatRuntimeException プロパティが存在しない場合
     */
    private String getRequiredProperty(String key, String propertyName) {
        String value = props.getProperty(key);
        if (value == null || value.trim().isEmpty()) {
            throw new BatRuntimeException(
                    "environment.propertiesに " + propertyName + " の定義がありません。"
            );
        }
        return value;
    }

    /**
     * OS依存プロパティ取得
     */
    private String getOsDependentProperty(String baseKey, String propertyName) {
        return getRequiredProperty(baseKey + "." + osType, propertyName);
    }

    /**
     * プロパティファイルの特定KEY情報を取得
     * @param key プロパティキー
     * @return プロパティ値（存在しない場合はnull）
     */
    public String getProperty(String key) {
        return props.getProperty(key);
    }

    // === プロパティ取得メソッド群 ===
    // 各メソッドで重複していたチェック処理を共通化

    public String getLockFile() {
        return getOsDependentProperty("LockFile", "LockFile");
    }

    public String getInputDir() {
        return getOsDependentProperty("InputDir", "InputDir");
    }

    public String getCsvFtpDir() {
        return getInputDir(); // 既存ロジック維持
    }

    public String getInputCompDir() {
        return getOsDependentProperty("InputCompDir", "InputCompDir");
    }

    public String getReceiveDir() {
        return getOsDependentProperty("ReceiveDir", "ReceiveDir");
    }

    public String getOutputDir() {
        return getOsDependentProperty("OutputDir", "OutputDir");
    }

    public String getOutputDirDB() {
        String baseDir = getOutputDir();
        String subDir = getOsDependentProperty("OutputDir2", "OutputDir2");
        return baseDir + subDir;
    }

    public String getOutputDirAssociate() {
        String baseDir = getOutputDir();
        String subDir = getOsDependentProperty("OutputDir3", "OutputDir3");
        return baseDir + subDir;
    }

    public String getOutputDirCircuitlist() {
        String baseDir = getOutputDir();
        String subDir = getOsDependentProperty("OutputDir4", "OutputDir4");
        return baseDir + subDir;
    }

    public String getReceiveStDir() {
        return getOsDependentProperty("ReceiveDir", "ReceiveStDir");
    }

    public String getOutPutRetireDir() {
        return getOsDependentProperty("OutputRetireDir", "OutputRetireDir");
    }

    public String getOutPutNewUsersDir() {
        return getOsDependentProperty("OutputNewUsersDir", "OutputNewUsersDir");
    }

    public String getOutPutErrFileDir() {
        return getOsDependentProperty("OutputErrFileDir", "OutputErrFileDir");
    }

    public String getOutPutErrFileNm() {
        return getRequiredProperty("OutputErrFileNm", "OutputErrFileNm");
    }

    public String getErrMessage() {
        return getRequiredProperty("BT_000_E007", "BT_000_E007");
    }

    public String getManageSearchCsvDir() {
        return getOsDependentProperty("ManageSearchCsvDir", "ManageSearchCsvDir");
    }

    public String getFileSeparetor() {
        return System.getProperty("file.separator");
    }

    // CSVファイル名取得メソッド群
    public String getBizOrganizationCsvFileName() {
        return getRequiredProperty("BizOrganizationCsvFileName", "BizOrganizationCsvFileName");
    }

    public String getBizDepartmentCsvFileName() {
        return getRequiredProperty("BizDepartmentCsvFileName", "BizDepartmentCsvFileName");
    }

    public String getBizEmployeeCsvFileName() {
        return getRequiredProperty("BizEmployeeCsvFileName", "BizEmployeeCsvFileName");
    }

    public String getBizAdCsvFileName() {
        return getRequiredProperty("BizAdCsvFileName", "BizAdCsvFileName");
    }

    public String getTmpIntEmployeeCsvFileName() {
        return getRequiredProperty("TmpIntEmployeeCsvFileName", "TmpIntEmployeeCsvFileName");
    }

    public String getTmpIntDepartmentCsvFileName() {
        return getRequiredProperty("TmpIntDepartmentCsvFileName", "TmpIntDepartmentCsvFileName");
    }

    public String getTmpAdCsvFileName() {
        return getRequiredProperty("TmpAdCsvFileName", "TmpAdCsvFileName");
    }

    public String getBizShiftCsvFileName() {
        return getRequiredProperty("BizShiftCsvFileName", "BizShiftCsvFileName");
    }

    public String getDumOrganizationCsvFileName() {
        return getRequiredProperty("DumOrganizationCsvFileName", "DumOrganizationCsvFileName");
    }

    public String getTmpIntOrganizationCsvFileName() {
        return getRequiredProperty("TmpIntOrganizationCsvFileName", "TmpIntOrganizationCsvFileName");
    }

    // === 共通化されたメソッドを使用してリファクタリング ===

    public String getDumDepartmentCsvFileName() {
        return getRequiredProperty("DumDepartmentCsvFileName", "DumDepartmentCsvFileName");
    }

    public String getDumEmployeeCsvFileName() {
        return getRequiredProperty("DumEmployeeCsvFileName", "DumEmployeeCsvFileName");
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
//  一括入出力用CSVファイル -----------------------------------------------------
    public String getDbAppUserCsvFileName() {
        return getRequiredProperty("DbAppUserCsvFileName", "DbAppUserCsvFileName");
    }

    public String getDbBizAdFileName() {
        return getRequiredProperty("DbBizAdFileName", "DbBizAdFileName");
    }

    public String getDbBizDepartmentCsvFileName() {
        return getRequiredProperty("DbBizDepartmentCsvFileName", "DbBizDepartmentCsvFileName");
    }

    public String getDbBizEmployeeCsvFileName() {
        return getRequiredProperty("DbBizEmployeeCsvFileName", "DbBizEmployeeCsvFileName");
    }

    public String getDbBizOrganizationCsvFileName() {
        return getRequiredProperty("DbBizOrganizationCsvFileName", "DbBizOrganizationCsvFileName");
    }

    public String getDbBizShiftCsvFileName() {
        return getRequiredProperty("DbBizShiftCsvFileName", "DbBizShiftCsvFileName");
    }

    public String getDbCcmLineCsvFileName() {
        return getRequiredProperty("DbCcmLineCsvFileName", "DbCcmLineCsvFileName");
    }

    public String getDbChargeAssociationCsvFileName() {
        return getRequiredProperty("DbChargeAssociationCsvFileName", "DbChargeAssociationCsvFileName");
    }

    public String getDbDumDepartmentCsvFileName() {
        return getRequiredProperty("DbDumDepartmentCsvFileName", "DbDumDepartmentCsvFileName");
    }

    public String getDbDumEmployeeCsvFileName() {
        return getRequiredProperty("DbDumEmployeeCsvFileName", "DbDumEmployeeCsvFileName");
    }

    public String getDbDumOrganizationCsvFileName() {
        return getRequiredProperty("DbDumOrganizationCsvFileName", "DbDumOrganizationCsvFileName");
    }

    public String getDbMBranchCsvFileName() {
        return getRequiredProperty("DbMBranchCsvFileName", "DbMBranchCsvFileName");
    }

    public String getDbMSectionCsvFileName() {
        return getRequiredProperty("DbMSectionCsvFileName", "DbMSectionCsvFileName");
    }

    public String getDbRCcmPhoneLineCsvFileName() {
        return getRequiredProperty("DbRCcmPhoneLineCsvFileName", "DbRCcmPhoneLineCsvFileName");
    }

    public String getDbCcmPhoneCsvFileName() {
        return getRequiredProperty("DbCcmPhoneCsvFileName", "DbCcmPhoneCsvFileName");
    }

    public String getDbRCcmUserPhoneCsvFileName() {
        return getRequiredProperty("DbRCcmUserPhoneCsvFileName", "DbRCcmUserPhoneCsvFileName");
    }

    public String getDbRSectionBranchCsvFileName() {
        return getRequiredProperty("DbRSectionBranchCsvFileName", "DbRSectionBranchCsvFileName");
    }

    public String getDbRUserRoleCsvFileName() {
        return getRequiredProperty("DbRUserRoleCsvFileName", "DbRUserRoleCsvFileName");
    }

    public String getDbRUserSectionCsvFileName() {
        return getRequiredProperty("DbRUserSectionCsvFileName", "DbRUserSectionCsvFileName");
    }

    public String getDbSysScheduleCsvFileName() {
        return getRequiredProperty("DbSysScheduleCsvFileName", "DbSysScheduleCsvFileName");
    }

    public String getDbTelDirAssociationCsvFileName() {
        return getRequiredProperty("DbTelDirAssociationCsvFileName", "DbTelDirAssociationCsvFileName");
    }

    public String getDbCUCAssociationCsvFileName() {
        return getRequiredProperty("DbCUCAssociationCsvFileName", "DbCUCAssociationCsvFileName");
    }

    public String getDbVoiceLoggerAssociationCsvFileName() {
        return getRequiredProperty("DbVoiceLoggerAssociationCsvFileName", "DbVoiceLoggerAssociationCsvFileName");
    }

    public String getDbCcmCallingSearchSpaceCsvFileName() {
        return getRequiredProperty("DbCcmCallingSearchSpaceCsvFileName", "DbCcmCallingSearchSpaceCsvFileName");
    }

    public String getDbCcmPickupGroupCsvFileName() {
        return getRequiredProperty("DbCcmPickupGroupCsvFileName", "DbCcmPickupGroupCsvFileName");
    }

    public String getDbExcludeExecutiveCsvFileName() {
        return getRequiredProperty("DbExcludeExecutiveCsvFileName", "DbExcludeExecutiveCsvFileName");
    }

    public String getDbThresholdCsvFileName() {
        return getRequiredProperty("DbThresholdCsvFileName", "DbThresholdCsvFileName");
    }

    public String getDbCcmTypeProductCsvFileName() {
        return getRequiredProperty("DbCcmTypeProductCsvFileName", "DbCcmTypeProductCsvFileName");
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////
// Export CSV 系
    public String getExportTelDir() {
        return getRequiredProperty("CsvExport.TelDir", "CsvExport.TelDir");
    }

    public String getExportCUC() {
        return getRequiredProperty("CsvExport.CUC", "CsvExport.CUC");
    }

    public String getExportVoice() {
        return getRequiredProperty("CsvExport.Voice", "CsvExport.Voice");
    }

    public String getImportVoice() {
        return getRequiredProperty("CsvImport.Voice", "CsvImport.Voice");
    }

    public String getExportCharge() {
        return getRequiredProperty("CsvExport.Charge", "CsvExport.Charge");
    }

    public String getExportAD() {
        return getRequiredProperty("CsvExport.AD", "CsvExport.AD");
    }

    public String getExportLineList() {
        return getRequiredProperty("CsvExport.LineList", "CsvExport.LineList");
    }

    public String getExportManage() {
        return getRequiredProperty("CsvExport.Manage", "CsvExport.Manage");
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////

    public String getBatchJudgeDir() {
        return getOsDependentProperty("BatchJudgeDir", "BatchJudgeDir");
    }

    public String getBatchJudgeFileName(String propName) {
        return getRequiredProperty(propName, propName);
    }

    public String getMaintenanceFileName(String propName) {
        return getRequiredProperty(propName, propName);
    }

    public String getLoginDir() {
        return getOsDependentProperty("LoginDir", "LoginDir");
    }

    public String getMaintenanceLoginDir() {
        return getOsDependentProperty("MaintenanceLoginDir", "MaintenanceLoginDir");
    }

    public String getWebXmlDir() {
        return getOsDependentProperty("WebXmlDir", "WebXmlDir");
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
// 人事情報取込バッチ用
    public String getEofAd() {
        return getRequiredProperty("Eof.Ad", "Eof.Ad");
    }

    public String getEofAm() {
        return getRequiredProperty("Eof.Am", "Eof.Am");
    }

    public String getBizOrganizationCsvHeader() {
        return getRequiredProperty("BizOrganizationCsvHeader", "BizOrganizationCsvHeader");
    }

    public String getBizDepartmentCsvHeader() {
        return getRequiredProperty("BizDepartmentCsvHeader", "BizDepartmentCsvHeader");
    }

    public String getBizEmployeeCsvHeader() {
        return getRequiredProperty("BizEmployeeCsvHeader", "BizEmployeeCsvHeader");
    }

    public String getBizAdCsvHeader() {
        return getRequiredProperty("BizAdCsvHeader", "BizAdCsvHeader");
    }

    public String getBizShiftCsvHeader() {
        return getRequiredProperty("BizShiftCsvHeader", "BizShiftCsvHeader");
    }

    public String getBizOrganizationTableName() {
        return getRequiredProperty("BizOrganizationTableName", "BizOrganizationTableName");
    }

    public String getBizDepartmentTableName() {
        return getRequiredProperty("BizDepartmentTableName", "BizDepartmentTableName");
    }

    public String getBizEmployeeTableName() {
        return getRequiredProperty("BizEmployeeTableName", "BizEmployeeTableName");
    }

    public String getBizAdTableName() {
        return getRequiredProperty("BizAdTableName", "BizAdTableName");
    }

    public String getBizShiftTableName() {
        return getRequiredProperty("BizShiftTableName", "BizShiftTableName");
    }

    public String getRetiredUserFileName() {
        return getRequiredProperty("RetiredUserFileName", "RetiredUserFileName");
    }

    public String getJoinedUserFileName() {
        return getRequiredProperty("JoinedUserFileName", "JoinedUserFileName");
    }

    public String getTmpBizOrganizationTableName() {
        return getRequiredProperty("TmpBizOrganizationTableName", "TmpBizOrganizationTableName");
    }

    public String getTmpBizDepartmentTableName() {
        return getRequiredProperty("TmpBizDepartmentTableName", "TmpBizDepartmentTableName");
    }

    public String getTmpBizEmployeeTableName() {
        return getRequiredProperty("TmpBizEmployeeTableName", "TmpBizEmployeeTableName");
    }

    public String getTmpBizAdTableName() {
        return getRequiredProperty("TmpBizAdTableName", "TmpBizAdTableName");
    }

    public String getTmpBizOrganizationCsvHeader() {
        return getRequiredProperty("TmpBizOrganizationCsvHeader", "TmpBizOrganizationCsvHeader");
    }

    public String getTmpBizEmployeeCsvHeader() {
        return getRequiredProperty("TmpBizEmployeeCsvHeader", "TmpBizEmployeeCsvHeader");
    }

    public String getTmpBizDepartmentCsvHeader() {
        return getRequiredProperty("TmpBizDepartmentCsvHeader", "TmpBizDepartmentCsvHeader");
    }

    public String getTmpBizAdCsvHeader() {
        return getRequiredProperty("TmpBizAdCsvHeader", "TmpBizAdCsvHeader");
    }
    ////////////////////////////////////////////////////////////////////////////////////////////////////
    public String getChargeCsvHeader() {
        return getRequiredProperty("ChargeCsvHeader", "ChargeCsvHeader");
    }

    public String getCUCCsvHeader() {
        return getRequiredProperty("CUCCsvHeader", "CUCCsvHeader");
    }

    public String getADCsvHeader() {
        return getRequiredProperty("ADCsvHeader", "ADCsvHeader");
    }

    public String getTelDirCsvHeader() {
        return getRequiredProperty("TelDirCsvHeader", "TelDirCsvHeader");
    }

    public String getLineListCsvHeader() {
        return getRequiredProperty("LineListCsvHeader", "LineListCsvHeader");
    }

    public String getManageHeader() {
        return getRequiredProperty("ManageCsvHeader", "ManageCsvHeader");
    }

    public String getVoiceCsvHeader() {
        return getRequiredProperty("VoiceCsvHeader", "VoiceCsvHeader");
    }

    public String getVoiceTableName() {
        return getRequiredProperty("VoiceTableName", "VoiceTableName");
    }

    public String getAllTableName() {
        return getRequiredProperty("AllTable", "AllTable");
    }
}



```

### **BatchSettings.java の段階的な実装手順とコツ**

（初心者向けに、**「プロパティファイルの読み込み → 設定値の取得 → バッチ処理での活用」** の流れで解説します。）

---

## **1. プロパティファイルの読み込み（基礎編）**

### **目標**

`environment.properties` から設定値を読み込む `BatchSettings` クラスを作成する。

### **実装手順**

#### **(1) コンストラクタでプロパティを読み込む**

```java
public class BatchSettings {
    private final Properties props;

    // コンストラクタ（必須）
    public BatchSettings(Properties props) {
        if (props == null) {
            throw new IllegalArgumentException("プロパティファイルがnullです");
        }
        this.props = props;
    }
}
```

- **ポイント**:
  - `Properties` オブジェクトを引数で受け取り、クラス内で保持する。
  - `final` を付けることで、不変（イミュータブル）な設計に。

#### **(2) プロパティ値を取得するメソッド**

```java
public String getProperty(String key) {
    return props.getProperty(key); // キーに対応する値を返す
}
```

- **使い方**:
  ```java
  BatchSettings settings = new BatchSettings(loadedProperties);
  String csvDir = settings.getProperty("InputDir.Win32");
  ```

---

## **2. OS ごとの設定値を自動判別（応用編）**

### **目標**

Windows/Linux で異なる設定値を、自動的に判別して取得する。

### **実装手順**

#### **(1) OS 種別を判定するメソッド**

```java
private String determineOsType() {
    String osName = System.getProperty("os.name", "").toLowerCase();
    if (osName.contains("win")) {
        return "Win32";
    } else {
        return "Linux"; // デフォルト
    }
}
```

#### **(2) OS 依存のプロパティを取得**

```java
public String getInputDir() {
    String osType = determineOsType();
    return props.getProperty("InputDir." + osType);
}
```

- **ポイント**:
  - `InputDir.Win32` または `InputDir.Linux` を自動選択。

---

## **3. 必須設定値のチェック（堅牢化編）**

### **目標**

プロパティが未定義の場合、エラーを投げて早期に気付けるようにする。

### **実装手順**

#### **(1) 必須チェック付きメソッド**

```java
private String getRequiredProperty(String key, String propertyName) {
    String value = props.getProperty(key);
    if (value == null || value.trim().isEmpty()) {
        throw new BatRuntimeException(propertyName + " が設定されていません");
    }
    return value;
}
```

#### **(2) 例: CSV ファイル名の取得**

```java
public String getBizEmployeeCsvFileName() {
    return getRequiredProperty("BizEmployeeCsvFileName", "社員CSVファイル名");
}
```

---

## **4. バッチ処理での活用例**

### **目標**

`BatchSettings` を使って、実際に CSV ファイルを読み込む。

### **実装手順**

#### **(1) プロパティファイルを読み込む**

```java
Properties props = new Properties();
try (InputStream is = new FileInputStream("environment.properties")) {
    props.load(is);
} catch (IOException e) {
    throw new BatRuntimeException("プロパティファイルの読み込みに失敗しました", e);
}

BatchSettings settings = new BatchSettings(props);
```

#### **(2) CSV ファイルのパスを取得**

```java
String csvPath = settings.getInputDir() + settings.getBizEmployeeCsvFileName();
```

#### **(3) CSV を読み込む（例: OpenCSV 使用）**

```java
try (CSVReader reader = new CSVReader(new FileReader(csvPath))) {
    List<String[]> records = reader.readAll();
    for (String[] record : records) {
        System.out.println(Arrays.toString(record));
    }
}
```

---

## **5. テスト方法（確認手順）**

### **目標**

実装が正しいか確認する。

### **手順**

#### **(1) ユニットテスト（JUnit）**

```java
@Test
public void testGetInputDir() {
    Properties props = new Properties();
    props.setProperty("InputDir.Win32", "C:/input");
    props.setProperty("InputDir.Linux", "/home/input");

    BatchSettings settings = new BatchSettings(props);
    assertEquals("C:/input", settings.getInputDir()); // Windows環境の場合
}
```

#### **(2) 実際のプロパティファイルで動作確認**

```java
public static void main(String[] args) {
    Properties props = loadProperties(); // ファイルから読み込み
    BatchSettings settings = new BatchSettings(props);
    System.out.println("CSV出力先: " + settings.getOutputDir());
}
```

---

## **まとめ（実装のコツ）**

1. **コンストラクタでプロパティを受け取る**

   - 依存性注入（DI）の原則に従い、外部から `Properties` を渡す。

2. **OS 判別ロジックを分離**

   - `determineOsType()` で判定し、他のメソッドから呼び出す。

3. **必須チェックを共通化**

   - `getRequiredProperty()` で NULL チェックとエラーメッセージを統一。

4. **テスト駆動開発（TDD）**

   - 小さな単位でテストを書きながら実装する。

5. **例外処理を適切に**
   - プロパティ未定義時は `BatRuntimeException` で即時失敗させる。

---

### **次にやること（発展課題）**

- **Spring Boot 連携**: `@ConfigurationProperties` で設定管理
- **ロギングの追加**: 取得した設定値をログ出力
- **マルチスレッド対応**: `synchronized` でスレッドセーフに

必要に応じてさらに詳しい部分を解説します！
