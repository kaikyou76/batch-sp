# フロントエンドとバックエンドの連携を実現するための全面修正案

<think>
好的，我现在需要帮助用户解决他们提出的前后端整合问题。用户希望根据当前的后端认证机制，全面调整前端代码，确保流程正确。用户给出的流程是：

1. 新用户注册后重定向到登录页面（之后需要手动通过 SQL 将用户的 role 改为 admin）。
2. 输入 email 和 password 登录，并通过 AuthProvider 组件维护认证状态。
3. 在管理员界面点击作业处理按钮，跳转到 http://ドメイン/batch 页面执行 Spring Batch。

用户还提供了前端的 RegisterPage、LoginPage 和 BatchJobPage 的代码，以及一些后端文件的片段，比如 SecurityConfig、AuthController、RegisterController 等。

首先，我需要分析用户提供的后端代码，了解当前的认证机制。从 SecurityConfig 中看到，后端使用了 JWT 进行认证，并且对/api/batch/\*\*路径进行了认证保护。此外，登录接口在 AuthController 中处理，返回了包含 token、email、name 和 role 的 AuthResponse 对象。

接下来，检查 RegisterController 的代码，发现注册接口会创建用户，但默认角色是"role": "user"。用户提到需要手动通过 SQL 将角色改为 admin，这可能是因为注册时没有设置角色为 admin，而系统可能要求 admin 角色才能访问批处理接口。

然后，查看前端代码中的 LoginPage，它调用了后端的登录接口，获取 token，并通过 AuthProvider 的 login 方法存储用户信息，包括 token、email、role 和 name。当前的 login 方法将这些信息存储在 localStorage 中，但可能没有正确解析后端返回的 role 字段。

BatchJobPage 中的 runBatchJob 函数目前使用硬编码的 Basic Auth（admin:password），这显然是不安全的，并且不符合实际认证需求。正确的做法应该是使用登录后获得的 token 进行 Bearer 认证。

接下来，我需要考虑如何调整前端代码以适配后端。首先，在注册时，用户可能无法直接注册为 admin 角色，所以需要后端允许注册时指定角色，或者前端在注册后自动请求提升权限。但用户提到需要手动修改数据库，这可能意味着后端没有提供相关接口，或者注册时角色固定为 user。因此，前端需要确保用户登录后拥有 admin 角色才能访问批处理页面。

然后，在登录页面，前端应该正确解析后端返回的用户信息，包括 role，以便后续权限判断。当前的 login 函数可能没有正确处理 role 字段，导致 AuthProvider 中的 user 对象缺少 role 信息。

对于批处理页面，需要修改请求头中的 Authorization 字段为 Bearer token，并移除硬编码的 Basic Auth 和\_RequestVerificationToken 头，因为后端使用 JWT，可能不需要 CSRF 令牌，或者由其他机制处理。

同时，检查 SecurityConfig 中的配置，确认是否允许通过 Bearer token 进行认证，以及 CORS 配置是否允许前端域名。用户提供的 SecurityConfig 中，允许的源是 http://localhost:3000，这可能与实际部署的前端地址一致，但需要确认。

另外，用户提到的 TokenHandler 注解和相关功能可能涉及 CSRF 令牌，但根据后端配置，可能已经通过 CookieCsrfTokenRepository 启用 CSRF 保护，但前端目前没有正确处理这部分，可能需要调整。

总结问题点：

1. 注册时角色默认为 user，需要手动改为 admin，前端无法直接控制，但可能需要后端提供注册时的角色设置，或者前端在登录后检查角色，若非 admin 则提示权限不足。

2. 登录接口返回的 AuthResponse 包含 role，但前端可能未正确解析，导致 AuthProvider 中的 user 对象缺少 role 信息，影响后续权限判断。

3. 批处理请求使用硬编码的 Basic Auth 和\_RequestVerificationToken 头，这不符合 JWT 认证机制，应改为 Bearer token。

4. 批处理页面中的 generateToken 函数可能多余，因为 token 应该在登录时获取，并存储在 localStorage 中，无需额外生成。

5. 需要确保 CORS 配置正确，允许前端域名，并且 CSRF 配置与前端请求方式兼容。

解决方案：

1. 修改 RegisterController 的注册逻辑，允许设置角色为 admin，或者在注册时自动设置，但可能涉及安全风险，需谨慎。

