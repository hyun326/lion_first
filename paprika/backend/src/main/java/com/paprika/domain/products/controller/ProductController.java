package com.paprika.domain.products.controller;

import com.paprika.domain.products.dto.ProductResponse;
import com.paprika.domain.products.service.ProductService;
import com.paprika.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * [임시/테스트] 상품 목록 컨트롤러 — 기존 post 테이블에서 읽어온다.
 * 담당: C - 한대천 (테스트용)
 *
 * post 도메인(B, /api/v1/posts)과 기능은 겹치지만, 테스트용으로 /api/v1/products에 별도로 둔다.
 * (같은 데이터, 새 테이블 없음. 나중에 정리 예정)
 *
 *  - GET /api/v1/products?page=0&size=12  상품 목록 (페이징, 최신순)
 */
@RestController
@RequestMapping("/api/v1/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping
    public ResponseEntity<ApiResponse<Page<ProductResponse>>> getProducts(
            @PageableDefault(size = 12, sort = "id", direction = Sort.Direction.DESC) Pageable pageable
    ) {
        Page<ProductResponse> products = productService.getProducts(pageable).map(ProductResponse::from);
        return ResponseEntity.ok(ApiResponse.ok(products));
    }
}
