# Hello World

⛅️♥️🌀💪💦🎧🙇🚣🔁🎯🍪▼👇❗✍️📁🚀🔥⚠️🌐🚨🙌🛡️🌟🏆🧩🛡️🔔⏱️🗃️⚛️📣🤝🏗️ 🧭🪜 ⭕️🔚💬🔜📌👑 ❓✨❌🥇🥈🥉🛠📊⚙️ 🧪🧠🔧✔✅🚫🔍🧭 🧱
💥

以下に、人事情報受信処理の業務フローを集約・整理しました。主要な処理ステップと注意点を明確に示しています。

### 人事情報受信処理 業務フロー概要

#### 1. 事前準備

- **必須ファイル**：6 種類の CSV（組織/店部課/社員/AD 情報/機構改革/終了フラグ）
- **運用側作業**：
  - 除外役職情報登録（`exclude_executive`テーブル）
  - ダミー情報整備（`DUM_ORGANIZATION`/`DUM_DEPARTMENT`/`DUM_EMPLOYEE`）
  - 閾値設定（`THRESHOLD`テーブル）

#### 2. 処理フロー

1. **ファイル受信チェック**

   - 早朝 6 時に Hulft 転送を確認
   - 必須 6 ファイル欠損時は即時エラー

2. **ロック処理**

   - 二重実行防止のためロックファイル作成

3. **データ取込（全件置換）**
   | CSV ファイル | 対象テーブル | 特別処理内容 |
   |---------------------|---------------------|------------------------------------------------------------------------------|
   | organization.csv | BIZ_ORGANIZATION | ダミー組織除外 |
   | department.csv | BIZ_DEPARTMENT | 会社コード 001/002 以外除外 + ダミー店部課除外 |
   | employee.csv | BIZ_EMPLOYEE | 会社コード制限 + ダミー社員 + 除外役職コード除外 |
   | ad.csv | BIZ_AD | ログオン名 10 桁時は末尾 7 桁使用（重複時は後勝ち） |
   | shift.csv | BIZ_SHIFT | 存在時のみ取込 |
   | EOFAD/EOFAM | - | 処理終了フラグ |

4. **データ整合性処理**

   - **閾値チェック**：入社数 + 退社数 + 異動数が閾値超過時はロールバック
   - **店部課マスタ同期**：
     - 新規店部課追加（`M_SECTION`）
     - 既存店部課情報更新（名称/親 ID/組織コード/表示順）
   - **社員ステータス管理**：
     - 退社処理（4 テーブルの削除フラグ更新）
     - 入社処理（`APP_USER`への新規登録）
     - 社員情報更新（社員区分/氏名/生年月日など）

5. **組織変更対応**
   - **拠点統廃合**：
     1. 廃止店部課のユーザー/電話機を新部署に移行
     2. 関連リソース更新（CallingSearchSpace/PickupGroup/課金先）
   - **所属管理**：
     - 新規所属追加（入社/転勤/兼務対応）
     - 所属変更（店部課名変更時）
     - 転出元所属削除（電話機未紐付時は物理削除）

#### 3. 終了処理

- **正常時**：
  - CSV ファイルをリネーム（`_IMPORTED_YYYYMMDDHH24MISS`）
  - トランザクションコミット
  - ロックファイル削除
- **異常時**：
  - 全処理ロールバック（前日状態に復旧）
  - エラーログ出力

#### 4. 出力物

- **退職者一覧**：`retired_users_YYYY-MM-DD.log`
  ```sql
  SELECT 姓, 名, 電話番号, 姓名結合ID
  FROM APP_USER
  WHERE DELETED = '1'
  ORDER BY 電話番号
  ```

### 特別注意点

1. **全件置換方式**：

   - 毎回テーブル全削除 → 再登録のため、CSV は完全なデータセットが必要
   - ダミーデータ除外は取込後に実施

2. **エラー処理**：

   - CSV 形式不正や閾値超過時は即時中止
   - メール通知による異常検知

3. **手動実行**：

   - 定期バッチ（日次）以外にシェル起動で随時実行可能

4. **パフォーマンス**：
   - 大規模データ対応のため、閾値管理を実施
   - バッチ処理時間帯を考慮（通常は深夜帯実行）

> この処理は人事システムと統合 ID システムの重要な連携ポイントであり、組織変更や人事異動がアプリケーション上で正しく反映されることを保証します。特に機構改革時の拠点統廃合処理では、電話機や課金情報など複数の関連リソースが自動更新されることが特徴です。

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/jp.co.ksc.batch.exception

`batchプロジェクト/irdb/jp.co.ksc.batch.exception/AlreadyExecutedException.java`

```java
/*
 * LockFileManager.java
 *
 * <pre>
 * バッチの多重起動を防ぐロックファイルの操作を行うクラス
 * <MODIFICATION HISTORY>
 * 1.0 2013/09/12 KSC Hiroaki Endo
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
package jp.co.ksc.batch.exception;

/**
 * <pre>
 * バッチ処理を2重起動した場合に報告される例外です。
 * <MODIFICATION HISTORY>
 * 1.0 2013/09/12 KSC Hiroaki Endo
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public class AlreadyExecutedException extends Exception {

    /**
     * AlreadyExecutedException のインスタンスを生成します。
     */
    public AlreadyExecutedException() {
        super();
    }

    /**
     * 詳細メッセージを保持する AlreadyExecutedException のインスタンスを生成します。
     *
     * @param message 詳細メッセージ
     */
    public AlreadyExecutedException(String message) {
        super(message);
    }

    /**
     * 原因となった例外を保持する AlreadyExecutedException のインスタンスを生成します。
     *
     * @param cause 原因となった例外
     */
    public AlreadyExecutedException(Throwable cause) {
        super(cause);
    }

    /**
     * 詳細メッセージと原因となった例外を保持する AlreadyExecutedException のインスタンスを生成します。
     *
     * @param message 詳細メッセージ
     * @param cause   原因となった例外
     */
    public AlreadyExecutedException(String message, Throwable cause) {
        super(message, cause);
    }
}
```

`batchプロジェクト/irdb/jp.co.ksc.batch.exception/BatRuntimeException.java`

```java
/*
 * BatRuntimeException.java
 *
 * @date 2013/09/12
 * @version 1.0
 * author KSC Hiroaki Endo
 */

package jp.co.ksc.batch.exception;

import java.io.PrintStream;
import java.io.PrintWriter;

/**
 * バッチ系プログラムで発生したシステムエラーを報告するための例外クラス
 *
 * <MODIFICATION HISTORY>
 * 1.0 2013/09/12 KSC Hiroaki Endo
 *
 * author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public class BatRuntimeException extends RuntimeException {
    /** 元の例外 */
    private Throwable th;

    /**
     * BatRuntimeException のインスタンスを生成します。
     */
    public BatRuntimeException() {
        super();
    }

    /**
     * 詳細メッセージを保持する BatRuntimeException のインスタンスを生成します。
     * @param message 詳細メッセージ
     */
    public BatRuntimeException(final String message) {
        super(message);
    }

    /**
     * 原因となった例外を保持する BatRuntimeException のインスタンスを生成します。
     * @param cause 原因となった例外
     */
    public BatRuntimeException(final Throwable cause) {
        th = cause;
    }

    /**
     * 詳細メッセージと原因となった例外を保持する BatRuntimeException の
     * インスタンスを生成します。
     * @param message 詳細メッセージ
     * @param cause 原因となった例外
     */
    public BatRuntimeException(final String message, final Throwable cause) {
        super(message);
        th = cause;
    }

    /**
     * @see java.lang.Throwable#printStackTrace()
     */
    public void printStackTrace() {
        super.printStackTrace();
        System.err.println("*** Root Cause >>>");
        if (th != null) {
            th.printStackTrace();
        }
    }

    /**
     * @see java.lang.Throwable#printStackTrace(java.io.PrintStream)
     */
    public void printStackTrace(PrintStream s) {
        super.printStackTrace(s);
        s.println("*** Root Cause >>>");
        if (th != null) {
            th.printStackTrace(s);
        }
    }
}
```

`batchプロジェクト/irdb/jp.co.ksc.batch.exception/CSVException.java`

```java
/**
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * CSVException.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */

package jp.co.ksc.batch.exception;

import java.io.PrintStream;
import java.io.PrintWriter;

/**
 * csvファイルに異常があった場合に報告される例外クラス。
 *
 * <pre>
 * &lt;MODIFICATION HISTORY&gt;
 * 1.0 2013/09/12 KSC Hiroaki Endo FX
 * </pre>
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public class CSVException extends Exception {

    /** 元の例外 */
    private Throwable th;

    /**
     * デフォルトコンストラクタ
     */
    public CSVException() {
        super();
    }

    /**
     * デフォルトコンストラクタ
     * @param message 詳細メッセージ
     */
    public CSVException(String message) {
        super(message);
    }

    /**
     * デフォルトコンストラクタ
     * @param cause 原因となった例外
     */
    public CSVException(Throwable cause) {
        th = cause;
    }

    /**
     * デフォルトコンストラクタ
     * @param message 詳細メッセージ
     * @param cause 原因となった例外
     */
    public CSVException(String message, Throwable cause) {
        super(message);
        th = cause;
    }

    /**
     * @see java.lang.Throwable#printStackTrace()
     */
    public void printStackTrace() {
        super.printStackTrace();
        System.err.println("*** Root Cause >>> ");
        if (th != null) {
            th.printStackTrace();
        }
    }

    /**
     * @see java.lang.Throwable#printStackTrace(java.io.PrintStream)
     */
    public void printStackTrace(PrintStream s) {
        super.printStackTrace(s);
        s.println("*** Root Cause >>> ");
        if (th != null) {
            th.printStackTrace(s);
        }
    }

    /**
     * @see java.lang.Throwable#printStackTrace(java.io.PrintWriter)
     */
    public void printStackTrace(PrintWriter s) {
        super.printStackTrace(s);
        s.println("*** Root Cause >>> ");
        if (th != null) {
            th.printStackTrace(s);
        }
    }
}
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/jp.co.ksc.batch.log4j

`batchプロジェクト/irdb/jp.co.ksc.batch.log4j/BatchJobErrorFileAppender.java`

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * BatchJobErrorFileAppender.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */
package jp.co.ksc.batch.log4j;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import org.apache.log4j.FileAppender;


/**
 * <pre>
 * BatchJobAppender
 *
 * &lt;MODIFICATION HISTORY&gt;
 * 1.0 2013/09/12 KSC Hiroaki Endo 新規作成
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public class BatchJobErrorFileAppender extends FileAppender {

	/* (非 Javadoc)
	 * @see org.apache.log4j.FileAppender#setFile(java.lang.String)
	 */
	public void setFile(String fileName) {

		/* コマンドライン引数 */
		String[] commands = System.getProperty("sun.java.command").split(" ");
		String jobName = commands[2];

		/* 起動日時 */
		String timestamp = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Timestamp(System.currentTimeMillis()));

		super.setFile(fileName + jobName + "_ERROR_" + timestamp + ".log");
	}
}
```

`irdb/jp.co.ksc.batch.log4j/BatchJobFileAppender.java`

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * BatchJobFileAppender.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */
package jp.co.ksc.batch.log4j;

import java.sql.Timestamp;
import java.text.SimpleDateFormat;

import org.apache.log4j.FileAppender;


/**
 * <pre>
 * BatchJobAppender
 *
 * &lt;MODIFICATION HISTORY&gt;
 * 1.0 2013/09/12 KSC Hiroaki Endo 新規作成
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public class BatchJobFileAppender extends FileAppender {

	/* (非 Javadoc)
	 * @see org.apache.log4j.FileAppender#setFile(java.lang.String)
	 */
	public void setFile(String fileName) {

		/* コマンドライン引数 */
		String[] commands = System.getProperty("sun.java.command").split(" ");
		String jobName = commands[2];

		/* 起動日時 */
		String timestamp = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Timestamp(System.currentTimeMillis()));

		super.setFile(fileName + jobName + "_" + timestamp + ".log");
	}
}
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/jp.co.ksc.batch.step.processor

`irdb/jp.co.ksc.batch.step.processor/MasterProcessor.java`

```java
/**
 * MasterProcessor.javal
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */
package jp.co.ksc.batch.step.processor;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.item.ItemProcessor;

/**
 * マスタパラメータ取得Processor (処理なし)
 * author ksc
 **/
public class MasterProcessor implements ItemProcessor<Object, Object> {
    @SuppressWarnings("unused")
    private static final Log log = LogFactory.getLog(MasterProcessor.class);

    /**
     * (非 Javadoc)
     * @see org.springframework.batch.item.ItemProcessor#process(Object)
     */
    @Override
    public Object process(Object param) throws Exception {
        return param;
    }
}
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/jp.co.ksc.batch.step.reader

`irdb/jp.co.ksc.batch.step.reader/MasterReader.java`

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved
 *
 * MasterReader.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */
package jp.co.ksc.batch.step.reader;

import java.util.ArrayList;
import java.util.List;

import org.springframework.batch.item.ItemReader;
import org.springframework.batch.item.NonTransientResourceException;
import org.springframework.batch.item.ParseException;
import org.springframework.batch.item.UnexpectedInputException;

/**
 * MasterReader
 *
 * <pre>
 * マスタパラメータ取得 JOBReader (処理なし)
 *
 * &lt;MODIFICATION HISTORY&gt;
 * 1.0 2013/09/12 KSC Hiroaki Endo
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public class MasterReader implements ItemReader<Object> {
    // 実行フラグ
    private boolean flag = true;

    /**
     * (非 Javadoc)
     *
     * @see org.springframework.batch.item.ItemReader#read()
     */
    public Object read() throws Exception, UnexpectedInputException, ParseException, NonTransientResourceException {
        List<Integer> tmpList = new ArrayList<Integer>();
        tmpList.add(0);
        if (flag) {
            flag = false;
            return tmpList;
        } else {
            return null;
        }
    }
}
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/jp.co.ksc.batch.step.writer

`irdb/jp.co.ksc.batch.step.writer/LoadStaffInfoWriter.java`

```java
package jp.co.ksc.batch.step.writer;

import java.io.IOException;
import java.util.List;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;

import jp.co.ksc.batch.exception.BatRuntimeException;
import jp.co.ksc.batch.util.BatchSettings;
import jp.co.ksc.batch.util.LockFileManager;
import jp.co.netmarks.batch.component.LoadStaffInfoLogic;
import jp.co.netmarks.batch.dao.StaffInfoDAO;
import jp.co.netmarks.batch.dao.VacuumDAO;
import jp.co.netmarks.batch.persistence.LoadStaffMapper;
import jp.co.netmarks.util.ErrorMail;

/**
 * <p>Title: LoadStaffInfoWriter.java</p>
 * <pre>
 * 人事情報取込 Job Writer
 * </pre>
 * 2023/06/21
 * author Yao Kaikyou
 */
public class LoadStaffInfoWriter implements ItemWriter<Object> {
    private static final Log log = LogFactory.getLog(LoadStaffInfoWriter.class);

    @Autowired
    private Properties properties;

    @Autowired
    private LoadStaffInfoLogic lsl;

    @Autowired
    private StaffInfoDAO lsdao;

    @Autowired
    private LoadStaffMapper lsMapper;

    @Autowired
    private VacuumDAO vd;

    @Autowired
    private ErrorMail errMail;

    /**
     * 人事情報取込処理メイン
     *
     * @param paramList パラメーター
     * @throws Exception
     */
    public void write(List<?> paramList) throws Exception {
        BatchSettings bs = new BatchSettings(properties);

        // ロックファイルを確認
        try {
            LockFileManager.lock(bs);
            log.info(bs.getProperty("BT_000_1001"));
            // 1s1.movFiles(bs); // ファイル移動は確認済みなので、一旦コメントアウト
        } catch (IOException ex) {
            String errorMessage = bs.getProperty("BT_000_E001");
            throw new BatRuntimeException(errorMessage, ex);
        } finally {
            // ロック解除
            LockFileManager.unlock(bs);
        }

        try {
            String impcsvPath = bs.getCsvFtpDir(); // inputDir 変数A
            String InpCompPath = bs.getInputCompDir(); // 変数B
            // String OupRetirePath = bs.getOutputRetireDir(); // 退職・加入者データ格納先 変数C
            String fileEoFAd = bs.getEofAd(); // EofAd 変数D
            System.out.println(fileEoFAd);
            String fileEoFAM = bs.getEofAm(); // EofAm 変数E
            System.out.println(fileEoFAM);
            String bizAdFileNM = bs.getTmpAdCsvFileName(); // BizAdのCSVファイル名 変数F
            System.out.println(bizAdFileNM);
            String bizDeptFileNM = bs.getTmpIntDepartmentCsvFileName(); // BizDepartmentのCSVファイル名 変数G
            System.out.println(bizDeptFileNM);
            String bizEmpFileNM = bs.getTmpIntEmployeeCsvFileName(); // BizEmployeeのcsvファイル名 変数H
            System.out.println(bizEmpFileNM);
            String bizorgFileNM = bs.getTmpIntOrganizationCsvFileName(); // BizOrganizationのCSVファイル名 変数I
            System.out.println(bizorgFileNM);
            // String rUserFileNM = bs.getRetiredUserFileName(); // 退職者情報データファイル名 変数J
            // String jUserFileNM = bs.getJoinedUserFileName(); // 加入者情報データファイル名 変数K
            // String receivePath = bs.getReceiveDir(); // ReceiveDir 変数L
            System.out.println(impcsvPath);
            String[] fileNames = {
                    // impcsvPath + fileEoFAD,
                    // impcsvPath + fileEoFAM,
                    impcsvPath + bizAdFileNM,
                    impcsvPath + bizDeptFileNM,
                    impcsvPath + bizEmpFileNM,
                    impcsvPath + bizorgFileNM
            };
            if (!lsl.existsIndispensableCsvFile(fileNames)) {
                log.warn("人事情報取込み対象無し");
                throw new BatRuntimeException();
            } else {
                // 取得前にテーブルをクリア
                // BIZ_AD取込
                lsMapper.deleteBizAD();
                lsl.doBizAd(bs);

                // BIZ_DEPARTMENT取込
                lsMapper.deleteBizDepartment();
                lsl.doBizDepartment(bs); // 後ろの処理にデータが必要なので、仮に「dao.deleteBizDepartment();」をコメントアウト

                // BIZ_EMPLOYEE取込
                lsMapper.deleteBizEmployee();
                lsl.doBizEmployee(bs);

                // BIZ_ORGANIZATION取込
                lsMapper.deleteBizOrganization();
                // lsl.doBizorganization(bs);
                lsl.doBizOrganization(bs);
            }

            int msectioncnt = 0;
            int cntEmployee = 0;
            // 店部課マスタ追加
            msectioncnt = lsdao.insertMSection();
            log.info("店部課追加件数 : " + msectioncnt);

            msectioncnt = lsdao.updateMSection();
            log.info("店部課情報更新件数 : " + msectioncnt);

            // 退社処理
            cntEmployee = lsdao.retireAppUser();
            log.info("退社人数 : " + cntEmployee);

            String oPPath = bs.getOutPutNewUsersDir();
            System.out.println("OPPath---------" + oPPath);
            String JoinedPath = bs.getJoinedUserFileName();
            System.out.println("JoinedPath---" + JoinedPath);

            // 入社処理
            cntEmployee = lsdao.additionAppUser();
            log.info("入社人数: " + cntEmployee);

            // 既存社員のプロパティ更新
            cntEmployee = lsdao.updateAppUser();
            log.info("社員情報更新件数 : " + cntEmployee);

            // 社員の所属追加
            cntEmployee = lsdao.additionRUserSection();
            log.info("社員所属追加件数 : " + cntEmployee);

            // 社員の所属変更
            cntEmployee = lsdao.updateRUserSetion();
            log.info("社員所属更新件数 : " + cntEmployee);

            // 社員の転出元所属削除
            cntEmployee = lsdao.changePersonnel();
            log.info("社員所属削除件数 : " + cntEmployee);

            // FileRename
            lsl.csvFileRename(bs);

            // 退社者リスト出力
            lsl.retiredUserFileOut(bs);

            // 例外処理 エラーファイル作成
            lsl.creaErrFile(bs);

            log.info("Vacuum Analyze開始");
            vd.dayVacuum();
            log.info("Vacuum Analyze終了");
        } catch (Exception e) {
            throw e;
        } finally {
            // ロック解除
            LockFileManager.unlock(bs);
        }
    }
}
```

`batchプロジェクト/irdb/jp.co.ksc.batch.step.writer/CUCCSVExport.java`

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * CUCCSVExport.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */
package jp.co.ksc.batch.step.writer;

import java.io.BufferedWriter;
import java.io.FileWriter;
import java.io.IOException;
import java.text.MessageFormat;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;

import jp.co.ksc.batch.exception.BatRuntimeException;
import jp.co.ksc.batch.exception.CSVException;
import jp.co.ksc.batch.util.BatchSettings;
import jp.co.ksc.batch.util.CSVWriter;
import jp.co.ksc.batch.util.LockFileManager;
import jp.co.netmarks.batch.persistence.CSVExpImpMapper;

/**
 * <p>Title: CUCCSVExport.java</p>
  * <pre>
  * 'csv固定値書き込み対応
  * </pre>
* @Time:2023/07/14
* @author Yao KaiKyou
 */
public class CUCCSVExport implements ItemWriter<Object> {

    private static final Log log = LogFactory.getLog(CUCCSVExport.class);

    @Autowired
    private Properties properties;
    @Autowired
    private CSVExpImpMapper csvMapper;

    /**
     * UnityをCSVへExportします
     * @param paramList パラメータ
     * @throws Exception
     */
    @Override
    public void write(List<?> paramList) throws Exception {

        BatchSettings bs = new BatchSettings(properties);
        // ロックファイルを確認
        try {
            LockFileManager.lock(bs);
        } catch (IOException ex) {
            throw new BatRuntimeException(ex.getMessage(), ex);
        }
        try {

            // データ取得
            Map<String,Object>[] expVL = csvMapper.getCUCExp();
            log.info("expVLの要素数: " + expVL.length);

            String[] header = bs.getCUCCsvHeader().split(",", 0);
            if (header != null) {
                String outputFile = bs.getOutputDirAssociate() + getExpTimeAddFileNM(bs.getExportCUC());
                CSVWriter.writeCSV(outputFile, String.join(",", header), expVL);
            } else {
                String logMessage = bs.getProperty("BT_000_E003");
                String replacedMessage = MessageFormat.format(logMessage, "CUCCsvHeader");
                log.warn(replacedMessage);
                throw new CSVException();
            }

            //String logMessage = bs.getProperty("BT_000_E003");
            String logMessage = "{0}ファイルの処理は正常終了しました。処理件数：{1}";
            String arg1 = getExpTimeAddFileNM(bs.getExportCUC());
            int arg2 = expVL.length;
            logMessage = MessageFormat.format(logMessage, arg1, arg2);
            log.info(logMessage);
        } catch (Exception e) {
            throw e;
        } finally {
            // ロック解除
            LockFileManager.unlock(bs);
        }
    }

    /**
     * ファイル名の拡張子の前に現在の時間を追加するメソッド
     * @param fileName ファイル名
     * @return 拡張子の前に現在の時間を追加したファイル名
     */
    private String getExpTimeAddFileNM(String fileName) {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
        int dotIndex = fileName.lastIndexOf(".");
        if (dotIndex != -1) {
            // 拡張子が存在する場合
            String name = fileName.substring(0, dotIndex);
            String extension = fileName.substring(dotIndex);
            return name + "_" + timestamp + extension;
        } else {
            // 拡張子が存在しない場合
            return fileName + "_" + timestamp;
        }
    }

    /**
     * CSVファイルにデータを書き込むメソッド
     * @param fileName ファイル名
     * @param header ヘッダー
     * @param data データ
     * @throws IOException
     */
    private void writeCSV(String fileName, String header, Map<String,Object>[] data) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter(fileName))) {
            // ヘッダーを書き込む
            writer.write(header);
            writer.newLine();

            // データを書き込む
            for (Map<String,Object> row : data) {
                StringBuilder sb = new StringBuilder();
                for (Object value : row.values()) {
                    String sanitizedValue = sanitizeValue(value != null ? value.toString() : "");
                    sb.append(sanitizedValue).append(",");
                }
                sb.deleteCharAt(sb.lastIndexOf(","));
                writer.write(sb.toString());
                writer.newLine();
            }
        } catch (IOException e) {
            throw new IOException("CSVファイルの書き込み中にエラーが発生しました: " + e.getMessage(), e);
        }
    }

    /**
     * 値をエスケープするメソッド
     * @param value エスケープする値
     * @return エスケープされた値
     */
    private String sanitizeValue(String value) {
        // "?"をエスケープ処理する
        if (value.contains("?")) {
            value = value.replace("?", "\\?");
        }
        return value;
    }
}
```

