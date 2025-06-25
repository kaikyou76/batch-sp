## 認証クラス草案 01

#### 已深度思考

> 提供された認証クラス（`SecurityHandlerInterceptor`、`TokenHandler`、`TokenManager`、`TokenValidateType`）は、ワンタイムトークンを用いた CSRF 保護を実装するためのものです。この実装は、Spring MVC のインタセプターを利用して、特定のリクエストに対してトークンの生成・検証を行います。
>
> ### この認証クラスをバッチジョブ起動 API に適用する方法
>
> 1.  **バッチジョブ起動コントローラメソッドへのアノテーション追加**:
>     ジョブを起動する API メソッドに`@TokenHandler`アノテーションを追加し、トークンの検証を要求します。
> 2.  **クライアント（React）側での対応**:
>     リクエスト時にトークンを取得し、パラメータとして送信する必要があります。
>
> #### ステップバイステップ実装
>
> ---
>
> ### ステップ 1: コントローラメソッドの修正
>
> `BatchJobController`のジョブ起動メソッドに`@TokenHandler`アノテーションを追加します。
>
> ```java
> import com.example.orgchart_api.security.TokenHandler;
> import com.example.orgchart_api.security.TokenValidateType;
> @RestController
> @RequestMapping("/api/batch")
> public class BatchJobController {
>     // ... 既存のコード ...
>     @TokenHandler(save = true, validate = TokenValidateType.REMOVE, handleError = true)
> ```

    @PostMapping("/run-human-resource-job")
    public ResponseEntity<String> runHumanResourceJob(
            @RequestParam("_RequestVerificationToken") String token, // トークンパラメータを受け取る
            HttpServletRequest request) {

>         // トークンの検証はインタセプタで行われるため、ここでは処理不要

        try {
            JobParameters jobParameters = new JobParametersBuilder()
                .addLong("timestamp", System.currentTimeMillis())
                .toJobParameters();

>             jobLauncher.run(humanResourceBatchJob, jobParameters);

            return ResponseEntity.accepted().body("ジョブが開始されました");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body("ジョブの実行に失敗しました: " + e.getMessage());
        }
    }

}

````
 > ### ステップ2: インタセプタの登録
 > `SecurityHandlerInterceptor`をSpringのインタセプタとして登録します。設定クラスを作成して追加します。
 > ```java
import com.example.orgchart_api.security.SecurityHandlerInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
 > @Configuration
public class WebConfig implements WebMvcConfigurer {
 >     @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SecurityHandlerInterceptor())
                .addPathPatterns("/api/**"); // APIエンドポイントに適用
    }
}
````

> ### ステップ 3: クライアント（React）側の対応
>
> ジョブを実行する前に、まずトークンを取得するリクエストを送信し、そのトークンをジョブ起動リクエストで送信します。
>
> #### トークン取得用 API の作成（オプション）
>
> トークンを取得するためのエンドポイントを追加します。
>
> ```java
> @TokenHandler(save = true)
> @GetMapping("/get-token")
> public ResponseEntity<Map<String, String>> getToken(HttpServletRequest request) {
> ```

    String token = TokenManager.getSessionToken(request, TokenManager.DEFAULT_TOKEN_NAME);
    return ResponseEntity.ok(Collections.singletonMap("token", token));

}

````
 > #### React側の実装例
 > ```jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
 > const BatchJobButton = () => {
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('');
 >   // コンポーネントマウント時にトークンを取得
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/batch/get-token');
        setToken(response.data.token);
      } catch (error) {
        console.error('トークンの取得に失敗しました', error);
      }
    };
    fetchToken();
  }, []);
 >   const runBatchJob = async () => {
    if (!token) {
      setMessage('トークンが取得できていません');
      return;
    }
 >     setLoading(true);
    setMessage('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/batch/run-human-resource-job',
        new URLSearchParams({ _RequestVerificationToken: token }),
        {
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        }
      );

      setMessage(response.data);
    } catch (error) {
      setMessage(`エラー: ${error.response?.data || error.message}`);
    } finally {
      setLoading(false);
    }
  };
 >   return (
    <div>
      <button
        onClick={runBatchJob}
        disabled={loading || !token}
        className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-gray-400"
      >
        {loading ? '実行中...' : '人事データ同期ジョブ実行'}
      </button>

      {message && <div className="mt-2 text-sm">{message}</div>}
    </div>
  );
};
 > export default BatchJobButton;
````

> ### 注意点
>
> 1.  **トークンのライフサイクル**:

- `@TokenHandler(validate = TokenValidateType.REMOVE)`を指定したため、ジョブ起動リクエストでトークンが使用されるとセッションから削除されます。
- 次の実行前には新しいトークンを取得する必要があります。
  > 2.  **セッションの依存**:
