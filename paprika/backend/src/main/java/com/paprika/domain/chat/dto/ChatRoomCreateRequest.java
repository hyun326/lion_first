package com.paprika.domain.chat.dto;

import lombok.Getter;

/**
 * 채팅방 get-or-create 요청 DTO
 * 담당: C - 한대천
 *
 * buyerId(구매자=나)는 클라이언트가 보내지 않는다. 서버가 인증에서 가져온다.
 */
@Getter
public class ChatRoomCreateRequest {

    private Long postId;
    private Long sellerId;

    // TEMP(테스트용): 현재 유저(나) 강제 지정. prod에선 무시하고 인증값을 쓴다.
    private Long buyerId;
}
