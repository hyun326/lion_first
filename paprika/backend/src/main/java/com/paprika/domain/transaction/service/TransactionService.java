package com.paprika.domain.transaction.service;

import com.paprika.domain.product.entity.Product;
import com.paprika.domain.product.repository.ProductRepository;
import com.paprika.domain.transaction.dto.DeliveryInvoiceRequest;
import com.paprika.domain.transaction.entity.Transaction;
import com.paprika.domain.transaction.repository.TransactionRepository;
import com.paprika.domain.transaction.dto.DeliveryStatusRequest;
import com.paprika.domain.transaction.dto.DirectMeetingRequest;
import com.paprika.domain.transaction.dto.TaxInvoiceResponse;
import com.paprika.domain.transaction.dto.TransactionCompleteRequest;
import com.paprika.domain.transaction.dto.TransactionCreateRequest;
import com.paprika.domain.transaction.dto.TransactionResponse;
import com.paprika.domain.transaction.enums.DeliveryStatus;
import com.paprika.domain.transaction.enums.PaymentMethod;
import com.paprika.domain.transaction.enums.TaxInvoiceStatus;
import com.paprika.domain.transaction.enums.TransactionStatus;
import com.paprika.global.exception.ErrorCode;
import com.paprika.global.exception.PaprikaException;
import com.paprika.global.security.CurrentUserProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.EnumSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TransactionService {

    private static final Set<DeliveryStatus> SELLER_DELIVERY_STATUSES = EnumSet.of(
            DeliveryStatus.PREPARING,
            DeliveryStatus.SHIPPED,
            DeliveryStatus.IN_TRANSIT
    );

    private final TransactionRepository transactionRepository;
    private final ProductRepository productRepository;
    private final CurrentUserProvider currentUserProvider;

    @Transactional
    public TransactionResponse createTransaction(TransactionCreateRequest request) {
        Long buyerId = currentUserProvider.getCurrentUserId();

        if (buyerId.equals(request.getSellerId())) {
            throw new PaprikaException(ErrorCode.INVALID_INPUT);
        }

        boolean taxInvoiceRequested = isTaxInvoiceRequested(request);

        Optional<Transaction> existingTransaction = transactionRepository.findFirstByProductIdAndStatusNotInOrderByCreatedAtDesc(
                request.getProductId(),
                EnumSet.of(TransactionStatus.COMPLETED, TransactionStatus.CANCELLED)
        );
        if (existingTransaction.isPresent()) {
            Transaction transaction = existingTransaction.get();
            if (transaction.getBuyerId().equals(buyerId) && transaction.getStatus() == TransactionStatus.REQUESTED) {
                transaction.reviseRequestedTransaction(
                        request.getTransactionType(),
                        request.getAmount(),
                        request.getPaymentMethod(),
                        taxInvoiceRequested,
                        request.getTaxInvoiceCompanyName(),
                        request.getTaxInvoiceBusinessNumber(),
                        request.getTaxInvoiceEmail()
                );
                return TransactionResponse.from(transaction, buyerId);
            }
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        Transaction transaction = Transaction.create(
                request.getProductId(),
                buyerId,
                request.getSellerId(),
                request.getTransactionType(),
                request.getAmount(),
                request.getPaymentMethod(),
                taxInvoiceRequested,
                request.getTaxInvoiceCompanyName(),
                request.getTaxInvoiceBusinessNumber(),
                request.getTaxInvoiceEmail()
        );

        return TransactionResponse.from(transactionRepository.save(transaction), buyerId);
    }

    public TaxInvoiceResponse getTaxInvoice(Long transactionId) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);
        if (transaction.getTaxInvoiceStatus() == TaxInvoiceStatus.NOT_REQUESTED) {
            throw new PaprikaException(ErrorCode.INVALID_INPUT);
        }
        return TaxInvoiceResponse.from(transaction);
    }

    public TransactionResponse getTransaction(Long transactionId) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);
        return TransactionResponse.from(transaction, currentUserId);
    }

    public List<TransactionResponse> getMyTransactions() {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        return transactionRepository.findByBuyerIdOrSellerIdOrderByCreatedAtDesc(currentUserId, currentUserId)
                .stream()
                .map(transaction -> TransactionResponse.from(transaction, currentUserId))
                .toList();
    }

    @Transactional
    public TransactionResponse updateDirectMeeting(Long transactionId, DirectMeetingRequest request) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);

        validateActive(transaction);
        validateDirectTransaction(transaction);
        validateSellerOnly(transaction, currentUserId);

        TransactionStatus status = transaction.getStatus();
        if (status != TransactionStatus.REQUESTED
                && status != TransactionStatus.MEETING_PROPOSED
                && status != TransactionStatus.MEETING_SET) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        transaction.proposeDirectMeeting(
                request.getMeetingPlaceName(),
                request.getMeetingAddress(),
                request.getLatitude(),
                request.getLongitude(),
                request.getMeetingAt()
        );

        return TransactionResponse.from(transaction, currentUserId);
    }

    @Transactional
    public TransactionResponse acceptDirectMeeting(Long transactionId) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);

        validateActive(transaction);
        validateDirectTransaction(transaction);

        if (!transaction.isBuyer(currentUserId)) {
            throw new PaprikaException(ErrorCode.TRANSACTION_ACCESS_DENIED);
        }

        try {
            transaction.acceptDirectMeeting(currentUserId);
        } catch (IllegalStateException e) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        reserveProduct(transaction);

        return TransactionResponse.from(transaction, currentUserId);
    }

    @Transactional
    public TransactionResponse rejectDirectMeeting(Long transactionId) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);

        validateActive(transaction);
        validateDirectTransaction(transaction);

        if (!transaction.isBuyer(currentUserId)) {
            throw new PaprikaException(ErrorCode.TRANSACTION_ACCESS_DENIED);
        }

        try {
            transaction.rejectDirectMeeting(currentUserId);
        } catch (IllegalStateException e) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        return TransactionResponse.from(transaction, currentUserId);
    }

    @Transactional
    public TransactionResponse cancelTransaction(Long transactionId) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);

        try {
            transaction.cancel(currentUserId);
        } catch (IllegalStateException e) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        releaseProduct(transaction);

        return TransactionResponse.from(transaction, currentUserId);
    }

    @Transactional
    public TransactionResponse confirmDirectComplete(Long transactionId, TransactionCompleteRequest request) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);

        validateActive(transaction);
        validateDirectTransaction(transaction);

        if (transaction.getStatus() != TransactionStatus.MEETING_SET
                && transaction.getStatus() != TransactionStatus.MEETING_COMPLETED) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        if (transaction.isBuyer(currentUserId) && transaction.isBuyerCompleteConfirmed()) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }
        if (transaction.isSeller(currentUserId) && transaction.isSellerCompleteConfirmed()) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        try {
            transaction.confirmDirectComplete(currentUserId);
        } catch (IllegalStateException e) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        if (transaction.isCompleted()) {
            markProductSold(transaction);
        }

        return TransactionResponse.from(transaction, currentUserId);
    }

    @Transactional
    public TransactionResponse updateDeliveryInvoice(Long transactionId, DeliveryInvoiceRequest request) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);

        validateActive(transaction);
        validateDeliveryTransaction(transaction);
        validateInvoiceRegistration(transaction, currentUserId);

        transaction.updateDeliveryInvoice(request.getCourierCompany(), request.getTrackingNumber());

        return TransactionResponse.from(transaction, currentUserId);
    }

    @Transactional
    public TransactionResponse updateDeliveryStatus(Long transactionId, DeliveryStatusRequest request) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);

        validateActive(transaction);
        validateDeliveryTransaction(transaction);
        validateSellerOnly(transaction, currentUserId);

        DeliveryStatus nextStatus = request.getStatus();
        if (!SELLER_DELIVERY_STATUSES.contains(nextStatus)) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        validateDeliveryStatusTransition(transaction, nextStatus);

        if (nextStatus == DeliveryStatus.SHIPPED && !transaction.hasTrackingNumber()) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        transaction.changeDeliveryStatus(nextStatus);

        return TransactionResponse.from(transaction, currentUserId);
    }

    /**
     * 택배사 API 연동 전 개발용: 판매자가 IN_TRANSIT -> DELIVERED 처리.
     * dev/local 프로필에서만 DevTransactionController를 통해 노출됩니다.
     */
    @Transactional
    public TransactionResponse markDevDeliveryDelivered(Long transactionId, Long currentUserId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new PaprikaException(ErrorCode.TRANSACTION_NOT_FOUND));

        validateActive(transaction);
        validateDeliveryTransaction(transaction);

        if (!transaction.isSeller(currentUserId)) {
            throw new PaprikaException(ErrorCode.TRANSACTION_ACCESS_DENIED);
        }

        if (transaction.getStatus() != TransactionStatus.IN_TRANSIT
                || transaction.getDeliveryStatus() != DeliveryStatus.IN_TRANSIT) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        try {
            transaction.markDeliveryDelivered();
        } catch (IllegalStateException e) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        return TransactionResponse.from(transaction, currentUserId);
    }

    @Transactional
    public TransactionResponse confirmDeliveryReceive(Long transactionId) {
        Long currentUserId = currentUserProvider.getCurrentUserId();
        Transaction transaction = findTransactionWithAccess(transactionId, currentUserId);

        validateActive(transaction);
        validateDeliveryTransaction(transaction);

        if (!transaction.isBuyer(currentUserId)) {
            throw new PaprikaException(ErrorCode.TRANSACTION_ACCESS_DENIED);
        }

        if (transaction.getDeliveryStatus() != DeliveryStatus.DELIVERED
                || transaction.getStatus() != TransactionStatus.DELIVERED) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        try {
            transaction.confirmDeliveryReceive();
        } catch (IllegalStateException e) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }

        if (transaction.isCompleted()) {
            markProductSold(transaction);
        }

        return TransactionResponse.from(transaction, currentUserId);
    }

    private Transaction findTransactionWithAccess(Long transactionId, Long currentUserId) {
        Transaction transaction = transactionRepository.findById(transactionId)
                .orElseThrow(() -> new PaprikaException(ErrorCode.TRANSACTION_NOT_FOUND));

        if (!transaction.isParticipant(currentUserId)) {
            throw new PaprikaException(ErrorCode.TRANSACTION_ACCESS_DENIED);
        }

        return transaction;
    }

    private void validateActive(Transaction transaction) {
        if (!transaction.isActive()) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }
    }

    private void markProductSold(Transaction transaction) {
        productRepository.findById(transaction.getProductId())
                .ifPresent(Product::markAsSold);
    }

    private void reserveProduct(Transaction transaction) {
        productRepository.findById(transaction.getProductId())
                .ifPresent(Product::markAsReserved);
    }

    private void releaseProduct(Transaction transaction) {
        productRepository.findById(transaction.getProductId())
                .ifPresent(Product::restoreToSelling);
    }

    private void validateDirectTransaction(Transaction transaction) {
        if (!transaction.isDirect()) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }
    }

    private void validateDeliveryTransaction(Transaction transaction) {
        if (!transaction.isDelivery()) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }
    }

    private void validateSellerOnly(Transaction transaction, Long currentUserId) {
        if (!transaction.isSeller(currentUserId)) {
            throw new PaprikaException(ErrorCode.TRANSACTION_ACCESS_DENIED);
        }
    }

    /** 운송장 등록: 거래 참여자(구매자·판매자)가 REQUESTED 상태에서 등록 가능 */
    private void validateInvoiceRegistration(Transaction transaction, Long currentUserId) {
        if (!transaction.isParticipant(currentUserId)) {
            throw new PaprikaException(ErrorCode.TRANSACTION_ACCESS_DENIED);
        }
        if (transaction.getStatus() != TransactionStatus.REQUESTED) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }
    }

    private void validateDeliveryStatusTransition(Transaction transaction, DeliveryStatus nextStatus) {
        TransactionStatus currentStatus = transaction.getStatus();

        boolean valid = switch (nextStatus) {
            case PREPARING -> currentStatus == TransactionStatus.REQUESTED;
            case SHIPPED -> currentStatus == TransactionStatus.PREPARING;
            case IN_TRANSIT -> currentStatus == TransactionStatus.SHIPPED;
            case DELIVERED -> false;
        };

        if (!valid) {
            throw new PaprikaException(ErrorCode.INVALID_TRANSACTION_STATUS);
        }
    }

    private boolean isTaxInvoiceRequested(TransactionCreateRequest request) {
        if (request.getPaymentMethod() != PaymentMethod.CASH) {
            return false;
        }
        return request.isTaxInvoiceRequested();
    }
}
