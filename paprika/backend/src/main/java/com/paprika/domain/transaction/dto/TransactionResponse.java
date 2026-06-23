package com.paprika.domain.transaction.dto;

import com.paprika.domain.transaction.entity.Transaction;
import com.paprika.domain.transaction.enums.DeliveryStatus;
import com.paprika.domain.transaction.enums.PaymentMethod;
import com.paprika.domain.transaction.enums.TaxInvoiceStatus;
import com.paprika.domain.transaction.enums.TransactionStatus;
import com.paprika.domain.transaction.enums.TransactionType;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Builder
public class TransactionResponse {

    private Long id;
    private Long productId;
    private Long buyerId;
    private Long sellerId;
    private Long counterpartId;
    private TransactionType transactionType;
    private TransactionStatus status;
    private BigDecimal amount;
    private BigDecimal feeAmount;
    private BigDecimal totalAmount;
    private PaymentMethod paymentMethod;
    private TaxInvoiceStatus taxInvoiceStatus;
    private String taxInvoiceCompanyName;
    private String taxInvoiceBusinessNumber;
    private String taxInvoiceEmail;
    private String taxInvoiceNumber;
    private LocalDateTime taxInvoiceIssuedAt;
    private BigDecimal taxInvoiceSupplyAmount;
    private BigDecimal taxInvoiceVatAmount;

    private String meetingPlaceName;
    private String meetingAddress;
    private Double latitude;
    private Double longitude;
    private LocalDateTime meetingAt;

    private String courierCompany;
    private String trackingNumber;
    private DeliveryStatus deliveryStatus;

    private boolean buyerCompleteConfirmed;
    private boolean sellerCompleteConfirmed;
    private boolean completed;

    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static TransactionResponse from(Transaction transaction, Long currentUserId) {
        return TransactionResponse.builder()
                .id(transaction.getId())
                .productId(transaction.getProductId())
                .buyerId(transaction.getBuyerId())
                .sellerId(transaction.getSellerId())
                .counterpartId(transaction.getCounterpartId(currentUserId))
                .transactionType(transaction.getTransactionType())
                .status(transaction.getStatus())
                .amount(transaction.getAmount())
                .feeAmount(transaction.getFeeAmount())
                .totalAmount(transaction.getTotalAmount())
                .paymentMethod(transaction.getPaymentMethod())
                .taxInvoiceStatus(transaction.getTaxInvoiceStatus())
                .taxInvoiceCompanyName(transaction.getTaxInvoiceCompanyName())
                .taxInvoiceBusinessNumber(transaction.getTaxInvoiceBusinessNumber())
                .taxInvoiceEmail(transaction.getTaxInvoiceEmail())
                .taxInvoiceNumber(transaction.getTaxInvoiceNumber())
                .taxInvoiceIssuedAt(transaction.getTaxInvoiceIssuedAt())
                .taxInvoiceSupplyAmount(transaction.getTaxInvoiceSupplyAmount())
                .taxInvoiceVatAmount(transaction.getTaxInvoiceVatAmount())
                .meetingPlaceName(transaction.getMeetingPlaceName())
                .meetingAddress(transaction.getMeetingAddress())
                .latitude(transaction.getLatitude())
                .longitude(transaction.getLongitude())
                .meetingAt(transaction.getMeetingAt())
                .courierCompany(transaction.getCourierCompany())
                .trackingNumber(transaction.getTrackingNumber())
                .deliveryStatus(transaction.getDeliveryStatus())
                .buyerCompleteConfirmed(transaction.isBuyerCompleteConfirmed())
                .sellerCompleteConfirmed(transaction.isSellerCompleteConfirmed())
                .completed(transaction.isCompleted())
                .createdAt(transaction.getCreatedAt())
                .updatedAt(transaction.getUpdatedAt())
                .build();
    }
}
