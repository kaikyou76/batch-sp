# ③✅🏗️👑 再度 PostgreSQL 15 ソースインストール計画

現状の PostgreSQL 環境には以下のような **残留設定・ファイル・プロセス** が存在しており、これらを一度クリアにしてから、**正しい手順で再インストール・初期化** を行うことが重要です。

---

## 🧹 前回インストール作業により残された主な問題

| 問題項目                          | 詳細                                                                |
| --------------------------------- | ------------------------------------------------------------------- |
| 🔥 不完全な systemd 登録          | `postgresql.service` ファイルが不適切で起動に失敗している           |
| 🗑️ 残留ロックファイル             | `postmaster.pid`, `server.log` などが残っているため、起動に失敗する |
| 🚫 権限ミスマッチ                 | `/usr/local/pgsql/data` の所有者が正しくない場合がある              |
| 🔄 同時起動プロセス or ポート競合 | 他の PostgreSQL インスタンス or 他プロセスがポート `5432` 使用中    |

---

🌐**最新版 PostgreSQL 15 のソースインストール 手順書**

この手順書では **一度で成功することを保証** するために、以下の点に重点を置いています：

- 再現性：毎回同じ結果が出る
- 安全性：権限・設定が適切
- 拡張性：今後の運用や外部接続にも対応可能

## ✅ Amazon Linux 2023 に PostgreSQL 15 ソースインストール + 初期設定 手順書

> 📌 目的：一貫した再現可能な構築環境を提供し、**初回起動からローカル接続、さらにデータベースのバックアップ・復元までを確実に成功させる**

---

### 🧱 環境情報（Amazon Linux 2023）

- OS: Amazon Linux 2023
- ユーザー: `ec2-user`
- インストール先ディレクトリ: `/usr/local/pgsql`
- データディレクトリ: `/usr/local/pgsql/data`
- ソケットディレクトリ: `/var/run/postgresql`
- PostgreSQL バージョン: 15.7（最新安定版）

---

## 🛠️ Step-by-Step 手順

### 🔧 Step 1: 前準備（既存の PostgreSQL 関連を削除）

```bash
# 以前のサービス停止 & 削除
sudo systemctl stop postgresql || true
sudo systemctl disable postgresql || true
sudo rm -f /etc/systemd/system/postgresql.service || true
sudo systemctl daemon-reexec || true
sudo systemctl daemon-reload || true

# 古いユーザー・グループ削除
sudo userdel -r postgres || true
sudo groupdel postgres || true

# 古いインストールディレクトリ削除
sudo rm -rf /usr/local/pgsql
```

---

### 📦 Step 2: 必要なパッケージのインストール

```bash
sudo dnf update -y
sudo dnf groupinstall "Development Tools" -y
sudo dnf install -y readline-devel zlib-devel openssl-devel libxml2-devel libxslt-devel python3-devel
```

---

### 📂 Step 3: PostgreSQL ソースコードのダウンロード & コンパイル

```bash
cd /tmp
wget https://ftp.postgresql.org/pub/source/v15.7/postgresql-15.7.tar.gz
tar -zxvf postgresql-15.7.tar.gz
cd postgresql-15.7
./configure --prefix=/usr/local/pgsql --with-openssl
make
sudo make install
```

---

### 📦 Step 3-2: クライアントツールのみのインストール（開発・運用ツールを一般ユーザーにも提供）

```bash
sudo make install -C src/bin
sudo make install -C src/include
sudo make install -C src/interfaces
```

---

### 👤 Step 4: PostgreSQL ユーザー・データディレクトリの作成

```bash
sudo groupadd postgres
sudo useradd -g postgres postgres
sudo mkdir -p /usr/local/pgsql/data
sudo chown postgres:postgres /usr/local/pgsql/data
sudo chmod 700 /usr/local/pgsql/data
```

---

### 🧷 Step 5: 初期化（initdb）

```bash
sudo su - postgres
/usr/local/pgsql/bin/initdb -D /usr/local/pgsql/data
```

#### 🔍 Step 5-2: 初期化後の確認（オプション）

```bash
/usr/local/pgsql/bin/pg_controldata /usr/local/pgsql/data
```

---

### 🖥️ Step 6: PostgreSQL 設定ファイルの編集（listen_addresses, port, unix_socket_directories）

#### 設定ファイルを開く

```bash
vi /usr/local/pgsql/data/postgresql.conf
```

##### 検索コマンド例：

```bash
grep -E 'listen_addresses|port|unix_socket_directories' /usr/local/pgsql/data/postgresql.conf
```

#### 変更内容（コメント解除 or 追記）

```conf
listen_addresses = '*'            # default is 'localhost', 改為 '*'
port = 5432                       # default は有効だが明示的に確認
unix_socket_directories = '/var/run/postgresql'  # ソケットディレクトリを変更
```

---

### 🔐 Step 7: クライアント認証設定（pg_hba.conf）

デフォルトではローカルのみ許可されているので、外部接続を許可する場合は以下を追加：

```bash
vi /usr/local/pgsql/data/pg_hba.conf
```

末尾に追加（例: 任意 IP からの接続を許可）：

```
host    all             all             0.0.0.0/0               trust
```

