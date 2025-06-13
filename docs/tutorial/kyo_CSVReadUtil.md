<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">CSV ファイル 読み込み用ユーティリティ</span>

```java
package com.example.orgchart_api.util;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

import com.example.orgchart_api.exception.CSVException;

/**
 * <pre>
 * CSVファイル 読み込み用ユーティリティ
 *
 * @version 1.0 2013/09/12
 */
public class CSVReadUtil {
    private static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;

    /**
     * CSVファイルを解析し、読み込んだListを返す
     * @param fileName ファイル名
     * @param colCount カラム数
     * @return List<String[]> CSV内容
     * @throws IOException ファイル読み込みエラー
     * @throws CSVException CSV形式エラー
     */
    public List<String[]> read(String fileName, int colCount) throws IOException, CSVException {
        return read(fileName, colCount, DEFAULT_CHARSET);
    }

    /**
     * CSVファイルを解析し、読み込んだListを返す
     * @param fileName ファイル名
     * @param colCount カラム数
     * @param charset 文字コード
     * @return List<String[]> CSV内容
     * @throws IOException ファイル読み込みエラー
     * @throws CSVException CSV形式エラー
     */
    public List<String[]> read(String fileName, int colCount, Charset charset)
            throws IOException, CSVException {

        List<String[]> ret = new ArrayList<>();
        Path path = Path.of(fileName);

        try (var reader = Files.newBufferedReader(path, charset)) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parsedLine = parseLine(line, colCount);
                ret.add(parsedLine);
            }
        }

        return ret;
    }

    private String[] parseLine(String line, int colCount) throws CSVException {
        // カンマ区切りでトークン化
        String[] tokens = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");

        if (tokens.length != colCount) {
            throw new CSVException(
                    String.format("列数が異なります。期待値:%d, 実際:%d", colCount, tokens.length));
        }

        // 各カラムの前後のダブルクォートを除去
        String[] result = new String[colCount];
        for (int i = 0; i < colCount; i++) {
            result[i] = tokens[i].replaceAll("^\"|\"$", "");
        }

        return result;
    }

    /**
     * 指定されたファイルが存在するかチェックする
     * @param fileName ファイル名
     * @return boolean 存在有無
     */
    public boolean existFile(String fileName) {
        return Files.isRegularFile(Path.of(fileName));
    }
}


```

#### 已深度思考

````
えられた`CSVReadUtil`クラスを適切な場所に配置する必要があります。プロジェクトの構造と既存の`CSVUtil`の配置を考慮して、同じ`util`パッケージに配置するのが適切です。

### 配置方針
1. **パッケージの整合性**: `CSVReadUtil`もCSV操作に関するユーティリティクラスなので、`com.example.orgchart_api.util`パッケージに配置します。
2. **例外クラスの利用**: `CSVException`は既に`com.example.orgchart_api.exception`パッケージに作成済みです。そのまま利用します。
3. **コードの重複回避**: `existFile`メソッドは`CSVUtil`にも存在しますが、単純なファイル存在チェックなので許容します。

### 具体的な配置
- **ファイルパス**: `src/main/java/com/example/orgchart_api/util/CSVReadUtil.java`
- **パッケージ宣言**: `package com.example.orgchart_api.util;`

