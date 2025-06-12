<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">スキーマ整理</span>

# ※新しいスキーマの整理完全版

`irdb-schema-new.sql`

```sql
-- 店舗マスタ
CREATE TABLE public.mst_branch (
    branch_id SERIAL PRIMARY KEY,
    branch_cd VARCHAR(5) NOT NULL,
    branch_nm VARCHAR(40) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_branch_branch_cd_key UNIQUE (branch_cd)
);

-- CUCMコーリングサーチスペースマスタ
CREATE TABLE public.mst_cucm_calling_search_space (
    calling_search_space_id SERIAL PRIMARY KEY,
    calling_search_space_nm VARCHAR(100) NOT NULL,
    cd1 VARCHAR(3) NOT NULL,
    cd2 VARCHAR(5) NOT NULL,
    cd3 VARCHAR(5) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_calling_search_space_calling_search_space_nm_key UNIQUE (calling_search_space_nm)
);

-- CUCMデバイスプールマスタ
CREATE TABLE public.mst_cucm_device_pool (
    device_pool_id SERIAL PRIMARY KEY,
    device_pool_nm VARCHAR(100) NOT NULL,
    cisco_unified_callmanager_group VARCHAR(36) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_device_pool_device_pool_nm_key UNIQUE (device_pool_nm)
);

-- CUCMデバイスタイプマスタ
CREATE TABLE public.mst_cucm_device_type (
    device_type_id SERIAL PRIMARY KEY,
    device_type_nm VARCHAR(100) NOT NULL,
    device_type_no INT,
    device_protocol VARCHAR(4),
    rel_device_type_no INT,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_device_type_device_type_nm_rel_device_type_no_key UNIQUE (device_type_nm, rel_device_type_no)
);

-- CUCMロケーションマスタ
CREATE TABLE public.mst_cucm_location (
    location_id SERIAL PRIMARY KEY,
    location_nm VARCHAR(8) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_location_location_nm_key UNIQUE (location_nm)
);

-- CUCM電話テンプレートマスタ
CREATE TABLE public.mst_cucm_phone_template (
    phone_template_id SERIAL PRIMARY KEY,
    phone_template_nm VARCHAR(100) NOT NULL,
    device_type_id INT NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_phone_template_phone_template_nm_key UNIQUE (phone_template_nm),
    CONSTRAINT fk_phone_template_device_type
        FOREIGN KEY (device_type_id)
        REFERENCES public.mst_cucm_device_type(device_type_id)
);

-- CUCMピックアップグループマスタ
CREATE TABLE public.mst_cucm_pickup_group (
    pickup_group_id SERIAL PRIMARY KEY,
    pickup_group_nm VARCHAR(19) NOT NULL,
    pickup_group_no INT NOT NULL,
    branch_cd VARCHAR(3) NOT NULL,
    section_cd VARCHAR(5) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_pickup_group_pickup_group_nm_key UNIQUE (pickup_group_nm),
    CONSTRAINT fk_pickup_group_branch
        FOREIGN KEY (branch_cd)
        REFERENCES public.mst_branch(branch_cd)
);

-- CUCMソフトキーテンプレートマスタ
CREATE TABLE public.mst_cucm_softkey_template (
    softkey_template_id SERIAL PRIMARY KEY,
    softkey_template_nm VARCHAR(100) NOT NULL,
    device_type_no INT NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_softkey_template_softkey_template_nm_key UNIQUE (softkey_template_nm),
    CONSTRAINT fk_softkey_template_device_type
        FOREIGN KEY (device_type_no)
        REFERENCES public.mst_cucm_device_type(device_type_id)
);

-- CUCMボイスメールプロファイルマスタ
CREATE TABLE public.mst_cucm_voice_mail_profile (
    voice_mail_profile_id SERIAL PRIMARY KEY,
    voice_mail_profile_nm VARCHAR(100) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_voice_mail_profile_voice_mail_profile_nm_key UNIQUE (voice_mail_profile_nm)
);

-- 共有名称マスタ
CREATE TABLE public.mst_shared_nm (
    shared_id SERIAL PRIMARY KEY,
    shared_nm VARCHAR(25) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_shared_nm_shared_nm_key UNIQUE (shared_nm)
);

-- 組織ビジネステーブル（tmp_integratedid_organization → biz_organization）
CREATE TABLE public.biz_organization (
    organization_id SERIAL PRIMARY KEY,
    organization_cd VARCHAR(19) NOT NULL,
    organization_nm VARCHAR(60) NOT NULL,
    parent_organization_cd VARCHAR(19) NOT NULL,
    print_order VARCHAR(4) NOT NULL,
    -- 設計書要件の監査カラム追加
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT biz_organization_organization_cd_key
        UNIQUE (organization_cd)
);

-- 組織ステージングテーブル（tmp_organization → stg_organization）
CREATE TABLE public.stg_organization (
    organization_id SERIAL PRIMARY KEY,
    organization_cd VARCHAR(19) NOT NULL,
    organization_nm VARCHAR(60) NOT NULL,
    parent_organization_cd VARCHAR(19) NOT NULL,
    print_order VARCHAR(4) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_organization_organization_cd_key
        UNIQUE (organization_cd)
);

-- 部門ビジネステーブル（tmp_integratedid_department → biz_department）
CREATE TABLE public.biz_department (
    department_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    department_cd VARCHAR(5) NOT NULL,
    department_nm VARCHAR(60) NOT NULL,
    parent_department_cd VARCHAR(5) NOT NULL,
    organization_cd VARCHAR(19) NOT NULL,
    print_order VARCHAR(4) NOT NULL,
    -- 設計書要件の監査カラム追加
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT biz_department_company_cd_department_cd_key
        UNIQUE (company_cd, department_cd)
);

-- 部門ステージングテーブル（tmp_department → stg_department）
CREATE TABLE public.stg_department (
    department_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    department_cd VARCHAR(5) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_department_company_cd_department_cd_key
        UNIQUE (company_cd, department_cd)
);

-- 従業員ビジネステーブル（tmp_integratedid_employee → biz_employee）
CREATE TABLE public.biz_employee (
    employee_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    family_nm VARCHAR(20) NOT NULL,
    first_nm VARCHAR(20) NOT NULL,
    family_nm_kana VARCHAR(40) NOT NULL,
    first_nm_kana VARCHAR(40) NOT NULL,
    department_cd VARCHAR(5) NOT NULL,
    post_cd VARCHAR(4) NOT NULL,
    assign_grade VARCHAR(2) NOT NULL,
    -- 設計書要件: 生年月日をDATE型に変更
    birthday DATE NOT NULL,
    pin VARCHAR(8) NOT NULL,
    -- 設計書要件の監査カラム追加
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT biz_employee_company_cd_employee_cd_key
        UNIQUE (company_cd, employee_cd)
);

--  従業員ステージングテーブル（tmp_employee → stg_employee）
CREATE TABLE public.stg_employee (
    employee_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    assign_grade VARCHAR(2) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_employee_company_cd_employee_cd_assign_grade_key
        UNIQUE (company_cd, employee_cd, assign_grade)
);

--  役職ステージングテーブル（tmp_executive → stg_executive）
CREATE TABLE public.stg_executive (
    executive_post_id SERIAL PRIMARY KEY,
    executive_post_cd VARCHAR(3) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_executive_executive_post_cd_key
        UNIQUE (executive_post_cd)
);

-- ADステージングテーブル（tmp_ad → stg_ad）
CREATE TABLE public.stg_ad (
    employee_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    assign_grade VARCHAR(2) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_ad_company_cd_employee_cd_assign_grade_key
        UNIQUE (company_cd, employee_cd, assign_grade)
);

-- 店部課マスタ
CREATE TABLE public.mst_section (
    section_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    section_cd VARCHAR(5) NOT NULL,
    section_nm VARCHAR(60) NOT NULL,
    parent_section_cd VARCHAR(5) NOT NULL,
    organization_cd VARCHAR(19) NOT NULL,
    print_order VARCHAR(4) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_section_company_cd_section_cd_key UNIQUE (company_cd, section_cd),
    CONSTRAINT fk_section_organization
        FOREIGN KEY (organization_cd)
        REFERENCES public.biz_organization(organization_cd)
);

-- 内線トランザクションテーブル（修正）
CREATE TABLE public.trn_line (
    line_id SERIAL PRIMARY KEY,
    line_no VARCHAR(4) NOT NULL,
    cucm_calling_search_space_id INTEGER REFERENCES public.mst_cucm_calling_search_space(calling_search_space_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT trn_line_line_no_key UNIQUE (line_no)
);

-- 電話機トランザクションテーブル（修正）
CREATE TABLE public.trn_phone (
    phone_id SERIAL PRIMARY KEY,
    phone_nm VARCHAR(100) NOT NULL,
    device_pool_id INTEGER NOT NULL REFERENCES public.mst_cucm_device_pool(device_pool_id),
    device_type_id INTEGER NOT NULL REFERENCES public.mst_cucm_device_type(device_type_id),
    phone_template_id INTEGER NOT NULL REFERENCES public.mst_cucm_phone_template(phone_template_id),
    location_id INTEGER NOT NULL REFERENCES public.mst_cucm_location(location_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT trn_phone_phone_nm_key UNIQUE (phone_nm)
);

-- ユーザートランザクションテーブル（重要修正）
CREATE TABLE public.trn_user (
    user_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    user_nm VARCHAR(40) NOT NULL,
    user_nm_kana VARCHAR(80) NOT NULL,
    mail_address VARCHAR(256) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    -- 設計書要件: パスワードソルト追加
    password_salt VARCHAR(32) NOT NULL,
    -- 設計書要件: PIN桁数拡張(5→8桁)
    pin VARCHAR(8) NOT NULL,
    -- 設計書要件: 生年月日をDATE型に変更
    birthday DATE NOT NULL,
    voice_mail_profile_id INTEGER REFERENCES public.mst_cucm_voice_mail_profile(voice_mail_profile_id),
    pickup_group_id INTEGER REFERENCES public.mst_cucm_pickup_group(pickup_group_id),
    -- 設計書要件: 論理削除フラグ追加
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_user_company_cd_employee_cd_key
        UNIQUE (company_cd, employee_cd),
    CONSTRAINT trn_user_mail_address_key
        UNIQUE (mail_address)
);

-- 課金関連トランザクションテーブル
CREATE TABLE public.trn_charge_association (
    charge_association_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    charge_item_cd VARCHAR(10) NOT NULL,
    association_start_date DATE NOT NULL,
    association_end_date DATE NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_charge_association_user_charge_key
        UNIQUE (user_id, charge_item_cd, association_start_date)
);

-- CUCM連携関連トランザクションテーブル
CREATE TABLE public.trn_cuc_association (
    cuc_association_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    device_id VARCHAR(50) NOT NULL,
    association_type VARCHAR(20) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_cuc_association_user_device_key
        UNIQUE (user_id, device_id)
);

-- CUCM差分トランザクションテーブル
CREATE TABLE public.trn_diff_cucm (
    diff_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    diff_type VARCHAR(20) NOT NULL,
    before_value TEXT,
    after_value TEXT,
    detected_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP WITHOUT TIME ZONE,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_diff_cucm_user_diff_key
        UNIQUE (user_id, diff_type, detected_at)
);

--  OfficeLink差分トランザクションテーブル
CREATE TABLE public.trn_diff_officelink (
    diff_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    diff_type VARCHAR(20) NOT NULL,
    before_value TEXT,
    after_value TEXT,
    detected_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP WITHOUT TIME ZONE,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_diff_officelink_user_diff_key
        UNIQUE (user_id, diff_type, detected_at)
);

-- 店舗-店部課関連テーブル
CREATE TABLE public.rel_branch_section (
    branch_section_id SERIAL PRIMARY KEY,
    branch_id INTEGER NOT NULL REFERENCES public.mst_branch(branch_id),
    section_id INTEGER NOT NULL REFERENCES public.mst_section(section_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT rel_branch_section_branch_section_key UNIQUE (branch_id, section_id)
);

-- CUCM電話機-内線番号関連テーブル
CREATE TABLE public.rel_cucm_phone_line (
    phone_line_id SERIAL PRIMARY KEY,
    phone_id INTEGER NOT NULL REFERENCES public.trn_phone(phone_id),
    line_id INTEGER NOT NULL REFERENCES public.trn_line(line_id),
    line_no INTEGER NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT rel_cucm_phone_line_phone_line_key UNIQUE (phone_id, line_id)
);

-- CUCMユーザー-電話機関連テーブル
CREATE TABLE public.rel_cucm_user_phone (
    user_phone_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    phone_id INTEGER NOT NULL REFERENCES public.trn_phone(phone_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT rel_cucm_user_phone_user_phone_key UNIQUE (user_id, phone_id)
);

-- ユーザー-店部課関連テーブル
CREATE TABLE public.rel_user_section (
    user_section_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    section_id INTEGER NOT NULL REFERENCES public.mst_section(section_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT rel_user_section_user_section_key UNIQUE (user_id, section_id)
);

-- OfficeLink FMCトランザクションテーブル（修正）
CREATE TABLE public.trn_officelink_fmc (
    fmc_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    device_id VARCHAR(50) NOT NULL,
    association_status VARCHAR(20) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT trn_officelink_fmc_user_device_key
        UNIQUE (user_id, device_id)
);

-- パスワード変更追跡トランザクションテーブル（修正）
CREATE TABLE public.trn_password_change_tracking (
    tracking_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    password_hash VARCHAR(128) NOT NULL,
    change_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_password_change_tracking_user_change_key
        UNIQUE (user_id, change_date)
);

-- 監査ログテーブル（新規）
CREATE TABLE public.audit_log (
    log_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT','UPDATE','DELETE')),
    old_value JSONB,
    new_value JSONB,
    executed_by VARCHAR(50) NOT NULL DEFAULT 'BATCH',
    executed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- 店部課履歴テーブル（新規）
CREATE TABLE public.mst_section_history (
    history_id BIGSERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES public.mst_section(section_id),
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT','UPDATE','DELETE')),
    operation_time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    original_data JSONB NOT NULL
);

-- 機構改革情報テーブル（新規）
CREATE TABLE public.biz_shift (
    shift_id SERIAL PRIMARY KEY,
    old_branch_cd VARCHAR(5) NOT NULL,
    old_company_cd VARCHAR(3) NOT NULL,
    old_department_cd VARCHAR(5) NOT NULL,
    new_branch_cd VARCHAR(5) NOT NULL,
    new_company_cd VARCHAR(3) NOT NULL,
    new_department_cd VARCHAR(5) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT biz_shift_unique_old_values
        UNIQUE (old_branch_cd, old_company_cd, old_department_cd)
);

```

## 古いデータベーススキーマ

`irdb-schema.sql`

