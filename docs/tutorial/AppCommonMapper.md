## AppCommonMapper

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * AppCommonMapper.java
 *
 * @date 2013/08/08
 * @version 2.0
 * @author Yao Kaikyou
 */
package com.example.orgchart_api.mapper;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import com.example.orgchart_api.model.LabelValueModel;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

/**
 * <pre>
 * 共通データマッパーインタフェース
 *
 * &lt;MODIFICATION HISTORY&gt;
 * 1.0 2013/08/08 Yao Kaikyou 新規作成
 * 2.0 2023/07/20 Spring Boot 3.5.0対応
 * </pre>
 *
 * @author Yao Kaikyou
 * @version 2.0 2023/07/20
 */
@Mapper
public interface AppCommonMapper {

    /**
     * ユーザー情報の取得
     * @param params ログインID,パスワード
     * @return ユーザー情報(Optional)
     */
    Optional<Map<String, Object>> getUserInfo(@Param("params") Map<String, String> params);

    /**
     * 拠点リスト
     * @param cluster クラスタ
     * @return 拠点リスト
     */
    List<LabelValueModel> getBranchList(@Param("cluster") String cluster);

    /**
     * 店部課リスト
     * @param branchId 拠点ID
     * @return 店部課リスト
     */
    List<LabelValueModel> getSectionList(@Param("branchId") String branchId);

    /**
     * 店部課リストのマスタ情報リスト(動的用)
     * @return 店部課動的リスト
     */
    List<Map<String, String>> getBranchSectionList();

    /**
     * 親店部課のマスタ情報リスト
     * @return 親店部課リスト
     */
    List<Map<String, String>> getParentSectionList();

    /**
     * ピックアップグループリスト
     * @param params 検索条件
     * @return ピックアップグループリスト
     */
    List<LabelValueModel> getPickupGroupList(@Param("params") Map<String, String> params);

    /**
     * ピックアップグループのマスタ情報リスト(動的用)
     * @return ピックアップグループ動的リスト
     */
    List<Map<String, String>> getPickupGroupMstarList();

    /**
     * 電話機リスト
     * @return 電話機リスト
     */
    List<LabelValueModel> getTypeModelList();

    /**
     * 電話機Templateリスト
     * @param typeModelName 電話機タイプ
     * @return 電話機Templateリスト
     */
    List<LabelValueModel> getPhoneTempleteList(@Param("typeModelName") String typeModelName);

    /**
     * 電話機Templateのマスタ情報リスト(動的用)
     * @return 電話機Template動的リスト
     */
    List<Map<String, String>> getPhoneTempleteMstarList();

    /**
     * コーリングサーチスペースリスト取得
     * @return コーリングサーチスペースリスト
     */
    List<Map<String, String>> getCallingSearchSpaceDynamicList();

    /**
     * クラスタリストを取得
     * @param clusterLabel クラスタラベル
     * @return クラスタリスト
     */
    List<LabelValueModel> getClusterList(@Param("clusterLabel") String clusterLabel);

    /* #### 存在チェック #### */

    /**
     * 拠点存在チェック
     * @param branchId 拠点Id
     * @return 件数
     */
    int branchExistCheck(@Param("branchId") String branchId);

    /**
     * 店部課存在チェック
     * @param params 条件
     * @return 件数
     */
    int sectionExistCheck(@Param("params") Map<String, Object> params);

    /**
     * 拠点と店部課の紐付き存在チェック
     * @param params 条件
     * @return 件数
     */
    int branchSectionExistCheck(@Param("params") Map<String, Object> params);

    /**
     * 電話機存在チェック
     * @param params 条件
     * @return 件数
     */
    int telExistCheck(@Param("params") Map<String, Object> params);

    /**
     * ユーザー存在チェック
     * @param params 条件
     * @return 件数
     */
    int userExistCheck(@Param("params") Map<String, Object> params);

    /**
     * Line存在チェック
     * @param params 条件
     * @return 件数
     */
    int lineExistCheck(@Param("params") Map<String, Object> params);

    /**
     * 内線番号存在チェック
     * @param params 条件
     * @return 件数
     */
    int directoryNumberExistCheck(@Param("params") Map<String, Object> params);

    /**
     * Unity関連存在チェック
     * @param telId 電話ID
     * @return 件数
     */
    int unityAssociationExistCheck(@Param("telId") BigDecimal telId);

    /**
     * ユーザーと店部課の紐付き存在チェック
     * @param params 条件
     * @return 件数
     */
    int userSectionExistCheck(@Param("params") Map<String, Object> params);

    /**
     * ユーザーと電話機の紐付き存在チェック
     * @param params 条件
     * @return 件数
     */
    int userTelExistCheck(@Param("params") Map<String, Object> params);

    /**
     * ユーザーと電話機とユーザーの店部課の紐付き存在チェック
     * @param params 条件
     * @return 件数
     */
    int userTelSectionExistCheck(@Param("params") Map<String, Object> params);

    /**
     * 削除予約フラグ存在チェック
     * @param params 条件
     * @return 件数
     */
    int userSectionDeleteReserveExistCheck(@Param("params") Map<String, Object> params);

    /**
     * DevicePool存在チェック
     * @param params 条件
     * @return 件数
     */
    int devicePoolExistCheck(@Param("params") Map<String, Object> params);