`batchプロジェクト/irdb/jp.co.ksc.batch.step.writer/LineListCSVExport.java`

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * LineListCSVExport.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */
package jp.co.ksc.batch.step.writer;

import java.io.File;
import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;

import jp.co.ksc.batch.exception.BatRuntimeException;
import jp.co.ksc.batch.exception.CSVException;
import jp.co.ksc.batch.util.BaseConstants;
import jp.co.ksc.batch.util.BatchSettings;
import jp.co.ksc.batch.util.CSVUtil;
import jp.co.ksc.batch.util.LockFileManager;
import jp.co.netmarks.batch.persistence.CSVExpImpMapper;

/**
 * <pre>
 * LineListCSVExportor
 *
 * &lt;MODIFICATION HISTORY&gt;
 * 1.0 2013/09/12 KSC Hiroaki Endo 新規作成
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public class LineListCSVExport implements ItemWriter<Object> {

	private static final Log log = LogFactory.getLog(LineListCSVExport.class);

	@Autowired
    private Properties properties;
	@Autowired
	private CSVExpImpMapper csvMapper;

	/**
	 * LineListをCSVへExportします
	 * @param paramList パラメータ
	 * @throws Exception
	 */
	@Override
	public void write(List<?> paramList) throws Exception {

		BatchSettings bs = new BatchSettings(properties);
        // ロックファイルを確認
        try {
            LockFileManager.lock(bs);
        } catch (IOException ex) {
            throw new BatRuntimeException(ex.getMessage(), ex);
        }
        try {

            // データ取得
        	BaseConstants constants = new BaseConstants();
            //Map<String,Object>[] expVL = csvMapper.getLineListExp(constants);
            Map<String,Object>[] expVL = csvMapper.getUserAndTelCsvList(constants);
         // ループ処理でexpVLの中身をログに出力する
            for (Map<String, Object> map : expVL) {
                for (Map.Entry<String, Object> entry : map.entrySet()) {
                    String key = entry.getKey();
                    Object value = entry.getValue();

                    // ログに出力
                    log.info(key + ": " + value);
                    // または、System.out.printで出力する場合
                    // System.out.print(key + ": " + value + " ");
                }
                // 改行を入れるためのログ出力
                log.info(""); // または System.out.println(""); を使う場合
            }


            // 出力
            CSVUtil csv = new CSVUtil(expVL);
            csv.setHasHeader(true);
	        String[] header = bs.getLineListCsvHeader().split(",",0);

	        if (header != null) {
	            for (int i = 0; i < header.length; i++) {
	            	csv.addHeader(header[i]);
	            }
	        } else {
	            log.warn("CSVファイルのヘッダーが定義されてません。");
	            throw new CSVException();
	        }
            csv.setFileName(bs.getOutputDirCircuitlist() + csv.getExpTimeAddFileNM(bs.getExportLineList()));

            File backupDir = new File(bs.getOutputDirCircuitlist());
            if (!backupDir.exists()) {
                backupDir.mkdirs();
            }
            csv.write();

		}catch (Exception e){
			throw e;
		} finally {
            // ロック解除
            LockFileManager.unlock(bs);
		}
	}
}
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/jp.co.ksc.batch.util

`batchプロジェクト/irdb/jp.co.ksc.batch.util/LoadStaffInfoWriter.java`

```java
package jp.co.ksc.batch.util;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.List;

import org.springframework.batch.item.ItemWriter;

/**
 * <p>Title: LoadStaffInfoWriter.java</p>
  * <pre>
  * 連携ファイルの移動用クラス
  * </pre>
* @Time:2023/07/04
* @author Yao KaiKyou
 */
public class LoadStaffInfoWriter implements ItemWriter<Object> {
    private String importDir;
    private String exportDir;

    public LoadStaffInfoWriter(String importDir, String exportDir) {
        this.importDir = importDir;
        this.exportDir = exportDir;
    }

    public void write(List<?> plist) throws Exception {
        List<String> fileList = listFilesInDirectory(importDir);
        for (String fileName : fileList) {
            copyAndDeleteFile(importDir, exportDir, fileName);
        }
    }

    private List<String> listFilesInDirectory(String directory) {
        List<String> fileList = new ArrayList<>();
        File folder = new File(directory);
        if (folder.exists() && folder.isDirectory()) {
            File[] files = folder.listFiles();
            if (files != null) {
                for (File file : files) {
                    if (file.isFile()) {
                        fileList.add(file.getName());
                    }
                }
            }
        }
        return fileList;
    }

    private void copyAndDeleteFile(String sourceDir, String targetDir, String fileName) throws IOException {
        Path sourcePath = new File(sourceDir, fileName).toPath();
        Path targetPath = new File(targetDir, fileName).toPath();

        Files.copy(sourcePath, targetPath, StandardCopyOption.REPLACE_EXISTING);
        Files.delete(sourcePath);
    }
}
```

`batchプロジェクト/irdb/jp.co.ksc.batch.util/LockFileManager.java`

```java
package jp.co.ksc.batch.util;

import java.io.File;
import java.io.IOException;
import jp.co.ksc.batch.exception.AlreadyExecutedException;

/**
 * LockFileManager.java
 *
 * <pre>
 * バッチの多重起動を防ぐロックファイルの操作を行うクラス
 * <MODIFICATION HISTORY>
 * 1.0 2013/09/12 KSC Hiroaki Endo
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public final class LockFileManager {

    /**
     * デフォルトコンストラクタ
     */
    private LockFileManager() {
        super();
    }

    /**
     * ロックをかけます。
     *
     * @param setting BatchSettings
     * @throws AlreadyExecutedException すでにロックがかかっていた場合に報告されます。
     * @throws IOException              ファイル入出力エラー
     */
    public static synchronized void lock(BatchSettings setting)
            throws AlreadyExecutedException, IOException {
        File lock = new File(setting.getLockFile());
        if (lock.isFile()) {
            throw new AlreadyExecutedException("すでにバッチが起動しています。");
        } else {
            if (!lock.getParentFile().isDirectory()) {
                lock.getParentFile().mkdirs();
            }
            lock.createNewFile();
        }
    }

    /**
     * ロックを解除します。
     *
     * @param setting BatchSettings
     */
    public static synchronized void unlock(BatchSettings setting) {
        File lock = new File(setting.getLockFile());
        if (lock.isFile()) {
            lock.delete();
        }
    }

    /**
     * ロックされているかを確認します。
     *
     * @param setting BatchSettings
     * @return true ロックされています。false: ロックされていません
     */
    public static boolean isLocked(BatchSettings setting) {
        File lock = new File(setting.getLockFile());
        return lock.isFile();
    }
}
```

`バッチ処理/batchプロジェクト/irdb/jp.co.ksc.batch.util/BatchSettings.java`

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * BatchSettings.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */
package jp.co.ksc.batch.util;

import java.io.Serializable;
import java.util.Properties;

import org.springframework.beans.factory.annotation.Autowired;

import jp.co.ksc.batch.exception.BatRuntimeException;

/**
 * <pre>
 * バッチの挙動に関する設定を保持するクラス
 *
 * &lt;MODIFICATION HISTORY&gt;
 * 1.0 2013/09/12 KSC Hiroaki Endo 新規作成
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public class BatchSettings implements Serializable {

	@Autowired
    private Properties props;
	private String osType = "Win32";

    /**
     * コンストラクタ
     * @param p プロパティファイルの内容
     */
    public BatchSettings(Properties p) {
        super();
    	this.props = p;
    	String osname = System.getProperty("os.name");
    	if(osname.indexOf("Windows")>=0){
    	   // Windowsであったときの処理
    		this.osType = "Win32";
    	} else if(osname.indexOf("Linux")>=0){
    	   // Linuxであったときの処理
    		this.osType = "Linux";
    	}
    }

    /**
     * コンストラクタ
     */
    public BatchSettings() {
        super();
    }

    /**
     * プロパティファイルの特定KEY情報を取得
     * @param key
     * @return 特定KEYのプロパティ情報
     */
    public String getProperty(String key){
        return props.getProperty(key);
    }

    /**
     * ロックファイルのパスを取得します。
     * @return ロックファイルのパス
     */
    public String getLockFile() {
        String value = props.getProperty("LockFile."+ osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに LockFile の定義がありません。");
        }
        return value;
    }

    /**
     * CSVInputディレクトリの取得
     * @return FTPディレクトリ
     */
    public String getInputDir() {
        String value = props.getProperty("InputDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにInputDirの定義がありません。");
        }
        return value;
    }

    /**
     * CSVFTP先ディレクトリの取得
     * @return FTPディレクトリ
     */
    public String getCsvFtpDir() {
        return getInputDir();
    }

    /**
     * CSVImportCompleteディレクトリの取得
     * @return FTPディレクトリ
     */
    public String getInputCompDir() {
        String value = props.getProperty("InputCompDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにInputDirの定義がありません。");
        }
        return value;
    }

    /**
     * ReceiveDirディレクトリの取得
     * @return ReceiveDirディレクトリ
     */
    public String getReceiveDir() {
        String value = props.getProperty("ReceiveDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにReceiveDirの定義がありません。");
        }
        return value;
    }


    /**
     * Outputディレクトリの取得
     * @return Outputディレクトリ
     */
    public String getOutputDir() {
        String value = props.getProperty("OutputDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにOutputDirの定義がありません。");
        }
        return value;
    }

    /**
     * DBCSV Outputディレクトリの取得
     * @return Outputディレクトリ
     */
    public String getOutputDirDB() {
        String value = props.getProperty("OutputDir."+osType);
        value += props.getProperty("OutputDir2."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにOutputDir2の定義がありません。");
        }
        return value;
    }
    /**
     * AssociateCSV Outputディレクトリの取得
     * @return Outputディレクトリ
     */
    public String getOutputDirAssociate() {
        String value = props.getProperty("OutputDir."+osType);
        value += props.getProperty("OutputDir3."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにOutputDir3の定義がありません。");
        }
        return value;
    }
    /**
     * CircuitlistCSV Outputディレクトリの取得
     * @return Outputディレクトリ
     */
    public String getOutputDirCircuitlist() {
        String value = props.getProperty("OutputDir."+osType);
        value += props.getProperty("OutputDir4."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにOutputDir4の定義がありません。");
        }
        return value;
    }

    /**
     * RetireCSV Outputディレクトリの取得
     * @return Outputディレクトリ
     */
    public String getReceiveStDir() {
        String value = props.getProperty("ReceiveDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにReceiveStDirの定義がありません。");
        }
        return value;
    }

   /**
     * RetireCSV Outputディレクトリの取得
     * @return Outputディレクトリ
     */
    public String getOutPutRetireDir() {
        String value = props.getProperty("OutputRetireDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにOutputRetireDirの定義がありません。");
        }
        return value;
    }

    /**
     * NewUsersCSV Outputディレクトリの取得
     * @return Outputディレクトリ
     */
    public String getOutPutNewUsersDir() {
        String value = props.getProperty("OutputNewUsersDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにOutputNewUsersDirの定義がありません。");
        }
        return value;
    }

    /**
     * バッチエラーファイルのディレクトリの取得
     * @return バッチエラーファイルのディレクトリ
     */
    public String getOutPutErrFileDir() {
        String value = props.getProperty("ErrorFile."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにOutPutErrFileDirの定義がありません。");
        }
        return value;
    }

    /**
     * バッチエラーファイル名の取得
     * @return バッチエラーファイル名
     */
    public String getOutPutErrFileNm() {
        String value = props.getProperty("ErrorFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにOutPutErrFileNmの定義がありません。");
        }
        return value;
    }

    /**
     * バッチエラーファイル存在しないメッセージの取得
     * @return バッチエラーファイル存在しないメッセージ
     */
    public String getErrMessage() {
        String value = props.getProperty("BT_000_E007");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにErrMessageの定義がありません。");
        }
        return value;
    }

    /**
     * ユーザーと電話機の一覧 エクスポート/インポートディレクトリの取得
     * @return FTPディレクトリ
     */
    public String getManageSearchCsvDir() {
        String value = props.getProperty("ManageSearchCsvDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにManageSearchCsvDirの定義がありません。");
        }
        return value;
    }

    /**
     * ファイルディレクトリのセパレータを取得します。
     * @return ファイルディレクトリのセパレータ
     */
    public String getFileSeparetor(){
        return System.getProperty("file.separator");
    }

    /**
     * BizOrganizaionのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getBizOrganizationCsvFileName() {
        String value = props.getProperty("BizOrganizationCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizOrganizationCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * BizDepartmentのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getBizDepartmentCsvFileName() {
        String value = props.getProperty("BizDepartmentCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizDepartmentCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * BizEmployeeのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getBizEmployeeCsvFileName() {
        String value = props.getProperty("BizEmployeeCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizEmployeeCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * BizAdのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getBizAdCsvFileName() {
        String value = props.getProperty("BizAdCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizAdCsvFileName の定義がありません。");
        }
        return value;
    }

    /**
     * TmpIntEmployeeのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getTmpIntEmployeeCsvFileName() {
        String value = props.getProperty("TmpIntEmployeeCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに TmpIntEmployeeCsvFileName の定義がありません。");
        }
        return value;
    }

    /**
     * TmpIntDepartmentのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getTmpIntDepartmentCsvFileName() {
        String value = props.getProperty("TmpIntDepartmentCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに TmpIntDepartmentCsvFileName の定義がありません。");
        }
        return value;
    }

    /**
     * TmpAdのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getTmpAdCsvFileName() {
        String value = props.getProperty("TmpAdCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに TmpAdCsvFileName の定義がありません。");
        }
        return value;
    }

    /**
     * BizShiftのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getBizShiftCsvFileName() {
        String value = props.getProperty("BizShiftCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizShiftCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * DumOrganizationのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getDumOrganizationCsvFileName() {
        String value = props.getProperty("DumOrganizationCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに DumOrganizationCsvFileName の定義がありません。");
        }
        return value;
    }

    /**
     * TmpOrganizationのcsvファイル名を取得します。
     *
     * @return csvファイル名
     */
    public String getTmpIntOrganizationCsvFileName() {
        String value = props.getProperty("TmpIntOrganizationCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException("environment.propertiesにTmpOrganizationCsvFileNameの定義がありません。");
        }
        return value;
    }

    /**
     * DumDepartmentのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getDumDepartmentCsvFileName() {
        String value = props.getProperty("DumDepartmentCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに DumDepartmentCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * DumEmployeeのCSVファイル名を取得します。
     * @return CSVファイル名
     */
    public String getDumEmployeeCsvFileName() {
        String value = props.getProperty("DumEmployeeCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに DumEmployeeCsvFileName の定義がありません。");
        }
        return value;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