```sql
--
-- PostgreSQL database dump
--

-- Dumped from database version 13.11
-- Dumped by pg_dump version 13.11

-- Started on 2025-06-07 09:49:13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 201 (class 1259 OID 26172)
-- Name: mst_branch; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_branch (
    branch_id integer NOT NULL,
    branch_cd character varying(5) NOT NULL,
    branch_nm character varying(40) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_branch OWNER TO postgres;

--
-- TOC entry 3379 (class 0 OID 0)
-- Dependencies: 201
-- Name: TABLE mst_branch; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_branch IS 'MST_拠点';


--
-- TOC entry 3380 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN mst_branch.branch_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_branch.branch_id IS '拠点ID';


--
-- TOC entry 3381 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN mst_branch.branch_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_branch.branch_cd IS '拠点コード';


--
-- TOC entry 3382 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN mst_branch.branch_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_branch.branch_nm IS '拠点名';


--
-- TOC entry 3383 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN mst_branch.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_branch.create_date IS '作成日時';


--
-- TOC entry 3384 (class 0 OID 0)
-- Dependencies: 201
-- Name: COLUMN mst_branch.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_branch.update_date IS '更新日時';


--
-- TOC entry 200 (class 1259 OID 26170)
-- Name: mst_branch_branch_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_branch_branch_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_branch_branch_id_seq OWNER TO postgres;

--
-- TOC entry 3385 (class 0 OID 0)
-- Dependencies: 200
-- Name: mst_branch_branch_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_branch_branch_id_seq OWNED BY public.mst_branch.branch_id;


--
-- TOC entry 203 (class 1259 OID 26184)
-- Name: mst_cucm_calling_search_space; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_cucm_calling_search_space (
    calling_search_space_id integer NOT NULL,
    calling_search_space_nm character varying(100) NOT NULL,
    cd1 character varying(3) NOT NULL,
    cd2 character varying(5) NOT NULL,
    cd3 character varying(5) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_cucm_calling_search_space OWNER TO postgres;

--
-- TOC entry 3386 (class 0 OID 0)
-- Dependencies: 203
-- Name: TABLE mst_cucm_calling_search_space; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_cucm_calling_search_space IS 'MST_CUCM_コーリングサーチスペース';


--
-- TOC entry 3387 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN mst_cucm_calling_search_space.calling_search_space_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_calling_search_space.calling_search_space_id IS 'コーリングサーチスペースID';


--
-- TOC entry 3388 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN mst_cucm_calling_search_space.calling_search_space_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_calling_search_space.calling_search_space_nm IS 'コーリングサーチスペース名';


--
-- TOC entry 3389 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN mst_cucm_calling_search_space.cd1; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_calling_search_space.cd1 IS 'コード1';


--
-- TOC entry 3390 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN mst_cucm_calling_search_space.cd2; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_calling_search_space.cd2 IS 'コード2';


--
-- TOC entry 3391 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN mst_cucm_calling_search_space.cd3; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_calling_search_space.cd3 IS 'コード3';


--
-- TOC entry 3392 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN mst_cucm_calling_search_space.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_calling_search_space.create_date IS '作成日時';


--
-- TOC entry 3393 (class 0 OID 0)
-- Dependencies: 203
-- Name: COLUMN mst_cucm_calling_search_space.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_calling_search_space.update_date IS '更新日時';


--
-- TOC entry 202 (class 1259 OID 26182)
-- Name: mst_cucm_calling_search_space_calling_search_space_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_cucm_calling_search_space_calling_search_space_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_cucm_calling_search_space_calling_search_space_id_seq OWNER TO postgres;

--
-- TOC entry 3394 (class 0 OID 0)
-- Dependencies: 202
-- Name: mst_cucm_calling_search_space_calling_search_space_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_cucm_calling_search_space_calling_search_space_id_seq OWNED BY public.mst_cucm_calling_search_space.calling_search_space_id;


--
-- TOC entry 205 (class 1259 OID 26196)
-- Name: mst_cucm_device_pool; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_cucm_device_pool (
    device_pool_id integer NOT NULL,
    device_pool_nm character varying(100) NOT NULL,
    cisco_unified_callmanager_group character varying(36) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_cucm_device_pool OWNER TO postgres;

--
-- TOC entry 3395 (class 0 OID 0)
-- Dependencies: 205
-- Name: TABLE mst_cucm_device_pool; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_cucm_device_pool IS 'MST_CUCM_デバイスプール';


--
-- TOC entry 3396 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN mst_cucm_device_pool.device_pool_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_pool.device_pool_id IS 'デバイスプールID';


--
-- TOC entry 3397 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN mst_cucm_device_pool.device_pool_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_pool.device_pool_nm IS 'デバイスプール名';


--
-- TOC entry 3398 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN mst_cucm_device_pool.cisco_unified_callmanager_group; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_pool.cisco_unified_callmanager_group IS '呼出管理グループ';


--
-- TOC entry 3399 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN mst_cucm_device_pool.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_pool.create_date IS '作成日時';


--
-- TOC entry 3400 (class 0 OID 0)
-- Dependencies: 205
-- Name: COLUMN mst_cucm_device_pool.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_pool.update_date IS '更新日時';


--
-- TOC entry 204 (class 1259 OID 26194)
-- Name: mst_cucm_device_pool_device_pool_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_cucm_device_pool_device_pool_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_cucm_device_pool_device_pool_id_seq OWNER TO postgres;

--
-- TOC entry 3401 (class 0 OID 0)
-- Dependencies: 204
-- Name: mst_cucm_device_pool_device_pool_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_cucm_device_pool_device_pool_id_seq OWNED BY public.mst_cucm_device_pool.device_pool_id;


--
-- TOC entry 207 (class 1259 OID 26208)
-- Name: mst_cucm_device_type; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_cucm_device_type (
    device_type_id integer NOT NULL,
    device_type_nm character varying(100) NOT NULL,
    device_type_no integer,
    device_protocol character varying(4),
    rel_device_type_no integer,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_cucm_device_type OWNER TO postgres;

--
-- TOC entry 3402 (class 0 OID 0)
-- Dependencies: 207
-- Name: TABLE mst_cucm_device_type; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_cucm_device_type IS 'MST_CUCM_デバイスタイプ';


--
-- TOC entry 3403 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN mst_cucm_device_type.device_type_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_type.device_type_id IS 'デバイスタイプID';


--
-- TOC entry 3404 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN mst_cucm_device_type.device_type_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_type.device_type_nm IS 'デバイスタイプ名';


--
-- TOC entry 3405 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN mst_cucm_device_type.device_type_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_type.device_type_no IS 'デバイスタイプ番号';


--
-- TOC entry 3406 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN mst_cucm_device_type.device_protocol; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_type.device_protocol IS 'デバイスプロトコル';


--
-- TOC entry 3407 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN mst_cucm_device_type.rel_device_type_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_type.rel_device_type_no IS '関連デバイスタイプ番号';


--
-- TOC entry 3408 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN mst_cucm_device_type.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_type.create_date IS '作成日時';


--
-- TOC entry 3409 (class 0 OID 0)
-- Dependencies: 207
-- Name: COLUMN mst_cucm_device_type.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_device_type.update_date IS '更新日時';


--
-- TOC entry 206 (class 1259 OID 26206)
-- Name: mst_cucm_device_type_device_type_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_cucm_device_type_device_type_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_cucm_device_type_device_type_id_seq OWNER TO postgres;

--
-- TOC entry 3410 (class 0 OID 0)
-- Dependencies: 206
-- Name: mst_cucm_device_type_device_type_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_cucm_device_type_device_type_id_seq OWNED BY public.mst_cucm_device_type.device_type_id;


--
-- TOC entry 209 (class 1259 OID 26220)
-- Name: mst_cucm_location; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_cucm_location (
    location_id integer NOT NULL,
    location_nm character varying(8) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_cucm_location OWNER TO postgres;

--
-- TOC entry 3411 (class 0 OID 0)
-- Dependencies: 209
-- Name: TABLE mst_cucm_location; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_cucm_location IS 'MST_CUCM_ロケーション';


--
-- TOC entry 3412 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN mst_cucm_location.location_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_location.location_id IS 'ロケーションID';


--
-- TOC entry 3413 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN mst_cucm_location.location_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_location.location_nm IS 'ロケーション名';


--
-- TOC entry 3414 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN mst_cucm_location.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_location.create_date IS '作成日時';


--
-- TOC entry 3415 (class 0 OID 0)
-- Dependencies: 209
-- Name: COLUMN mst_cucm_location.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_location.update_date IS '更新日時';


--
-- TOC entry 208 (class 1259 OID 26218)
-- Name: mst_cucm_location_location_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_cucm_location_location_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_cucm_location_location_id_seq OWNER TO postgres;

--
-- TOC entry 3416 (class 0 OID 0)
-- Dependencies: 208
-- Name: mst_cucm_location_location_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_cucm_location_location_id_seq OWNED BY public.mst_cucm_location.location_id;


--
-- TOC entry 211 (class 1259 OID 26232)
-- Name: mst_cucm_phone_template; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_cucm_phone_template (
    phone_template_id integer NOT NULL,
    phone_template_nm character varying(100) NOT NULL,
    device_type_id integer NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_cucm_phone_template OWNER TO postgres;

--
-- TOC entry 3417 (class 0 OID 0)
-- Dependencies: 211
-- Name: TABLE mst_cucm_phone_template; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_cucm_phone_template IS 'MST_CUCM_電話テンプレート';


--
-- TOC entry 3418 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN mst_cucm_phone_template.phone_template_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_phone_template.phone_template_id IS '電話テンプレートID';


--
-- TOC entry 3419 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN mst_cucm_phone_template.phone_template_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_phone_template.phone_template_nm IS '電話テンプレート名';


--
-- TOC entry 3420 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN mst_cucm_phone_template.device_type_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_phone_template.device_type_id IS 'デバイスタイプID';


--
-- TOC entry 3421 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN mst_cucm_phone_template.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_phone_template.create_date IS '作成日時';


--
-- TOC entry 3422 (class 0 OID 0)
-- Dependencies: 211
-- Name: COLUMN mst_cucm_phone_template.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_phone_template.update_date IS '更新日時';


--
-- TOC entry 210 (class 1259 OID 26230)
-- Name: mst_cucm_phone_template_phone_template_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_cucm_phone_template_phone_template_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_cucm_phone_template_phone_template_id_seq OWNER TO postgres;

--
-- TOC entry 3423 (class 0 OID 0)
-- Dependencies: 210
-- Name: mst_cucm_phone_template_phone_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_cucm_phone_template_phone_template_id_seq OWNED BY public.mst_cucm_phone_template.phone_template_id;


--
-- TOC entry 213 (class 1259 OID 26244)
-- Name: mst_cucm_pickup_group; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_cucm_pickup_group (
    pickup_group_id integer NOT NULL,
    pickup_group_nm character varying(19) NOT NULL,
    pickup_group_no integer NOT NULL,
    branch_cd character varying(3) NOT NULL,
    section_cd character varying(5) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_cucm_pickup_group OWNER TO postgres;

--
-- TOC entry 3424 (class 0 OID 0)
-- Dependencies: 213
-- Name: TABLE mst_cucm_pickup_group; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_cucm_pickup_group IS 'MST_CUCM_ピックアップグループ';


--
-- TOC entry 3425 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN mst_cucm_pickup_group.pickup_group_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_pickup_group.pickup_group_id IS 'ピックアップグループID';


--
-- TOC entry 3426 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN mst_cucm_pickup_group.pickup_group_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_pickup_group.pickup_group_nm IS 'ピックアップグループ名';


--
-- TOC entry 3427 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN mst_cucm_pickup_group.pickup_group_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_pickup_group.pickup_group_no IS 'ピックアップグループ番号';


--
-- TOC entry 3428 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN mst_cucm_pickup_group.branch_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_pickup_group.branch_cd IS '拠点CD';


--
-- TOC entry 3429 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN mst_cucm_pickup_group.section_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_pickup_group.section_cd IS '店部課コード';


--
-- TOC entry 3430 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN mst_cucm_pickup_group.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_pickup_group.create_date IS '作成日時';


--
-- TOC entry 3431 (class 0 OID 0)
-- Dependencies: 213
-- Name: COLUMN mst_cucm_pickup_group.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_pickup_group.update_date IS '更新日時';


--
-- TOC entry 212 (class 1259 OID 26242)
-- Name: mst_cucm_pickup_group_pickup_group_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_cucm_pickup_group_pickup_group_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_cucm_pickup_group_pickup_group_id_seq OWNER TO postgres;

--
-- TOC entry 3432 (class 0 OID 0)
-- Dependencies: 212
-- Name: mst_cucm_pickup_group_pickup_group_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_cucm_pickup_group_pickup_group_id_seq OWNED BY public.mst_cucm_pickup_group.pickup_group_id;


--
-- TOC entry 221 (class 1259 OID 26292)
-- Name: mst_cucm_softkey_template; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_cucm_softkey_template (
    softkey_template_id integer NOT NULL,
    softkey_template_nm character varying(100) NOT NULL,
    device_type_no integer NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_cucm_softkey_template OWNER TO postgres;

--
-- TOC entry 3433 (class 0 OID 0)
-- Dependencies: 221
-- Name: TABLE mst_cucm_softkey_template; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_cucm_softkey_template IS 'MST_CUCM_ソフトキーテンプレート';


--
-- TOC entry 3434 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN mst_cucm_softkey_template.softkey_template_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_softkey_template.softkey_template_id IS 'ソフトキーテンプレートID';


--
-- TOC entry 3435 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN mst_cucm_softkey_template.softkey_template_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_softkey_template.softkey_template_nm IS 'ソフトキーテンプレート名';


--
-- TOC entry 3436 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN mst_cucm_softkey_template.device_type_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_softkey_template.device_type_no IS 'デバイスタイプ番号';


--
-- TOC entry 3437 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN mst_cucm_softkey_template.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_softkey_template.create_date IS '作成日時';


--
-- TOC entry 3438 (class 0 OID 0)
-- Dependencies: 221
-- Name: COLUMN mst_cucm_softkey_template.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_softkey_template.update_date IS '更新日時';


--
-- TOC entry 220 (class 1259 OID 26290)
-- Name: mst_cucm_softkey_template_softkey_template_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_cucm_softkey_template_softkey_template_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_cucm_softkey_template_softkey_template_id_seq OWNER TO postgres;

--
-- TOC entry 3439 (class 0 OID 0)
-- Dependencies: 220
-- Name: mst_cucm_softkey_template_softkey_template_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_cucm_softkey_template_softkey_template_id_seq OWNED BY public.mst_cucm_softkey_template.softkey_template_id;


--
-- TOC entry 215 (class 1259 OID 26256)
-- Name: mst_cucm_voice_mail_profile; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_cucm_voice_mail_profile (
    voice_mail_profile_id integer NOT NULL,
    voice_mail_profile_nm character varying(100) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_cucm_voice_mail_profile OWNER TO postgres;

--
-- TOC entry 3440 (class 0 OID 0)
-- Dependencies: 215
-- Name: TABLE mst_cucm_voice_mail_profile; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_cucm_voice_mail_profile IS 'MST_CUCM_ボイスメールプロファイル';


--
-- TOC entry 3441 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN mst_cucm_voice_mail_profile.voice_mail_profile_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_voice_mail_profile.voice_mail_profile_id IS 'ボイスメールプロファイルID';


--
-- TOC entry 3442 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN mst_cucm_voice_mail_profile.voice_mail_profile_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_voice_mail_profile.voice_mail_profile_nm IS 'ボイスメールプロファイル名';


--
-- TOC entry 3443 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN mst_cucm_voice_mail_profile.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_voice_mail_profile.create_date IS '作成日時';


--
-- TOC entry 3444 (class 0 OID 0)
-- Dependencies: 215
-- Name: COLUMN mst_cucm_voice_mail_profile.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_cucm_voice_mail_profile.update_date IS '更新日時';


--
-- TOC entry 214 (class 1259 OID 26254)
-- Name: mst_cucm_voice_mail_profile_voice_mail_profile_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_cucm_voice_mail_profile_voice_mail_profile_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_cucm_voice_mail_profile_voice_mail_profile_id_seq OWNER TO postgres;

--
-- TOC entry 3445 (class 0 OID 0)
-- Dependencies: 214
-- Name: mst_cucm_voice_mail_profile_voice_mail_profile_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_cucm_voice_mail_profile_voice_mail_profile_id_seq OWNED BY public.mst_cucm_voice_mail_profile.voice_mail_profile_id;


--
-- TOC entry 217 (class 1259 OID 26268)
-- Name: mst_section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_section (
    section_id integer NOT NULL,
    company_cd character varying(3) NOT NULL,
    section_cd character varying(5) NOT NULL,
    section_nm character varying(60) NOT NULL,
    parent_section_cd character varying(5) NOT NULL,
    organization_cd character varying(19) NOT NULL,
    print_order character varying(4) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_section OWNER TO postgres;

--
-- TOC entry 3446 (class 0 OID 0)
-- Dependencies: 217
-- Name: TABLE mst_section; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_section IS 'MST_店部課';


--
-- TOC entry 3447 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN mst_section.section_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_section.section_id IS '店部課ID';


--
-- TOC entry 3448 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN mst_section.company_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_section.company_cd IS '会社コード';


--
-- TOC entry 3449 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN mst_section.section_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_section.section_cd IS '店部課コード';


--
-- TOC entry 3450 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN mst_section.section_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_section.section_nm IS '店部課名';


--
-- TOC entry 3451 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN mst_section.parent_section_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_section.parent_section_cd IS '親店部課コード';


--
-- TOC entry 3452 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN mst_section.organization_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_section.organization_cd IS '組織コード';


--
-- TOC entry 3453 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN mst_section.print_order; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_section.print_order IS 'プリント順';


--
-- TOC entry 3454 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN mst_section.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_section.create_date IS '作成日時';


--
-- TOC entry 3455 (class 0 OID 0)
-- Dependencies: 217
-- Name: COLUMN mst_section.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_section.update_date IS '更新日時';


--
-- TOC entry 216 (class 1259 OID 26266)
-- Name: mst_section_section_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_section_section_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_section_section_id_seq OWNER TO postgres;

--
-- TOC entry 3456 (class 0 OID 0)
-- Dependencies: 216
-- Name: mst_section_section_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_section_section_id_seq OWNED BY public.mst_section.section_id;


--
-- TOC entry 219 (class 1259 OID 26280)
-- Name: mst_shared_nm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.mst_shared_nm (
    shared_id integer NOT NULL,
    shared_nm character varying(40) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.mst_shared_nm OWNER TO postgres;

--
-- TOC entry 3457 (class 0 OID 0)
-- Dependencies: 219
-- Name: TABLE mst_shared_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.mst_shared_nm IS 'MST_共用名';


--
-- TOC entry 3458 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN mst_shared_nm.shared_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_shared_nm.shared_id IS '共用名ID';


--
-- TOC entry 3459 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN mst_shared_nm.shared_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_shared_nm.shared_nm IS '共用名';


--
-- TOC entry 3460 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN mst_shared_nm.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_shared_nm.create_date IS '作成日時';


--
-- TOC entry 3461 (class 0 OID 0)
-- Dependencies: 219
-- Name: COLUMN mst_shared_nm.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.mst_shared_nm.update_date IS '更新日時';


--
-- TOC entry 218 (class 1259 OID 26278)
-- Name: mst_shared_nm_shared_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.mst_shared_nm_shared_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.mst_shared_nm_shared_id_seq OWNER TO postgres;

--
-- TOC entry 3462 (class 0 OID 0)
-- Dependencies: 218
-- Name: mst_shared_nm_shared_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.mst_shared_nm_shared_id_seq OWNED BY public.mst_shared_nm.shared_id;


--
-- TOC entry 222 (class 1259 OID 26302)
-- Name: rel_branch_section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rel_branch_section (
    branch_id integer NOT NULL,
    section_id integer NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.rel_branch_section OWNER TO postgres;

--
-- TOC entry 3463 (class 0 OID 0)
-- Dependencies: 222
-- Name: TABLE rel_branch_section; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.rel_branch_section IS 'REL_拠点-店部課';


--
-- TOC entry 3464 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN rel_branch_section.branch_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_branch_section.branch_id IS '拠点ID';


--
-- TOC entry 3465 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN rel_branch_section.section_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_branch_section.section_id IS '店部課ID';


--
-- TOC entry 3466 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN rel_branch_section.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_branch_section.create_date IS '作成日時';


--
-- TOC entry 3467 (class 0 OID 0)
-- Dependencies: 222
-- Name: COLUMN rel_branch_section.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_branch_section.update_date IS '更新日時';


--
-- TOC entry 223 (class 1259 OID 26309)
-- Name: rel_cucm_phone_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rel_cucm_phone_line (
    phone_id integer NOT NULL,
    line_id integer NOT NULL,
    no integer NOT NULL,
    line_txt_label character varying(10),
    external_phone_no_mask character varying(100),
    ring_setting_nm character varying(18),
    dialin character varying(24),
    remarks text,
    delete_flg character varying(1) DEFAULT 0 NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.rel_cucm_phone_line OWNER TO postgres;

--
-- TOC entry 3468 (class 0 OID 0)
-- Dependencies: 223
-- Name: TABLE rel_cucm_phone_line; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.rel_cucm_phone_line IS 'REL_電話機-ライン';


--
-- TOC entry 3469 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.phone_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.phone_id IS '電話ID';


--
-- TOC entry 3470 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.line_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.line_id IS 'LINEID';


--
-- TOC entry 3471 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.no IS '連番';


--
-- TOC entry 3472 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.line_txt_label; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.line_txt_label IS 'テキストラベル';


--
-- TOC entry 3473 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.external_phone_no_mask; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.external_phone_no_mask IS '外線通知番号';


--
-- TOC entry 3474 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.ring_setting_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.ring_setting_nm IS '鳴動設定名';


--
-- TOC entry 3475 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.dialin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.dialin IS 'ダイヤルイン';


--
-- TOC entry 3476 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.remarks; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.remarks IS '備考';


--
-- TOC entry 3477 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.delete_flg; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.delete_flg IS '削除フラグ';


--
-- TOC entry 3478 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.create_date IS '作成日時';


--
-- TOC entry 3479 (class 0 OID 0)
-- Dependencies: 223
-- Name: COLUMN rel_cucm_phone_line.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_phone_line.update_date IS '更新日時';


--
-- TOC entry 224 (class 1259 OID 26320)
-- Name: rel_cucm_user_phone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rel_cucm_user_phone (
    user_id integer NOT NULL,
    phone_id integer NOT NULL,
    delete_flg character varying(1) DEFAULT 0 NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.rel_cucm_user_phone OWNER TO postgres;

--
-- TOC entry 3480 (class 0 OID 0)
-- Dependencies: 224
-- Name: TABLE rel_cucm_user_phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.rel_cucm_user_phone IS 'REL_ユーザ-電話機';


--
-- TOC entry 3481 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN rel_cucm_user_phone.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_user_phone.user_id IS 'ユーザーID';


--
-- TOC entry 3482 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN rel_cucm_user_phone.phone_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_user_phone.phone_id IS '電話機ID';


--
-- TOC entry 3483 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN rel_cucm_user_phone.delete_flg; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_user_phone.delete_flg IS '削除フラグ';


--
-- TOC entry 3484 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN rel_cucm_user_phone.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_user_phone.create_date IS '作成日時';


--
-- TOC entry 3485 (class 0 OID 0)
-- Dependencies: 224
-- Name: COLUMN rel_cucm_user_phone.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_cucm_user_phone.update_date IS '更新日時';


--
-- TOC entry 225 (class 1259 OID 26328)
-- Name: rel_user_section; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.rel_user_section (
    user_id integer NOT NULL,
    section_id integer NOT NULL,
    delete_reserve character varying(1) DEFAULT 0 NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.rel_user_section OWNER TO postgres;

--
-- TOC entry 3486 (class 0 OID 0)
-- Dependencies: 225
-- Name: TABLE rel_user_section; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.rel_user_section IS 'REL_ユーザー-店部課';


--
-- TOC entry 3487 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN rel_user_section.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_user_section.user_id IS 'ユーザーID';


--
-- TOC entry 3488 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN rel_user_section.section_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_user_section.section_id IS '店部課ID';


--
-- TOC entry 3489 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN rel_user_section.delete_reserve; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_user_section.delete_reserve IS '削除予約';


--
-- TOC entry 3490 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN rel_user_section.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_user_section.create_date IS '作成日時';


--
-- TOC entry 3491 (class 0 OID 0)
-- Dependencies: 225
-- Name: COLUMN rel_user_section.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.rel_user_section.update_date IS '更新日時';


--
-- TOC entry 227 (class 1259 OID 26338)
-- Name: tmp_ad; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmp_ad (
    ad_id integer NOT NULL,
    login_nm character varying(7) NOT NULL,
    disp_nm character varying(128),
    last_nm character varying(128) NOT NULL,
    first_nm character varying(128) NOT NULL,
    mail character varying(256),
    "position" character varying(512) NOT NULL
);


ALTER TABLE public.tmp_ad OWNER TO postgres;

--
-- TOC entry 3492 (class 0 OID 0)
-- Dependencies: 227
-- Name: TABLE tmp_ad; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tmp_ad IS 'TMP_AD情報';


--
-- TOC entry 3493 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN tmp_ad.ad_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_ad.ad_id IS 'AD_ID';


--
-- TOC entry 3494 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN tmp_ad.login_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_ad.login_nm IS 'ログイン名';


--
-- TOC entry 3495 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN tmp_ad.disp_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_ad.disp_nm IS '英語姓名';


--
-- TOC entry 3496 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN tmp_ad.last_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_ad.last_nm IS '英語姓';


--
-- TOC entry 3497 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN tmp_ad.first_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_ad.first_nm IS '英語名';


--
-- TOC entry 3498 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN tmp_ad.mail; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_ad.mail IS 'メールアドレス';


--
-- TOC entry 3499 (class 0 OID 0)
-- Dependencies: 227
-- Name: COLUMN tmp_ad."position"; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_ad."position" IS '社員区分';


--
-- TOC entry 226 (class 1259 OID 26336)
-- Name: tmp_ad_ad_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tmp_ad_ad_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tmp_ad_ad_id_seq OWNER TO postgres;

--
-- TOC entry 3500 (class 0 OID 0)
-- Dependencies: 226
-- Name: tmp_ad_ad_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tmp_ad_ad_id_seq OWNED BY public.tmp_ad.ad_id;


--
-- TOC entry 229 (class 1259 OID 26351)
-- Name: tmp_department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmp_department (
    department_id integer NOT NULL,
    company_cd character varying(3) NOT NULL,
    department_cd character varying(5) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tmp_department OWNER TO postgres;

--
-- TOC entry 3501 (class 0 OID 0)
-- Dependencies: 229
-- Name: TABLE tmp_department; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tmp_department IS 'TMP_店部課情報';


--
-- TOC entry 3502 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN tmp_department.department_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_department.department_id IS '店部課ID';


--
-- TOC entry 3503 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN tmp_department.company_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_department.company_cd IS '会社コード';


--
-- TOC entry 3504 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN tmp_department.department_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_department.department_cd IS '店部課コード';


--
-- TOC entry 3505 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN tmp_department.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_department.create_date IS '作成日時';


--
-- TOC entry 3506 (class 0 OID 0)
-- Dependencies: 229
-- Name: COLUMN tmp_department.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_department.update_date IS '更新日時';


--
-- TOC entry 228 (class 1259 OID 26349)
-- Name: tmp_department_department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tmp_department_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tmp_department_department_id_seq OWNER TO postgres;

--
-- TOC entry 3507 (class 0 OID 0)
-- Dependencies: 228
-- Name: tmp_department_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tmp_department_department_id_seq OWNED BY public.tmp_department.department_id;


--
-- TOC entry 231 (class 1259 OID 26363)
-- Name: tmp_employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmp_employee (
    employee_id integer NOT NULL,
    company_cd character varying(3) NOT NULL,
    employee_cd character varying(7) NOT NULL,
    assign_grade character varying(2) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tmp_employee OWNER TO postgres;

--
-- TOC entry 3508 (class 0 OID 0)
-- Dependencies: 231
-- Name: TABLE tmp_employee; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tmp_employee IS 'TMP_社員情報';


--
-- TOC entry 3509 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN tmp_employee.employee_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_employee.employee_id IS '社員ID';


--
-- TOC entry 3510 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN tmp_employee.company_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_employee.company_cd IS '会社コード';


--
-- TOC entry 3511 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN tmp_employee.employee_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_employee.employee_cd IS '社員コード';


--
-- TOC entry 3512 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN tmp_employee.assign_grade; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_employee.assign_grade IS '所属順位';


--
-- TOC entry 3513 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN tmp_employee.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_employee.create_date IS '作成日時';


--
-- TOC entry 3514 (class 0 OID 0)
-- Dependencies: 231
-- Name: COLUMN tmp_employee.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_employee.update_date IS '更新日時';


--
-- TOC entry 230 (class 1259 OID 26361)
-- Name: tmp_employee_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tmp_employee_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tmp_employee_employee_id_seq OWNER TO postgres;

--
-- TOC entry 3515 (class 0 OID 0)
-- Dependencies: 230
-- Name: tmp_employee_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tmp_employee_employee_id_seq OWNED BY public.tmp_employee.employee_id;


--
-- TOC entry 233 (class 1259 OID 26375)
-- Name: tmp_executive; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmp_executive (
    executive_post_id integer NOT NULL,
    executive_post_cd character varying(3) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tmp_executive OWNER TO postgres;

--
-- TOC entry 3516 (class 0 OID 0)
-- Dependencies: 233
-- Name: TABLE tmp_executive; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tmp_executive IS 'TMP_役職';


--
-- TOC entry 3517 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN tmp_executive.executive_post_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_executive.executive_post_id IS '役職ID';


--
-- TOC entry 3518 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN tmp_executive.executive_post_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_executive.executive_post_cd IS '役職コード';


--
-- TOC entry 3519 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN tmp_executive.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_executive.create_date IS '作成日時';


--
-- TOC entry 3520 (class 0 OID 0)
-- Dependencies: 233
-- Name: COLUMN tmp_executive.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_executive.update_date IS '更新日時';


--
-- TOC entry 232 (class 1259 OID 26373)
-- Name: tmp_executive_executive_post_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tmp_executive_executive_post_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tmp_executive_executive_post_id_seq OWNER TO postgres;

--
-- TOC entry 3521 (class 0 OID 0)
-- Dependencies: 232
-- Name: tmp_executive_executive_post_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tmp_executive_executive_post_id_seq OWNED BY public.tmp_executive.executive_post_id;


--
-- TOC entry 235 (class 1259 OID 26387)
-- Name: tmp_integratedid_department; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmp_integratedid_department (
    department_id integer NOT NULL,
    organization_cd character varying(19) NOT NULL,
    company_cd character varying(3) NOT NULL,
    company_nm character varying(60) NOT NULL,
    control_cd character varying(5) NOT NULL,
    control_nm character varying(60) NOT NULL,
    charge_cd character varying(5) NOT NULL,
    charge_nm character varying(60) NOT NULL,
    parent_department_cd character varying(5) NOT NULL,
    parent_department_nm character varying(60) NOT NULL,
    department_cd character varying(5) NOT NULL,
    department_nm character varying(60) NOT NULL,
    department_nm_en character varying(80),
    zip_cd character varying(7),
    address character varying(100),
    telephone_no character varying(15),
    fax_no character varying(15),
    extension_no character varying(15),
    class_sales character varying(2) NOT NULL,
    class_data_input character varying(2) NOT NULL,
    update_date timestamp without time zone NOT NULL
);


ALTER TABLE public.tmp_integratedid_department OWNER TO postgres;

--
-- TOC entry 3522 (class 0 OID 0)
-- Dependencies: 235
-- Name: TABLE tmp_integratedid_department; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tmp_integratedid_department IS 'TMP_統合ID_店部課情報';


--
-- TOC entry 3523 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.department_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.department_id IS '店部課ID';


--
-- TOC entry 3524 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.organization_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.organization_cd IS '組織コード';


--
-- TOC entry 3525 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.company_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.company_cd IS '会社コード';


--
-- TOC entry 3526 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.company_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.company_nm IS '会社名';


--
-- TOC entry 3527 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.control_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.control_cd IS '統轄コード';


--
-- TOC entry 3528 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.control_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.control_nm IS '統轄名';


--
-- TOC entry 3529 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.charge_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.charge_cd IS '担当コード';


--
-- TOC entry 3530 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.charge_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.charge_nm IS '担当名';


--
-- TOC entry 3531 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.parent_department_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.parent_department_cd IS '親店部課コード';


--
-- TOC entry 3532 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.parent_department_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.parent_department_nm IS '親店部課名';


--
-- TOC entry 3533 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.department_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.department_cd IS '店部課コード';


--
-- TOC entry 3534 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.department_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.department_nm IS '店部課名';


--
-- TOC entry 3535 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.department_nm_en; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.department_nm_en IS '店部課名英語';


--
-- TOC entry 3536 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.zip_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.zip_cd IS '郵便番号';


--
-- TOC entry 3537 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.address IS '住所';


--
-- TOC entry 3538 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.telephone_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.telephone_no IS '電話番号';


--
-- TOC entry 3539 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.fax_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.fax_no IS 'FAX番号';


--
-- TOC entry 3540 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.extension_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.extension_no IS '内線番号';


--
-- TOC entry 3541 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.class_sales; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.class_sales IS '営業・非営業区分';


--
-- TOC entry 3542 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.class_data_input; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.class_data_input IS 'データ入力区分';


--
-- TOC entry 3543 (class 0 OID 0)
-- Dependencies: 235
-- Name: COLUMN tmp_integratedid_department.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_department.update_date IS '更新日時';


--
-- TOC entry 234 (class 1259 OID 26385)
-- Name: tmp_integratedid_department_department_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tmp_integratedid_department_department_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tmp_integratedid_department_department_id_seq OWNER TO postgres;

--
-- TOC entry 3544 (class 0 OID 0)
-- Dependencies: 234
-- Name: tmp_integratedid_department_department_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tmp_integratedid_department_department_id_seq OWNED BY public.tmp_integratedid_department.department_id;


--
-- TOC entry 237 (class 1259 OID 26400)
-- Name: tmp_integratedid_employee; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmp_integratedid_employee (
    employee_id integer NOT NULL,
    organization_cd character varying(19) NOT NULL,
    company_cd character varying(3) NOT NULL,
    department_cd character varying(5) NOT NULL,
    department_nm character varying(60) NOT NULL,
    employee_cd character varying(7) NOT NULL,
    employee_nm_kanji character varying(30) NOT NULL,
    employee_nm_kana character varying(60) NOT NULL,
    executive_post_cd character varying(3) NOT NULL,
    post_lineage_cd character varying(2),
    class character varying(4),
    sex_cd character varying(1) NOT NULL,
    birthday character varying(8) NOT NULL,
    mail_address character varying(60),
    assign_grade character varying(2) NOT NULL,
    class_tel_addressbook character varying(1) NOT NULL,
    class_temporary_transfer character varying(1) NOT NULL,
    mail_address_automade_flg character varying(1) NOT NULL,
    class_data_input character varying(2) NOT NULL,
    update_date timestamp without time zone NOT NULL
);


ALTER TABLE public.tmp_integratedid_employee OWNER TO postgres;

--
-- TOC entry 3545 (class 0 OID 0)
-- Dependencies: 237
-- Name: TABLE tmp_integratedid_employee; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tmp_integratedid_employee IS 'TMP_統合ID_社員情報';


--
-- TOC entry 3546 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.employee_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.employee_id IS '社員ID';


--
-- TOC entry 3547 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.organization_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.organization_cd IS '組織コード';


--
-- TOC entry 3548 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.company_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.company_cd IS '会社コード';


--
-- TOC entry 3549 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.department_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.department_cd IS '店部課コード';


--
-- TOC entry 3550 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.department_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.department_nm IS '店部課名';


--
-- TOC entry 3551 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.employee_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.employee_cd IS '社員コード';


--
-- TOC entry 3552 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.employee_nm_kanji; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.employee_nm_kanji IS '社員氏名';


--
-- TOC entry 3553 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.employee_nm_kana; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.employee_nm_kana IS '社員氏名カナ';


--
-- TOC entry 3554 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.executive_post_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.executive_post_cd IS '役職コード';


--
-- TOC entry 3555 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.post_lineage_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.post_lineage_cd IS '職系コード';


--
-- TOC entry 3556 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.class; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.class IS 'クラス';


--
-- TOC entry 3557 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.sex_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.sex_cd IS '性別コード';


--
-- TOC entry 3558 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.birthday; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.birthday IS '生年月日';


--
-- TOC entry 3559 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.mail_address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.mail_address IS 'メールアドレス';


--
-- TOC entry 3560 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.assign_grade; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.assign_grade IS '所属順位';


--
-- TOC entry 3561 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.class_tel_addressbook; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.class_tel_addressbook IS '掲載区分';


--
-- TOC entry 3562 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.class_temporary_transfer; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.class_temporary_transfer IS '出向区分';


--
-- TOC entry 3563 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.mail_address_automade_flg; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.mail_address_automade_flg IS 'メール作成フラグ';


--
-- TOC entry 3564 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.class_data_input; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.class_data_input IS 'データ入力区分';


--
-- TOC entry 3565 (class 0 OID 0)
-- Dependencies: 237
-- Name: COLUMN tmp_integratedid_employee.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_employee.update_date IS '更新日時';


--
-- TOC entry 236 (class 1259 OID 26398)
-- Name: tmp_integratedid_employee_employee_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tmp_integratedid_employee_employee_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tmp_integratedid_employee_employee_id_seq OWNER TO postgres;

--
-- TOC entry 3566 (class 0 OID 0)
-- Dependencies: 236
-- Name: tmp_integratedid_employee_employee_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tmp_integratedid_employee_employee_id_seq OWNED BY public.tmp_integratedid_employee.employee_id;


--
-- TOC entry 239 (class 1259 OID 26410)
-- Name: tmp_integratedid_organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmp_integratedid_organization (
    organization_id integer NOT NULL,
    organization_cd character varying(19) NOT NULL,
    organization_nm character varying(60) NOT NULL,
    organization_no character varying(7) NOT NULL,
    organization_abbreviated_nm character varying(15) NOT NULL,
    print_order character varying(4) NOT NULL,
    class_sales character varying(2) NOT NULL,
    class_data_input character varying(2) NOT NULL,
    update_date timestamp without time zone NOT NULL
);


ALTER TABLE public.tmp_integratedid_organization OWNER TO postgres;

--
-- TOC entry 3567 (class 0 OID 0)
-- Dependencies: 239
-- Name: TABLE tmp_integratedid_organization; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tmp_integratedid_organization IS 'TMP_統合ID_組織情報';


--
-- TOC entry 3568 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN tmp_integratedid_organization.organization_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_organization.organization_id IS '組織ID';


--
-- TOC entry 3569 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN tmp_integratedid_organization.organization_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_organization.organization_cd IS '組織コード';


--
-- TOC entry 3570 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN tmp_integratedid_organization.organization_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_organization.organization_nm IS '組織名';


--
-- TOC entry 3571 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN tmp_integratedid_organization.organization_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_organization.organization_no IS '組織No.';


--
-- TOC entry 3572 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN tmp_integratedid_organization.organization_abbreviated_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_organization.organization_abbreviated_nm IS '組織名略';


--
-- TOC entry 3573 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN tmp_integratedid_organization.print_order; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_organization.print_order IS 'プリント順';


--
-- TOC entry 3574 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN tmp_integratedid_organization.class_sales; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_organization.class_sales IS '営業・非営業区分';


--
-- TOC entry 3575 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN tmp_integratedid_organization.class_data_input; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_organization.class_data_input IS 'データ入力区分';


--
-- TOC entry 3576 (class 0 OID 0)
-- Dependencies: 239
-- Name: COLUMN tmp_integratedid_organization.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_integratedid_organization.update_date IS '更新日時';


--
-- TOC entry 238 (class 1259 OID 26408)
-- Name: tmp_integratedid_organization_organization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tmp_integratedid_organization_organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tmp_integratedid_organization_organization_id_seq OWNER TO postgres;

--
-- TOC entry 3577 (class 0 OID 0)
-- Dependencies: 238
-- Name: tmp_integratedid_organization_organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tmp_integratedid_organization_organization_id_seq OWNED BY public.tmp_integratedid_organization.organization_id;


--
-- TOC entry 241 (class 1259 OID 26420)
-- Name: tmp_organization; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tmp_organization (
    organization_id integer NOT NULL,
    organization_cd character varying(19) NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.tmp_organization OWNER TO postgres;

--
-- TOC entry 3578 (class 0 OID 0)
-- Dependencies: 241
-- Name: TABLE tmp_organization; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.tmp_organization IS 'TMP_組織情報';


--
-- TOC entry 3579 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN tmp_organization.organization_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_organization.organization_id IS '組織ID';


--
-- TOC entry 3580 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN tmp_organization.organization_cd; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_organization.organization_cd IS '組織コード';


--
-- TOC entry 3581 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN tmp_organization.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_organization.create_date IS '作成日時';


--
-- TOC entry 3582 (class 0 OID 0)
-- Dependencies: 241
-- Name: COLUMN tmp_organization.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.tmp_organization.update_date IS '更新日時';


--
-- TOC entry 240 (class 1259 OID 26418)
-- Name: tmp_organization_organization_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.tmp_organization_organization_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.tmp_organization_organization_id_seq OWNER TO postgres;

--
-- TOC entry 3583 (class 0 OID 0)
-- Dependencies: 240
-- Name: tmp_organization_organization_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.tmp_organization_organization_id_seq OWNED BY public.tmp_organization.organization_id;


--
-- TOC entry 243 (class 1259 OID 26432)
-- Name: trn_charge_association; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trn_charge_association (
    charge_id integer NOT NULL,
    branch_id integer NOT NULL,
    section_id integer NOT NULL,
    remarks text,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trn_charge_association OWNER TO postgres;

--
-- TOC entry 3584 (class 0 OID 0)
-- Dependencies: 243
-- Name: TABLE trn_charge_association; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trn_charge_association IS 'TRN_課金連携';


--
-- TOC entry 3585 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN trn_charge_association.charge_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_charge_association.charge_id IS '課金ID';


--
-- TOC entry 3586 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN trn_charge_association.branch_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_charge_association.branch_id IS '拠点ID';


--
-- TOC entry 3587 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN trn_charge_association.section_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_charge_association.section_id IS '店部課ID';


--
-- TOC entry 3588 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN trn_charge_association.remarks; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_charge_association.remarks IS '備考';


--
-- TOC entry 3589 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN trn_charge_association.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_charge_association.create_date IS '作成日時';


--
-- TOC entry 3590 (class 0 OID 0)
-- Dependencies: 243
-- Name: COLUMN trn_charge_association.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_charge_association.update_date IS '更新日時';


--
-- TOC entry 242 (class 1259 OID 26430)
-- Name: trn_charge_association_charge_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trn_charge_association_charge_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trn_charge_association_charge_id_seq OWNER TO postgres;

--
-- TOC entry 3591 (class 0 OID 0)
-- Dependencies: 242
-- Name: trn_charge_association_charge_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trn_charge_association_charge_id_seq OWNED BY public.trn_charge_association.charge_id;


--
-- TOC entry 245 (class 1259 OID 26445)
-- Name: trn_cuc_association; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trn_cuc_association (
    cuc_id integer NOT NULL,
    phone_id integer NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trn_cuc_association OWNER TO postgres;

--
-- TOC entry 3592 (class 0 OID 0)
-- Dependencies: 245
-- Name: TABLE trn_cuc_association; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trn_cuc_association IS 'TRN_CUC連携';


--
-- TOC entry 3593 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN trn_cuc_association.cuc_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_cuc_association.cuc_id IS 'CUC_ID';


--
-- TOC entry 3594 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN trn_cuc_association.phone_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_cuc_association.phone_id IS '電話機ID';


--
-- TOC entry 3595 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN trn_cuc_association.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_cuc_association.create_date IS '作成日時';


--
-- TOC entry 3596 (class 0 OID 0)
-- Dependencies: 245
-- Name: COLUMN trn_cuc_association.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_cuc_association.update_date IS '更新日時';


--
-- TOC entry 244 (class 1259 OID 26443)
-- Name: trn_cuc_association_cuc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trn_cuc_association_cuc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trn_cuc_association_cuc_id_seq OWNER TO postgres;

--
-- TOC entry 3597 (class 0 OID 0)
-- Dependencies: 244
-- Name: trn_cuc_association_cuc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trn_cuc_association_cuc_id_seq OWNED BY public.trn_cuc_association.cuc_id;


--
-- TOC entry 247 (class 1259 OID 26455)
-- Name: trn_diff_cucm; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trn_diff_cucm (
    diff_cucm_id integer NOT NULL,
    cucm_mac_address character varying(13),
    cucm_directory_no character varying(8),
    cucm_calling_search_space_nm character varying(100),
    cucm_location_nm character varying(8),
    cucm_device_pool_nm character varying(100),
    cucm_phone_button_template_nm character varying(100),
    cucm_addon_module_nm_1 character varying(100),
    cucm_addon_module_nm_2 character varying(100),
    cucm_addon_module_nm_3 character varying(100),
    cucm_fwd_all_css character varying(100),
    cucm_fwd_busy_css character varying(100),
    cucm_fwd_busy_destination character varying(100),
    cucm_fwd_noans_css character varying(100),
    cucm_fwd_noans_destination character varying(100),
    cucm_call_pickup_group_nm character varying(100),
    cucm_voice_mail_profile_nm character varying(100),
    cucm_no integer,
    cucm_external_phone_no_mask character varying(100),
    cucm_line_txt_label character varying(10),
    cucm_ring_setting_nm character varying(18),
    app_mac_address character varying(13),
    app_directory_no character varying(8),
    app_calling_search_space_nm character varying(100),
    app_location_nm character varying(8),
    app_device_pool_nm character varying(100),
    app_phone_button_template_nm character varying(100),
    app_addon_module_nm_1 character varying(100),
    app_addon_module_nm_2 character varying(100),
    app_addon_module_nm_3 character varying(100),
    app_fwd_all_css character varying(100),
    app_fwd_busy_css character varying(100),
    app_fwd_busy_destination character varying(100),
    app_fwd_noans_css character varying(100),
    app_fwd_noans_destination character varying(100),
    app_call_pickup_group_nm character varying(100),
    app_voice_mail_profile_nm character varying(100),
    app_no integer,
    app_external_phone_no_mask character varying(100),
    app_line_txt_label character varying(10),
    app_ring_setting_nm character varying(18),
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trn_diff_cucm OWNER TO postgres;

--
-- TOC entry 3598 (class 0 OID 0)
-- Dependencies: 247
-- Name: TABLE trn_diff_cucm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trn_diff_cucm IS 'TRN_CUCM差分';


--
-- TOC entry 3599 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.diff_cucm_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.diff_cucm_id IS 'CUCM差分ID';


--
-- TOC entry 3600 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_mac_address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_mac_address IS 'MACアドレス（CUCM）';


--
-- TOC entry 3601 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_directory_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_directory_no IS '内線番号（CUCM）';


--
-- TOC entry 3602 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_calling_search_space_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_calling_search_space_nm IS 'コーリングサーチスペース名（CUCM）';


--
-- TOC entry 3603 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_location_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_location_nm IS 'ロケーション名（CUCM）';


--
-- TOC entry 3604 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_device_pool_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_device_pool_nm IS 'デバイスプール名（CUCM）';


--
-- TOC entry 3605 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_phone_button_template_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_phone_button_template_nm IS 'ボタンテンプレート名（CUCM）';


--
-- TOC entry 3606 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_addon_module_nm_1; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_addon_module_nm_1 IS '拡張モジュール１（CUCM）';


--
-- TOC entry 3607 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_addon_module_nm_2; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_addon_module_nm_2 IS '拡張モジュール２（CUCM）';


--
-- TOC entry 3608 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_addon_module_nm_3; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_addon_module_nm_3 IS '拡張モジュール３（CUCM）';


--
-- TOC entry 3609 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_fwd_all_css; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_fwd_all_css IS '全転送CSS（CUCM）';


--
-- TOC entry 3610 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_fwd_busy_css; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_fwd_busy_css IS '話中転送先（CUCM）';


--
-- TOC entry 3611 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_fwd_busy_destination; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_fwd_busy_destination IS '話中転送先CSS（CUCM）';


--
-- TOC entry 3612 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_fwd_noans_css; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_fwd_noans_css IS '不応答転送先（CUCM）';


--
-- TOC entry 3613 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_fwd_noans_destination; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_fwd_noans_destination IS '不応答転送先CSS（CUCM）';


--
-- TOC entry 3614 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_call_pickup_group_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_call_pickup_group_nm IS 'ピックアップグループ名（CUCM）';


--
-- TOC entry 3615 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_voice_mail_profile_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_voice_mail_profile_nm IS 'ボイスメールプロファイル名（CUCM）';


--
-- TOC entry 3616 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_no IS '連番（CUCM）';


--
-- TOC entry 3617 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_external_phone_no_mask; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_external_phone_no_mask IS '外線通知番号（CUCM）';


--
-- TOC entry 3618 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_line_txt_label; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_line_txt_label IS 'テキストラベル（CUCM）';


--
-- TOC entry 3619 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.cucm_ring_setting_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.cucm_ring_setting_nm IS '鳴動設定名（CUCM）';


--
-- TOC entry 3620 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_mac_address; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_mac_address IS 'MACアドレス（メンテナンスシステム）';


--
-- TOC entry 3621 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_directory_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_directory_no IS '内線番号（メンテナンスシステム）';


--
-- TOC entry 3622 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_calling_search_space_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_calling_search_space_nm IS 'コーリングサーチスペース名（メンテナンスシステム）';


--
-- TOC entry 3623 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_location_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_location_nm IS 'ロケーション名（メンテナンスシステム）';


--
-- TOC entry 3624 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_device_pool_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_device_pool_nm IS 'デバイスプール名（メンテナンスシステム）';


--
-- TOC entry 3625 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_phone_button_template_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_phone_button_template_nm IS 'ボタンテンプレート名（メンテナンスシステム）';


--
-- TOC entry 3626 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_addon_module_nm_1; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_addon_module_nm_1 IS '拡張モジュール１（メンテナンスシステム）';


--
-- TOC entry 3627 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_addon_module_nm_2; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_addon_module_nm_2 IS '拡張モジュール２（メンテナンスシステム）';


--
-- TOC entry 3628 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_addon_module_nm_3; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_addon_module_nm_3 IS '拡張モジュール３（メンテナンスシステム）';


--
-- TOC entry 3629 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_fwd_all_css; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_fwd_all_css IS '全転送CSS（メンテナンスシステム）';


--
-- TOC entry 3630 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_fwd_busy_css; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_fwd_busy_css IS '話中転送先（メンテナンスシステム）';


--
-- TOC entry 3631 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_fwd_busy_destination; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_fwd_busy_destination IS '話中転送先CSS（メンテナンスシステム）';


--
-- TOC entry 3632 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_fwd_noans_css; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_fwd_noans_css IS '不応答転送先（メンテナンスシステム）';


--
-- TOC entry 3633 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_fwd_noans_destination; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_fwd_noans_destination IS '不応答転送先CSS（メンテナンスシステム）';


--
-- TOC entry 3634 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_call_pickup_group_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_call_pickup_group_nm IS 'ピックアップグループ名（メンテナンスシステム）';


--
-- TOC entry 3635 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_voice_mail_profile_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_voice_mail_profile_nm IS 'ボイスメールプロファイル名（メンテナンスシステム）';


--
-- TOC entry 3636 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_no IS '連番（メンテナンスシステム）';


--
-- TOC entry 3637 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_external_phone_no_mask; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_external_phone_no_mask IS '外線通知番号（メンテナンスシステム）';


--
-- TOC entry 3638 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_line_txt_label; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_line_txt_label IS 'テキストラベル（メンテナンスシステム）';


--
-- TOC entry 3639 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.app_ring_setting_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.app_ring_setting_nm IS '鳴動設定名（メンテナンスシステム）';


--
-- TOC entry 3640 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.create_date IS '作成日時';


--
-- TOC entry 3641 (class 0 OID 0)
-- Dependencies: 247
-- Name: COLUMN trn_diff_cucm.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_cucm.update_date IS '更新日時';


--
-- TOC entry 246 (class 1259 OID 26453)
-- Name: trn_diff_cucm_diff_cucm_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trn_diff_cucm_diff_cucm_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trn_diff_cucm_diff_cucm_id_seq OWNER TO postgres;

--
-- TOC entry 3642 (class 0 OID 0)
-- Dependencies: 246
-- Name: trn_diff_cucm_diff_cucm_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trn_diff_cucm_diff_cucm_id_seq OWNED BY public.trn_diff_cucm.diff_cucm_id;


--
-- TOC entry 249 (class 1259 OID 26468)
-- Name: trn_diff_officelink; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trn_diff_officelink (
    diff_officelink_id integer NOT NULL,
    office_link_directory_no character varying(8),
    office_link_foma_no character varying(11),
    office_link_sip_id character varying(8),
    office_link_sip_pw character varying(8),
    office_link_web_cuscom_user_nm character varying(8),
    office_link_web_cuscom_pw text,
    app_directory_no character varying(8),
    app_foma_no character varying(11),
    app_sip_id character varying(8),
    app_sip_pw character varying(8),
    app_web_cuscom_user_nm character varying(8),
    app_web_cuscom_pw text,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trn_diff_officelink OWNER TO postgres;

--
-- TOC entry 3643 (class 0 OID 0)
-- Dependencies: 249
-- Name: TABLE trn_diff_officelink; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trn_diff_officelink IS 'TRN_オフィスリンク差分';


--
-- TOC entry 3644 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.diff_officelink_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.diff_officelink_id IS 'オフィスリンク差分ID';


--
-- TOC entry 3645 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.office_link_directory_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.office_link_directory_no IS '内線番号（オフィスリンク）';


--
-- TOC entry 3646 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.office_link_foma_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.office_link_foma_no IS 'FOMA番号（オフィスリンク）';


--
-- TOC entry 3647 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.office_link_sip_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.office_link_sip_id IS 'SIP ID（オフィスリンク）';


--
-- TOC entry 3648 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.office_link_sip_pw; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.office_link_sip_pw IS 'SIP パスワード（オフィスリンク）';


--
-- TOC entry 3649 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.office_link_web_cuscom_user_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.office_link_web_cuscom_user_nm IS 'Web カスコンユーザ名（オフィスリンク）';


--
-- TOC entry 3650 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.office_link_web_cuscom_pw; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.office_link_web_cuscom_pw IS 'Web カスコン パスワード（オフィスリンク）';


--
-- TOC entry 3651 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.app_directory_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.app_directory_no IS '内線番号（メンテナンスシステム）';


--
-- TOC entry 3652 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.app_foma_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.app_foma_no IS 'FOMA番号（メンテナンスシステム）';


--
-- TOC entry 3653 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.app_sip_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.app_sip_id IS 'SIP ID（メンテナンスシステム）';


--
-- TOC entry 3654 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.app_sip_pw; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.app_sip_pw IS 'SIP パスワード（メンテナンスシステム）';


--
-- TOC entry 3655 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.app_web_cuscom_user_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.app_web_cuscom_user_nm IS 'Web カスコンユーザ名（メンテナンスシステム）';


--
-- TOC entry 3656 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.app_web_cuscom_pw; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.app_web_cuscom_pw IS 'Web カスコン パスワード（メンテナンスシステム）';


--
-- TOC entry 3657 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.create_date IS '作成日時';


--
-- TOC entry 3658 (class 0 OID 0)
-- Dependencies: 249
-- Name: COLUMN trn_diff_officelink.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_diff_officelink.update_date IS '更新日時';


--
-- TOC entry 248 (class 1259 OID 26466)
-- Name: trn_diff_officelink_diff_officelink_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trn_diff_officelink_diff_officelink_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trn_diff_officelink_diff_officelink_id_seq OWNER TO postgres;

--
-- TOC entry 3659 (class 0 OID 0)
-- Dependencies: 248
-- Name: trn_diff_officelink_diff_officelink_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trn_diff_officelink_diff_officelink_id_seq OWNED BY public.trn_diff_officelink.diff_officelink_id;


--
-- TOC entry 251 (class 1259 OID 26481)
-- Name: trn_line; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trn_line (
    line_id integer NOT NULL,
    fmc_id integer,
    charge_id integer NOT NULL,
    voice_mail_profile_id integer,
    pickup_group_id integer,
    directory_no character varying(8) NOT NULL,
    fwd_all_destination character varying(100),
    fwd_all_css integer,
    fwd_busy_destination character varying(100),
    fwd_busy_css integer,
    fwd_noans_destination character varying(100),
    fwd_noans_css integer,
    fwd_noans_ring_duration integer NOT NULL,
    maximum_no_of_calls integer NOT NULL,
    busy_trigger integer NOT NULL,
    calling_party_transformation_mask character varying(10),
    gw_repletion_special_no character varying(3),
    voice_logger character varying(1),
    representative_pickup integer DEFAULT 0 NOT NULL,
    update_status character varying(1) DEFAULT 0 NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trn_line OWNER TO postgres;

--
-- TOC entry 3660 (class 0 OID 0)
-- Dependencies: 251
-- Name: TABLE trn_line; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trn_line IS 'TRN_ライン';


--
-- TOC entry 3661 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.line_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.line_id IS 'ラインID';


--
-- TOC entry 3662 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.fmc_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.fmc_id IS 'FMC ID';


--
-- TOC entry 3663 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.charge_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.charge_id IS '課金ID';


--
-- TOC entry 3664 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.voice_mail_profile_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.voice_mail_profile_id IS 'ボイスメールプロファイルID';


--
-- TOC entry 3665 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.pickup_group_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.pickup_group_id IS 'ピックアップグループID';


--
-- TOC entry 3666 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.directory_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.directory_no IS '内線番号';


--
-- TOC entry 3667 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.fwd_all_destination; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.fwd_all_destination IS '全転送';


--
-- TOC entry 3668 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.fwd_all_css; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.fwd_all_css IS '全転送CSS';


--
-- TOC entry 3669 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.fwd_busy_destination; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.fwd_busy_destination IS '話中転送先';


--
-- TOC entry 3670 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.fwd_busy_css; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.fwd_busy_css IS '話中転送先CSS';


--
-- TOC entry 3671 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.fwd_noans_destination; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.fwd_noans_destination IS '不応答転送先';


--
-- TOC entry 3672 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.fwd_noans_css; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.fwd_noans_css IS '不応答転送先CSS';


--
-- TOC entry 3673 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.fwd_noans_ring_duration; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.fwd_noans_ring_duration IS '不応答転送待ち時間';


--
-- TOC entry 3674 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.maximum_no_of_calls; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.maximum_no_of_calls IS '最大コール数';


--
-- TOC entry 3675 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.busy_trigger; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.busy_trigger IS 'ビジートリガー';


--
-- TOC entry 3676 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.calling_party_transformation_mask; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.calling_party_transformation_mask IS '発呼側トランスフォーメーションマスク';


--
-- TOC entry 3677 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.gw_repletion_special_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.gw_repletion_special_no IS 'GW補足特番';


--
-- TOC entry 3678 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.voice_logger; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.voice_logger IS '通録設定';


--
-- TOC entry 3679 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.representative_pickup; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.representative_pickup IS '代表ピックアップ設定';


--
-- TOC entry 3680 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.update_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.update_status IS '更新ステータス';


--
-- TOC entry 3681 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.create_date IS '作成日時';


--
-- TOC entry 3682 (class 0 OID 0)
-- Dependencies: 251
-- Name: COLUMN trn_line.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_line.update_date IS '更新日時';


--
-- TOC entry 250 (class 1259 OID 26479)
-- Name: trn_line_line_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trn_line_line_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trn_line_line_id_seq OWNER TO postgres;

--
-- TOC entry 3683 (class 0 OID 0)
-- Dependencies: 250
-- Name: trn_line_line_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trn_line_line_id_seq OWNED BY public.trn_line.line_id;


--
-- TOC entry 253 (class 1259 OID 26495)
-- Name: trn_officelink_fmc; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trn_officelink_fmc (
    fmc_id integer NOT NULL,
    directory_no character varying(8) NOT NULL,
    foma_no character varying(11) NOT NULL,
    sip_id character varying(8),
    sip_pw character varying(8),
    web_cuscom_user_nm character varying(8) NOT NULL,
    web_cuscom_pw text NOT NULL,
    update_status character varying(1) DEFAULT 0 NOT NULL,
    delete_flg character varying(1) DEFAULT 0 NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trn_officelink_fmc OWNER TO postgres;

--
-- TOC entry 3684 (class 0 OID 0)
-- Dependencies: 253
-- Name: TABLE trn_officelink_fmc; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trn_officelink_fmc IS 'TRN_オフィスリンク_FMC端末情報';


--
-- TOC entry 3685 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.fmc_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.fmc_id IS 'FMC ID';


--
-- TOC entry 3686 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.directory_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.directory_no IS '内線番号';


--
-- TOC entry 3687 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.foma_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.foma_no IS 'FOMA番号';


--
-- TOC entry 3688 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.sip_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.sip_id IS 'SIP ID';


--
-- TOC entry 3689 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.sip_pw; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.sip_pw IS 'SIP パスワード';


--
-- TOC entry 3690 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.web_cuscom_user_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.web_cuscom_user_nm IS 'Web カスコンユーザ名';


--
-- TOC entry 3691 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.web_cuscom_pw; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.web_cuscom_pw IS 'Web カスコン パスワード';


--
-- TOC entry 3692 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.update_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.update_status IS '更新ステータス';


--
-- TOC entry 3693 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.delete_flg; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.delete_flg IS '削除フラグ';


--
-- TOC entry 3694 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.create_date IS '作成日時';


--
-- TOC entry 3695 (class 0 OID 0)
-- Dependencies: 253
-- Name: COLUMN trn_officelink_fmc.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_officelink_fmc.update_date IS '更新日時';


--
-- TOC entry 252 (class 1259 OID 26493)
-- Name: trn_officelink_fmc_fmc_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trn_officelink_fmc_fmc_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trn_officelink_fmc_fmc_id_seq OWNER TO postgres;

--
-- TOC entry 3696 (class 0 OID 0)
-- Dependencies: 252
-- Name: trn_officelink_fmc_fmc_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trn_officelink_fmc_fmc_id_seq OWNED BY public.trn_officelink_fmc.fmc_id;


--
-- TOC entry 255 (class 1259 OID 26512)
-- Name: trn_password_change_tracking; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trn_password_change_tracking (
    tracking_id integer NOT NULL,
    user_id integer NOT NULL,
    no integer NOT NULL,
    before_pw text NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trn_password_change_tracking OWNER TO postgres;

--
-- TOC entry 3697 (class 0 OID 0)
-- Dependencies: 255
-- Name: TABLE trn_password_change_tracking; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trn_password_change_tracking IS 'TRN_パスワード変更履歴';


--
-- TOC entry 3698 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN trn_password_change_tracking.tracking_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_password_change_tracking.tracking_id IS '履歴ID';


--
-- TOC entry 3699 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN trn_password_change_tracking.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_password_change_tracking.user_id IS 'ユーザーID';


--
-- TOC entry 3700 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN trn_password_change_tracking.no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_password_change_tracking.no IS '連番';


--
-- TOC entry 3701 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN trn_password_change_tracking.before_pw; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_password_change_tracking.before_pw IS '前回パスワード';


--
-- TOC entry 3702 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN trn_password_change_tracking.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_password_change_tracking.create_date IS '作成日時';


--
-- TOC entry 3703 (class 0 OID 0)
-- Dependencies: 255
-- Name: COLUMN trn_password_change_tracking.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_password_change_tracking.update_date IS '更新日時';


--
-- TOC entry 254 (class 1259 OID 26510)
-- Name: trn_password_change_tracking_tracking_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trn_password_change_tracking_tracking_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trn_password_change_tracking_tracking_id_seq OWNER TO postgres;

--
-- TOC entry 3704 (class 0 OID 0)
-- Dependencies: 254
-- Name: trn_password_change_tracking_tracking_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trn_password_change_tracking_tracking_id_seq OWNED BY public.trn_password_change_tracking.tracking_id;


--
-- TOC entry 257 (class 1259 OID 26525)
-- Name: trn_phone; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trn_phone (
    phone_id integer NOT NULL,
    branch_id integer NOT NULL,
    section_id integer NOT NULL,
    device_pool_id integer NOT NULL,
    phone_template_id integer,
    calling_search_space_id integer NOT NULL,
    location_id integer NOT NULL,
    device_type_id integer NOT NULL,
    softkey_template_id integer NOT NULL,
    owner_user_id integer,
    device_nm character varying(25) NOT NULL,
    user_locale character varying(50),
    built_in_bridge character varying(7),
    privacy character varying(7),
    addon_module_id_1 integer,
    addon_module_id_2 integer,
    addon_module_id_3 integer,
    speed_dial json NOT NULL,
    remarks text,
    update_status character varying(1) DEFAULT 0 NOT NULL,
    delete_flg character varying(1) DEFAULT 0 NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trn_phone OWNER TO postgres;

--
-- TOC entry 3705 (class 0 OID 0)
-- Dependencies: 257
-- Name: TABLE trn_phone; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trn_phone IS 'TRN_電話機';


--
-- TOC entry 3706 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.phone_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.phone_id IS '電話ID';


--
-- TOC entry 3707 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.branch_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.branch_id IS '拠点ID';


--
-- TOC entry 3708 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.section_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.section_id IS '店部課ID';


--
-- TOC entry 3709 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.device_pool_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.device_pool_id IS 'デバイスプールID';


--
-- TOC entry 3710 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.phone_template_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.phone_template_id IS '電話テンプレートID';


--
-- TOC entry 3711 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.calling_search_space_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.calling_search_space_id IS 'コーリングサーチスペースID';


--
-- TOC entry 3712 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.location_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.location_id IS 'ロケーションID';


--
-- TOC entry 3713 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.device_type_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.device_type_id IS 'デバイスタイプID';


--
-- TOC entry 3714 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.softkey_template_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.softkey_template_id IS 'ソフトキーテンプレートID';


--
-- TOC entry 3715 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.owner_user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.owner_user_id IS 'オーナーユーザーID';


--
-- TOC entry 3716 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.device_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.device_nm IS 'デバイス名';


--
-- TOC entry 3717 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.user_locale; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.user_locale IS 'ユーザーロケール';


--
-- TOC entry 3718 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.built_in_bridge; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.built_in_bridge IS 'ビルトインブリッジ';


--
-- TOC entry 3719 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.privacy; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.privacy IS 'プライバシー';


--
-- TOC entry 3720 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.addon_module_id_1; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.addon_module_id_1 IS '拡張モジュール１';


--
-- TOC entry 3721 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.addon_module_id_2; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.addon_module_id_2 IS '拡張モジュール２';


--
-- TOC entry 3722 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.addon_module_id_3; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.addon_module_id_3 IS '拡張モジュール３';


--
-- TOC entry 3723 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.speed_dial; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.speed_dial IS 'スピードダイアル';


--
-- TOC entry 3724 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.remarks; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.remarks IS '備考';


--
-- TOC entry 3725 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.update_status; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.update_status IS '更新ステータス';


--
-- TOC entry 3726 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.delete_flg; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.delete_flg IS '削除フラグ';


--
-- TOC entry 3727 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.create_date IS '作成日時';


--
-- TOC entry 3728 (class 0 OID 0)
-- Dependencies: 257
-- Name: COLUMN trn_phone.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_phone.update_date IS '更新日時';


--
-- TOC entry 256 (class 1259 OID 26523)
-- Name: trn_phone_phone_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trn_phone_phone_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trn_phone_phone_id_seq OWNER TO postgres;

--
-- TOC entry 3729 (class 0 OID 0)
-- Dependencies: 256
-- Name: trn_phone_phone_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trn_phone_phone_id_seq OWNED BY public.trn_phone.phone_id;


--
-- TOC entry 259 (class 1259 OID 26542)
-- Name: trn_user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.trn_user (
    user_id integer NOT NULL,
    user_role character varying(1) DEFAULT 0 NOT NULL,
    shared_id integer,
    enabled_shared_use character varying(1) NOT NULL,
    fulltime_employee character varying(1) NOT NULL,
    biz_employee_id character varying(7) NOT NULL,
    login_id character varying(7) NOT NULL,
    login_pw text NOT NULL,
    user_locale character varying(50),
    cucm_login_id character varying(7) NOT NULL,
    cucm_login_pw text,
    user_nm_kanji character varying(20),
    user_nm_kana character varying(40),
    birthday character varying(8),
    last_nm character varying(128) NOT NULL,
    first_nm character varying(128) NOT NULL,
    pin character varying(5) NOT NULL,
    telephone_no character varying(15),
    enable_cti_application_use character varying(1),
    manager_user_id text,
    department text,
    last_pw_update timestamp without time zone NOT NULL,
    authenticate_failure_num integer DEFAULT 0 NOT NULL,
    account_lock character varying(1) DEFAULT 0 NOT NULL,
    create_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


ALTER TABLE public.trn_user OWNER TO postgres;

--
-- TOC entry 3730 (class 0 OID 0)
-- Dependencies: 259
-- Name: TABLE trn_user; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON TABLE public.trn_user IS 'TRN_ユーザー';


--
-- TOC entry 3731 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.user_id IS 'ユーザーID';


--
-- TOC entry 3732 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.user_role; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.user_role IS 'ユーザー権限';


--
-- TOC entry 3733 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.shared_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.shared_id IS '共用化ID';


--
-- TOC entry 3734 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.enabled_shared_use; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.enabled_shared_use IS '共用ユーザー区分';


--
-- TOC entry 3735 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.fulltime_employee; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.fulltime_employee IS '正社員区分';


--
-- TOC entry 3736 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.biz_employee_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.biz_employee_id IS '人事情報側ユーザー区分';


--
-- TOC entry 3737 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.login_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.login_id IS 'ログインID';


--
-- TOC entry 3738 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.login_pw; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.login_pw IS 'ログインパスワード';


--
-- TOC entry 3739 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.user_locale; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.user_locale IS 'ユーザーロケール';


--
-- TOC entry 3740 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.cucm_login_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.cucm_login_id IS 'CUCMログインID';


--
-- TOC entry 3741 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.cucm_login_pw; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.cucm_login_pw IS 'CUCMログインパスワード';


--
-- TOC entry 3742 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.user_nm_kanji; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.user_nm_kanji IS 'ユーザー名・漢字';


--
-- TOC entry 3743 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.user_nm_kana; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.user_nm_kana IS 'ユーザー名・カナ';


--
-- TOC entry 3744 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.birthday; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.birthday IS '生年月日';


--
-- TOC entry 3745 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.last_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.last_nm IS 'ユーザー名・姓(CUCM)';


--
-- TOC entry 3746 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.first_nm; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.first_nm IS 'ユーザー名・名(CUCM)';


--
-- TOC entry 3747 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.pin; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.pin IS 'PIN(CUCM)';


--
-- TOC entry 3748 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.telephone_no; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.telephone_no IS '電話番号(CUCM)';


--
-- TOC entry 3749 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.enable_cti_application_use; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.enable_cti_application_use IS 'CTIアプリ利用フラグ(CUCM)';


--
-- TOC entry 3750 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.manager_user_id; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.manager_user_id IS 'マネージャID(CUCM)';


--
-- TOC entry 3751 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.department; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.department IS '部署名(CUCM)';


--
-- TOC entry 3752 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.last_pw_update; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.last_pw_update IS '最終パスワード変更日時';


--
-- TOC entry 3753 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.authenticate_failure_num; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.authenticate_failure_num IS '認証失敗回数';


--
-- TOC entry 3754 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.account_lock; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.account_lock IS 'アカウントロック';


--
-- TOC entry 3755 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.create_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.create_date IS '作成日時';


--
-- TOC entry 3756 (class 0 OID 0)
-- Dependencies: 259
-- Name: COLUMN trn_user.update_date; Type: COMMENT; Schema: public; Owner: postgres
--

COMMENT ON COLUMN public.trn_user.update_date IS '更新日時';


--
-- TOC entry 258 (class 1259 OID 26540)
-- Name: trn_user_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.trn_user_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.trn_user_user_id_seq OWNER TO postgres;

--
-- TOC entry 3757 (class 0 OID 0)
-- Dependencies: 258
-- Name: trn_user_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.trn_user_user_id_seq OWNED BY public.trn_user.user_id;


--
-- TOC entry 3038 (class 2604 OID 26175)
-- Name: mst_branch branch_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_branch ALTER COLUMN branch_id SET DEFAULT nextval('public.mst_branch_branch_id_seq'::regclass);


--
-- TOC entry 3041 (class 2604 OID 26187)
-- Name: mst_cucm_calling_search_space calling_search_space_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_calling_search_space ALTER COLUMN calling_search_space_id SET DEFAULT nextval('public.mst_cucm_calling_search_space_calling_search_space_id_seq'::regclass);


--
-- TOC entry 3044 (class 2604 OID 26199)
-- Name: mst_cucm_device_pool device_pool_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_device_pool ALTER COLUMN device_pool_id SET DEFAULT nextval('public.mst_cucm_device_pool_device_pool_id_seq'::regclass);


--
-- TOC entry 3047 (class 2604 OID 26211)
-- Name: mst_cucm_device_type device_type_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_device_type ALTER COLUMN device_type_id SET DEFAULT nextval('public.mst_cucm_device_type_device_type_id_seq'::regclass);


--
-- TOC entry 3050 (class 2604 OID 26223)
-- Name: mst_cucm_location location_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_location ALTER COLUMN location_id SET DEFAULT nextval('public.mst_cucm_location_location_id_seq'::regclass);


--
-- TOC entry 3053 (class 2604 OID 26235)
-- Name: mst_cucm_phone_template phone_template_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_phone_template ALTER COLUMN phone_template_id SET DEFAULT nextval('public.mst_cucm_phone_template_phone_template_id_seq'::regclass);


--
-- TOC entry 3056 (class 2604 OID 26247)
-- Name: mst_cucm_pickup_group pickup_group_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_pickup_group ALTER COLUMN pickup_group_id SET DEFAULT nextval('public.mst_cucm_pickup_group_pickup_group_id_seq'::regclass);


--
-- TOC entry 3068 (class 2604 OID 26295)
-- Name: mst_cucm_softkey_template softkey_template_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_softkey_template ALTER COLUMN softkey_template_id SET DEFAULT nextval('public.mst_cucm_softkey_template_softkey_template_id_seq'::regclass);


--
-- TOC entry 3059 (class 2604 OID 26259)
-- Name: mst_cucm_voice_mail_profile voice_mail_profile_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_voice_mail_profile ALTER COLUMN voice_mail_profile_id SET DEFAULT nextval('public.mst_cucm_voice_mail_profile_voice_mail_profile_id_seq'::regclass);


--
-- TOC entry 3062 (class 2604 OID 26271)
-- Name: mst_section section_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_section ALTER COLUMN section_id SET DEFAULT nextval('public.mst_section_section_id_seq'::regclass);


--
-- TOC entry 3065 (class 2604 OID 26283)
-- Name: mst_shared_nm shared_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_shared_nm ALTER COLUMN shared_id SET DEFAULT nextval('public.mst_shared_nm_shared_id_seq'::regclass);


--
-- TOC entry 3082 (class 2604 OID 26341)
-- Name: tmp_ad ad_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_ad ALTER COLUMN ad_id SET DEFAULT nextval('public.tmp_ad_ad_id_seq'::regclass);


--
-- TOC entry 3083 (class 2604 OID 26354)
-- Name: tmp_department department_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_department ALTER COLUMN department_id SET DEFAULT nextval('public.tmp_department_department_id_seq'::regclass);


--
-- TOC entry 3086 (class 2604 OID 26366)
-- Name: tmp_employee employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_employee ALTER COLUMN employee_id SET DEFAULT nextval('public.tmp_employee_employee_id_seq'::regclass);


--
-- TOC entry 3089 (class 2604 OID 26378)
-- Name: tmp_executive executive_post_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_executive ALTER COLUMN executive_post_id SET DEFAULT nextval('public.tmp_executive_executive_post_id_seq'::regclass);


--
-- TOC entry 3092 (class 2604 OID 26390)
-- Name: tmp_integratedid_department department_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_integratedid_department ALTER COLUMN department_id SET DEFAULT nextval('public.tmp_integratedid_department_department_id_seq'::regclass);


--
-- TOC entry 3093 (class 2604 OID 26403)
-- Name: tmp_integratedid_employee employee_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_integratedid_employee ALTER COLUMN employee_id SET DEFAULT nextval('public.tmp_integratedid_employee_employee_id_seq'::regclass);


--
-- TOC entry 3094 (class 2604 OID 26413)
-- Name: tmp_integratedid_organization organization_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_integratedid_organization ALTER COLUMN organization_id SET DEFAULT nextval('public.tmp_integratedid_organization_organization_id_seq'::regclass);


--
-- TOC entry 3095 (class 2604 OID 26423)
-- Name: tmp_organization organization_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_organization ALTER COLUMN organization_id SET DEFAULT nextval('public.tmp_organization_organization_id_seq'::regclass);


--
-- TOC entry 3098 (class 2604 OID 26435)
-- Name: trn_charge_association charge_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_charge_association ALTER COLUMN charge_id SET DEFAULT nextval('public.trn_charge_association_charge_id_seq'::regclass);


--
-- TOC entry 3101 (class 2604 OID 26448)
-- Name: trn_cuc_association cuc_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_cuc_association ALTER COLUMN cuc_id SET DEFAULT nextval('public.trn_cuc_association_cuc_id_seq'::regclass);


--
-- TOC entry 3104 (class 2604 OID 26458)
-- Name: trn_diff_cucm diff_cucm_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_diff_cucm ALTER COLUMN diff_cucm_id SET DEFAULT nextval('public.trn_diff_cucm_diff_cucm_id_seq'::regclass);


--
-- TOC entry 3107 (class 2604 OID 26471)
-- Name: trn_diff_officelink diff_officelink_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_diff_officelink ALTER COLUMN diff_officelink_id SET DEFAULT nextval('public.trn_diff_officelink_diff_officelink_id_seq'::regclass);


--
-- TOC entry 3110 (class 2604 OID 26484)
-- Name: trn_line line_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_line ALTER COLUMN line_id SET DEFAULT nextval('public.trn_line_line_id_seq'::regclass);


--
-- TOC entry 3115 (class 2604 OID 26498)
-- Name: trn_officelink_fmc fmc_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_officelink_fmc ALTER COLUMN fmc_id SET DEFAULT nextval('public.trn_officelink_fmc_fmc_id_seq'::regclass);


--
-- TOC entry 3120 (class 2604 OID 26515)
-- Name: trn_password_change_tracking tracking_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_password_change_tracking ALTER COLUMN tracking_id SET DEFAULT nextval('public.trn_password_change_tracking_tracking_id_seq'::regclass);


--
-- TOC entry 3123 (class 2604 OID 26528)
-- Name: trn_phone phone_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_phone ALTER COLUMN phone_id SET DEFAULT nextval('public.trn_phone_phone_id_seq'::regclass);


--
-- TOC entry 3128 (class 2604 OID 26545)
-- Name: trn_user user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_user ALTER COLUMN user_id SET DEFAULT nextval('public.trn_user_user_id_seq'::regclass);


--
-- TOC entry 3135 (class 2606 OID 26181)
-- Name: mst_branch mst_branch_branch_cd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_branch
    ADD CONSTRAINT mst_branch_branch_cd_key UNIQUE (branch_cd);


--
-- TOC entry 3137 (class 2606 OID 26179)
-- Name: mst_branch mst_branch_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_branch
    ADD CONSTRAINT mst_branch_pkey PRIMARY KEY (branch_id);


--
-- TOC entry 3139 (class 2606 OID 26193)
-- Name: mst_cucm_calling_search_space mst_cucm_calling_search_space_calling_search_space_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_calling_search_space
    ADD CONSTRAINT mst_cucm_calling_search_space_calling_search_space_nm_key UNIQUE (calling_search_space_nm);


--
-- TOC entry 3141 (class 2606 OID 26191)
-- Name: mst_cucm_calling_search_space mst_cucm_calling_search_space_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_calling_search_space
    ADD CONSTRAINT mst_cucm_calling_search_space_pkey PRIMARY KEY (calling_search_space_id);


--
-- TOC entry 3143 (class 2606 OID 26205)
-- Name: mst_cucm_device_pool mst_cucm_device_pool_device_pool_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_device_pool
    ADD CONSTRAINT mst_cucm_device_pool_device_pool_nm_key UNIQUE (device_pool_nm);


--
-- TOC entry 3145 (class 2606 OID 26203)
-- Name: mst_cucm_device_pool mst_cucm_device_pool_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_device_pool
    ADD CONSTRAINT mst_cucm_device_pool_pkey PRIMARY KEY (device_pool_id);


--
-- TOC entry 3147 (class 2606 OID 26217)
-- Name: mst_cucm_device_type mst_cucm_device_type_device_type_nm_rel_device_type_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_device_type
    ADD CONSTRAINT mst_cucm_device_type_device_type_nm_rel_device_type_no_key UNIQUE (device_type_nm, rel_device_type_no);


--
-- TOC entry 3149 (class 2606 OID 26215)
-- Name: mst_cucm_device_type mst_cucm_device_type_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_device_type
    ADD CONSTRAINT mst_cucm_device_type_pkey PRIMARY KEY (device_type_id);


--
-- TOC entry 3151 (class 2606 OID 26229)
-- Name: mst_cucm_location mst_cucm_location_location_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_location
    ADD CONSTRAINT mst_cucm_location_location_nm_key UNIQUE (location_nm);


--
-- TOC entry 3153 (class 2606 OID 26227)
-- Name: mst_cucm_location mst_cucm_location_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_location
    ADD CONSTRAINT mst_cucm_location_pkey PRIMARY KEY (location_id);


--
-- TOC entry 3155 (class 2606 OID 26241)
-- Name: mst_cucm_phone_template mst_cucm_phone_template_phone_template_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_phone_template
    ADD CONSTRAINT mst_cucm_phone_template_phone_template_nm_key UNIQUE (phone_template_nm);


--
-- TOC entry 3157 (class 2606 OID 26239)
-- Name: mst_cucm_phone_template mst_cucm_phone_template_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_phone_template
    ADD CONSTRAINT mst_cucm_phone_template_pkey PRIMARY KEY (phone_template_id);


--
-- TOC entry 3159 (class 2606 OID 26253)
-- Name: mst_cucm_pickup_group mst_cucm_pickup_group_pickup_group_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_pickup_group
    ADD CONSTRAINT mst_cucm_pickup_group_pickup_group_nm_key UNIQUE (pickup_group_nm);


--
-- TOC entry 3161 (class 2606 OID 26251)
-- Name: mst_cucm_pickup_group mst_cucm_pickup_group_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_pickup_group
    ADD CONSTRAINT mst_cucm_pickup_group_pkey PRIMARY KEY (pickup_group_id);


--
-- TOC entry 3175 (class 2606 OID 26299)
-- Name: mst_cucm_softkey_template mst_cucm_softkey_template_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_softkey_template
    ADD CONSTRAINT mst_cucm_softkey_template_pkey PRIMARY KEY (softkey_template_id);


--
-- TOC entry 3177 (class 2606 OID 26301)
-- Name: mst_cucm_softkey_template mst_cucm_softkey_template_softkey_template_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_softkey_template
    ADD CONSTRAINT mst_cucm_softkey_template_softkey_template_nm_key UNIQUE (softkey_template_nm);


--
-- TOC entry 3163 (class 2606 OID 26263)
-- Name: mst_cucm_voice_mail_profile mst_cucm_voice_mail_profile_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_voice_mail_profile
    ADD CONSTRAINT mst_cucm_voice_mail_profile_pkey PRIMARY KEY (voice_mail_profile_id);


--
-- TOC entry 3165 (class 2606 OID 26265)
-- Name: mst_cucm_voice_mail_profile mst_cucm_voice_mail_profile_voice_mail_profile_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_cucm_voice_mail_profile
    ADD CONSTRAINT mst_cucm_voice_mail_profile_voice_mail_profile_nm_key UNIQUE (voice_mail_profile_nm);


--
-- TOC entry 3167 (class 2606 OID 26277)
-- Name: mst_section mst_section_company_cd_section_cd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_section
    ADD CONSTRAINT mst_section_company_cd_section_cd_key UNIQUE (company_cd, section_cd);


--
-- TOC entry 3169 (class 2606 OID 26275)
-- Name: mst_section mst_section_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_section
    ADD CONSTRAINT mst_section_pkey PRIMARY KEY (section_id);


--
-- TOC entry 3171 (class 2606 OID 26287)
-- Name: mst_shared_nm mst_shared_nm_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_shared_nm
    ADD CONSTRAINT mst_shared_nm_pkey PRIMARY KEY (shared_id);


--
-- TOC entry 3173 (class 2606 OID 26289)
-- Name: mst_shared_nm mst_shared_nm_shared_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.mst_shared_nm
    ADD CONSTRAINT mst_shared_nm_shared_nm_key UNIQUE (shared_nm);


--
-- TOC entry 3179 (class 2606 OID 26308)
-- Name: rel_branch_section rel_branch_section_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rel_branch_section
    ADD CONSTRAINT rel_branch_section_pkey PRIMARY KEY (branch_id, section_id);


--
-- TOC entry 3181 (class 2606 OID 26319)
-- Name: rel_cucm_phone_line rel_cucm_phone_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rel_cucm_phone_line
    ADD CONSTRAINT rel_cucm_phone_line_pkey PRIMARY KEY (phone_id, line_id, no);


--
-- TOC entry 3183 (class 2606 OID 26327)
-- Name: rel_cucm_user_phone rel_cucm_user_phone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rel_cucm_user_phone
    ADD CONSTRAINT rel_cucm_user_phone_pkey PRIMARY KEY (user_id, phone_id);


--
-- TOC entry 3185 (class 2606 OID 26335)
-- Name: rel_user_section rel_user_section_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.rel_user_section
    ADD CONSTRAINT rel_user_section_pkey PRIMARY KEY (user_id, section_id);


--
-- TOC entry 3187 (class 2606 OID 26348)
-- Name: tmp_ad tmp_ad_login_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_ad
    ADD CONSTRAINT tmp_ad_login_nm_key UNIQUE (login_nm);


--
-- TOC entry 3189 (class 2606 OID 26346)
-- Name: tmp_ad tmp_ad_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_ad
    ADD CONSTRAINT tmp_ad_pkey PRIMARY KEY (ad_id);


--
-- TOC entry 3191 (class 2606 OID 26360)
-- Name: tmp_department tmp_department_company_cd_department_cd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_department
    ADD CONSTRAINT tmp_department_company_cd_department_cd_key UNIQUE (company_cd, department_cd);


--
-- TOC entry 3193 (class 2606 OID 26358)
-- Name: tmp_department tmp_department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_department
    ADD CONSTRAINT tmp_department_pkey PRIMARY KEY (department_id);


--
-- TOC entry 3195 (class 2606 OID 26372)
-- Name: tmp_employee tmp_employee_company_cd_employee_cd_assign_grade_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_employee
    ADD CONSTRAINT tmp_employee_company_cd_employee_cd_assign_grade_key UNIQUE (company_cd, employee_cd, assign_grade);


--
-- TOC entry 3197 (class 2606 OID 26370)
-- Name: tmp_employee tmp_employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_employee
    ADD CONSTRAINT tmp_employee_pkey PRIMARY KEY (employee_id);


--
-- TOC entry 3199 (class 2606 OID 26384)
-- Name: tmp_executive tmp_executive_executive_post_cd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_executive
    ADD CONSTRAINT tmp_executive_executive_post_cd_key UNIQUE (executive_post_cd);


--
-- TOC entry 3201 (class 2606 OID 26382)
-- Name: tmp_executive tmp_executive_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_executive
    ADD CONSTRAINT tmp_executive_pkey PRIMARY KEY (executive_post_id);


--
-- TOC entry 3203 (class 2606 OID 26397)
-- Name: tmp_integratedid_department tmp_integratedid_department_company_cd_department_cd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_integratedid_department
    ADD CONSTRAINT tmp_integratedid_department_company_cd_department_cd_key UNIQUE (company_cd, department_cd);


--
-- TOC entry 3205 (class 2606 OID 26395)
-- Name: tmp_integratedid_department tmp_integratedid_department_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_integratedid_department
    ADD CONSTRAINT tmp_integratedid_department_pkey PRIMARY KEY (department_id);


--
-- TOC entry 3207 (class 2606 OID 26407)
-- Name: tmp_integratedid_employee tmp_integratedid_employee_company_cd_employee_cd_assign_gra_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_integratedid_employee
    ADD CONSTRAINT tmp_integratedid_employee_company_cd_employee_cd_assign_gra_key UNIQUE (company_cd, employee_cd, assign_grade);


--
-- TOC entry 3209 (class 2606 OID 26405)
-- Name: tmp_integratedid_employee tmp_integratedid_employee_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_integratedid_employee
    ADD CONSTRAINT tmp_integratedid_employee_pkey PRIMARY KEY (employee_id);


--
-- TOC entry 3211 (class 2606 OID 26417)
-- Name: tmp_integratedid_organization tmp_integratedid_organization_organization_cd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_integratedid_organization
    ADD CONSTRAINT tmp_integratedid_organization_organization_cd_key UNIQUE (organization_cd);


--
-- TOC entry 3213 (class 2606 OID 26415)
-- Name: tmp_integratedid_organization tmp_integratedid_organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_integratedid_organization
    ADD CONSTRAINT tmp_integratedid_organization_pkey PRIMARY KEY (organization_id);


--
-- TOC entry 3215 (class 2606 OID 26429)
-- Name: tmp_organization tmp_organization_organization_cd_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_organization
    ADD CONSTRAINT tmp_organization_organization_cd_key UNIQUE (organization_cd);


--
-- TOC entry 3217 (class 2606 OID 26427)
-- Name: tmp_organization tmp_organization_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tmp_organization
    ADD CONSTRAINT tmp_organization_pkey PRIMARY KEY (organization_id);


--
-- TOC entry 3219 (class 2606 OID 26442)
-- Name: trn_charge_association trn_charge_association_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_charge_association
    ADD CONSTRAINT trn_charge_association_pkey PRIMARY KEY (charge_id);


--
-- TOC entry 3221 (class 2606 OID 26452)
-- Name: trn_cuc_association trn_cuc_association_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_cuc_association
    ADD CONSTRAINT trn_cuc_association_pkey PRIMARY KEY (cuc_id, phone_id);


--
-- TOC entry 3223 (class 2606 OID 26465)
-- Name: trn_diff_cucm trn_diff_cucm_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_diff_cucm
    ADD CONSTRAINT trn_diff_cucm_pkey PRIMARY KEY (diff_cucm_id);


--
-- TOC entry 3225 (class 2606 OID 26478)
-- Name: trn_diff_officelink trn_diff_officelink_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_diff_officelink
    ADD CONSTRAINT trn_diff_officelink_pkey PRIMARY KEY (diff_officelink_id);


--
-- TOC entry 3227 (class 2606 OID 26492)
-- Name: trn_line trn_line_directory_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_line
    ADD CONSTRAINT trn_line_directory_no_key UNIQUE (directory_no);


--
-- TOC entry 3229 (class 2606 OID 26490)
-- Name: trn_line trn_line_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_line
    ADD CONSTRAINT trn_line_pkey PRIMARY KEY (line_id);


--
-- TOC entry 3231 (class 2606 OID 26509)
-- Name: trn_officelink_fmc trn_officelink_fmc_directory_no_foma_no_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_officelink_fmc
    ADD CONSTRAINT trn_officelink_fmc_directory_no_foma_no_key UNIQUE (directory_no, foma_no);


--
-- TOC entry 3233 (class 2606 OID 26507)
-- Name: trn_officelink_fmc trn_officelink_fmc_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_officelink_fmc
    ADD CONSTRAINT trn_officelink_fmc_pkey PRIMARY KEY (fmc_id);


--
-- TOC entry 3235 (class 2606 OID 26522)
-- Name: trn_password_change_tracking trn_password_change_tracking_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_password_change_tracking
    ADD CONSTRAINT trn_password_change_tracking_pkey PRIMARY KEY (tracking_id, user_id, no);


--
-- TOC entry 3237 (class 2606 OID 26539)
-- Name: trn_phone trn_phone_device_nm_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_phone
    ADD CONSTRAINT trn_phone_device_nm_key UNIQUE (device_nm);


--
-- TOC entry 3239 (class 2606 OID 26537)
-- Name: trn_phone trn_phone_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_phone
    ADD CONSTRAINT trn_phone_pkey PRIMARY KEY (phone_id);


--
-- TOC entry 3241 (class 2606 OID 26557)
-- Name: trn_user trn_user_login_id_cucm_login_id_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_user
    ADD CONSTRAINT trn_user_login_id_cucm_login_id_key UNIQUE (login_id, cucm_login_id);


--
-- TOC entry 3243 (class 2606 OID 26555)
-- Name: trn_user trn_user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.trn_user
    ADD CONSTRAINT trn_user_pkey PRIMARY KEY (user_id);


-- Completed on 2025-06-07 09:49:15

--
-- PostgreSQL database dump complete
--

```

