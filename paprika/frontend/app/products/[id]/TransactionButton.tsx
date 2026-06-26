'use client';

import { useParams, useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function TransactionButton() {
  const router = useRouter();
  const params = useParams();

  return (
    <button
      className={styles.primaryButton}
      type="button"
      onClick={() => router.push(`/products/${params.id}/transaction`)}
    >
      거래하기
    </button>
  );
}
