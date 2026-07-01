package com.paprika.domain.products.service;

import com.paprika.domain.post.entity.Post;
import com.paprika.domain.products.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * [임시/테스트] 상품 목록 서비스 — B의 Post(= post 테이블) 읽기 전용. 담당: C - 한대천
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductService {

    private final ProductRepository productRepository;

    /** 상품(post) 목록 페이징 조회. */
    public Page<Post> getProducts(Pageable pageable) {
        return productRepository.findAll(pageable);
    }
}