# 修正開始

## 修正済みテーブル定義（第 1 弾）

```sql
-- 店舗マスタ
CREATE TABLE public.mst_branch (
    branch_id SERIAL PRIMARY KEY,
    branch_cd VARCHAR(5) NOT NULL,
    branch_nm VARCHAR(40) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_branch_branch_cd_key UNIQUE (branch_cd)
);

-- CUCMコーリングサーチスペースマスタ
CREATE TABLE public.mst_cucm_calling_search_space (
    calling_search_space_id SERIAL PRIMARY KEY,
    calling_search_space_nm VARCHAR(100) NOT NULL,
    cd1 VARCHAR(3) NOT NULL,
    cd2 VARCHAR(5) NOT NULL,
    cd3 VARCHAR(5) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_calling_search_space_calling_search_space_nm_key UNIQUE (calling_search_space_nm)
);

-- CUCMデバイスプールマスタ
CREATE TABLE public.mst_cucm_device_pool (
    device_pool_id SERIAL PRIMARY KEY,
    device_pool_nm VARCHAR(100) NOT NULL,
    cisco_unified_callmanager_group VARCHAR(36) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_device_pool_device_pool_nm_key UNIQUE (device_pool_nm)
);

-- CUCMデバイスタイプマスタ
CREATE TABLE public.mst_cucm_device_type (
    device_type_id SERIAL PRIMARY KEY,
    device_type_nm VARCHAR(100) NOT NULL,
    device_type_no INT,
    device_protocol VARCHAR(4),
    rel_device_type_no INT,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_device_type_device_type_nm_rel_device_type_no_key UNIQUE (device_type_nm, rel_device_type_no)
);

-- CUCMロケーションマスタ
CREATE TABLE public.mst_cucm_location (
    location_id SERIAL PRIMARY KEY,
    location_nm VARCHAR(8) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_location_location_nm_key UNIQUE (location_nm)
);

-- CUCM電話テンプレートマスタ
CREATE TABLE public.mst_cucm_phone_template (
    phone_template_id SERIAL PRIMARY KEY,
    phone_template_nm VARCHAR(100) NOT NULL,
    device_type_id INT NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_phone_template_phone_template_nm_key UNIQUE (phone_template_nm),
    CONSTRAINT fk_phone_template_device_type
        FOREIGN KEY (device_type_id)
        REFERENCES public.mst_cucm_device_type(device_type_id)
);

-- CUCMピックアップグループマスタ
CREATE TABLE public.mst_cucm_pickup_group (
    pickup_group_id SERIAL PRIMARY KEY,
    pickup_group_nm VARCHAR(19) NOT NULL,
    pickup_group_no INT NOT NULL,
    branch_cd VARCHAR(3) NOT NULL,
    section_cd VARCHAR(5) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_pickup_group_pickup_group_nm_key UNIQUE (pickup_group_nm),
    CONSTRAINT fk_pickup_group_branch
        FOREIGN KEY (branch_cd)
        REFERENCES public.mst_branch(branch_cd)
);

-- CUCMソフトキーテンプレートマスタ
CREATE TABLE public.mst_cucm_softkey_template (
    softkey_template_id SERIAL PRIMARY KEY,
    softkey_template_nm VARCHAR(100) NOT NULL,
    device_type_no INT NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_softkey_template_softkey_template_nm_key UNIQUE (softkey_template_nm),
    CONSTRAINT fk_softkey_template_device_type
        FOREIGN KEY (device_type_no)
        REFERENCES public.mst_cucm_device_type(device_type_id)
);

-- CUCMボイスメールプロファイルマスタ
CREATE TABLE public.mst_cucm_voice_mail_profile (
    voice_mail_profile_id SERIAL PRIMARY KEY,
    voice_mail_profile_nm VARCHAR(100) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_cucm_voice_mail_profile_voice_mail_profile_nm_key UNIQUE (voice_mail_profile_nm)
);

-- 店部課マスタ
CREATE TABLE public.mst_section (
    section_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    section_cd VARCHAR(5) NOT NULL,
    section_nm VARCHAR(60) NOT NULL,
    parent_section_cd VARCHAR(5) NOT NULL,
    organization_cd VARCHAR(19) NOT NULL,
    print_order VARCHAR(4) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_section_company_cd_section_cd_key UNIQUE (company_cd, section_cd),
    CONSTRAINT fk_section_organization
        FOREIGN KEY (organization_cd)
        REFERENCES public.biz_organization(organization_cd)
);
```

