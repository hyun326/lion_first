package com.paprika.domain.products.repository;

import com.paprika.domain.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * [임시/테스트] 상품 목록 조회 레포지토리 — post 도메인(B)의 Post 엔티티를 그대로 재사용.
 * 담당: C - 한대천
 *
 * 자체 엔티티를 두지 않아 같은 테이블(post)에 엔티티가 하나뿐 → 매핑 충돌 없음.
 * (같은 Post 엔티티에 레포지토리가 여러 개인 것은 허용됨: PostRepository, ProductRepository)
 */
public interface ProductRepository extends JpaRepository<Post, Long> {
}