//  一括入出力用CSVファイル -----------------------------------------------------
    /**
     * APP_USER テーブル情報CSVファイル名(一括入出力用)
     * @return APP_USER テーブル情報CSVファイル名
     */
    public String getDbAppUserCsvFileName() {
        String value = props.getProperty("DbAppUserCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbAppUserCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * BIZ_AD テーブル情報CSVファイル名(一括入出力用)
     * @return BIZ_AD テーブル情報CSVファイル名
     */
    public String getDbBizAdFileName() {
        String value = props.getProperty("DbBizAdFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbBizAdFileName の定義がありません。");
        }
        return value;
    }
    /**
     * BIZ_DEPARTMENT テーブル情報CSVファイル名(一括入出力用)
     * @return BIZ_DEPARTMENT テーブル情報CSVファイル名
     */
    public String getDbBizDepartmentCsvFileName() {
        String value = props.getProperty("DbBizDepartmentCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbBizDepartmentCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * BIZ_EMPLOYEE テーブル情報CSVファイル名(一括入出力用)
     * @return BIZ_EMPLOYEE テーブル情報CSVファイル名
     */
    public String getDbBizEmployeeCsvFileName() {
        String value = props.getProperty("DbBizEmployeeCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbBizEmployeeCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * BIZ_ORGANIZATION テーブル情報CSVファイル名(一括入出力用)
     * @return BIZ_ORGANIZATION テーブル情報CSVファイル名
     */
    public String getDbBizOrganizationCsvFileName() {
        String value = props.getProperty("DbBizOrganizationCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbBizOrganizationCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * BIZ_SHIFT テーブル情報CSVファイル名(一括入出力用)
     * @return BIZ_SHIFT テーブル情報CSVファイル名
     */
    public String getDbBizShiftCsvFileName() {
        String value = props.getProperty("DbBizShiftCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbBizShiftCsvFileName  の定義がありません。");
        }
        return value;
    }
    /**
     * CCM_LINE テーブル情報CSVファイル名(一括入出力用)
     * @return CCM_LINE テーブル情報CSVファイル名
     */
    public String getDbCcmLineCsvFileName() {
        String value = props.getProperty("DbCcmLineCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbCcmLineCsvFileName の定義がありません。");
        }

        return value;
    }
    /**
     * CHARGE_ASSOCIATION テーブル情報CSVファイル名(一括取り込み用)
     * @return CHARGE_ASSOCIATION テーブル情報CSVファイル名
     */
    public String getDbChargeAssociationCsvFileName() {
        String value = props.getProperty("DbChargeAssociationCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbChargeAssociationCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * DUM_DEPARTMENT テーブル情報CSVファイル名(一括入出力用)
     * @return DUM_DEPARTMENT テーブル情報CSVファイル名
     */
    public String getDbDumDepartmentCsvFileName() {
        String value = props.getProperty("DbDumDepartmentCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbDumDepartmentCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * DUM_EMPLOYEE テーブル情報CSVファイル名(一括入出力用)
     * @return DUM_EMPLOYEE テーブル情報CSVファイル名
     */
    public String getDbDumEmployeeCsvFileName() {
        String value = props.getProperty("DbDumEmployeeCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbDumEmployeeCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * DUM_ORGANIZATION テーブル情報CSVファイル名(一括入出力用)
     * @return DUM_ORGANIZATION テーブル情報CSVファイル名
     */
    public String getDbDumOrganizationCsvFileName() {
        String value = props.getProperty("DbDumOrganizationCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbDumOrganizationCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * M_BRANCH テーブル情報CSVファイル名(一括入出力用)
     * @return M_BRANCH テーブル情報CSVファイル名
     */
    public String getDbMBranchCsvFileName() {
        String value = props.getProperty("DbMBranchCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbMBranchCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * M_SECTION テーブル情報CSVファイル名(一括入出力用)
     * @return M_SECTION テーブル情報CSVファイル名
     */
    public String getDbMSectionCsvFileName() {
        String value = props.getProperty("DbMSectionCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbMSectionCsvFileName の定義がありません。");
        }
        return value;
    }

 /**
     * R_CCM_PHONE_LINE テーブル情報CSVファイル名(一括入出力用)
     * @return R_CCM_PHONE_LINE テーブル情報CSVファイル名
     */
    public String getDbRCcmPhoneLineCsvFileName() {
        String value = props.getProperty("DbRCcmPhoneLineCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbRCcmPhoneLineCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * CCM_PHONE テーブル情報CSVファイル名(一括入出力用)
     * @return CCM_PHONE テーブル情報CSVファイル名
     */
    public String getDbCcmPhoneCsvFileName() {
        String value = props.getProperty("DbCcmPhoneCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbCcmPhoneCsvFileName の定義がありません。");
        }
        return value;
    }

    /**
     * R_CCM_USER_PHONE テーブル情報CSVファイル名(一括入出力用)
     * @return R_CCM_USER_PHONE テーブル情報CSVファイル名
     */
    public String getDbRCcmUserPhoneCsvFileName() {
        String value = props.getProperty("DbRCcmUserPhoneCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbRCcmUserPhoneCsvFileName の定義がありません。");
        }
        return value;
    }

    /**
     * R_SECTION_BRANCH テーブル情報CSVファイル名(一括入出力用)
     * @return R_SECTION_BRANCH テーブル情報CSVファイル名
     */
    public String getDbRSectionBranchCsvFileName() {
        String value = props.getProperty("DbRSectionBranchCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbRSectionBranchCsvFileName の定義がありません。");
        }
        return value;
    }

    /**
     * R_USER_ROLE テーブル情報CSVファイル名(一括入出力用)
     * @return R_USER_ROLE テーブル情報CSVファイル名
     */
    public String getDbRUserRoleCsvFileName() {
        String value = props.getProperty("DbRUserRoleCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbRUserRoleCsvFileName の定義がありません。");
        }
        return value;
    }

    /**
     * R_USER_SECTION テーブル情報CSVファイル名(一括入出力用)
     * @return R_USER_SECTION テーブル情報CSVファイル名
     */
    public String getDbRUserSectionCsvFileName() {
        String value = props.getProperty("DbRUserSectionCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbRUserSectionCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * SYS_SCHEDULE テーブル情報CSVファイル名(一括入出力用)
     * @return SYS_SCHEDULE テーブル情報CSVファイル名
     */
    public String getDbSysScheduleCsvFileName() {
        String value = props.getProperty("DbSysScheduleCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbSysScheduleCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * TEL_DIR_ASSOCIATION テーブル情報CSVファイル名(一括入出力用)
     * @return TEL_DIR_ASSOCIATION テーブル情報CSVファイル名
     */
    public String getDbTelDirAssociationCsvFileName() {
        String value = props.getProperty("DbTelDirAssociationCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbTelDirAssociationCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * UNITY_ASSOCIATION テーブル情報CSVファイル名(一括入出力用)
     * @return UNITY_ASSOCIATION テーブル情報CSVファイル名
     */
    public String getDbCUCAssociationCsvFileName() {
        String value = props.getProperty("DbCUCAssociationCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                "environment.propertiesに" +
                " DbCUCAssociationCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * VOICE_LOGGER_ASSOCIATION テーブル情報CSVファイル名(一括入出力用)
     * @return VOICE_LOGGER_ASSOCIATION テーブル情報CSVファイル名
     */
    public String getDbVoiceLoggerAssociationCsvFileName() {
        String value = props.getProperty("DbVoiceLoggerAssociationCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbVoiceLoggerAssociationCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * CallingSearchSpace テーブル情報CSVファイル名(一括入出力用)
     * @return テーブル情報CSVファイル名
     */
    public String getDbCcmCallingSearchSpaceCsvFileName() {
        String value = props.getProperty("DbCcmCallingSearchSpaceCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbCcmCallingSearchSpaceCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * PickupGroupテーブル情報CSVファイル名(一括入出力用)
     * @return テーブル情報CSVファイル名
     */
    public String getDbCcmPickupGroupCsvFileName() {
        String value = props.getProperty("DbCcmPickupGroupCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbCcmPickupGroupCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * ExcludeExecutiveテーブル情報CSVファイル名(一括入出力用)
     * @return テーブル情報CSVファイル名
     */
    public String getDbExcludeExecutiveCsvFileName() {
        String value = props.getProperty("DbExcludeExecutiveCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbExcludeExecutiveCsvFileName の定義がありません。");
        }
        return value;
    }
    /**
     * Thresholdテーブル情報CSVファイル名(一括入出力用)
     * @return テーブル情報CSVファイル名
     */
    public String getDbThresholdCsvFileName() {
        String value = props.getProperty("DbThresholdCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbThresholdCsvFileName の定義がありません。");
        }
        return value;
    }
 /**
     * ProductTypeテーブル情報CSVファイル名(一括入出力用)
     * @return テーブル情報CSVファイル名
     */
    public String getDbCcmTypeProductCsvFileName() {
        String value = props.getProperty("DbCcmTypeProductCsvFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " DbCcmTypeProductCsvFileName の定義がありません。");
        }
        return value;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////
// Export CSV 系
    /**
     * TelDir 出力CSVファイル名
     * @return 出力CSVファイル名
     */
    public String getExportTelDir() {
        String value = props.getProperty("CsvExport.TelDir");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " CsvExport.TelDir の定義がありません。");
        }
        return value;
    }
    /**
     * Unity 出力CSVファイル名
     * @return 出力CSVファイル名
     */
    public String getExportCUC() {
        String value = props.getProperty("CsvExport.CUC");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " CsvExport.CUC の定義がありません。");
        }
        return value;
    }
    /**
     * VoiceLogger 出力CSVファイル名
     * @return 出力CSVファイル名
     */
    public String getExportVoice() {
        String value = props.getProperty("CsvExport.Voice");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " CsvExport.Voice の定義がありません。");
        }
        return value;
    }
    /**
     * VoiceLogger 入力CSVファイル名
     * @return 入力CSVファイル名
     */
    public String getImportVoice() {
        String value = props.getProperty("CsvImport.Voice");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " CsvImport.Voice の定義がありません。");
        }
        return value;
    }
    /**
     * Charge 出力CSVファイル名
     * @return 出力CSVファイル名
     */
    public String getExportCharge() {
        String value = props.getProperty("CsvExport.Charge");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " CsvExport.Charge の定義がありません。");
        }
        return value;
    }
    /**
     * AD 出力CSVファイル名
     * @return 出力CSVファイル名
     */
    public String getExportAD() {
        String value = props.getProperty("CsvExport.AD");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " CsvExport.AD の定義がありません。");
        }
        return value;
    }
    /**
     * LineList 出力CSVファイル名
     * @return 出力CSVファイル名
     */
    public String getExportLineList() {
        String value = props.getProperty("CsvExport.LineList");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " CsvExport.LineList の定義がありません。");
        }
        return value;
    }
    /**
     * Manage 出力CSVファイル名
     * @return 出力CSVファイル名
     */
    public String getExportManage() {
        String value = props.getProperty("CsvExport.Manage");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " CsvExport.Manage の定義がありません。");
        }
        return value;
    }
////////////////////////////////////////////////////////////////////////////////////////////////////


    /**
     * バッチ成否判定ディレクトリの取得
     * @return バッチ成否判定ディレクトリ
     */
    public String getBatchJudgeDir() {
        String value = props.getProperty("BatchJudgeDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにBatchJudgeDirの定義がありません。");
        }
        return value;
    }
 /**
     * バッチ成否判定ファイルの取得
     * @return バッチ成否判定ファイル名
     */
    public String getBatchJudgeFileName(String propName) {
        String value = props.getProperty(propName);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにBatchJudgeFile.*の定義がありません。");
        }
        return value;
    }

    /**
     * ログインJSPファイルの取得
     * @return ログインJSPファイル名
     */
    public String getMaintenanceFileName(String propName) {
        String value = props.getProperty(propName);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに[" + propName + "]の定義がありません。");
        }
        return value;
    }

    /**
     * ログインJSPディレクトリの取得
     * @return ログインJSPディレクトリ
     */
    public String getLoginDir() {
        String value = props.getProperty("LoginDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにLoginDirの定義がありません。");
        }
        return value;
    }

    /**
     * メンテナンス用ログインJSPディレクトリの取得
     * @return メンテナンス用ログインJSPディレクトリ
     */
    public String getMaintenanceLoginDir() {
        String value = props.getProperty("MaintenanceLoginDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにMaintenanceLoginDirの定義がありません。");
        }
        return value;
    }

    /**
     * web.xml格納ディレクトリの取得
     * @return web.xml格納ディレクトリ
     */
    public String getWebXmlDir() {
        String value = props.getProperty("WebXmlDir."+osType);
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesにWebXmlDirの定義がありません。");
        }
        return value;
    }


////////////////////////////////////////////////////////////////////////////////////////////////////
// 人事情報取込バッチ用 /////
    /**
     * EOFAD ファイル名
     * @return ファイル名
     */
    public String getEofAd() {
        String value = props.getProperty("Eof.Ad");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " Eof.Ad の定義がありません。");
        }
        return value;
    }
    /**
     * EOFAM ファイル名
     * @return ファイル名
     */
    public String getEofAm() {
        String value = props.getProperty("Eof.Am");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに" +
                    " Eof.Am の定義がありません。");
        }
        return value;
    }
    /**
     * BizOrganizationのCsvのHeaderを取得
     * @return BizOrganizationCsvHeader
     */
    public String getBizOrganizationCsvHeader() {
        String value = props.getProperty("BizOrganizationCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizOrganizationCsvHeader の定義がありません。");
        }
        return value;
    }
    /**
     * BizDepartmentのCsvのHeaderを取得
     * @return BizDepartmentCsvHeader
     */
    public String getBizDepartmentCsvHeader() {
        String value = props.getProperty("BizDepartmentCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizDepartmentCsvHeader の定義がありません。");
        }
        return value;
    }
    /**
     * BizEmployeeのCsvのHeaderを取得
     * @return BizEmployeeCsvHeader
     */
    public String getBizEmployeeCsvHeader() {
        String value = props.getProperty("BizEmployeeCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizEmployeeCsvHeader の定義がありません。");
        }
        return value;
    }
    /**
     * BizADのCsvのHeaderを取得
     * @return BizADCsvHeader
     */
    public String getBizAdCsvHeader() {
        String value = props.getProperty("BizAdCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizAdCsvHeader の定義がありません。");
        }
        return value;
    }
    /**
     * BizShiftのCsvのHeaderを取得
     * @return BizShiftCsvHeader
     */
    public String getBizShiftCsvHeader() {
        String value = props.getProperty("BizShiftCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizShiftCsvHeader の定義がありません。");
        }
        return value;
    }
    /**
     * BizOrganizationのテーブル名を取得
     * @return BizOrganizationテーブル名
     */
    public String getBizOrganizationTableName() {
        String value = props.getProperty("BizOrganizationTableName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizOrganizationTableName の定義がありません。");
        }
        return value;
    }
    /**
     * BizDepartmentのテーブル名を取得
     * @return BizDepartmentテーブル名
     */
    public String getBizDepartmentTableName() {
        String value = props.getProperty("BizDepartmentTableName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizDepartmentTableName の定義がありません。");
        }
        return value;
    }
  /**
     * BizEmployeeのテーブル名を取得
     * @return BizEmployeeテーブル名
     */
    public String getBizEmployeeTableName() {
        String value = props.getProperty("BizEmployeeTableName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizEmployeeTableName の定義がありません。");
        }
        return value;
    }
    /**
     * BizAdのテーブル名を取得
     * @return BizAdテーブル名
     */
    public String getBizAdTableName() {
        String value = props.getProperty("BizAdTableName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizAdTableName の定義がありません。");
        }
        return value;
    }
    /**
     * BizShiftのテーブル名を取得
     * @return BizShiftテーブル名
     */
    public String getBizShiftTableName() {
        String value = props.getProperty("BizShiftTableName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに BizShiftTableName の定義がありません。");
        }
        return value;
    }
    /**
     * RetiredUserの出力ファイル名を取得
     * @return RetiredUser出力ファイル名
     */
    public String getRetiredUserFileName() {
        String value = props.getProperty("RetiredUserFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに RetiredUserFileName の定義がありません。");
        }
        return value;
    }
    /**
     * JoinedUserの出力ファイル名を取得
     * @return JoinedUser出力ファイル名
     */
    public String getJoinedUserFileName() {
        String value = props.getProperty("JoinedUserFileName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに JoinedUserFileName の定義がありません。");
        }
        return value;
    }

    /**
     * BizOrganizationのテーブル名を取得
     * @return BizOrganizationのテーブル名
     */
    public String getTmpBizOrganizationTableName() {
        String value = props.getProperty("TmpBizOrganizationTableName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException("environment.propertiesにBizOrganizationTableNameの定義がありません。");
        }
        return value;
    }

    /**
     * BizDepartmentのテーブル名を取得
     * @return BizDepartmentのテーブル名
     */
    public String getTmpBizDepartmentTableName() {
        String value = props.getProperty("TmpBizDepartmentTableName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException("environment.propertiesにBizDepartmentTableNameの定義がありません。");
        }
        return value;
    }

    /**
     * BizEmployeeのテーブル名を取得
     * @return BizEmployeeのテーブル名
     */
    public String getTmpBizEmployeeTableName() {
        String value = props.getProperty("TmpBizEmployeeTableName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException("environment.propertiesにBizEmployeeTableNameの定義がありません。");
        }
        return value;
    }

    /**
     * BizAdのテーブル名を取得
     * @return BizAdのテーブル名
     */
    public String getTmpBizAdTableName() {
        String value = props.getProperty("TmpBizAdTableName");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException("environment.propertiesにBizAdTableNameの定義がありません。");
        }
        return value;
    }

    /**
     * BizOrganization@Csv Headerを取得
     *
     * @return BizOrganizationCsvHeader
     */
    public String getTmpBizOrganizationCsvHeader() {
        String value = props.getProperty("TmpBizOrganizationCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException("environment.propertiesにBizOrganizationCsvHeadersの定義がありません。");
        }
        return value;
    }

    /**
     * BizEmployee@Csv Headerを取得
     *
     * @return TmpBizEmployeeCsvHeader
     */
    public String getTmpBizEmployeeCsvHeader() {
        String value = props.getProperty("TmpBizEmployeeCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException("environment.propertiesにBizEmployeeCsvHeadersの定義がありません。");
        }
        return value;
    }
  /**
     * BizDepartment@Csv Headerを取得
     *
     * @return BizDepartmentCsvHeader
     */
    public String getTmpBizDepartmentCsvHeader() {
        String value = props.getProperty("TmpBizDepartmentCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException("environment.propertiesにBizDepartmentCsvHeadersの定義がありません。");
        }
        return value;
    }

    /**
     * BizAdCsvHeader@Csv Headerを取得
     *
     * @return BizAdCsvHeaderCsvHeader
     */
    public String getTmpBizAdCsvHeader() {
        String value = props.getProperty("TmpBizAdCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException("environment.propertiesにBizAdCsvHeadersの定義がありません。");
        }
        return value;
    }

////////////////////////////////////////////////////////////////////////////////////////////////////
    /**
     * ChargeのCsvのHeaderを取得
     * @return ChargeCsvHeader
     */
    public String getChargeCsvHeader() {
        String value = props.getProperty("ChargeCsvHeader");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに ChargeCsvHeader の定義がありません。");
        }
        return value;
    }

    // ALL TABLE EXP IMP
    /**
     * 一括出力用対象テーブル名一覧取得
     * @return 一括出力対象テーブル
     */
    public String getAllTableName() {
        String value = props.getProperty("AllTable");
        if (value == null || value.equals("")) {
            throw new BatRuntimeException(
                    "environment.propertiesに AllTable の定義がありません。");
        }
        return value;
    }

}
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/jp.co.netmarks.batch.component

``
`batch プロジェクト/irdb/jp.co.netmarks.batch.component/LoadStaffInfoLogic.java`