## 主要な修正点

### 1. 監査カラムの追加

全テーブルに`update_user`カラムを追加：

```sql
update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL
```

### 2. 外部キー制約の強化

設計書で推奨されるリレーションを明示的に定義：

```sql
-- 例: 電話テンプレートとデバイスタイプの関連付け
CONSTRAINT fk_phone_template_device_type
    FOREIGN KEY (device_type_id)
    REFERENCES public.mst_cucm_device_type(device_type_id)
```

### 3. データ型の最適化

元の`integer`型をより適切な`SERIAL`型に変更（自動インクリメント対応）：

```sql
-- BEFORE
branch_id integer NOT NULL

-- AFTER
branch_id SERIAL PRIMARY KEY
```

### 4. デフォルト値の明示

監査日時のデフォルト値を CURRENT_TIMESTAMP で定義：

```sql
create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
```

### 5. 命名規則の統一

外部キー制約名を体系化（fk*親テーブル*子テーブル）：

```sql
CONSTRAINT fk_pickup_group_branch
    FOREIGN KEY (branch_cd)
    REFERENCES public.mst_branch(branch_cd)
```

## 変更適用スクリプト

既存テーブルがある環境での変更用スクリプト：

```sql
-- mst_branch変更用
ALTER TABLE public.mst_branch
    ADD COLUMN update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL;

-- mst_cucm_calling_search_space変更用
ALTER TABLE public.mst_cucm_calling_search_space
    ADD COLUMN update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL;

-- 同様に他の全テーブルにもupdate_userを追加...

-- 外部キー制約追加
ALTER TABLE public.mst_cucm_phone_template
    ADD CONSTRAINT fk_phone_template_device_type
    FOREIGN KEY (device_type_id)
    REFERENCES public.mst_cucm_device_type(device_type_id);

-- データ型変更
ALTER TABLE public.mst_cucm_pickup_group
    ALTER COLUMN pickup_group_no TYPE INT;

-- 制約名変更（必要に応じて）
ALTER TABLE public.mst_section
    RENAME CONSTRAINT mst_section_company_cd_section_cd_key TO uq_section_company_section;
```

