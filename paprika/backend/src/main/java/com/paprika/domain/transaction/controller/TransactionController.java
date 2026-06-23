package com.paprika.domain.transaction.controller;

import com.paprika.domain.transaction.dto.DeliveryInvoiceRequest;
import com.paprika.domain.transaction.service.TransactionService;
import com.paprika.domain.transaction.dto.DeliveryStatusRequest;
import com.paprika.domain.transaction.dto.DirectMeetingRequest;
import com.paprika.domain.transaction.dto.TaxInvoiceResponse;
import com.paprika.domain.transaction.dto.TransactionCompleteRequest;
import com.paprika.domain.transaction.dto.TransactionCreateRequest;
import com.paprika.domain.transaction.dto.TransactionResponse;
import com.paprika.global.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@RequiredArgsConstructor
public class TransactionController {

    private final TransactionService transactionService;

    @PostMapping
    public ResponseEntity<ApiResponse<TransactionResponse>> createTransaction(
            @Valid @RequestBody TransactionCreateRequest request
    ) {
        TransactionResponse response = transactionService.createTransaction(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("거래가 생성되었습니다.", response));
    }

    @GetMapping("/{transactionId}")
    public ResponseEntity<ApiResponse<TransactionResponse>> getTransaction(@PathVariable Long transactionId) {
        return ResponseEntity.ok(ApiResponse.ok(transactionService.getTransaction(transactionId)));
    }

    @GetMapping("/my")
    public ResponseEntity<ApiResponse<List<TransactionResponse>>> getMyTransactions() {
        return ResponseEntity.ok(ApiResponse.ok(transactionService.getMyTransactions()));
    }

    @GetMapping("/{transactionId}/tax-invoice")
    public ResponseEntity<ApiResponse<TaxInvoiceResponse>> getTaxInvoice(@PathVariable Long transactionId) {
        return ResponseEntity.ok(ApiResponse.ok(transactionService.getTaxInvoice(transactionId)));
    }

    @PatchMapping("/{transactionId}/direct-meeting")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateDirectMeeting(
            @PathVariable Long transactionId,
            @Valid @RequestBody DirectMeetingRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "직거래 약속 정보가 저장되었습니다.",
                transactionService.updateDirectMeeting(transactionId, request)
        ));
    }

    @PatchMapping("/{transactionId}/direct-complete")
    public ResponseEntity<ApiResponse<TransactionResponse>> confirmDirectComplete(
            @PathVariable Long transactionId,
            @Valid @RequestBody(required = false) TransactionCompleteRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "직거래 완료 확인이 반영되었습니다.",
                transactionService.confirmDirectComplete(transactionId, request != null ? request : new TransactionCompleteRequest())
        ));
    }

    @PatchMapping("/{transactionId}/delivery/invoice")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateDeliveryInvoice(
            @PathVariable Long transactionId,
            @Valid @RequestBody DeliveryInvoiceRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "운송장 정보가 저장되었습니다.",
                transactionService.updateDeliveryInvoice(transactionId, request)
        ));
    }

    @PatchMapping("/{transactionId}/delivery/status")
    public ResponseEntity<ApiResponse<TransactionResponse>> updateDeliveryStatus(
            @PathVariable Long transactionId,
            @Valid @RequestBody DeliveryStatusRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "배송 상태가 변경되었습니다.",
                transactionService.updateDeliveryStatus(transactionId, request)
        ));
    }

    @PatchMapping("/{transactionId}/delivery/receive")
    public ResponseEntity<ApiResponse<TransactionResponse>> confirmDeliveryReceive(
            @PathVariable Long transactionId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(
                "수령 확인이 완료되었습니다.",
                transactionService.confirmDeliveryReceive(transactionId)
        ));
    }
}