```java
package com.example.orgchart_api.util;

import com.example.orgchart_api.exception.CSVException;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
* CSVファイル 読み込み用ユーティリティ
*/
public class CSVReadUtil {

   private static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;

   /**
    * CSVファイルを解析し、読み込んだListを返す
    * @param fileName ファイル名
    * @param colCount カラム数
    * @return List<String[]> CSV内容
    * @throws IOException ファイル読み込みエラー
    * @throws CSVException CSV形式エラー
    */
   public List<String[]> read(String fileName, int colCount) throws IOException, CSVException {
       return read(fileName, colCount, DEFAULT_CHARSET);
   }

   /**
    * CSVファイルを解析し、読み込んだListを返す
    * @param fileName ファイル名
    * @param colCount カラム数
    * @param charset 文字コード
    * @return List<String[]> CSV内容
    * @throws IOException ファイル読み込みエラー
    * @throws CSVException CSV形式エラー
    */
   public List<String[]> read(String fileName, int colCount, Charset charset)
           throws IOException, CSVException {

       List<String[]> ret = new ArrayList<>();
       Path path = Path.of(fileName);

       try (var reader = Files.newBufferedReader(path, charset)) {
           String line;
           while ((line = reader.readLine()) != null) {
               String[] parsedLine = parseLine(line, colCount);
               ret.add(parsedLine);
           }
       }

       return ret;
   }

   private String[] parseLine(String line, int colCount) throws CSVException {
       // カンマ区切りでトークン化（ダブルクォート内のカンマを無視）
       String[] tokens = line.split(",(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)");

       if (tokens.length != colCount) {
           throw new CSVException(
               String.format("列数が異なります。期待値:%d, 実際:%d", colCount, tokens.length));
       }

       // 各カラムの前後のダブルクォートを除去
       String[] result = new String[colCount];
       for (int i = 0; i < colCount; i++) {
           result[i] = tokens[i].replaceAll("^\"|\"$", "");
       }

       return result;
   }

   /**
    * 指定されたファイルが存在するかチェックする
    * @param fileName ファイル名
    * @return boolean 存在有無
    */
   public boolean existFile(String fileName) {
       return Files.isRegularFile(Path.of(fileName));
   }
}
````

### 改善ポイント

1. **正規表現の最適化**: ダブルクォート内のカンマを無視する正規表現を修正（パフォーマンス向上のため）
2. **エンコーディング指定**: UTF-8 をデフォルト文字コードに設定（より一般的なエンコーディング）
3. **例外メッセージの明確化**: 列数不一致エラーで期待値と実際の値を表示

### 使用例

```java
// サービス層での使用例
public class EmployeeImportService {
    public void importEmployees(String csvFilePath) {
        CSVReadUtil csvReader = new CSVReadUtil();
        try {
            List<String[]> records = csvReader.read(csvFilePath, 5); // 5列のCSVを想定

            for (String[] record : records) {
                Employee employee = new Employee();
                employee.setId(record[0]);
                employee.setName(record[1]);
                // ...他のフィールドを設定
            }
        } catch (IOException | CSVException e) {
            throw new ImportException("CSVのインポートに失敗", e);
        }
    }
}
```

### 2 つの CSV ユーティリティの使い分け

| 特徴             | `CSVUtil`                           | `CSVReadUtil`                    |
| ---------------- | ----------------------------------- | -------------------------------- |
| **主な用途**     | 複雑な構造の CSV 読み書き           | 単純な CSV 行データの読み込み    |
| **ヘッダー処理** | ヘッダー情報を管理                  | ヘッダー行を文字列配列として処理 |
| **データ構造**   | `Map<String, Object>`形式           | `String[]`形式                   |
| **メモリ効率**   | 全データをメモリに保持              | 行単位で逐次処理可能             |
| **適したケース** | 小～中規模データ/構造が複雑なデータ | 大規模データ/構造が単純なデータ  |

この配置により、プロジェクト内で CSV 処理が必要な場合に統一されたパッケージからユーティリティクラスを選択利用できるようになります。

````

### CSVReadUtilクラスの配置

`CSVReadUtil`クラスをプロジェクトの適切な場所に配置します。既存のCSVユーティリティと関連性が高いため、同じパッケージに配置するのが最適です。

**配置先パッケージ**:
`src/main/java/com/example/orgchart_api/util/CSVReadUtil.java`

```java
package com.example.orgchart_api.util;

import com.example.orgchart_api.exception.CSVException;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.ArrayList;
import java.util.List;

/**
 * CSVファイル 読み込み用ユーティリティ
 */
public class CSVReadUtil {

    private static final Charset DEFAULT_CHARSET = StandardCharsets.UTF_8;

    /**
     * CSVファイルを解析し、読み込んだListを返す
     * @param fileName ファイル名
     * @param colCount カラム数
     * @return List<String[]> CSV内容
     * @throws IOException ファイル読み込みエラー
     * @throws CSVException CSV形式エラー
     */
    public List<String[]> read(String fileName, int colCount) throws IOException, CSVException {
        return read(fileName, colCount, DEFAULT_CHARSET);
    }

    /**
     * CSVファイルを解析し、読み込んだListを返す
     * @param fileName ファイル名
     * @param colCount カラム数
     * @param charset 文字コード
     * @return List<String[]> CSV内容
     * @throws IOException ファイル読み込みエラー
     * @throws CSVException CSV形式エラー
     */
    public List<String[]> read(String fileName, int colCount, Charset charset)
            throws IOException, CSVException {

        List<String[]> ret = new ArrayList<>();
        Path path = Path.of(fileName);

        try (var reader = Files.newBufferedReader(path, charset)) {
            String line;
            while ((line = reader.readLine()) != null) {
                String[] parsedLine = parseLine(line, colCount);
                ret.add(parsedLine);
            }
        }

        return ret;
    }

    private String[] parseLine(String line, int colCount) throws CSVException {
        // カンマ区切りでトークン化
        String[] tokens = line.split(",(?=([^\"]*\"[^\"]*\")*[^\"]*$)");

        if (tokens.length != colCount) {
            throw new CSVException(
                String.format("列数が異なります。期待値:%d, 実際:%d", colCount, tokens.length));
        }

        // 各カラムの前後のダブルクォートを除去
        String[] result = new String[colCount];
        for (int i = 0; i < colCount; i++) {
            result[i] = tokens[i].replaceAll("^\"|\"$", "");
        }

        return result;
    }

