<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;"> text: "DuplicateResourceException",
</span>

`src/main/java/com/example/orgchart_api/exception/DuplicateResourceException.java`

```java
package com.example.orgchart_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * リソースの重複が検出された場合にスローされる例外
 * HTTPステータス 409 Conflict を返す
 */
@ResponseStatus(value = HttpStatus.CONFLICT)
public class DuplicateResourceException extends RuntimeException {
    public DuplicateResourceException(String message) {
        super(message);
    }
}

```
