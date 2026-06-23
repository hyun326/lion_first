package com.paprika.global.config;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.annotation.Profile;
import org.springframework.context.event.EventListener;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

/**
 * dev 프로필에서 Hibernate ddl-auto가 갱신하지 못하는 CHECK 제약을 코드 enum과 맞춥니다.
 */
@Slf4j
@Component
@Profile("dev")
@RequiredArgsConstructor
public class DevSchemaMigration {

    private final JdbcTemplate jdbcTemplate;

    @EventListener(ApplicationReadyEvent.class)
    public void alignTransactionCheckConstraints() {
        try {
            jdbcTemplate.execute("ALTER TABLE transactions DROP CONSTRAINT IF EXISTS transactions_status_check");
            jdbcTemplate.execute("""
                    ALTER TABLE transactions ADD CONSTRAINT transactions_status_check CHECK (status IN (
                        'REQUESTED', 'MEETING_SET', 'MEETING_COMPLETED',
                        'PREPARING', 'SHIPPED', 'IN_TRANSIT', 'DELIVERED', 'COMPLETED'
                    ))
                    """);
            log.info("Aligned transactions_status_check constraint");
        } catch (Exception e) {
            log.warn("Could not align transactions_status_check: {}", e.getMessage());
        }

        try {
            jdbcTemplate.execute("ALTER TABLE transactions ADD COLUMN IF NOT EXISTS fee_amount numeric(19, 2)");
            log.info("Ensured transactions.fee_amount column");
        } catch (Exception e) {
            log.warn("Could not add transactions.fee_amount: {}", e.getMessage());
        }
    }
}
