## environment.properties

#### (src/main/resources/environment.properties)

```properties
################################################################
# MasterParameter (TypeModel) 取込対象Name ","区切りで列挙
################################################################
typemodel.name=Cisco 6941, Cisco 7911,Cisco 7912, Cisco 7936, Cisco 7937, Cisco 7942, Cisco 7960, Cisco 7962, Cisco 9971

################################################################
#FTPディレクトリ
################################################################
# Win32
InputDir.Win32=/files/importfiles/
InputCompDir.Win32=/files/complatedfiles/
OutputDir.Win32=/var/www/download/data/export/batch/
OutputDir2.Win32=db/
OutputDir3.Win32-associate/
OutputDir4.Win32-circuitlist/
OutputRetireDir.Win32=/var/www/download/logs/batch/

# Linux
InputDir.Linux=/home/batchuser/files/importfiles/
InputCompDir. Linux=/home/batchuser/files/complatedfiles/
OutputDir.Linux=/var/www/download/data/export/batch/
OutputDir2.Linux=db/
OutputDir3.Linux-associate/
OutputDir4.Linux-circuitlist/
OutputRetireDir.Linux=/var/www/download/logs/batch/

##################################################################
#ロックファイルのパス
##################################################################
# Win32
#LockFile.Win32=/var/www/download/tmp/cucm.lock
LockFile=/var/www/download/tmp/cucm.lock
# Linux
LockFile.Linux=/var/www/download/tmp/cucm_app_is_updating.lock

##################################################################
# エラーファイル設定
##################################################################
OutputErrFileDir.Win32=C:\\logs\\errors
OutputErrFileDir.Linux=/var/log/batch/errors
OutputErrFileNm=system_error

##################################################################
#人事情報取り込み
##################################################################
BizOrganizationTableName=BIZ_ORGANIZATION
BizDepartmentTableName=BIZ_DEPARTMENT
BizEmployeeTableName=BIZ_EMPLOYEE
BizAdTableName=BIZ_AD
BizShiftTableName=BIZ_SHIFT

TmpBizOrganizationTableName=TMP_INTEGRATEDID_ORGANIZATION

BizOrganizationCsvFileName=organization.csv
BizDepartmentCsvFileName=department.csv
BizEmployeeCsvFileName=employee.csv
BizAdCsvFileName=ad.csv
BizShiftCsvFileName=shift.csv

Eof.Ad=EOFAD
Eof.Am=EOFAM

DumOrganizationCsvFileName=dum_organization.csv
DumDepartmentCsvFileName=dum_department.csv
DumEmployeeCsvFileName=dum_employee.csv

#RetiredUserFileName=retired_users.log
TmpIntOrganizationCsvFileName=organization.csv
TmpAdCsvFileName=biz_ad.csv
TmpIntDepartmentCsvFileName=bizdepartment.csv
TmpIntEmployeeCsvFileName=biz_employee.csv
RetiredUserFileName=retired_user.csv
JoinedUserFileName=joined_user.csv
ReceiveDir=

#################################################################
#人事情報取り込み(CSV Header)
#################################################################
BizAdCsvHeader=USER_LOGON_NAME,DISP_NAME,LAST_NAME,FIRST_NAME,MAIL,POSITION
BizDepartmentCsvHeader=ORGANIZATION_CODE,COMPANY_CODE,COMPANY_NAME,CONTROL_CODE,CONTROL_NAME,CHARGE_CODE,CHARGE_NAME,PARENT_DEPARTMENT_CODE,PARENT_DEPARTMENT_NAME,DEPARTMENT_CODE,DEPARTMENT_NAME,DEPARTMENT_NAME_ENGLISH,ZIP_CODE,ADDRESS,TELEPHONE_NUMBER,FAX_NUMBER,EXTENSION_NUMBER,CLASS_SALES,CLASS_DATA_INPUT,UPDATE_DATE
BizEmployeeCsvHeader=ORGANIZATION_CODE,COMPANY_CODE,DEPARTMENT_CODE,DEPARTMENT_NAME,EMPLOYEE_CODE,EMPLOYEE_NAME_KANJI,EMPLOYEE_NAME_KANA,EXECUTIVE_POST_CODE,POST_LINEAGE_CODE,CLASS,SEX_CODE,BIRTHDAY,MAIL_ADDRESS,ASSIGN_GRADE,CLASS_TEL_ADDRESSBOOK,CLASS_TEMPORARY_TRANSFER,MAIL_ADDRESS_AUTOMADE_FLAG,CLASS_DATA_INPUT,UPDATE_DATE
BizOrganizationCsvHeader=ORGANIZATION_CODE,ORGANIZATION_NAME,ORGANIZATION_NUMBER,ORGANIZATION_ABBREVIATED_NAME,PRINT_ORDER,CLASS_SALES,CLASS_DATA_INPUT,UPDATE_DATE
BizShiftCsvHeader=OLD_BRANCH_CODE,OLD_COMPANY_CODE,OLD_DEPARTMENT_CODE,NEW_BRANCH_CODE,NEW_COMPANY_CODE,NEW_DEPARTMENT_CODE

TmpBizOrganizationCsvHeader=ORGANIZATION_CD,ORGANIZATION_NM,ORGANIZATION_NO,ORGANIZATION_ABBREVIATED_NM,PRINT_ORDER,CLASS_SALES,CLASS_DATA_INPUT,UPDATE_DATE

#################################################################
#CSV EXPORT IMPORT NAME
#################################################################
VoiceCsvHeader=DIRECTORY NUMBER,LOGGER_DATA
ChargeCsvHeader=H,CCMGRP,department,division.teInum,6,7,8
CUCCsvHeader=last_name,first_name,directory_number,mail_address,CUC_data
TeIDirCsvHeader=biz_employee_id,section_id,external_phone_number,directory_number,call_pickup_group_no
ADCsvHeader=user_logon_name,disp_name,last_name,first_name,mail,position,directory_number
LineListCsvHeader=statusname,directorynumber,dialinnumber,lineindex,kanjiusername,sectionusername,pickupgroupno,voicemailflg,busydestination,chargeassociationbranchid,chargeassociationparentsectionid,chargeassociationsectionid,chargeremarks,loggerdataname,teldirdata,teltypemodel,macaddress,phonebuttontemplete,branchtelname,sectiontelname,callingsearchspacename,orgaddonmodulenamel,orgaddonmodulename2,orgringsettingname,tellineremarks,linetextlabel,noansdestination,externalphonenumbermask

VoiceTableName=VOICE_LOGGER_ASSOCIATION
CsvImport.Voice=VOICE.csv

CsvExport.Voice=EXPORT_VOICE.csv
CsvExport.CUC=EXPORT_CUC.csv
CsvExport.Charge=EXPORT_CHARGE.csv
CsvExport.TelDir=EXPORT_TELDIR.csv
CsvExport.AD=EXPORT_AD.csv
CsvExport.LineList=EXPORT_LINE_LIST.csv

#################################################################
# ALL TABLE NAME 全TBL一括EXPIMP対象
#################################################################
AllTable=app_user,biz_ad,biz_department,biz_employee,biz_organization,biz_shift,c_cucm_line,c_cucm_phone,c_cucm_phone_line,calling_search_space,charge_association,unity_association,cucm_line,cucm_master_last_update,cucm_phone,devicepool,dum_department,dum_employee,dum_organization,exclude_executive,line_reflected_cluster,location,m_branch,m_cluster,m_enduser_config,m_enduser_config_access_group,m_line_config,m_phone_config,m_phone_vendor_config,m_section,phone_reflected_cluster,phone_template,pickup_group,f_cucm_phone_line,r_cucm_user_phone,r_section_branch,r_user_section,tel_dir_association,threshold,type_model,voice_logger_association

```
