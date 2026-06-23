package com.paprika.global.config;

import com.paprika.global.security.DevUserIdFilter;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Spring Security 설정
 * 담당: A - 민동현
 *
 * TODO:
 *  - JWT 필터 추가 (JwtAuthenticationFilter)
 *  - OAuth2 로그인 설정 (successHandler, failureHandler)
 *  - 관리자 접근 권한 설정
 *  - JWT 완성 후 devMode 분기 제거 + application-dev.yml 삭제
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final ObjectProvider<DevUserIdFilter> devUserIdFilterProvider;

    // application-dev.yml: true / application-prod.yml: false
    @Value("${security.dev-mode:true}")
    private boolean devMode;

    public SecurityConfig(ObjectProvider<DevUserIdFilter> devUserIdFilterProvider) {
        this.devUserIdFilterProvider = devUserIdFilterProvider;
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));

        devUserIdFilterProvider.ifAvailable(filter ->
                http.addFilterBefore(filter, UsernamePasswordAuthenticationFilter.class));

        if (devMode) {
            // 개발 모드: 모든 API 허용 (JWT 필터 완성 전까지)
            http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll());
        } else {
            // 운영 모드: JWT 인증 적용
            http.authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/v1/auth/**", "/ws/**").permitAll()
                .requestMatchers("/api/v1/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            );
            // TODO: JWT 필터 추가
            // http.addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

            // TODO: OAuth2 로그인 추가
            // http.oauth2Login(oauth2 -> oauth2.successHandler(...));
        }

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
