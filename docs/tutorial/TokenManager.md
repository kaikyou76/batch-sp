## TokenManager

```java
package com.example.orgchart_api.security;

import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.servlet.ModelAndView;

import java.util.UUID;

public class TokenManager {
    private static final Logger log = LoggerFactory.getLogger(TokenManager.class);
    public static final String DEFAULT_TOKEN_NAME = "_RequestVerificationToken";

    public static void save(HttpServletRequest request, String tokenName) {
        String token = generateToken();
        setSessionToken(request, tokenName, token);
    }

    public static void save(HttpServletRequest request, ModelAndView mav, String tokenName) {
        String token = generateToken();
        setSessionToken(request, tokenName, token);
        mav.addObject(tokenName, token);
    }

    public static boolean validate(HttpServletRequest request, String tokenName, boolean removeToken) {
        String sessionToken = getSessionToken(request, tokenName);
        String requestToken = request.getParameter(tokenName);

        if (log.isDebugEnabled()) {
            log.debug("Token validation: Session[{}] vs Request[{}]", sessionToken, requestToken);
        }

        boolean isValid = sessionToken != null && sessionToken.equals(requestToken);

        if (isValid && removeToken) {
            removeSessionToken(request, tokenName);
        }

        return isValid;
    }

    private static String generateToken() {
        return UUID.randomUUID().toString();
    }

    private static void setSessionToken(HttpServletRequest request, String tokenName, String token) {
        request.getSession().setAttribute(tokenName, token);
    }

    private static String getSessionToken(HttpServletRequest request, String tokenName) {
        return (String) request.getSession().getAttribute(tokenName);
    }

    private static void removeSessionToken(HttpServletRequest request, String tokenName) {
        request.getSession().removeAttribute(tokenName);
    }
}
```
