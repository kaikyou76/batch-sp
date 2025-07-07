# ②🔥💥❗ 前回 Amazon Linux 2023 PostgreSQL 15 インストールの問題発見！！！！！！

Amazon Linux 2023 に PostgreSQL 15 をインストールという前回の手順問題が潜んでしまい、以降のトラブルと失敗をもたらしました。
PostgreSQL 15 のソースからのインストール手順を確認した結果、いくつかの **潜在的な問題点** が見受けられます。以下に原因と改善策を整理してご提供いたします。

---

## 🔍 主な問題点と改善案

### 🚫 問題 1: `systemd` サービス起動時のエラー（ユニットファイルの不備）

#### 💥 エラーメッセージ

```
Job for postgresql.service failed because the control process exited with error code.
See "systemctl status postgresql.service" and "journalctl -xeu postgresql.service" for details.
```

#### 🧰 原因

- `ExecStart` で使用しているコマンドが `forking` モードに適していない。
- `pg_ctl start` はデフォルトでバックグラウンド実行するため、`Type=forking` が必要ですが、一部の設定値が正しくありません。

#### ✅ 改善策：サービスファイルの修正

```ini
// ... existing code ...
[Unit]
Description=PostgreSQL database server
Documentation=https://www.postgresql.org/docs/15/
After=network.target

[Service]
Type=forking
User=postgres
Group=postgres
ExecStart=/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data -l /usr/local/pgsql/data/server.log start
ExecStop=/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data stop
Restart=on-failure
PrivateTmp=true
TimeoutSec=300

[Install]
WantedBy=multi-user.target
```

（ExecStart=/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data -l /usr/local/pgsql/data/server.log start）について

- `-l /usr/local/pgsql/data/server.log` を追加することで、起動時と以降のログを明示的に server.log に出力します。
- ログファイルの場所を自分で指定できるので、トラブルシュートや運用時に便利。

その後、以下のコマンドで再読み込みします：

```bash
sudo systemctl daemon-reload
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

---

### 🚫 問題 2: PostgreSQL 起動時にロックファイルや PID ファイルが残っている

#### 💥 エラーメッセージ

```
waiting for server to start.... stopped waiting
pg_ctl: could not start server
```

#### 🧰 原因

- 以前の起動処理が正常終了せず、`postmaster.pid` や `postmaster.opts` といったファイルが残留しています。

#### ✅ 改善策：不要なロックファイルの削除

一度 PostgreSQL を停止し、以下のファイルを削除してください：

```bash
sudo -i -u postgres
rm -f /usr/local/pgsql/data/postmaster.pid
rm -f /usr/local/pgsql/data/postmaster.opts
```

その後、再度起動します：

```bash
/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data -l logfile start
```

---

### 🚫 問題 3: `/usr/local/pgsql/data` ディレクトリの権限ミスマッチ

#### 💥 エラーメッセージ例（ログ出力）

```
FATAL:  data directory "/usr/local/pgsql/data" has invalid permissions
```

#### 🧰 原因

- PostgreSQL はデータディレクトリが `postgres` ユーザーによって所有されていない場合、起動できません。

#### ✅ 改善策：所有権・パーミッションの確認

```bash
sudo chown -R postgres:postgres /usr/local/pgsql/data
sudo chmod 700 /usr/local/pgsql/data
```

---

### 🚫 問題 4: 他の PostgreSQL プロセス or ポート競合

#### 💥 エラーメッセージ

```
psql: error: connection to server on socket "/tmp/.s.PGSQL.5432" failed: Connection refused
```

#### 🧰 原因

- 別の PostgreSQL インスタンス or 他プロセスがポート `5432` を使用中。

#### ✅ 改善策：ポート解放

現在使用中のポートを確認します：

```bash
sudo netstat -tulnp | grep :5432
```

該当する PID があれば強制終了します：

```bash
sudo kill -9 <PID>
```

---

### 🚫 問題 5: `initdb` 後にサーバーが起動しない（ログ確認必須）

#### 💥 エラーメッセージなし ⇒ 実際には起動していない可能性あり

#### ✅ 改善策：ログファイルを確認

ログファイル `/usr/local/pgsql/data/server.log` を開いて、具体的なエラー内容を確認します：

```bash
cat /usr/local/pgsql/data/server.log
```

たとえば、次のような記述があれば、設定を見直す必要があります：

```
could not bind IPv4 address "0.0.0.0": Address already in use
```

---

## ✅ 正しいインストール手順（まとめ）

### 1. 必要なパッケージのインストール

```bash
sudo dnf groupinstall "Development Tools" -y
sudo dnf install -y readline-devel zlib-devel openssl-devel libxml2-devel libxslt-devel python3-devel
```

### 2. ソースコードのダウンロードとコンパイル

```bash
cd /tmp
wget https://ftp.postgresql.org/pub/source/v15.7/postgresql-15.7.tar.gz
tar -zxvf postgresql-15.7.tar.gz
cd postgresql-15.7
./configure --prefix=/usr/local/pgsql --with-openssl
make
sudo make install
```

### 3. ユーザー・データディレクトリ作成

```bash
sudo groupadd postgres
sudo useradd -g postgres postgres
sudo mkdir /usr/local/pgsql/data
sudo chown postgres:postgres /usr/local/pgsql/data
sudo chmod 700 /usr/local/pgsql/data
```

### 4. 初期化

```bash
sudo su - postgres
/usr/local/pgsql/bin/initdb -D /usr/local/pgsql/data
```

### 5. systemd サービス登録（上記の編集済みファイルを使用）

### 6. 起動と自動起動設定

```bash
sudo systemctl daemon-reload
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

### 7. 接続確認

```bash
psql -c "SELECT version();"
```

---

## 📌 まとめ表

| 項目                | 内容                                                       |
| ------------------- | ---------------------------------------------------------- |
| ✅ 成功した処理     | `initdb` による初期化                                      |
| ❌ 失敗している処理 | `systemctl` による起動、`psql` 接続                        |
| 🔧 主な原因         | サービスファイル不備、ロックファイル残留、権限・ポート競合 |
| 💡 推奨対応         | 不要なロックファイル削除 + サービスファイル修正 + ログ確認 |

---

## 🆘 追加サポート

以下の情報をいただければ、さらに詳しい分析が可能です：

```bash
# PostgreSQL ログの確認
cat /usr/local/pgsql/data/server.log

# 状態確認
/usr/local/pgsql/bin/pg_ctl -D /usr/local/pgsql/data status
```

お気軽に追加質問ください！
