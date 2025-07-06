# FileSystemWrite

### (src\main\java\com\example\orgchart_api\batch\util\FileSystemWrite.java)

```java
package com.example.orgchart_api.batch.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.stream.Stream;

@Component
public class FileSystemWrite implements ItemWriter<Object> {
    private static final Logger log = LoggerFactory.getLogger(FileSystemWrite.class);

    // フィールド変数を宣言
    private final Path importDir;
    private final Path exportDir;

    // application.properties経由で注入される用のコンストラクタ
    public FileSystemWrite(
            @Value("${app.batch.input-dir}") String inputDir,
            @Value("${app.batch.completed-dir}") String completedDir) {
        this.importDir = Paths.get(inputDir);
        this.exportDir = Paths.get(completedDir);
        createDirectoriesIfNotExists();
    }

    // BatchSettings経由で注入される用のコンストラクタ
    @Autowired
    public FileSystemWrite(BatchSettings batchSettings) {
        // プロパティからディレクトリパスを取得
        String importDirPath = batchSettings.getInputDir();
        String exportDirPath = batchSettings.getInputCompDir();

        Assert.hasText(importDirPath, "Import directory must not be empty");
        Assert.hasText(exportDirPath, "Export directory must not be empty");

        // フィールドにPathオブジェクトを設定
        this.importDir = Paths.get(importDirPath);
        this.exportDir = Paths.get(exportDirPath);

        createDirectoriesIfNotExists();
    }

    @PostConstruct
    public void init() {
        if (importDir == null || exportDir == null) {
            throw new IllegalStateException("Input or export directory path is not set");
        }
    }

    private void createDirectoriesIfNotExists() {
        try {
            // importDir フィールドを使用
            if (!Files.exists(importDir)) {
                Files.createDirectories(importDir);
                log.info("Created import directory: {}", importDir);
            }
            // exportDir フィールドを使用
            if (!Files.exists(exportDir)) {
                Files.createDirectories(exportDir);
                log.info("Created export directory: {}", exportDir);
            }
        } catch (IOException e) {
            log.error("Failed to create directories", e);
            throw new IllegalStateException("ディレクトリ作成に失敗しました", e);
        }
    }

    @Override
    public void write(@NonNull Chunk<? extends Object> chunk) throws Exception {
        // 注意: バッチ処理の一環としてwriteメソッドが呼ばれたときには、ファイル移動は行わないように変更。
        // 代わりに、手動でmoveFiles()を呼び出すため、ここでは何もしない。
        // もし、バッチ処理のwriteでファイル移動を行いたい場合は、以下の行を有効にしてください。
        // moveFiles();
    }

    // ファイル移動のためのメソッドを追加
    public void moveFiles() throws Exception {
        // importDir フィールドを使用
        try (Stream<Path> files = Files.list(importDir)) {
            files.filter(Files::isRegularFile)
                    .forEach(this::moveFile);
        } catch (IOException e) {
            log.error("Failed to move files", e);
            throw new Exception("ファイル移動に失敗しました", e);
        }
    }

    private void moveFile(Path sourceFile) {
        try {
            // exportDir フィールドを使用
            Path targetFile = exportDir.resolve(sourceFile.getFileName());
            Files.move(sourceFile, targetFile, StandardCopyOption.REPLACE_EXISTING);
            log.debug("Moved file: {} -> {}", sourceFile, targetFile);
        } catch (IOException e) {
            log.error("Failed to move file: {}", sourceFile, e);
            throw new FileMoveException("ファイル移動に失敗しました: " + sourceFile, e);
        }
    }

    public static class FileMoveException extends RuntimeException {
        public FileMoveException(String message, Throwable cause) {
            super(message, cause);
        }
    }
}
```