```java
package jp.co.netmarks.batch.component;

import java.io.File;
import java.io.IOException;
import java.sql.SQLException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jp.co.ksc.batch.exception.BatRuntimeException;
import jp.co.ksc.batch.exception.CSVException;
import jp.co.ksc.batch.util.BatchSettings;
import jp.co.ksc.batch.util.CSVUtil;
import jp.co.ksc.batch.util.ErrorFileManager;
import jp.co.ksc.batch.util.LoadStaffInfoWriter;
import jp.co.netmarks.batch.dao.StaffInfoDAO;

/**
 * <p>Title: LoadStaffInfoLogic.java</p>
  * <pre>
  * 人事情報取込みロジック
  * </pre>
* @Time:2023/06/28
* @author Yao KaiKyou
 */
@Component
public class LoadStaffInfoLogic {

    /** ログ出力クラス*/
    private Log log = LogFactory.getLog(this.getClass());

    @Autowired
    private StaffInfoDAO dao;


    // ************************************************
    // 連携ファイルの移動
    // ************************************************
    /**
     * 連携ファイルの移動
     * @param props BatchSettings
     */
    public void movFiles(BatchSettings props) {
            String importDir = props.getReceiveDir();
            String exportDir = props.getCsvFtpDir();

            try {
                LoadStaffInfoWriter writer = new LoadStaffInfoWriter(importDir, exportDir);
                List<Object> plist = new ArrayList<>();
                writer.write(plist);
            } catch (Exception e) {
                System.out.println("ファイル移動に失敗しました");
                e.printStackTrace();
            }
    }

    // ************************************************
    // 必須CSVファイル存在チェック
    // ************************************************
    /**
     * 必須CSVファイル存在チェック
     * @param fileNames
     * @return ALL有り True 以外 False
     */
    public boolean existsIndispensableCsvFile(String[] fileNames) {
        boolean ret = true;

        for (int i = 0; i < fileNames.length; i++) {
            File file = new File(fileNames[i]);
            ret = file.isFile();

            if (!ret) {
            	log.debug("CSVファイル[" + fileNames[i] + "]は存在しません。");
            	return ret;
            }
        }
        return ret;
    }

    // ************************************************
    // ＣＳＶ処理
    // ************************************************
    /**
     * CSV (ORGANIZATION)取込み
     *
     * @param setting BatchSettings
     * @throws IOException
     * @throws CSVException
     * @throws SQLException
     */
    public void doBizOrganization(BatchSettings setting) throws IOException, CSVException, SQLException {
        // CSVファイル読込み
        String[] header = setting.getTmpBizOrganizationCsvHeader().split(", ", 0);
        String tableName = setting.getTmpBizOrganizationTableName();
        Map<String, Object>[] records = readBizCsv(setting.getCsvFtpDir() + setting.getTmpIntOrganizationCsvFileName(), header);

        // CSVデータをBIZテーブルに登録
        if (records != null && records.length > 0) {
            log.debug(tableName + "登録対象件数:" + records.length);
            dao.insertBizTableAll(records, tableName, header);
        }
        // BIZテーブルからダミー等を削除
        dao.deleteBizOrganization();
    }

    // -----------------
    // CSV(BizDepartment)取込
    // -----------------
     /**
      * CSV(BizDepartment)取込
      * @param setting BatchSettings
      * @throws IOException
      * @throws CSVException
      * @throws SQLException
      */
     public void doBizDepartment(BatchSettings setting) throws IOException, CSVException, SQLException {

         // CSVファイル読込み
         String[] header = setting.getTmpBizDepartmentCsvHeader().split(",",0);
         String tableName = setting.getTmpBizDepartmentTableName();
         Map<String,Object>[] records = readBizCsv(setting.getCsvFtpDir() + setting.getTmpIntDepartmentCsvFileName(), header);

         // CSVデータをBIZテーブルに登録
         if (records != null && records.length > 0) {
             log.debug(tableName + "登録対象件数：" + records.length);
             dao.insertBizTableAll(records, tableName, header);
         }

         // BIZテーブルからダミー等を削除
         dao.deleteBizDepartment();
     }



     // -----------------
     // CSV(BizAd)取込
     // -----------------
     /**
      * CSV(BizAd)取込
      * @param setting BatchSettings
      * @throws IOException
      * @throws CSVException
      * @throws SQLException
      */
     @SuppressWarnings("unchecked")
     public void doBizAd(BatchSettings setting) throws IOException, CSVException, SQLException {

         // CSVファイル読込み
         String[] header = setting.getTmpBizAdCsvHeader().split(",",0);
         String tableName = setting.getTmpBizAdTableName();
         Map<String,Object>[] records = readBizCsv(setting.getCsvFtpDir() + setting.getBizAdCsvFileName(), header);

         // CSVデータをBIZテーブルに登録
         if (records != null && records.length > 0) {

             List<Map<String,Object>> list = new ArrayList<Map<String,Object>>();
             List<String> addedCodeList = new ArrayList<String>();

             // 社員コード10桁の場合、先頭3桁を取り除く
             for (int i = 0; i < records.length; i++) {

                 String employeeCode = (String) records[i].get("LOGIN_NM");
                 try {
                     Long.parseLong(employeeCode);

                     // 10桁＆会社コード「001」
                     if (employeeCode.length() != 7 && employeeCode.length() == 10) {
                         records[i].put("LOGIN_NM", employeeCode.substring(employeeCode.length() - 7));
                         log.debug("社員コード変換 元社員コード：[" + employeeCode + "] 新社員コード：[" + records[i].get("LOGIN_NM") + "]");
                     }

                     boolean added = false;
                     for (int j = 0; j < addedCodeList.size(); j++) {
                         String tmpCode = (String) addedCodeList.get(j);
                         if (tmpCode.equals(records[i].get("LOGIN_NM").toString())) {
                             added = true;
                             break;
                         }
                     }
                     if (!added) {
                         log.debug("ADD EmployeeCode:" + records[i].get("LOGIN_NM"));
                         list.add(records[i]);
                         addedCodeList.add(records[i].get("LOGIN_NM").toString());
                     } else {
                         log.debug("ADDED EmployeeCode:" + records[i].get("LOGIN_NM"));
                     }

                 } catch (NumberFormatException nfe) {
                     log.debug("NG EmployeeCode:" + employeeCode);
                 }
             }

             Map<String,Object>[] okRecords = (Map[]) list.toArray(new Map[list.size()]);
             log.debug(tableName + "登録対象件数：" + okRecords.length);
             dao.insertBizTableAll(okRecords, tableName, header);
         }
     }

  // -----------------
     // CSV(BizEmployee)取込
     // -----------------
     /**
      * CSV(BizEmployee)取込
      * @param setting BatchSettings
      * @throws IOException
      * @throws CSVException
      * @throws SQLException
      */
     public void doBizEmployee(BatchSettings setting) throws IOException, CSVException, SQLException {

         // CSVファイル読込み
         String[] header = setting.getTmpBizEmployeeCsvHeader().split(",",0);
         String tableName = setting.getTmpBizEmployeeTableName();
         Map<String,Object>[] records = readBizCsv(setting.getCsvFtpDir() + setting.getBizEmployeeCsvFileName(), header);

         // CSVデータをBIZテーブルに登録
         if (records != null && records.length > 0) {
             log.debug(tableName + "登録対象件数：" + records.length);
             dao.insertBizTableAll(records, tableName, header);
         }
         // BIZテーブルからダミー等を削除
        dao.deleteBizEmployee();
     }

     // ************************************************
     // 退職者リスト出力
     // ************************************************
     /**
      * 退職者リスト出力
      * @param props BatchSettings
      * @throws Exception
      */
     public void retiredUserFileOut(BatchSettings props) throws Exception {

  		String outputPath    =  props.getOutPutRetireDir();
  		String retireListNm  =  props.getRetiredUserFileName();

          File backupDir = new File(outputPath);
          if (!backupDir.exists()) {
              backupDir.mkdirs();
          }

          try{
          	Map<String,Object>[] retire = dao.selRetireUser();

  	        // 出力
  	        CSVUtil csv = new CSVUtil(retire);
              csv.setDataMaps(retire);
              csv.setHasHeader(true);
              csv.addHeader("last_name");
              csv.addHeader("first_name");
              csv.addHeader("telephone_no ");
              csv.addHeader("full_name");
  	        csv.setFileName( outputPath + csv.getTimestampAddFileNM(retireListNm));
  	        csv.write();

          }catch(Exception e){
          	throw e;
          }
      }


     // ************************************************
     // 例外処理 エラーファイル作成
     // ************************************************
     /**
      * エラーファイル作成
      * @param props BatchSettings
      */
     public void creaErrFile(BatchSettings props) {
         String errorFilePath = props.getOutPutErrFileDir();
         String errorMessage = props.getErrMessage();
 		String outputErrFile = props.getOutPutErrFileNm();
         ErrorFileManager errorFileManager = new ErrorFileManager(errorFilePath, errorMessage, outputErrFile);

         try {
             errorFileManager.checkErrorFileExists();
         } catch (BatRuntimeException e) {
             e.printStackTrace();
         }
     }




  //*********************************
 // 内部処理メソッド
 //*********************************
 /**
 * 内部処理メイン
 *
 *@param todayCsvFileName CSV)71K
 *@param csvHeader A
 *@return 読み込んだ csvの内容
 *@throws IOException
 *@throws CSVException
 */
 private Map<String, Object>[] readBizCsv(String todayCsvFileName, String[] csvHeader)
             throws IOException, CSVException {
         CSVUtil csvUtil = new CSVUtil(todayCsvFileName);

         if (csvHeader != null) {
             for (int i = 0; i < csvHeader.length; i++) {
                 csvUtil.addHeader(csvHeader[i]);
             }
         } else {
             log.warn("CSVファイルのヘッダーが定義されていません。");
             throw new CSVException();
         }

         try {
             csvUtil.read();
             log.debug("CSVファイル[" + todayCsvFileName + "]読込み成功");
         } catch (IOException ioe) {
             log.warn("CSVファイル[" + todayCsvFileName + "]読込みエラー(IOException)");
             throw ioe;
         } catch (CSVException csve) {
             log.warn("CSVファイル[" + todayCsvFileName + "]読込みエラー(CSVException)");
             throw csve;
         }

         return csvUtil.getDataMaps();
     }

 // ************************************************
 // CSVファイルリネーム
 // ************************************************
 /**
  * CSVファイルリネーム
  * @param props BatchSettings
  * @throws IOException
  */
 public void csvFileRename(BatchSettings props) throws IOException {

		String impcsvPath    =  props.getCsvFtpDir();
		String impcmpcsvPath =  props.getInputCompDir();
		String[] impcsv      = {props.getEofAd(),
								props.getEofAm(),
								props.getTmpAdCsvFileName(),
								props.getTmpIntDepartmentCsvFileName(),
								props.getTmpIntEmployeeCsvFileName(),
								props.getTmpIntOrganizationCsvFileName()
								};

     File backupDir = new File(impcmpcsvPath);
     if (!backupDir.exists()) {
         backupDir.mkdirs();
     }

     Calendar cal = Calendar.getInstance();
     SimpleDateFormat sdf = new SimpleDateFormat("yyyyMMddHHmmss");
     String ymdhms = sdf.format(cal.getTime());

     for (int i = 0; i < impcsv.length; i++) {
         String todayCsvFileName = impcsv[i];
         String[] csvSplit = todayCsvFileName.split("\\.", 0);

         File importCsvFile = new File(impcsvPath + todayCsvFileName);
         if (importCsvFile.exists()) {
         	String newFilenm = "";
         	if(i<2){
         		newFilenm =  backupDir + "/" + todayCsvFileName + "_IMPORTED_" + ymdhms;
         	}else{
         		newFilenm =  backupDir + "/" + csvSplit[0] + "_IMPORTED_" + ymdhms + "." + csvSplit[1];
         	}
         	File renameCsvFile = new File(newFilenm);
             importCsvFile.renameTo(renameCsvFile);
         }
     }
 }


}
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/jp.co.netmarks.batch.dao

`batchプロジェクト/irdb/jp.co.netmarks.batch.dao/StaffInfoDAO.java`

```java
package jp.co.netmarks.batch.dao;

import java.sql.SQLException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Properties;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import jp.co.ksc.batch.util.NewUserFileOutput;
import jp.co.netmarks.batch.persistence.LoadStaffMapper;
import jp.co.netmarks.util.ErrorMail;

/**
 * <p>Title: StaffInfoDAO.java</p>
  * <pre>
  * 人事情報取込み関連テーブル操作DAOクラス
  * </pre>
* @Time:2023/06/27
* @author Yao KaiKyou
 */
@Component
public class StaffInfoDAO {

	/* ログ出力クラス */
	private Log log = LogFactory.getLog(this.getClass());

	@Autowired
	private LoadStaffMapper lsm;

    @Autowired
    private ErrorMail errMail;

    private List<Map<String,Object>> newEmployeeRecords;

	@Autowired
	private Properties properties;

	// *****************
	// CSV処理
	// *****************

	/**
	 * Biz系テーブルのCSV取込を行います
	 *
	 * @param records   データ
	 * @param tableName テーブル名
	 * @param header    配列
	 * @throws SQLException
	 */
	public void insertBizTableAll(Map<String, Object>[] records, String tableName, String[] header)
			throws SQLException {
		Map<String, Object> param = new HashMap<String, Object>();
		if (records != null) {
			try {
				for (int i = 0; i < records.length; i++) {
					StringBuffer recordLog = new StringBuffer();
					for (int j = 0; j < header.length; j++) {
						if (j == 0) {
							recordLog.append(header[j] + ":" + records[i].get(header[j]));
						} else {
							recordLog.append(", " + header[j] + ":" + records[i].get(header[j]));
							System.out.println(header[j] + ":" + records[i].get(header[j]));
						}

						param.put(header[j], records[i].get(header[j]));
					}

					if (tableName.equals("TMP_AD")) {
						if (param.get("LAST_NM") == null)
							param.put("LAST_NM", param.get("LOGIN_NM"));
						if (param.get("FIRST_NM") == null)
							param.put("FIRST_NM", param.get("LOGIN_NM"));
						lsm.insertBizAD(param);
					} else if (tableName.equals("TMP_INTEGRATEDID_DEPARTMENT")) {
						lsm.insertBizDepartment(param);
					} else if (tableName.equals("TMP_INTEGRATEDID_EMPLOYEE")) {
						lsm.insertBizEmployee(param);
					} else if (tableName.equals("TMP_INTEGRATEDID_ORGANIZATION")) {
						lsm.insertBizOrganization(param);
					} else if (tableName.equals("BIZ_SHIFT")) {
						lsm.insertBizShift(param);
					}
				}
			} catch (Exception e) {
				log.warn("BIZテーブル[" + tableName + "]登録エラー");
				throw e;
			}
		}
	}

	/**
	*BizOrganizationの削除
	*@throws SQLException
	*/
	public void deleteBizOrganization() throws SQLException {
		try {
			lsm.deleteDumOrganization();
		} catch (Exception e) {
			log.warn("BIZ_ORGANIZATION 削除エラー:DUM_ORGANIZATION");
			throw e;
		}
	}

	/**
	*BizDepartmentの削除
	*@throws SQLException
	*/
	public void deleteBizDepartment() throws SQLException {
		try {
			lsm.deleteDumDepartment();
		} catch (Exception e) {
			log.warn("BIZ_DEPARTMENT 削除エラー:DUM_DEPARTMENT");
			throw e;
		}
	}

    /**
     * BizEmployeeの削除
     * @throws SQLException
     */
    public void deleteBizEmployee() throws SQLException {
        try {
            lsm.deleteDumEmployee();
        } catch (Exception e) {
            log.warn("BIZ_EMPLOYEE 削除 エラー:DUM_EMPLOYEE");
            throw e;
        }
    }

    // ************************************************
    // 店部課 追加
    // ************************************************
    /**
     * 店部課追加処理
     * @return 追加件数
     * @throws SQLException
     */
    public int insertMSection() throws SQLException {
        int ret = 0;
        try {
            List<Map<String,Object>> records = lsm.selNotExistMSection();
            if (records != null && records.size() > 0) {
                for (int i = 0; i < records.size(); i++) {

                    Map<String,Object> param = new HashMap<String, Object>();
                    String companyCode = records.get(i).get("company_cd").toString();
                    System.out.println(companyCode);
                    String departmentCode = records.get(i).get("department_cd").toString();
                    System.out.println(departmentCode);
                    System.out.println("123456mst");
                    param.put("companyCode",companyCode);
                    param.put("departmentCode",departmentCode);

                    int insCnt = lsm.selinsMSection(param);

                    if (insCnt == 0) {
                    	// biz_organizationに、対応する組織コードが存在しなかったとき
                        log.error("店部課マスタ[M_SECTION]BIZ_ORGANIZATION エラー:insertMSection()");
                    	log.error("company_cd = " + companyCode + ", company_cd = " + departmentCode);
                    	throw new SQLException();
                    } else {
	                    ret = ret + 1;
                    }
                }
            }
        } catch (SQLException se) {
            log.warn("店部課マスタ[M_SECTION]登録 エラー＠insertMSection()");
            throw se;
        }
        return ret;
    }

// ************************************************
    // 店部課 更新
    // ************************************************
    /**
     * 店部課更新処理
     * @return 件数
     * @throws SQLException
     */
    public int updateMSection() throws SQLException {
        int ret = 0;
        try {
        	List<Map<String,Object>> records = lsm.selExistMSection();

            if (records != null && records.size() > 0) {
                for (int i = 0; i < records.size(); i++) {

                    Map<String,Object> param = new HashMap<String, Object>();
                    String companyCode = records.get(i).get("company_cd").toString();
                    String departmentCode = records.get(i).get("department_cd").toString();
                    param.put("companyCode",companyCode);
                    param.put("departmentCode",departmentCode);

                    Map<String,Object> resultMap = lsm.selDiffMSection(param);

                    if(resultMap != null){
                        if (resultMap.get("depprord") == null) {
                        	// biz_organizationに、対応する組織コードが存在しなかったとき
                            log.error("店部課マスタ[M_SECTION]BIZ_ORGANIZATION エラー:updateMSection()");
                        	log.error("company_cd = " + companyCode + ", department_cd = " + departmentCode);
                        	throw new SQLException();
                        } else {
                        	param.put("department_nm", resultMap.get("deptnm"));
                        	param.put("parent_department_cd", resultMap.get("pdeptid"));
                        	param.put("organization_cd", resultMap.get("orgcd"));
                        	param.put("print_order", resultMap.get("depprord"));

    	                    int updateCnt = lsm.updateMSection(param);
    	                    if(updateCnt==0){
    	                    	log.error("店部課マスタ[M_SECTION]UPDATE 0件 エラー:updateMSection()");
                            	throw new SQLException();
    	                    }
                            ret = ret + updateCnt;
                        }
                    }
                }
            }
        } catch (SQLException se) {
            log.warn("店部課マスタ[M_SECTION]更新 エラー＠updateMSection()");
            throw se;
        }
        return ret;
    }

    // ************************************************
    // 退社 ※ 正社員以外も消す（FULLTIME_EMP：1,2以外)
    // ************************************************
    /**
     * 退社処理
     * @return 退社人数
     * @throws SQLException
     */
    public int retireAppUser() throws SQLException {
        int ret = 0;

        try {
        	List<Map<String,Object>> records = lsm.selRetireUsers();

            if (records != null && records.size() > 0) {
                for (int i = 0; i < records.size(); i++) {

                    Map<String,Object> param = new HashMap<String, Object>();
                    String appUserId = records.get(i).get("user_id").toString();
                    param.put("user_id",Integer.parseInt(appUserId));

                    // APP_USER
                    int updCntDelEmp = lsm.updDelEmpAppUser(param);
                    if(updCntDelEmp==0){
                    	log.error("ユーザマスタ[APP_USER]UPDATE 0件 エラー:retireEmployee");
                    	throw new SQLException();
                    }

                    // R_CUCM_USER_PHONE
                    updCntDelEmp = lsm.updDelEmpRUserPhone(param);


                    // PhoneOwner対応
                    List<Map<String,Object>> phoneList = lsm.delUserToPhone(param);
                    for (int j=0;j<phoneList.size();j++){
		                param.put("phoneId", phoneList.get(j).get("phoneid"));
		                Map<String,Object> newOwner = lsm.delUserNewOwnerPhone(param);
		                if(newOwner != null){
		                	String newOner = newOwner.get("cucm_login_id").toString();
		                	param.put("newOwner",Integer.parseInt(newOner));

			                updCntDelEmp = lsm.updDelEmpPhoneOwner(param);
		                }else{
			                param.put("newOwner", null);
			                updCntDelEmp = lsm.updDelEmpPhoneOwner(param);
		                }
                    }
                    ret = ret + 1;
                }
            }
        } catch (SQLException se) {
            log.warn("退社 エラー＠retireEmployee()");
            throw se;
        }
        return ret;
    }

 // ************************************************
 // 社員　追加
 // ************************************************
 /**
  * 社員追加
  * @return 件数
  * @throws SQLException
  */
    public int additionAppUser() throws SQLException {
        int ret = 0;
        boolean error = false; // 取り込みエラーが存在するかどうか
        String errorlog = null;

        try {
            newEmployeeRecords = lsm.selAdditionUsers();
            System.out.println("cdcd----newEmployeeRecords-------"+newEmployeeRecords);
            System.out.println("新入社員データの処理直前のデータ状況:");
            for (Map<String, Object> record : newEmployeeRecords) {
                String employeeCode = (String) record.get("employee_cd");
                System.out.println("社員コード: " + employeeCode);
                // 必要なデータフィールドを追加して表示します
            }

            if (newEmployeeRecords != null && newEmployeeRecords.size() > 0) {
                List<String> employeeIds = new ArrayList<>();

                for (int i = 0; i < newEmployeeRecords.size(); i++) {
                    Map<String,Object> param = new HashMap<String, Object>();
                    String employee_cd = newEmployeeRecords.get(i).get("employee_cd").toString();
                    param.put("employee_cd", employee_cd);

                    Map<String,Object> record = lsm.selAdditionUserDetail(param);

                    // ADに対応するユーザーが存在しなかった場合を考慮
                    if ((record != null) && (record.get("fulltime_employee") != null)) {
                        // 例: データベースへの挿入直前に変数の値を表示
                        System.out.println("挿入前の変数の値: " + employee_cd);
                        log.debug("挿入前の変数の値: " + employee_cd);

                        System.out.println("param: " + param);
                        System.out.println("挿入前の変数の値: " + employee_cd);
                        log.debug("挿入前の変数の値: " + employee_cd);

                        System.out.println("param: " + param);
                        int addUserCnt = lsm.insAdditionUserDetail(param);
                        if(addUserCnt == 0) {
                            log.error("ユーザマスタ[APP_USER]Insert 0件 エラー:additionEmployee");
                            throw new SQLException();
                        }
                        log.info("新入社員 employeeCode : " + employee_cd);
                        ret = ret + 1;

                        // ユーザファイル出力のための社員コードをリストに追加
                        employeeIds.add(employee_cd);
                    } else {
                        errorlog = "ユーザマスタ[APP_USER]AD存在無 エラー:additionEmployee ";
                        errorlog += "employee_code=" + employee_cd;
                        log.error(errorlog);
                        error = true;
                    }
                }

                try {
                    NewUserFileOutput newUserFileOutput = new NewUserFileOutput(properties);
                    newUserFileOutput.newUserFileOut(this, employeeIds);
                } catch (Exception e) {
                    log.error("新規ユーザファイル出力エラー: " + e.getMessage());
                    throw new SQLException();
                }
            }

            // 取り込みエラーがあった場合には、メール送信
            if (error) {
                errMail.sendErrorMail(errorlog);
            }
        } catch (SQLException se) {
            log.warn("社員[APP_USER]登録 エラー＠insertAppUser()");
            throw se;
        }

        return ret;
    }

