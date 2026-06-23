package com.paprika.global.security;

import com.paprika.global.exception.ErrorCode;
import com.paprika.global.exception.PaprikaException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityContextCurrentUserProvider implements CurrentUserProvider {

    @Override
    public Long getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new PaprikaException(ErrorCode.UNAUTHORIZED);
        }

        Object principal = authentication.getPrincipal();

        if (principal instanceof Long userId) {
            return userId;
        }

        if (principal instanceof String username && !"anonymousUser".equals(username)) {
            try {
                return Long.parseLong(username);
            } catch (NumberFormatException ignored) {
                // JWT 연동 시 UserDetails 등 다른 principal 타입으로 교체 예정
            }
        }

        throw new PaprikaException(ErrorCode.UNAUTHORIZED);
    }
}
