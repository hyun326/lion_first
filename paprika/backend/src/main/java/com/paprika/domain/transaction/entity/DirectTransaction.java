package com.paprika.domain.transaction.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

/**
 * 직거래 상세 엔티티 (하위, transactions 와 1:1)
 * 담당: D - 이동준
 *
 * PK(transactionId)가 곧 상위 Transaction.id 이며 FK 역할도 한다.
 */
@Entity
@Table(name = "direct_transactions")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@EntityListeners(AuditingEntityListener.class)
public class DirectTransaction {

    @Id
    private Long transactionId; // 상위 Transaction.id 와 공유하는 PK(=FK)

    private String meetingLocation; // 직거래 장소 (약속 전 null 가능)

    private Double meetingLatitude;  // 약속 장소 위도 (지도)

    private Double meetingLongitude; // 약속 장소 경도 (지도)

    private LocalDateTime meetingTime; // 약속 일시 (약속 전 null 가능)

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private DirectStatus directStatus = DirectStatus.PENDING;

    @CreatedDate
    private LocalDateTime createdAt;

    @Builder
    private DirectTransaction(Long transactionId, String meetingLocation,
                             Double meetingLatitude, Double meetingLongitude,
                             LocalDateTime meetingTime) {
        this.transactionId = transactionId;
        this.meetingLocation = meetingLocation;
        this.meetingLatitude = meetingLatitude;
        this.meetingLongitude = meetingLongitude;
        this.meetingTime = meetingTime;
        this.directStatus = DirectStatus.PENDING;
    }

    /** 약속 장소/시간 확정 */
    public void confirmMeeting(String location, Double latitude, Double longitude, LocalDateTime time) {
        this.meetingLocation = location;
        this.meetingLatitude = latitude;
        this.meetingLongitude = longitude;
        this.meetingTime = time;
        this.directStatus = DirectStatus.CONFIRMED;
    }

    public void complete() {
        this.directStatus = DirectStatus.COMPLETED;
    }

    public void cancel() {
        this.directStatus = DirectStatus.CANCELED;
    }

    public enum DirectStatus {
        PENDING,    // 약속 미확정
        CONFIRMED,  // 약속 장소/시간 확정
        COMPLETED,  // 직거래 완료
        CANCELED    // 약속 취소
    }
}
