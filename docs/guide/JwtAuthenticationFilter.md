# 01_JwtAuthenticationFilter JWT 認証フィルター

### (/orgchart-api/src/main/java/com/example/orgchart_api/security/JwtAuthenticationFilter.java)

```java
/*
 * Copyright (c) 2025, kaikyou DX, LIMITED All Rights Reserved.
 *
 *
 * JwtAuthenticationFilter.java
 *
 * @date 2025/06/29
 * @version 1.0
 * @author kaikyou
 */
package com.example.orgchart_api.security;

import com.example.orgchart_api.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
// ✅ 修正：正しいパッケージへ変更
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;


@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;

    @Autowired
    public JwtAuthenticationFilter(JwtUtil jwtUtil) {
        this.jwtUtil = jwtUtil;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        // OPTIONSメソッドはスキップ
        if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ 登録APIはJWT認証をスキップ
        if (request.getServletPath().contains("/api/register")) {
            filterChain.doFilter(request, response);
            return;
        }

        // ✅ トークン取得
        String token = getTokenFromRequest(request);

        // ✅ トークン検証
        if (token != null && jwtUtil.isTokenValid(token)) {
            String email = jwtUtil.extractEmail(token);
            Authentication auth = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
            SecurityContextHolder.getContext().setAuthentication(auth);
        }

        filterChain.doFilter(request, response);
    }

    // ✅ ヘッダーからJWTトークンを抽出
    private String getTokenFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // "Bearer " を除去してトークンのみ返す
        }
        return null;
    }
}
```

#### 已深度思考

> このクラスは Spring Security のフィルターとして機能し、JWT(JSON Web Token)を用いた認証を実装しています。以下にクラスの役割と各メソッドの詳細を分析します。
>
> ### クラスの役割
>
> `JwtAuthenticationFilter`は、HTTP リクエストが来た際に JWT トークンを検証し、認証情報をセキュリティコンテキストに設定する役割を持ちます。このフィルターは`OncePerRequestFilter`を継承しており、各リクエストに対して一度だけ実行されます。
>
> ### フィルターの処理フロー

1. **OPTIONS メソッドのリクエストはスキップ**（プリフライトリクエストのため）
2. **特定のパス（/api/register）へのリクエストは認証をスキップ**
3. リクエストヘッダーから JWT トークンを抽出
4. トークンが有効であれば、トークンからユーザー情報（ここではメールアドレス）を抽出
5. 抽出した情報を用いて`Authentication`オブジェクトを作成し、セキュリティコンテキストに設定
6. フィルターチェーンを続行
   > ### メソッドの分析
   >
   > #### 1. コンストラクタ

```java
@Autowired
public JwtAuthenticationFilter(JwtUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
}
```

- **役割**: `JwtUtil`の依存性を注入します。`JwtUtil`は JWT トークンの生成・検証を行うユーティリティクラスです。
  > #### 2. `doFilterInternal`メソッド

```java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {
    // ... 処理 ...
}
```

- **役割**: 実際のフィルタリング処理を行うメインのメソッドです。各リクエストに対して実行されます。
  > **処理の詳細**:
- **OPTIONS メソッドのスキップ**:
  ```java
  if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
      filterChain.doFilter(request, response);
      return;
  }
  ```
  - HTTP の OPTIONS メソッド（プリフライトリクエスト）が来た場合は、認証処理を行わずに次のフィルターに進めます。これは CORS のプリフライトリクエストを処理するためです。
    > - **特定パスのスキップ**:
  ```java
  if (request.getServletPath().contains("/api/register")) {
      filterChain.doFilter(request, response);
      return;
  }
  ```
  - ユーザー登録 API（`/api/register`）へのリクエストは認証をスキップします。このパスは公開 API であるため、認証なしでアクセスできるようにするためです。
    > - **トークンの抽出と検証**:
  ```java
  String token = getTokenFromRequest(request);
  if (token != null && jwtUtil.isTokenValid(token)) {
      String email = jwtUtil.extractEmail(token);
      Authentication auth = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
      SecurityContextHolder.getContext().setAuthentication(auth);
  }
  ```
  - リクエストからトークンを取得します（後述の`getTokenFromRequest`メソッド）。
  - トークンが存在し、かつ有効（有効期限や署名が正しい）であれば、トークンからメールアドレスを抽出します。
  - 抽出したメールアドレスを使って`UsernamePasswordAuthenticationToken`（`Authentication`の実装）を作成します。この時点ではパスワードは不要なので`null`を渡し、権限リストは空のリストを渡しています（実際のアプリケーションでは権限情報もトークンに含めることが多いですが、この例では空です）。
  - 作成した認証オブジェクトを`SecurityContextHolder`に設定します。これにより、このリクエストの間、認証済みのユーザーとして扱われます。
    > - **フィルターチェーンの続行**:
  ```java
  filterChain.doFilter(request, response);
  ```
  - 最後に必ず`filterChain.doFilter`を呼び出して、次のフィルターや実際のリソース（コントローラー）に処理を進めます。
    > #### 3. `getTokenFromRequest`メソッド

```java
private String getTokenFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
        return bearerToken.substring(7); // "Bearer " を除去してトークンのみ返す
    }
    return null;
}
```

