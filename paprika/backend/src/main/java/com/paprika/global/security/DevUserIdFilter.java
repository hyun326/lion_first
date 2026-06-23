package com.paprika.global.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.context.annotation.Profile;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

/**
 * JWT 필터 완성 전 개발용 필터.
 * X-User-Id 헤더 값을 SecurityContext principal(Long)로 설정합니다.
 *
 * TODO: JWT 필터(A - 민동현) 완성 후 dev-mode 분기와 함께 제거합니다.
 */
@Component
@Profile({"dev", "local"})
public class DevUserIdFilter extends OncePerRequestFilter {

    private static final String USER_ID_HEADER = "X-User-Id";

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        if (SecurityContextHolder.getContext().getAuthentication() == null) {
            String userIdHeader = request.getHeader(USER_ID_HEADER);
            if (userIdHeader != null && !userIdHeader.isBlank()) {
                try {
                    Long userId = Long.parseLong(userIdHeader.trim());
                    UsernamePasswordAuthenticationToken authentication =
                            new UsernamePasswordAuthenticationToken(userId, null, Collections.emptyList());
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                } catch (NumberFormatException ignored) {
                    // 잘못된 헤더는 무시하고 다음 필터/인증 로직에 맡깁니다.
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
