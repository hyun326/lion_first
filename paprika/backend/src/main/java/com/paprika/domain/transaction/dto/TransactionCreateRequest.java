package com.paprika.domain.transaction.dto;

import com.paprika.domain.transaction.enums.PaymentMethod;
import com.paprika.domain.transaction.enums.TransactionType;
import jakarta.validation.constraints.AssertTrue;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;
import lombok.Setter;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;

@Getter
@Setter
public class TransactionCreateRequest {

    @NotNull(message = "상품 ID는 필수입니다.")
    @Positive(message = "상품 ID는 1 이상이어야 합니다.")
    private Long productId;

    @NotNull(message = "판매자 ID는 필수입니다.")
    @Positive(message = "판매자 ID는 1 이상이어야 합니다.")
    private Long sellerId;

    @NotNull(message = "거래 방식은 필수입니다.")
    private TransactionType transactionType;

    @NotNull(message = "거래 금액은 필수입니다.")
    @DecimalMin(value = "0.01", message = "거래 금액은 0보다 커야 합니다.")
    private BigDecimal amount;

    @NotNull(message = "결제 수단은 필수입니다.")
    private PaymentMethod paymentMethod;

    private boolean taxInvoiceRequested;

    private String taxInvoiceCompanyName;
    private String taxInvoiceBusinessNumber;

    @Email(message = "세금계산서 이메일 형식이 올바르지 않습니다.")
    private String taxInvoiceEmail;

    @AssertTrue(message = "카드 결제 시에는 세금계산서를 발행할 수 없습니다.")
    public boolean isTaxInvoiceAllowedForPaymentMethod() {
        if (!taxInvoiceRequested) {
            return true;
        }
        return paymentMethod == PaymentMethod.CASH;
    }

    @AssertTrue(message = "세금계산서 발행 시 상호, 사업자등록번호, 이메일을 입력해주세요.")
    public boolean isTaxInvoiceInfoValid() {
        if (!taxInvoiceRequested) {
            return true;
        }
        return StringUtils.hasText(taxInvoiceCompanyName)
                && StringUtils.hasText(taxInvoiceBusinessNumber)
                && StringUtils.hasText(taxInvoiceEmail);
    }
}
