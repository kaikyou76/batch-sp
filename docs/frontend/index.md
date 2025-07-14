# frontend 　です。

#### 已深度思考

> Windows 10 環境での Graphiti MCP Server のセットアップ手順を日本語で詳しく説明します。Docker を使用するため、まず Docker Desktop のインストールから始めます。
>
> ### ステップ 1: Docker Desktop のインストール

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) からインストーラーをダウンロードします。
2. ダウンロードした`Docker Desktop Installer.exe`を実行します。
3. インストール中に「Enable WSL 2 Features」を有効にするオプションが表示されたらチェックを入れます（WSL 2 が利用できない場合は、Hyper-V を有効にする必要があります）。
4. インストール後、PC を再起動します。
5. Docker Desktop を起動し、タスクバーに Docker のアイコンが表示されることを確認します。
   > ### ステップ 2: リポジトリのクローン
6. Git をインストールしていない場合は、[Git for Windows](https://git-scm.com/download/win)をダウンロードしてインストールします。
7. コマンドプロンプトまたは PowerShell を開き、以下のコマンドを実行してリポジトリをクローンします：
   ```bash
   git clone https://github.com/gifflet/graphiti-mcp-server.git
   cd graphiti-mcp-server
   ```
   > ### ステップ 3: 環境変数の設定
8. クローンしたディレクトリ内にある`.env.sample`ファイルをコピーして`.env`ファイルを作成します。
   ```bash
   copy .env.sample .env
   ```
9. メモ帳などのテキストエディタで`.env`ファイルを開き、以下のように編集します：
   ```env
   # Required for LLM operations
   OPENAI_API_KEY=your_openai_api_key_here  # あなたのOpenAI APIキーを入力
   MODEL_NAME=gpt-4o
   >    # Neo4j Configuration (defaults work with Docker)
   NEO4J_URI=bolt://neo4j:7687
   NEO4J_USER=neo4j
   NEO4J_PASSWORD=demodemo
   ```
   - `OPENAI_API_KEY`には、[OpenAI の API キー](https://platform.openai.com/api-keys)を入力します。
   - 他の設定はデフォルトのままで構いません。
     > ### ステップ 4: Docker Compose でサービスを起動
10. コマンドプロンプトまたは PowerShell で、リポジトリのルートディレクトリ（`docker-compose.yml`がある場所）に移動します。
11. 以下のコマンドを実行して、Docker コンテナを起動します：
    ```bash
    docker compose up -d
    ```
    - 初回実行時は、必要な Docker イメージのダウンロードが行われますので、時間がかかります。
      > ### ステップ 5: 動作確認
12. 以下のコマンドでコンテナが実行中か確認します：
    ```bash
    docker compose ps
    ```
    - `graphiti-mcp`と`neo4j`の状態が`running`になっていることを確認します。
13. ログを確認するには：
    ```bash
    docker compose logs -f graphiti-mcp
    ```
    > ### ステップ 6: サービスへのアクセス

- **Neo4j Browser**: ブラウザで `http://localhost:7474` を開きます。
  - ログイン画面で、ユーザー名: `neo4j`、パスワード: `demodemo` を入力します。
- **Graphiti MCP Server**: エンドポイントは `http://localhost:8000` で動作しています。
  > ### ステップ 7: Cursor IDE との連携（オプション）
  >
  > Cursor IDE を使用する場合の設定手順：

1. Cursor を開き、`Settings` > `Advanced` > `MCP Servers`に移動します。
2. 以下の設定を追加：
   ```json
   {
     "mcpServers": {
       "Graphiti": {
         "url": "http://localhost:8000/sse"
       }
     }
   }
   ```
3. Graphiti のルールファイル（`graphiti_cursor_rules.mdc`）を Cursor のユーザールールに追加します。
   > ### トラブルシューティング

- **Docker の起動エラー**: メモリ不足の場合、Docker Desktop の設定でメモリを増やします（設定 > Resources）。
- **ポート競合**: 他のアプリがポート 7474, 7687, 8000 を使用している場合、`.env`ファイルや`docker-compose.yml`でポートを変更します。
- **ログの確認**: エラーが発生した場合は、`docker compose logs`で詳細を確認します。
  > ### 補足: Windows 環境での注意点
- ファイルパスの区切り文字: Windows ではパス区切りが`\`ですが、Docker Compose 内では`/`を使用します。
- 環境変数: コマンドプロンプトで環境変数を設定する場合は、`set OPENAI_API_KEY=your_key`とし、そのまま`docker compose up`を実行します。
  > 以上で Graphiti MCP Server のセットアップは完了です。問題が発生した場合は、ログを確認しながら各ステップを見直してください。

## Windows 10 での Graphiti MCP Server 設定ガイド 🚀

Windows 10 環境でのセットアップ手順を詳しく説明します。Docker を使用するため、まず Docker のインストールから始めましょう。

### ステップ 1: Docker Desktop のインストール

1. [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop/) からインストーラーをダウンロード
2. インストーラーを実行し、指示に従ってインストール
3. インストール中に「Enable WSL 2 Windows Features」を選択（WSL 2 が必要）
4. インストール後、PC を再起動
5. タスクバーの Docker アイコンを右クリック → 「Settings」→ 「Resources」→ 「WSL Integration」で WSL 2 を有効化

### ステップ 2: リポジトリのクローン

1. [Git for Windows](https://git-scm.com/download/win) をインストール
2. PowerShell を管理者権限で開く
3. 以下のコマンドを実行:

```powershell
# リポジトリのクローン
git clone https://github.com/gifflet/graphiti-mcp-server.git
cd graphiti-mcp-server
```

### ステップ 3: 環境設定ファイルの作成

1. エクスプローラーでクローンしたフォルダを開く
2. `.env.sample` ファイルをコピー
3. コピーしたファイルの名前を `.env` に変更
4. `.env` ファイルをメモ帳で編集:

```env
# OpenAI APIキーを設定（必須）
OPENAI_API_KEY=sk-あなたのAPIキー

# 使用するモデル（デフォルトはgpt-4o）
MODEL_NAME=gpt-4o

# Neo4j設定（デフォルトのままでOK）
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=demodemo
```

> **注意**: OpenAI API キーは[こちら](https://platform.openai.com/api-keys)で取得できます

### ステップ 4: Docker コンテナの起動

PowerShell でプロジェクトフォルダ内で実行:

```powershell
# コンテナのビルドと起動
docker compose up -d --build

# 起動状態を確認
docker compose ps
```

### ステップ 5: 動作確認

1. **Neo4j ブラウザ**: http://localhost:7474 にアクセス
   - ユーザー名: `neo4j`
   - パスワード: `demodemo`
2. **Graphiti サーバー**: http://localhost:8000/health にアクセス → `{"status":"OK"}` と表示されれば成功

### ステップ 6: Cursor IDE との連携（オプション）

1. Cursor IDE をインストール（[公式サイト](https://cursor.sh/)）
2. 設定（Ctrl+,）→ 「Advanced」→ 「MCP Servers」に以下を追加:

```json
{
  "mcpServers": {
    "Graphiti": {
      "url": "http://localhost:8000/sse"
    }
  }
}
```

### トラブルシューティング 🔧

1. **メモリ不足エラー**:

   - Docker アイコン右クリック → Settings → Resources → メモリを 8GB に増やす
   - `docker compose down` で一旦停止後、再起動

2. **ポート競合**:

   - 既に使用中のポートがある場合、`docker-compose.yml` の ports 設定を変更

   ```yaml
   ports:
     - "新しいポート番号:8000"
   ```

3. **API キー関連エラー**:

   - `.env` ファイルの OPENAI_API_KEY が正しく設定されているか確認
   - キーの有効期限を確認

4. **WSL 関連エラー**:
   ```powershell
   wsl --update  # WSLの更新
   wsl --shutdown
   ```

### アンインストール方法

```powershell
# コンテナとボリュームの完全削除
docker compose down -v

# イメージ削除
docker rmi graphiti-mcp-server-graphiti-mcp
```

### 補足情報

- **必要なリソース**:
  - メモリ: 8GB 以上推奨
  - ストレージ: 10GB 以上の空き容量
- **サービスアクセス先**:
  - Neo4j 管理画面: http://localhost:

# 続いてください

#### 已深度思考

> Windows 10 環境での Graphiti MCP Server のセットアップ手順の続きです。前回までに Docker のインストール、リポジトリのクローン、環境設定、Docker コンテナの起動まで完了していることを前提とします。
>
> ## ステップ 7: Neo4j データベースの初期設定
>
> 1.  **Neo4j ブラウザにログイン**

- ブラウザで `http://localhost:7474` を開く
- ユーザー名: `neo4j`
- パスワード: `demodemo` (`.env`ファイルで設定したパスワード)
  > 2.  **初期パスワード変更**
- 初回ログイン時にはパスワード変更が求められます
- 現在のパスワード: `demodemo`
- 新しいパスワードを設定（メモしておくこと）
- 注意: パスワードを変更した場合は、`.env`ファイルの`NEO4J_PASSWORD`も同じ値に更新し、Docker コンテナを再起動する必要があります
  `powershell
    docker compose down
    docker compose up -d
    `
  > ## ステップ 8: Graphiti MCP サーバーの動作確認
  >
  > 1.  **ヘルスチェック**

```powershell
# PowerShellで実行
curl http://localhost:8000/health
```

- 応答: `{"status":"OK"}` が返れば正常
  > 2.  **MCP エンドポイントのテスト**

```powershell
# SSEエンドポイントのテスト
curl http://localhost:8000/sse
```

- イベントストリームのデータが流れれば正常（終了は Ctrl+C）
  > ## ステップ 9: Cursor IDE との統合詳細
  >
  > 1.  **ルールファイルのインポート**
- リポジトリ内の `graphiti_cursor_rules.mdc` ファイルを開く
- 内容を全てコピー
- Cursor IDE で `Ctrl+Shift+P` → 「Open User Rules」を選択
- ファイルの内容を貼り付け、保存
  > 2.  **エージェントセッションの開始**
- Cursor で新規ファイルを作成
- `Ctrl+K` → `@` を入力 → Graphiti エージェントを選択
- プロンプト入力後に Graphiti が応答すれば成功
  > ## ステップ 10: カスタムエンティティの使用（オプション）
  >
  > 高度な機能であるカスタムエンティティ抽出を使用する場合:
  >
  > 1.  `.env` ファイルに以下を追加:

```env
USE_CUSTOM_ENTITIES=true
CUSTOM_ENTITY_MODEL_PATH=/app/models/entity_model.pkl
```

> 2.  カスタムモデルを `models/` ディレクトリに配置

- 独自のエンティティ抽出モデルがある場合のみ必要
- ない場合はデフォルトの OpenAI モデルが使用されます
  > ## トラブルシューティング（続き）
  >
  > ### 5. Neo4j 接続エラー

```log
[ERROR] Failed to connect to Neo4j: ...
```

- 対処法:
  1. Neo4j が起動しているか確認: `docker compose ps`
  2. `.env`ファイルの接続情報を確認:
     - `NEO4J_URI=bolt://neo4j:7687` (Docker 内ではこの設定)
  3. Neo4j のログ確認: `docker compose logs neo4j`
     > ### 6. OpenAI API エラー

```log
[ERROR] OpenAI API error: ...
```

- 原因:
  - 無効な API キー
  - 課金制限
  - モデル名の誤り
- 対処法:
  1. `.env`の`OPENAI_API_KEY`を再確認
  2. [OpenAI 利用状況ページ](https://platform.openai.com/usage)でクォータを確認
  3. `MODEL_NAME`を有効なモデルに変更（例: `gpt-3.5-turbo`）
     > ### 7. パフォーマンス問題
- 応答が遅い場合:
  ```powershell
  # リソース使用率を確認
  docker stats
  ```
  - 対処法: 1. Docker のリソース割り当てを増加（設定 → Resources） 2. `.env`でより軽量なモデルを指定: `MODEL_NAME=gpt-3.5-turbo`
    > ## 開発者向け追加情報
    >
    > ### ローカル開発モード
    >
    > Docker を使わずに直接実行する場合:
    >
    > 1.  Python 3.10+をインストール

2. 仮想環境作成:
   ```powershell
   python -m venv .venv
   .\.venv\Scripts\activate
   ```
3. 依存関係インストール:
   ```powershell
   pip install -r requirements.txt
   ```
4. Neo4j を Docker で起動:
   ```powershell
   docker run -d -p 7474:7474 -p 7687:7687 -e NEO4J_AUTH=neo4j/demodemo neo4j:5.26.0
   ```
5. サーバー起動:
   ```powershell
   $env:OPENAI_API_KEY="your_key"
   python graphiti_mcp_server.py
   ```
   > ### データバックアップ
   >
   > Neo4j データを永続化するには:
6. `docker-compose.yml`のボリューム設定を確認:
   ```yaml
   volumes: neo4j_data:/data
     neo4j_logs:/logs
   ```
7. バックアップ作成:
   ```powershell
   docker compose exec neo4j neo4j-admin dump --database=neo4j --to=/backups/neo4j.dump
   ```
   > 以上で Graphiti MCP Server のセットアップと基本的な使用方法は完了です。問題が発生した場合は、ログを確認しながら段階的にトラブルシューティングを行ってください。

## Windows 10 での Graphiti MCP Server 設定ガイド（続き）

### ステップ 7: Neo4j データベースの初期設定

1. **Neo4j ブラウザにアクセス**

   - ブラウザで `http://localhost:7474` を開く
   - 初回ログイン情報:
     - ユーザー名: `neo4j`
     - パスワード: `demodemo`

2. **パスワード変更**

   - 初回ログイン時、パスワード変更を求められます
   - 新しいパスワードを設定（例: `newsecurepassword123`）
   - 重要: 変更したパスワードを`.env`ファイルに反映
     ```env
     NEO4J_PASSWORD=newsecurepassword123
     ```

3. **Docker コンテナ再起動**
   ```powershell
   docker compose down
   docker compose up -d
   ```

### ステップ 8: Graphiti MCP サーバーの動作確認

1. **ヘルスチェック**

   ```powershell
   curl http://localhost:8000/health
   ```

   - 期待する応答: `{"status":"OK"}`

2. **SSE エンドポイントテスト**
   ```powershell
   # 別のPowerShellウィンドウで実行
   curl http://localhost:8000/sse
   ```
   - イベントストリームデータが表示されれば正常

### ステップ 9: Cursor IDE との統合詳細

1. **Graphiti ルールファイルの追加**

   - リポジトリ内の`graphiti_cursor_rules.mdc`を開く
   - 内容を全てコピー
   - Cursor で`Ctrl+Shift+P` → "Open User Rules" → 内容を貼り付け保存

2. **エージェントセッションの開始**
   - Cursor で新規ファイル作成
   - `Ctrl+K` → `@`入力 → Graphiti エージェントを選択
   - プロンプトを入力して動作確認:
     ```
     こんにちは！Graphitiはどのような機能がありますか？
     ```

### ステップ 10: カスタムエンティティ抽出の設定（オプション）

1. `.env`ファイルに追加:

   ```env
   USE_CUSTOM_ENTITIES=true
   CUSTOM_ENTITY_MODEL_PATH=/app/models/entity_model.pkl
   ```

2. カスタムモデルを配置:

   ```powershell
   # modelsディレクトリ作成
   mkdir models

   # サンプルモデルダウンロード（例）
   curl -o models/entity_model.pkl https://example.com/sample_model.pkl
   ```

3. コンテナ再ビルド:
   ```powershell
   docker compose down
   docker compose up -d --build
   ```

### 高度な設定 🔧

#### 1. メモリ最適化

`docker-compose.yml`を編集:

```yaml
services:
  neo4j:
    environment:
      - NEO4J_dbms_memory_heap_initial_size=2G
      - NEO4J_dbms_memory_heap_max_size=4G
```

#### 2. 永続ストレージ設定

```yaml
services:
  neo4j:
    volumes:
      - neo4j_data:/data
      - neo4j_logs:/logs

volumes:
  neo4j_data:
  neo4j_logs:
```

#### 3. 複数モデルの切り替え

`.env`でモデル変更:

```env
# gpt-3.5-turboや他のモデルに切り替え可能
MODEL_NAME=gpt-4-turbo
```

### トラブルシューティング（続き）

#### 5. WSL 関連エラー

```powershell
# WSLのバージョン確認
wsl -l -v

# WSL 2にアップデート
wsl --set-version Ubuntu 2

# WSL再起動
wsl --shutdown
```

#### 6. ボリュームパーミッションエラー

```powershell
# ボリューム削除
docker compose down -v

# 権限リセット
wsl -d docker-desktop
sudo chown -R 101:101 /var/lib/docker/volumes/
exit

# 再起動
docker compose up -d
```

#### 7. ファイアウォール設定

1. Windows セキュリティ → ファイアウォール → 詳細設定
2. 受信の規則 → 新しい規則
3. ポート: 7474, 7687, 8000 を許可

### アンインストール手順

```powershell
# コンテナとボリューム完全削除
docker compose down -v

# イメージ削除
docker rmi graphiti-mcp-server-graphiti-mcp

# リポジトリ削除
cd ..
rm -r graphiti-mcp-server
```

### よくある質問 ❓

**Q: Docker 起動時に「port already allocated」エラーが出ます**  
A: ポート競合が発生しています。解決方法:

```powershell
# 使用中のポートを確認
netstat -ano | findstr :8000

# プロセスを終了（PIDを指定）
taskkill /PID 12345 /F

# またはdocker-compose.ymlでポート変更
ports:
  - "8001:8000"
```

**Q: Neo4j のパスワードを忘れました**  
A: 以下の手順でリセット:

```powershell
docker compose exec neo4j cypher-shell -u neo4j -p demodemo
# パスワード変更コマンド
ALTER USER neo4j SET PASSWORD 'newpassword';
```

**Q: GPU アクセラレーションは可能ですか？**  
A: Windows Docker では制限がありますが、試す場合:

1. Docker Desktop 設定 → 「Use NVIDIA GPU」を有効化
2. `docker-compose.yml`に追加:

```yaml
graphiti-mcp:
  deploy:
    resources:
      reservations:
        devices:
          - driver: nvidia
            count: 1
            capabilities: [gpu]
```

以上で設定は完了です。問題が発生した場合は、以下のコマンドで詳細ログを確認してください:

```powershell
docker compose logs -f graphiti-mcp
```