    /**
     * 指定されたファイルが存在するかチェックする
     * @param fileName ファイル名
     * @return boolean 存在有無
     */
    public boolean existFile(String fileName) {
        return Files.isRegularFile(Path.of(fileName));
    }
}
````

### ユーティリティクラスの使い分け

プロジェクト内で 2 つの CSV ユーティリティを以下のように使い分けます：

| 機能             | `CSVUtil`                 | `CSVReadUtil`            |
| ---------------- | ------------------------- | ------------------------ |
| **主な用途**     | 複雑な構造の CSV 読み書き | シンプルな CSV 読み込み  |
| **データ構造**   | `Map<String, Object>`配列 | `String[]`配列のリスト   |
| **ヘッダー処理** | ヘッダー情報を管理・使用  | 外部でヘッダー処理が必要 |
| **書き込み機能** | あり                      | なし                     |
| **メモリ効率**   | 全データをメモリ保持      | 行単位で処理可能         |
| **適したケース** | 小～中規模 CSV 処理       | 大規模 CSV 処理          |
| **カラム検証**   | ヘッダー数と列数の一致    | 指定された列数のみ検証   |

### 使用例

#### 大規模 CSV ファイルの処理

```java
import com.example.orgchart_api.util.CSVReadUtil;

public class LargeCsvProcessor {
    public void processLargeFile(String filePath) {
        CSVReadUtil csvReader = new CSVReadUtil();
        final int COLUMN_COUNT = 10; // 期待するカラム数

        try {
            List<String[]> lines = csvReader.read(filePath, COLUMN_COUNT);
            for (String[] columns : lines) {
                // 行単位での処理
                processLine(columns);
            }
        } catch (IOException | CSVException e) {
            handleError(e);
        }
    }

    private void processLine(String[] columns) {
        // カラムデータを使った処理
        String employeeId = columns[0];
        String department = columns[2];
        // ...
    }
}
```

#### CSVUtil との併用

```java
import com.example.orgchart_api.util.CSVUtil;
import com.example.orgchart_api.util.CSVReadUtil;

public class CsvConverter {
    public void convertFormat(String sourcePath, String destPath) {
        CSVReadUtil reader = new CSVReadUtil();
        CSVUtil writer = new CSVUtil(new Map[0]);
        writer.setFileName(destPath);
        writer.setHasHeader(true);

        // ヘッダー追加
        writer.addHeader("id");
        writer.addHeader("name");
        writer.addHeader("department");

        try {
            List<String[]> lines = reader.read(sourcePath, 5);
            Map<String, Object>[] data = new Map[lines.size()];

            for (int i = 0; i < lines.size(); i++) {
                Map<String, Object> row = new HashMap<>();
                String[] columns = lines.get(i);

                // 必要なカラムをマッピング
                row.put("id", columns[0]);
                row.put("name", columns[1] + " " + columns[2]);
                row.put("department", columns[4]);

                data[i] = row;
            }

            writer.setDataMaps(data);
            writer.write();

        } catch (IOException | CSVException e) {
            handleError(e);
        }
    }
}
```

### 最適化ポイント

1. **ストリーム処理の追加**:

   ```java
   public Stream<String[]> stream(String fileName, int colCount) throws IOException, CSVException {
       Path path = Path.of(fileName);
       return Files.lines(path, DEFAULT_CHARSET)
                  .map(line -> parseLine(line, colCount));
   }
   ```

2. **エラー処理の拡張**:

   ```java
   public List<String[]> read(String fileName, int colCount, Charset charset)
           throws IOException, CSVException {
       // ...既存の処理...
       } catch (IOException e) {
           throw new CSVException("ファイル読み込みエラー: " + fileName, e);
       } catch (CSVException e) {
           throw new CSVException("CSVフォーマットエラー: " + e.getMessage(), e);
       }
   }
   ```

3. **動的カラム検証**:
   ```java
   public List<String[]> read(String fileName) throws IOException, CSVException {
       // 最初の行で列数を自動検出
       try (var reader = Files.newBufferedReader(Path.of(fileName))) {
           String firstLine = reader.readLine();
           int colCount = parseLine(firstLine, -1).length;
           // 残りの行を処理...
       }
   }
   ```

この配置により、CSV 処理のニーズに応じて最適なユーティリティを選択できるようになります。特に大規模な人事データのバッチ処理では、`CSVReadUtil`の行単位処理がメモリ効率の面で有利です。