    /**
     * CallingSearchSpace存在チェック
     * @param params 条件
     * @return 件数
     */
    int callingSearchSpaceExistCheck(@Param("params") Map<String, Object> params);

    /**
     * 電話機種存在チェック
     * @param params 条件
     * @return 件数
     */
    int typeModelExistCheck(@Param("params") Map<String, Object> params);

    /**
     * マックアドレス存在チェック
     * @param params 条件
     * @return 件数
     */
    int macAddressExistCheck(@Param("params") Map<String, Object> params);

    /**
     * ボタンテンプレート存在チェック
     * @param params 条件
     * @return 件数
     */
    int phoneTemplateExistCheck(@Param("params") Map<String, Object> params);

    /**
     * ロケーション存在チェック
     * @param params 条件
     * @return 件数
     */
    int locationExistCheck(@Param("params") Map<String, Object> params);

    /**
     * ピックアップグループ存在チェック
     * @param params 条件
     * @return 件数
     */
    int pickupGroupExistCheck(@Param("params") Map<String, Object> params);

    /**
     * TelDirData存在チェック
     * @param params 条件
     * @return 件数
     */
    int telDirAssociationExistCheck(@Param("params") Map<String, Object> params);

    /**
     * TelDirData存在チェック
     * ※電話とユーザーに紐づくラインデータに該当する登録されていないデータ件を取得
     * @param params 条件
     * @return 件数
     */
    int telDirAssociationExistEntryTelUserCheck(@Param("params") Map<String, Object> params);

    /**
     * TelDirData存在チェック
     * ※電話とラインに紐づくユーザーデータに該当する登録されていないデータ件を取得
     * @param params 条件
     * @return 件数
     */
    int telDirAssociationExistEntryTelLineCheck(@Param("params") Map<String, Object> params);

    /**
     * ラインIndex存在チェック
     * @param params 条件
     * @return 件数
     */
    int lineIndexExistCheck(@Param("params") Map<String, Object> params);

    /**
     * 共用電話チェック
     * @param params 条件
     * @return 件数
     */
    int telSharedUseCheck(@Param("params") Map<String, Object> params);

    /**
     * 電話ライン紐付き存在チェック
     * @param params 条件
     * @return 件数
     */
    int telLineExistCheck(@Param("params") Map<String, Object> params);

    /**
     * 電話機に該当するラインがシェアードラインか確認
     * @param params 条件
     * @return 件数
     */
    int telSharedLineCheck(@Param("params") Map<String, Object> params);

    /* #### その他 #### */

    /**
     * 電話番号を取得
     * @param params 条件
     * @return 内線番号(Optional)
     */
    Optional<String> getTelephoneNumber(@Param("params") Map<String, Object> params);

    /**
     * ラインIDを取得
     * @param directoryNumber 内線番号
     * @return ラインID(Optional)
     */
    Optional<BigDecimal> getLineId(@Param("directoryNumber") String directoryNumber);

    /**
     * ラインの削除フラグを取得
     * @param directoryNumber 内線番号
     * @return ラインの削除フラグ(Optional)
     */
    Optional<Map<String, Object>> getLineDeleteFlg(@Param("directoryNumber") String directoryNumber);

    /**
     * CSSの取得
     * @param params 条件
     * @return CSS(Optional)
     */
    Optional<String> getCssConditionsLineString(@Param("params") Map<String, Object> params);

    /**
     * 電話機に紐づくラインを取得
     * @param params 条件
     * @return ライン情報
     */
    List<Map<String, Object>> getLineLinkedTel(@Param("params") Map<String, Object> params);

    /**
     * 電話機に紐づくユーザーを取得
     * @param params 条件
     * @return ユーザー情報
     */
    List<Map<String, Object>> getUserLinkedTel(@Param("params") Map<String, Object> params);

    /**
     * 話中転送先階層の取得
     * @param params 話中転送先
     * @return 話中転送先階層
     */
    String[] getBusyDestinationClass(@Param("params") Map<String, Object> params);

    /**
     * 話中転送先階層の取得(逆階層)
     * @param params 話中転送先
     * @return 話中転送先階層
     */
    String[] getBusyDestinationReverseClass(@Param("params") Map<String, Object> params);

    /**
     * ラインに紐づく拠点の取得
     * @param params ラインId
     * @return 拠点Id
     */
    String[] getSharedLineBranch(@Param("params") Map<String, Object> params);

    /**
     * ラインに紐づく拠点の取得(条件内線番号)
     * @param params ラインId
     * @return 拠点Id
     */
    String[] getSharedLineBranchDirNum(@Param("params") Map<String, Object> params);

    /**
     * 転送先のライン情報を取得
     * @param params 内線番号
     * @return ライン情報(Optional)
     */
    Optional<Map<String, Object>> getBusyDestinationInfo(@Param("params") Map<String, Object> params);

    /**
     * パスワードの有効チェック
     * @param params 条件
     * @return チェック結果
     */
    boolean checkPasswordLifetime(@Param("params") Map<String, Object> params);

    /**
     * クラスターIDの取得
     * @param branchId 拠点ID
     * @return クラスターID(Optional)
     */
    Optional<BigDecimal> getClusterId(@Param("branchId") String branchId);

    /**
     * ユーザの最大値店部課値の取得
     * @param params 条件
     * @return 店部課情報(Optional)
     */
    Optional<Map<String, Object>> getMaxUserSection(@Param("params") Map<String, Object> params);
}


```
