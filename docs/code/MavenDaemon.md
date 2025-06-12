<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">（Maven Daemon） Windows 版の導入</span>

### Maven を高速に実行するための 常駐プロセス型ビルドツール。Gradle のように デーモンプロセスを使ってビルド速度を向上させることができます。

以下は、`maven-mvnd-1.0.2-windows-amd64`（Maven Daemon）の設定手順を詳細に説明したものです。

---

### **1. ダウンロード**

1. [Maven Daemon の公式リリースページ](https://github.com/apache/maven-mvnd/releases)にアクセス
2. `maven-mvnd-1.0.2-windows-amd64.zip` をダウンロード

---

### **2. インストール**

1. ダウンロードした ZIP ファイルを解凍（例: `C:\mvnd`）
2. 解凍後のディレクトリ構造を確認:
   ```
   C:\mvnd
   ├── bin
   ├── conf
   ├── lib
   └── ...
   ```

---

### **3. 環境変数の設定**

1. **システム環境変数**に以下を追加:

   - 変数名: `MVND_HOME`
   - 変数値: `C:\mvnd`（解凍したパス）

2. **Path** に以下を追加:

   ```
   %MVND_HOME%\bin
   ```

3. **既存の Maven 設定との競合回避**:
   - 既に`MAVEN_HOME`や`M2_HOME`を設定している場合、`mvnd`が優先されるよう`Path`の順序を調整。

---

### **4. 設定ファイルのカスタマイズ（任意）**

`conf/mvnd.properties` を編集してデフォルト設定を変更可能:

```properties
# 並列ビルドのスレッド数（デフォルト: CPUコア数）
mvnd.threads=4

# JVMオプション（メモリ設定など）
mvnd.jvmOptions=-Xmx2G -Djava.awt.headless=true
```

---

### **5. 動作確認**

コマンドプロンプトで以下を実行:

```bash
mvnd --version
```

出力例:

```
mvnd native client 1.0.2-windows-amd64
Apache Maven 3.8.4
...
```

---

### **6. 基本的な使い方**

- **プロジェクトのビルド**:
  ```bash
  mvnd clean install
  ```
- **並列ビルド**（自動で検出）:
  ```bash
  mvnd install -T 4
  ```
- **デーモンの状態確認**:
  ```bash
  mvnd --status
  ```

---

### **7. 既存の Maven プロジェクトでの利用**

既存の Maven プロジェクトで`mvnd`をそのまま使用可能。`pom.xml`の変更は不要。

---

### **8. トラブルシューティング**

- **`'mvnd' is not recognized**:

  - 環境変数`Path`が正しく設定されているか確認
  - 新しいコマンドプロンプトで再試行

- **ビルドエラー**:
  - 通常の Maven (`mvn`) で動作するか確認
  - `mvnd --clean` でデーモンを再起動

---

### **9. アンインストール**

1. 環境変数`MVND_HOME`と`Path`から該当エントリを削除
2. `C:\mvnd` ディレクトリを削除

---

### **補足: Maven Daemon の特徴**

- **高速起動**: 従来の Maven より最大 10 倍高速
- **メモリ効率**: デーモンがキャッシュを保持
- **互換性**: 既存の Maven コマンドと互換

これで、Maven Daemon を Windows 環境で利用できるようになります。

`mvnd clean install -U` は、Maven Daemon（`mvnd`）を使ってプロジェクトをビルドするコマンドで、それぞれの意味は以下の通りです：

---

### 🔍 コマンドの意味

```bash
mvnd clean install -U
```

| 部分      | 意味                                                                                     |
| --------- | ---------------------------------------------------------------------------------------- |
| `mvnd`    | Maven Daemon：高速化された Maven の実行コマンド                                          |
| `clean`   | 以前のビルド成果物（`target/` フォルダなど）を削除                                       |
| `install` | プロジェクトをビルドし、ローカルリポジトリ（`~/.m2/repository`）にインストール           |
| `-U`      | **Update snapshots**：リモートの `SNAPSHOT` 依存を強制的に再取得（キャッシュせずに更新） |

---

### 🧠 なぜ `-U` を使うの？

- `-U` は **SNAPSHOT バージョンが最新であることを強制的に確認**したいときに使います。
- 特にチーム開発で、他メンバーが更新した SNAPSHOT ライブラリをすぐ使いたい場合に有効です。

---

### 💡 例：

```bash
mvnd clean install -U
```

- プロジェクトをクリーンしてビルドし、
- `SNAPSHOT` バージョンの依存ライブラリ（例：`1.0.0-SNAPSHOT`）はリモートから最新を取得し直す、
- そして `.m2/repository` にインストールする。

---

### ✅ 通常はどう使う？

- 毎回 `-U` を使う必要はなく、**依存ライブラリが更新されたことを知っているときだけ使えば OK** です。

---
