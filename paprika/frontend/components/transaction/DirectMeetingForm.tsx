'use client';

import { FormEvent, useState } from 'react';
import type { DirectMeetingPayload } from '@/types/transaction';
import styles from './DirectMeetingForm.module.css';

interface DirectMeetingFormProps {
  onSubmit: (payload: DirectMeetingPayload) => Promise<void>;
}

export default function DirectMeetingForm({ onSubmit }: DirectMeetingFormProps) {
  const [meetingPlaceName, setMeetingPlaceName] = useState('');
  const [meetingAddress, setMeetingAddress] = useState('');
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');
  const [meetingAt, setMeetingAt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (!meetingPlaceName.trim() || !meetingAddress.trim()) {
      setError('장소명과 주소를 입력해주세요.');
      return;
    }
    if (Number.isNaN(lat) || Number.isNaN(lng)) {
      setError('위도와 경도를 숫자로 입력해주세요.');
      return;
    }
    if (!meetingAt) {
      setError('약속 일시를 선택해주세요.');
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        meetingPlaceName: meetingPlaceName.trim(),
        meetingAddress: meetingAddress.trim(),
        latitude: lat,
        longitude: lng,
        meetingAt: meetingAt.length === 16 ? `${meetingAt}:00` : meetingAt,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '약속 정보 저장에 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label className={styles.label} htmlFor="meetingPlaceName">장소명</label>
        <input
          id="meetingPlaceName"
          className={styles.input}
          value={meetingPlaceName}
          onChange={(e) => setMeetingPlaceName(e.target.value)}
          placeholder="예: 강남역 2번 출구"
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="meetingAddress">주소</label>
        <input
          id="meetingAddress"
          className={styles.input}
          value={meetingAddress}
          onChange={(e) => setMeetingAddress(e.target.value)}
          placeholder="상세 주소"
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="latitude">위도</label>
          <input
            id="latitude"
            className={styles.input}
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            placeholder="37.4979"
            inputMode="decimal"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="longitude">경도</label>
          <input
            id="longitude"
            className={styles.input}
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            placeholder="127.0276"
            inputMode="decimal"
          />
        </div>
      </div>

      <p className={styles.hint}>
        지도 API 연동 전까지 위도·경도를 직접 입력해주세요. 임의 좌표는 입력하지 마세요.
      </p>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="meetingAt">약속 일시</label>
        <input
          id="meetingAt"
          className={styles.input}
          type="datetime-local"
          value={meetingAt}
          onChange={(e) => setMeetingAt(e.target.value)}
        />
      </div>

      {error && <p className={styles.error}>{error}</p>}

      <button type="submit" className={styles.submitBtn} disabled={loading}>
        {loading ? '저장 중...' : '약속 장소 저장'}
      </button>
    </form>
  );
}
