'use client';

import type { TaxInvoiceResponse } from '@/types/transaction';
import { getPaymentMethodLabel, getTaxInvoiceStatusLabel } from '@/types/transaction';
import styles from './TaxInvoiceCard.module.css';

interface TaxInvoiceCardProps {
  invoice: TaxInvoiceResponse;
}

function formatDateTime(value?: string | null) {
  if (!value) return '-';
  return new Date(value).toLocaleString('ko-KR');
}

export default function TaxInvoiceCard({ invoice }: TaxInvoiceCardProps) {
  const isIssued = invoice.status === 'ISSUED';

  return (
    <section className={styles.card} aria-label="세금계산서">
      <div className={styles.header}>
        <h2 className={styles.title}>세금계산서</h2>
        <span className={isIssued ? styles.badgeIssued : styles.badgePending}>
          {getTaxInvoiceStatusLabel(invoice.status)}
        </span>
      </div>

      <div className={styles.grid}>
        <div className={styles.row}>
          <span className={styles.label}>발행번호</span>
          <span className={styles.value}>{invoice.invoiceNumber ?? '거래 완료 후 발행'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>발행일시</span>
          <span className={styles.value}>{formatDateTime(invoice.issuedAt)}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>상호</span>
          <span className={styles.value}>{invoice.companyName ?? '-'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>사업자등록번호</span>
          <span className={styles.value}>{invoice.businessNumber ?? '-'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>이메일</span>
          <span className={styles.value}>{invoice.email ?? '-'}</span>
        </div>
        <div className={styles.row}>
          <span className={styles.label}>결제 수단</span>
          <span className={styles.value}>{getPaymentMethodLabel(invoice.paymentMethod)}</span>
        </div>
      </div>

      <div className={styles.amountBox}>
        <div className={styles.amountRow}>
          <span>공급가액</span>
          <strong>{(invoice.supplyAmount ?? 0).toLocaleString()}원</strong>
        </div>
        <div className={styles.amountRow}>
          <span>부가세 (10%)</span>
          <strong>{(invoice.vatAmount ?? 0).toLocaleString()}원</strong>
        </div>
        <div className={`${styles.amountRow} ${styles.total}`}>
          <span>합계</span>
          <strong>{invoice.totalAmount.toLocaleString()}원</strong>
        </div>
      </div>

      {!isIssued && (
        <p className={styles.notice}>거래가 완료되면 세금계산서가 자동 발행됩니다.</p>
      )}
    </section>
  );
}
