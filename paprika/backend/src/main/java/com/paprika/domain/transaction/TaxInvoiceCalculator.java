package com.paprika.domain.transaction;

import java.math.BigDecimal;
import java.math.RoundingMode;

public final class TaxInvoiceCalculator {

    private TaxInvoiceCalculator() {
    }

    public record Amounts(BigDecimal supplyAmount, BigDecimal vatAmount) {
    }

    /** 총액(부가세 포함) 기준 공급가액·부가세 분리 */
    public static Amounts splitFromTotal(BigDecimal totalAmount) {
        BigDecimal supplyAmount = totalAmount
                .divide(new BigDecimal("1.1"), 0, RoundingMode.HALF_UP);
        BigDecimal vatAmount = totalAmount.subtract(supplyAmount);
        return new Amounts(supplyAmount, vatAmount);
    }
}
