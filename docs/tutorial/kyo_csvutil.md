<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">CSV ファイルのユーティリティ </span>

## CSV ファイルのユーティリティ

```java
package com.example.orgchart_api.util;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

import org.springframework.util.StringUtils;
import com.example.orgchart_api.exception.CSVException;
/**
 * <pre>
 * CSVファイルのユーティリティ
 * </pre>
 *
 * @version 1.0 2013/09/12
 */
public class CSVUtil {

    /** 改行コード */
    private static final String RETURN_CD = System.lineSeparator();

    /** 標準の区切り文字 */
    private static final String DEFAULT_DELIM = ",";

    /** Null を表現する文字列 */
    private static final String DEFAULT_NULL_VALUE = "";

    /** CSV ファイル名 */
    private String fileName;

    /** ヘッダー情報 */
    private final List<String> headerList = new ArrayList<>();
    /** データ */
    private Map<String, Object>[] dataMap;
    /** 各値の最大サイズ */
    private final List<Object> sizeList = new ArrayList<>();
    /** ヘッダーフラグ */
    private boolean hasHeader = false;
    /** 囲み文字フラグ */
    private String quotation = "";

    /** CSVヘッダー出力を設定値にする */
    private boolean headeroutplain = false;
    /** MYヘッダー情報 */
    private final List<String> myheaderList = new ArrayList<>();

    /** 区切り文字 */
    private String delim = DEFAULT_DELIM;
    /** Null 値を表現する文字列 */
    private String nullValue = DEFAULT_NULL_VALUE;

    /** 文字コード */
    private static final Charset CHARSET = StandardCharsets.ISO_8859_1;

    /**
     * デフォルトコンストラクタ
     * @param data CSVファイルの情報(ヘッダーと値が対になっているMAP)
     */
    @SuppressWarnings("unchecked")
    public CSVUtil(final Map<String, Object>[] data) {
        super();
        this.dataMap = data.clone();
    }

    /**
     * デフォルトコンストラクタ
     * @param fileName CSVファイル名
     */
    public CSVUtil(final String fileName) {
        super();
        this.fileName = fileName;
    }

    /**
     * ヘッダーフラグを設定します。
     * @param hasHeader ヘッダーフラグ
     */
    public void setHasHeader(boolean hasHeader) {
        this.hasHeader = hasHeader;
    }

    /**
     * ヘッダーフラグを取得します。
     * @return ヘッダーフラグ
     */
    public boolean getHasHeader() {
        return hasHeader;
    }

    /**
     * 区切り文字を取得します。
     * @return 区切り文字
     */
    public String getDelim() {
        return delim;
    }

    /**
     * 区切り文字を設定します。
     * @param delim 区切り文字
     */
    public void setDelim(String delim) {
        this.delim = delim;
    }

    /**
     * 囲み文字フラグを取得します。
     * @return 囲み文字フラグ
     */
    public String getQuotation() {
        return quotation == null ? "\"" : quotation;
    }

    /**
     * 囲み文字フラグを設定します。
     * @param quotation 囲み文字フラグ
     */
    public void setQuotation(String quotation) {
        this.quotation = quotation;
    }

    /**
     * CSV ファイル名を設定します。
     * @param argFileName CSV ファイル名
     */
    public void setFileName(final String argFileName) {
        this.fileName = argFileName;
    }

    /**
     * CSV ファイル名を取得します。
     * @return CSV ファイル名
     */
    public String getFileName() {
        return this.fileName;
    }

    /**
     * ヘッダー情報を設定します。
     * @param header ヘッダー情報
     */
    public void addHeader(final String header) {
        headerList.add(header);
        sizeList.add(new NullValue());
    }

    /**
     * ヘッダー情報を設定します。
     * @param header ヘッダー情報
     * @param size 値の最大サイズ(バイト)
     */
    public void addHeader(final String header, final int size) {
        headerList.add(header);
        sizeList.add(size);
    }

    /**
     * ヘッダー情報を取得します。
     * @return ヘッダー情報
     */
    public List<String> getHeaderList() {
        return new ArrayList<>(headerList);
    }

    /**
     * CSVヘッダーを設定値で出力するかを設定します。
     * @param headeroutplain
     */
    public void setHeaderOutPlain(boolean headeroutplain) {
        this.headeroutplain = headeroutplain;
    }

    /**
     * CSVヘッダーを設定値で出力するかを取得します。
     * @return boolean
     */
    public boolean getHeaderOutPlain() {
        return this.headeroutplain;
    }

    /**
     * ヘッダー情報を設定します。
     * @param header ヘッダー情報
     */
    public void myAddHeader(final String header) {
        myheaderList.add(header);
        sizeList.add(new NullValue());
    }

    /**
     * CSV 形式の文字列を取得します。
     * @return CSV 形式の文字列
     */
    public String getCSVString() {
        StringBuilder buf = new StringBuilder();

        // ヘッダー
        if (getHasHeader()) {
            List<String> headers = getHeaderOutPlain() ? myheaderList : headerList;
            for (int i = 0; i < headers.size(); i++) {
                buf.append(getQuotation())
                        .append(headers.get(i))
                        .append(getQuotation());
                if (i != headers.size() - 1) {
                    buf.append(getDelim());
                }
            }
            buf.append(RETURN_CD);
        }

        // 値
        for (Map<String, Object> map : dataMap) {
            for (int j = 0; j < headerList.size(); j++) {
                buf.append(getQuotation())
                        .append(replaceStr(map.get(headerList.get(j)), sizeList.get(j)))
                        .append(getQuotation());

                if (headerList.size() - 1 != j) {
                    buf.append(getDelim());
                }
            }
            buf.append(RETURN_CD);
        }

        return buf.toString();
    }

    /**
     * CSVファイルをHDDに書き込みます。
     * @throws IOException 書き込みエラー
     */
    public void write() throws IOException {
        String csv = getCSVString();
        Path path = Path.of(fileName);

        // 親ディレクトリ作成
        if (path.getParent() != null) {
            Files.createDirectories(path.getParent());
        }

        try (BufferedWriter bw = Files.newBufferedWriter(path, CHARSET,
                StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING)) {
            bw.write(csv);
        }
    }

    /**
     * CSVファイルをHDDから読み込みます。
     * @throws IOException 読み込みエラー
     * @throws CSVException CSVファイルに異常がある場合
     */
    @SuppressWarnings("unchecked")
    public void read() throws IOException, CSVException {
        List<Map<String, Object>> valueList = new ArrayList<>();
        Path path = Path.of(fileName);

        try (BufferedReader br = Files.newBufferedReader(path, CHARSET)) {
            String line;
            int lineCnt = 0;
            boolean read = false;

            while ((line = br.readLine()) != null) {
                lineCnt++;

                StringTokenizer st = new StringTokenizer(
                        "<" + StringUtils.replace(line, getDelim(), ">" + getDelim() + "<") + ">",
                        getDelim());

                // ヘッダー行
                if (getHasHeader() && !read) {
                    headerList.clear();
                    while (st.hasMoreTokens()) {
                        String token = processToken(st.nextToken());
                        headerList.add(token);
                    }
                    read = true;
                }
                // 値行
                else {
                    if (st.countTokens() != headerList.size()) {
                        throw new CSVException(String.format(
                                "ヘッダーの数と値の数が一致していません。[%d]行目 headerList.size：[%d], countTokens：[%d]",
                                lineCnt, headerList.size(), st.countTokens()));
                    }

                    Map<String, Object> value = new HashMap<>();
                    int cnt = 0;

                    while (st.hasMoreTokens()) {
                        String token = processToken(st.nextToken());
                        value.put(headerList.get(cnt),
                                token.equals(getNullValue()) ? null : token);
                        cnt++;
                    }

                    valueList.add(value);
                }
            }
        }

        dataMap = valueList.toArray(new Map[0]);
    }

    private String processToken(String token) {
        token = token.substring(1, token.length() - 1);
        if (!"".equals(getQuotation()) && token.startsWith(getQuotation()) && token.endsWith(getQuotation())) {
            token = token.substring(1, token.length() - 1);
        }
        return token;
    }

    /**
     * フォーマット変換を行います。
     * @param argSource 変換対象のオブジェクト
     * @param size 値の最大サイズ
     * @return フォーマットされた文字列
     */
    public String replaceStr(final Object argSource, final Object size) {
        if (argSource == null) {
            return getNullValue();
        }

        String source;
        if (argSource instanceof LocalDateTime) {
            source = DateTimeFormatter.ISO_LOCAL_DATE_TIME.format((LocalDateTime) argSource);
        } else {
            source = argSource.toString()
                    .replace("\n", "")
                    .replace("\r", "")
                    .replace(",", ".")
                    .replace("\"", " ");

            // 最大サイズ以上は切り捨て
            if (size instanceof Integer maxSize && source.length() > maxSize) {
                source = source.substring(0, maxSize);
            }
        }
        return source;
    }

    /**
     * CSV ファイルの内容をMap配列で取得します。
     * @return CSV ファイルの内容
     */
    @SuppressWarnings("unchecked")
    public Map<String, Object>[] getDataMaps() {
        return dataMap.clone();
    }

    /**
     * CSV ファイルの内容をMap配列で設定します。
     * @param dataMap CSV ファイルの内容
     */
    @SuppressWarnings("unchecked")
    public void setDataMaps(Map<String, Object>[] dataMap) {
        this.dataMap = dataMap.clone();
    }

    /**
     * CSVファイルが存在するかを確認します。
     * @return true:存在する false:存在しない
     */
    public boolean existFile() {
        return Files.isRegularFile(Path.of(fileName));
    }

    /**
     * Null 値を表現する文字列を取得します。
     * @return Null 値を表現する文字列
     */
    public String getNullValue() {
        return nullValue;
    }

    /**
     * Null 値を表現する文字列を設定します。
     * @param nullValue Null 値を表現する文字列
     */
    public void setNullValue(String nullValue) {
        this.nullValue = nullValue;
    }

    /**
     * timestampを付与したFileNMを取得します。
     * @return FileName_YYYYMMDDHHMMSS.xxx
     */
    public String getTimestampAddFileNM(String fileName) {
        if (fileName == null) return "";
        return formatFileName(fileName, "");
    }

    /**
     * Export用FileNMを取得します。
     * @return FileName_EXPORTED_YYYYMMDDHHMMSS.xxx
     */
    public String getExpTimeAddFileNM(String fileName) {
        if (fileName == null) return "";
        return formatFileName(fileName, "_EXPORTED");
    }

    /**
     * Import用FileNMを取得します。
     * @return FileName_IMPORTED_YYYYMMDDHHMMSS.xxx
     */
    public String getImpTimeAddFileNM(String fileName) {
        if (fileName == null) return "";
        return formatFileName(fileName, "_IMPORTED");
    }

    private String formatFileName(String fileName, String suffix) {
        String[] fileSplit = fileName.split("\\.", 2);
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        return fileSplit[0] + suffix + "_" + timestamp + "." + fileSplit[1];
    }
}

/**
 * Null を表現するクラス
 */
final class NullValue {
}

```