 // ************************************************
    // 社員　更新
    // ************************************************
    /**
     * 社員更新処理
     * @return 件数
     * @throws SQLException
     */
    public int updateAppUser() throws SQLException {
        int ret = 0;
        boolean error = false; // 取り込みエラーが存在するかどうか
        String errorlog = null;

        try {
        	List<Map<String,Object>> records = lsm.selExistAppUser();

            if (records != null && records.size() > 0) {
                for (int i = 0; i < records.size(); i++) {

                    Map<String,Object> param = new HashMap<String, Object>();
                    String employeeCode = records.get(i).get("employee_cd").toString();
                    param.put("employeeCode",employeeCode);

                    Map<String,Object> resultMap = lsm.selDiffAppUser(param);

                    if(resultMap != null){
                        if (resultMap.get("bzfullemp") == null) {
                        	// ADに対応するユーザーが存在しなかった場合を考慮
                        	error = true;
                        	errorlog = "ユーザマスタ[APP_USER]AD存在無 エラー:updateAppUser ";
                        	errorlog += "employee_code=" + employeeCode;
                        	log.error(errorlog);
                        } else {
                        	param.put("fulltime_employee", resultMap.get("bzfullemp"));
                        	param.put("user_nm_kanji", resultMap.get("bzkanji"));
                        	param.put("user_nm_kana", resultMap.get("bzkana"));
                        	param.put("birthday", resultMap.get("bzbirth"));
                        	param.put("first_nm", resultMap.get("bzfirstnm"));
                        	param.put("last_nm", resultMap.get("bzlastnm"));
                        	param.put("department", resultMap.get("bzdepartment"));

    	                    int updateCnt = lsm.updateAppUser(param);
    	                    if(updateCnt==0){
    	                    	log.error("ユーザマスタ[APP_USER]UPDATE0件 エラー:updateAppUser");
                            	throw new SQLException();
    	                    }
    	                    int updateTrnCnt = lsm.updateTrnPhone(param);
    	                    if(updateTrnCnt==0){
    	                    	log.error("trn_phone[APP_USER]UPDATE0件 エラー:updateTrnPhone");
                            	throw new SQLException();
    	                    }
                            ret = ret + updateCnt;
                        }
                    }
                }
            }
            // 取り込みエラーがあった場合には、メール送信
            if (error) {
            	errMail.sendErrorMail(errorlog);
            }
        } catch (SQLException se) {
            log.warn("社員[APP_USER]更新 エラー＠updateAppUser()");
            throw se;
        }
        return ret;
    }

    // ************************************************
    // 所属追加 ※入社、着任
    // ************************************************
    /**
     * 所属追加 ※入社、着任
     * @return 件数
     * @throws SQLException
     */
    public int additionRUserSection() throws SQLException {
        int ret = 0;
        boolean error = false; // 取り込みエラーが存在するかどうか
        StringBuffer errorlogbuf = new StringBuffer();
        String errorlog = null;
        try {

        	List<Map<String,Object>> records = lsm.selAdditionUserSection();

            if (records != null && records.size() > 0) {

                for (int i = 0; i < records.size(); i++) {
                    Map<String,Object> param = new HashMap<String, Object>();
                    String employeeCode = records.get(i).get("employee_cd").toString();
                    String companyCode = records.get(i).get("company_cd").toString();
                    String departmentCode = records.get(i).get("department_cd").toString();
                    param.put("employeeCode",employeeCode);
                    param.put("companyCode",companyCode);
                    param.put("departmentCode",departmentCode);
                    System.out.println("employeeCode-----existSec---#"+employeeCode);
                    System.out.println("companyCode-----existSec---#"+companyCode);
                    System.out.println("departmentCode-----existSec---#"+departmentCode);



                    // 存在する店部課かどうかチェック
                    Map<String,Object> existSec = lsm.selExistDepartment(param);
                    System.out.println("okok-----existSec---#"+existSec);
                    if (existSec != null) {
	                    // 新しい所属なら追加
                    	// 追加対象情報の取得
	                    Map<String,Object>[] record = lsm.selAdditionUserSectionDetail(param);
	                    System.out.println("okok--------#"+record);
	                    if (record != null) {
	                    	int existRSec = lsm.selExistUserSection(param);
	                    	if(existRSec == 0){
			                    int addUserCnt = lsm.insAdditionUserSection(param);
			                    if(addUserCnt==0){
			                    	log.error("ユーザマスタ[APP_USER]Insert 0件 エラー:additionEmployee");
			                    	throw new SQLException();
			                    }
			                    ret = ret + 1;
	                    	}
		                } else {
	                    	errorlog = "[R_User_Section]追加 エラー : BIZ_EMPLOYEEとBIZ_ORGANIZATIONの不整合のため、社員の所属が追加できませんでした。";
	                    	errorlog += "employee_code=" + employeeCode + ", company_code=" + companyCode + ", department_code=" + departmentCode;
	                    	log.error(errorlog);
	                       	errorlogbuf.append("    ");
	                    	errorlogbuf.append(errorlog);
	                    	errorlogbuf.append("\\n");
	                     	error = true;
		                }
                    } else {
                    	errorlog = "[R_User_Section]追加 エラー : BIZ_EMPLOYEEの所属が店部課マスタに存在しないため、社員の所属が追加できませんでした。";
                    	errorlog += "employee_code=" + employeeCode + ", company_code=" + ", department_code=" + departmentCode;
                    	log.error(errorlog);
                       	errorlogbuf.append("    ");
                    	errorlogbuf.append(errorlog);
                    	errorlogbuf.append("\\n");
                     	error = true;
                    }
                }
            }

            // 取り込みエラーがあった場合には、メール送信
            if (error) {
            	//errMail.sendErrorMail(new String(errorlogbuf));
            }

        } catch (SQLException se) {
            log.warn("所属[R_USER_SECTION]登録 エラー＠insertRUserSetion()");
            throw se;
        }
        return ret;
    }

  // ************************************************
    // 所属　更新
    // ************************************************
    /**
     * 所属　更新
     * @return 件数
     * @throws SQLException
     */
    public int updateRUserSetion() throws SQLException {
        int ret = 0;
        try {

        	List<Map<String,Object>> records = lsm.selExistDeptChk();

            if (records != null && records.size() > 0) {
                for (int i = 0; i < records.size(); i++) {

                    Map<String,Object> param = new HashMap<String, Object>();
                    String employeeCode = records.get(i).get("employee_cd").toString();
                    String companyCode = records.get(i).get("company_cd").toString();
                    String departmentCode = records.get(i).get("department_cd").toString();

                    param.put("employeeCode",employeeCode);
                    param.put("companyCode",companyCode);
                    param.put("departmentCode",departmentCode);

                    Map<String,Object> resultMap = lsm.selDiffUserSection(param);

                    if(resultMap != null){
                    	param.put("section_name", resultMap.get("bizdeptnm"));
                    	param.put("print_order", resultMap.get("bizprintord"));
                    	Map<String,Object> uIdResultMap = lsm.selTrnUser(param);
                    	 if(uIdResultMap != null){
                    		 param.put("user_id", resultMap.get("user_id"));
                    		 Map<String,Object> sectionIdResultMap = lsm.selMstSection(param);
                    		 if(sectionIdResultMap != null) {
                    			 param.put("section_id", sectionIdResultMap.get("section_id"));
                    		 }
                    	 }

	                    int updateCnt = lsm.updateUserSection(param);
	                    if(updateCnt==0){
	                    	log.error("ユーザマスタ[R_USER_SECTION]UPDATE0件 エラー:updateRUserSetion");
                        	throw new SQLException();
	                    }
                        ret = ret + updateCnt;
                    }
                }
            }
        } catch (SQLException se) {
            log.warn("所属[R_USER_SECTION]更新 エラー＠updateRUserSetion()");
            throw se;
        }
        return ret;
    }

    // ************************************************
    // 異動　※転出元
    // ************************************************
    /**
     * 異動　※転出元
     * @return 件数
     * @throws SQLException
     */
    public int changePersonnel() throws SQLException {
        int ret = 0;
        try {
        	List<Map<String,Object>> records = lsm.selChangePersonnel();

            if (records != null && records.size() > 0) {
                for (int i = 0; i < records.size(); i++) {

                    Map<String,Object> param = new HashMap<String, Object>();
                    String appUserId = records.get(i).get("user_id").toString();
                    String bizEmployeeId = records.get(i).get("biz_employee_id").toString();
                    String sectionId = records.get(i).get("section_id").toString();

                    param.put("appUserId",Integer.parseInt(appUserId));
                    param.put("sectionId",sectionId);
                    param.put("bizEmployeeId",bizEmployeeId);

                    // 転出元で電話機が紐付いていたかどうかチェック
                    int phoneCnt = lsm.selPersonnelUsedPhone(param);

                    // R_USER_SECTION
                    if ( phoneCnt == 0) {
                    	// 転出元に紐付いた電話機がない場合
                        int deleteCnt = lsm.deleteUserSection(param);
	                    if(deleteCnt==0){
	                    	log.error("ユーザマスタ[R_USER_SECTION]Delete 0件 エラー:personnelChanges");
                        	throw new SQLException();
	                    }
                    } else {
                        // 既定では削除予約フラグのみ立て、転出元でも画面表示がされるようにする
                        int updateCnt = lsm.updDelUserSection(param);
	                    if(updateCnt==0){
	                    	log.error("ユーザマスタ[R_USER_SECTION]UPDATE 0件 エラー:personnelChanges");
                        	throw new SQLException();
	                    }
                    }
                    ret = ret + 1;
                }
            }
        } catch (SQLException se) {
            log.warn("異動 エラー＠personnelChanges()");
            throw se;
        }
        return ret;
    }

    // ************************************************
    // 退社リスト出力
    // ************************************************
    /**
     * 退社リスト出力
     * @return 退社リスト
     * @throws SQLException
     */
    public Map<String,Object>[] selRetireUser() throws SQLException {
    	Map<String,Object>[] records;
    	records = lsm.selAllRetireUserList();
        return records;
    }

    // ************************************************
    // 入社リスト出力
    // ************************************************
    /**
     * 入社リスト出力
     * @param employeeIds 従業員IDのリスト
     * @return 入社リスト
     * @throws SQLException
     */
    public Map<String, Object> selAllNewUserList(String employeeId) throws SQLException {
        try {
        	Map<String, Object>   newUser = lsm.selAllAddUserList(employeeId);
            return newUser;
        } catch (Exception e) {
            log.error("新入社員データの取得に失敗しました。", e);
            throw new SQLException("新入社員データの取得に失敗しました。", e);
        }
    }



}
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/jp.co.netmarks.batch.persistence

`batchプロジェクト/irdb/jp.co.netmarks.batch.persistence/LoadStaffMapper.java`

```java
package jp.co.netmarks.batch.persistence;

import java.util.List;
import java.util.Map;

/**
 * <p>Title: LoadStaffMapper.java</p>
  * <pre>
  * 人事情報取込関連 マッパークラス
  * </pre>
* @Time:2023/06/28
* @author Yao KaiKyou
 */
public interface LoadStaffMapper {

	//vacuum
	/**
	 * 人事情報関連テーブルのVacuumを実行
	 * @return int
	 */
	int vacuum();

	// 情報取込
	/**
	 * BizShift削除
	 * @return 件数
	 */
	int deleteBizShift();
	/**
	 * BizAD削除
	 * @return 件数
	 */
	int deleteBizAD();
	/**
	 *  BizOrganization削除
	 * @return 件数
	 */
	int deleteBizOrganization();
	/**
	 *  BizDepartment削除
	 * @return 件数
	 */
	int deleteBizDepartment();
	/**
	 *  BizEmployee削除
	 * @return 件数
	 */
	int deleteBizEmployee();

	/**
	 * DumOrganization削除
	 * @return 件数
	 */
	int deleteDumOrganization();
	/**
	 * DumOrganization削除
	 * @return 件数
	 */
	int deleteDumDepartment();
	/**
	 * DumOrganization削除
	 * @return 件数
	 */
	int deleteDumEmployee();

	/**
	 * BizShift登録
	 * @param parameterValues
	 * @return 件数
	 */
	int insertBizShift(Map<String, Object> parameterValues);
	/**
	 * BizAD登録
	 * @param parameterValues
	 * @return 件数
	 */
	int insertBizAD(Map<String, Object> parameterValues);
	/**
	 * BizOrganization登録
	 * @param parameterValues
	 * @return 件数
	 */
	int insertBizOrganization(Map<String, Object> parameterValues);
	/**
	 * BizDepartment登録
	 * @param parameterValues
	 * @return 件数
	 */
	int insertBizDepartment(Map<String, Object> parameterValues);
	/**
	 * BizEmployee登録
	 * @param parameterValues
	 * @return 件数
	 */
	int insertBizEmployee(Map<String, Object> parameterValues);

	// 閾値
	/**
	 * 閾値取得
	 * @return 取得した閾値
	 */
	Map<String, Object> selectThreshold();
	/**
	 * 入社人数取得
	 * @return 取得した入社人数
	 */
	int selectEnterCount();
	/**
	 * 登録社員情報取得
	 * @return 取得した登録社員情報
	 */
	List<Map<String, Object>> selectEnterEmployee();
	/**
	 * 退社人数取得
	 * @return 取得した退社人数
	 */
	int selectRetireCount();
	/**
	 * 退社社員情報取得
	 * @return 取得した退社社員情報
	 */
	List<Map<String, Object>> selectRetireEmployee();
	/**
	 * 変更社員人数取得
	 * @return 取得した変更社員人数
	 */
	int selectChangeCount();
	/**
	 * 変更社員人数情報取得
	 * @return 取得した変更社員情報
	 */
	List<Map<String, Object>> selectChangeEmployee();

	// M_SECTION
	/**
	 * 未登録MSection取得
	 * @return 取得したMSection
	 */
	List<Map<String, Object>> selNotExistMSection();
	/**
	 * 登録済MSection取得
	 * @return 取得したMSection
	 */
	List<Map<String, Object>> selExistMSection();
	/**
	 * 登録情報と相違あるMSectionの取得
	 * @param parameterValues
	 * @return 取得したMSection情報
	 */
	Map<String,Object> selDiffMSection(Map<String,Object>parameterValues);
	/**
	 * 新規登録MSection
	 * @param parameterValues
	 * @return 件数
	 */
	int selinsMSection(Map<String,Object> parameterValues);
	/**
	 * MSectionの更新
	 * @param parameterValues
	 * @return 件数
	 */
	int updateMSection(Map<String,Object> parameterValues);

// APP_USER
	/**
	 * 退社社員取得
	 * @return 取得した退社社員情報
	 */
	List<Map<String,Object>> selRetireUsers();
	/**
	 * 退社予約社員更新（AppUser)
	 * @param parameterValues
	 * @return 件数
	 */
	int updDelEmpAppUser(Map<String,Object> parameterValues);
	/**
	 * 退社予約社員更新（UserSection)
	 * @param parameterValues
	 * @return 件数
	 */
	int updDelEmpRUserSection(Map<String,Object> parameterValues);
	/**
	 * 退社予約社員更新（UserPhone)
	 * @param parameterValues
	 * @return 件数
	 */
	int updDelEmpRUserPhone(Map<String,Object> parameterValues);
	/**
	 * 退社予約社員更新（TelDir)
	 * @param parameterValues
	 * @return 件数
	 */
	int updDelEmpTelDir(Map<String,Object> parameterValues);

	/**
	 * 入社社員の取得
	 * @return 入社社員
	 */
	List<Map<String,Object>> selAdditionUsers();
	/**
	 * 入社社員情報の取得
	 * @param parameterValues
	 * @return 入社社員情報
	 */
	Map<String,Object> selAdditionUserDetail(Map<String,Object> parameterValues);
	/**
	 * 入社社員の登録
	 * @param parameterValues
	 * @return 件数
	 */
	int insAdditionUserDetail(Map<String,Object> parameterValues);

	/**
	 * 登録済みユーザーの取得
	 * @return 取得したユーザー
	 */
	List<Map<String,Object>> selExistAppUser();
	/**
	 * 登録済みユーザーと相違あるユーザーの取得
	 * @param parameterValues
	 * @return 相違ユーザー情報
	 */
	Map<String,Object> selDiffAppUser(Map<String,Object>parameterValues);
	/**
	 * trn_phoneのupdate_status更新
	 * @param parameterValues
	 * @return 件数
	 */
	int updateTrnPhone(Map<String,Object> parameterValues);

	/**
	 * ユーザー更新
	 * @param parameterValues
	 * @return 件数
	 */
	int updateAppUser(Map<String,Object> parameterValues);

	//R_USER_SECTION
	/**
	 * 登録ユーザー情報取得
	 * @return 登録ユーザー情報
	 */
	List<Map<String,Object>> selAdditionUserSection();
	/**
	 * 登録済部署取得
	 * @param parameterValues
	 * @return 登録済部署
	 */
	Map<String,Object> selExistDepartment(Map<String,Object> parameterValues);
	/**
	 * 登録済ユーザーの部署件数を取得
	 * @param parameterValues
	 * @return ユーザー部署件数
	 */
	int selExistUserSection(Map<String,Object> parameterValues);
	/**
	 * 登録ユーザーの部署情報取得
	 * @param parameterValues
	 * @return 登録ユーザーの部署情報
	 */
	Map<String,Object>[] selAdditionUserSectionDetail(Map<String,Object> parameterValues);
	/**
	 * 登録ユーザーの部署情報を登録
	 * @param parameterValues
	 * @return 件数
	 */
	int insAdditionUserSection(Map<String,Object> parameterValues);

	/**
	 * 登録済課情報取得
	 * @return 課情報
	 */
	List<Map<String,Object>> selExistDeptChk();
	/**
	 * 登録情報と相違あるSection情報取得
	 * @param parameterValues
	 * @return 相違あるSection情報
	 */
	Map<String,Object> selDiffUserSection(Map<String,Object>parameterValues);

	/**
	 * MST_店部課「mst_section」テーブルを更新する前に店部課IDを取得する
	 * @param parameterValues
	 * @return section_id
	 */
	Map<String,Object> selMstSection(Map<String,Object>parameterValues);

	/**
	 * MST_店部課「mst_section」テーブルを更新する前にuser_idを取得する
	 * @param parameterValues
	 * @return user_id
	 */
	Map<String,Object> selTrnUser(Map<String,Object>parameterValues);


	/**
	 * Section更新処理
	 * @param parameterValues
	 * @return 件数
	 */
	int updateUserSection(Map<String,Object> parameterValues);

	/**
	 * 人事情報の更新対象取得
	 * @return 更新対象
	 */
	List<Map<String,Object>> selChangePersonnel();
	/**
	 * ユーザーが使用している電話機の数を取得
	 * @param parameterValues
	 * @return 電話機の数
	 */
	int selPersonnelUsedPhone(Map<String,Object> parameterValues);
	/**
	 * ユーザーの所属を削除
	 * @param parameterValues
	 * @return 件数
	 */
	int deleteUserSection(Map<String,Object> parameterValues);
	/**
	 * ユーザーの所属を更新
	 * @param parameterValues
	 * @return 件数
	 */
	int updDelUserSection(Map<String,Object> parameterValues);

	//拠点統廃合
	/**
	 * 統廃合情報の取得
	 * @return 統廃合情報
	 */
	List<Map<String,Object>> selShiftOrganization();
	/**
	 * 異動前部署からのユーザー削除対象取得
	 * @param parameterValues
	 * @return 削除対象
	 */
	List<Map<String,Object>> selDelAffiliationUser(Map<String,Object> parameterValues);
	/**
	 * ユーザー所属部署件数
	 * @param parameterValues
	 * @return 件数
	 */
	int selUserSectionCnt(Map<String,Object> parameterValues);
	/**
	 * ユーザー所属情報の更新
	 * @param parameterValues
	 * @return 件数
	 */
	int updChgPersonnelSection(Map<String,Object> parameterValues);
	/**
	 * ユーザー所持電話機の情報更新
	 * @param parameterValues
	 * @return 件数
	 */
	int updChgPersonnelPhone(Map<String,Object> parameterValues);

/**
	 * 異動前電話機情報の削除対象取得
	 * @param parameterValues
	 * @return 削除対象
	 */
	List<Map<String,Object>> selDelAffiliationPhone(Map<String,Object> parameterValues);
	/**
	 * 異動後部署CSS名取得
	 * @param parameterValues
	 * @return 新CSS名
	 */
	List<Map<String,Object>> selNewCssNm(Map<String,Object> parameterValues);
	/**
	 * 電話機のCSSを更新
	 * @param parameterValues
	 * @return 件数
	 */
	int updCssOrgPhone(Map<String,Object> parameterValues);
	/**
	 * 異動後部署のPickUp名を取得
	 * @param parameterValues
	 * @return 新PickUp名
	 */
	List<Map<String,Object>> selNewPickUpNm(Map<String,Object> parameterValues);
	/**
	 * PickUpNameの更新
	 * @param parameterValues
	 * @return 件数
	 */
	int updPickUpLine(Map<String,Object> parameterValues);
	/**
	 * 親店部課情報取得
	 * @param parameterValues
	 * @return 親店部課情報
	 */
	List<Map<String,Object>> selParentSectionId(Map<String,Object> parameterValues);
	/**
	 * 組織情報更新
	 * @param parameterValues
	 * @return 件数
	 */
	int updChgAssociation(Map<String,Object> parameterValues);

	//退社者リスト
	/**
	 * 退社社員一覧取得
	 * @return 退社社員一覧
	 */
	Map<String,Object>[] selAllRetireUserList();

	//入社者リスト
	/**
	 * 入社社員一覧取得
	 * @return 入社社員一覧
	 */
	Map<String, Object> selAllAddUserList(String employeeId);

	//退社者リスト
	/**
	 * 退社社員一覧取得
	 * @return 退社社員一覧
	 */
	Map<String,Object>[] selAllNewUserList(List<String> employeeIds);


	//削除ユーザ使用電話機オーナー更新
	/**
	 * 削除ユーザ使用電話機数
	 * @param parameterValues
	 * @return 件数
	 */
	int updDelEmpPhoneOwner(Map<String,Object> parameterValues);
	/**
	 * 削除ユーザ使用電話機取得
	 * @param parameterValues
	 * @return 電話機一覧
	 */
	List<Map<String,Object>> delUserToPhone(Map<String,Object> parameterValues);
	/**
	 * 削除ユーザ使用電話機オーナー更新
	 * @param parameterValues
	 * @return 件数
	 */
	Map<String,Object> delUserNewOwnerPhone(Map<String,Object> parameterValues);

}

```

