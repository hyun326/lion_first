package com.paprika.domain.chat.repository;

import com.paprika.domain.chat.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

/**
 * 담당: C - 한대천
 */
public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    List<ChatRoom> findByBuyerIdOrSellerIdOrderByIdDesc(Long buyerId, Long sellerId);

    Optional<ChatRoom> findByPostIdAndBuyerIdAndSellerId(Long postId, Long buyerId, Long sellerId);

    // 구매자 입장: 상품당 구매자 1방 (DB 유니크 제약 uq_chat_room = (post_id, buyer_id)와 일치)
    Optional<ChatRoom> findByPostIdAndBuyerId(Long postId, Long buyerId);

    // 판매자 입장: 이 상품에 온 모든 문의 방 (구매자별 0~N개)
    List<ChatRoom> findByPostIdAndSellerId(Long postId, Long sellerId);
}
