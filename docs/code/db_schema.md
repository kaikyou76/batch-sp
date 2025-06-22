# データベーススキーマをエクスポートする方法

ありがとうございます。おそらく混乱の原因は：

🔹 PowerShell では `^`（コマンド継続記号）は **サポートされていません**。
🔹 `^` は **コマンドプロンプト（cmd.exe）用** の記号です。
🔹 PowerShell で複数行コマンドを使う場合は、行末にバックティック（ `` ` ``）または改行なしで書く必要があります。

---

## ✅ PowerShell での `pg_dump` コマンド（環境変数を使ってパスワード指定）

```powershell
& "C:\Program Files\PostgreSQL\13\bin\pg_dump.exe" `
  --file "D:\DDL.sql" `
  --host "localhost" `
  --port "5432" `
  --username "postgres" `
  --format=plain `
  --schema-only `
  --verbose `
  irdb
```

🔹 ポイント：

- `$env:PGPASSWORD = "AM2013japan"` ← これは環境変数としてパスワードを一時的に設定
- `&` を使ってパスを実行（これは PowerShell の構文）
- コマンド継続には `` ` ``（バックティック）を使う、またはすべて 1 行でも OK

---

## ✅ すべて 1 行で実行したい場合（PowerShell）

```powershell
$env:PGPASSWORD = "AM2013japan"; & "C:\Program Files\PostgreSQL\16\bin\pg_dump.exe" --file "D:\DDL.sql" --host "localhost" --port "5432" --username "postgres" --format=plain --schema-only --verbose irdb
```

---

## ✅ エクスポートされる内容

このコマンドで生成される `D:\DDL.sql` は：

- **irdb データベースの全テーブルスキーマ**
- **テーブル定義のみ**（`--schema-only`）
- **データなし**
- **deleted BOOLEAN DEFAULT FALSE NOT NULL** が含まれていればそのまま DDL に反映されます。

---

もし実行してもうまくいかない場合は、出力メッセージをコピーして教えてください。必要であれば `.bat` ファイルも用意できます。
