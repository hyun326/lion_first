package com.paprika.domain.transaction.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * 거래 엔티티
 * 담당: D - 이동준
 *
 * TODO:
 *  - Product, User 연관 관계 추가
 *  - 직거래 vs 택배 분기 로직
 *  - 거래 완료 후 리뷰 연동 (E - 장인호와 협의)
 *  - 세금계산서 발행 로직
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

    private Long productId;  // TODO: Product와 @ManyToOne

    private Long buyerId;    // TODO: User와 @ManyToOne

    private Long sellerId;   // TODO: User와 @ManyToOne

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionType type; // DIRECT, DELIVERY

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TransactionStatus status;

    private BigDecimal amount;

    // 직거래용
    private String meetingLocation;

    private Double meetingLatitude;

    private Double meetingLongitude;

    private LocalDateTime meetingTime;

    // 택배용
    private String trackingNumber;

    private String deliveryStatus;

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum TransactionType { DIRECT, DELIVERY }

    public enum TransactionStatus {
        PENDING,       // 거래 요청
        AGREED,        // 거래 확정
        COMPLETED,     // 거래 완료
        CANCELLED      // 거래 취소
    }
}
