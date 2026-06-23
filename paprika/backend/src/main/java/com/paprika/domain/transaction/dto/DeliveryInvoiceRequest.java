package com.paprika.domain.transaction.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;

@Getter
public class DeliveryInvoiceRequest {

    @NotBlank(message = "택배사는 필수입니다.")
    private String courierCompany;

    @NotBlank(message = "운송장 번호는 필수입니다.")
    private String trackingNumber;
}