#### 已深度思考

````
ジェクト構造に基づき、CSVUtilクラスを配置する適切な場所を検討します。

既存のプロジェクト構造:
orgchart-api/
  ├── src/
  │   ├── main/
  │   │   ├── java/
  │   │   │   └── com/example/orgchart_api/
  │   │   │       ├── ... （既存のパッケージ）
  │   │   │       └── util/  （新しいパッケージを作成）

CSVUtilはCSVファイルの読み書きを行うユーティリティクラスです。したがって、utilパッケージに配置するのが適切です。

ただし、現在のプロジェクト構造にはutilパッケージが存在しないため、新たに作成します。

配置先:
  src/main/java/com/example/orgchart_api/util/CSVUtil.java

また、CSVUtilが使用している例外クラスCSVExceptionについても、例外パッケージに配置します。

配置先:
  src/main/java/com/example/orgchart_api/exception/CSVException.java

ただし、提供されたコードにはCSVExceptionのコードが含まれていないため、CSVExceptionクラスも作成する必要があります。

しかし、提供されたコードにはCSVExceptionの定義がありません。代わりに、jp.co.ksc.batch.exception.CSVExceptionをインポートしています。
プロジェクトのパッケージ構造に合わせて、この例外クラスを自プロジェクト内に作成します。