[FileSystemWrite.java](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\batch\util\FileSystemWrite.java#L1-L106) のように **2 つのコンストラクタに`@Autowired`を付けて共存させる** ことは、Spring の DI コンテナでは**問題なく動作しますが、明確な優先順や競合リスクがあるため注意が必要です。**

---

## 🚨 問題点：二重の `@Autowired` コンストラクタ

```java
@Autowired
public FileSystemWrite(
        @Value("${app.batch.input-dir}") String inputDir,
        @Value("${app.batch.completed-dir}") String completedDir) {
    this.importDir = Paths.get(inputDir);
    this.exportDir = Paths.get(completedDir);
    createDirectoriesIfNotExists();
}

@Autowired
public FileSystemWrite(BatchSettings batchSettings) {
    String importDirPath = batchSettings.getInputDir();
    String exportDirPath = batchSettings.getInputCompDir();
    this.importDir = Paths.get(importDirPath);
    this.exportDir = Paths.get(exportDirPath);
    createDirectoriesIfNotExists();
}
```

### ❌ これは NG パターンです！

- Spring は「複数の`@Autowired`付きコンストラクタ」に対して、**どのコンストラクタを使うか明示的に指定されていない場合、`NoUniqueBeanDefinitionException` などのエラーをスローします**
- 実行タイミングは**アプリケーション起動時の DI 登録時（Bean 生成時）** ですが、その時点でどのコンストラクタを使うべきか判断できず失敗する可能性があります

---

## ✅ 推奨修正案：片方のコンストラクタのみ使用 + DI 分離

### ✅ 改良後のコード：

```java|CODE_EDIT_BLOCK|d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\batch\util\FileSystemWrite.java
// ... existing code ...
package com.example.orgchart_api.batch.util;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.batch.item.Chunk;
import org.springframework.batch.item.ItemWriter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.util.Assert;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.stream.Stream;

@Component
public class FileSystemWrite implements ItemWriter<Object> {
    private static final Logger log = LoggerFactory.getLogger(FileSystemWrite.class);

    // フィールド変数を宣言
    private final Path importDir;
    private final Path exportDir;

    // application.properties経由で注入される用のコンストラクタ
    public FileSystemWrite(
            @Value("${app.batch.input-dir}") String inputDir,
            @Value("${app.batch.completed-dir}") String completedDir) {
        Assert.hasText(inputDir, "Input directory must not be empty");
        Assert.hasText(completedDir, "Export directory must not be empty");

        this.importDir = Paths.get(inputDir);
        this.exportDir = Paths.get(completedDir);

        createDirectoriesIfNotExists();
    }

    // BatchSettings経由で注入される用のコンストラクタ
    @Autowired
    public FileSystemWrite(BatchSettings batchSettings) {
        this(batchSettings.getInputDir(), batchSettings.getInputCompDir());
    }

    private void createDirectoriesIfNotExists() {
        try {
            if (!Files.exists(importDir)) {
                Files.createDirectories(importDir);
                log.info("Created import directory: {}", importDir);
            }
            if (!Files.exists(exportDir)) {
                Files.createDirectories(exportDir);
                log.info("Created export directory: {}", exportDir);
            }
        } catch (IOException e) {
            log.error("Failed to create directories", e);
            throw new IllegalStateException("ディレクトリ作成に失敗しました", e);
        }
    }

    // 中略...
}
```

---

## ✅ 解説：なぜこのようにするのか？

### 1. **主コンストラクタ（デフォルト）**

```java
public FileSystemWrite(
        @Value("${app.batch.input-dir}") String inputDir,
        @Value("${app.batch.completed-dir}") String completedDir)
```

- **外部設定値（application.properties）から直接パスを受け取る**
- 明示的な DI 構成で、テストや運用環境での管理がしやすい

### 2. **サブコンストラクタ（BatchSettings 経由）**

```java
@Autowired
public FileSystemWrite(BatchSettings batchSettings)
```

- **`@Autowired` アノテーション必須**
- Spring が [BatchSettings](file://d:\eclipse-workspace\orgchart-api\src\main\java\com\example\orgchart_api\batch\util\BatchSettings.java#L35-L559) を自動で解決できる場合のみ呼ばれる

### ✅ 優先順位と実行タイミング：

| コンストラクタ                               | 使用条件                                      | 備考                                                         |
| -------------------------------------------- | --------------------------------------------- | ------------------------------------------------------------ |
| `@Value`付きコンストラクタ                   | application.properties で定義されたパスを使用 | 主にバッチ外で使いたい場合や S3 連携など柔軟性を求めるケース |
| `@Autowired BatchSettings`付きコンストラクタ | environment.properties 経由でパスを取得       | 遺産コードとの互換性維持目的                                 |

---

## ✅ 補足：Spring のコンストラクタ選択ロジック

Spring Framework（および Spring Boot）では、以下のように処理されます：

| 状況                                           | 行動                                              |
| ---------------------------------------------- | ------------------------------------------------- |
| `@Autowired` がついたコンストラクタが複数ある  | エラーになる（`NoUniqueBeanDefinitionException`） |
| `@Autowired` がついたコンストラクタが 1 つだけ | そのコンストラクタが使用される                    |
| `@Autowired` なしのコンストラクタが存在        | 普通の Java のルールでインスタンス化される        |

したがって、**複数のコンストラクタに `@Autowired` をつけたままにするのは避けるべきです。**

---

## ✅ 最終的な修正ポイントまとめ

| 修正内容                                                   | 理由                                     |
| ---------------------------------------------------------- | ---------------------------------------- |
| 片方のコンストラクタには `@Autowired` を付けない           | 依存関係の優先順序を明確にするため       |
| `@Value` によるパス設定を主コンストラクタに採用            | 外部設定ファイルからの柔軟な制御が可能に |
| `@Autowired` 付きのサブコンストラクタは `this(...)` で統一 | コードの冗長性排除と可読性向上           |

---

## ✅ 次のサポート

この状態でビルド・デプロイを行い、EC2 上で正常に動作するか確認できます。

必要であれば以下の手順も可能です：

- **Spring Profile による開発/本番切り替え対応**
- **S3 への CSV 出力先移行**
- **Docker 化 + AWS ECS/Fargate 対応**
- **CI/CD パイプライン構築（GitHub Actions or CodePipeline）**
