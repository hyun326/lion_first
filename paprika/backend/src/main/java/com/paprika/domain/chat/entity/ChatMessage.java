package com.paprika.domain.chat.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 채팅 메시지 엔티티
 * 담당: C - 한대천
 */
@Entity
@Table(name = "chat_messages")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "room_id", nullable = false)
    private Long chatRoomId; // TODO: ChatRoom과 @ManyToOne

    @Column(nullable = false)
    private Long senderId;   // TODO: User와 @ManyToOne

    @Column(columnDefinition = "TEXT")
    private String content;

    @CreatedDate
    private LocalDateTime createdAt;

    /** 새 메시지 생성용 정적 팩토리 (방 + 보낸사람 + 내용) */
    public static ChatMessage create(Long chatRoomId, Long senderId, String content) {
        ChatMessage message = new ChatMessage();
        message.chatRoomId = chatRoomId;
        message.senderId = senderId;
        message.content = content;
        return message;
    }
}