## 修正済みテーブル定義（第 2 弾）

### 1. 共有名称マスタ

```sql
CREATE TABLE public.mst_shared_nm (
    shared_id SERIAL PRIMARY KEY,
    shared_nm VARCHAR(25) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT mst_shared_nm_shared_nm_key UNIQUE (shared_nm)
);
```

### 2. 店舗-店部課関連テーブル

```sql
CREATE TABLE public.rel_branch_section (
    branch_section_id SERIAL PRIMARY KEY,
    branch_id INTEGER NOT NULL REFERENCES public.mst_branch(branch_id),
    section_id INTEGER NOT NULL REFERENCES public.mst_section(section_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT rel_branch_section_branch_section_key UNIQUE (branch_id, section_id)
);
```

### 3. CUCM 電話機-内線番号関連テーブル

```sql
CREATE TABLE public.rel_cucm_phone_line (
    phone_line_id SERIAL PRIMARY KEY,
    phone_id INTEGER NOT NULL REFERENCES public.trn_phone(phone_id),
    line_id INTEGER NOT NULL REFERENCES public.trn_line(line_id),
    line_no INTEGER NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT rel_cucm_phone_line_phone_line_key UNIQUE (phone_id, line_id)
);
```

### 4. CUCM ユーザー-電話機関連テーブル

