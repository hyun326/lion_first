package com.paprika.domain.products.dto;

import com.paprika.domain.post.entity.Post;
import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * [임시/테스트] 상품 목록 응답 DTO — B의 Post에서 매핑. 담당: C - 한대천
 */
@Getter
@Builder
public class ProductResponse {

    private Long id;
    private Long sellerId;
    private String title;
    private BigDecimal price;
    private String status;
    private String category;
    private String thumbnailUrl;
    private Integer viewCount;
    private Instant createdAt;

    public static ProductResponse from(Post p) {
        return ProductResponse.builder()
                .id(p.getId())
                .sellerId(p.getUserId())
                .title(p.getTitle())
                .price(p.getCurrentPrice())
                .status(p.getPostStatus() != null ? p.getPostStatus().name() : null)
                .category(p.getCategory() != null ? p.getCategory().name() : null)
                .thumbnailUrl(p.getThumbnailUrl())
                .viewCount(p.getViewCount())
                .createdAt(p.getCreatedAt())
                .build();
    }
}
