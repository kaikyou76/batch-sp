# JwtUtil JWT の生成・検証を行うユーティリティクラス

### (/orgchart-api/src/main/java/com/example/orgchart_api/util/JwtUtil.java)

```java
package com.example.orgchart_api.util;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret-key}")
    private String secretKey;

    @Value("${jwt.expiration}")
    private long expiration;

    private Key getSigningKey() {
        return Keys.hmacShaKeyFor(secretKey.getBytes());
    }

    public String generateToken(Map<String, Object> claims, String subject) {
        return Jwts.builder()
                .setClaims(claims)
                .setSubject(subject)
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expiration))
                .signWith(getSigningKey(), SignatureAlgorithm.HS512)
                .compact();
    }

    public String extractEmail(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token)
                .getBody()
                .getSubject();
    }

    public Boolean isTokenValid(String token) {
        try {
            Jwts.parserBuilder()
                .setSigningKey(getSigningKey())
                .build()
                .parseClaimsJws(token);
            return true;
        } catch (JwtException ex) {
            return false;
        }
    }

}
```

#### 已深度思考

> このクラスは JWT（JSON Web Token）の生成と検証を行うユーティリティクラスです。Spring の`@Component`として管理され、他のコンポーネントから利用されます。以下にクラスの役割と各メソッドを分析します。
>
> ### クラスの役割
>
> `JwtUtil`クラスは以下の機能を提供します：

1. **JWT の生成**: クレーム（情報の断片）とサブジェクト（通常はユーザー識別子）を含む JWT を生成する。
2. **JWT の検証**: トークンの署名と有効期限を検証する。
3. **トークンからの情報抽出**: トークンからサブジェクト（ここではメールアドレス）を抽出する。
   > ### フィールド

- `secretKey`: アプリケーションプロパティ（`jwt.secret-key`）から注入される秘密鍵。トークンの署名と検証に使用。
- `expiration`: アプリケーションプロパティ（`jwt.expiration`）から注入されるトークンの有効期間（ミリ秒単位）。
  > ### メソッドの分析
  >
  > #### 1. `private Key getSigningKey()`

```java
private Key getSigningKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes());
}
```

- **役割**: 秘密鍵を基に HMAC-SHA アルゴリズム用の署名鍵を生成する。
- **詳細**:
  - `Keys.hmacShaKeyFor(secretKey.getBytes())`は、秘密鍵のバイト配列から`Key`オブジェクトを生成します。
  - この鍵は JWT の署名と検証に使用されます。
  - アルゴリズムは後述のメソッドで`HS512`（HMAC using SHA-512）が指定されています。
    > #### 2. `public String generateToken(Map<String, Object> claims, String subject)`

```java
public String generateToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
            .setClaims(claims)
            .setSubject(subject)
            .setIssuedAt(new Date(System.currentTimeMillis()))
            .setExpiration(new Date(System.currentTimeMillis() + expiration))
            .signWith(getSigningKey(), SignatureAlgorithm.HS512)
            .compact();
}
```

- **役割**: クレームとサブジェクトを指定して JWT を生成する。
- **パラメータ**:
  - `claims`: JWT に含めるクレーム（キーと値のペア）。ユーザーの権限や追加情報などを設定可能。
  - `subject`: トークンの主体（通常はユーザーを一意に識別する情報。ここではメールアドレスを想定）。
- **処理の流れ**:
  1. `Jwts.builder()`でビルダーオブジェクトを取得。
  2. クレームを設定（`setClaims`）。
  3. サブジェクト（主体）を設定（`setSubject`）。
  4. トークン発行日時を現在時刻に設定（`setIssuedAt`）。
  5. 有効期限を現在時刻＋`expiration`ミリ秒に設定（`setExpiration`）。
  6. 署名鍵（`getSigningKey()`で生成）とアルゴリズム（`HS512`）を指定して署名（`signWith`）。
  7. `compact()`で JWT 文字列を生成して返す。
     > #### 3. `public String extractEmail(String token)`