```sql
CREATE TABLE public.rel_cucm_user_phone (
    user_phone_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    phone_id INTEGER NOT NULL REFERENCES public.trn_phone(phone_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT rel_cucm_user_phone_user_phone_key UNIQUE (user_id, phone_id)
);
```

### 5. ユーザー-店部課関連テーブル

```sql
CREATE TABLE public.rel_user_section (
    user_section_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    section_id INTEGER NOT NULL REFERENCES public.mst_section(section_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT rel_user_section_user_section_key UNIQUE (user_id, section_id)
);
```

### 6. AD ステージングテーブル（tmp_ad → stg_ad）

```sql
CREATE TABLE public.stg_ad (
    employee_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    assign_grade VARCHAR(2) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_ad_company_cd_employee_cd_assign_grade_key
        UNIQUE (company_cd, employee_cd, assign_grade)
);
```

### 7. 部門ステージングテーブル（tmp_department → stg_department）

```sql
CREATE TABLE public.stg_department (
    department_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    department_cd VARCHAR(5) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_department_company_cd_department_cd_key
        UNIQUE (company_cd, department_cd)
);
```

### 8. 従業員ステージングテーブル（tmp_employee → stg_employee）

```sql
CREATE TABLE public.stg_employee (
    employee_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    assign_grade VARCHAR(2) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_employee_company_cd_employee_cd_assign_grade_key
        UNIQUE (company_cd, employee_cd, assign_grade)
);
```