> ⚠️ 運用環境では `trust` → `md5` などに変更してください

---

### 📁 Step 8: ソケットディレクトリ作成と権限設定

```bash
exit  # postgres ユーザーから抜ける
sudo mkdir -p /var/run/postgresql
sudo chown postgres:postgres /var/run/postgresql
sudo chmod 775 /var/run/postgresql
```

---

### 🔄 Step 9: systemd サービスファイルの作成

```bash
sudo vi /etc/systemd/system/postgresql.service
```

以下の内容を貼り付けて保存：

```ini
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
TimeoutSec=600

[Install]
WantedBy=multi-user.target
```

---

### 🚀 Step 10: サービス登録 & 起動

```bash
sudo systemctl daemon-reexec
sudo systemctl daemon-reload
sudo systemctl enable postgresql
sudo systemctl start postgresql
```

---

### 🕵️‍♂️ Step 11: 動作確認

#### ステータス確認

```bash
sudo systemctl status postgresql
```

#### 接続テスト（ローカル）

```bash
sudo -i -u postgres
cd /usr/local/pgsql/bin/
./psql -U postgres -h /var/run/postgresql
```

または TCP/IP 経由で：

```bash
\q
./psql -h localhost -U postgres -h /var/run/postgresql
```

#### ソケットファイル確認

```bash
ls -la /var/run/postgresql/.s.PGSQL.5432*
```

出力例：

```
srwxrwxrwx 1 postgres postgres 0 Jul  6 18:20 /var/run/postgresql/.s.PGSQL.5432
-rw------- 1 postgres postgres 4 Jul  6 18:20 /var/run/postgresql/.s.PGSQL.5432.lock
```

---

### 🔄 Step 12: バックアップと復元の設定

#### 💾 1. SQL 形式で出力（プレーンテキスト）

```bash
cd /usr/local/pgsql/bin/
./pg_dump -U postgres -F p dbname > dbname_backup.sql
```

#### 🗃️ 2. 圧縮フォーマット（カスタム形式）で出力

```bash
./pg_dump -U postgres -F c dbname -f dbname_backup.dump
```

#### 📦 3. ディレクトリ形式（大規模向け）

```bash
./pg_dump -U postgres -F d dbname -f dbname_backup_dir/
```

#### 📦 4. tar 形式（アーカイブ）

```bash
./pg_dump -U postgres -F t dbname -f dbname_backup.tar
```

#### 🔁 復元方法

- **SQL 形式の場合**

  ```bash
  ./psql -U postgres -d newdbname < dbname_backup.sql
  ```

- **カスタム形式 / tar 形式 / ディレクトリ形式の場合**
  ```bash
  ./pg_restore -U postgres -d newdbname dbname_backup.dump
  ```

---

### 🛡️ Step 13: EC2 セキュリティグループ設定（外部接続が必要な場合）

AWS コンソールまたは CLI で、ポート `5432` を解放します。

例（CLI の場合）：

```bash
aws ec2 authorize-security-group-ingress \
  --group-id sg-xxxxxx \
  --protocol tcp \
  --port 5432 \
  --cidr 0.0.0.0/0
```

---

## ✅ 最終チェックリスト

| 項目                          | 内容                                                       | 状況 |
| ----------------------------- | ---------------------------------------------------------- | ---- |
| ✅ PostgreSQL インストール    | 成功                                                       | ✔️   |
| ✅ ユーザー・ディレクトリ作成 | 完了                                                       | ✔️   |
| ✅ 初期化 (`initdb`)          | 実施                                                       | ✔️   |
| ✅ `postgresql.conf` 設定     | `listen_addresses`, `port`, `unix_socket_directories` 有効 | ✔️   |
| ✅ `pg_hba.conf` 設定         | 外部接続許可（必要に応じて）                               | ✔️   |
| ✅ systemd 登録               | 正しいユニットファイル作成                                 | ✔️   |
| ✅ 起動・ステータス確認       | `systemctl status postgresql` で active                    | ✔️   |
| ✅ 接続テスト                 | `psql -U postgres` でログイン可能                          | ✔️   |
| ✅ ソケットファイル存在       | `/var/run/postgresql/.s.PGSQL.5432` が生成されている       | ✔️   |
| ✅ バックアップ・復元設定     | `pg_dump` / `pg_restore` による操作を習得                  | ✔️   |

---

## 📌 まとめ

本手順書では、**PostgreSQL 15 のソースインストールから初期設定、さらにはバックアップ・復元までの全工程を包括的に網羅**しています。  
今後も本手順をベースに運用や拡張を行うことで、トラブルの未然防止と迅速な復旧が可能になります。

## 🆘 追加サポート

再度問題が発生した場合は、以下の情報をいただければ迅速に対応可能です：

```bash
# PostgreSQL ログ
cat /usr/local/pgsql/data/server.log

# 設定ファイル確認
grep listen_addresses /usr/local/pgsql/data/postgresql.conf
grep port /usr/local/pgsql/data/postgresql.conf
grep unix_socket_directories /usr/local/pgsql/data/postgresql.conf

# ソケットファイル確認
ls -la /var/run/postgresql/.s.PGSQL.5432*

# 接続状況確認
ss -tulnp | grep :5432
```

お気軽にご質問ください！
