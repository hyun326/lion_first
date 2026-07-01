package com.paprika.domain.chat.controller;

import com.paprika.domain.chat.dto.ChatMessageRequest;
import com.paprika.domain.chat.dto.ChatMessageResponse;
import com.paprika.domain.chat.dto.ChatRoomCreateRequest;
import com.paprika.domain.chat.dto.ChatRoomResponse;
import com.paprika.domain.chat.entity.ChatMessage;
import com.paprika.domain.chat.service.ChatService;
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

import java.util.List;

/**
 * 채팅 컨트롤러 (REST + WebSocket)
 * 담당: C - 한대천
 *
 * [REST API]
 *  - POST /api/v1/chat/rooms/enter          채팅 진입 → 방 목록 반환 (구현됨)
 *  - GET  /api/v1/chat/rooms                내 채팅방 목록 (TODO)
 *  - GET  /api/v1/chat/rooms/{id}           채팅방 단건 조회 (TODO)
 *  - GET  /api/v1/chat/rooms/{id}/messages  이전 메시지 조회 (TODO)
 *
 * [WebSocket - STOMP]
 *  - @MessageMapping("/chat/{roomId}")  메시지 전송 → /topic/chat/{roomId} 브로드캐스트
 */
@RestController
@RequestMapping("/api/v1/chat")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /**
     * 현재 로그인 사용자 id.
     * TODO: A의 JWT 필터 완성 후 SecurityContext / Authorization 헤더의 JWT에서 파싱.
     *       지금은 dev 모드라 임시로 7번 유저로 고정한다.
     */
    private Long getCurrentUserId() {
        return 7L;
    }

    /**
     * "채팅하기" 진입.
     * 항상 방 목록(List)을 반환한다. 프론트는 개수만 보고 UI를 정한다.
     *  - 1개  → 그 방을 바로 연다
     *  - N개  → 목록을 보여준다
     *  - 0개  → 빈 상태 (판매자에게 문의 없음)
     * 현재 유저(buyerId/판매자 판단 기준)는 인증에서 가져온다. (지금은 임시 7번)
     */
    @PostMapping("/rooms/enter")
    public ResponseEntity<ApiResponse<List<ChatRoomResponse>>> enterRooms(
            @RequestBody ChatRoomCreateRequest request
    ) {
        // TEMP(테스트): 요청에 buyerId가 오면 그걸 현재 유저로 사용. prod에선 무시하고 getCurrentUserId().
        Long me = request.getBuyerId() != null ? request.getBuyerId() : getCurrentUserId();
        List<ChatRoomResponse> rooms = chatService
                .enterChatRooms(request.getPostId(), me, request.getSellerId())
                .stream()
                .map(ChatRoomResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(rooms));
    }

    @GetMapping("/rooms")
    public ResponseEntity<ApiResponse<Object>> getChatRooms() {
        // TODO: 내 채팅방 목록 구현
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/rooms/{roomId}")
    public ResponseEntity<ApiResponse<Object>> getChatRoom(@PathVariable Long roomId) {
        // TODO: 구현
        return ResponseEntity.ok(ApiResponse.ok(null));
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<ApiResponse<List<ChatMessageResponse>>> getMessages(
            @PathVariable Long roomId,
            @PageableDefault(size = 30) Pageable pageable
    ) {
        // 최근 N개를 시간순(오래된→최신)으로 반환. TODO: 위로 스크롤 시 커서 페이징
        List<ChatMessageResponse> messages = chatService.getMessages(roomId, pageable)
                .stream()
                .map(ChatMessageResponse::from)
                .toList();
        return ResponseEntity.ok(ApiResponse.ok(messages));
    }

    // WebSocket 메시지 핸들러: 받은 메시지를 DB에 저장하고, 저장된 결과를 방 구독자 전원에게 브로드캐스트
    // TODO: 인증된 senderId 사용(현재는 메시지의 senderId 또는 임시 유저), 상대방 알림(/user/{userId}/notification)
    @MessageMapping("/chat/{roomId}")
    @SendTo("/topic/chat/{roomId}")
    public ChatMessageResponse sendMessage(@DestinationVariable Long roomId,
                                           @Payload ChatMessageRequest req) {
        // TEMP: senderId가 실려오면 그걸 사용(테스트), 없으면 임시 현재 유저
        Long senderId = req.getSenderId() != null ? req.getSenderId() : getCurrentUserId();
        ChatMessage saved = chatService.saveMessage(roomId, senderId, req.getContent());
        return ChatMessageResponse.from(saved);
    }


}
