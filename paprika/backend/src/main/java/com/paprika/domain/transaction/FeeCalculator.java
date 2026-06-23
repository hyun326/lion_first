package com.paprika.domain.transaction;

import java.math.BigDecimal;
import java.math.RoundingMode;

/**
 * 결제 수수료 계산기.
 * 결제 시 상품 금액 기준 5% 수수료를 부과합니다.
 */
public final class FeeCalculator {

    /** 결제 수수료율 (5%) */
    public static final BigDecimal FEE_RATE = new BigDecimal("0.05");

    private FeeCalculator() {
    }

    /** 상품 금액 기준 수수료(원 단위 반올림) 계산 */
    public static BigDecimal calculateFee(BigDecimal amount) {
        if (amount == null) {
            return BigDecimal.ZERO;
        }
        return amount.multiply(FEE_RATE).setScale(0, RoundingMode.HALF_UP);
    }
}