`batchプロジェクト/irdb/jp.co.netmarks.batch.persistence/MasterMapper.java`

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * MasterMapper.java
 *
 * @date 2013/09/12
 * @version 1.0
 * @author KSC Hiroaki Endo
 */
package jp.co.netmarks.batch.persistence;

import java.util.List;
import java.util.Map;

/**
 * <pre>
 * Masterパラメータ取得マッパークラス
 *
 * &lt;MODIFICATION HISTORY&gt;
 * 1.0 2013/09/12 KSC Hiroaki Endo 新規作成
 * </pre>
 *
 * @author KSC Hiroaki Endo
 * @version 1.0 2013/09/12
 */
public interface MasterMapper {

	/**
	 * フルVacuumを実行
	 * @return int
	 */
	int fullvacuum();
	/**
	 * 日次用VacuumとAnalyzeを実行
	 * @return int
	 */
	int dayvacuum();
	/**
	 * マスターパラメータ関連テーブルのVacuumを実行
	 * @return int
	 */
	int vacuum();

	/**
	 * マスターパラメータ関連テーブルのレコード削除
	 * @param parameterValues
	 * @return 削除件数
	 */
	int deleteMaster(Map<String, Object> parameterValues);

	/**
	 * CallingSearchSpaceの登録
	 * @param cssParameter
	 * @return 件数
	 */
	int insertCallingSearchSpace(Map<String, Object> cssParameter);
	/**
	 * DevicePoolの登録
	 * @param devicePoolParameter
	 * @return 件数
	 */
	int insertDevicePool(Map<String, Object> devicePoolParameter);
	/**
	 * Locationの登録
	 * @param locationParameter
	 * @return 件数
	 */
	int insertLocation(Map<String, Object> locationParameter);
	/**
	 * PickupGroupの登録
	 * @param pickupParameter
	 * @return 件数
	 */
	int insertPickupGroup(Map<String, Object> pickupParameter);
	/**
	 * PhoneTemplateの登録
	 * @param phoneTempParameter
	 * @return 件数
	 */
	int insertPhoneTemplate(Map<String, Object> phoneTempParameter);
	/**
	 * TypeModelの登録
	 * @param typeModelParameter
	 * @return 件数
	 */
	int insertTypeModel(Map<String, Object> typeModelParameter);

	/**
	 * マスターパラメータの取得
	 * @param parameterValues
	 * @return 取得したマスターパラメータのList
	 */
	List<Map<String, Object>> selectMaster(Map<String, Object> parameterValues);

}
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/resources.job

`/batchプロジェクト/irdb/resources.job/loadStaffInfo.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans xmlns="http://www.springframework.org/schema/batch"
              xmlns:beans="http://www.springframework.org/schema/beans"
              xmlns:aop="http://www.springframework.org/schema/aop"
              xmlns:tx="http://www.springframework.org/schema/tx"
              xmlns:p="http://www.springframework.org/schema/p"
              xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
              xsi:schemaLocation="
              http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd
              http://www.springframework.org/schema/batch http://www.springframework.org/schema/batch/spring-batch.xsd
              http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop.xsd
              http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx.xsd">

    <!-- 人事情報取り込みジョブ -->
    <job id="loadStaffInfo">
        <step id="staffStep" parent="simpleStep">
            <tasklet>
                <chunk reader="simpleReader" processor="simpleProcessor" writer="loadStaffWriter" commit-interval="10" />
            </tasklet>
        </step>
    </job>

    <beans:bean id="simpleReader" class="jp.co.batch.step.reader.SimpleReader" />
    <beans:bean id="simpleProcessor" class="jp.co.batch.step.processor.SimpleProcessor" />
    <beans:bean id="loadStaffWriter" class="jp.co.batch.step.writer.LoadStaffInfoWriter" />

</beans:beans>

```