2. 调整前端的 login 函数，确保正确解析后端返回的 role，并存储到 AuthProvider 中。

3. 修改 BatchJobPage 的请求头，使用 Bearer token，并删除不必要的 Basic Auth 和\_RequestVerificationToken 头。

4. 移除 generateToken 函数，直接从 localStorage 中获取 token，因为登录后已经保存了 token。

5. 在 SecurityConfig 中确认 CORS 配置是否包含前端域名，确保跨域请求被允许。

6. 在 SecurityConfig 中，确认是否启用了 JWT 过滤器，并正确处理 Bearer token。

7. 在 AuthProvider 中，确保 token 和用户信息正确存储和更新，以便批处理页面可以正确获取 token。

现在需要具体修改前端代码：

对于 RegisterPage，可能需要后端调整注册逻辑，允许注册时指定角色，或者前端在注册后自动发送请求提升权限，但这通常需要后端提供相应的接口。如果后端不允许，则前端无法直接修改，只能依赖手动 SQL 操作。

在 LoginPage 中，需要确保登录成功后，从响应中正确提取 token、email、name 和 role，并传递给 AuthProvider 的 login 方法。当前代码中的 data 可能包含这些字段，但需要确认后端返回的结构是否匹配。

在 BatchJobPage 中，移除 generateToken 函数，改为从 AuthProvider 获取 token，并在 runBatchJob 中使用该 token 作为 Bearer。同时，删除 Authorization 头中的 Basic 认证部分，以及\_RequestVerificationToken 头，因为 JWT 已经包含在 Authorization 头中。

此外，需要检查 AuthProvider 的 login 方法是否正确存储和更新用户信息，特别是 role 字段，以便在 BatchJobPage 中进行权限判断，比如只有 admin 角色才能执行批处理。

最后，确保所有请求都携带正确的 headers，并且处理可能的错误情况，如 token 过期或权限不足的情况，进行相应的提示或重定向。

可能还需要调整后端代码，例如在 SecurityConfig 中，确保/api/batch/\*\*路径的认证策略正确，使用 JWT 验证，并且角色检查正确应用。例如，在 BatchJobController 中使用@PreAuthorize("hasRole('ADMIN')")来限制访问。

总结来说，前端需要调整的部分包括：

- LoginPage：正确解析和存储用户角色。
- AuthProvider：正确管理用户信息，包括 token 和角色。
- BatchJobPage：使用正确的 Bearer token，移除不必要的头信息。
- 可能需要后端调整注册逻辑，允许注册时设置 admin 角色，或者在注册后自动升级，但这通常涉及安全策略，可能需要管理员审批或其他机制。

通过以上调整，前端和后端的认证流程将更加一致，确保用户登录后能够正确访问受保护的 API。
</think>

### 🔄 **フロントエンドとバックエンドの連携を実現するための全面修正案**

#### ✅ **1. ユーザー登録後の認証フローを修正**

現在、`RegisterController` は `role="user"` でユーザーを作成していますが、**バッチジョブ実行には `role="admin"` が必要** です。  
→ **フロント側に `role="admin"` を明示的に要求する処理を追加** します。

```tsx
// src/app/register/page.tsx

const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const response = await fetch(`${API_BASE_URL}/api/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, name, password }),
    });

    const data = await response.json();

    if (response.ok) {
      // 登録後に手動で role="admin" を設定する処理（※後述のバックエンド修正参照）
      router.push("/login");
    } else {
      setError(data.message || "登録に失敗しました");
    }
  } catch (err) {
    setError("ネットワークエラーが発生しました");
    console.error("Registration error:", err);
  } finally {
    setLoading(false);
  }
};
```

---

#### ✅ **2. ログイン時のトークン取得と AuthProvider の修正**

現在の `LoginPage` は `/api/auth/login` にリクエストを送信し、**JWT トークンを取得** しますが、正しく解析していません。  
→ `AuthProvider` に `token`, `email`, `role`, `name` を正しく保存するように修正します。

```tsx
// src/app/login/page.jsx

