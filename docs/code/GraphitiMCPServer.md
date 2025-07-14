# Windows 10 環境での Graphiti MCP Server のセットアップ手順

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

 # Graphiti MCP Server Environment Configuration

# Neo4j Database Configuration
# These settings are used to connect to your Neo4j database
NEO4J_URI=bolt://neo4j:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=AM2013japan

# OpenAI API Configuration
# Required for LLM operations
OPENAI_API_KEY=sk-33bbd7c12839446a9ce7960fd2e2d6aa
MODEL_NAME=gpt-4.1-mini

# Optional: Only needed for non-standard OpenAI endpoints
OPENAI_BASE_URL=https://api.deepseek.com

# Optional: Group ID for namespacing graph data
# GROUP_ID=my_project

# Optional: Path configuration for Docker
# PATH=/root/.local/bin:${PATH}

# Optional: Memory settings for Neo4j (used in Docker Compose)
# NEO4J_server_memory_heap_initial__size=512m
# NEO4J_server_memory_heap_max__size=1G
# NEO4J_server_memory_pagecache_size=512m

# Azure OpenAI configuration
# Optional: Only needed for Azure OpenAI endpoints
# AZURE_OPENAI_ENDPOINT=your_azure_openai_endpoint_here
# AZURE_OPENAI_API_VERSION=2025-01-01-preview
# AZURE_OPENAI_DEPLOYMENT_NAME=gpt-4o-gpt-4o-mini-deployment
# AZURE_OPENAI_EMBEDDING_API_VERSION=2023-05-15
# AZURE_OPENAI_EMBEDDING_DEPLOYMENT_NAME=text-embedding-3-large-deployment
# AZURE_OPENAI_USE_MANAGED_IDENTITY=false
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

参考記事
https://zenn.dev/kazy_developer/articles/be4f548f3a3429

http://localhost:7474
ユーザー名: neo4j
パスワード: AM2013japan

| 項目               | 設定値                                                    |
| ------------------ | --------------------------------------------------------- |
| **Protocol**       | `neo4j://`（そのままで OK）                               |
| **Connection URL** | `localhost:7687`                                          |
| **Database user**  | `neo4j`                                                   |
| **Password**       | `AM2013japan`（あなたの `.env` に書かれているパスワード） |

実行成功したイメージ

```bash
PS D:\graphiti-mcp-server> docker compose up -d
[+] Running 5/5
 ✔ Network graphiti-mcp-server_default           Created                                                           0.4s
 ✔ Volume "graphiti-mcp-server_neo4j_data"       Created                                                           0.1s
 ✔ Volume "graphiti-mcp-server_neo4j_logs"       Created                                                           0.0s
 ✔ Container graphiti-mcp-server-neo4j-1         Healthy                                                          46.5s
 ✔ Container graphiti-mcp-server-graphiti-mcp-1  Started                                                          47.5s
PS D:\graphiti-mcp-server> docker compose ps
NAME                                 IMAGE                              COMMAND                   SERVICE        CREATED              STATUS                        PORTS
graphiti-mcp-server-graphiti-mcp-1   zepai/knowledge-graph-mcp:latest   "uv run graphiti_mcp…"   graphiti-mcp   About a minute ago   Up 19 seconds                 0.0.0.0:8000->8000/tcp, [::]:8000->8000/tcp
graphiti-mcp-server-neo4j-1          neo4j:5.26.0                       "tini -g -- /startup…"   neo4j          About a minute ago   Up About a minute (healthy)   0.0.0.0:7474->7474/tcp, [::]:7474->7474/tcp, 0.0.0.0:7687->7687/tcp, [::]:7687->7687/tcp
PS D:\graphiti-mcp-server> curl.exe http://localhost:8000/health
Not Found
PS D:\graphiti-mcp-server> docker compose logs graphiti-mcp
graphiti-mcp-1  | Bytecode compiled 2217 files in 2.94s
graphiti-mcp-1  | 2025-07-11 19:33:47,882 - __main__ - INFO - Generated random group_id: default
graphiti-mcp-1  | 2025-07-11 19:33:47,882 - __main__ - INFO - Entity extraction disabled (no custom entities will be used)
graphiti-mcp-1  | 2025-07-11 19:33:50,580 - __main__ - INFO - Graphiti client initialized successfully
graphiti-mcp-1  | 2025-07-11 19:33:50,580 - __main__ - INFO - Using OpenAI model: gpt-4.1-mini
graphiti-mcp-1  | 2025-07-11 19:33:50,580 - __main__ - INFO - Using temperature: 0.0
graphiti-mcp-1  | 2025-07-11 19:33:50,580 - __main__ - INFO - Using group_id: default
graphiti-mcp-1  | 2025-07-11 19:33:50,580 - __main__ - INFO - Custom entity extraction: disabled
graphiti-mcp-1  | 2025-07-11 19:33:50,580 - __main__ - INFO - Using concurrency limit: 10
graphiti-mcp-1  | 2025-07-11 19:33:50,580 - __main__ - INFO - Setting MCP server host to: 0.0.0.0
graphiti-mcp-1  | 2025-07-11 19:33:50,580 - __main__ - INFO - Starting MCP server with transport: sse
graphiti-mcp-1  | 2025-07-11 19:33:50,580 - __main__ - INFO - Running MCP server with SSE transport on 0.0.0.0:8000
graphiti-mcp-1  | INFO:     Started server process [46]
graphiti-mcp-1  | INFO:     Waiting for application startup.
graphiti-mcp-1  | INFO:     Application startup complete.
graphiti-mcp-1  | INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
graphiti-mcp-1  | INFO:     172.18.0.1:46840 - "GET /health HTTP/1.1" 404 Not Found
PS D:\graphiti-mcp-server> curl.exe http://localhost:8000/sse
event: endpoint
data: /messages/?session_id=56a70177fcd04250876a1605909fa82f

: ping - 2025-07-11 19:39:27.361499+00:00

: ping - 2025-07-11 19:39:42.362854+00:00
```
