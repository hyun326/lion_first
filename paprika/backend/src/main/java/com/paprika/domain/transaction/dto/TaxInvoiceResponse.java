package com.paprika.domain.transaction.dto;

import com.paprika.domain.transaction.entity.Transaction;
import com.paprika.domain.transaction.enums.PaymentMethod;
import com.paprika.domain.transaction.enums.TaxInvoiceStatus;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class TaxInvoiceResponse {

    private Long transactionId;
    private TaxInvoiceStatus status;
    private String invoiceNumber;
    private LocalDateTime issuedAt;
    private String companyName;
    private String businessNumber;
    private String email;
    private BigDecimal supplyAmount;
    private BigDecimal vatAmount;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;

    public static TaxInvoiceResponse from(Transaction transaction) {
        return TaxInvoiceResponse.builder()
                .transactionId(transaction.getId())
                .status(transaction.getTaxInvoiceStatus())
                .invoiceNumber(transaction.getTaxInvoiceNumber())
                .issuedAt(transaction.getTaxInvoiceIssuedAt())
                .companyName(transaction.getTaxInvoiceCompanyName())
                .businessNumber(transaction.getTaxInvoiceBusinessNumber())
                .email(transaction.getTaxInvoiceEmail())
                .supplyAmount(transaction.getTaxInvoiceSupplyAmount())
                .vatAmount(transaction.getTaxInvoiceVatAmount())
                .totalAmount(transaction.getAmount())
                .paymentMethod(transaction.getPaymentMethod())
                .build();
    }
}
