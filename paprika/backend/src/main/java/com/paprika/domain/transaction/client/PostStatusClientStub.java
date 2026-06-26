package com.paprika.domain.transaction.client;

import org.springframework.stereotype.Component;

/**
 * PostStatusClient 임시 구현 (받는 부분 - 비워둠)
 *
 * ⚠️ 이 클래스의 내용은 post(상품) 담당 팀원이 채운다.
 *    - REST API 호출  또는  PostService 직접 호출 중 택1로 구현
 *    - 구현 완료 후 이 스텁은 교체/삭제 가능
 *
 * 현재는 앱이 정상 기동되도록 아무 동작도 하지 않는 빈 구현이다.
 */
@Component
public class PostStatusClientStub implements PostStatusClient {

    @Override
    public void markReserved(Long postId) {
        // TODO: (post 담당) 상품을 RESERVED(예약중)로 변경 - API 또는 PostService 연동
    }

    @Override
    public void markCompleted(Long postId) {
        // TODO: (post 담당) 상품을 COMPLETED(완료)로 변경 - API 또는 PostService 연동
    }
}
