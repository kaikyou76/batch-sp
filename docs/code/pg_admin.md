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

必要であれば、**pgAdmin から新しいデータベースユーザーを GUI で作成する手順**もお伝えできます。興味ありますか？
