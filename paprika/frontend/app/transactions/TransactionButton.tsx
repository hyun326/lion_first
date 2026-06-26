'use client';

import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function TransactionButton() {
  const router = useRouter();

  return (
    <button
      className={styles.primaryButton}
      type="button"
      onClick={() => router.push('/transactions')}
    >
      거래하기
    </button>
  );
}
