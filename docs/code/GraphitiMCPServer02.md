# Graphiti MCP Server を利用する手順

### ⚛️①docker を起動する

![alt text](image-97.png)
![alt text](image-98.png)
![alt text](image-99.png)

### ⚛️②Neo4j Desktop 2 を起動する

![alt text](image-100.png)
![alt text](image-101.png)
![alt text](image-102.png)

### ⚛️③docker で Graphiti MCP Server を起動する

![alt text](image-103.png)
![alt text](image-104.png)

### ⚛️④Docker コンテナを起動する

```bash
cc D:\graphiti-mcp-server

docker compose up -d
```

![alt text](image-105.png)

### ⚛️⑤Trae を起動する

![alt text](image-106.png)
![alt text](image-107.png)

### ⚛️⑥Neo4j ブラウザでグラフを見る

```bash
http://localhost:7474

```

![alt text](image-108.png)
![alt text](image-109.png)
