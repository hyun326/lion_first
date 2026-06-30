'use client';

/**
 * 채팅방 목록 + ChatButton 테스트 하니스
 * 담당: C - 한대천
 *
 * 테스트 박스에서 상품id·셀러id·구매id를 직접 입력해 enter 동작을 확인한다.
 * (구매id == 셀러id 이면 판매자 모드 → 방 목록 / 다르면 구매자 모드 → 방 1개)
 */
import { useState } from 'react';
import Link from 'next/link';
import styles from './page.module.css';
import ChatButton from '@/components/chat/ChatButton';

const rooms = [
  {
    id: 'public',
    href: '/chat/public',
    name: '🌐 전체 공개 채팅방',
    desc: '로그인 없이 누구나 참여할 수 있어요',
  },
  // TODO: 로그인 시 1:1 거래 채팅방들 (GET /api/v1/chat/rooms)
];

const labelStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  fontSize: 12,
  color: 'var(--color-on-surface-variant)',
};

const inputStyle: React.CSSProperties = {
  width: 80,
  padding: '6px 8px',
  border: '1px solid var(--color-outline-variant)',
  borderRadius: 8,
  fontSize: 14,
};

export default function ChatListPage() {
  const [postId, setPostId] = useState(1);
  const [sellerId, setSellerId] = useState(10);
  const [buyerId, setBuyerId] = useState(7);

  return (
    <div className={styles.chatList}>
      <h1>채팅</h1>

      {/* ── 테스트 하니스 (확인 후 제거) ─────────────────────────────── */}
      <div
        style={{
          padding: 16,
          border: '1px dashed var(--color-outline)',
          borderRadius: 12,
          marginBottom: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 10,
        }}
      >
        <p style={{ margin: 0, fontSize: 13, color: 'var(--color-on-surface-variant)' }}>
          [테스트] enter 입력값 — <b>구매id == 셀러id</b> 면 판매자(목록) 모드
        </p>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <label style={labelStyle}>
            상품id
            <input type="number" value={postId} onChange={(e) => setPostId(Number(e.target.value))} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            셀러id
            <input type="number" value={sellerId} onChange={(e) => setSellerId(Number(e.target.value))} style={inputStyle} />
          </label>
          <label style={labelStyle}>
            구매id
            <input type="number" value={buyerId} onChange={(e) => setBuyerId(Number(e.target.value))} style={inputStyle} />
          </label>
        </div>

        {/* key로 입력이 바뀌면 ChatButton을 새로(닫힌 상태) 다시 마운트 */}
        <ChatButton key={`${postId}-${sellerId}-${buyerId}`} postId={postId} sellerId={sellerId} buyerId={buyerId} />
      </div>
      {/* ─────────────────────────────────────────────────────────────── */}

      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            <Link href={room.href}>
              <strong>{room.name}</strong>
              <span>{room.desc}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
