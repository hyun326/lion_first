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
}
