'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import DirectMeetingForm from '@/components/transaction/DirectMeetingForm';
import TaxInvoiceCard from '@/components/transaction/TaxInvoiceCard';
import TransactionStatusBadge, { TransactionTypeBadge } from '@/components/transaction/TransactionStatusBadge';
import { getCurrentUserId } from '@/lib/auth';
import { getApiErrorMessage } from '@/lib/apiError';
import {
  acceptDirectMeeting,
  cancelTransaction,
  confirmDirectComplete,
  getTransaction,
  rejectDirectMeeting,
  updateDirectMeeting,
} from '@/lib/transactionApi';
import type { TransactionResponse } from '@/types/transaction';
import { getPaymentMethodLabel, getTaxInvoiceStatusLabel } from '@/types/transaction';
import styles from './TransactionDetail.module.css';

interface TransactionDetailProps {
  transactionId: number;
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('ko-KR');
}

export default function TransactionDetail({ transactionId }: TransactionDetailProps) {
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showMeetingForm, setShowMeetingForm] = useState(false);

  const currentUserId = getCurrentUserId();

  const loadTransaction = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransaction(transactionId);
      setTransaction(data);
    } catch (err) {
      setError(getApiErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }, [transactionId]);

  useEffect(() => {
    loadTransaction();
  }, [loadTransaction]);

  const runAction = async (action: () => Promise<TransactionResponse>) => {
    setActionLoading(true);
    setActionError(null);
    try {
      const updated = await action();
      setTransaction(updated);
      setShowMeetingForm(false);
    } catch (err) {
      const message = getApiErrorMessage(err);
      setActionError(message);
      throw new Error(message);
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.loading}>거래 정보를 불러오는 중...</div>;
  }

  if (error || !transaction) {
    return (
      <div className={styles.errorPage}>
        <p>{error ?? '거래를 찾을 수 없습니다.'}</p>
        <Link href="/transactions" className={styles.backLink}>거래 목록으로</Link>
      </div>
    );
  }

  const isBuyer = currentUserId === transaction.buyerId;
  const isSeller = currentUserId === transaction.sellerId;
  const isParticipant = isBuyer || isSeller;
  const isCompleted = transaction.completed || transaction.status === 'COMPLETED';
  const isCancelled = transaction.status === 'CANCELLED';
  const isActive = !isCompleted && !isCancelled;
  const isProposed = transaction.status === 'MEETING_PROPOSED';

  const canSetMeeting =
    isSeller &&
    isActive &&
    (transaction.status === 'REQUESTED' ||
      transaction.status === 'MEETING_PROPOSED' ||
      transaction.status === 'MEETING_SET');

  const canRespondMeeting = isBuyer && isActive && isProposed;

  const canDirectComplete =
    isActive &&
    (transaction.status === 'MEETING_SET' || transaction.status === 'MEETING_COMPLETED') &&
    ((isBuyer && !transaction.buyerCompleteConfirmed) ||
      (isSeller && !transaction.sellerCompleteConfirmed));

  const canCancel =
    isParticipant &&
    isActive &&
    (transaction.transactionType === 'DIRECT'
      ? transaction.status !== 'COMPLETED'
      : transaction.status === 'REQUESTED' || transaction.status === 'PREPARING');

  const waitingForCounterpartDirect =
    transaction.transactionType === 'DIRECT' &&
    transaction.status === 'MEETING_COMPLETED' &&
    ((isBuyer && transaction.buyerCompleteConfirmed && !transaction.sellerCompleteConfirmed) ||
      (isSeller && transaction.sellerCompleteConfirmed && !transaction.buyerCompleteConfirmed));

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>거래 상세</h1>
        <Link href="/transactions" className={styles.backLink}>목록으로</Link>
      </div>

      <section className={styles.card}>
        <div className={styles.badges}>
          <TransactionTypeBadge transactionType={transaction.transactionType} />
          <TransactionStatusBadge status={transaction.status} />
        </div>

        <p className={styles.amount}>{(transaction.totalAmount ?? transaction.amount).toLocaleString()}원</p>

        <div className={styles.feeBreakdown}>
          <div className={styles.feeRow}>
            <span>상품 금액</span>
            <span>{transaction.amount.toLocaleString()}원</span>
          </div>
          <div className={styles.feeRow}>
            <span>결제 수수료 (5%)</span>
            <span>+{(transaction.feeAmount ?? 0).toLocaleString()}원</span>
          </div>
          <div className={styles.feeTotalRow}>
            <span>총 결제 금액</span>
            <span>{(transaction.totalAmount ?? transaction.amount).toLocaleString()}원</span>
          </div>
        </div>

        <div className={styles.infoGrid}>
          <span>거래 ID: {transaction.id}</span>
          <span>상품 ID: {transaction.productId}</span>
          <span>결제 수단: {getPaymentMethodLabel(transaction.paymentMethod ?? 'CASH')}</span>
          <span>세금계산서: {getTaxInvoiceStatusLabel(transaction.taxInvoiceStatus ?? 'NOT_REQUESTED')}</span>
          <span>구매자 ID: {transaction.buyerId}</span>
          <span>판매자 ID: {transaction.sellerId}</span>
          <span>상대방 ID: {transaction.counterpartId ?? '-'}</span>
          <span>내 역할: {isBuyer ? '구매자' : isSeller ? '판매자' : '참여자 아님'}</span>
        </div>

        {isCompleted && (
          <div className={styles.successNotice}>거래가 완료되었습니다.</div>
        )}

        {isCancelled && (
          <div className={styles.cancelNotice}>취소된 거래입니다.</div>
        )}

        {isParticipant && (
          <Link href="/chat" className={styles.contactBtn}>
            연락하기
          </Link>
        )}

        {canCancel && (
          <button
            type="button"
            className={styles.cancelBtn}
            onClick={() => {
              if (window.confirm('정말 거래를 취소하시겠습니까?')) {
                runAction(() => cancelTransaction(transaction.id));
              }
            }}
            disabled={actionLoading}
          >
            거래 취소
          </button>
        )}

        {actionError && <p className={styles.error}>{actionError}</p>}
      </section>

      {transaction.taxInvoiceStatus && transaction.taxInvoiceStatus !== 'NOT_REQUESTED' && (
        <TaxInvoiceCard
          invoice={{
            transactionId: transaction.id,
            status: transaction.taxInvoiceStatus,
            invoiceNumber: transaction.taxInvoiceNumber,
            issuedAt: transaction.taxInvoiceIssuedAt,
            companyName: transaction.taxInvoiceCompanyName,
            businessNumber: transaction.taxInvoiceBusinessNumber,
            email: transaction.taxInvoiceEmail,
            supplyAmount: transaction.taxInvoiceSupplyAmount,
            vatAmount: transaction.taxInvoiceVatAmount,
            totalAmount: transaction.amount,
            paymentMethod: transaction.paymentMethod ?? 'CASH',
          }}
        />
      )}

      {transaction.transactionType === 'DIRECT' && (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>직거래</h2>

          {transaction.meetingPlaceName && (
            <div className={styles.meetingInfo}>
              <span>장소: {transaction.meetingPlaceName}</span>
              <span>주소: {transaction.meetingAddress}</span>
              <span>좌표: {transaction.latitude}, {transaction.longitude}</span>
              <span>약속: {formatDateTime(transaction.meetingAt)}</span>
            </div>
          )}

          {isProposed && (
            <div className={styles.notice}>
              {isBuyer
                ? '판매자가 약속을 제안했습니다. 수락 또는 거절해주세요.'
                : '구매자의 약속 수락을 기다리고 있습니다.'}
            </div>
          )}

          {canRespondMeeting && (
            <div className={styles.responseRow}>
              <button
                type="button"
                className={styles.actionBtn}
                onClick={() => runAction(() => acceptDirectMeeting(transaction.id))}
                disabled={actionLoading}
              >
                {actionLoading ? '처리 중...' : '약속 수락'}
              </button>
              <button
                type="button"
                className={styles.rejectBtn}
                onClick={() => runAction(() => rejectDirectMeeting(transaction.id))}
                disabled={actionLoading}
              >
                약속 거절
              </button>
            </div>
          )}

          {waitingForCounterpartDirect && (
            <div className={styles.notice}>상대방 확인 대기 중입니다.</div>
          )}

          {canSetMeeting && !showMeetingForm && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => setShowMeetingForm(true)}
              disabled={actionLoading}
            >
              {transaction.meetingPlaceName ? '약속 다시 제안' : '약속 장소 제안'}
            </button>
          )}

          {canSetMeeting && showMeetingForm && (
            <DirectMeetingForm
              onSubmit={async (payload) => {
                await runAction(() => updateDirectMeeting(transaction.id, payload));
              }}
            />
          )}

          {canDirectComplete && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => runAction(() => confirmDirectComplete(transaction.id))}
              disabled={actionLoading}
            >
              {actionLoading ? '처리 중...' : '거래 완료 확인'}
            </button>
          )}
        </section>
      )}

      {transaction.transactionType === 'DELIVERY' && (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>택배 거래</h2>
          <p className={styles.cardDesc}>
            운송장 입력과 배송 상태 변경은 택배 배송 페이지에서 진행합니다.
          </p>
          <Link href={`/transactions/${transaction.id}/delivery`} className={styles.actionBtn} style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
            택배 배송 관리로 이동
          </Link>
        </section>
      )}
    </div>
  );
}
