'use client';

import { FormEvent, useState } from 'react';
import styles from './DeliveryInvoiceForm.module.css';

interface DeliveryTrackingLookupFormProps {
  courierCompany?: string | null;
  onSubmit: (trackingNumber: string) => void;
}

export default function DeliveryTrackingLookupForm({
  courierCompany,
  onSubmit,
}: DeliveryTrackingLookupFormProps) {
  const [trackingNumber, setTrackingNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (!trackingNumber.trim()) {
      setError('운송장 번호를 입력해주세요.');
      return;
    }

    onSubmit(trackingNumber.trim());
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {courierCompany && (
        <div className={styles.issuedBox}>
          <span>택배사: {courierCompany}</span>
        </div>
      )}

      <div className={styles.field}>
        <label className={styles.label} htmlFor="lookupTrackingNumber">
          운송장 번호 입력
        </label>
        <input
          id="lookupTrackingNumber"
          className={styles.input}
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          placeholder="판매자에게 받은 운송장 번호 입력"
          inputMode="numeric"
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitBtn}>
        배송 상태 보기
      </button>
    </form>
  );
}
