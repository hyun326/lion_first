'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import DeliveryInvoiceForm from '@/components/transaction/DeliveryInvoiceForm';
import DeliveryTrackingLookupForm from '@/components/transaction/DeliveryTrackingLookupForm';
import TransactionStatusBadge, { TransactionTypeBadge } from '@/components/transaction/TransactionStatusBadge';
import { getCurrentUserId } from '@/lib/auth';
import { getApiErrorMessage } from '@/lib/apiError';
import {
  DELIVERY_PROGRESS,
  getCurrentProgress,
  getProgressIndex,
} from '@/lib/deliveryTracking';
import { isDevOrLocalEnv } from '@/lib/env';
import {
  confirmDeliveryReceive,
  getTransaction,
  markDevDeliveryDelivered,
  updateDeliveryInvoice,
  updateDeliveryStatus,
} from '@/lib/transactionApi';
import type { DeliveryStatus, TransactionResponse } from '@/types/transaction';
import styles from './DeliveryTransactionFlow.module.css';

interface DeliveryTransactionFlowProps {
  transactionId: number;
}

type FlowStep = 'invoice' | 'status';

function getFlowStep(transaction: TransactionResponse): FlowStep {
  if (
    transaction.status === 'REQUESTED' &&
    !transaction.trackingNumber &&
    !transaction.courierCompany
  ) {
    return 'invoice';
  }
  return 'status';
}