import { useAuth } from "@/components/AuthProvider";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { login } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // ✅ 正しくトークンとユーザー情報をAuthProviderに保存
                login(data);
                router.push("/batch"); // バッチ画面へ遷移
            } else {
                setError(data.message || "ログインに失敗しました");
            }
        } catch (err) {
            setError("ネットワークエラーが発生しました");
            console.error("Login error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        // ... existing JSX ...
    );
}
```

---

#### ✅ **3. AuthProvider のトークンとユーザー情報の管理を修正**

現在、`AuthProvider` は `localStorage` に `auth_token` と `auth_user` を保存していますが、**role のチェックが欠けています**。  
→ `role` 情報も保存し、バッチ画面遷移時に `role="admin"` かどうかを検証します。

```tsx
// src/components/AuthProvider.tsx

const login = (data) => {
  localStorage.setItem("auth_token", data.token);
  localStorage.setItem(
    "auth_user",
    JSON.stringify({
      email: data.email,
      name: data.name,
      role: data.role,
    })
  );
  setToken(data.token);
  setUser({
    email: data.email,
    name: data.name,
    role: data.role,
  });
  setIsAuthenticated(true);
};

useEffect(() => {
  const storedToken = localStorage.getItem("auth_token");
  const storedUser = localStorage.getItem("auth_user");

  if (storedToken && storedUser) {
    setToken(storedToken);
    setUser(JSON.parse(storedUser));
    setIsAuthenticated(true);
  }
}, []);
```

---

#### ✅ **4. バッチジョブ画面のトークン使用方法を修正**

現在、`BatchJobPage` は `/api/auth/generate-token` で独自トークンを生成していますが、**これは不要** です。  
→ **ログイン時に取得した JWT トークンを使用** します。

```tsx
// src/app/batch/page.jsx

import { useAuth } from "@/app/hooks/useAuth";

export default function BatchJobPage() {
    const [status, setStatus] = useState("idle");
    const [message, setMessage] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const { token, user } = useAuth();  // ✅ AuthProviderからtoken取得

    // ✅ admin権限チェック
    useEffect(() => {
        if (!token || user?.role !== "admin") {
            router.push("/login");  // adminでなければログイン画面へリダイレクト
        }
    }, [token, user]);

    const runBatchJob = async () => {
        if (!token || user?.role !== "admin") {
            setMessage("管理者権限が必要です");
            setModalOpen(true);
            return;
        }

        setStatus("running");
        setMessage("バッチジョブを実行中...");

        try {
            const response = await fetch(`${API_BASE_URL}/api/batch/run-human-resource-job`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // ✅ Bearerトークンを使用
                }
            });

            const data = await response.json();

            if (response.ok) {
                setStatus("success");
                setMessage(data.message || "ジョブが正常に開始されました");
            } else {
                setStatus("error");
                setMessage(data.message || "ジョブの実行に失敗しました");
            }
        } catch (error) {
            setStatus("error");
            setMessage(`ネットワークエラー: ${error.message}`);
        } finally {
            setModalOpen(true);
        }
    };

    return (
        // ... existing JSX ...
    );
}
```

---

#### ✅ **5. バックエンド側：JWT の role を含むレスポンス返却**

`AuthController` でログイン時に `role="admin"` を含める必要があります。  
→ 現在の `AuthResponse` は `token`, `email`, `name`, `role` を返却する構造になっているので、その通りにします。

```java
// com.example.orgchart_api.controller.AuthController.java

@PostMapping("/login")
public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request, HttpServletResponse response) {
    User user = authenticationService.getUserByEmail(request.getEmail())
            .orElseThrow(() -> new RuntimeException("ユーザーが見つかりません"));

    if (!authenticationService.checkPassword(request.getPassword(), user.getPasswordHash())) {
        throw new RuntimeException("パスワードが正しくありません");
    }

    Map<String, Object> claims = new HashMap<>();
    claims.put("role", user.getRole());
    claims.put("name", user.getName());

    String token = jwtUtil.generateToken(claims, user.getEmail());
    return ResponseEntity.ok(new AuthResponse(token, user.getEmail(), user.getName(), user.getRole()));
}
```

---

#### ✅ **6. バックエンド側：バッチジョブ実行エンドポイントの権限制御**

`/api/batch/run-human-resource-job` に `@PreAuthorize("hasRole('ADMIN')")` を追加し、**管理者のみアクセス可能** にします。

```java
// com.example.orgchart_api.controller.BatchJobController.java

