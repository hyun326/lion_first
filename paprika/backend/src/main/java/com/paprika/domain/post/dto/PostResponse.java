package com.paprika.domain.post.dto;

import lombok.Builder;
import lombok.Getter;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

import com.paprika.domain.post.entity.Post;

/**
 * 상품 응답 DTO
 * 담당: B - 백성민
 */
@Getter
@Builder
public class PostResponse {

    private Long id;
    private Long sellerId;
    private String title;
    private String description;
    private BigDecimal price;
    private String status;
    private String category;
    private String location;
    private Double latitude;
    private Double longitude;
    private List<String> imageUrls;
    private Integer viewCount;
    private LocalDateTime createdAt;

    public static PostResponse from(Post product) {
        return PostResponse.builder()
                .id(product.getId())
                .sellerId(product.getSellerId())
                .title(product.getTitle())
                .description(product.getDescription())
                .price(product.getPrice())
                .status(product.getStatus().name())
                .category(product.getCategory())
                .location(product.getLocation())
                .latitude(product.getLatitude())
                .longitude(product.getLongitude())
                .imageUrls(product.getImageUrls())
                .viewCount(product.getViewCount())
                .createdAt(product.getCreatedAt())
                .build();
    }
}
