import styles from './TransactionStatusBadge.module.css';
import type { DeliveryStatus, TransactionStatus, TransactionType } from '@/types/transaction';

const TRANSACTION_TYPE_LABEL: Record<TransactionType, string> = {
  DIRECT: '직거래',
  DELIVERY: '택배',
};

const STATUS_LABEL: Record<TransactionStatus, string> = {
  REQUESTED: '거래 요청',
  MEETING_SET: '약속 확정',
  MEETING_COMPLETED: '완료 확인 중',
  PREPARING: '배송 준비',
  SHIPPED: '발송 완료',
  IN_TRANSIT: '배송 중',
  DELIVERED: '배송 완료',
  COMPLETED: '거래 완료',
};

interface TransactionStatusBadgeProps {
  status: TransactionStatus;
}

interface TransactionTypeBadgeProps {
  transactionType: TransactionType;
}

export function TransactionTypeBadge({ transactionType }: TransactionTypeBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles.type}`}>
      {TRANSACTION_TYPE_LABEL[transactionType]}
    </span>
  );
}

export default function TransactionStatusBadge({ status }: TransactionStatusBadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[status.toLowerCase()] || styles.default}`}>
      {STATUS_LABEL[status]}
    </span>
  );
}

export function DeliveryStatusBadge({ status }: { status: DeliveryStatus }) {
  const labels: Record<DeliveryStatus, string> = {
    PREPARING: '배송 준비',
    SHIPPED: '발송',
    IN_TRANSIT: '배송 중',
    DELIVERED: '배송 완료',
  };

  return <span className={`${styles.badge} ${styles.delivery}`}>{labels[status]}</span>;
}
