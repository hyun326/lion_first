package com.paprika.domain.post.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Getter;

import java.math.BigDecimal;
import java.util.List;

/**
 * 상품 등록 요청 DTO
 * 담당: B - 백성민
 */
@Getter
public class PostCreateRequest {

    @NotBlank
    private String title;

    private String description;

    @NotNull
    @Positive
    private BigDecimal price;

    private String category;

    private String location;

    private Double latitude;

    private Double longitude;

    // 이미지는 /api/v1/images/upload 로 먼저 업로드 후 URL 목록 전달
    private List<String> imageUrls;
}
