package com.paprika.domain.transaction.entity;

import com.paprika.domain.transaction.FeeCalculator;
import com.paprika.domain.transaction.TaxInvoiceCalculator;
import com.paprika.domain.transaction.enums.DeliveryStatus;
import com.paprika.domain.transaction.enums.PaymentMethod;
import com.paprika.domain.transaction.enums.TaxInvoiceStatus;
import com.paprika.domain.transaction.enums.TransactionStatus;
import com.paprika.domain.transaction.enums.TransactionType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Version;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 거래 엔티티
 * 담당: D - 이동준
 *
 * user, product 도메인과 JPA 연관관계 없이 ID만 저장합니다.
 */
@Entity
@Table(name = "transactions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Version
    @Column(nullable = false)
    private Long version;

    @Column(nullable = false)
    private Long productId;

    @Column(nullable = false)
    private Long buyerId;

    @Column(nullable = false)
    private Long sellerId;

    @Enumerated(EnumType.STRING)
    @Column(name = "type", nullable = false, length = 20)
    private TransactionType transactionType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private TransactionStatus status;

    @Column(nullable = false, precision = 19, scale = 2)
    private BigDecimal amount;

    /** 결제 수수료 (상품 금액의 5%) */
    @Column(name = "fee_amount", precision = 19, scale = 2)
    private BigDecimal feeAmount;

    @Enumerated(EnumType.STRING)
    @Column(length = 10)
    private PaymentMethod paymentMethod;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private TaxInvoiceStatus taxInvoiceStatus;

    private String taxInvoiceCompanyName;
    private String taxInvoiceBusinessNumber;
    private String taxInvoiceEmail;
    private String taxInvoiceNumber;
    private LocalDateTime taxInvoiceIssuedAt;
    private BigDecimal taxInvoiceSupplyAmount;
    private BigDecimal taxInvoiceVatAmount;

    // 직거래 정보
    @Column(name = "meeting_location")
    private String meetingPlaceName;
    private String meetingAddress;
    @Column(name = "meeting_latitude")
    private Double latitude;
    @Column(name = "meeting_longitude")
    private Double longitude;
    @Column(name = "meeting_time")
    private LocalDateTime meetingAt;

    @Column(nullable = false)
    private boolean buyerCompleteConfirmed;

    @Column(nullable = false)
    private boolean sellerCompleteConfirmed;

    // 택배 정보
    private String courierCompany;
    private String trackingNumber;

    @Enumerated(EnumType.STRING)
    @Column(length = 20)
    private DeliveryStatus deliveryStatus;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public void reviseRequestedTransaction(
            TransactionType transactionType,
            BigDecimal amount,
            PaymentMethod paymentMethod,
            boolean taxInvoiceRequested,
            String taxInvoiceCompanyName,
            String taxInvoiceBusinessNumber,
            String taxInvoiceEmail
    ) {
        if (status != TransactionStatus.REQUESTED) {
            throw new IllegalStateException("거래 요청 상태에서만 수정할 수 있습니다.");
        }
        this.transactionType = transactionType;
        this.amount = amount;
        this.feeAmount = FeeCalculator.calculateFee(amount);
        applyPaymentAndTaxInvoice(
                paymentMethod,
                taxInvoiceRequested,
                taxInvoiceCompanyName,
                taxInvoiceBusinessNumber,
                taxInvoiceEmail,
                amount
        );
    }

    public static Transaction create(
            Long productId,
            Long buyerId,
            Long sellerId,
            TransactionType transactionType,
            BigDecimal amount,
            PaymentMethod paymentMethod,
            boolean taxInvoiceRequested,
            String taxInvoiceCompanyName,
            String taxInvoiceBusinessNumber,
            String taxInvoiceEmail
    ) {
        Transaction transaction = new Transaction();
        transaction.productId = productId;
        transaction.buyerId = buyerId;
        transaction.sellerId = sellerId;
        transaction.transactionType = transactionType;
        transaction.amount = amount;
        transaction.feeAmount = FeeCalculator.calculateFee(amount);
        transaction.status = TransactionStatus.REQUESTED;
        transaction.buyerCompleteConfirmed = false;
        transaction.sellerCompleteConfirmed = false;
        transaction.applyPaymentAndTaxInvoice(
                paymentMethod,
                taxInvoiceRequested,
                taxInvoiceCompanyName,
                taxInvoiceBusinessNumber,
                taxInvoiceEmail,
                amount
        );
        return transaction;
    }

    private void applyPaymentAndTaxInvoice(
            PaymentMethod paymentMethod,
            boolean taxInvoiceRequested,
            String taxInvoiceCompanyName,
            String taxInvoiceBusinessNumber,
            String taxInvoiceEmail,
            BigDecimal totalAmount
    ) {
        this.paymentMethod = paymentMethod;
        if (!taxInvoiceRequested) {
            this.taxInvoiceStatus = TaxInvoiceStatus.NOT_REQUESTED;
            this.taxInvoiceCompanyName = null;
            this.taxInvoiceBusinessNumber = null;
            this.taxInvoiceEmail = null;
            this.taxInvoiceSupplyAmount = null;
            this.taxInvoiceVatAmount = null;
            return;
        }

        this.taxInvoiceStatus = TaxInvoiceStatus.REQUESTED;
        this.taxInvoiceCompanyName = taxInvoiceCompanyName;
        this.taxInvoiceBusinessNumber = taxInvoiceBusinessNumber;
        this.taxInvoiceEmail = taxInvoiceEmail;
        TaxInvoiceCalculator.Amounts amounts = TaxInvoiceCalculator.splitFromTotal(totalAmount);
        this.taxInvoiceSupplyAmount = amounts.supplyAmount();
        this.taxInvoiceVatAmount = amounts.vatAmount();
    }

    public void issueTaxInvoiceIfRequested() {
        if (taxInvoiceStatus != TaxInvoiceStatus.REQUESTED || id == null) {
            return;
        }
        this.taxInvoiceNumber = "TI-" + id + "-" + LocalDateTime.now().format(
                java.time.format.DateTimeFormatter.ofPattern("yyyyMMdd")
        );
        this.taxInvoiceIssuedAt = LocalDateTime.now();
        this.taxInvoiceStatus = TaxInvoiceStatus.ISSUED;
        TaxInvoiceCalculator.Amounts amounts = TaxInvoiceCalculator.splitFromTotal(amount);
        this.taxInvoiceSupplyAmount = amounts.supplyAmount();
        this.taxInvoiceVatAmount = amounts.vatAmount();
    }

    private void finalizeCompletion() {
        if (status == TransactionStatus.COMPLETED) {
            issueTaxInvoiceIfRequested();
        }
    }

    /** 총 결제 금액 = 상품 금액 + 수수료 */
    public BigDecimal getTotalAmount() {
        BigDecimal fee = feeAmount == null ? BigDecimal.ZERO : feeAmount;
        return amount.add(fee);
    }

    public boolean isDirect() {
        return transactionType == TransactionType.DIRECT;
    }

    public boolean isDelivery() {
        return transactionType == TransactionType.DELIVERY;
    }

    public boolean isCompleted() {
        return status == TransactionStatus.COMPLETED;
    }

    public boolean isParticipant(Long userId) {
        return buyerId.equals(userId) || sellerId.equals(userId);
    }

    public boolean isBuyer(Long userId) {
        return buyerId.equals(userId);
    }

    public boolean isSeller(Long userId) {
        return sellerId.equals(userId);
    }

    public Long getCounterpartId(Long userId) {
        if (buyerId.equals(userId)) {
            return sellerId;
        }
        if (sellerId.equals(userId)) {
            return buyerId;
        }
        return null;
    }

    public boolean hasTrackingNumber() {
        return trackingNumber != null && !trackingNumber.isBlank();
    }

    public boolean isCancelled() {
        return status == TransactionStatus.CANCELLED;
    }

    /** 완료/취소 전(진행 중) 상태인지 */
    public boolean isActive() {
        return status != TransactionStatus.COMPLETED && status != TransactionStatus.CANCELLED;
    }

    /** 현재 상태에서 취소가 가능한지 (완료/취소 후 불가, 택배는 발송 이후 불가) */
    public boolean isCancellable() {
        if (status == TransactionStatus.COMPLETED || status == TransactionStatus.CANCELLED) {
            return false;
        }
        if (isDelivery()) {
            return status == TransactionStatus.REQUESTED || status == TransactionStatus.PREPARING;
        }
        return true;
    }

    /** 판매자가 직거래 약속을 제안한다. 구매자 수락 전까지 MEETING_PROPOSED 상태가 된다. */
    public void proposeDirectMeeting(
            String meetingPlaceName,
            String meetingAddress,
            Double latitude,
            Double longitude,
            LocalDateTime meetingAt
    ) {
        this.meetingPlaceName = meetingPlaceName;
        this.meetingAddress = meetingAddress;
        this.latitude = latitude;
        this.longitude = longitude;
        this.meetingAt = meetingAt;
        this.status = TransactionStatus.MEETING_PROPOSED;
        this.buyerCompleteConfirmed = false;
        this.sellerCompleteConfirmed = false;
    }

    /** 구매자가 제안된 약속을 수락한다. */
    public void acceptDirectMeeting(Long userId) {
        if (!isBuyer(userId)) {
            throw new IllegalStateException("구매자만 약속을 수락할 수 있습니다.");
        }
        if (status != TransactionStatus.MEETING_PROPOSED) {
            throw new IllegalStateException("제안된 약속이 없습니다.");
        }
        this.status = TransactionStatus.MEETING_SET;
    }

    /** 구매자가 제안된 약속을 거절한다. 약속 정보를 비우고 거래 요청 상태로 되돌린다. */
    public void rejectDirectMeeting(Long userId) {
        if (!isBuyer(userId)) {
            throw new IllegalStateException("구매자만 약속을 거절할 수 있습니다.");
        }
        if (status != TransactionStatus.MEETING_PROPOSED) {
            throw new IllegalStateException("제안된 약속이 없습니다.");
        }
        this.meetingPlaceName = null;
        this.meetingAddress = null;
        this.latitude = null;
        this.longitude = null;
        this.meetingAt = null;
        this.status = TransactionStatus.REQUESTED;
    }

    /** 거래 참여자가 거래를 취소한다. */
    public void cancel(Long userId) {
        if (!isParticipant(userId)) {
            throw new IllegalStateException("거래 참여자가 아닙니다.");
        }
        if (!isCancellable()) {
            throw new IllegalStateException("현재 상태에서는 거래를 취소할 수 없습니다.");
        }
        this.status = TransactionStatus.CANCELLED;
    }

    public void confirmDirectComplete(Long userId) {
        if (isBuyer(userId)) {
            if (buyerCompleteConfirmed) {
                throw new IllegalStateException("구매자가 이미 완료 확인했습니다.");
            }
            buyerCompleteConfirmed = true;
        } else if (isSeller(userId)) {
            if (sellerCompleteConfirmed) {
                throw new IllegalStateException("판매자가 이미 완료 확인했습니다.");
            }
            sellerCompleteConfirmed = true;
        } else {
            throw new IllegalStateException("거래 참여자가 아닙니다.");
        }

        if (buyerCompleteConfirmed && sellerCompleteConfirmed) {
            status = TransactionStatus.COMPLETED;
            finalizeCompletion();
        } else if (status == TransactionStatus.MEETING_SET) {
            status = TransactionStatus.MEETING_COMPLETED;
        }
    }

    public void updateDeliveryInvoice(String courierCompany, String trackingNumber) {
        this.courierCompany = courierCompany;
        this.trackingNumber = trackingNumber;
    }

    public void changeDeliveryStatus(DeliveryStatus nextDeliveryStatus) {
        this.deliveryStatus = nextDeliveryStatus;
        this.status = TransactionStatus.valueOf(nextDeliveryStatus.name());
    }

    /**
     * 개발/테스트용: IN_TRANSIT -> DELIVERED (택배사 API 연동 전)
     */
    public void markDeliveryDelivered() {
        if (status != TransactionStatus.IN_TRANSIT || deliveryStatus != DeliveryStatus.IN_TRANSIT) {
            throw new IllegalStateException("배송 중 상태에서만 배송 완료 처리할 수 있습니다.");
        }
        this.deliveryStatus = DeliveryStatus.DELIVERED;
        this.status = TransactionStatus.DELIVERED;
    }

    public void confirmDeliveryReceive() {
        if (deliveryStatus != DeliveryStatus.DELIVERED || status != TransactionStatus.DELIVERED) {
            throw new IllegalStateException("배송 완료 상태에서만 수령 확인할 수 있습니다.");
        }
        this.status = TransactionStatus.COMPLETED;
        finalizeCompletion();
    }
}