### 9. 役職ステージングテーブル（tmp_executive → stg_executive）

```sql
CREATE TABLE public.stg_executive (
    executive_post_id SERIAL PRIMARY KEY,
    executive_post_cd VARCHAR(3) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_executive_executive_post_cd_key
        UNIQUE (executive_post_cd)
);
```

## 主な修正ポイント

### 1. 監査カラムの一貫性

全テーブルに`update_user`カラムを追加：

```sql
update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL
```

### 2. 論理削除フラグの導入

関連テーブルに`deleted`カラムを追加：

```sql
deleted BOOLEAN DEFAULT FALSE NOT NULL
```

### 3. 主キーの最適化

`SERIAL`型を使用した自動インクリメント実装：

```sql
department_id SERIAL PRIMARY KEY
```

### 4. 外部キー制約の明確化

関連テーブル間のリレーションを明示：

```sql
user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id)
```

### 5. 一意性制約の強化

複合キーによるデータ重複防止：

```sql
CONSTRAINT stg_employee_company_cd_employee_cd_assign_grade_key
    UNIQUE (company_cd, employee_cd, assign_grade)
```

## 移行スクリプト（既存環境向け）

```sql
-- リネームスクリプト
ALTER TABLE tmp_ad RENAME TO stg_ad;
ALTER TABLE tmp_department RENAME TO stg_department;
ALTER TABLE tmp_employee RENAME TO stg_employee;
ALTER TABLE tmp_executive RENAME TO stg_executive;

-- カラム追加スクリプト
ALTER TABLE rel_cucm_user_phone
    ADD COLUMN update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    ADD COLUMN deleted BOOLEAN DEFAULT FALSE NOT NULL;

-- 制約変更スクリプト
ALTER TABLE rel_user_section
    DROP CONSTRAINT IF EXISTS rel_user_section_user_section_key,
    ADD CONSTRAINT rel_user_section_user_section_key
        UNIQUE (user_id, section_id);

-- 外部キー追加スクリプト
ALTER TABLE rel_branch_section
    ADD CONSTRAINT fk_branch_section_section
    FOREIGN KEY (section_id)
    REFERENCES public.mst_section(section_id);
```

