## TokenValidateType

```java
/*
 * Copyright (c) 2014, NET MARKS COMPANY, LIMITED All Rights Reserved.
 *
 * TokenValidateType.java
 *
 * @date 2013/08/15
 * @version 1.1
 * @author Yao Kaikyou
 */
package com.example.orgchart_api.security;

/**
 * ワンタイムトークンの検証タイプを定義する列挙型。
 *
 * <ul>
 *   <li>NONE - トークン検証を行わない</li>
 *   <li>REMOVE - 検証後にトークンを削除する</li>
 *   <li>KEEP - 検証後もトークンを保持する</li>
 * </ul>
 *
 * @author Yao Kaikyou
 * @version 1.1 2025/06/13
 */
public enum TokenValidateType {
    /** トークン検証を行わない */
    NONE,

    /** トークンを検証して削除する */
    REMOVE,

    /** トークンを検証するが削除しない */
    KEEP
}


```
