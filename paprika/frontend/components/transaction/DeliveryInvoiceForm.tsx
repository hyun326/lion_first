'use client';

import { FormEvent, useState } from 'react';
import {
  generateTrackingNumber,
  randomCourier,
} from '@/lib/deliveryTracking';
import type { DeliveryInvoicePayload } from '@/types/transaction';
import styles from './DeliveryInvoiceForm.module.css';

interface DeliveryInvoiceFormProps {
  submitLabel?: string;
  onSubmit: (payload: DeliveryInvoicePayload) => Promise<void>;
}

export default function DeliveryInvoiceForm({
  submitLabel = '운송장 등록 후 배송 상태로 이동',
  onSubmit,
}: DeliveryInvoiceFormProps) {
  const [courierCompany, setCourierCompany] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [issuedCourier, setIssuedCourier] = useState<string | null>(null);
  const [issuedTracking, setIssuedTracking] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = () => {
    const courier = randomCourier();
    const tracking = generateTrackingNumber();
    setIssuedCourier(courier);
    setIssuedTracking(tracking);
    setCourierCompany(courier);
    setTrackingNumber('');
    setError(null);
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!issuedTracking || !issuedCourier) {
      setError('먼저 운송장 번호를 발급받아주세요.');
      return;
    }

    const inputTracking = trackingNumber.trim();
    if (!inputTracking) {
      setError('발급된 운송장 번호를 입력해주세요.');
      return;
    }

    if (inputTracking !== issuedTracking) {
      setError('발급된 운송장 번호와 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        courierCompany: issuedCourier,
        trackingNumber: issuedTracking,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '운송장 등록에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <button
        type="button"
        className={styles.generateBtn}
        onClick={handleGenerate}
        disabled={loading}
      >
        운송장 번호 발급
      </button>

      {issuedTracking && (
        <div className={styles.issuedBox}>
          <p className={styles.issuedTitle}>발급된 운송장</p>
          <span>택배사: {issuedCourier}</span>
          <strong className={styles.issuedNumber}>{issuedTracking}</strong>
          <p className={styles.issuedHint}>
            위 번호를 아래 입력란에 그대로 입력하면 배송 상태 화면으로 이동합니다.
          </p>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="trackingNumber">
          운송장 번호 입력
        </label>
        <input
          id="trackingNumber"
          className={styles.input}
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="발급된 운송장 번호 입력"
          inputMode="numeric"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button
        type="submit"
        className={styles.submitBtn}
        disabled={loading || !issuedTracking}
      >
        {loading ? '등록 중...' : submitLabel}
      </button>
    </form>
  );
}