- トークンはセッションに保存されるため、クライアントは同じセッションを維持する必要があります（例: クッキーを使用）。
  > 3.  **セキュリティ**:
- トークン取得 API (`/get-token`) にも保護が必要な場合は、適切な認証を追加してください。
  > 4.  **Content-Type**:
- トークンをパラメータとして送信する際、`application/x-www-form-urlencoded`を使用しています。JSON を使用する場合は、リクエストボディにトークンを含めるように修正が必要です。
  > この実装により、既存の認証クラスを活用してバッチジョブ起動 API を保護することができます。

提供された認証クラス群は、CSRF 保護を目的としたワンタイムトークン認証システムとして**そのまま使用可能**です。バッチジョブ起動 API のセキュリティ保護に適用する方法を以下に説明します。

### 適用方法

#### 1. バッチジョブ起動 API にトークン認証を追加

```java
import com.example.orgchart_api.security.TokenHandler;
import com.example.orgchart_api.security.TokenValidateType;

@RestController
@RequestMapping("/api/batch")
public class BatchJobController {

    @TokenHandler(
        save = true,
        validate = TokenValidateType.REMOVE,
        handleError = true
    )
    @PostMapping("/run-human-resource-job")
    public ResponseEntity<String> runHumanResourceJob(
        @RequestParam("_RequestVerificationToken") String token) {

        // トークン認証はInterceptorで自動処理される
        JobParameters jobParameters = new JobParametersBuilder()
            .addLong("timestamp", System.currentTimeMillis())
            .toJobParameters();

        jobLauncher.run(humanResourceBatchJob, jobParameters);
        return ResponseEntity.accepted().body("ジョブが開始されました");
    }
}
```

#### 2. インタセプター設定クラスの更新（WebConfig）

```java
import com.example.orgchart_api.security.SecurityHandlerInterceptor;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addInterceptors(InterceptorRegistry registry) {
        registry.addInterceptor(new SecurityHandlerInterceptor())
                .addPathPatterns("/api/batch/**");
    }
}
```

### React+Next.js 側の実装

#### トークン取得関数

```javascript
// lib/tokenService.js
export const fetchToken = async () => {
  const response = await fetch("/api/get-token");
  const data = await response.json();
  return data.token;
};
```

#### バッチジョブ実行コンポーネント

```jsx
// components/BatchJobButton.jsx
import { useState } from "react";
import { fetchToken } from "../lib/tokenService";

const BatchJobButton = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const runBatchJob = async () => {
    setLoading(true);
    try {
      // トークン取得
      const token = await fetchToken();

      // トークン付きでジョブ実行リクエスト
      const formData = new FormData();
      formData.append("_RequestVerificationToken", token);

      const response = await fetch("/api/batch/run-human-resource-job", {
        method: "POST",
        body: formData,
      });

      setMessage(await response.text());
    } catch (error) {
      setMessage(`エラー: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={runBatchJob} disabled={loading}>
        {loading ? "実行中..." : "ジョブ実行"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};
```

### 追加で必要な実装

#### トークン取得 API（Next.js API Route）

```javascript
// pages/api/get-token.js
import axios from "axios";

export default async function handler(req, res) {
  try {
    const response = await axios.get(
      "http://localhost:8080/api/generate-token"
    );
    res.status(200).json({ token: response.data });
  } catch (error) {
    res.status(500).json({ error: "トークン取得に失敗しました" });
  }
}
```

#### トークン生成 API（Spring Boot 側）

```java
@TokenHandler(save = true)
@GetMapping("/api/generate-token")
public ResponseEntity<String> generateToken() {
    return ResponseEntity.ok("新規トークン生成済み");
}
```

### 動作フロー

1. フロントエンドが`/api/get-token`にリクエスト
2. Next.js が Spring Boot の`/api/generate-token`からトークン取得
3. フロントエンドがトークン付きで`/api/batch/run-human-resource-job`を呼び出し
4. `SecurityHandlerInterceptor`がトークンを検証
5. 検証成功後、バッチジョブが実行

### メリット

1. **既存システムとの互換性**: 現在の認証フローを変更せずに再利用可能
2. **強力な CSRF 保護**: ワンタイムトークン方式で CSRF 攻撃を防止
3. **フレームワーク連携**: Spring のインタセプター機構と自然に統合

### 注意点

- トークンの有効期間はセッション依存（デフォルト）
- 本番環境では HTTPS 必須
- トークン取得 API には適切なレートリミットを設定
- セッション管理方式（JWT など）に合わせて調整可能

この実装により、既存の認証システムを活用しつつ、React+Next.js から安全にバッチジョブを実行できます。
