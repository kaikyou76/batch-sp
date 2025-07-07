# ポート 5432 がすでに使用中問題の解決

**ポート `5432` がすでに使用中**

- 別の PostgreSQL インスタンス or 他のプロセスがポートを占有している場合があります。

## 🛠️ 解決手順

### Step 1: 現在の PostgreSQL プロセスを確認する

```bash
ps aux | grep postgres
```

出力例：

```
postgres 1234 ... /usr/local/pgsql/bin/postgres
```

該当する PID があれば、強制終了します。

```bash
kill -9 <PID>
```