```java
public String extractEmail(String token) {
    return Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token)
            .getBody()
            .getSubject();
}
```

- **役割**: JWT からサブジェクト（メールアドレス）を抽出する。
- **パラメータ**: `token` - JWT 文字列。
- **処理の流れ**:
  1. `Jwts.parserBuilder()`でパーサービルダーを取得。
  2. 署名鍵を設定（`setSigningKey`）。
  3. パーサーをビルド（`build`）。
  4. トークンを解析（`parseClaimsJws(token)`）。ここで署名の検証も行われる（無効な場合は例外がスローされる）。
  5. トークンのボディ（クレームセット）を取得（`getBody`）。
  6. ボディからサブジェクト（`getSubject`）を取得して返す。
- **注意**: このメソッドはトークンの署名を検証しますが、有効期限のチェックは行いません（`parseClaimsJws`が自動的に有効期限をチェックします）。有効期限が切れている場合は`ExpiredJwtException`がスローされます。
  > #### 4. `public Boolean isTokenValid(String token)`

```java
public Boolean isTokenValid(String token) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token);
        return true;
    } catch (JwtException ex) {
        return false;
    }
}
```

- **役割**: JWT の有効性（署名と有効期限）を検証する。
- **パラメータ**: `token` - JWT 文字列。
- **処理の流れ**:
  1. パーサーを構築し、署名鍵を設定。
  2. `parseClaimsJws(token)`を実行してトークンを解析。この過程で以下のチェックが行われる：
     - 署名の検証
     - 有効期限のチェック（切れていないか）
  3. 解析が成功（例外が発生しなければ）すれば`true`を返す。
  4. 何らかの`JwtException`（署名が不正、有効期限切れ、トークンの形式が不正など）が発生した場合は`false`を返す。
- **注意**: このメソッドはトークンが有効かどうかのみを返し、例外の詳細をログに残すなどの処理は行いません。デバッグ時には例外をログ出力するなどの対応が考えられます。
  > ### まとめ
  >
  > `JwtUtil`クラスは、JWT の生成・検証・情報抽出をカプセル化したユーティリティです。Spring のプロパティから秘密鍵と有効期限を注入し、jjwt ライブラリを利用して JWT 操作を行います。生成されたトークンはクレームとサブジェクト（メールアドレス）を含み、有効期限が設定されます。また、トークンの検証とサブジェクトの抽出機能を提供します。このクラスは、認証フィルター（`JwtAuthenticationFilter`）から利用されることを想定しています。

## JwtUtil クラスの分析

### クラスの役割

`JwtUtil` は **JWT(JSON Web Token) の操作をカプセル化したユーティリティクラス**で、以下の主要機能を提供します：

1. JWT トークンの生成（署名付き）
2. トークンからの情報抽出（例：ユーザー識別子）
3. トークンの有効性検証（署名・有効期限）
4. 秘密鍵の管理

Spring の`@Component`として実装されており、DI（依存性注入）を通じて他のコンポーネントから利用されます。

---

### フィールド変数

```java
@Value("${jwt.secret-key}")
private String secretKey;  // 署名用秘密鍵（プロパティから注入）

@Value("${jwt.expiration}")
private long expiration;   // トークン有効期間（ミリ秒）
```

---

### メソッド詳細分析

#### 1. `private Key getSigningKey()`

```java
private Key getSigningKey() {
    return Keys.hmacShaKeyFor(secretKey.getBytes());
}
```

- **役割**: 署名用鍵の生成
- **処理内容**:
  - プロパティから注入された`secretKey`文字列をバイト配列に変換
  - JJWT ライブラリの`Keys.hmacShaKeyFor()`で HMAC-SHA アルゴリズム用の鍵を生成
- **重要ポイント**:
  - 鍵生成コストを抑えるため、インスタンス生成時に 1 回だけ実行されるべき
  - HS512 アルゴリズム（強力な SHA-512 ハッシュ）を使用

---

#### 2. `generateToken()` - トークン生成

