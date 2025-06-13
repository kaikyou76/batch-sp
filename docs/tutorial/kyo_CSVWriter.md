## CSVWriter

```java
package com.example.orgchart_api.util;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * <p>Title: CSVWriter.java</p>
 * <pre>
 * 'voicemail'固定値書き込みクラス
 * </pre>
 * @Time:2023/07/14
 * @author Yao KaiKyou
 */
public class CSVWriter {

    private static final String DELIMITER = ",";
    private static final String LINE_SEPARATOR = System.lineSeparator();
    private static final String NULL_VALUE = "";

    /**
     * CSVファイルにデータを書き込むメソッド
     * @param fileName ファイル名
     * @param header ヘッダー行
     * @param data データ
     * @throws IOException ファイル書き込みエラー
     */
    public static void writeCSV(String fileName, String header, Map<String, Object>[] data) throws IOException {
        writeCSV(Path.of(fileName), header, data, StandardCharsets.UTF_8);
    }

    /**
     * CSVファイルにデータを書き込むメソッド
     * @param filePath ファイルパス
     * @param header ヘッダー行
     * @param data データ
     * @param charset 文字コード
     * @throws IOException ファイル書き込みエラー
     */
    public static void writeCSV(Path filePath, String header, Map<String, Object>[] data,
                                java.nio.charset.Charset charset) throws IOException {

        // 親ディレクトリが存在しない場合は作成
        if (filePath.getParent() != null) {
            Files.createDirectories(filePath.getParent());
        }

        try (var writer = Files.newBufferedWriter(filePath, charset,
                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {

            // ヘッダー書き込み
            writer.write(header);
            writer.write(LINE_SEPARATOR);

            // データ行書き込み
            for (Map<String, Object> row : data) {
                String csvLine = row.values().stream()
                        .map(value -> sanitizeValue(value != null ? value.toString() : NULL_VALUE))
                        .collect(Collectors.joining(DELIMITER));

                writer.write(csvLine);
                writer.write(LINE_SEPARATOR);
            }
        }
    }

    /**
     * CSV値のサニタイズ処理
     * @param value 元の値
     * @return サニタイズされた値
     */
    private static String sanitizeValue(String value) {
        if (value == null) {
            return NULL_VALUE;
        }

        // 特殊文字のエスケープ
        return value.replace("\"", "\"\"")  // ダブルクォートのエスケープ
                .replace("\n", " ")      // 改行コードをスペースに
                .replace("\r", " ")      // 改行コードをスペースに
                .replace("?", "\\?")    // 疑問符のエスケープ
                .transform(s -> s.contains(DELIMITER) ? "\"" + s + "\"" : s); // カンマを含む場合はクォートで囲む
    }

    /**
     * オブジェクト配列からCSV行を生成
     * @param values 値の配列
     * @return CSV形式の文字列
     */
    public static String createCSVLine(Object... values) {
        if (values == null) {
            return NULL_VALUE;
        }

        return java.util.Arrays.stream(values)
                .map(value -> value != null ? value.toString() : NULL_VALUE)
                .map(CSVWriter::sanitizeValue)
                .collect(Collectors.joining(DELIMITER));
    }
}

```

#### 已深度思考

> プロジェクトの既存の構造を考慮し、CSV 関連のユーティリティクラスは`util`パッケージにまとめるのが適切です。
> 既に`CSVUtil`と`CSVReadUtil`を`com.example.orgchart_api.util`パッケージに配置しているため、`CSVWriter`も同じパッケージに配置します。
> ただし、`CSVWriter`クラスは`voicemail`固定値とありますが、汎用的な CSV 書き込みユーティリティとして実装されているため、そのまま利用できます。
> パッケージを変更し、ファイルパスを調整します。
> 配置先: `src/main/java/com/example/orgchart_api/util/CSVWriter.java`
> 修正点:

- パッケージ宣言を`package com.example.orgchart_api.util;`に変更
- 必要に応じて他のユーティリティクラスと同じ例外を投げるように調整（ただし、現在は IOException のみ）
  > 注意: このクラスは静的メソッドのみで構成されているため、インスタンス化不要です。
  > また、既存の`CSVUtil`クラスと機能が重複している部分がありますが、シンプルな書き込みが必要な場合と複雑な書き込みが必要な場合で使い分けができます。
  > 実装:

### CSVWriter クラスの配置

`CSVWriter`クラスをプロジェクトの`util`パッケージに配置します。既存の CSV 関連ユーティリティと一貫性を持たせるため、同じパッケージにまとめます。

**配置先パッケージ**:  
`src/main/java/com/example/orgchart_api/util/CSVWriter.java`

```java
package com.example.orgchart_api.util;

import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * CSVファイル書き込みユーティリティ
 */
public class CSVWriter {

    private static final String DELIMITER = ",";
    private static final String LINE_SEPARATOR = System.lineSeparator();
    private static final String NULL_VALUE = "";

    /**
     * CSVファイルにデータを書き込むメソッド
     * @param fileName ファイル名
     * @param header ヘッダー行
     * @param data データ
     * @throws IOException ファイル書き込みエラー
     */
    public static void writeCSV(String fileName, String header, Map<String, Object>[] data) throws IOException {
        writeCSV(Path.of(fileName), header, data, StandardCharsets.UTF_8);
    }

    /**
     * CSVファイルにデータを書き込むメソッド
     * @param filePath ファイルパス
     * @param header ヘッダー行
     * @param data データ
     * @param charset 文字コード
     * @throws IOException ファイル書き込みエラー
     */
    public static void writeCSV(Path filePath, String header, Map<String, Object>[] data,
                                Charset charset) throws IOException {

        // 親ディレクトリが存在しない場合は作成
        if (filePath.getParent() != null) {
            Files.createDirectories(filePath.getParent());
        }

        try (var writer = Files.newBufferedWriter(filePath, charset,
                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {

            // ヘッダー書き込み
            writer.write(header);
            writer.write(LINE_SEPARATOR);

            // データ行書き込み
            for (Map<String, Object> row : data) {
                String csvLine = row.values().stream()
                        .map(value -> sanitizeValue(value != null ? value.toString() : NULL_VALUE))
                        .collect(Collectors.joining(DELIMITER));

                writer.write(csvLine);
                writer.write(LINE_SEPARATOR);
            }
        }
    }

    /**
     * CSV値のサニタイズ処理
     * @param value 元の値
     * @return サニタイズされた値
     */
    private static String sanitizeValue(String value) {
        if (value == null) {
            return NULL_VALUE;
        }

        // 特殊文字のエスケープ
        return value.replace("\"", "\"\"")  // ダブルクォートのエスケープ
                .replace("\n", " ")      // 改行コードをスペースに
                .replace("\r", " ")      // 改行コードをスペースに
                .transform(s -> s.contains(DELIMITER) ? "\"" + s + "\"" : s); // カンマを含む場合はクォートで囲む
    }

    /**
     * オブジェクト配列からCSV行を生成
     * @param values 値の配列
     * @return CSV形式の文字列
     */
    public static String createCSVLine(Object... values) {
        if (values == null) {
            return NULL_VALUE;
        }

        return java.util.Arrays.stream(values)
                .map(value -> value != null ? value.toString() : NULL_VALUE)
                .map(CSVWriter::sanitizeValue)
                .collect(Collectors.joining(DELIMITER));
    }
}
```

### CSV ユーティリティクラスの比較

プロジェクトに 3 つの CSV ユーティリティが揃いました。各クラスの特徴と適した使用場面を整理します：

| 特徴                     | `CSVUtil`            | `CSVReadUtil`                | `CSVWriter`                  |
| ------------------------ | -------------------- | ---------------------------- | ---------------------------- |
| **主な用途**             | 複雑な CSV 読み書き  | 単純な CSV 読み込み          | シンプルな CSV 書き込み      |
| **データ構造**           | Map 配列             | String 配列リスト            | Map 配列                     |
| **ヘッダー処理**         | 詳細管理             | なし                         | 単純なヘッダー文字列         |
| **メモリ使用**           | 高（全データ保持）   | 中（行単位処理）             | 高（全データ保持）           |
| **書き込み機能**         | あり                 | なし                         | あり                         |
| **読み込み機能**         | あり                 | あり                         | なし                         |
| **文字エンコーディング** | ISO-8859-1 固定      | 指定可能（デフォルト UTF-8） | 指定可能（デフォルト UTF-8） |
| **特殊文字処理**         | 制限あり             | クォート処理                 | 高度なエスケープ処理         |
| **適したケース**         | 小規模データの入出力 | 大規模データの読み込み       | シンプルな形式の書き込み     |