`バッチ処理/batchプロジェクト/irdb/resources.job/CSVExplmp.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans:beans
	xmlns="http://www.springframework.org/schema/batch"
	xmlns:beans="http://www.springframework.org/schema/beans"
	xmlns:aop="http://www.springframework.org/schema/aop"
	xmlns:tx="http://www.springframework.org/schema/tx"
	xmlns:p="http://www.springframework.org/schema/p"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xmlns:util="http://www.springframework.org/schema/util"
	xsi:schemaLocation="
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
		http://www.springframework.org/schema/batch http://www.springframework.org/schema/batch/spring-batch-2.1.xsd
		http://www.springframework.org/schema/aop http://www.springframework.org/schema/aop/spring-aop-3.0.xsd
		http://www.springframework.org/schema/tx http://www.springframework.org/schema/tx/spring-tx-3.0.xsd
		http://www.springframework.org/schema/util http://www.springframework.org/schema/util/spring-util-3.0.xsd">

<!--
   - CSVジョブ
   -
-->
<!-- 全テーブル一括 -->
	<job id="csvAppImport" >
		<step id="appImport" parent="simpleStep">
			<tasklet>
				<chunk reader="simpleReader" processor="simpleProcessor" writer="appCSVImport" />
			</tasklet>
		</step>
	</job>

	<job id="csvAppExport" >
		<step id="appExport" parent="simpleStep">
			<tasklet>
				<chunk reader="simpleReader" processor="simpleProcessor" writer="appCSVExport" />
			</tasklet>
		</step>
	</job>

<!-- 課金 -->
	<job id="csvChargeExport" >
		<step id="chargeExport" parent="simpleStep">
			<tasklet>
				<chunk reader="simpleReader" processor="simpleProcessor" writer="chargeCSVExport" />
			</tasklet>
		</step>
	</job>

<!-- 電子電話帳 -->
	<job id="csvTelDirExport" >
		<step id="teldirExport" parent="simpleStep">
			<tasklet>
				<chunk reader="simpleReader" processor="simpleProcessor" writer="telDirCSVExport" />
			</tasklet>
		</step>
	</job>

<!-- ユニティ -->
	<job id="csvCUCExport" >
		<step id="CUCExport" parent="simpleStep">
			<tasklet>
				<chunk reader="simpleReader" processor="simpleProcessor" writer="CUCCSVExport" />
			</tasklet>
		</step>
	</job>

<!-- 回線情報一覧 -->
	<job id="csvLineListExport" >
		<step id="lineListExport" parent="simpleStep">
			<tasklet>
				<chunk reader="simpleReader" processor="simpleProcessor" writer="linelistCSVExport" />
			</tasklet>
		</step>
	</job>

<!-- ActiveDirectory -->
	<job id="csvADExport" >
		<step id="actDirExport" parent="simpleStep">
			<tasklet>
				<chunk reader="simpleReader" processor="simpleProcessor" writer="actDirCSVExport" />
			</tasklet>
		</step>
	</job>

<!-- 通録 -->
	<job id="csvVoiceLoggerImport" >
		<step id="voiceLoggerImport" parent="simpleStep">
			<tasklet>
				<chunk reader="simpleReader" processor="simpleProcessor" writer="voiceLoggerCSVImport" />
			</tasklet>
		</step>
	</job>

	<job id="csvVoiceLoggerExport" >
		<step id="voiceLoggerExport" parent="simpleStep">
			<tasklet>
				<chunk reader="simpleReader" processor="simpleProcessor" writer="voiceLoggerCSVExport" />
			</tasklet>
		</step>
	</job>

	<beans:bean id="simpleReader"          class="jp.co.ksc.batch.step.reader.SimpleReader" />
	<beans:bean id="simpleProcessor"       class="jp.co.ksc.batch.step.processor.SimpleProcessor" />

<!-- 全テーブル一括 -->
	<beans:bean id="appCSVImport"          class="jp.co.ksc.batch.step.writer.AppCSVImport" />
	<beans:bean id="appCSVExport"          class="jp.co.ksc.batch.step.writer.AppCSVExport" />
<!-- 課金 -->
	<beans:bean id="chargeCSVExport"       class="jp.co.ksc.batch.step.writer.ChargeCSVExport" />
<!-- 電子電話帳 -->
	<beans:bean id="telDirCSVExport"       class="jp.co.ksc.batch.step.writer.TelDirCSVExport" />
<!-- ユニティ -->
	<beans:bean id="CUCCSVExport"        class="jp.co.ksc.batch.step.writer.CUCCSVExport" />
<!-- 回線情報一覧 -->
	<beans:bean id="linelistCSVExport"     class="jp.co.ksc.batch.step.writer.LineListCSVExport" />
<!-- ActiveDirectory -->
	<beans:bean id="actDirCSVExport"       class="jp.co.ksc.batch.step.writer.ADCSVExport" />
<!-- 通録 -->
	<beans:bean id="voiceLoggerCSVImport"  class="jp.co.ksc.batch.step.writer.VoiceLoggerCSVImport" />
	<beans:bean id="voiceLoggerCSVExport"  class="jp.co.ksc.batch.step.writer.VoiceLoggerCSVExport" />

</beans:beans>
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/resources.jp.co.netmarks.batch.persistence

`バッチ処理/batchプロジェクト/irdb/resources.jp.co.netmarks.batch.persistence/LoadStaffMapper.xml`

```java
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
"http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper
	namespace="jp.co.netmarks.batch.persistence.LoadStaffMapper">

	<update id="vacuum">
		VACUUM (VERBOSE ,ANALYZE) biz_employee;
		VACUUM (VERBOSE ,ANALYZE) biz_shift;
		VACUUM (VERBOSE ,ANALYZE) biz_ad;
		VACUUM (VERBOSE ,ANALYZE) biz_organization;
		VACUUM (VERBOSE ,ANALYZE)
		biz_department;
		VACUUM (VERBOSE ,ANALYZE) app_user;
		VACUUM (VERBOSE
		,ANALYZE) r_user_section;
	</update>

	<!-- 閾値取得 -->
	<select id="selectThreshold" parameterType="Map"
		resultType="Map">
		select threshold_value from threshold limit 1
	</select>

	<!-- 閾値(入社)取得 -->
	<select id="selectEnterEmployee" resultType="Map">
		select distinct
		employee_code
		from biz_employee
		where employee_code not in
		(select
		biz_employee_id from app_user)
	</select>
	<select id="selectEnterCount" resultType="int">
		select count(1) from (
		select distinct employee_code
		from biz_employee
		where employee_code not in
		(select biz_employee_id from app_user)
		) as EnterCnt
	</select>

	<!-- 閾値(退社)取得 -->
	<select id="selectRetireEmployee" resultType="Map">
		select distinct
		biz_employee_id
		from app_user
		where biz_employee_id not in
		(select employee_code from biz_employee)
		and app_user.enabled_shared_use !=
		'1'
	</select>
	<select id="selectRetireCount" resultType="int">
		select count(1) from (
		select distinct app_user_id
		from app_user
		where biz_employee_id not in
		(select employee_code from biz_employee)
		and app_user.enabled_shared_use != '1'
		) as RetireCnt
	</select>

	<!-- 閾値(異動)取得 -->
	<select id="selectChangeEmployee" resultType="Map">
		select
		A.biz_employee_id,
		R.company_id,
		R.section_id
		from app_user A,
		r_user_section R
		where A.app_user_id = R.app_user_id
		and biz_employee_id in
		(select employee_code
		from biz_employee)
		and (A.biz_employee_id, R.company_id, lpad(R.section_id,
		5, '0')) not
		in (select
		employee_code,
		company_code,
		department_code
		from biz_employee)
	</select>
	<select id="selectChangeCount" resultType="int">
		select count(1) from (
		select A.biz_employee_id,
		R.company_id,
		R.section_id
		from app_user A,
		r_user_section R
		where A.app_user_id = R.app_user_id
		and biz_employee_id in
		(select employee_code
		from biz_employee)
		and (A.biz_employee_id, R.company_id, lpad(R.section_id, 5, '0')) not
		in (select
		employee_code,
		company_code,
		department_code
		from biz_employee)
		) as ChangeCnt
	</select>




	<!-- CSV 取込系 -->

	<insert id="insertBizAD" parameterType="Map">
		insert into
		tmp_ad(login_nm, disp_nm, last_nm, first_nm, mail, position)
		values(#{LOGIN_NM},#{DISP_NM},#{LAST_NM},#{FIRST_NM},#{MAIL},#{POSITION
		})
	</insert>

	<insert id="insertBizDepartment" parameterType="Map">
		insert into
		tmp_integratedid_department(organization_cd, company_cd, company_nm, control_cd, control_nm, charge_cd, charge_nm,  parent_department_cd, parent_department_nm, department_cd, department_nm, department_nm_en, zip_cd, address, telephone_no,  fax_no, extension_no, class_sales, class_data_input, update_date)
		values(#{ORGANIZATION_CD},#{COMPANY_CD},#{COMPANY_NM},#{CONTROL_CD},
		#{CONTROL_NM},#{CHARGE_CD},#{CHARGE_NM},#{PARENT_DEPARTMENT_CD},
		#{PARENT_DEPARTMENT_NM},#{DEPARTMENT_CD},#{DEPARTMENT_NM},
		#{DEPARTMENT_NM_EN},#{ZIP_CD},#{ADDRESS},#{TELEPHONE_NO},
		#{FAX_NO},#{EXTENSION_NO},#{CLASS_SALES},#{CLASS_DATA_INPUT},to_timestamp(#{UPDATE_DATE},'YYYYMMDDHH24MISS')::timestamp without time zone)
	</insert>

<insert id="insertBizEmployee" parameterType="Map">
    insert into
    tmp_integratedid_employee(organization_cd,company_cd,department_cd,department_nm,employee_cd,employee_nm_kanji,employee_nm_kana,executive_post_cd,post_lineage_cd,class,sex_cd,birthday,mail_address,assign_grade,class_tel_addressbook,class_temporary_transfer,mail_address_automade_flg,class_data_input,update_date)
    values(#{ORGANIZATION_CD},#{COMPANY_CD},#{DEPARTMENT_CD},#{DEPARTMENT_NM},
    #{EMPLOYEE_CD},#{EMPLOYEE_NM_KANJI},#{EMPLOYEE_NM_KANA},#{EXECUTIVE_POST_CD},
    #{POST_LINEAGE_CD},#{CLASS},#{SEX_CD},#{BIRTHDAY},#{MAIL_ADDRESS},#{ASSIGN_GRADE},
    #{CLASS_TEL_ADDRESSBOOK},#{CLASS_TEMPORARY_TRANSFER},#{MAIL_ADDRESS_AUTOMADE_FLG},#{CLASS_DATA_INPUT}, to_timestamp(#{UPDATE_DATE},'YYYYMMDDHH24MISS')::timestamp without time zone)
</insert>

	<insert id="insertBizOrganization" parameterType="Map">
		insert into
		tmp_integratedid_organization(organization_cd, organization_nm, organization_no, organization_abbreviated_nm, print_order, class_sales, class_data_input, update_date)
		values(#{ORGANIZATION_CD},#{ORGANIZATION_NM},#{ORGANIZATION_NO},
		#{ORGANIZATION_ABBREVIATED_NM},#{PRINT_ORDER},#{CLASS_SALES},#{CLASS_DATA_INPUT},to_timestamp(#{UPDATE_DATE},'YYYYMMDDHH24MISS')::timestamp without time zone)
	</insert>

	<!-- 取込前削除 -->
	<delete id="deleteBizAD" parameterType="Map">
		delete from tmp_ad;
	</delete>
	<delete id="deleteBizDepartment" parameterType="Map">
		delete from
		tmp_integratedid_department;
	</delete>
	<delete id="deleteBizEmployee" parameterType="Map">
		delete from
		tmp_integratedid_employee;
	</delete>
	<delete id="deleteBizOrganization" parameterType="Map">
		delete from
		tmp_integratedid_organization;
	</delete>

	<!-- DUM テーブル除外系 -->
	<delete id="deleteDumOrganization" parameterType="Map">
		delete
		from tmp_integratedid_organization
		where organization_cd in
		(select organization_cd
		from tmp_organization)
	</delete>

	<delete id="deleteDumDepartment" parameterType="Map">
		delete from
		tmp_integratedid_department
		where (company_cd, department_cd)
		in (select company_cd,
		department_cd
		from tmp_department);
		delete from tmp_integratedid_department
		where
		company_cd not in ('001', '002');
	</delete>

	<delete id="deleteDumEmployee" parameterType="Map">
		delete from
		tmp_integratedid_employee
		where (company_cd, employee_cd, assign_grade)
		in (select company_cd,
		employee_cd,
		assign_grade
		from tmp_employee);
		delete from tmp_integratedid_employee
		where company_cd
		not in ('001', '002');
		delete from tmp_integratedid_employee
		where
		executive_post_cd
		in (select executive_post_cd
		from tmp_executive);
	</delete>

	<!-- M_Section追加更新 -->
	<select id="selNotExistMSection" resultType="Map">
		select
		  company_cd,
		  department_cd
		from
		  tmp_integratedid_department
		where
		  (company_cd, department_cd) not in (
		     select
		       company_cd,
		       lpad(section_cd,5,'0')
		     from
		       mst_section
		  )
	</select>

	<select id="selExistMSection" resultType="Map">
		select
		company_cd,
		department_cd
		from
		tmp_integratedid_department
		where
		(company_cd, department_cd) in (
		select
		company_cd,
		lpad(section_cd,5,'0')
		from
		mst_section
		)
	</select>

	<select id="selDiffMSection" resultType="Map">
		select * from
		(select
		D.department_nm as deptnm,
		lpad(D.parent_department_cd, 5, '0') as pdeptid,
		D.organization_cd as orgcd,
		O.print_order as depprord
		from tmp_integratedid_department as D inner join tmp_integratedid_organization as O
		on D.organization_cd = O.organization_cd
		where D.company_cd = #{companyCode}
		and D.department_cd = #{departmentCode} ) as dep
		inner join
		(select
		section_nm as secnm,
		lpad(parent_section_cd, 5, '0') as psecid,
		organization_cd as orgid,
		print_order as secprord
		from mst_section
		where company_cd = #{companyCode}
		and lpad(section_cd,5,'0') = #{departmentCode}) as msec
		on dep.deptnm != msec.secnm
		or dep.pdeptid != msec.psecid
		or dep.orgcd != msec.orgid
		or dep.depprord != msec.secprord
	</select>

	<update id="updateMSection" parameterType="Map">
		update mst_section set
		section_nm = #{department_nm},
		parent_section_cd = #{parent_department_cd},
		organization_cd= #{organization_cd},
		print_order = #{print_order},
		update_date = now()
		where company_cd = #{companyCode}
		and lpad(section_cd,5,'0') = #{departmentCode}
	</update>

	<insert id="selinsMSection" parameterType="Map">
		<selectKey keyProperty="mstNextId" resultType="int" order="BEFORE">
			select nextval('mst_section_section_id_seq')
		</selectKey>
		insert into mst_section
		select
		#{mstNextId} as section_id,
		D.company_cd as company_cd,
		lpad(D.department_cd,5,'0') as section_cd,
		D.department_nm as section_nm,
		lpad(D.parent_department_cd,5,'0') as parent_section_cd,
		D.organization_cd as organization_cd,
		O.print_order,
		now(),
		now()
		from tmp_integratedid_department as D inner join tmp_integratedid_organization as O
		on
		D.organization_cd = O.organization_cd
		where D.company_cd = #{companyCode}
		and D.department_cd  = #{departmentCode}
	</insert>

<!-- APP_User 追加更新削除 -->
	<select id="selRetireUsers" resultType="Map">
		select distinct
		user_id
		from trn_user
		where biz_employee_id not in
		(select
		employee_cd
		from tmp_integratedid_employee)
		and trn_user.enabled_shared_use != '1'
	</select>

	<update id="updDelEmpAppUser" parameterType="Map">
		update rel_user_section set
		delete_reserve= '1',
		update_date = now()
		where user_id = #{user_id}
	</update>

	<update id="updDelEmpRUserSection" parameterType="Map">
		update
		r_user_section set
		deleted = '1',
		lastupdate_datetime = now()
		where app_user_id = #{user_id}
	</update>

	<update id="updDelEmpRUserPhone" parameterType="Map">
		update
		rel_cucm_user_phone set
		delete_flg = '1',
		update_date = now()
		where user_id = #{user_id}
	</update>

	<update id="updDelEmpTelDir" parameterType="Map">
		update
		tel_dir_association set
		deleted = '1',
		lastupdate_datetime = now()
		where app_user_id = #{appUserId}
	</update>

	<!-- 削除対象のユーザの電話機取得 -->
	<select id="delUserToPhone" parameterType="Map" resultType="Map">
		select usr.user_id as userid,
		phone.phone_id as phoneid
		from trn_user usr inner join rel_cucm_user_phone rpu
		on usr.user_id = rpu.user_id
		inner join trn_phone phone
		on rpu.phone_id = phone.phone_id
		where usr.user_id =
		#{user_id}
	</select>
	<!-- 電話機の新オーナー取得 -->
	<select id="delUserNewOwnerPhone" parameterType="Map"
		resultType="Map">
		select usr.cucm_login_id
		from trn_user usr inner join rel_cucm_user_phone rpu
		on usr.user_id = rpu.user_id
		inner join trn_phone phone
		on rpu.phone_id = phone.phone_id
		where usr.user_id = #{user_id}
		order by usr.user_id ASC
		limit 1
	</select>
	<!-- 新電話機オーナー更新 -->
	<update id="updDelEmpPhoneOwner" parameterType="Map">
		update trn_phone
		set
		owner_user_id = #{newOwner},
		delete_flg = '1',
		update_status= '1',
		update_date = now()
		where phone_id = #{phoneId}
	</update>


	<!-- 社員追加 -->
	<select id="selAdditionUsers" resultType="Map">
		select distinct
		employee_cd
		from tmp_integratedid_employee
		where employee_cd not in
		(select
		biz_employee_id
		from trn_user)
	</select>

<select id="selAdditionUserDetail" resultType="Map">
select
    '0' as user_role,
    '0' as enabled_shared_use,
    case
        when tmp_ad.position = '_社員' then '1'
        when tmp_ad.position = '_派遣社員' then '0'
    end as fulltime_employee,
    case
        when tmp_ad.POSITION = '_社員' THEN tmp_integratedid_employee.birthday
        when tmp_ad.POSITION = '_派遣社員' THEN CONCAT('0', tmp_integratedid_employee.employee_cd)
    end as login_password,
    tmp_integratedid_employee.employee_cd AS login_id,
    tmp_integratedid_employee.employee_cd AS biz_employee_id,
    tmp_integratedid_employee.employee_cd AS cucm_login_id,
    tmp_integratedid_employee.employee_nm_kanji,
    tmp_integratedid_employee.employee_nm_kana,
    tmp_integratedid_employee.birthday,
    COALESCE(tmp_ad.first_nm, tmp_integratedid_employee.employee_cd) AS first_name,
    COALESCE(tmp_ad.last_nm, tmp_integratedid_employee.employee_cd) AS last_name,
    tmp_integratedid_employee.department_nm
from
    tmp_integratedid_employee
    left outer join
        tmp_ad
    ON  tmp_integratedid_employee.employee_cd = tmp_ad.login_nm
where
    employee_cd = (
        select distinct
            employee_cd
        from
            tmp_integratedid_employee
        where
            employee_cd =#{employee_cd}
    )
limit 1
</select>

<insert id="insAdditionUserDetail" parameterType="Map">
INSERT INTO trn_user (
    user_role,
    enabled_shared_use,
    fulltime_employee,
    cucm_login_pw,
    login_id,
    login_pw,
    biz_employee_id,
    cucm_login_id,
    user_nm_kanji,
    user_nm_kana,
    birthday,
    department,
    first_nm,
    last_nm,
    pin,
    enable_cti_application_use,
    last_pw_update,
    authenticate_failure_num,
    account_lock,
    create_date,
    update_date
  )
  SELECT
    '0' as user_role,
    '0' as enabled_shared_use,
    CASE WHEN tmp_ad.position = '_社員' THEN '1' WHEN tmp_ad.position = '_派遣社員' THEN '0' END as fulltime_employee,
    CASE WHEN tmp_ad.position = '_社員' THEN tmp_integratedid_employee.birthday WHEN tmp_ad.position = '_派遣社員' THEN CONCAT('0', tmp_integratedid_employee.employee_cd) END as cucm_login_pw,
    tmp_integratedid_employee.employee_cd as login_id,
    '' as login_pw,
    tmp_integratedid_employee.employee_cd as biz_employee_id,
    tmp_integratedid_employee.employee_cd as cucm_login_id,
    tmp_integratedid_employee.employee_nm_kanji,
    tmp_integratedid_employee.employee_nm_kana,
    tmp_integratedid_employee.birthday,
    tmp_integratedid_employee.department_nm as department,
    COALESCE(tmp_ad.first_nm, tmp_integratedid_employee.employee_cd) as first_nm,
    COALESCE(tmp_ad.last_nm, tmp_integratedid_employee.employee_cd) as last_nm,
    '12345' as pin,
    '1' as enable_cti_application_use,
    now() as last_pw_update,
    0 as authenticate_failure_num,
    'ס' as account_lock,
    now() as create_date,
    now() as update_date
  FROM
    tmp_integratedid_employee
  LEFT OUTER JOIN tmp_ad ON tmp_integratedid_employee.employee_cd = tmp_ad.login_nm
  WHERE
    tmp_integratedid_employee.employee_cd = #{employee_cd}

</insert>

<!-- 社員 更新 -->
<select id="selExistAppUser" resultType="Map">
select distinct
    employee_cd
from
    tmp_integratedid_employee
where
    employee_cd in(
        select
            biz_employee_id
        from
            trn_user
    )
</select>

<select id="selDiffAppUser" resultType="Map">
select
    *
from
    (
        select distinct
            fulltime_employee as apfullemp,
            user_nm_kanji as apkanji,
            user_nm_kana as apkana,
            birthday as apbirth,
            first_nm as apfirstnm,
            last_nm as aplastnm,
            department
        from
            trn_user
        where
            biz_employee_id = #{employeeCode}
    ) app
    inner join
        (
            select distinct
                case
                    when ad.position = '_社員' then '1'
                    when ad.position = '_派遣社員' then '0'
                end as bzfullemp,
                emp.employee_nm_kanji as bzkanji,
                emp.employee_nm_kana as bzkana,
                emp.birthday as bzbirth,
                coalesce(ad.first_nm, emp.employee_cd) as bzfirstnm,
                coalesce(ad.last_nm, emp.employee_cd) as bzlastnm,
                department_nm as bzdepartment
            from
                tmp_integratedid_employee emp
                left outer join
                    tmp_ad ad
                on  emp.employee_cd = ad.login_nm
            where
                emp.employee_cd = (
                    select distinct
                        employee_cd
                    from
                        tmp_integratedid_employee
                    where
                        employee_cd = #{employeeCode}
                )
        ) biz
    on  app.apfullemp != biz.bzfullemp
    or  app.apkanji != biz.bzkanji
    or  app.apkana != biz.bzkana
    or  app.apbirth != biz.bzbirth
    or  app.apfirstnm != biz.bzfirstnm
    or  app.aplastnm != biz.bzlastnm
    or  app.department != biz.bzdepartment
</select>

<update id="updateAppUser" parameterType="Map">
update
    trn_user
set
    fulltime_employee = #{fulltime_employee},
    user_nm_kanji = #{user_nm_kanji},
    user_nm_kana = #{user_nm_kana},
    birthday = #{birthday},
    first_nm = #{first_nm},
    last_nm = #{last_nm},
    department = #{department},
    lastupdate_datetime = now()
where
    biz_employee_id = #{employeeCode}
</update>

<update id="updateTrnPhone" parameterType="Map">
UPDATE trn_phone
SET update_status = '1', update_date = NOW()
WHERE trn_phone.phone_id IN (
  SELECT rel_cucm_user_phone.phone_id
  FROM rel_cucm_user_phone
  INNER JOIN trn_user ON trn_user.user_id = rel_cucm_user_phone.user_id
  WHERE trn_user.biz_employee_id = #{employeeCode}
);
</update>

	<!-- USER_SECTION 追加 20230708-->
	<select id="selAdditionUserSection" resultType="Map">
		select distinct
		be.company_cd,
		be.department_cd,
		be.employee_cd
		from tmp_integratedid_employee be inner join trn_user AU on (be.employee_cd =
		AU.biz_employee_id)
		where lpad(be.department_cd, 5, '0') not in
		( select lpad(cast(section_id as text), 5, '0')
		from rel_user_section, trn_user
		where trn_user.user_id = rel_user_section.user_id
		)
		order by 1,2,3
	</select>

<select id="selExistDepartment" resultType="Map">
		select
		company_cd,
		section_cd
		from mst_section
		where
		company_cd = #{companyCode}
		and lpad(section_cd,5,'0') = #{departmentCode}
	</select>

	<select id="selExistUserSection" resultType="int">
select count(1) from
    (select A.user_id as user_id,
        E.company_cd as company_cd,
        lpad(E.department_cd,5,'0') as section_id
    from tmp_integratedid_employee E inner join trn_user A on E.employee_cd = A.biz_employee_id
    inner join tmp_integratedid_organization O on E.organization_cd = O.Organization_cd
    where
        E.company_cd = #{companyCode}
    and E.employee_cd = #{employeeCode}) as emp
inner join
    (select user_id, section_id  from rel_user_section) as sec
on (emp.user_id = sec.user_id
and emp.section_id = lpad(cast(sec.section_id as text), 5, '0'));
	</select>

	<select id="selAdditionUserSectionDetail" resultType="Map">
SELECT
    A.user_id,
    E.company_cd,
    LPAD(E.department_cd, 5, '0') AS department_cd,
    E.department_nm,
    O.print_order
FROM
    tmp_integratedid_employee E
    INNER JOIN mst_section M ON E.department_cd = M.section_cd
    INNER JOIN trn_user A ON E.employee_cd = A.biz_employee_id
    INNER JOIN rel_user_section R ON A.user_id = R.user_id
    INNER JOIN tmp_integratedid_organization O ON E.organization_cd = O.Organization_cd
WHERE
    E.company_cd = #{companyCode}
    AND LPAD(E.department_cd, 5, '0') = #{departmentCode}
    AND E.employee_cd = #{employeeCode}
	</select>

<insert id="insAdditionUserSection" parameterType="Map">
INSERT INTO rel_user_section (
    user_id,
    section_id,
    delete_reserve,
    create_date,
    update_date
)
SELECT
    A.user_id,
    CAST(LPAD(E.department_cd, 5, '0') AS INTEGER) AS section_id,
    'O' AS delete_reserve,
    NOW(),
    NOW()
FROM
    tmp_integratedid_employee E
    INNER JOIN trn_user A ON E.employee_cd = A.biz_employee_id
    INNER JOIN tmp_integratedid_organization O ON E.organization_cd = O.Organization_cd
WHERE
    E.company_cd = #{companyCode}
    AND LPAD(E.department_cd,5,'0') = #{departmentCode}
    AND E.employee_cd = #{employeeCode}
LIMIT 1;
</insert>


	<!-- USER_SECTION 更新 -->
	<select id="selExistDeptChk" resultType="Map">
select
  distinct be.company_cd,
  be.department_cd,
  be.employee_cd
from
  tmp_integratedid_employee be
  inner join mst_section M on be.company_cd = M.company_cd
  and be.department_cd = M.section_cd
  inner join rel_user_section R on lpad(be.department_cd, 5, '0') = lpad(
    cast(R.section_id as text),
    5,
    '0'
  )
  inner join trn_user AU on be.employee_cd = AU.biz_employee_id
	</select>

	<select id="selDiffUserSection" resultType="Map">
		select * from
			(select distinct
				E.department_nm as bizdeptnm,
				O.print_order as bizprintord
			from tmp_integratedid_employee E inner join tmp_integratedid_organization O
			on E.organization_cd = O.organization_cd
			where E.company_cd = #{companyCode}
			and E.department_cd = #{departmentCode}
			and E.employee_cd = #{employeeCode}
			) biz
		inner join
			(select distinct
				M.section_nm as appsectionnm,
				M.print_order as appprintord
			from mst_section M,
				trn_user T, rel_user_section R
			where R.user_id = T.user_id
			and R.section_id = M.section_id
			and cast(lpad(cast(R.section_id as text), 5, '0') AS VARCHaR)= #{departmentCode}
			and T.biz_employee_id =  #{employeeCode}
			) app
		on biz.bizdeptnm != app.appsectionnm
		limit 1
	</select>

	<!-- MST_店部課「mst_section」テーブルを更新する前にuser_idを取得する -->
	<select id="selTrnUser" resultType="Map">
		select
		  user_id
		from
		  trn_user
		where
		biz_employee_id = #{employeeCode}
	</select>

		<!-- MST_店部課「mst_section」テーブルを更新する前に店部課IDを取得する -->
	<select id="selMstSection" resultType="Map">
		select
		  M.section_id
		from
		  mst_section M INNER JOIN rel_user_section R
		  ON M.section_id = R.section_id
		where
		 M.company_cd = #{companyCode}
		 AND M.section_id = #{departmentCode}
		 AND R.user_id = #{user_id}
	</select>

	<update id="updateUserSection" parameterType="Map">
		update mst_section set
			section_nm = #{section_name},
			print_order = #{print_order},
			update_date = now()
		where section_id = #{section_id}
	</update>


	<!-- 社員の転出元所属削除 -->
	<select id="selChangePersonnel" resultType="Map">
		select distinct
		R.user_id,
		R.section_id,
		A.biz_employee_id
		from
		rel_user_section R inner join trn_user A
		on R.user_id = A.user_id
		where
		(cast(lpad(cast(R.section_id as text), 5, '0') AS VARCHAR),A.biz_employee_id)
		not in
		(select lpad(department_cd,5,'0'),employee_cd
		from tmp_integratedid_employee)
		and R.delete_reserve != '1'
		and A.fulltime_employee in ('0',
		'1')
	</select>

	<select id="selPersonnelUsedPhone" parameterType="Map"
		resultType="int">
SELECT COUNT(1)
FROM rel_cucm_user_phone
INNER JOIN trn_phone ON rel_cucm_user_phone.phone_id = trn_phone.phone_id
WHERE rel_cucm_user_phone.user_id = CAST(#{appUserId} AS INTEGER)
  AND LPAD(CAST(trn_phone.section_id AS TEXT), 5, '0') = LPAD(#{sectionId}, 5, '0')
  AND rel_cucm_user_phone.delete_flg != '1';

	</select>

	<delete id="deleteUserSection" parameterType="Map">
		delete from
		 rel_user_section
		where user_id = cast(#{appUserId} as integer)
		and lpad(cast(section_id as text), 5, '0') =
		lpad(#{sectionId},5,'0')
	</delete>

	<update id="updDelUserSection" parameterType="Map">
		update
		rel_user_section set
		delete_reserve = '1' ,
		update_date = now()
		where user_id = cast(#{appUserId} as integer)
		and
		and lpad(section_id,5,'0') =
		lpad(#{sectionId},5,'0')
	</update>


	<!-- 拠点統廃合 -->
	<select id="selShiftOrganization" resultType="Map">
		select distinct
		old_branch_code,
		old_company_code,
		old_department_code,
		new_branch_code,
		new_company_code,
		new_department_code
		from biz_shift
	</select>

	<!-- 廃止所属社員 -->
	<select id="selDelAffiliationUser" resultType="Map"
		parameterType="Map">
		select distinct
		U.app_user_id,
		U.biz_employee_id
		from app_user U inner join r_user_section R
		on U.app_user_id = R.app_user_id
		where R.company_id = #{companyId}
		and
		R.section_id = lpad(#{sectionId},5,'0')
		and U.deleted != '1'
		and
		R.deleted != '1'
	</select>

	<select id="selUserSectionCnt" resultType="int"
		parameterType="Map">
		select count(1)
		from biz_employee
		where employee_code =
		#{employeeCode}
		and company_code = #{companyId}
		and
		lpad(department_code,5,'0') = lpad(#{sectionId},5,'0')
	</select>

	<insert id="updChgPersonnelSection" parameterType="Map">
		insert into
		r_user_section
		select A.app_user_id,
		E.company_code as company_id,
		lpad(E.department_code,5,'0') as section_id,
		E.department_name as section_name,
		O.print_order,
		'0' as delete_reserve,
		'0' as deleted,
		now(),
		now()
		from biz_employee E inner join app_user A on E.employee_code =
		A.biz_employee_id
		inner join biz_organization O on E.organization_code = O.Organization_code
		where
		E.company_code = #{newCompanyCode}
		and lpad(E.department_code,5,'0') =
		lpad(#{newDepartmentCode},5,'0')
		and A.app_user_id = cast(#{appUserId}
		as integer)
		limit 1
	</insert>

	<update id="updChgPersonnelPhone" parameterType="Map">
		update
		r_cucm_user_phone
		set company_id = #{newCompanyCode},
		section_id = lpad(#{newDepartmentCode},5,'0'),
		lastupdate_datetime = now()
		where app_user_id = cast(#{appUserId} as integer)
		and
		company_id = #{oldCompanyCode}
		and lpad(section_id,5,'0') =
		lpad(#{oldDepartmentCode},5,'0')
	</update>

	<!-- 廃止所属電話機 -->
	<select id="selDelAffiliationPhone" resultType="Map"
		parameterType="Map">
		select
		P.cucm_phone_id as phoneid,
		CP.name as cssnm,
		L.cucm_line_id as lineid,
		CL.name as pickupnm
		from
		cucm_phone P inner join r_cucm_phone_line R on P.cucm_phone_id = R.cucm_phone_id
		inner join cucm_line L on R.cucm_line_id = L.cucm_line_id
		inner join m_branch MB on P.branch_id = MB.branch_id
		inner join m_cluster MC on MB.cluster_id = MC.cluster_id
		left outer join calling_search_space CP on MC.cluster_id = CP.cluster_id
		and P.calling_search_space_name = CP.name
		left outer join pickup_group CL on MC.cluster_id = CL.cluster_id
		and L.call_pickup_group_name = CL.name
		where P.branch_id =
		#{oldBranchCode}
		and P.company_id = #{oldCompanyCode}
		and P.section_id =
		#{oldDepartmentCode}
	</select>

<select id="selNewCssNm" resultType="Map" parameterType="Map">
		select
		vorg.branch_id as branchid,
		vorg.parent_section_id as parentsection,
		SUBSTRING(name from '[_a-zA-Z]+$') as linekind
		from v_organization_level vorg,
		calling_search_space css, m_cluster mc, m_branch mb
		where css.name =
		#{oldCssNm}
		and vorg.branch_id = mb.branch_id
		and mb.cluster_id = mc.cluster_id
		and mc.cluster_id = css.cluster_id
		and vorg.branch_id = #{newBranchCode}
		and vorg.child_company_id = #{newCompanyCode}
		and vorg.child_section_id = #{newDepartmentCode}
	</select>

	<update id="updCssOrgPhone" parameterType="Map">
		update cucm_phone
		set
		calling_search_space_name = #{newCssNm},
		branch_id = #{newBranchCode},
		company_id = #{newCompanyCode},
		section_id = #{newDepartmentCode},
		cucm_update_request_flag = '2',
		lastupdate_datetime = now()
		where cucm_phone_id = #{phoneId}
	</update>

	<select id="selNewPickUpNm" resultType="Map" parameterType="Map">
		select new.name as newpickupnm
		from pickup_group org
		inner join
		pickup_group new
		on org.no = new.no
		inner join m_branch mb
		on
		mb.cluster_id = org.cluster_id
		and mb.branch_id = org.branch_id
		where
		org.name = #{oldPickUpNm}
		and new.branch_id = #{newBranchCode}
		and
		new.section_id = #{newDepartmentCode}
	</select>

	<update id="updPickUpLine" parameterType="Map">
		update cucm_line set
		call_pickup_group_name = #{newPickUpNm},
		fwd_all_css =#{newCssNm},
		fwd_busy_css =#{newCssNm},
		fwd_noans_css =#{newCssNm},
		cucm_update_request_flag = '2',
		lastupdate_datetime = now()
		where
		cucm_line_id = #{lineId}
	</update>

	<select id="selParentSectionId" resultType="Map"
		parameterType="Map">
		select parent_section_id
		from v_organization_level vorg
		where child_company_id = #{companyId}
		and child_section_id =
		#{sectionId}
	</select>

	<update id="updChgAssociation" parameterType="Map">
		update
		charge_association
		set branch_id = #{newBranchCode},
		company_id = #{newCompanyCode},
		parent_section_id = #{newParentSection},
		section_id = #{newDepartmentCode},
		lastupdate_datetime = now()
		where cucm_line_id = #{lineId}
		and branch_id = #{oldBranchCode}
		and company_id = #{oldCompanyCode}
		and parent_section_id =
		#{oldParentSection}
		and section_id = #{oldDepartmentCode}
	</update>

<!-- 退社者リスト -->
<select id="selAllRetireUserList" resultType="Map">
SELECT
    trn_user.last_nm,
    trn_user.first_nm,
    REPLACE(trn_user.telephone_no, '_', '') AS telephone_no,
    LOWER(trn_user.last_nm) || '_' || LOWER(trn_user.first_nm) AS full_name
FROM
    trn_user
    INNER JOIN rel_cucm_user_phone ON rel_cucm_user_phone.user_id = trn_user.user_id
    INNER JOIN rel_user_section ON rel_user_section.user_id = trn_user.user_id
WHERE
    rel_cucm_user_phone.delete_flg = '1'
    AND rel_user_section.delete_reserve = '1'
ORDER BY
    trn_user.telephone_no ASC;
</select>

<!-- 新入者リスト -->
<select id="selAllAddUserList" resultType="Map" parameterType="String">
    select
    last_nm,
    first_nm,
    replace(telephone_no, '-', '') as telephone_no,
    lower(last_nm) || '_' || lower(first_nm) as full_name
    from trn_user
    where
    biz_employee_id = #{employeeId}
    order by telephone_no ASC;
</select>



</mapper>
```

# CUCM メンテナンスシステム開発/バッチ処理/batch プロジェクト/irdb/resources

`バッチ処理/batchプロジェクト/irdb/resources/environment.properties`

```properties
#######################################
# MasterParameter(TypeModel) \u53d6\u8fbc\u5bfe\u8c61Name ","\u533a\u5207\u308a\u3067\u5217\u6319
#######################################
typemodel.name=Cisco 6941,Cisco 7911,Cisco 7912,Cisco 7936,Cisco 7937,Cisco 7942,Cisco 7960,Cisco 7962,Cisco 9971

########################################
#FTP\u30c7\u30a3\u30ec\u30af\u30c8\u30ea
########################################
# Win32
InputDir.Win32=C:/files/importfiles/
#InputCompDir.Win32=C:/files/complatedfiles/
InputCompDir.Win32=C:/disk20/App/logmaint/logs
OutputDir.Win32=C:/var/www/download/data/export/batch/
OutputDir2.Win32=db/
OutputDir3.Win32=associate/
OutputDir4.Win32=circuitlist/
OutputRetireDir.Win32=C:/var/www/download/logs/batch
OutputNewUsersDir.Win32=C:/var/www/download/logs/nubatch
ReceiveDir.Win32=C:/tmpfiles

# Linux
InputDir.Linux=/home/batchuser/files/importfiles/
#InputCompDir.Linux=/home/batchuser/files/complatedfiles/
InputCompDir.Linux=/disk20/App/logmaint/logs
OutputDir.Linux=/var/www/download/data/export/batch/
OutputDir2.Linux=db/
OutputDir3.Linux=associate/
OutputDir4.Linux=circuitlist/
OutputRetireDir.Linux=/var/www/download/logs/batch/
OutputNewUsersDir.Linux=/var/www/download/logs/nubatch/
ReceiveDir.Linux=/var/www/tmpfiles
#######################################
#\u30ed\u30c3\u30af\u30d5\u30a1\u30a4\u30eb\u306e\u30d1\u30b9
#######################################
# Win32
LockFile.Win32=/var/www/download/tmp/cucm.lock
# Linux
LockFile.Linux=/var/www/download/tmp/cucm_app_is_updating.lock
#######################################
#\u4eba\u4e8b\u60c5\u5831\u53d6\u308a\u8fbc\u307f
#######################################
BizOrganizationTableName=BIZ_ORGANIZATION
#BizDepartmentTableName=BIZ_DEPARTMENT
BizEmployeeTableName=BIZ_EMPLOYEE
BizAdTableName=BIZ_AD
BizShiftTableName=BIZ_SHIFT

TmpBizOrganizationTableName=TMP_INTEGRATEDID_ORGANIZATION
TmpBizDepartmentTableName=TMP_INTEGRATEDID_DEPARTMENT
TmpBizEmployeeTableName=TMP_INTEGRATEDID_EMPLOYEE
TmpBizAdTableName=TMP_AD

BizOrganizationCsvFileName=organization.csv
BizDepartmentCsvFileName=department.csv
BizEmployeeCsvFileName=employee.csv
BizAdCsvFileName=ad.csv
BizShiftCsvFileName=shift.csv

Eof.Ad=EOFAD
Eof.Am=EOFAM

TmpAdCsvFileName=ad.csv
TmpIntDepartmentCsvFileName=department.csv
TmpIntEmployeeCsvFileName=employee.csv
TmpIntOrganizationCsvFileName=organization.csv
RetiredUserFileName=retired_user.csv
JoinedUserFileName=joined_user.csv

DumOrganizationCsvFileName=dum_organization.csv
DumDepartmentCsvFileName=dum_department.csv
DumEmployeeCsvFileName=dum_employee.csv

RetiredUserFileName=retired_users.log
ErrorFile.Win32=C:/files/errfiles/
ErrorFile.Linux=/var/www/files/errfiles/
ErrorFileName=batcherr.log


#######################################
#\u4eba\u4e8b\u60c5\u5831\u53d6\u308a\u8fbc\u307f(CSV Header)
#######################################
BizAdCsvHeader=USER_LOGON_NAME,DISP_NAME,LAST_NAME,FIRST_NAME,MAIL,POSITION
BizDepartmentCsvHeader=ORGANIZATION_CODE,COMPANY_CODE,COMPANY_NAME,CONTROL_CODE,CONTROL_NAME,CHARGE_CODE,CHARGE_NAME,PARENT_DEPARTMENT_CODE,PARENT_DEPARTMENT_NAME,DEPARTMENT_CODE,DEPARTMENT_NAME,DEPARTMENT_NAME_ENGLISH,ZIP_CODE,ADDRESS,TELEPHONE_NUMBER,FAX_NUMBER,EXTENSION_NUMBER,CLASS_SALES,CLASS_DATA_INPUT,UPDATE_DATE
BizEmployeeCsvHeader=ORGANIZATION_CODE,COMPANY_CODE,DEPARTMENT_CODE,DEPARTMENT_NAME,EMPLOYEE_CODE,EMPLOYEE_NAME_KANJI,EMPLOYEE_NAME_KANA,EXECUTIVE_POST_CODE,POST_LINEAGE_CODE,CLASS,SEX_CODE,BIRTHDAY,MAIL_ADDRESS,ASSIGN_GRADE,CLASS_TEL_ADDRESSBOOK,CLASS_TEMPORARY_TRANSFER,MAIL_ADDRESS_AUTOMADE_FLAG,CLASS_DATA_INPUT,UPDATE_DATE
BizOrganizationCsvHeader=ORGANIZATION_CODE,ORGANIZATION_NAME,ORGANIZATION_NUMBER,ORGANIZATION_ABBREVIATED_NAME,PRINT_ORDER,CLASS_SALES,CLASS_DATA_INPUT,UPDATE_DATE
BizShiftCsvHeader=OLD_BRANCH_CODE,OLD_COMPANY_CODE,OLD_DEPARTMENT_CODE,NEW_BRANCH_CODE,NEW_COMPANY_CODE,NEW_DEPARTMENT_CODE

TmpBizAdCsvHeader=LOGIN_NM,DISP_NM,LAST_NM,FIRST_NM,MAIL,POSITION
TmpBizDepartmentCsvHeader=ORGANIZATION_CD,COMPANY_CD,COMPANY_NM,CONTROL_CD,CONTROL_NM,CHARGE_CD,CHARGE_NM,PARENT_DEPARTMENT_CD,PARENT_DEPARTMENT_NM,DEPARTMENT_CD,DEPARTMENT_NM,DEPARTMENT_NM_EN,ZIP_CD,ADDRESS,TELEPHONE_NO,FAX_NO,EXTENSION_NO,CLASS_SALES,CLASS_DATA_INPUT,UPDATE_DATE
TmpBizEmployeeCsvHeader=ORGANIZATION_CD,COMPANY_CD,DEPARTMENT_CD,DEPARTMENT_NM,EMPLOYEE_CD,EMPLOYEE_NM_KANJI,EMPLOYEE_NM_KANA,EXECUTIVE_POST_CD,POST_LINEAGE_CD,CLASS,SEX_CD,BIRTHDAY,MAIL_ADDRESS,ASSIGN_GRADE,CLASS_TEL_ADDRESSBOOK,CLASS_TEMPORARY_TRANSFER,MAIL_ADDRESS_AUTOMADE_FLG,CLASS_DATA_INPUT,UPDATE_DATE
TmpBizOrganizationCsvHeader=ORGANIZATION_CD, ORGANIZATION_NM, ORGANIZATION_NO, ORGANIZATION_ABBREVIATED_NM, PRINT_ORDER, CLASS_SALES, CLASS_DATA_INPUT, UPDATE_DATE


#######################################
#CSV EXPORT IMPORT NAME
#######################################
VoiceCsvHeader=DIRECTORY_NUMBER,LOGGER_DATA
ChargeCsvHeader=H,CCMGRP,department,division,telnum,6,7,8
CUCCsvHeader=last_name,first_name,directory_no,mail_address,'voicemail'
TelDirCsvHeader=biz_employee_id,section_id,external_phone_number,directory_number,call_pickup_group_no
ADCsvHeader=user_logon_name,disp_name,last_name,first_name,mail,position,directory_number
#LineListCsvHeader=statusname,directorynumber,dialinnumber,lineindex,kanjiusername,sectionusername,pickupgroupno,voicemailflg,busydestination,chargeassociationbranchid,chargeassociationparentsectionid,chargeassociationsectionid,chargeremarks,loggerdataname,teldirdata,teltypemodel,macaddress,phonebuttontemplete,branchtelname,sectiontelname,callingsearchspacename,orgaddonmodulename1,orgaddonmodulename2,orgringsettingname,tellineremarks,linetextlabel,noansdestination,externalphonenumbermask
LineListCsvHeader=status,directoryNo,dialin,externalPhoneNoMask,no,userNmKanji,userSectionNm,pickupGroupNm,busyDestination,noansDestination,chargeBranchCd,chargeParentSectionCd,chargeSectionCd,chargeRemarks,voiceLoggerNm,phoneClassNm,deviceTypeNm,macAddress,phoneTemplateNm,softkeyTemplateNm,phoneBranchNm,phoneSectionNm,callingSearchSpaceNm,addonModuleNm1,addonModuleNm2,addonModuleNm3,ringSettingNm,lineRemarks,lineTxtLabel,allDestination,phoneRemarks,voiceMailProfileNm,fomaNo,callingPartyTransformationMask,representativePickupNm,gwRepletionSpecialNo

VoiceTableName=VOICE_LOGGER_ASSOCIATION
CsvImport.Voice=VOICE.csv

CsvExport.Voice=EXPORT_VOICE.csv
CsvExport.CUC=EXPORT_CUC.csv
CsvExport.Charge=EXPORT_CHARGE.csv
CsvExport.TelDir=EXPORT_TELDIR.csv
CsvExport.AD=EXPORT_AD.csv
CsvExport.LineList=EXPORT_LINE_LIST.csv

#######################################
# ALL TABLE NAME \u5168TBL\u4e00\u62ecEXPIMP\u5bfe\u8c61
#######################################
AllTable=app_user,biz_ad,biz_department,biz_employee,biz_organization,biz_shift,c_cucm_line,c_cucm_phone,c_cucm_phone_line,calling_search_space,charge_association,unity_association,cucm_line,cucm_master_last_update,cucm_phone,devicepool,dum_department,dum_employee,dum_organization,exclude_executive,line_reflected_cluster,location,m_branch,m_cluster,m_enduser_config,m_enduser_config_access_group,m_line_config,m_phone_config,m_phone_vendor_config,m_section,phone_reflected_cluster,phone_template,pickup_group,r_cucm_phone_line,r_cucm_user_phone,r_section_branch,r_user_section,tel_dir_association,threshold,type_model,voice_logger_association


###########################################################################
# \u30a8\u30e9\u30fc\u30e1\u30fc\u30eb\u914d\u4fe1\u6a5f\u80fd\u306e\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u3078\u306e\u63a5\u7d9a\u306e\u53ef\u5426\uff08\u30e1\u30fc\u30eb\u914d\u4fe1\u6a5f\u80fd\u3092\u8fc2\u56de\u3055\u305b\u308b\u304b\u5426\u304b\uff09
# \u203b\u203b\u203b \u30e1\u30fc\u30eb\u914d\u4fe1\u3092\u884c\u3046\u306a\u3089true \u203b\u203b\u203b
# (SMTP\u74b0\u5883\u306a\u3069\u306b\u4e0d\u90fd\u5408\u304c\u3042\u308c\u3070false)
# (2) ssl\u8a8d\u8a3c\u3059\u308b\u30b5\u30fc\u30d0\u30fc\u306a\u3089sslsend = true
###########################################################################
MailSender.enabled=false
MailSender.sslsend=false

###########################################################################
# Mail Sender (SMTP Client)
###########################################################################
MailSender.SenderName=CUCM\u9023\u643a\u30b7\u30b9\u30c6\u30e0
MailSender.MessageSubject=\u3010CUCM\u9023\u643a\u30b7\u30b9\u30c6\u30e0\u3011\u30a8\u30e9\u30fc\u5831\u544a
MailSender.SenderAddress=test-admin@irdb.co.jp

# \u30b7\u30a7\u30a2\u30c9\u30a2\u30c9\u30ec\u30b9\u306b\u306f\u5fc5\u305a\u9001\u4fe1\u3055\u308c\u307e\u3059
MailSender.SharedAddress=test-admin@irdb.co.jp
# Host\u540d\u306f \u30a2\u30c9\u30ec\u30b9\u540d\u307e\u305f\u306fIP\u30a2\u30c9\u30ec\u30b9
MailSender.HostSMTP=mail.irdb.jp
MailSender.HostSMTP.PORT=465
MailSender.HostSMTP.SSL=true
# Host\u540d\u306f \u30a2\u30c9\u30ec\u30b9\u540d\u307e\u305f\u306fIP\u30a2\u30c9\u30ec\u30b9
MailSender.HostPOP=mail.irdb.jp
MailSender.HostPOP.PORT=995

MailSender.Auth.ID=test-admin@irdb.co.jp
MailSender.Auth.Password=adminirdb

###########################################################################
# \u30a8\u30e9\u30fc\u30e1\u30fc\u30eb\u672c\u6587
###########################################################################

ErrorMailBody1=\
CallManager\u9023\u643a\u30a2\u30d7\u30ea\u30b1\u30fc\u30b7\u30e7\u30f3\u306b\u3066\u30a8\u30e9\u30fc\u304c\u767a\u751f\u3057\u307e\u3057\u305f\u3002\n\
\u30b7\u30b9\u30c6\u30e0\u7ba1\u7406\u8005\u306f\u30ed\u30b0\u3092\u78ba\u8a8d\u3057\u3066\u304f\u3060\u3055\u3044\u3002\n\n\
\u5f53\u65e5\u5206\u306e\u30ed\u30b0\u306e\u6240\u5728\u306f\u3001\n\n\
\u3000\u3000(1) IP\u30a2\u30c9\u30ec\u30b9\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\u3000\uff1axxx.xx.xx.xxx\n\
\u3000\u3000(2) \u30a8\u30e9\u30fc\u30ed\u30b0\u683c\u7d0d\u5834\u6240\u3000\u3000\u3000\u3000\u3000\u3000\uff1a/var/www/download/logs/batch\n\
\u3000\u3000(3) \u539f\u56e0\u5206\u6790\u7528\u30c7\u30d0\u30c3\u30b0\u30ed\u30b0\u683c\u7d0d\u5834\u6240\uff1a/var/www/download/logs\n\n\
\u3068\u306a\u308a\u307e\u3059\u3002\n\
(\u524d\u65e5\u5206\u4ee5\u524d\u306e\u30ed\u30b0\u306b\u3064\u3044\u3066\u306f\u3001\u30d5\u30a1\u30a4\u30eb\u540d\u306b\u65e5\u4ed8\u304c\u4ed8\u52a0\u3055\u308c\u3066\u3044\u307e\u3059)\n\
\u30ed\u30b0\u5185\u3067\u306e\u78ba\u8a8d\u7b87\u6240\u306f\u3001\u6b21\u306e\u65e5\u6642\u4ed8\u8fd1\u306b\u8a72\u5f53\u3059\u308b\u90e8\u5206\u3068\u306a\u308a\u307e\u3059\u3002\n\
\n\u30a8\u30e9\u30fc\u30e1\u30fc\u30eb\u9001\u4fe1\u65e5\u6642\uff1a

ErrorMailBody2=\
\u30a8\u30e9\u30fc\u30ed\u30b0\u306b\u51fa\u529b\u3055\u308c\u305f\u6982\u8981\uff1a

###########################################################################
```

`バッチ処理/batchプロジェクト/irdb/resources/launch-context.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
	xmlns:p="http://www.springframework.org/schema/p"
	xmlns:context="http://www.springframework.org/schema/context"
	xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
	xsi:schemaLocation="
		http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd
		http://www.springframework.org/schema/context http://www.springframework.org/schema/context/spring-context-3.0.xsd">

	<!-- data access -->
	<import resource="dataAccess-context.xml" />

	<!-- JOB定義ファイル -->
<!-- <import resource="classpath:/job/masterUpd.xml" /> -->
	<!-- <import resource="classpath:/job/consistencyInfo.xml" /> -->
	<!-- <import resource="classpath:/job/loadPersonnelInfo.xml" /> -->
	<import resource="classpath:/job/loadStaffInfo.xml" />
	<!-- <import resource="classpath:/job/allSubjectsReflect.xml" /> -->
	<import resource="classpath:/job/CSVExplmp.xml" />

	<!-- enable component scanning -->
	<context:component-scan base-package="jp.co.netmarks.service" />
	<context:component-scan base-package="jp.co.netmarks.util" />
	<context:component-scan base-package="jp.co.netmarks.batch.component" />
	<context:component-scan base-package="jp.co.netmarks.batch.dao" />

	<bean id="jobLauncher"
		class="org.springframework.batch.core.launch.support.SimpleJobLauncher">
		<property name="jobRepository" ref="jobRepository" />
	</bean>

	<bean id="mappedProcessor" class="jp.co.ksc.batch.step.processor.MappedProcessor" scope="step" />

	<bean id="simpleStep" class="org.springframework.batch.core.step.item.SimpleStepFactoryBean" abstract="true">
		<property name="transactionManager" ref="transactionManager" />
	</bean>

	<!-- ダミー設定 -->
	<bean id="jobRepository" class="org.springframework.batch.core.repository.support.MapJobRepositoryFactoryBean" p:transactionManager-ref="transactionManager" />
	<!--
		<bean id="dataSource" class="org.springframework.jdbc.datasource.SingleConnectionDataSource" />
		<bean id="transactionManager" class="org.springframework.batch.support.transaction.ResourcelessTransactionManager"  />
	 -->

	<!-- properties -->
	<bean id="properties" class="org.springframework.beans.factory.config.PropertiesFactoryBean">
	   <property name="locations">
	       <list>
	           <value>classpath:environment.properties</value>
	           <value>classpath:message.properties</value>
	       </list>
	   </property>
	</bean>
</beans>
```

`バッチ処理/batchプロジェクト/irdb/resources/dataAccess-context.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans-3.0.xsd">

    <bean id="dataSource" class="org.apache.commons.dbcp.BasicDataSource">
        <property name="driverClassName" value="org.postgresql.Driver" />
        <property name="url" value="jdbc:postgresql://localhost:5432/irdb utf8" />
        <property name="username" value="root" />
        <property name="password" value="" />
    </bean>

    <!-- transaction manager, use JtaTransactionManager for global tx -->
    <bean id="transactionManager" class="org.springframework.jdbc.datasource.DataSourceTransactionManager">
        <property name="dataSource" ref="dataSource" />
    </bean>

    <!-- define the SqlSessionFactory -->
    <bean id="sqlSessionFactory" class="org.mybatis.spring.SqlSessionFactoryBean">
        <property name="dataSource" ref="dataSource" />
        <property name="typeAliasesPackage" value="jp.co.ksc.batch.model, jp.co.netmarks.batch.model, jp.co.ksc.model, jp.co.netmarks.model" />
    </bean>

    <!-- scan for mappers and let them be autowired -->
    <bean class="org.mybatis.spring.mapper.MapperScannerConfigurer">
        <property name="basePackage" value="jp.co.netmarks.batch.persistence, jp.co.netmarks.persistence" />
    </bean>

</beans>
```
