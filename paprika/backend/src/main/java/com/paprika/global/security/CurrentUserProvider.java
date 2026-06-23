package com.paprika.global.security;

/**
 * SecurityContext에서 현재 로그인 사용자 ID를 조회합니다.
 * JWT 필터 연동 전까지는 DevUserIdFilter + X-User-Id 헤더로 테스트할 수 있습니다.
 */
public interface CurrentUserProvider {

    Long getCurrentUserId();
}
