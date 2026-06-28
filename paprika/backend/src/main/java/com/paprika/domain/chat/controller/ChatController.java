package com.paprika.domain.chat.controller;

import com.paprika.domain.chat.dto.ChatMessageRequest;
import com.paprika.global.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.web.bind.annotation.*;

/**
 * 채팅 컨트롤러 (REST + WebSocket)
 * 담당: C - 한대천
 *
 * [REST API]
 * TODO:
 *  - GET  /api/v1/chat/rooms          내 채팅방 목록
 *  - GET  /api/v1/chat/rooms/{id}     채팅방 생성 또는 조회 (상품ID + 상대방ID)
 *  - GET  /api/v1/chat/rooms/{id}/messages  이전 메시지 조회 (무한 스크롤)
 *  - GET  /api/v1/notifications       알림 목록
 *
 * [WebSocket - STOMP]
 * TODO:
 *  - @MessageMapping("/chat/{roomId}")  메시지 전송 → /topic/chat/{roomId} 브로드캐스트
 */
@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    // TODO: private final ChatService chatService;

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<Object>> getChatRooms() {
        // TODO: 구현
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<Object>> getChatRoom(@PathVariable Long roomId) {
        // TODO: 구현
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ApiResponse<Object>> getMessages(
            @PathVariable Long roomId,
            @PageableDefault(size = 30) Pageable pageable
    ) {
        // TODO: 무한 스크롤 구현 (cursor 방식 고려)
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    // WebSocket 메시지 핸들러 (프로토타입: 받은 메시지를 해당 방 구독자 전원에게 그대로 브로드캐스트)
    // TODO: 메시지 DB 저장, 인증된 senderId 사용, 상대방 알림(/user/{userId}/notification)
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessageRequest sendMessage(@DestinationVariable Long roomId,
                                          @Payload ChatMessageRequest messageRequest) {
        return messageRequest;
    }
}
