package com.paprika.domain.chat.dto;

import com.paprika.domain.chat.entity.ChatMessage;
import lombok.Builder;
import lombok.Getter;

/**
 * 채팅 메시지 응답 DTO (브로드캐스트/과거 조회 공용)
 * 담당: C - 한대천
 *
 * createdAt은 ISO 문자열로 내려준다 (REST·STOMP 직렬화 모두 안전).
 */
@Getter
@Builder
public class ChatMessageResponse {

    private Long id;
    private Long chatRoomId;
    private Long senderId;
    private String content;
    private String createdAt;

    public static ChatMessageResponse from(ChatMessage m) {
        return ChatMessageResponse.builder()
                .id(m.getId())
                .chatRoomId(m.getChatRoomId())
                .senderId(m.getSenderId())
                .content(m.getContent())
                .createdAt(m.getCreatedAt() != null ? m.getCreatedAt().toString() : null)
                .build();
    }
}
