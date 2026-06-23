package com.paprika.domain.product.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

/**
 * 중고 상품 엔티티
 * 담당: B - 백성민
 *
 * TODO:
 *  - Category 엔티티 연관 관계 추가
 *  - ProductImage 연관 관계 추가
 *  - 조회수(viewCount) 캐싱 전략 고려
 *  - 임시저장(DRAFT) 상태 로직
 *  - 위치 정보 (위도/경도) 필드 추가
 */
@Entity
@Table(name = "products")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long sellerId; // TODO: User 엔티티와 @ManyToOne 연관 관계로 변경

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProductStatus status = ProductStatus.SELLING;

    private String category;

    private String location;

    private Double latitude;

    private Double longitude;

    private Integer viewCount = 0;

    @ElementCollection
    @CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
    @Column(name = "image_url")
    private List<String> imageUrls = new ArrayList<>();

    @CreatedDate
    private LocalDateTime createdAt;

    @LastModifiedDate
    private LocalDateTime updatedAt;

    public enum ProductStatus { SELLING, RESERVED, SOLD, DRAFT }

    /** 거래 완료 시 판매 완료로 변경 */
    public void markAsSold() {
        this.status = ProductStatus.SOLD;
    }

    /** 약속 확정 시 예약중으로 변경 (판매중일 때만) */
    public void markAsReserved() {
        if (this.status == ProductStatus.SELLING) {
            this.status = ProductStatus.RESERVED;
        }
    }

    /** 거래 취소 시 다시 판매중으로 복귀 (예약중일 때만) */
    public void restoreToSelling() {
        if (this.status == ProductStatus.RESERVED) {
            this.status = ProductStatus.SELLING;
        }
    }
}
