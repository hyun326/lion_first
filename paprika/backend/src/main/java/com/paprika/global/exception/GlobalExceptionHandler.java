package com.paprika.global.exception;

import com.paprika.global.response.ApiResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(PaprikaException.class)
    public ResponseEntity<ApiResponse<Void>> handlePaprikaException(PaprikaException e) {
        log.warn("PaprikaException: {}", e.getMessage());
        ErrorCode code = e.getErrorCode();
        return ResponseEntity.status(code.getHttpStatus())
                .body(ApiResponse.fail(code.getMessage()));
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<ApiResponse<Void>> handleIllegalStateException(IllegalStateException e) {
        log.warn("IllegalStateException: {}", e.getMessage());
        String message = e.getMessage() != null && !e.getMessage().isBlank()
                ? e.getMessage()
                : ErrorCode.INVALID_TRANSACTION_STATUS.getMessage();
        return ResponseEntity.badRequest().body(ApiResponse.fail(message));
    }

    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ResponseEntity<ApiResponse<Void>> handleOptimisticLockingFailure(
            OptimisticLockingFailureException e
    ) {
        log.warn("OptimisticLockingFailureException: {}", e.getMessage());
        return ResponseEntity.status(ErrorCode.CONCURRENT_TRANSACTION_MODIFICATION.getHttpStatus())
                .body(ApiResponse.fail(ErrorCode.CONCURRENT_TRANSACTION_MODIFICATION.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(error -> error.getField() + ": " + error.getDefaultMessage())
                .findFirst()
                .orElse(ErrorCode.INVALID_INPUT.getMessage());
        return ResponseEntity.badRequest().body(ApiResponse.fail(message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
        log.error("Unhandled exception", e);
        return ResponseEntity.internalServerError()
                .body(ApiResponse.fail(ErrorCode.INTERNAL_SERVER_ERROR.getMessage()));
    }
}
