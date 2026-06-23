package com.paprika.domain.transaction.dto;

import com.paprika.domain.transaction.enums.DeliveryStatus;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class DeliveryStatusRequest {

    @NotNull(message = "배송 상태는 필수입니다.")
    private DeliveryStatus status;
}
