<span style="color: #007acc; font-weight: bold; font-size: 1.5rem;">ResourceNotFoundException</span>

`src/main/java/com/example/orgchart_api/exception/ResourceNotFoundException.java`

```java
package com.example.orgchart_api.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

/**
 * リソースが存在しない場合にスローされる例外
 * HTTPステータス 404 Not Found を返す
 */
@ResponseStatus(value = HttpStatus.NOT_FOUND)
public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String message) {
        super(message);
    }
}

```
