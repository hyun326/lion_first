package com.paprika.domain.transaction.client;

import org.springframework.stereotype.Component;

import java.math.BigDecimal;

/**
 * PostQueryClient 임시 구현 (post 도메인 완성 전 더미 데이터)
 *
 *    - REST API 호출  또는  PostService 직접 호출 중 택1로 구현
 *    - 구현 완료 후 이 스텁은 교체/삭제 가능
 *
 * 현재는 거래 화면 흐름 확인용으로 더미 상품 정보를 반환한다.
 */
@Component
public class PostQueryClientStub implements PostQueryClient {

    @Override
    public PostInfo getPostInfo(Long postId) {
        // post 도메인 연동 전까지 거래 화면 흐름 확인용 더미 데이터
        return new PostInfo(
                postId,
                "테스트 상품",
                new BigDecimal("10000"),
                1L,        // 판매자(=상품 작성자 user_id) 더미
                "SELLING"  // 판매중
        );
    }
}