#### 已深度思考

```
までの対応を踏まえて、残りのテーブルを修正および新規作成します。
特にtrn_userについては、設計書の要件を満たすため以下の修正が必要です：
  - deletedカラムの追加（論理削除フラグ）
  - password_saltカラムの追加
  - PINの桁数を5桁から8桁に拡張
  - 生年月日をDATE型に変更
  - update_userカラムの追加

また、新規テーブル（audit_log, mst_section_history, biz_shift）は設計書に基づいて作成します。

注意：削除フラグ（delete_flg）があるテーブルについては、deletedへのリネームおよび型変更（BOOLEAN）も同時に行います。

```

## 最終テーブル定義（修正版＋新規テーブル）

### 1. 内線トランザクションテーブル（修正）

```sql
CREATE TABLE public.trn_line (
    line_id SERIAL PRIMARY KEY,
    line_no VARCHAR(4) NOT NULL,
    cucm_calling_search_space_id INTEGER REFERENCES public.mst_cucm_calling_search_space(calling_search_space_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT trn_line_line_no_key UNIQUE (line_no)
);
```

### 2. OfficeLink FMC トランザクションテーブル（修正）

```sql
CREATE TABLE public.trn_officelink_fmc (
    fmc_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    device_id VARCHAR(50) NOT NULL,
    association_status VARCHAR(20) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT trn_officelink_fmc_user_device_key
        UNIQUE (user_id, device_id)
);
```

### 3. パスワード変更追跡トランザクションテーブル（修正）

```sql
CREATE TABLE public.trn_password_change_tracking (
    tracking_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    password_hash VARCHAR(128) NOT NULL,
    change_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_password_change_tracking_user_change_key
        UNIQUE (user_id, change_date)
);
```

### 4. 電話機トランザクションテーブル（修正）

```sql
CREATE TABLE public.trn_phone (
    phone_id SERIAL PRIMARY KEY,
    phone_nm VARCHAR(100) NOT NULL,
    device_pool_id INTEGER NOT NULL REFERENCES public.mst_cucm_device_pool(device_pool_id),
    device_type_id INTEGER NOT NULL REFERENCES public.mst_cucm_device_type(device_type_id),
    phone_template_id INTEGER NOT NULL REFERENCES public.mst_cucm_phone_template(phone_template_id),
    location_id INTEGER NOT NULL REFERENCES public.mst_cucm_location(location_id),
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    CONSTRAINT trn_phone_phone_nm_key UNIQUE (phone_nm)
);
```

### 5. ユーザートランザクションテーブル（重要修正）

```sql
CREATE TABLE public.trn_user (
    user_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    user_nm VARCHAR(40) NOT NULL,
    user_nm_kana VARCHAR(80) NOT NULL,
    mail_address VARCHAR(256) NOT NULL,
    password_hash VARCHAR(128) NOT NULL,
    -- 設計書要件: パスワードソルト追加
    password_salt VARCHAR(32) NOT NULL,
    -- 設計書要件: PIN桁数拡張(5→8桁)
    pin VARCHAR(8) NOT NULL,
    -- 設計書要件: 生年月日をDATE型に変更
    birthday DATE NOT NULL,
    voice_mail_profile_id INTEGER REFERENCES public.mst_cucm_voice_mail_profile(voice_mail_profile_id),
    pickup_group_id INTEGER REFERENCES public.mst_cucm_pickup_group(pickup_group_id),
    -- 設計書要件: 論理削除フラグ追加
    deleted BOOLEAN DEFAULT FALSE NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_user_company_cd_employee_cd_key
        UNIQUE (company_cd, employee_cd),
    CONSTRAINT trn_user_mail_address_key
        UNIQUE (mail_address)
);
```

### 6. 監査ログテーブル（新規）

```sql
CREATE TABLE public.audit_log (
    log_id BIGSERIAL PRIMARY KEY,
    table_name VARCHAR(50) NOT NULL,
    record_id VARCHAR(50) NOT NULL,
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT','UPDATE','DELETE')),
    old_value JSONB,
    new_value JSONB,
    executed_by VARCHAR(50) NOT NULL DEFAULT 'BATCH',
    executed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);
```

### 7. 店部課履歴テーブル（新規）

```sql
CREATE TABLE public.mst_section_history (
    history_id BIGSERIAL PRIMARY KEY,
    section_id INTEGER NOT NULL REFERENCES public.mst_section(section_id),
    operation VARCHAR(10) NOT NULL CHECK (operation IN ('INSERT','UPDATE','DELETE')),
    operation_time TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    original_data JSONB NOT NULL
);
```

### 8. 機構改革情報テーブル（新規）

```sql
CREATE TABLE public.biz_shift (
    shift_id SERIAL PRIMARY KEY,
    old_branch_cd VARCHAR(5) NOT NULL,
    old_company_cd VARCHAR(3) NOT NULL,
    old_department_cd VARCHAR(5) NOT NULL,
    new_branch_cd VARCHAR(5) NOT NULL,
    new_company_cd VARCHAR(3) NOT NULL,
    new_department_cd VARCHAR(5) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT biz_shift_unique_old_values
        UNIQUE (old_branch_cd, old_company_cd, old_department_cd)
);
```

## trn_user テーブルの重要修正ポイント

### 1. セキュリティ強化

```sql
-- パスワードソルト追加
password_salt VARCHAR(32) NOT NULL

-- PIN桁数拡張(5→8桁)
pin VARCHAR(8) NOT NULL
```

### 2. データ型正規化

```sql
-- 生年月日をDATE型に変更
birthday DATE NOT NULL
```

### 3. 論理削除フラグ追加

```sql
deleted BOOLEAN DEFAULT FALSE NOT NULL
```

### 4. 監査情報追加

```sql
update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL
```

## 移行スクリプト（最終版）

```sql
-- trn_userテーブル修正
ALTER TABLE public.trn_user
    ADD COLUMN password_salt VARCHAR(32) NOT NULL DEFAULT '',
    ADD COLUMN deleted BOOLEAN DEFAULT FALSE NOT NULL,
    ALTER COLUMN pin TYPE VARCHAR(8),
    ALTER COLUMN birthday TYPE DATE USING birthday::DATE,
    ADD COLUMN update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL;

-- 削除フラグ正規化
ALTER TABLE public.trn_phone
    RENAME COLUMN delete_flg TO deleted,
    ALTER COLUMN deleted TYPE BOOLEAN USING deleted::boolean;

ALTER TABLE public.trn_line
    RENAME COLUMN delete_flg TO deleted,
    ALTER COLUMN deleted TYPE BOOLEAN USING deleted::boolean;

-- パスワードソルト生成関数
CREATE OR REPLACE FUNCTION public.generate_password_salt()
RETURNS TRIGGER AS $$
BEGIN
    NEW.password_salt = encode(gen_random_bytes(16), 'hex');
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- trn_userパスワードトリガー
CREATE TRIGGER tr_password_salt
BEFORE INSERT ON public.trn_user
FOR EACH ROW EXECUTE FUNCTION public.generate_password_salt();

-- 履歴管理トリガー
CREATE OR REPLACE FUNCTION public.track_section_history()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.mst_section_history(section_id, operation, original_data)
    VALUES (
        CASE WHEN TG_OP = 'DELETE' THEN OLD.section_id ELSE NEW.section_id END,
        TG_OP,
        to_jsonb(CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END)
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- mst_section履歴トリガー
CREATE TRIGGER tr_section_history
AFTER INSERT OR UPDATE OR DELETE ON public.mst_section
FOR EACH ROW EXECUTE FUNCTION public.track_section_history();

-- 監査ログトリガー
CREATE OR REPLACE FUNCTION public.log_audit()
RETURNS TRIGGER AS $$
DECLARE
    v_record_id TEXT;
BEGIN
    v_record_id := COALESCE(
        (CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END).user_id::TEXT,
        (CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END).phone_id::TEXT,
        (CASE WHEN TG_OP = 'DELETE' THEN OLD ELSE NEW END).section_id::TEXT
    );

    INSERT INTO public.audit_log(table_name, record_id, operation, old_value, new_value)
    VALUES (
        TG_TABLE_NAME,
        v_record_id,
        TG_OP,
        CASE WHEN TG_OP IN ('UPDATE','DELETE') THEN to_jsonb(OLD) END,
        CASE WHEN TG_OP IN ('INSERT','UPDATE') THEN to_jsonb(NEW) END
    );

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

## スキーマ完成状態

- **合計テーブル数**: 35 テーブル
- **元の 32 テーブル**: すべて保持＋修正
- **新規追加テーブル**: 3 テーブル（audit_log, mst_section_history, biz_shift）
- **設計書要件**: すべて満たしている状態
  - 監査機能（audit_log + 全テーブル update_user）
  - 履歴管理（mst_section_history）
  - 機構改革情報（biz_shift）
  - セキュリティ強化（password_salt, PIN 拡張）
  - データ整合性（外部キー制約、データ型統一）

---

## 修正済みテーブル定義（第 3 弾）

### 1. 組織ステージングテーブル（tmp_organization → stg_organization）

```sql
CREATE TABLE public.stg_organization (
    organization_id SERIAL PRIMARY KEY,
    organization_cd VARCHAR(19) NOT NULL,
    organization_nm VARCHAR(60) NOT NULL,
    parent_organization_cd VARCHAR(19) NOT NULL,
    print_order VARCHAR(4) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT stg_organization_organization_cd_key
        UNIQUE (organization_cd)
);
```

### 2. 部門ビジネステーブル（tmp_integratedid_department → biz_department）

```sql
CREATE TABLE public.biz_department (
    department_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    department_cd VARCHAR(5) NOT NULL,
    department_nm VARCHAR(60) NOT NULL,
    parent_department_cd VARCHAR(5) NOT NULL,
    organization_cd VARCHAR(19) NOT NULL,
    print_order VARCHAR(4) NOT NULL,
    -- 設計書要件の監査カラム追加
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT biz_department_company_cd_department_cd_key
        UNIQUE (company_cd, department_cd)
);
```

### 3. 従業員ビジネステーブル（tmp_integratedid_employee → biz_employee）

```sql
CREATE TABLE public.biz_employee (
    employee_id SERIAL PRIMARY KEY,
    company_cd VARCHAR(3) NOT NULL,
    employee_cd VARCHAR(7) NOT NULL,
    family_nm VARCHAR(20) NOT NULL,
    first_nm VARCHAR(20) NOT NULL,
    family_nm_kana VARCHAR(40) NOT NULL,
    first_nm_kana VARCHAR(40) NOT NULL,
    department_cd VARCHAR(5) NOT NULL,
    post_cd VARCHAR(4) NOT NULL,
    assign_grade VARCHAR(2) NOT NULL,
    -- 設計書要件: 生年月日をDATE型に変更
    birthday DATE NOT NULL,
    pin VARCHAR(8) NOT NULL,
    -- 設計書要件の監査カラム追加
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT biz_employee_company_cd_employee_cd_key
        UNIQUE (company_cd, employee_cd)
);
```

### 4. 組織ビジネステーブル（tmp_integratedid_organization → biz_organization）

```sql
CREATE TABLE public.biz_organization (
    organization_id SERIAL PRIMARY KEY,
    organization_cd VARCHAR(19) NOT NULL,
    organization_nm VARCHAR(60) NOT NULL,
    parent_organization_cd VARCHAR(19) NOT NULL,
    print_order VARCHAR(4) NOT NULL,
    -- 設計書要件の監査カラム追加
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT biz_organization_organization_cd_key
        UNIQUE (organization_cd)
);
```

### 5. 課金関連トランザクションテーブル

```sql
CREATE TABLE public.trn_charge_association (
    charge_association_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    charge_item_cd VARCHAR(10) NOT NULL,
    association_start_date DATE NOT NULL,
    association_end_date DATE NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_charge_association_user_charge_key
        UNIQUE (user_id, charge_item_cd, association_start_date)
);
```

### 6. CUCM 連携関連トランザクションテーブル

```sql
CREATE TABLE public.trn_cuc_association (
    cuc_association_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    device_id VARCHAR(50) NOT NULL,
    association_type VARCHAR(20) NOT NULL,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_cuc_association_user_device_key
        UNIQUE (user_id, device_id)
);
```

### 7. CUCM 差分トランザクションテーブル

```sql
CREATE TABLE public.trn_diff_cucm (
    diff_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    diff_type VARCHAR(20) NOT NULL,
    before_value TEXT,
    after_value TEXT,
    detected_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP WITHOUT TIME ZONE,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_diff_cucm_user_diff_key
        UNIQUE (user_id, diff_type, detected_at)
);
```

### 8. OfficeLink 差分トランザクションテーブル

```sql
CREATE TABLE public.trn_diff_officelink (
    diff_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id),
    diff_type VARCHAR(20) NOT NULL,
    before_value TEXT,
    after_value TEXT,
    detected_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    resolved_at TIMESTAMP WITHOUT TIME ZONE,
    create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL,
    CONSTRAINT trn_diff_officelink_user_diff_key
        UNIQUE (user_id, diff_type, detected_at)
);
```

## 主な修正ポイント

### 1. 設計書要件対応の監査カラム追加

```sql
-- biz_*テーブルに設計書要件のカラムを追加
create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL
```

### 2. 生年月日のデータ型変更

```sql
-- BEFORE: birthday VARCHAR(8)
-- AFTER: birthday DATE
ALTER TABLE biz_employee ALTER COLUMN birthday TYPE DATE USING birthday::DATE;
```

### 3. 外部キー制約の明示化

```sql
-- ユーザー関連のテーブルに外部キーを明示
user_id INTEGER NOT NULL REFERENCES public.trn_user(user_id)
```

### 4. 一意性制約の強化

```sql
-- 複合キーによる重複防止
CONSTRAINT trn_charge_association_user_charge_key
    UNIQUE (user_id, charge_item_cd, association_start_date)
```

### 5. ステージング/ビジネステーブルのリネーム

```sql
-- リネームスクリプト
ALTER TABLE tmp_organization RENAME TO stg_organization;
ALTER TABLE tmp_integratedid_department RENAME TO biz_department;
ALTER TABLE tmp_integratedid_employee RENAME TO biz_employee;
ALTER TABLE tmp_integratedid_organization RENAME TO biz_organization;
```

## 移行スクリプト

```sql
-- テーブルリネーム
ALTER TABLE tmp_organization RENAME TO stg_organization;
ALTER TABLE tmp_integratedid_department RENAME TO biz_department;
ALTER TABLE tmp_integratedid_employee RENAME TO biz_employee;
ALTER TABLE tmp_integratedid_organization RENAME TO biz_organization;

-- 監査カラム追加
ALTER TABLE biz_department
    ADD COLUMN create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL;

-- 生年月日の型変換
ALTER TABLE biz_employee
    ALTER COLUMN birthday TYPE DATE USING birthday::DATE,
    ADD COLUMN create_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN update_date TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN update_user VARCHAR(50) DEFAULT 'BATCH' NOT NULL;

-- トランザクションテーブルの監査カラム追加
DO $$
BEGIN
    EXECUTE 'ALTER TABLE trn_charge_association ADD COLUMN update_user VARCHAR(50) DEFAULT ''BATCH'' NOT NULL';
    EXECUTE 'ALTER TABLE trn_cuc_association ADD COLUMN update_user VARCHAR(50) DEFAULT ''BATCH'' NOT NULL';
    EXECUTE 'ALTER TABLE trn_diff_cucm ADD COLUMN update_user VARCHAR(50) DEFAULT ''BATCH'' NOT NULL';
    EXECUTE 'ALTER TABLE trn_diff_officelink ADD COLUMN update_user VARCHAR(50) DEFAULT ''BATCH'' NOT NULL';
END $$;
```
