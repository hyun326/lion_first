/**
 * 상품 상태 배지
 * 담당: B - 백성민
 * SELLING(판매중) | RESERVED(예약중) | SOLD(판매완료)
 */
import styles from './StatusBadge.module.css';
import type { ProductStatus } from '@/types';

const STATUS_LABEL: Record<ProductStatus, string> = {
  SELLING:  '판매중',
  RESERVED: '예약중',
  SOLD:     '판매완료',
  DRAFT:    '임시저장',
};

export default function StatusBadge({ status }: { status: ProductStatus }) {
  return (
    <span className={`${styles.badge} ${styles[status.toLowerCase()]}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}
