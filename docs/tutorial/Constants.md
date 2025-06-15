## Constants

```java
package com.example.orgchart_api.constants;
/**
 * <pre>
 * 定数定義クラス
 */
public class Constants extends BaseConstants {

    /********************************
     ** ROLE
     ********************************/
    /* 権限 */
    public static final String ROLE_ADMIN      = "ROLE_ADMIN";
    public static final String ROLE_CHANGE       = "ROLE_CHANGE";
    public static final String ROLE_USER       = "ROLE_USER";

    /* 権限名称 */
    public static final String ROLE_ADMIN_NAME    = "管理者";
    public static final String ROLE_USER_NAME     = "参照ユーザー";
    public static final String ROLE_CHANGE_NAME   = "変更ユーザー";
    public static final String ROLE_NOTHING_NAME  = "権限なし";

    /* 権限区分 */
    public static final String ROLE_DIV_NOTHING = "0";
    public static final String ROLE_DIV_USER    = "1";
    public static final String ROLE_DIV_CHANGE  = "2";
    public static final String ROLE_DIV_ADMIN   = "9";

    /********************************
     ** DB
     ********************************/

    /* シーケンス名 */
    public static final String APP_USER_ID_SEQ   = "APP_USER_APP_USER_ID_SEQ";			// ユーザーID
    public static final String CUCM_LINE_ID_SEQ  = "CUCM_LINE_CUCM_LINE_ID_SEQ";		// ラインID
    public static final String CUCM_PHONE_ID_SEQ = "CUCM_PHONE_CUCM_PHONE_ID_SEQ";		// 電話ID
    public static final String TEL_DIR_ASSOCIATION_ID_SEQ = "TEL_DIR_ASSOCIATION_TEL_DIR_ASSOCIATION_ID_SEQ";

    /* DATE・フォーマット */
    public static final String TIMESTAMP_FORMAT = "YYYY-MM-DD HH24:MI:SSMS";
    public static final String DATE_FORMAT_CONSTANT = "yyyy/MM/DD HH24:MI:SS";
    public static final String DATE_FORMAT_COMMENT = "YYYY/MM/DD HH24:MI";
    public static final String DATE_FORMAT_YMD_NOTHING = "yyyyMMdd";
    public static final String DATE_FORMAT = "yyyy/MM/dd";
    public static final String DATE_FORMAT_NOTHING = "yyyyMMddHHmmss";

    /* 話中転送条件件数 */
    public static final int BUSY_DESTINATION_CONDITION_INDEX = 40;

    /*********************************
     ** 文字
     *********************************/

    /* 入力チェック変換用 */
    public static final String INPUT_DATA_STRING_NUMBER      = "1";
    public static final int INPUT_DATA_INTEGER               = 1;
    public static final String INPUT_DATA_MAC_ADDRESS        = "111111111111";
    public static final String INPUT_DATA_DIRECTORY_NUMBER   = "11111111";
    public static final String INPUT_DATA_CHARGE_BRANCH_ID   = "111";
    public static final String INPUT_DATA_CHARGE_SECTION_ID  = "11111";
    public static final String INPUT_DATA_BRANCH_COMPANY_ID  = "111";
    public static final String INPUT_DATA_SECTION_ID         = "11111";

    /* UnityAssociation.Unity_data */
    public static final String UNITY_DATA                = "Voicemail";
    /* R_CUCM_Phone_Line.Line_Text_Label */
    public static final String LINE_TEXT_LABEL_NO_DIALIN    = "XXXX";
    public static final String LINE_TEXT_LABEL_FIRST_NUMBER = "8";
    public static final String LINE_TEXT_LABEL_HYPHEN       = "-";
    /* R_CUCM_Phone_Line.External_Phone_Number_Mask */
    public static final String EXTERNAL_PHONE_NUMBER_NO_DIALIN = "**********";
    /* CUCM_Phone.Calling_Search_Space_Name */
    public static final String CALLING_SEARCH_SPACE_NAME_NO_DIALIN_DOMESTIC = "NoDialin_Domestic";
    public static final String CALLING_SEARCH_SPACE_NAME_DIALIN_DOMESTIC = "Dialin_Domestic";

    /* メッセージ区切り文字 */
    public static final String MESSAGE_DELIMITER  = "，";

    /*********************************
     ** ラベル
     *********************************/

    /* 全て */
    public static final String ALL_LABEL                = "--";

    /* 全て（拠点） */
    public static final String BRANCH_ALL_LABEL         = "0 全拠点";

    /* 全て（店部課） */
    public static final String SECTION_ALL_LABEL        = "0 店部課";

    /* 全て（電話機） */
    public static final String TEL_TYPE_MODEL_ALL_LABEL = "全電話機";

    /* クラスタ名 */
    public static final String CLUSTER_ALL_LABEL        = "全クラスタ";
    public static final String CLUSTER_LABEL            = "クラスタ";
    public static final String CLUSTER_INIT_VALUE       = "0";

    /*********************************
     ** 区分、フラグ
     *********************************/

    /* CUCM更新依頼フラグ */
    public static final String CUCM_UPDATE_FLG_FINISHED    = "0";		// 更新済み
    public static final String CUCM_UPDATE_FLG_WAIT        = "1";		// 更新待ち
    public static final String CUCM_UPDATE_FLG_WAIT_2      = "2";		// 更新待ち
    public static final String CUCM_UPDATE_FLG_WAIT_3      = "3";		// バッチで更新時：空

    /* 反映状況 */
    public static final String REFLECTION_ALL            = "";
    public static final String REFLECTION_ERROR          = "1";
    public static final String REFLECTION_WAIT           = "2";
    public static final String REFLECTION_FINISHED       = "3";
    public static final String REFLECTION_BATCH          = "4";

    public static final String REFLECTION_ALL_NAME       = "全件";
    public static final String REFLECTION_ERROR_NAME     = "エラー";
    public static final String REFLECTION_WAIT_NAME      = "反映待";
    public static final String REFLECTION_FINISHED_NAME  = "反映済";
    public static final String REFLECTION_BATCH_NAME     = "";

    /* 通話録音(LOGGER_DATA) */
    public static final String LOGGER_DATA_ALL        = "";
    public static final String LOGGER_DATA_OFF        = "0";
    public static final String LOGGER_DATA_ON         = "1";

    public static final String LOGGER_DATA_ALL_NAME   = "全件";
    public static final String LOGGER_DATA_ON_NAME    = "全録";
    public static final String LOGGER_DATA_OFF_NAME   = "なし";

    /* ボイスメール */
    public static final String VOICE_MAIL_FLG_OFF     = "0";
    public static final String VOICE_MAIL_FLG_ON      = "1";

    /* TEL_DIR_DATA(電話帳) */
    public static final String TEL_DIR_DATA_OFF       = "0";
    public static final String TEL_DIR_DATA_ON        = "1";

    /* 拡張設定 */
    public static final String ADDON_MODULE_NAME_7962   = "7914 14-Button Line Expansion Module,7915 12-Button Line Expansion Module,7915 24-Button Line Expansion Module";
    public static final String ADDON_MODULE_NAME_7960   = "7914 14-Button Line Expansion Module";

    /* 拡張設定電話機モデル */
    public static final String MODULE_TEL_TYPE_MODEL     = "Cisco 7962,Cisco 7960";

    /* 拡張設定電話機選択モデル（拡張設定電話機で定義した通りの順番で表示するリストをセットすること） */
    public static final String[] ADDON_MODULE_ARRAY = {ADDON_MODULE_NAME_7962,ADDON_MODULE_NAME_7960};

    /* 鳴動設定 */
    public static final String RING_SETTING_DEFAULT    = "Use System Default";
    public static final String RING_SETTING_DISABLE    = "Disable";
    public static final String RING_SETTING_FLASH_ONLY = "Flash Only";
    public static final String RING_SETTING_RING_ONCE  = "Ring Once";
    public static final String RING_SETTING_RING       = "Ring";

    /* 電話機 */
    public static final String TEL_TYPE_MODEL_CISCO_7962 = "Cisco 7962";
    public static final String TEL_TYPE_MODEL_CISCO_7960 = "Cisco 7960";
    public static final String TEL_TYPE_MODEL_CTI_PORT = "CTI port";

    /* 使用状況 */
    public static final String TEL_USAGES_DEFAULT       = "1"; // 一般
    public static final String TEL_USAGES_COMMON_USER   = "2"; // 共有ユーザー
    public static final String TEL_USAGES_SHARED_LINE   = "3"; // シェアードライン
    public static final String TEL_USAGES_MULTI_DEVICE  = "4"; // マルチデバイス
    public static final String TEL_USAGES_MULTI_LINE    = "5"; // マルチライン
    public static final String TEL_USAGES_SHARED_TEL    = "6"; // 共用電話機
    public static final String TEL_USAGES_NOT_LINK_TEL  = "7"; // 電話機と紐付いていないユーザ
    public static final String TEL_USAGES_NOT_LINK_USER = "8"; // 部内在庫電話機
    public static final String TEL_USAGES_MANY          = "9"; // 複数対複数

    /* 使用状況 コード */
    public static final String TEL_USAGES_STATUS_SINGLE  = "0";	// 単一つながり
    public static final String TEL_USAGES_STATUS_MANY    = "1";	// 複数つながり
    public static final String TEL_USAGES_STATUS_NOTHING = "9";	// つながり無し

    /* 共有ユーザー区分 */
    public static final String ENABLED_SHARED_USE_PRIVATE = "0";	// 個別ユーザー
    public static final String ENABLED_SHARED_USE_SHARE   = "1";	// 共有ユーザー

    /* 正社員区分 */
    public static final String FULLTIME_EMPLOYEE_SHARED_USE = "8";	// 共有ユーザー

    /* 共有ユーザー名 */
    public static final String SHARED_USE_NAME          = "SHARED";

    /* PIN */
    public static final String PIN_SHARED_USE           = "99999";

    /* エラータイプ */
    public static final String ERROR_TYPE_USER          = "user";
    public static final String ERROR_TYPE_TEL           = "tel";
    public static final String ERROR_TYPE_LINE          = "line";

    /* 電話ーラインの連番 */
    public static final String TEL_LINE_INDEX_1         = "1";
    public static final String TEL_LINE_INDEX_2         = "2";
    public static final String TEL_LINE_INDEX_3         = "3";
    public static final String TEL_LINE_INDEX_4         = "4";
    public static final String TEL_LINE_INDEX_5         = "5";
    public static final String TEL_LINE_INDEX_6         = "6";

    /* ユーザー電話保持ステータス */
    public static final String USER_TEL_RETAIN_EXIST     = "1";
    public static final String USER_TEL_RETAIN_NOT_EXIST = "0";

    public static final String USER_TEL_RETAIN_EXIST_NAME     = "番号あり";
    public static final String USER_TEL_RETAIN_NOT_EXIST_NAME = "番号なし";

    /* 電話機状態ステータス */
    public static final String TEL_STATUS_INSIDE_STOCK = "0";
    public static final String TEL_STATUS_USE          = "1";

    public static final String TEL_STATUS_INSIDE_STOCK_NAME = "部内在庫";
    public static final String TEL_STATUS_USE_NAME          = "利用中";

    /* ラインIndex */
    public static final String LINE_INDEX_ERROR        = "0";
    public static final String LINE_INDEX_MAIN         = "1";

    /* 不整合データ区分 */
    public static final String INCONSISTENCY_CUCM_NO_EXIST  = "0"; // CUCMに存在しない
    public static final String INCONSISTENCY_APP_NO_EXIST   = "1"; // 連携アプリに存在しない
    public static final String INCONSISTENCY_TEL_LINE       = "2"; // 電話機/ライン設定値が異なる
    public static final String INCONSISTENCY_TEL            = "3"; // 電話機設定値が異なる
    public static final String INCONSISTENCY_LINE           = "4"; // ライン設定値が異なる

    /* 詳細情報区分 */
    public static final String INCONSISTENCY_TEL_INFO        = "0"; // 電話機情報
    public static final String INCONSISTENCY_TEL_LINE_INFO   = "1"; // 電話機・ライン情報
    public static final String INCONSISTENCY_LINE_INFO       = "2"; // ライン情報
    public static final String INCONSISTENCY_OFFICE_LINK_INFO        = "4"; // オフィスリンク情報
    /* 詳細情報区分ラベル */
    public static final String INCONSISTENCY_TEL_INFO_LABEL        = "電話機情報";
    public static final String INCONSISTENCY_TEL_LINE_INFO_LABEL   = "電話機/ライン情報";
    public static final String INCONSISTENCY_LINE_INFO_LABEL       = "ライン情報";
    public static final String INCONSISTENCY_OFFICE_LINK_INFO_LABEL       = "オフィスリンク情報";

    /* 話中転送先 */
    public static final String BUSY_DESTINATION_FRONT_CHAR   = "8";

    /* ログファイル区分 */
    public static final String DIR_LOG_WEB                = "0"; // ウェブのログ
    public static final String DIR_LOG_BATCH              = "1"; // バッチのログ
    public static final String DIR_EXPORT_WEB             = "2"; // ウェブの出力ファイル
    public static final String DIR_EXPORT_BATCH_BK        = "3"; // バッチの出力ファイル(バックアップ)
    public static final String DIR_EXPORT_BATCH_EXCOOP    = "4"; // バッチの出力ファイル(外部連携)
    public static final String DIR_EXPORT_BATCH_LINELIST  = "5"; // バッチの出力ファイル(回線一覧)

    /* 取込可能テーブル */
    public static final String TABLE_EXCLUDE_EXECUTIVE  = "EXCLUDE_EXECUTIVE";
    public static final String TABLE_DUM_ORGANIZATION   = "DUM_ORGANIZATION";
    public static final String TABLE_DUM_EMPLOYEE       = "DUM_EMPLOYEE";
    public static final String TABLE_DUM_DEPARTMENT     = "DUM_DEPARTMENT";

    /* エラータイプ(電話機登録時) */
    public static final String ERROR_TYPE_CSS          = "CallingSearchSpace";
    public static final String ERROR_TYPE_DEVICEPOOL   = "DevicePool";

    /* 電話機登録処理区分 */
    public static final String LINE_NO_EXIST                = "0";
    public static final String LINE_EXIST_DELETED           = "1";
    public static final String LINE_EXIST_SAME_BRANCH       = "2";
    public static final String LINE_EXIST_DEFFER_BRANCH     = "3";

    /* データ移行用登録会社ID */
    public static final String DATA_SHIFT_ENTRY_COMPANY = "002";

    /* ロック状態区分 */
    public static final String LOCK_STATE_NORMAL        = "0"; // 正常
    public static final String LOCK_STATE_LOCKED        = "1"; // ロック中
    /* ロック状態区分ラベル */
    public static final String LOCK_STATE_NORMAL_LABEL = "正常";
    public static final String LOCK_STATE_LOCKED_LABEL = "ロック中";

    /*********************************
     ** プルダウン
     *********************************/
    /* 反映状況 */
    public static final String[] REFLECTION_SELECT_VALUE = { REFLECTION_ALL, REFLECTION_ERROR, REFLECTION_FINISHED, REFLECTION_WAIT, REFLECTION_BATCH };
    public static final String[] REFLECTION_SELECT_LABEL = { REFLECTION_ALL_NAME, REFLECTION_ERROR_NAME, REFLECTION_FINISHED_NAME, REFLECTION_WAIT_NAME, REFLECTION_BATCH_NAME };

    /* 通話録音 */
    public static final String[] LOGGER_DATA_VALUE    = { LOGGER_DATA_ALL, LOGGER_DATA_OFF, LOGGER_DATA_ON };
    public static final String[] LOGGER_DATA_LABEL    = { LOGGER_DATA_ALL_NAME, LOGGER_DATA_OFF_NAME, LOGGER_DATA_ON_NAME };

    /* 通話録音（検索結果用） */
    public static final String[] LOGGER_DATA_SELECT_VALUE    = { LOGGER_DATA_OFF, LOGGER_DATA_ON };
    public static final String[] LOGGER_DATA_SELECT_LABEL    = { LOGGER_DATA_OFF_NAME, LOGGER_DATA_ON_NAME };

    /* 鳴動設定 */
    public static final String[] RING_SETTING_VALUE  =  {RING_SETTING_DEFAULT,RING_SETTING_DISABLE,RING_SETTING_FLASH_ONLY,RING_SETTING_RING_ONCE,RING_SETTING_RING};
    public static final String[] RING_SETTING_LABEL  =  {RING_SETTING_DEFAULT,RING_SETTING_DISABLE,RING_SETTING_FLASH_ONLY,RING_SETTING_RING_ONCE,RING_SETTING_RING};

    /* ユーザー保持ステータス */
    public static final String[] USER_TEL_RETAIN_VALUE = {USER_TEL_RETAIN_EXIST,USER_TEL_RETAIN_NOT_EXIST};
    public static final String[] USER_TEL_RETAIN_LABEL  = {USER_TEL_RETAIN_EXIST_NAME,USER_TEL_RETAIN_NOT_EXIST_NAME};

    /* 電話機状態ステータス */
    public static final String[] TEL_STATUS_VALUE = {TEL_STATUS_INSIDE_STOCK,TEL_STATUS_USE};
    public static final String[] TEL_STATUS_LABEL = {TEL_STATUS_INSIDE_STOCK_NAME,TEL_STATUS_USE_NAME};

    /* 処理（権限管理） */
    public static final String[] AUTH_MANAGEMENT_DATA_VALUE    = { ROLE_DIV_NOTHING, ROLE_DIV_ADMIN, ROLE_DIV_USER, ROLE_DIV_CHANGE };
    public static final String[] AUTH_MANAGEMENT_DATA_LABEL    = { ROLE_NOTHING_NAME, ROLE_ADMIN_NAME, ROLE_USER_NAME, ROLE_CHANGE_NAME };

    /*  テーブル取込（メンテナンス）*/
    public static final String[] FETCH_TABLE_VALUE    = { TABLE_EXCLUDE_EXECUTIVE, TABLE_DUM_ORGANIZATION, TABLE_DUM_EMPLOYEE, TABLE_DUM_DEPARTMENT};
    public static final String[] FETCH_TABLE_LABEL    = { TABLE_EXCLUDE_EXECUTIVE, TABLE_DUM_ORGANIZATION, TABLE_DUM_EMPLOYEE, TABLE_DUM_DEPARTMENT};

}
```
