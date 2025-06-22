# 参照制約の状態を確認

```sql
-- 参照制約の状態を確認
SELECT
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM
    information_schema.table_constraints tc
    JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
    JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'biz_organization';

```

- 結果

```
"table_name","column_name","foreign_table_name","foreign_column_name"
"mst_section","organization_cd","biz_organization","organization_cd"
```

この SQL 文は、**PostgreSQL**などのデータベースで使われる標準的なメタデータ（`information_schema`）を参照して、\*\*「biz_organization テーブルを参照している外部キーの一覧」\*\*を取得するものです。

---

### 🔍 ざっくり意味（日本語）

\*\*「`biz_organization` テーブルを外部キーとして参照しているテーブルと、そのカラム名を調べる」\*\*ための SQL です。

---

### 🧠 詳しく分解して解説

```sql
SELECT
    tc.table_name,              -- 外部キー制約を持つテーブルの名前
    kcu.column_name,            -- 外部キーとして定義されているカラムの名前
    ccu.table_name AS foreign_table_name,      -- 参照されている（=親）テーブル名（ここではbiz_organization）
    ccu.column_name AS foreign_column_name     -- 親テーブルのどのカラムを参照しているか
```

---

```sql
FROM
    information_schema.table_constraints tc
```

- 制約の一覧を含むビュー（テーブル制約）。
- `tc.constraint_type = 'FOREIGN KEY'` なので「外部キー制約」のみに限定。

---

```sql
JOIN information_schema.key_column_usage kcu ON tc.constraint_name = kcu.constraint_name
```

- 外部キー制約で「どのカラムが使われているか」を取得。

---

```sql
JOIN information_schema.constraint_column_usage ccu ON ccu.constraint_name = tc.constraint_name
```

- 外部キーが「どのテーブル・カラムを参照しているか（＝参照先）」を取得。

---

```sql
WHERE
    tc.constraint_type = 'FOREIGN KEY'
    AND ccu.table_name = 'biz_organization';
```

- 参照されている（親）テーブルが `biz_organization` である外部キーだけを抽出。

---

### ✅ 結果の例（仮）

| table_name | column_name | foreign_table_name | foreign_column_name |
| ---------- | ----------- | ------------------ | ------------------- |
| employee   | org_id      | biz_organization   | id                  |
| department | parent_id   | biz_organization   | id                  |

このように、「`biz_organization` を参照しているテーブルとカラム」を知ることができます。

---

### 💬 要約

この SQL は：

> 「`biz_organization` テーブルを外部キーとして参照している**他のテーブルとカラム名**を一覧で取得する」

という目的で使われます。

---

必要であれば、この逆（`biz_organization` が参照している外部キー）を調べる SQL も提供できます！