手順:
1. utilパッケージの作成: com.example.orgchart_api.util
2. CSVUtil.javaをutilパッケージに配置
3. CSVException.javaをexceptionパッケージに作成

ただし、元のCSVUtilがjp.co.ksc.batch.exception.CSVExceptionを使用しているので、それをcom.example.orgchart_api.exception.CSVExceptionに変更します。

また、CSVUtil内で使用されている他の外部クラス（jp.co.ksc.spring.AuthenticationToken, jp.co.ksc.spring.security.TokenManagerなど）はこのクラスでは使用されていないため問題ありません。

修正点:
 - パッケージ宣言を変更: package com.example.orgchart_api.util;
 - CSVExceptionのインポートを変更: import com.example.orgchart_api.exception.CSVException;

追加で必要な作業:
 - CSVExceptionクラスを例外パッケージに作成

CSVException.javaの内容（シンプルな実装）:

```java
package com.example.orgchart_api.exception;

public class CSVException extends Exception {
   public CSVException(String message) {
       super(message);
   }
}
````

以上を踏まえて、以下のようにファイルを配置します。

ファイル構成:
src/main/java/com/example/orgchart_api/util/CSVUtil.java
src/main/java/com/example/orgchart_api/exception/CSVException.java

また、CSVUtil 内で使用されている NullValue クラスは CSVUtil の内部クラスとしてそのまま保持します（最終クラスとして定義されているため）。

注意: 提供された CSVUtil コードでは、jp.co.ksc.batch.exception.CSVException を投げていますが、上記のように自プロジェクトの例外に変更します。

コードの修正点:

- パッケージを com.example.orgchart_api.util に変更
- import jp.co.ksc.batch.exception.CSVException; を import com.example.orgchart_api.exception.CSVException; に変更

その他のインポートでプロジェクトに存在しないものがあれば、適宜調整する必要がありますが、現在のコードでは標準ライブラリと Spring Framework の util パッケージのみを使用しているため、問題ないはずです。

また、提供されたコードに含まれる NullValue クラスは CSVUtil の末尾で定義されているので、そのまま残します。

以上です。

````

### CSVUtilクラスの配置

プロジェクト構造に基づいて、`CSVUtil`クラスを以下のように配置します：

**配置先パッケージ**:
`src/main/java/com/example/orgchart_api/util/CSVUtil.java`

```java
package com.example.orgchart_api.util;

