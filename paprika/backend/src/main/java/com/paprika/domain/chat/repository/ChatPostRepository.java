package com.paprika.domain.chat.repository;

import com.paprika.domain.post.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * 판매자 조회용 레포지토리 (채팅) — post 도메인(B)의 Post 엔티티를 재사용.
 * 담당: C - 한대천
 *
 * 자체 엔티티(ChatPost)를 두지 않고 B의 Post(= post 테이블)를 조회한다.
 * 같은 Post 엔티티에 레포가 여러 개인 것은 허용됨(PostRepository/ProductRepository/ChatPostRepository).
 */
public interface ChatPostRepository extends JpaRepository<Post, Long> {
}
