## TokenHandler

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * TokenHandler.java
 *
 * @date 2013/08/15
 * @version 1.0
 * @author Yao Kaikyou
 */
package com.example.orgchart_api.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

/**
 * <pre>
 * ワンタイムトークン制御アノテーション
 *
 * 使用例:
 *   - save = true の場合、リクエスト時にトークンをセッションなどに保存
 *   - validate に指定がある場合、トークンの検証を実施
 *   - name にトークン名を指定可能（省略時は空文字）
 *   - handleError が true の場合、検証失敗時に自動エラーハンドリングを行う
 * </pre>
 *
 * @author Yao Kaikyou
 * @version 1.1 2025/06/13
 */
@Target(ElementType.METHOD)
@Retention(RetentionPolicy.RUNTIME)
public @interface TokenHandler {

    /** トークンを生成する */
    boolean save() default false;

    /** トークンをValidateする */
    TokenValidateType validate() default TokenValidateType.NONE;

    /** トークンの名前を指定する */
    String name() default "";

    /** エラーのハンドリングを実装する */
    boolean handleError() default false;
}


```