import com.example.orgchart_api.exception.CSVException;
import org.springframework.util.StringUtils;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.IOException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.StandardOpenOption;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.StringTokenizer;

/**
 * CSVファイルのユーティリティ
 */
public class CSVUtil {

    // クラス実装内容は提供されたまま...
    // [全コードは変更せずそのまま配置]

    /**
     * Null を表現するクラス
     */
    final static class NullValue {
    }
}
````

### 関連コンポーネントの配置

1. **CSVException クラス**:
   `src/main/java/com/example/orgchart_api/exception/CSVException.java`

   ```java
   package com.example.orgchart_api.exception;

   /**
    * CSV処理専用例外クラス
    */
   public class CSVException extends Exception {
       public CSVException(String message) {
           super(message);
       }

       public CSVException(String message, Throwable cause) {
           super(message, cause);
       }
   }
   ```

2. **依存関係の更新** (pom.xml):
   ```xml
   <dependencies>
       <!-- CSV処理に必要な依存関係 -->
       <dependency>
           <groupId>org.springframework</groupId>
           <artifactId>spring-core</artifactId>
       </dependency>
       <dependency>
           <groupId>org.apache.commons</groupId>
           <artifactId>commons-lang3</artifactId>
           <version>3.12.0</version>
       </dependency>
   </dependencies>
   ```

### 使用例

