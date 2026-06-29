'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import api from '@/lib/api';
import styles from './page.module.css';

type TransactionType = 'DIRECT' | 'DELIVERY';

const TYPE_LABEL: Record<TransactionType, string> = {
  DIRECT: '직거래',
  DELIVERY: '배달',
};

interface TransactionItem {
  id: number;
  type: TransactionType;
  meetingLocation: string;
  meetingTime: string;
  //구매확정했는지 판매확정했는지
  buyerConfirmed: boolean;
  sellerConfirmed: boolean;
  completed: boolean;
}

function TransactionStatusContent() {
  const searchParams = useSearchParams();

  // TODO: 실제 거래 데이터 연동 전까지 약속 확정으로 넘어온 거래만 표시
  const [items, setItems] = useState<TransactionItem[]>(() => {
    const meetingLocation = searchParams.get('location') ?? '';
    const meetingTime = searchParams.get('time') ?? '';
    const type: TransactionType = searchParams.get('type') === 'DELIVERY' ? 'DELIVERY' : 'DIRECT';
    if (!meetingLocation && !meetingTime) {
      return [];
    }
    return [
      {
        //각 거래를 구분할 고유 식별자
        id: Date.now(),
        type,
        meetingLocation,
        meetingTime,
        buyerConfirmed: false,// 구매확정했는지 
        sellerConfirmed: false,
        completed: false,
      },
    ];
  });

  // 완료 요청을 거래당 한 번만 보내기 위한 기록 (중복 호출 방지)
  const completeRequested = useRef<Set<number>>(new Set());

  // 구매자·판매자 양쪽이 모두 확정하면 post를 완료 상태로 변경 요청한다.
  useEffect(() => {
    items.forEach((item) => {
      const bothConfirmed = item.buyerConfirmed && item.sellerConfirmed;
      if (bothConfirmed && !completeRequested.current.has(item.id)) {
        completeRequested.current.add(item.id);
        requestComplete(item.id);
      }
    });
  }, [items]);

  // 거래 완료 처리: 백엔드에 완료 요청(POST .../complete) → 응답과 무관하게 UI는 완료로 표시
  const requestComplete = async (id: number) => {
    try {
      await api.post(`/api/v1/transactions/${id}/complete`);
    } catch {
      // 백엔드 미연동 단계에서도 데모가 진행되도록 실패는 무시
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: true } : item)),
    );
  };

  const confirmBuyer = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, buyerConfirmed: true } : item)),
    );
  };

  const confirmSeller = (id: number) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, sellerConfirmed: true } : item)),
    );
  };

  const handleCancel = (id: number) => {
    if (!confirm('거래를 취소하시겠어요?')) {
      return;
    }
    //확인을 누른 뒤 실행되는 취소처리 로직
    completeRequested.current.delete(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>거래 상태</h1>

        {items.length === 0 ? (
          <p className={styles.empty}>진행 중인 거래가 없습니다.</p>
        ) : (
          <ul className={styles.list}>
            {items.map((item) => (
              <li key={item.id} className={styles.card}>
                <div className={styles.cardHeader}>
                  <span className={styles.typeBadge}>{TYPE_LABEL[item.type]}</span>
                  {item.completed && <span className={styles.doneBadge}>거래 완료</span>}
                </div>

                <div className={styles.info}>
                  <div className={styles.meetingRow}>
                    <span className={styles.meetingLabel}>장소</span>
                    <span className={styles.meetingValue}>{item.meetingLocation || '-'}</span>
                  </div>
                  <div className={styles.meetingRow}>
                    <span className={styles.meetingLabel}>날짜·시간</span>
                    <span className={styles.meetingValue}>{item.meetingTime || '-'}</span>
                  </div>
                </div>

                {/* 직거래일 때만 구매/판매 확정 버튼 노출. 둘 다 확정되면 완료 요청 */}
                {item.type === 'DIRECT' && !item.completed && (
                  <div className={styles.confirmRow}>
                    <button
                      type="button"
                      className={item.buyerConfirmed ? styles.confirmDone : styles.confirmButton}
                      disabled={item.buyerConfirmed}
                      onClick={() => confirmBuyer(item.id)}
                    >
                      {item.buyerConfirmed ? '구매확정 완료' : '구매확정'}
                    </button>
                    <button
                      type="button"
                      className={item.sellerConfirmed ? styles.confirmDone : styles.confirmButton}
                      disabled={item.sellerConfirmed}
                      onClick={() => confirmSeller(item.id)}
                    >
                      {item.sellerConfirmed ? '판매확정 완료' : '판매확정'}
                    </button>
                  </div>
                )}

                {!item.completed && (
                  <button
                    type="button"
                    className={styles.cancelButton}
                    onClick={() => handleCancel(item.id)}
                  >
                    거래 취소
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}

export default function TransactionStatusPage() {
  return (
    <Suspense fallback={null}>
      <TransactionStatusContent />
    </Suspense>
  );
}
