package com.paprika.domain.transaction.repository;

import com.paprika.domain.transaction.entity.Transaction;
import com.paprika.domain.transaction.enums.TransactionStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

    List<Transaction> findByBuyerIdOrSellerIdOrderByCreatedAtDesc(Long buyerId, Long sellerId);

    boolean existsByProductIdAndStatusNot(Long productId, TransactionStatus status);

    Optional<Transaction> findFirstByProductIdAndStatusNotOrderByCreatedAtDesc(Long productId, TransactionStatus status);
}
