# Next.js 連携 R1 改造案

#### 已深度思考

現在の実装では、ワンタイムトークンをセッションに保存し、リクエストパラメータからトークンを取得して検証しています。
しかし、フロントエンド（Next.js）からは、Authorization ヘッダー（Bearer トークン）や X-CSRF-Token ヘッダーなどでトークンを送信することを想定しています。
また、現在の TokenManager はリクエストパラメータからトークンを取得するようになっていますが、ヘッダーからの取得に対応させる必要があります。

さらに、SecurityHandlerInterceptor は、主にビュー（HTML）を返すコントローラを想定しており、ModelAndView を使ってトークンをセッションに保存したり、ビューに渡したりしています。
しかし、REST API（JSON を返す）の場合は、ModelAndView ではなくレスポンスボディにトークンを含めるなどの対応が必要です。
修正方針:

1.  TokenManager の validate メソッドで、リクエストパラメータだけでなく、ヘッダーからのトークン取得にも対応させる。
2.  SecurityHandlerInterceptor の postHandle メソッドで、JSON レスポンスを扱うための修正（ModelAndView の代わりにレスポンスボディにトークンを設定する）が必要。
    ただし、現在の Interceptor の設計はビューを前提としているため、REST API に合わせて大幅に変更するか、別の方法を検討する必要がある。
