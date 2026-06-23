'use client';

import Link from 'next/link';
import TransactionStatusBadge, { TransactionTypeBadge } from '@/components/transaction/TransactionStatusBadge';
import type { TransactionResponse } from '@/types/transaction';
import styles from './TransactionList.module.css';

interface TransactionListProps {
  transactions: TransactionResponse[];
  loading: boolean;
  error: string | null;
}

export default function TransactionList({ transactions, loading, error }: TransactionListProps) {
  if (loading) {
    return <div className={styles.loading}>거래 내역을 불러오는 중...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  if (transactions.length === 0) {
    return (
      <div className={styles.empty}>
        진행 중인 거래가 없습니다.
      </div>
    );
  }

  return (
    <div className={styles.list}>
      {transactions.map((transaction) => (
        <Link
          key={transaction.id}
          href={`/transactions/${transaction.id}`}
          className={`${styles.card} ${transaction.status === 'CANCELLED' ? styles.cancelledCard : ''}`}
        >
          <div className={styles.cardHeader}>
            <div className={styles.badges}>
              <TransactionTypeBadge transactionType={transaction.transactionType} />
              <TransactionStatusBadge status={transaction.status} />
            </div>
            <span className={styles.amount}>{(transaction.totalAmount ?? transaction.amount).toLocaleString()}원</span>
          </div>
          <div className={styles.meta}>
            <span>상품 ID: {transaction.productId}</span>
            <span>상대방 ID: {transaction.counterpartId ?? '-'}</span>
            <span>거래 ID: {transaction.id}</span>
          </div>
        </Link>
      ))}
    </div>
  );
}