```java
public String generateToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
        .setClaims(claims)  // カスタムクレーム設定
        .setSubject(subject) // 主体（通常ユーザーID/メール）
        .setIssuedAt(new Date(System.currentTimeMillis())) // 発行時刻
        .setExpiration(new Date(System.currentTimeMillis() + expiration)) // 有効期限
        .signWith(getSigningKey(), SignatureAlgorithm.HS512) // 署名
        .compact(); // 文字列生成
}
```

- **役割**: JWT トークンの生成と署名
- **パラメータ**:
  - `claims`: 追加情報（ユーザーロール等）
  - `subject`: 主体識別子（ユーザー Email 等）
- **処理フロー**:
  1. クレーム（ペイロード）にユーザー情報を設定
  2. 発行時刻(iat)と有効期限(exp)を設定
  3. HS512 アルゴリズムで署名
  4. トークン文字列を生成
- **生成例**:
  ```json
  {
    "sub": "user@example.com",
    "role": "admin",
    "iat": 1672531200,
    "exp": 1672617600
  }
  ```

---

#### 3. `extractEmail()` - 情報抽出

```java
public String extractEmail(String token) {
    return Jwts.parserBuilder()
        .setSigningKey(getSigningKey())
        .build()
        .parseClaimsJws(token) // 署名検証付き解析
        .getBody()
        .getSubject(); // subクレーム取得
}
```

- **役割**: トークンから主体情報（subject）を抽出
- **処理内容**:
  1. パーサーに署名鍵を設定
  2. トークンを解析して`Jws<Claims>`オブジェクトを取得
  3. ペイロード(body)から subject フィールドを抽出
- **注意点**:
  - 署名検証が自動で行われる（無効なトークンは例外発生）
  - メソッド名は`extractEmail`だが、実際は subject を返す

---

#### 4. `isTokenValid()` - 有効性検証

```java
public Boolean isTokenValid(String token) {
    try {
        Jwts.parserBuilder()
            .setSigningKey(getSigningKey())
            .build()
            .parseClaimsJws(token); // 解析実行
        return true;
    } catch (JwtException ex) {
        return false;
    }
}
```

- **役割**: トークンの包括的な有効性チェック
- **検証内容**:
  - 署名の正当性（改竄検知）
  - 有効期限(exp)の切れていないか
  - トークン形式の正当性
- **例外処理**:
  - `ExpiredJwtException`: 有効期限切れ
  - `MalformedJwtException`: 不正な形式
  - `SignatureException`: 署名不一致
  - その他エラーはすべて`false`を返す

---

### セキュリティ特性

1. **強力な署名アルゴリズム**

   - HS512（HMAC with SHA-512）を使用
   - 256 ビット以上の秘密鍵が推奨

2. **クレーム設計**

   - `sub` (subject): ユーザー識別子
   - `iat` (issued at): 発行時刻
   - `exp` (expiration): 有効期限
   - カスタム claims で拡張可能

3. **エラーハンドリング**
   - 検証失敗時は例外キャッチで false を返す
   - 具体的なエラー種別はログ出力されない（セキュリティ上の配慮）

---

### 典型的な利用例

```java
// トークン生成
Map<String,Object> claims = Map.of("role", "admin");
String token = jwtUtil.generateToken(claims, "user@example.com");

// トークン検証
if(jwtUtil.isTokenValid(token)) {
    String email = jwtUtil.extractEmail(token);
    // 認証処理...
}
```

### 改善提案

1. **エラーログの追加**

   ```java
   catch (JwtException ex) {
       log.error("JWT validation error: {}", ex.getMessage());
       return false;
   }
   ```

2. **クレーム取得の汎用化**

   ```java
   public Claims extractAllClaims(String token) {
       return Jwts.parserBuilder()...parseClaimsJws(token).getBody();
   }
   ```

3. **鍵のキャッシュ**
   ```java
   private final Key signingKey; // コンストラクタで初期化
   ```

このクラスは JWT 認証システムの中核として、トークンのライフサイクル管理を安全に実装しています。