3.  あるいは、ワンタイムトークンの方式をやめて、CSRF トークンを使用する方式に変更する。Spring Security はデフォルトで CSRF トークンをサポートしており、ヘッダー（X-CSRF-Token）や Cookie を使用して処理できる。
    ただし、現在のワンタイムトークンのロジックはセッションごとにトークンを生成・検証するもので、CSRF 対策と同様の目的を持っている。
    現在の SecurityConfig では CSRF を無効にしています（.csrf(AbstractHttpConfigurer::disable）。これを有効にし、Spring Security のデフォルトの CSRF 保護を利用することを検討します。
    そうすれば、独自のトークン管理は不要になります。
    しかし、既存のトークン管理（TokenManager など）を維持したい場合、以下の修正が必要です。
    オプション 1: 既存のトークン管理を REST API に対応させる

- TokenManager の validate メソッドを修正して、ヘッダーからトークンを取得できるようにする。
- SecurityHandlerInterceptor で、JSON レスポンスを扱う場合の処理を追加する（レスポンスボディにトークンを設定するなど）。
  オプション 2: Spring Security の CSRF 保護を有効にし、独自トークン管理を廃止する
- SecurityConfig で CSRF を有効にする（デフォルトで有効なので、disable を外す）。
- フロントエンドでは、最初に CSRF トークンを取得するリクエスト（GET など）を送信し、そのトークンを以降のリクエスト（POST など）でヘッダー（X-CSRF-Token）に付与する。
- ワンタイムトークン用のアノテーションやインターセプタは削除する。
  オプション 2 の方が Spring の標準機能を使うため、セキュリティも堅牢でメンテナンス性も高いです。
  ただし、既存のバッチジョブ実行用のコントローラ（BatchJobController）では、@TokenHandler アノテーションを使ってワンタイムトークンを検証しています。
  このアノテーションを CSRF 保護に置き換えることは可能ですが、CSRF トークンはワンタイムではなくセッションごとに 1 つです（ワンタイムではない）。
  要件としてワンタイムトークンが必要であれば、オプション 1 を選択する必要があります。
  ここでは、要件が明確でないため、両方のケースを考慮しますが、一般的な REST API では CSRF 保護が有効な場合、ログインセッションを持たない（JWT など）場合は CSRF 保護を無効にすることが多いです。
  現在の SecurityConfig では、httpBasic 認証を設定しており、セッションを使用しているため、CSRF 保護を有効にすることは可能です。
  結論:
  既存のワンタイムトークン方式を維持する場合の修正（オプション 1）と、Spring Security の CSRF 保護を利用する場合（オプション 2）の両方を提示します。
  ただし、質問では「フロントエンド react+next.js との連携条件を整えていますか？」とあり、連携のために必要な変更を求めています。
  既存のトークン管理が REST API に適していないため、修正が必要です。
  ここでは、既存のトークン管理を REST API に対応させる修正（オプション 1）を実装します。
  修正点:

  1.  TokenManager クラス: リクエストからトークンを取得する方法を、パラメータだけでなくヘッダーからも取得できるようにする。

- ヘッダー名は、デフォルトで"X-CSRF-Token"とするが、カスタマイズ可能にしてもよいが、既存の TokenHandler の name 属性をヘッダー名として使う？
- ただし、現在の TokenHandler の name 属性はトークンの名前（セッション属性名）として使われており、リクエストパラメータ名としても使われている。
- ヘッダーから取得する場合は、同じトークン名をヘッダー名として使うか、別の方法を考える。 2. TokenManager.validate メソッド:
- 現在はリクエストパラメータから取得しているが、ヘッダーからも取得を試みる。
- 両方にある場合は？ → ヘッダーを優先するか、またはパラメータのみのサポートを続けつつ、ヘッダーも追加する。
- ここでは、まずヘッダーをチェックし、なければパラメータをチェックする。 3. SecurityHandlerInterceptor の postHandle:
- 現在は ModelAndView を使ってトークンを保存しているが、REST コントローラ（@RestController）では ModelAndView が使われない。
- 代わりに、レスポンスボディにトークンを設定する必要があるが、インターセプタでレスポンスボディを変更するのは難しい。
- 別の方法として、コントローラメソッドの戻り値にトークンを含めることを強制する（アノテーションを使うなど）か、またはハンドラメソッドの実行後にレスポンスを書き換えるフィルタを追加する。
- しかし、既存の設計を大きく変える必要がある。 4. 代替案: トークンの保存とレスポンスへの設定を、コントローラ内で行うように変更する。インターセプタを廃止する。
- ただし、既存のアノテーションを使った宣言的な方法を維持したい。 5. さらに、現在の postHandle では、フォームバリデーションエラー時にトークンを再保存する処理があるが、REST API ではバリデーションエラーは JSON で返すため、その場合もレスポンスボディに新しいトークンを設定する必要がある。
  以上の課題から、既存のインターセプタ方式を REST API に対応させるのは大掛かりになる可能性があります。
  そこで、今回は以下のように修正します。

  - トークンの検証（preHandle）については、ヘッダーからの取得に対応させる。

- トークンの保存（生成）については、インターセプタでレスポンスボディを直接変更するのではなく、コントローラメソッドが返すレスポンスオブジェクトにトークンを埋め込むことを必須とする。
  つまり、@TokenHandler(save=true)が指定されたメソッドは、トークンをレスポンスに含める責任を持つ。インターセプタはトークンを生成してリクエスト属性に設定するだけとし、コントローラはそれをレスポンスに含める。
  手順:

1. preHandle で、トークンを生成してセッションに保存するとともに、リクエスト属性にトークンを設定する。
2. コントローラメソッドは、リクエスト属性からトークンを取得し、レスポンスに含める。
   しかし、これではコントローラのメソッドに追加のコードが必要になり、非宣言的です。
   別案: インターセプタの postHandle で、レスポンスオブジェクト（ResponseEntity など）を変更する。ただし、HandlerInterceptor ではレスポンスボディを変更できない（ServletResponse をラップしてキャッシュすれば可能だが複雑）。
   現実的な解決策として、@TokenHandler アノテーションを維持しつつ、REST API 用に別のインターセプタを用意するか、または AOP を使うことを検討しますが、時間の制約もあり、今回は以下の修正に留めます。
   修正内容:

- TokenManager.validate で、ヘッダーからトークンを取得できるようにする。
- トークンの保存（生成）は、インターセプタの preHandle で行い、生成したトークンをリクエスト属性に設定する。そして、コントローラメソッドがその属性を取得してレスポンスに含めることを必須とする。
- ただし、既存の HTML ビュー用の処理は残す（ModelAndView 用の処理）が、REST API では使わない。
  しかし、BatchJobController は REST コントローラ（@RestController）であり、現在は ModelAndView を使っていないので、TokenManager.save(request, mav, tokenName) は使われていません。
  代わりに、BatchJobController のメソッドは ResponseEntity<String を返しており、トークンをレスポンスに含めていません。
  したがって、BatchJobController のメソッドを修正して、トークンをレスポンスに含める必要があります。
  この修正は既存の動作を変える可能性があるため、注意が必要です。
  結論として、フロントエンド（Next.js）と連携するために、以下の修正を行います。

  1.  TokenManager.validate メソッドを修正し、ヘッダーからトークンを取得できるようにする。

2.  SecurityHandlerInterceptor の preHandle で、トークンを生成する場合（save=true）、トークンをリクエスト属性に設定する。
3.  SecurityHandlerInterceptor の postHandle で、REST API 用の処理を追加する。具体的には、レスポンスが JSON の場合はレスポンスボディにトークンを設定する。ただし、レスポンスボディを直接変更できないため、この方法は難しい。
4.  代わりに、@TokenHandler(save=true)が指定されたメソッドでは、リクエスト属性からトークンを取得し、レスポンスに明示的にトークンを設定することをコントローラが行う。
    しかし、コントローラにトークンを設定するコードを書くのは煩雑です。これを解決するために、次のような方法も考えられます。

    - レスポンス用の DTO にトークンを設定するフィールドを用意し、AOP でトークンを注入する。
      ただし、今回は時間の関係で、既存のインターセプタを REST API に対応させるための最小限の修正として、以下のようにします。
      修正案（最小限）:
      ステップ 1: TokenManager の validate メソッドでヘッダーからトークンを取得

```java
    public static boolean validate(HttpServletRequest request, String tokenName, boolean removeToken) {
        String sessionToken = getSessionToken(request, tokenName);
        // リクエストパラメータから取得
        String requestToken = request.getParameter(tokenName);
        // ヘッダーから取得 (ヘッダー名は tokenName を使うか、固定のヘッダー名（例: "X-CSRF-Token"）を使う)
        if (requestToken == null) {
            requestToken = request.getHeader(tokenName); // ヘッダー名をtokenNameにする
            // または固定ヘッダー名: requestToken = request.getHeader("X-CSRF-Token");
        }
          // ... 以下同じ
    }
```

ステップ 2: SecurityHandlerInterceptor の preHandle で、トークンを生成する場合（save=true）、リクエスト属性にトークンを設定する（コントローラがレスポンスにトークンを設定しやすくするため）。

```java
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // ... 既存の処理
          if (shouldSaveToken(handlerMethod)) {
            String tokenName = getTokenName(handlerMethod);
            String token = TokenManager.generateToken();
            TokenManager.setSessionToken(request, tokenName, token);
            // リクエスト属性にトークンを設定
            request.setAttribute(tokenName, token);
        }
          // ... 既存の処理
    }
```

ステップ 3: コントローラメソッドで、リクエスト属性からトークンを取得し、レスポンスに含める。
例: BatchJobController

```java
    @TokenHandler(
            save = true,
            validate = TokenValidateType.REMOVE,
            handleError = true
    )
    @PostMapping("/run-human-resource-job")
    public ResponseEntity<Map<String, String>> runHumanResourceJob(
            @RequestParam(name = "_RequestVerificationToken", required = false) String token, // パラメータでも受け取れるが、ヘッダーからも取得可能にするためrequired=false
            HttpServletRequest request) { // リクエスト属性からトークンを取得するため
          // トークンはリクエスト属性から取得
        String savedToken = (String) request.getAttribute("_RequestVerificationToken");
        // レスポンスボディにトークンを設定
        return ResponseEntity.accepted()
                .body(Map.of("message", "ジョブが開始されました", "_RequestVerificationToken", savedToken));
    }
```

ただし、既存の HTML ビュー用の処理（postHandle 内の ModelAndView を使った処理）はそのまま残します。
この修正により、フロントエンドは次のように動作します：

- トークンが必要なエンドポイント（save=true）にアクセスすると、サーバーはセッションにトークンを保存し、レスポンスボディにトークンを返す。
- フロントエンドはそのトークンを保存し、次のリクエスト（validate が必要なエンドポイント）では、そのトークンをヘッダー（またはパラメータ）として送信する。
  しかし、この修正ではコントローラメソッドごとにレスポンスにトークンを設定するコードが必要です。これを省略するには、ResponseBodyAdvice などを使用して、レスポンスを加工する方法がありますが、今回は割愛します。
  また、セキュリティの観点から、トークンをレスポンスボディで返すのは適切ですが、CSRF トークンのように Cookie に保存してヘッダーで送る方法もあります。しかし、既存の仕組みを尊重してボディで返します。
  以上を踏まえて、コードを修正します。
  ただし、既存の HTML ビュー用の処理（ModelAndView を扱う postHandle）は残すため、両方の用途に対応します。
  修正後のコード例:

  1.  TokenManager の validate メソッドを修正（ヘッダーからの取得を追加）

2.  SecurityHandlerInterceptor の preHandle で、save=true の場合にリクエスト属性にトークンを設定
3.  コントローラメソッドで、リクエスト属性からトークンを取得し、レスポンスに含める
    また、フロントエンド（Next.js）は、トークンを取得するエンドポイントを呼び出してトークンを取得し、その後のリクエストでヘッダーにトークンを付与する必要があります。
    注意: トークン名（tokenName）をヘッダー名として使用するため、フロントエンドは同じヘッダー名を使用します。
    ただし、既存のトークン名（\_RequestVerificationToken）は長いので、ヘッダー名としては適切でないかもしれません。しかし、既存のシステムとの互換性を考慮してそのまま使います。
    それでは、修正したコードを示します。
    ただし、TokenManager の validate メソッドでヘッダーから取得する部分は、ヘッダー名を tokenName（例えば"\_RequestVerificationToken"）とします。
    修正箇所:

- TokenManager.validate メソッド
- SecurityHandlerInterceptor.preHandle（save=true の場合のリクエスト属性設定）
- BatchJobController（レスポンスにトークンを追加）
  なお、BatchJobController のメソッドでは、@RequestParam でトークンを受け取る必要はなくなりました（ヘッダーで送るため）。ただし、validate メソッドはヘッダーから取得するので、@RequestParam は不要です。しかし、既存のクライアント（HTML フォーム）との互換性を保つために残すこともできます。
  今回は、@RequestParam を required=false に変更し、ヘッダーからも取得できるようにします。
  修正コード:

  1.  TokenManager クラスの validate メソッド:

```java
    public static boolean validate(HttpServletRequest request, String tokenName, boolean removeToken) {
        String sessionToken = getSessionToken(request, tokenName);
        // まずリクエストパラメータから、次にヘッダーからトークンを取得
        String requestToken = request.getParameter(tokenName);
        if (requestToken == null || requestToken.isEmpty()) {
            requestToken = request.getHeader(tokenName);
        }
         // ... 以下同じ
    }
```

2.  SecurityHandlerInterceptor の preHandle メソッド（save=true の処理）:

```java
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) return true;
         // クリックジャッキング対策
        response.setHeader("X-FRAME-OPTIONS", "SAMEORIGIN");
         // トークン保存処理: save=trueの場合、トークンを生成してセッションとリクエスト属性に設定
        if (shouldSaveToken(handlerMethod)) {
            String tokenName = getTokenName(handlerMethod);
            String token = generateToken(); // TokenManagerのgenerateTokenを呼ぶ
            setSessionToken(request, tokenName, token); // セッションに保存
            request.setAttribute(tokenName, token); // リクエスト属性に設定（コントローラでレスポンスに含めるため）
        }
          // ワンタイムトークンの検証
        TokenValidateType type = getValidateTokenType(handlerMethod);
        if (!type.equals(TokenValidateType.NONE)) {
            boolean removeToken = type.equals(TokenValidateType.REMOVE);
            if (!TokenManager.validate(request, getTokenName(handlerMethod), removeToken)) {
                if (!shouldHandleError(handlerMethod)) {
                    response.sendError(HttpServletResponse.SC_BAD_REQUEST, "Bad or Missing onetime token");
                    return false;
                }
            }
        }
        return true;
    }
```

3.  BatchJobController の修正:

```java
    @TokenHandler(
            save = true,
            validate = TokenValidateType.REMOVE,
            handleError = true
    )
    @PostMapping("/run-human-resource-job")
    public ResponseEntity<Map<String, String>> runHumanResourceJob(HttpServletRequest request) {
        try {
            JobParameters jobParameters = new JobParametersBuilder()
                    .addLong("timestamp", System.currentTimeMillis())
                    .toJobParameters();
            jobLauncher.run(humanResourceBatchJob, jobParameters);
            // リクエスト属性からトークンを取得
            String token = (String) request.getAttribute("_RequestVerificationToken");
            return ResponseEntity.accepted()
                    .body(Map.of("message", "ジョブが開始されました", "_RequestVerificationToken", token));
        } catch (JobExecutionAlreadyRunningException | JobRestartException |
                 JobInstanceAlreadyCompleteException | JobParametersInvalidException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "ジョブの実行に失敗しました: " + e.getMessage()));
        }
    }
```

これで、フロントエンドは POST /api/batch/run-human-resource-job を呼び出すと、レスポンスボディに新しいトークン（\_RequestVerificationToken）が含まれるので、それを保存し、次のリクエストのヘッダーに設定する必要があります。
ただし、現在の BatchJobController のメソッドは、もともとトークンをパラメータで受け取っていましたが、今回は受け取らず、代わりにヘッダーから検証するように変更しました。したがって、フロントエンドはトークンをパラメータではなくヘッダーに設定して送信します。
以上で、Next.js との連携が可能になるはずです。
しかし、この修正は一例であり、実際の要件によってはさらに調整が必要かもしれません。
また、他のコントローラメソッドで@TokenHandler(save=true)を使用している場合、同様の修正（レスポンスにトークンを追加）が必要になることに注意してください。
今回は BatchJobController のみの修正例を示しました。
最後に、Spring Security の CSRF 保護を有効にする方法も検討すべきですが、既存のワンタイムトークン方式を維持するための修正を行いました。

現在の実装は主にサーバサイドレンダリング向けの設計であり、React+Next.js との連携には以下の点で調整が必要です：

### 主な課題点

1. **トークン取得方法**

   - 現状：リクエストパラメータ依存（`request.getParameter()`）
   - 必要：ヘッダーからの取得対応（`Authorization: Bearer`や`X-CSRF-Token`）

2. **レスポンス形式**

   - 現状：HTML ビュー向け ModelAndView 処理
   - 必要：JSON レスポンス対応

3. **CSRF 保護**
   - 現状：独自トークン管理（ワンタイムトークン）
   - 推奨：Spring Security 標準 CSRF 保護との統合

### 修正統合版

以下に Next.js 連携用の修正版を実装します。

---

#### 1. `SecurityConfig.java` - CSRF 保護有効化

```java
@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf
                .csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse())
            )
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**").permitAll()
                .requestMatchers("/api/auth/**").permitAll()
                .anyRequest().authenticated()
            )
            .httpBasic(Customizer.withDefaults());

        return http.build();
    }

    // その他のBean定義は変更なし
}
```

#### 2. `TokenManager.java` - ヘッダー対応

```java
public class TokenManager {
    // ... 既存コード ...

    public static boolean validate(HttpServletRequest request, String tokenName, boolean removeToken) {
        String sessionToken = getSessionToken(request, tokenName);
        // ヘッダー優先→パラメータの順でトークン取得
        String requestToken = request.getHeader(tokenName);
        if (requestToken == null) {
            requestToken = request.getParameter(tokenName);
        }

        // ... 検証処理は変更なし ...
    }
}
```

#### 3. `SecurityHandlerInterceptor.java` - JSON 対応

```java
public class SecurityHandlerInterceptor implements HandlerInterceptor {

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        // ... 既存のクリックジャッキング対策 ...

        // トークン検証処理（変更なし）
        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView mav) {
        if (!(handler instanceof HandlerMethod handlerMethod)) return;

        // JSONレスポンス専用処理
        if (isJsonResponse(response)) {
            handleJsonResponse(request, response, handlerMethod);
            return;
        }

        // 既存のHTML処理（互換性維持）
        handleHtmlResponse(request, mav, handlerMethod);
    }

    private boolean isJsonResponse(HttpServletResponse response) {
        return "application/json".equals(response.getContentType());
    }

    private void handleJsonResponse(HttpServletRequest request, HttpServletResponse response, HandlerMethod handlerMethod) {
        String tokenName = getTokenName(handlerMethod);

        if (shouldSaveToken(handlerMethod)) {
            String token = generateToken();
            setSessionToken(request, tokenName, token);
            response.setHeader(tokenName, token); // ヘッダーでトークン送信
        }
    }

    private void handleHtmlResponse(HttpServletRequest request, ModelAndView mav, HandlerMethod handlerMethod) {
        // 既存のHTML用処理
    }

    // ... 既存ヘルパーメソッド ...
}
```

#### 4. `BatchJobController.java` - トークン取得方法変更

```java
@RestController
@RequestMapping("/api/batch")
public class BatchJobController {

    @TokenHandler(
        save = true,
        validate = TokenValidateType.REMOVE,
        handleError = true
    )
    @PostMapping("/run-human-resource-job")
    public ResponseEntity<Map<String, String>> runHumanResourceJob(
        @RequestHeader(name = "_RequestVerificationToken", required = false) String token) {

        // トークンはヘッダーから自動取得
        // ... 既存のジョブ処理 ...

        return ResponseEntity.ok(Map.of(
            "status", "success",
            "message", "ジョブが開始されました"
        ));
    }
}
```

### Next.js 側対応

```javascript
// トークン取得例
const fetchToken = async () => {
  const res = await fetch('/api/generate-token');
  return res.headers.get('X-CSRF-Token');
};

// リクエスト送信例
const submitJob = async () => {
  const token = await fetchToken();

  await fetch('/api/batch/run-human-resource-job', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': token // トークンをヘッダーに設定
    },
    body: JSON.stringify({...})
  });
};
```

### 変更ポイントの要約

| コンポーネント                 | 主な変更内容                              |
| ------------------------------ | ----------------------------------------- |
| **SecurityConfig**             | CSRF 保護を有効化し Cookie ベースに変更   |
| **TokenManager**               | ヘッダー優先のトークン取得ロジック追加    |
| **SecurityHandlerInterceptor** | JSON レスポンス対応とヘッダー送信処理追加 |
| **BatchJobController**         | `@RequestHeader`によるトークン取得        |
| **Next.js**                    | トークンをヘッダーに設定して送信          |

これにより以下の利点が得られます：

1. **標準準拠**: Spring Security の CSRF 保護メカニズムと統合
2. **フロントエンド連携**: JSON/ヘッダーベースの通信に対応
3. **セキュリティ強化**: Cookie の HttpOnly 設定で XSS 対策
4. **保守性向上**: 重複トークン管理ロジックを削減

注意: 既存 HTML ビューとの互換性を維持するため、ModelAndView ベースの処理は残していますが、新規 API 開発では JSON ベースの実装を推奨します。
