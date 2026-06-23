package com.paprika.domain.transaction.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class DirectMeetingRequest {

    @NotBlank(message = "장소명은 필수입니다.")
    private String meetingPlaceName;

    @NotBlank(message = "주소는 필수입니다.")
    private String meetingAddress;

    @NotNull(message = "위도는 필수입니다.")
    private Double latitude;

    @NotNull(message = "경도는 필수입니다.")
    private Double longitude;

    @NotNull(message = "약속 시간은 필수입니다.")
    private LocalDateTime meetingAt;
}
