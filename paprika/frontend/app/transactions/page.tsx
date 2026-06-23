'use client';

import { useEffect, useState } from 'react';
import TransactionList from '@/components/transaction/TransactionList';
import { getApiErrorMessage } from '@/lib/apiError';
import { getMyTransactions } from '@/lib/transactionApi';
import type { TransactionResponse } from '@/types/transaction';
import styles from './page.module.css';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyTransactions();
        if (!cancelled) setTransactions(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>거래 내역</h1>
        <p className={styles.subtitle}>내가 참여한 직거래·택배 거래 목록입니다.</p>
      </header>
      <TransactionList transactions={transactions} loading={loading} error={error} />
    </main>
  );
}
