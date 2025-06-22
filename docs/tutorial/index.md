# 開発ページ

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE mapper PUBLIC "-//mybatis.org//DTD Mapper 3.0//EN"
        "http://mybatis.org/dtd/mybatis-3-mapper.dtd">

<mapper namespace="com.example.orgchart_api.batch.persistence.LoadStaffMapper">

    <!-- Vacuum操作: ステージングテーブル追加 -->
    <update id="vacuum">
        VACUUM (VERBOSE ,ANALYZE) stg_ad;
        VACUUM (VERBOSE ,ANALYZE) stg_department;
        VACUUM (VERBOSE ,ANALYZE) stg_employee;
        VACUUM (VERBOSE ,ANALYZE) stg_organization;
        VACUUM (VERBOSE ,ANALYZE) stg_shift;
        VACUUM (VERBOSE ,ANALYZE) app_user;
        VACUUM (VERBOSE ,ANALYZE) r_user_section;
    </update>


    <!-- CSV 取込系: ステージングテーブルを使用 -->
    <insert id="insertStgAd" parameterType="Map">
        insert into stg_ad(
            user_logon_name, display_name, last_name,
            first_name, mail, position_name, deleted
        )
        values(
                  #{USER_LOGON_NAME},
                  #{DISPLAY_NAME},
                  #{LAST_NAME},
                  #{FIRST_NAME},
                  #{MAIL},
                  #{JOB_POSITION},
                  FALSE  -- 常にfalseで挿入
              )
    </insert>

    <!-- ビジネステーブルへのマージ処理-論理削除フラグを含むUPSERT処理 -->
    <insert id="mergeBizAd" parameterType="Map">
        INSERT INTO biz_ad (
        user_logon_name, display_name, last_name, first_name,
        mail, position_name, create_date, update_date, update_user, deleted
        )
        SELECT
        login_nm,
        disp_nm,
        last_nm,
        first_nm,
        mail,
        position,
        CURRENT_TIMESTAMP,
        CURRENT_TIMESTAMP,
        'BATCH',
        deleted  <!-- 削除フラグ転送 -->
        FROM stg_ad
        ON CONFLICT (user_logon_name) DO UPDATE
        SET
        display_name = EXCLUDED.display_name,
        last_name = EXCLUDED.last_name,
        first_name = EXCLUDED.first_name,
        mail = EXCLUDED.mail,
        position_name = EXCLUDED.position_name,
        update_date = EXCLUDED.update_date,
        update_user = EXCLUDED.update_user,
        deleted = EXCLUDED.deleted  <!-- 削除フラグ更新 -->
    </insert>

    <!-- 存在しないレコードの論理削除-->
    <update id="logicalDeleteMissingAdUsers" parameterType="Map">
        UPDATE biz_ad
        SET
        deleted = TRUE,
        update_date = CURRENT_TIMESTAMP,
        update_user = 'BATCH'
        WHERE
        user_logon_name NOT IN (SELECT login_nm FROM stg_ad)
        AND deleted = FALSE  <!-- 未削除レコードのみ更新 -->
    </update>

    <insert id="insertStgDepartment" parameterType="Map">
        INSERT INTO stg_department(
        organization_cd, company_cd, company_nm,
        control_cd, control_nm, charge_cd, charge_nm,
        parent_department_cd, parent_department_nm,
        department_cd, department_nm, department_nm_en,
        zip_cd, address, telephone_no, fax_no, extension_no,
        class_sales, class_data_input,
        print_order,  <!-- 追加 -->
        update_date
        )
        VALUES(
        #{ORGANIZATION_CD}, #{COMPANY_CD}, #{COMPANY_NM},
        #{CONTROL_CD}, #{CONTROL_NM}, #{CHARGE_CD}, #{CHARGE_NM},
        #{PARENT_DEPARTMENT_CD}, #{PARENT_DEPARTMENT_NM},
        #{DEPARTMENT_CD}, #{DEPARTMENT_NM}, #{DEPARTMENT_NM_EN},
        #{ZIP_CD}, #{ADDRESS}, #{TELEPHONE_NO}, #{FAX_NO}, #{EXTENSION_NO},
        #{CLASS_SALES}, #{CLASS_DATA_INPUT},

        <!-- 追加1: print_order生成 (部門コードの下4桁をゼロ埋め) -->
        LPAD(RIGHT(#{DEPARTMENT_CD}, 4), 4, '0'),

        <!-- 追加2: update_dateの書式修正 -->
        TO_TIMESTAMP(#{UPDATE_DATE}, 'YYYY-MM-DD HH24:MI:SS')
        )
    </insert>


    <insert id="insertStgEmployee" parameterType="Map">
        insert into
            stg_employee(organization_cd,company_cd,department_cd,department_nm,employee_cd,
                         employee_nm_kanji,employee_nm_kana,executive_post_cd,post_lineage_cd,class,sex_cd,
                         birthday,mail_address,assign_grade,class_tel_addressbook,class_temporary_transfer,
                         mail_address_automade_flg,class_data_input,update_date)
        values(#{ORGANIZATION_CD},#{COMPANY_CD},#{DEPARTMENT_CD},#{DEPARTMENT_NM},
               #{EMPLOYEE_CD},#{EMPLOYEE_NM_KANJI},#{EMPLOYEE_NM_KANA},#{EXECUTIVE_POST_CD},
               #{POST_LINEAGE_CD},#{CLASS},#{SEX_CD},#{BIRTHDAY},#{MAIL_ADDRESS},#{ASSIGN_GRADE},
               #{CLASS_TEL_ADDRESSBOOK},#{CLASS_TEMPORARY_TRANSFER},#{MAIL_ADDRESS_AUTOMADE_FLG},
               #{CLASS_DATA_INPUT}, to_timestamp(#{UPDATE_DATE},'YYYYMMDDHH24MISS')::timestamp without time zone)
    </insert>


    <insert id="insertStgOrganization" parameterType="Map">
        insert into
            stg_organization(organization_cd, organization_nm, organization_no,
                             organization_abbreviated_nm, print_order, class_sales, class_data_input, update_date)
        values(#{ORGANIZATION_CD},#{ORGANIZATION_NM},#{ORGANIZATION_NO},
               #{ORGANIZATION_ABBREVIATED_NM},#{PRINT_ORDER},#{CLASS_SALES},#{CLASS_DATA_INPUT},
               to_timestamp(#{UPDATE_DATE},'YYYYMMDDHH24MISS')::timestamp without time zone)
    </insert>


    <insert id="insertStgShift" parameterType="Map">
        INSERT INTO biz_shift (
            old_branch_cd, old_company_cd, old_department_cd,
            new_branch_cd, new_company_cd, new_department_cd
        )
        VALUES (
                   #{OLD_BRANCH_CD},
                   #{OLD_COMPANY_CD},
                   #{OLD_DEPARTMENT_CD},
                   #{NEW_BRANCH_CD},
                   #{NEW_COMPANY_CD},
                   #{NEW_DEPARTMENT_CD}
               )
    </insert>

    <!-- 取込前削除: ステージングテーブル操作 -->
    <delete id="deleteStgAd" parameterType="Map">
        delete from stg_ad;
    </delete>
    <delete id="deleteStgDepartment" parameterType="Map">
        delete from stg_department;
    </delete>
    <delete id="deleteStgEmployee" parameterType="Map">
        delete from stg_employee;
    </delete>
    <delete id="deleteStgOrganization" parameterType="Map">
        delete from stg_organization;
    </delete>
    <delete id="deleteStgShift" parameterType="Map">
        DELETE FROM stg_shift;
    </delete>

    <!-- DUM テーブル除外系: ステージングテーブル参照 -->
    <delete id="deleteDumOrganization" parameterType="Map">
        delete from biz_organization
        where organization_cd in (select organization_cd from stg_organization)
    </delete>
    <delete id="deleteDumDepartment" parameterType="Map">
        delete from biz_department
        where (company_cd, department_cd) in (
            select company_cd, department_cd from stg_department
        );
        delete from biz_department where company_cd not in ('001', '002');
    </delete>
    <delete id="deleteDumEmployee" parameterType="Map">
        delete from biz_employee
        where (company_cd, employee_cd, assign_grade) in (
            select company_cd, employee_cd, assign_grade from stg_employee
        );
        delete from biz_employee where company_cd not in ('001', '002');
        delete from biz_employee where executive_post_cd in (
            select executive_post_cd from tmp_executive
        );
    </delete>
    <delete id="deleteDumShift" parameterType="Map">
        DELETE FROM biz_shift
        WHERE (old_branch_cd, old_company_cd, old_department_cd) IN (
            SELECT old_branch_cd, old_company_cd, old_department_cd
            FROM stg_shift
        )
    </delete>

    <!-- 例: 修正が必要な参照箇所の対応 -->
    <!-- stg_テーブルを参照する必要がある箇所を修正 -->
    <select id="selAdditionUserDetail" resultType="Map">
        select
            '0' as user_role,
            '0' as enabled_shared_use,
            case
                when stg_ad.position_name = '_社員' then '1'
                when stg_ad.position_name = '_派遣社員' then '0'
                end as fulltime_employee,
            case
                when stg_ad.POSITION = '_社員' THEN biz_employee.birthday
                when stg_ad.POSITION = '_派遣社員' THEN CONCAT('0', biz_employee.employee_cd)
                end as login_password,
            biz_employee.employee_cd AS login_id,
            biz_employee.employee_cd AS biz_employee_id,
            biz_employee.employee_cd AS cucm_login_id,
            biz_employee.employee_nm_kanji,
            biz_employee.employee_nm_kana,
            biz_employee.birthday,
            COALESCE(stg_ad.first_nm, biz_employee.employee_cd) AS first_name,
            COALESCE(stg_ad.last_nm, biz_employee.employee_cd) AS last_name,
            biz_employee.department_nm
        from
            biz_employee
                left outer join stg_ad ON biz_employee.employee_cd = stg_ad.login_nm
        where employee_cd = #{employee_cd}
            limit 1
    </select>
    <!-- 全体的な修正方針 -->
    <!-- 1. CSV取込処理: stg_テーブル操作 -->
    <!-- 2. ビジネスロジック: biz_テーブル操作（変更なし） -->
    <!-- 3. データ移行処理: stg_ → biz_ の処理（変更なし） -->

    <!-- 閾値取得 -->
    <select id="selectThreshold" parameterType="Map"
            resultType="Map">
        select threshold_value from threshold limit 1
    </select>

    <!-- 閾値(入社)取得 -->
    <select id="selectEnterEmployee" resultType="Map">
        select distinct
            employee_cd
        from biz_employee
        where employee_cd not in
              (select
                   biz_employee_id from app_user)
    </select>
    <select id="selectEnterCount" resultType="int">
        SELECT COUNT(DISTINCT employee_cd)
        FROM biz_employee
        WHERE employee_cd NOT IN (
            SELECT biz_employee_id FROM app_user
        )
    </select>

    <!-- 閾値(退社)取得 -->
    <select id="selectRetireEmployee" resultType="Map">
        SELECT DISTINCT biz_employee_id
        FROM app_user
        WHERE biz_employee_id NOT IN (
            SELECT employee_cd FROM biz_employee
        )
          AND enabled_shared_use != '1'
        AND deleted = FALSE
    </select>
    <select id="selectRetireCount" resultType="int">
        SELECT COUNT(DISTINCT app_user_id)
        FROM app_user
        WHERE biz_employee_id NOT IN (
            SELECT employee_cd FROM biz_employee
        )
          AND enabled_shared_use != '1'
        AND deleted = FALSE
    </select>

    <!-- 閾値(異動)取得 -->
    <select id="selectChangeEmployee" resultType="Map">
        SELECT
            A.biz_employee_id,
            R.company_id,
            R.section_id
        FROM app_user A
                 JOIN r_user_section R ON A.app_user_id = R.app_user_id
        WHERE A.biz_employee_id IN (
            SELECT employee_cd FROM biz_employee
        )
          AND (A.biz_employee_id, R.company_id, LPAD(R.section_id::TEXT, 5, '0')) NOT IN (
            SELECT employee_cd, company_cd, LPAD(department_cd, 5, '0')
            FROM biz_employee
        )
    </select>
    <select id="selectChangeCount" resultType="int">
        SELECT COUNT(*)
        FROM (
                 SELECT A.biz_employee_id, R.company_id, R.section_id
                 FROM app_user A
                          JOIN r_user_section R ON A.app_user_id = R.app_user_id
                 WHERE A.biz_employee_id IN (
                     SELECT employee_cd FROM biz_employee
                 )
                   AND (A.biz_employee_id, R.company_id, LPAD(R.section_id::TEXT, 5, '0')) NOT IN (
                     SELECT employee_cd, company_cd, LPAD(department_cd, 5, '0')
                     FROM biz_employee
                 )
             ) AS ChangeCnt
    </select>

    <!-- CSV 取込系 -->

    <insert id="insertBizAD" parameterType="Map">
        insert into
            stg_ad(login_nm, disp_nm, last_nm, first_nm, mail, position)
        values(#{LOGIN_NM},#{DISP_NM},#{LAST_NM},#{FIRST_NM},#{MAIL},#{POSITION
		})
    </insert>

    <insert id="insertBizDepartment" parameterType="Map">
        INSERT INTO biz_department(
        organization_cd, company_cd, company_nm,
        control_cd, control_nm, charge_cd, charge_nm,
        parent_department_cd, parent_department_nm,
        department_cd, department_nm, department_nm_en,
        zip_cd, address, telephone_no, fax_no, extension_no,
        class_sales, class_data_input, print_order, update_date
        )
        VALUES(
        #{ORGANIZATION_CD}, #{COMPANY_CD}, #{COMPANY_NM},
        #{CONTROL_CD}, #{CONTROL_NM}, #{CHARGE_CD}, #{CHARGE_NM},
        #{PARENT_DEPARTMENT_CD}, #{PARENT_DEPARTMENT_NM},
        #{DEPARTMENT_CD}, #{DEPARTMENT_NM}, #{DEPARTMENT_NM_EN},
        #{ZIP_CD}, #{ADDRESS}, #{TELEPHONE_NO}, #{FAX_NO}, #{EXTENSION_NO},
        #{CLASS_SALES}, #{CLASS_DATA_INPUT},

        <!-- print_order生成: 部門コードの下4桁をゼロ埋め -->
        LPAD(RIGHT(#{DEPARTMENT_CD}, 4), 4, '0'),

        <!-- update_date変換: 文字列→TIMESTAMP -->
        to_timestamp(#{UPDATE_DATE}, 'YYYY-MM-DD HH24:MI:SS')
        )
    </insert>

    <insert id="insertBizEmployee" parameterType="Map">
        insert into
            biz_employee(organization_cd,company_cd,department_cd,department_nm,employee_cd,employee_nm_kanji,employee_nm_kana,executive_post_cd,post_lineage_cd,class,sex_cd,birthday,mail_address,assign_grade,class_tel_addressbook,class_temporary_transfer,mail_address_automade_flg,class_data_input,update_date)
        values(#{ORGANIZATION_CD},#{COMPANY_CD},#{DEPARTMENT_CD},#{DEPARTMENT_NM},
               #{EMPLOYEE_CD},#{EMPLOYEE_NM_KANJI},#{EMPLOYEE_NM_KANA},#{EXECUTIVE_POST_CD},
               #{POST_LINEAGE_CD},#{CLASS},#{SEX_CD},#{BIRTHDAY},#{MAIL_ADDRESS},#{ASSIGN_GRADE},
               #{CLASS_TEL_ADDRESSBOOK},#{CLASS_TEMPORARY_TRANSFER},#{MAIL_ADDRESS_AUTOMADE_FLG},#{CLASS_DATA_INPUT}, to_timestamp(#{UPDATE_DATE},'YYYYMMDDHH24MISS')::timestamp without time zone)
    </insert>

    <insert id="insertBizOrganization" parameterType="Map">
        insert into
            biz_organization(organization_cd, organization_nm, organization_no, organization_abbreviated_nm, print_order, class_sales, class_data_input, update_date)
        values(#{ORGANIZATION_CD},#{ORGANIZATION_NM},#{ORGANIZATION_NO},
               #{ORGANIZATION_ABBREVIATED_NM},#{PRINT_ORDER},#{CLASS_SALES},#{CLASS_DATA_INPUT},to_timestamp(#{UPDATE_DATE},'YYYYMMDDHH24MISS')::timestamp without time zone)
    </insert>

    <!-- 取込前削除 -->
    <delete id="deleteBizAD" parameterType="Map">
        delete from biz_ad;
    </delete>
    <delete id="deleteBizDepartment" parameterType="Map">
        delete from
            biz_department;
    </delete>
    <delete id="deleteBizEmployee" parameterType="Map">
        delete from
            biz_employee;
    </delete>
    <delete id="deleteBizOrganization" parameterType="Map">
        delete from
            biz_organization;
    </delete>
    <!-- BIZ_SHIFTテーブル全削除 -->
    <delete id="deleteBizShift">
        DELETE FROM biz_shift
    </delete>
    <!-- M_Section追加更新 -->
    <select id="selNotExistMSection" resultType="Map">
        select
            company_cd,
            department_cd
        from
            biz_department
        where
            (company_cd, department_cd) not in (
                select
                    company_cd,
                    LPAD(section_cd::TEXT, 5, '0')
                from
                    mst_section
            )
    </select>

    <select id="selExistMSection" resultType="Map">
        select
            company_cd,
            department_cd
        from
            biz_department
        where
            (company_cd, department_cd) in (
                select
                    company_cd,
                    LPAD(section_cd::TEXT, 5, '0')
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
             from biz_department as D inner join biz_organization as O
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
        from biz_department as D inner join biz_organization as O
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
               from biz_employee)
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
                               deleted = true,
                               lastupdate_datetime = now()
        where app_user_id = #{user_id}
    </update>

    <update id="updDelEmpRUserPhone" parameterType="Map">
        update
            rel_cucm_user_phone set
                                    delete = true,
                                    update_date = now()
        where user_id = #{user_id}
    </update>

    <update id="updDelEmpTelDir" parameterType="Map">
        update
            tel_dir_association set
                                    deleted = true,
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
            delete = true,
            update_status= '1',
            update_date = now()
        where phone_id = #{phoneId}
    </update>


    <!-- 社員追加 -->
    <select id="selAdditionUsers" resultType="Map">
        select distinct
            employee_cd
        from biz_employee
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
                when stg_ad.position = '_社員' then '1'
                when stg_ad.position = '_派遣社員' then '0'
                end as fulltime_employee,
            case
                when stg_ad.POSITION = '_社員' THEN biz_employee.birthday
                when stg_ad.POSITION = '_派遣社員' THEN CONCAT('0', biz_employee.employee_cd)
                end as login_password,
            biz_employee.employee_cd AS login_id,
            biz_employee.employee_cd AS biz_employee_id,
            biz_employee.employee_cd AS cucm_login_id,
            biz_employee.employee_nm_kanji,
            biz_employee.employee_nm_kana,
            biz_employee.birthday,
            COALESCE(stg_ad.first_nm, biz_employee.employee_cd) AS first_name,
            COALESCE(stg_ad.last_nm, biz_employee.employee_cd) AS last_name,
            biz_employee.department_nm
        from
            biz_employee
                left outer join
            stg_ad
            ON  biz_employee.employee_cd = stg_ad.login_nm
        where
            employee_cd = (
                select distinct
                    employee_cd
                from
                    biz_employee
                where
                    employee_cd =#{employee_cd}
            )
            limit 1
    </select>

    <insert id="insAdditionUserDetail" parameterType="Map">
        INSERT INTO trn_user (
            company_cd, employee_cd, user_nm, user_nm_kana, mail_address,
            password_hash, password_salt, pin, birthday,
            voice_mail_profile_id, pickup_group_id, deleted,
            create_date, update_date, update_user
        )
        SELECT
            be.company_cd,
            be.employee_cd,
            be.employee_nm_kanji,
            be.employee_nm_kana,
            be.mail_address,
            '' AS password_hash,
            '' AS password_salt,
            '12345678' AS pin,
            be.birthday,
            NULL AS voice_mail_profile_id,
            NULL AS pickup_group_id,
            FALSE AS deleted,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            'BATCH'
        FROM biz_employee be
                 LEFT JOIN stg_ad sa ON be.employee_cd = sa.user_logon_name
        WHERE be.employee_cd = #{employee_cd}
    </insert>

    <!-- 社員 更新 -->
    <select id="selExistAppUser" resultType="Map">
        select distinct
            employee_cd
        from
            biz_employee
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
                    biz_employee emp
                        left outer join
                    stg_ad ad
                    on  emp.employee_cd = ad.login_nm
                where
                    emp.employee_cd = (
                        select distinct
                            employee_cd
                        from
                            biz_employee
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
        SELECT DISTINCT
            be.company_cd,
            be.department_cd,
            be.employee_cd
        FROM biz_employee be
                 JOIN trn_user au ON be.employee_cd = au.employee_cd
        WHERE LPAD(be.department_cd, 5, '0') NOT IN (
            SELECT LPAD(section_id::TEXT, 5, '0')
            FROM rel_user_section rus
            WHERE rus.user_id = au.user_id
        )
        ORDER BY 1,2,3
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
             from biz_employee E inner join trn_user A on E.employee_cd = A.biz_employee_id
                                 inner join biz_organization O on E.organization_cd = O.Organization_cd
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
            biz_employee E
                INNER JOIN mst_section M ON E.department_cd = M.section_cd
                INNER JOIN trn_user A ON E.employee_cd = A.biz_employee_id
                INNER JOIN rel_user_section R ON A.user_id = R.user_id
                INNER JOIN biz_organization O ON E.organization_cd = O.Organization_cd
        WHERE
            E.company_cd = #{companyCode}
          AND LPAD(E.department_cd, 5, '0') = #{departmentCode}
          AND E.employee_cd = #{employeeCode}
    </select>

    <insert id="insAdditionUserSection" parameterType="Map">
        INSERT INTO rel_user_section (
            user_id, section_id, create_date, update_date, update_user
        )
        SELECT
            au.user_id,
            ms.section_id,
            CURRENT_TIMESTAMP,
            CURRENT_TIMESTAMP,
            'BATCH'
        FROM trn_user au
                 JOIN biz_employee be ON au.employee_cd = be.employee_cd
                 JOIN mst_section ms
                      ON ms.company_cd = be.company_cd
                          AND LPAD(ms.section_cd::TEXT, 5, '0') = LPAD(be.department_cd, 5, '0')
        WHERE be.employee_cd = #{employeeCode}
            LIMIT 1
    </insert>


    <!-- USER_SECTION 更新 -->
    <select id="selExistDeptChk" resultType="Map">
        select
            distinct be.company_cd,
                     be.department_cd,
                     be.employee_cd
        from
            biz_employee be
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
             from biz_employee E inner join biz_organization O
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
             from biz_employee)
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
          AND rel_cucm_user_phone.delete != true;

    </select>

    <delete id="deleteUserSection" parameterType="Map">
        delete from
            rel_user_section
        where user_id = cast(#{appUserId} as integer)
          and lpad(cast(section_id as text), 5, '0') =
              lpad(#{sectionId},5,'0')
    </delete>

    <update id="updDelUserSection" parameterType="Map">
        UPDATE rel_user_section
        SET deleted = TRUE,
            update_date = CURRENT_TIMESTAMP
        WHERE user_id = CAST(#{appUserId} AS INTEGER)
          AND section_id = CAST(#{sectionId} AS INTEGER)
    </update>


    <!-- 拠点統廃合 -->
    <select id="selShiftOrganization" resultType="Map">
        SELECT DISTINCT
            old_branch_cd,
            old_company_cd,
            old_department_cd,
            new_branch_cd,
            new_company_cd,
            new_department_cd
        FROM biz_shift
    </select>

    <!-- 廃止所属社員 -->
    <select id="selDelAffiliationUser" resultType="Map" parameterType="Map">
        SELECT DISTINCT
            au.app_user_id,
            au.biz_employee_id
        FROM app_user au
                 JOIN r_user_section rus ON au.app_user_id = rus.app_user_id
        WHERE rus.company_id = #{companyId}
          AND rus.section_id = LPAD(#{sectionId}, 5, '0')
          AND au.deleted = FALSE
          AND rus.deleted = FALSE
    </select>

    <select id="selUserSectionCnt" resultType="int"
            parameterType="Map">
        select count(1)
        from biz_employee
        where employee_cd =
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
        from biz_employee E inner join app_user A on E.employee_cd =
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
            tu.user_nm AS last_nm,
            '' AS first_nm, -- 名情報がないため空設定
            REPLACE(tu.telephone_no, '_', '') AS telephone_no,
            LOWER(tu.user_nm) AS full_name
        FROM trn_user tu
                 JOIN rel_cucm_user_phone rcup ON tu.user_id = rcup.user_id
                 JOIN rel_user_section rus ON tu.user_id = rus.user_id
        WHERE rcup.deleted = TRUE
          AND rus.deleted = TRUE
        ORDER BY tu.telephone_no ASC;
    </select>

    <!-- 新入者リスト -->
    <select id="selAllAddUserList" resultType="Map" parameterType="String">
        SELECT
            user_nm AS last_nm,
            '' AS first_nm, -- 名情報がないため空設定
            REPLACE(telephone_no, '-', '') AS telephone_no,
            LOWER(user_nm) AS full_name
        FROM trn_user
        WHERE employee_cd = #{employeeId}
        ORDER BY telephone_no ASC;
    </select>

</mapper>
```
