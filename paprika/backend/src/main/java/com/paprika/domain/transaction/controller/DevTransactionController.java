package com.paprika.domain.transaction.controller;

import com.paprika.domain.transaction.dto.TransactionResponse;
import com.paprika.domain.transaction.service.TransactionService;
import com.paprika.global.response.ApiResponse;
import com.paprika.global.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * 택배사 API 연동 전 개발/로컬 환경 전용 거래 API.
 * dev, local 프로필에서만 빈으로 등록됩니다.
 */
@RestController
@RequestMapping("/api/transactions")
@Profile({"dev", "local"})
@RequiredArgsConstructor
public class DevTransactionController {

    private final TransactionService transactionService;
    private final CurrentUserProvider currentUserProvider;

    /** 판매자: IN_TRANSIT -> DELIVERED (택배사 배송완료 시뮬레이션) */
    @PatchMapping("/{transactionId}/delivery/dev-delivered")
    public ResponseEntity<ApiResponse<TransactionResponse>> markDevDeliveryDelivered(
            @PathVariable Long transactionId
    ) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        return ResponseEntity.ok(ApiResponse.ok(
                "배송 완료(개발용) 상태로 변경되었습니다.",
                transactionService.markDevDeliveryDelivered(transactionId, currentUserId)
        ));
    }
}
