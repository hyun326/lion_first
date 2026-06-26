'use client';

import { useState } from 'react';
import styles from './page.module.css';

type PaymentMethod = 'CASH' | 'CARD';
type TransactionType = 'DIRECT' | 'DELIVERY';

export default function TransactionPage() {
  const [payment, setPayment] = useState<PaymentMethod | null>(null);
  const [transactionType, setTransactionType] = useState<TransactionType | null>(null);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');

  return (
    <main className={styles.page}>
      <div className={styles.container}>
        <div className={styles.buttonRow}>
          <button
            type="button"
            className={payment === 'CASH' ? styles.optionActive : styles.optionButton}
            onClick={() => setPayment('CASH')}
          >
            현금결제
          </button>
          <button
            type="button"
            className={payment === 'CARD' ? styles.optionActive : styles.optionButton}
            onClick={() => setPayment('CARD')}
          >
            카드결제
          </button>
        </div>

        {payment === 'CASH' && (
          <div className={styles.field}>
            <label className={styles.label} htmlFor="phone">
              휴대폰 번호
            </label>
            <input
              id="phone"
              className={styles.input}
              type="tel"
              placeholder="휴대폰 번호 입력 (예: 010-1234-5678)"
              value={phoneNumber}
              onChange={(event) => setPhoneNumber(event.target.value)}
            />

            <label className={styles.label} htmlFor="business">
              사업자번호
            </label>
            <input
              id="business"
              className={styles.input}
              type="text"
              placeholder="사업자번호 입력 (예: 123-45-67890)"
              value={businessNumber}
              onChange={(event) => setBusinessNumber(event.target.value)}
            />
          </div>
        )}

        <div className={styles.buttonRow}>
          <button
            type="button"
            className={transactionType === 'DIRECT' ? styles.optionActive : styles.optionButton}
            onClick={() => setTransactionType('DIRECT')}
          >
            직거래
          </button>
          <button
            type="button"
            className={transactionType === 'DELIVERY' ? styles.optionActive : styles.optionButton}
            onClick={() => setTransactionType('DELIVERY')}
          >
            택배거래
          </button>
        </div>

        <button
          type="button"
          className={styles.completeButton}
          onClick={() => alert('거래가 완료되었습니다.')}
        >
          완료
        </button>
      </div>
    </main>
  );
}
