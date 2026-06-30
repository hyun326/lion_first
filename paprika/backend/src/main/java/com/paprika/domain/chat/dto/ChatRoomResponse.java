package com.paprika.domain.chat.dto;

import com.paprika.domain.chat.entity.ChatRoom;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;

/**
 * 채팅방 응답 DTO
 * 담당: C - 한대천
 */
@Getter
@Builder
public class ChatRoomResponse {

    private Long id;
    private Long postId;
    private Long buyerId;
    private Long sellerId;
    private String lastMessage;       // TODO: 마지막 메시지 내용
    private LocalDateTime lastMessageAt;
    private Integer unreadCount;      // TODO: 읽지 않은 메시지 수
    private LocalDateTime createdAt;

    public static ChatRoomResponse from(ChatRoom chatRoom) {
        return ChatRoomResponse.builder()
            .id(chatRoom.getId())
            .postId(chatRoom.getPostId())
            .buyerId(chatRoom.getBuyerId())
            .sellerId(chatRoom.getSellerId())
            .createdAt(chatRoom.getCreatedAt())
            .build();
    }
}