#### CSV ファイルの書き込み

```java
// サービス層での使用例
import com.example.orgchart_api.util.CSVUtil;

public class EmployeeExportService {

    public void exportEmployees(List<Map<String, Object>> employeeData) {
        @SuppressWarnings("unchecked")
        Map<String, Object>[] dataArray = employeeData.toArray(new Map[0]);

        CSVUtil csvUtil = new CSVUtil(dataArray);
        csvUtil.setFileName("employees_export.csv");
        csvUtil.setHasHeader(true);

        // ヘッダー定義
        csvUtil.addHeader("employee_id");
        csvUtil.addHeader("name");
        csvUtil.addHeader("department");

        try {
            csvUtil.write();
        } catch (IOException e) {
            throw new CSVException("CSV書き込みエラー", e);
        }
    }
}
```

#### CSV ファイルの読み込み

```java
// バッチ処理での使用例
import com.example.orgchart_api.util.CSVUtil;

public class EmployeeImportBatch {

    public List<Map<String, Object>> importEmployees(String filePath) {
        CSVUtil csvUtil = new CSVUtil(filePath);
        csvUtil.setHasHeader(true);

        try {
            csvUtil.read();
            return Arrays.asList(csvUtil.getDataMaps());
        } catch (IOException | CSVException e) {
            throw new BatchProcessingException("CSV読み込みエラー", e);
        }
    }
}
```

### 主な機能の特徴

1. **柔軟な CSV 操作**:

   ```mermaid
   classDiagram
       class CSVUtil {
           -String fileName
           -List~String~ headerList
           -Map~String, Object~[] dataMap
           +addHeader(String header)
           +addHeader(String header, int size)
           +getCSVString() String
           +write() void
           +read() void
       }
   ```

2. **主要メソッド**:
   | メソッド名 | 説明 |
   |------------|------|
   | `addHeader()` | CSV ヘッダーを追加 |
   | `getCSVString()` | メモリ上に CSV 文字列を生成 |
   | `write()` | ファイルに CSV を出力 |
   | `read()` | CSV ファイルを読み込み |
   | `getTimestampAddFileName()` | タイムスタンプ付きファイル名生成 |

3. **設定可能なオプション**:
   - 区切り文字のカスタマイズ（デフォルト: `,`）
   - クォーテーション文字の指定（デフォルト: `""`）
   - NULL 値の表現方法
   - ヘッダーの有無
   - 文字エンコーディング（固定: ISO-8859-1）

### 設計上の考慮点

1. **Streaming 処理への拡張**:

   ```java
   // 大規模ファイル用のストリーミング処理例
   public void processLargeCSV(String filePath) {
       try (BufferedReader reader = Files.newBufferedReader(Path.of(filePath))) {
           String line;
           while ((line = reader.readLine()) != null) {
               // 行単位で処理
           }
       } catch (IOException e) {
           // エラーハンドリング
       }
   }
   ```

2. **文字エンコーディングの拡張**:

   ```java
   public class CSVUtil {
       private Charset charset = StandardCharsets.ISO_8859_1;

       public void setCharset(Charset charset) {
           this.charset = charset;
       }
   }
   ```

3. **Spring Batch 連携**:
   `ItemReader`実装クラスでの活用

   ```java
   public class CsvItemReader implements ItemReader<Employee> {
       private final CSVUtil csvUtil;
       private int currentIndex = 0;

       public CsvItemReader(String filePath) {
           csvUtil = new CSVUtil(filePath);
           // CSV読み込み処理...
       }

       @Override
       public Employee read() {
           if (currentIndex >= csvUtil.getDataMaps().length) return null;
           return convertToEntity(csvUtil.getDataMaps()[currentIndex++]);
       }
   }
   ```

この CSV ユーティリティクラスを util パッケージに配置することで、以下のような場面で活用できます：

- バッチ処理での CSV 入出力
- 管理機能でのデータエクスポート
- 外部システム連携時のデータ変換
- バックアップファイルの生成

特に Spring Batch 処理と組み合わせることで、大規模な人事データのバッチ処理を効率的に実装できます。
