<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">データベースの削除方法</span>

PostgreSQL でエラー:

```
ERROR: データベース"irdb"は他のユーザからアクセスされています
DETAIL: 他にこのデータベースを使っている 2 個のセッションがあります。
```

これは、**`irdb`データベースに他のセッション（接続）が存在するため、削除できない**という意味です。

---

## 🔧 解決方法の手順

### 1. 現在の接続セッションを確認（`irdb`を使用中のセッション）

```sql
SELECT pid, usename, application_name, client_addr, state
FROM pg_stat_activity
WHERE datname = 'irdb';
```

---

### 2. セッションを強制終了（`irdb`を使ってるプロセスを止める）

以下の SQL で、**`irdb`を使用している全セッションを終了**します：

```sql
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'irdb'
  AND pid <> pg_backend_pid();  -- 自分自身は除外
```

⚠️**注意**: 他のユーザーやアプリケーションが使用していたら切断されます。

---

### 3. セッションを切断した後にデータベースを削除

```sql
DROP DATABASE irdb;
```

---

## 🧠 ワンライナーでやるなら（全部まとめて）

```sql
-- セッションを切断
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE datname = 'irdb'
  AND pid <> pg_backend_pid();

-- データベース削除
DROP DATABASE irdb;
```

---

## 💡 補足：pgAdmin でやるなら

1. 他のタブで「irdb」データベースに接続していないか確認し、**pgAdmin 内の接続もすべて閉じる**。
2. 左側の「irdb」右クリック → データベースを削除。
3. それでもエラーが出る場合は、上記 SQL を「別のデータベース」（例：`postgres`）に接続したクエリツールで実行。

---

何かトラブルやエラーが出たら教えてください。実行中の SQL も見ます！