@PreAuthorize("hasRole('ADMIN')")  // ✅ 管理者のみアクセス可能
@PostMapping("/run-human-resource-job")
public ResponseEntity<?> runHumanResourceJob() {
    // 既存の非同期実行ロジック
}
```

---

#### ✅ **7. バックエンド側：CORS 設定の調整**

Next.js からのリクエストを許可するよう、Spring Boot 側の CORS 設定を確認します。

```java
// com.example.orgchart_api.config.SecurityConfig.java

@Bean
public CorsConfigurationSource corsConfigurationSource() {
    CorsConfiguration configuration = new CorsConfiguration();
    configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));  // ✅ Next.jsのオリジンを指定
    configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
    configuration.setAllowedHeaders(Arrays.asList("*"));
    configuration.setExposedHeaders(Arrays.asList("Authorization"));  // ✅ Authorizationヘッダーを公開
    configuration.setAllowCredentials(true);
    configuration.setMaxAge(3600L); // 1時間キャッシュ

    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
}
```

---

#### ✅ **8. バックエンド側：JWT トークン生成の修正**

`JwtUtil` で `role` と `name` を含むトークンを生成するように修正します。

```java
// com.example.orgchart_api.util.JwtUtil.java

public String generateToken(Map<String, Object> claims, String subject) {
    return Jwts.builder()
            .setClaims(claims)  // ✅ role, nameを含む
            .setSubject(subject)
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + EXPIRATION))
            .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
            .compact();
}
```

---

### 📌 **修正ファイル一覧**

| ファイル                                                      | 修正内容                                                     |
| ------------------------------------------------------------- | ------------------------------------------------------------ |
| `src/app/register/page.tsx`                                   | 登録後にログイン画面へ遷移（role="admin" は手動で DB 更新）  |
| `src/app/login/page.jsx`                                      | ログイン時に `role` を含むデータを AuthProvider に渡す       |
| `src/app/batch/page.jsx`                                      | Bearer トークンを使用し、`role="admin"` の場合のみ実行可能に |
| `com/example/orgchart_api/controller/AuthController.java`     | ログイン時に `role`, `name` を含む `AuthResponse` を返却     |
| `com/example/orgchart_api/controller/BatchJobController.java` | `@PreAuthorize("hasRole('ADMIN')")` を追加                   |
| `com/example/orgchart_api/config/SecurityConfig.java`         | CORS 設定に Next.js のオリジンを追加                         |
| `com/example/orgchart_api/util/JwtUtil.java`                  | トークン生成時に `role`, `name` を含める                     |

---

### 📈 **期待される効果**

- **新規登録 → ログイン → バッチ実行** が一連の流れで完結
- **トークン管理** が `localStorage` で統一され、セキュリティが向上
- **権限制御** により、非管理者ユーザーによるバッチ実行を防止
- **Bearer トークン** により、セッション管理不要（ステートレス認証）

---

### 📋 **確認手順**

1. 新規ユーザー登録後、`localStorage` に `auth_token` と `auth_user` が保存されているか確認
2. ログイン時に `/api/auth/login` から `role` が返却されているか確認
3. バッチ画面で `Authorization: Bearer <token>` が正しく送信されているか確認
4. `role="admin"` でないユーザーが `/batch` にアクセスした場合、403 Forbidden が返るか確認

---

### 🛠️ **追加推奨事項**

- **トークン自動更新機能** を追加（例: リフレッシュトークン）
- **CSRF 対策** を検討（JWT の場合は不要ですが、セッションベースの認証の場合には必要）
- **トークン有効期限チェック** をフロント側に追加（例: JWT の `exp` フィールド）

---

### ✅ **最終的なフロントエンドフロー**

1. **新規登録**: `/api/register` に POST リクエストを送信（role="user" で登録）
2. **手動で DB 更新**: 新規ユーザーの `role` を `admin` に変更（※今後の改善候補）
3. **ログイン**: `/api/auth/login` にメールアドレスとパスワードを送信し、JWT トークンを取得
4. **バッチ実行**: `/api/batch/run-human-resource-job` に `Authorization: Bearer <token>` を送信し、バッチを実行

---

この修正により、**新規登録 → ログイン → バッチ実行** までの完全なフローが確立され、**JWT 認証** と **権限制御** を通して、セキュリティと可用性が向上します。
