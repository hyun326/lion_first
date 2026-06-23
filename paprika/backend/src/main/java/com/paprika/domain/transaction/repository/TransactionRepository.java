package com.paprika.domain.transaction.repository;

import com.paprika.domain.transaction.entity.Transaction;
import com.paprika.domain.transaction.enums.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByBuyerIdOrSellerIdOrderByCreatedAtDesc(Long buyerId, Long sellerId);

    boolean existsByProductIdAndStatusNot(Long productId, TransactionStatus status);

    Optional<Transaction> findFirstByProductIdAndStatusNotOrderByCreatedAtDesc(Long productId, TransactionStatus status);

    /** 종료(완료·취소)되지 않은 진행 중 거래를 최신순으로 조회 */
    Optional<Transaction> findFirstByProductIdAndStatusNotInOrderByCreatedAtDesc(
            Long productId, Collection<TransactionStatus> statuses);
}
