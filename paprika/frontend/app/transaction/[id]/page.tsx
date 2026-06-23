'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createTransaction } from '@/lib/transactionApi';
import { getApiErrorMessage } from '@/lib/apiError';
import { getSampleProductById } from '@/lib/sampleProducts';
import type { PaymentMethod, TransactionType } from '@/types/transaction';
import styles from './page.module.css';

export default function TransactionPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const product = getSampleProductById(Number(params.id));
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(null);
  const [taxInvoiceRequested, setTaxInvoiceRequested] = useState(false);
  const [companyName, setCompanyName] = useState('');
  const [businessNumber, setBusinessNumber] = useState('');
  const [taxEmail, setTaxEmail] = useState('');
  const [loadingType, setLoadingType] = useState<TransactionType | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handlePaymentMethodChange = (method: PaymentMethod) => {
    setPaymentMethod(method);
    if (method === 'CARD') {
      setTaxInvoiceRequested(false);
      setCompanyName('');
      setBusinessNumber('');
      setTaxEmail('');
    }
  };

  const handleSelectType = async (transactionType: TransactionType) => {
    if (!product || loadingType) return;

    if (!paymentMethod) {
      setError('결제 수단을 먼저 선택해주세요.');
      return;
    }

    if (taxInvoiceRequested && paymentMethod === 'CASH') {
      if (!companyName.trim() || !businessNumber.trim() || !taxEmail.trim()) {
        setError('세금계산서 발행 정보를 모두 입력해주세요.');
        return;
      }
    }

    const requestTaxInvoice = paymentMethod === 'CASH' && taxInvoiceRequested;

    setLoadingType(transactionType);
    setError(null);

    try {
      const transaction = await createTransaction({
        productId: product.id,
        sellerId: product.sellerId,
        transactionType,
        amount: product.price,
        paymentMethod,
        taxInvoiceRequested: requestTaxInvoice,
        taxInvoiceCompanyName: requestTaxInvoice ? companyName.trim() : undefined,
        taxInvoiceBusinessNumber: requestTaxInvoice ? businessNumber.trim() : undefined,
        taxInvoiceEmail: requestTaxInvoice ? taxEmail.trim() : undefined,
      });

      if (transactionType === 'DELIVERY') {
        router.push(`/transactions/${transaction.id}/delivery`);
      } else {
        router.push(`/transactions/${transaction.id}`);
      }
    } catch (err) {
      setError(getApiErrorMessage(err));
      setLoadingType(null);
    }
  };

  if (!product) {
    return (
      <main className={styles.page}>
        <p className={styles.subtitle}>상품을 찾을 수 없습니다.</p>
        <Link href="/" className={styles.backLink}>
          홈으로 돌아가기
        </Link>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <Link href={`/products/${product.id}`} className={styles.backLink}>
        ← 상품으로 돌아가기
      </Link>

      <h1 className={styles.title}>거래 신청</h1>
      <p className={styles.subtitle}>{product.title}</p>

      <div className={styles.productSummary}>
        <span className={styles.productPrice}>
          {product.price.toLocaleString()}원
        </span>
        <span className={styles.productMeta}>
          판매자: {product.sellerNickname}
        </span>
      </div>

      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>결제 수단</h2>
        <div className={styles.paymentOptions}>
          <button
            type="button"
            className={`${styles.paymentCard} ${paymentMethod === 'CASH' ? styles.paymentActive : ''}`}
            onClick={() => handlePaymentMethodChange('CASH')}
            disabled={loadingType !== null}
          >
            <span className="material-symbols-outlined">payments</span>
            <span>
              <p className={styles.optionTitle}>현금</p>
              <p className={styles.optionDesc}>직거래·택배 모두 현금 결제</p>
            </span>
          </button>
          <button
            type="button"
            className={`${styles.paymentCard} ${paymentMethod === 'CARD' ? styles.paymentActive : ''}`}
            onClick={() => handlePaymentMethodChange('CARD')}
            disabled={loadingType !== null}
          >
            <span className="material-symbols-outlined">credit_card</span>
            <span>
              <p className={styles.optionTitle}>카드</p>
              <p className={styles.optionDesc}>앱/카드 결제</p>
            </span>
          </button>
        </div>
      </section>

      {paymentMethod === 'CASH' && (
      <section className={styles.section}>
        <label className={styles.checkboxRow}>
          <input
            type="checkbox"
            checked={taxInvoiceRequested}
            onChange={(e) => setTaxInvoiceRequested(e.target.checked)}
            disabled={loadingType !== null}
          />
          <span>세금계산서 발행 요청</span>
        </label>

        {taxInvoiceRequested && (
          <div className={styles.taxForm}>
            <div className={styles.field}>
              <label htmlFor="companyName">상호</label>
              <input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="예: 파프리카 주식회사"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="businessNumber">사업자등록번호</label>
              <input
                id="businessNumber"
                value={businessNumber}
                onChange={(e) => setBusinessNumber(e.target.value)}
                placeholder="000-00-00000"
              />
            </div>
            <div className={styles.field}>
              <label htmlFor="taxEmail">이메일</label>
              <input
                id="taxEmail"
                type="email"
                value={taxEmail}
                onChange={(e) => setTaxEmail(e.target.value)}
                placeholder="tax@company.com"
              />
            </div>
            <p className={styles.taxHint}>
              거래 완료 시 공급가액·부가세가 자동 계산되어 세금계산서가 발행됩니다.
            </p>
          </div>
        )}
      </section>
      )}

      <p className={styles.guide}>거래 방식을 선택해주세요.</p>

      {error && <p className={styles.error}>{error}</p>}

      <div className={styles.options}>
        <button
          type="button"
          className={styles.optionCard}
          onClick={() => handleSelectType('DIRECT')}
          disabled={loadingType !== null}
        >
          <span className={styles.iconWrap}>
            <span className="material-symbols-outlined">handshake</span>
          </span>
          <span className={styles.optionContent}>
            <p className={styles.optionTitle}>직거래</p>
            <p className={styles.optionDesc}>
              {loadingType === 'DIRECT' ? '요청 중...' : '판매자와 직접 만나서 거래합니다'}
            </p>
          </span>
          <span className={`material-symbols-outlined ${styles.arrow}`}>
            chevron_right
          </span>
        </button>

        <button
          type="button"
          className={styles.optionCard}
          onClick={() => handleSelectType('DELIVERY')}
          disabled={loadingType !== null}
        >
          <span className={styles.iconWrap}>
            <span className="material-symbols-outlined">local_shipping</span>
          </span>
          <span className={styles.optionContent}>
            <p className={styles.optionTitle}>택배거래</p>
            <p className={styles.optionDesc}>
              {loadingType === 'DELIVERY' ? '요청 중...' : '택배로 상품을 받아 거래합니다'}
            </p>
          </span>
          <span className={`material-symbols-outlined ${styles.arrow}`}>
            chevron_right
          </span>
        </button>
      </div>
    </main>
  );
}