- **役割**: リクエストの Authorization ヘッダーから Bearer トークンを抽出します。
- **処理**:
  - `Authorization`ヘッダーの値を取得します。
  - ヘッダー値が存在し、かつ"Bearer "で始まっている場合、先頭の 7 文字（"Bearer "）を取り除いた部分（実際のトークン）を返します。
  - 条件に合わない場合は`null`を返します。
    > ### まとめ
    >
    > このフィルターは、リクエストが保護されたリソースにアクセスする際に、JWT トークンによる認証を行う役割を担っています。ただし、OPTIONS メソッドや特定の公開パス（登録 API）については認証をスキップします。有効なトークンが提供された場合は、そのトークンからユーザー情報（メールアドレス）を抽出してセキュリティコンテキストに認証情報を設定します。これにより、コントローラー層では`SecurityContextHolder`を通じて認証済みユーザーの情報を取得できるようになります。

### クラスの役割

`JwtAuthenticationFilter` は Spring Security のカスタムフィルターで、**JWT(JSON Web Token)による認証処理**を担当します。具体的には：

1. リクエストヘッダーから JWT トークンを抽出
2. トークンの有効性を検証
3. 認証成功時にセキュリティコンテキストに認証情報を設定
4. 特定のパス（登録 API など）では認証をスキップ
5. OPTIONS メソッド（CORS プリフライトリクエスト）をスキップ

### 各メソッドの分析

---

#### **コンストラクタ**

```java
@Autowired
public JwtAuthenticationFilter(JwtUtil jwtUtil) {
    this.jwtUtil = jwtUtil;
}
```

- **役割**: 依存性注入（DI）で`JwtUtil`を取得
- **詳細**:
  - `JwtUtil`: JWT の生成・検証を行うユーティリティクラス
  - Spring の DI コンテナからインスタンスを受け取り、フィールドに保持

---

#### **doFilterInternal()**

```java
@Override
protected void doFilterInternal(HttpServletRequest request,
                                HttpServletResponse response,
                                FilterChain filterChain)
        throws ServletException, IOException {
    // メイン処理
}
```

- **役割**: フィルターの核心処理（リクエストごとに実行）
- **処理フロー**:

  1. **OPTIONS メソッドのスキップ**

     ```java
     if ("OPTIONS".equalsIgnoreCase(request.getMethod())) {
         filterChain.doFilter(request, response);
         return;
     }
     ```

     - CORS プリフライトリクエストは認証不要のため即時通過

  2. **登録 API のスキップ**

     ```java
     if (request.getServletPath().contains("/api/register")) {
         filterChain.doFilter(request, response);
         return;
     }
     ```

     - ユーザー登録パスは認証不要のためスキップ

  3. **トークン抽出と検証**

     ```java
     String token = getTokenFromRequest(request);
     if (token != null && jwtUtil.isTokenValid(token)) {
         String email = jwtUtil.extractEmail(token);
         Authentication auth = new UsernamePasswordAuthenticationToken(email, null, new ArrayList<>());
         SecurityContextHolder.getContext().setAuthentication(auth);
     }
     ```

     - 有効なトークン場合:
       - メールアドレスを抽出
       - 認証オブジェクト(`UsernamePasswordAuthenticationToken`)作成
       - 権限リストは空（`new ArrayList<>()`）※実際の実装では権限情報を追加可能
       - セキュリティコンテキストに認証情報を設定

  4. **フィルターチェーン継続**
     ```java
     filterChain.doFilter(request, response);
     ```
     - 後続のフィルター/コントローラーに処理を委譲

---

#### **getTokenFromRequest()**

```java
private String getTokenFromRequest(HttpServletRequest request) {
    String bearerToken = request.getHeader("Authorization");
    if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
        return bearerToken.substring(7); // "Bearer " を除去
    }
    return null;
}
```

- **役割**: リクエストヘッダーから JWT トークンを抽出
- **処理**:
  1. `Authorization`ヘッダー値を取得
  2. 値が `Bearer ` で始まるか検証
  3. 有効な場合は接頭辞を除去（`substring(7)`）しトークンのみを返却
- **重要ポイント**:
  - `StringUtils.hasText()`: Null/空文字/空白文字をチェック（Spring 提供）
  - フォーマット: `Bearer <JWTトークン>` (RFC 6750 準拠)

---

### クラスの重要な特性

1. **スキップ条件の最適化**
   - OPTIONS メソッドと登録 API を効率的に除外
2. **ステートレス認証**
   - セッションを使用せず、リクエストごとにトークン検証
3. **セキュリティコンテキスト連携**
   - 認証成功時に`SecurityContextHolder`に情報を設定し、後続処理で`@AuthenticationPrincipal`等で利用可能に
4. **拡張性**
   - 権限情報(`GrantedAuthority`)を`new ArrayList<>()`部分で追加可能

### 改善点（実装による）

- **権限情報の扱い**: 現在は空の権限リストを使用。実際には JWT クレームから権限情報を抽出して設定するのが一般的
- **エラーハンドリング**: 無効なトークン時のエラー応答を追加するケースもあり
- **ロギング**: デバッグ用のログ出力があると開発時便利

このフィルターにより、JWT を使った認証を Spring Security フレームワークにシームレスに統合しています。
