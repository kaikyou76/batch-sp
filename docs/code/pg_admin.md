## pgAdmin でデータベースのアクセスユーザー名とパスワードを設定・確認する方法は

pgAdmin でデータベースのアクセスユーザー名とパスワードを**設定・確認**する方法は、主に以下の 2 つの場面で関係します：

---

## ✅ **1. PostgreSQL サーバーのユーザー名・パスワードを確認する方法**

### 方法 ①：pgAdmin で確認（保存されていれば）

1. **pgAdmin を開く**
2. 左ペインの「Servers」を展開 → 対象のサーバーを右クリック →「Properties」を選択
3. 「General」タブで **ユーザー名（Username）** が表示される（たとえば `postgres` など）
4. 「Connection」タブに進み、ここで **保存済みパスワード（Save password）** のチェックがオンになっていれば、pgAdmin が内部的に保存しています（ただし**表示はされません**）

> 💡 **パスワードは表示されません**。わからなくなった場合は再設定が必要です（後述）。

---

## ✅ **2. PostgreSQL に新しいユーザーを作成・パスワードを設定する方法**

### 方法 ②：SQL でユーザー追加・パスワード設定

pgAdmin の「Query Tool」で以下の SQL を実行します：

```sql
-- 新しいユーザーを作成し、パスワードを設定
CREATE USER your_user_name WITH PASSWORD 'your_password';

-- 例：管理者権限を与えたい場合
ALTER USER your_user_name WITH SUPERUSER;
```

既存ユーザーのパスワードを再設定する場合：

```sql
-- 既存ユーザーのパスワードを変更
ALTER USER your_user_name WITH PASSWORD 'new_password';
```

---

## ✅ **3. pgAdmin にユーザー情報を登録してログインする**

1. pgAdmin 左側ペインで「Servers」を右クリック →「Create」→「Server」
2. 「General」タブで名前を任意に入力（例：`My Local DB`）
3. 「Connection」タブで以下を入力：

   - **Host name/address**: 通常は `localhost`（またはサーバーの IP）
   - **Port**: 5432（デフォルト）
   - **Username**: `postgres` など、作成したユーザー名
   - **Password**: そのユーザーのパスワード
   - **Save Password**: チェックを入れると次回から入力不要

---

## ✅ **補足：psql でユーザー一覧を確認したい場合（pgAdmin 以外）**

pgAdmin の「Query Tool」で以下を実行：

```sql
-- PostgreSQLのすべてのロール（ユーザー）一覧を表示
\du
```

または

```sql
SELECT usename FROM pg_user;
```

---

## ❓ よくあるトラブルと対策

| 問題                       | 解決法                                                            |
| -------------------------- | ----------------------------------------------------------------- |
| パスワードを忘れた         | 管理者ユーザーでログインし `ALTER USER` で再設定                  |
| ユーザーがログインできない | `pg_hba.conf` の設定を確認（`md5` または `scram-sha-256` にする） |
| pgAdmin で接続エラー       | ホスト名・ポート・ユーザー名・パスワードを再確認                  |

---

## 🚀✅ **パスワードを忘れた場合**

パースワードを忘れた場合は以下の手順でパスワードリセットする必要があります。

---

### **🔑 パスワードリセット手順（Windows 版）**

#### **1. PostgreSQL サービスを停止**

```powershell
# 管理者権限でPowerShellを開き実行
Stop-Service postgresql-x64-13 -Force
```

```powershell
PS C:\Users\kaikyou> Get-Service | Where-Object { $_.DisplayName -like "*PostgreSQL*" }

Status   Name               DisplayName
------   ----               -----------
Stopped  postgresql-x64-13  postgresql-x64-13 - PostgreSQL Serv...


PS C:\Users\kaikyou>
```

#### **2. パスワードチェックを無効化**

1. 以下のファイルをメモ帳で開きます（管理者権限が必要）:
   ```
   C:\Program Files\PostgreSQL\13\data\pg_hba.conf
   ```
2. **最初の設定ブロック**を以下のように変更:
   ```diff
   - host    all             all             127.0.0.1/32            md5
   + host    all             all             127.0.0.1/32            trust
   ```

#### **3. PostgreSQL サービス再起動**

```powershell
Start-Service postgresql-x64-13
```

#### **4. パスワード再設定**

```powershell
# PostgreSQLにパスワードなしで接続
& "C:\Program Files\PostgreSQL\13\bin\psql.exe" -U postgres

# パスワード変更コマンド実行（psql内で）
ALTER USER postgres WITH PASSWORD '新しいパスワード';
\q
```

#### **5. 設定を元に戻す**

1. `pg_hba.conf` を再編集:
   ```diff
   - host    all             all             127.0.0.1/32            trust
   + host    all             all             127.0.0.1/32            md5
   ```
2. サービス再起動:
   ```powershell
   Restart-Service postgresql-x64-13
   ```

---

### **✅ pgAdmin 4 での接続方法**

1. サーバー接続ダイアログで:
   - **Username**: `postgres`
   - **Password**: 先ほど設定した新しいパスワード
   - **Save Password** にチェック ✔

---

### **⚠️ 注意点**

- **デフォルトパスワード**が分かる場合（インストール時にメモしたなど）は、それを使用してください
- この方法は**ローカル環境のみ**で実行してください（本番環境では危険）
- パスワードは必ずメモしておくこと

---

### **🔍 パスワードが分かる場合の確認方法**

1. インストール時のメモを探す
2. 以下の場所にパスワードが保存されている可能性:
   ```
   C:\Program Files\PostgreSQL\13\installer.log
   ```
3. 他の管理者に確認

---

この手順で必ず接続できるようになります。パスワード変更後は、**pgAdmin の接続設定も更新**するのを忘れずに！
