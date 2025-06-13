## SecurityHandlerInterceptor

```java
package com.example.orgchart_api.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.apache.commons.lang3.StringUtils;
import org.springframework.validation.BindingResult;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.view.json.MappingJackson2JsonView;

import java.util.Map;
/**
 * セキュリティのハンドラークラス
 *
 * @author Yao Kaikyou
 * @version 1.0 (original), updated for Spring Boot 3.5.0
 */
public class SecurityHandlerInterceptor implements HandlerInterceptor {
    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) return true;

        // クリックジャッキング対策
        response.setHeader("X-FRAME-OPTIONS", "SAMEORIGIN");

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

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler, ModelAndView mav) throws Exception {
        if (!(handler instanceof HandlerMethod handlerMethod)) return;

        if (mav == null) return;

        String tokenName = getTokenName(handlerMethod);

        // トークン保存処理
        if (shouldSaveToken(handlerMethod)) {
            if (mav.getView() instanceof MappingJackson2JsonView) {
                TokenManager.save(request, mav, tokenName);
            } else {
                TokenManager.save(request, tokenName);
            }
            return;
        }

        // フォームバリデーションに失敗した場合のトークン再保存
        if (getValidateTokenType(handlerMethod).equals(TokenValidateType.REMOVE) && hasFormErrors(mav)) {
            if (mav.getView() instanceof MappingJackson2JsonView) {
                TokenManager.save(request, mav, tokenName);
            } else {
                TokenManager.save(request, tokenName);
            }
        }
    }

    private String getTokenName(HandlerMethod handlerMethod) {
        TokenHandler annotation = handlerMethod.getMethodAnnotation(TokenHandler.class);
        return (annotation == null || StringUtils.isEmpty(annotation.name()))
                ? TokenManager.DEFAULT_TOKEN_NAME
                : annotation.name();
    }

    private boolean shouldSaveToken(HandlerMethod handlerMethod) {
        TokenHandler annotation = handlerMethod.getMethodAnnotation(TokenHandler.class);
        return annotation != null && annotation.save();
    }

    private TokenValidateType getValidateTokenType(HandlerMethod handlerMethod) {
        TokenHandler annotation = handlerMethod.getMethodAnnotation(TokenHandler.class);
        return annotation != null ? annotation.validate() : TokenValidateType.NONE;
    }

    private boolean shouldHandleError(HandlerMethod handlerMethod) {
        TokenHandler annotation = handlerMethod.getMethodAnnotation(TokenHandler.class);
        return annotation != null && annotation.handleError();
    }

    private boolean hasFormErrors(ModelAndView mav) {
        String keyPrefix = BindingResult.MODEL_KEY_PREFIX;
        for (Map.Entry<String, Object> entry : mav.getModel().entrySet()) {
            if (entry.getKey().startsWith(keyPrefix) && entry.getValue() instanceof BindingResult result) {
                if (result.hasErrors()) {
                    return true;
                }
            }
        }
        return false;
    }
}

```