export default function DeliveryTransactionFlow({ transactionId }: DeliveryTransactionFlowProps) {
  const [transaction, setTransaction] = useState<TransactionResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [step, setStep] = useState<FlowStep>('invoice');
  const [lookupError, setLookupError] = useState<string | null>(null);

  const currentUserId = getCurrentUserId();

  const loadTransaction = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTransaction(transactionId);
      setTransaction(data);
      setStep(getFlowStep(data));
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
      setStep(getFlowStep(updated));
    } catch (err) {
      setActionError(getApiErrorMessage(err));
    } finally {
      setActionLoading(false);
    }
  };

  const currentProgress = useMemo(
    () => (transaction ? getCurrentProgress(transaction.status) : null),
    [transaction]
  );

  const currentIndex = useMemo(
    () => (transaction ? getProgressIndex(transaction.status) : -1),
    [transaction]
  );

  if (loading) {
    return <div className={styles.loading}>택배 거래 정보를 불러오는 중...</div>;
  }

  if (error || !transaction) {
    return (
      <div className={styles.errorPage}>
        <p>{error ?? '거래를 찾을 수 없습니다.'}</p>
        <Link href="/transactions" className={styles.backLink}>
          거래 목록으로
        </Link>
      </div>
    );
  }

  if (transaction.transactionType !== 'DELIVERY') {
    return (
      <div className={styles.errorPage}>
        <p>택배 거래가 아닙니다.</p>
        <Link href={`/transactions/${transaction.id}`} className={styles.backLink}>
          거래 상세로
        </Link>
      </div>
    );
  }

  const isBuyer = currentUserId === transaction.buyerId;
  const isSeller = currentUserId === transaction.sellerId;
  const isCompleted = transaction.completed || transaction.status === 'COMPLETED';

  const canRegisterInvoice =
    (isBuyer || isSeller) && !isCompleted && step === 'invoice' && !transaction.trackingNumber;
  const canLookupTracking =
    (isBuyer || isSeller) && !isCompleted && step === 'invoice' && !!transaction.trackingNumber;
  const canMarkPreparing =
    isSeller && !isCompleted && transaction.status === 'REQUESTED' && !!transaction.trackingNumber;
  const canMarkShipped = isSeller && !isCompleted && transaction.status === 'PREPARING';
  const canMarkInTransit = isSeller && !isCompleted && transaction.status === 'SHIPPED';
  const canDevDelivered =
    isDevOrLocalEnv() &&
    isSeller &&
    !isCompleted &&
    transaction.status === 'IN_TRANSIT' &&
    transaction.deliveryStatus === 'IN_TRANSIT';
  const canReceive =
    isBuyer &&
    !isCompleted &&
    transaction.status === 'DELIVERED' &&
    transaction.deliveryStatus === 'DELIVERED';

  const handleBuyerLookup = (inputTracking: string) => {
    setLookupError(null);
    if (!transaction.trackingNumber) {
      setLookupError('아직 운송장이 등록되지 않았습니다. 판매자 등록을 기다려주세요.');
      return;
    }
    if (inputTracking !== transaction.trackingNumber) {
      setLookupError('운송장 번호가 일치하지 않습니다.');
      return;
    }
    setStep('status');
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>택배 배송</h1>
        <Link href={`/transactions/${transaction.id}`} className={styles.backLink}>
          거래 상세
        </Link>
      </div>

      <div className={styles.stepBar}>
        <div
          className={`${styles.step} ${step === 'invoice' ? styles.stepActive : styles.stepDone}`}
        >
          1. 운송장 입력
        </div>
        <div className={`${styles.step} ${step === 'status' ? styles.stepActive : ''}`}>
          2. 배송 상태
        </div>
      </div>

      <section className={styles.card}>
        <div className={styles.badges}>
          <TransactionTypeBadge transactionType={transaction.transactionType} />
          <TransactionStatusBadge status={transaction.status} />
        </div>

        <div className={styles.infoBox}>
          <span>거래 ID: {transaction.id}</span>
          <span>상품 ID: {transaction.productId}</span>
          <span>거래 금액: {transaction.amount.toLocaleString()}원</span>
          <span>내 역할: {isBuyer ? '구매자' : isSeller ? '판매자' : '참여자 아님'}</span>
        </div>

        {isCompleted && (
          <div className={styles.successNotice}>택배 거래가 완료되었습니다.</div>
        )}

        {actionError && <p className={styles.error}>{actionError}</p>}
      </section>

      {step === 'invoice' && (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>운송장 번호 입력</h2>
          <p className={styles.cardDesc}>
            운송장 번호를 발급받아 입력하면 배송 상태 화면으로 이동합니다.
          </p>

          {canRegisterInvoice && (
            <DeliveryInvoiceForm
              submitLabel="운송장 등록 후 배송 상태로 이동"
              onSubmit={async (payload) => {
                await runAction(() => updateDeliveryInvoice(transaction.id, payload));
              }}
            />
          )}

          {canLookupTracking && (
            <>
              <DeliveryTrackingLookupForm
                courierCompany={transaction.courierCompany}
                onSubmit={handleBuyerLookup}
              />
              {lookupError && <p className={styles.error}>{lookupError}</p>}
            </>
          )}

          {!canRegisterInvoice && !canLookupTracking && !isBuyer && !isSeller && (
            <div className={styles.notice}>거래 참여자만 운송장을 등록하거나 조회할 수 있습니다.</div>
          )}
        </section>
      )}

      {step === 'status' && (
        <section className={styles.card}>
          <h2 className={styles.cardTitle}>배송 상태</h2>

          {(transaction.courierCompany || transaction.trackingNumber) && (
            <div className={styles.infoBox}>
              <span>택배사: {transaction.courierCompany ?? '-'}</span>
              <span>운송장 번호: {transaction.trackingNumber ?? '-'}</span>
            </div>
          )}

          {currentProgress && (
            <div className={styles.currentStatus}>
              <span className={styles.currentLabel}>현재 위치</span>
              <strong className={styles.currentValue}>{currentProgress.location}</strong>
              <span className={styles.currentStep}>{currentProgress.label}</span>
            </div>
          )}

          <div className={styles.timeline}>
            {DELIVERY_PROGRESS.map((item, index) => {
              const isDone = currentIndex > index;
              const isCurrent = currentIndex === index;

              return (
                <div
                  key={item.status}
                  className={[
                    styles.timelineItem,
                    isCurrent ? styles.timelineItemCurrent : '',
                    isDone ? styles.timelineItemDone : '',
                  ].join(' ')}
                >
                  <span
                    className={[
                      styles.dot,
                      isCurrent ? styles.dotCurrent : '',
                      isDone ? styles.dotDone : '',
                    ].join(' ')}
                  />
                  <div className={styles.timelineContent}>
                    <span className={styles.timelineLabel}>{item.label}</span>
                    <span className={styles.timelineLocation}>{item.location}</span>
                  </div>
                  {isCurrent && <span className={styles.nowBadge}>현재</span>}
                  {isDone && !isCurrent && (
                    <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>
                      check_circle
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {isSeller && !isCompleted && (
            <>
              {canMarkPreparing && (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() =>
                    runAction(() =>
                      updateDeliveryStatus(transaction.id, { status: 'PREPARING' as DeliveryStatus })
                    )
                  }
                  disabled={actionLoading}
                >
                  배송 준비로 변경
                </button>
              )}

              {canMarkShipped && (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() =>
                    runAction(() =>
                      updateDeliveryStatus(transaction.id, { status: 'SHIPPED' as DeliveryStatus })
                    )
                  }
                  disabled={actionLoading}
                >
                  발송 완료로 변경
                </button>
              )}

              {canMarkInTransit && (
                <button
                  type="button"
                  className={styles.actionBtn}
                  onClick={() =>
                    runAction(() =>
                      updateDeliveryStatus(transaction.id, { status: 'IN_TRANSIT' as DeliveryStatus })
                    )
                  }
                  disabled={actionLoading}
                >
                  배송 중으로 변경
                </button>
              )}

              {canDevDelivered && (
                <button
                  type="button"
                  className={styles.actionBtnSecondary}
                  onClick={() => runAction(() => markDevDeliveryDelivered(transaction.id))}
                  disabled={actionLoading}
                >
                  배송 완료 처리 (개발용)
                </button>
              )}
            </>
          )}

          {canReceive && (
            <button
              type="button"
              className={styles.actionBtn}
              onClick={() => runAction(() => confirmDeliveryReceive(transaction.id))}
              disabled={actionLoading}
            >
              수령 완료
            </button>
          )}

          {isBuyer && transaction.status === 'IN_TRANSIT' && (
            <div className={styles.notice}>배송 중입니다. 도착 후 수령 완료를 진행해주세요.</div>
          )}
        </section>
      )}
    </div>
  );
}