### 使用例

#### シンプルな CSV 書き込み

```java
import com.example.orgchart_api.util.CSVWriter;

public class EmployeeExporter {
    public void exportEmployees(Map<String, Object>[] employeeData) {
        try {
            String header = "id,name,department,position";
            CSVWriter.writeCSV("employees.csv", header, employeeData);
        } catch (IOException e) {
            System.err.println("CSV書き込みエラー: " + e.getMessage());
        }
    }
}
```

#### 複数のユーティリティを組み合わせた処理

```java
import com.example.orgchart_api.util.*;

public class CsvTransformer {
    public void transformCsv(String sourcePath, String destPath) {
        CSVReadUtil reader = new CSVReadUtil();
        try {
            // 元CSVを読み込み（5列を想定）
            List<String[]> input = reader.read(sourcePath, 5);

            // データ変換
            Map<String, Object>[] output = new Map[input.size()];
            for (int i = 0; i < input.size(); i++) {
                Map<String, Object> row = Map.of(
                    "id", input.get(i)[0],
                    "fullName", input.get(i)[1] + " " + input.get(i)[2],
                    "department", input.get(i)[3]
                );
                output[i] = row;
            }

            // シンプルなCSV書き込み
            CSVWriter.writeCSV(destPath, "id,fullName,department", output);

        } catch (IOException | CSVException e) {
            handleError(e);
        }
    }
}
```

### ユーティリティの最適化ポイント

1. **ストリーム処理の統合**:

```java
// CSVWriterに追加
public static void writeCSVStream(Path filePath, String header, Stream<Map<String, Object>> dataStream,
                                  Charset charset) throws IOException {
    try (var writer = Files.newBufferedWriter(filePath, charset,
            StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {

        writer.write(header + LINE_SEPARATOR);

        dataStream.forEach(row -> {
            try {
                writer.write(createCSVLine(row));
                writer.write(LINE_SEPARATOR);
            } catch (IOException e) {
                throw new UncheckedIOException(e);
            }
        });
    }
}

private static String createCSVLine(Map<String, Object> row) {
    return row.values().stream()
            .map(value -> value != null ? value.toString() : NULL_VALUE)
            .map(CSVWriter::sanitizeValue)
            .collect(Collectors.joining(DELIMITER));
}
```

2. **エラーハンドリングの強化**:

```java
public static void writeCSV(Path filePath, String header, Map<String, Object>[] data,
                            Charset charset) throws CSVException {
    try {
        // 既存の実装
    } catch (IOException e) {
        throw new CSVException("CSV書き込みエラー: " + filePath, e);
    }
}
```

3. **カラムマッピングのサポート**:

```java
public static void writeCSV(Path filePath, List<String> headers,
                            List<Map<String, Object>> data, Charset charset) throws IOException {

    String headerLine = headers.stream()
            .map(CSVWriter::sanitizeValue)
            .collect(Collectors.joining(DELIMITER));

    try (var writer = Files.newBufferedWriter(filePath, charset,
            StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {

        writer.write(headerLine + LINE_SEPARATOR);

        for (Map<String, Object> row : data) {
            String csvLine = headers.stream()
                    .map(header -> sanitizeValue(row.getOrDefault(header, NULL_VALUE).toString()))
                    .collect(Collectors.joining(DELIMITER));
            writer.write(csvLine + LINE_SEPARATOR);
        }
    }
}
```

この CSV ユーティリティ群を活用することで、プロジェクト内で様々な CSV 処理ニーズに対応できるようになります。特に人事データのインポート/エクスポート機能では、データサイズや複雑さに応じて最適なユーティリティを選択することで、効率的な処理が可能になります。
