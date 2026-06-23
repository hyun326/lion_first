'use client';

/**
 * 마이페이지
 * - 거래 내역: 내가 참여한 거래(진행 중/완료/취소) 목록, 클릭 시 거래 상세로 이동
 * - 대화 중: 채팅방 목록 (채팅 API 연동 전까지 샘플), 클릭 시 채팅방으로 이동
 */
import { useEffect, useState } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import ChatRoomItem from '@/components/chat/ChatRoomItem';
import TransactionList from '@/components/transaction/TransactionList';
import { getApiErrorMessage } from '@/lib/apiError';
import { getMyTransactions } from '@/lib/transactionApi';
import type { TransactionResponse } from '@/types/transaction';
import type { ChatRoom } from '@/types';

const ACTIVE_STATUSES = new Set([
  'REQUESTED',
  'MEETING_PROPOSED',
  'MEETING_SET',
  'MEETING_COMPLETED',
  'PREPARING',
  'SHIPPED',
  'IN_TRANSIT',
  'DELIVERED',
]);

// 채팅 API 연동 전까지 사용하는 샘플 대화 목록
const sampleChatRooms: ChatRoom[] = [
  {
    id: 1,
    productId: 1,
    productTitle: 'Mahogany Coffee Table',
    counterpartId: 10,
    counterpartNickname: 'RetroLover99',
    lastMessage: '직거래 가능하신가요?',
    lastMessageAt: new Date().toISOString(),
    unreadCount: 2,
  },
];

const cardStyle: CSSProperties = {
  background: 'var(--color-surface-container-lowest)',
  borderRadius: 24,
  padding: 24,
  boxShadow: 'var(--shadow-card)',
};

export default function MyPage() {
  const [transactions, setTransactions] = useState<TransactionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tab, setTab] = useState<'active' | 'all'>('active');

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await getMyTransactions();
        if (!cancelled) setTransactions(data);
      } catch (err) {
        if (!cancelled) setError(getApiErrorMessage(err));
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const activeTransactions = transactions.filter((t) => ACTIVE_STATUSES.has(t.status));
  const visibleTransactions = tab === 'active' ? activeTransactions : transactions;

  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <section style={{ display: 'grid', gap: 24 }}>
        <div style={cardStyle}>
          <h1>내 프로필</h1>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginTop: 16 }}>
            <div style={{ width: 88, height: 88, borderRadius: 24, background: 'var(--color-surface)' }} />
            <div>
              <p style={{ fontSize: 20, fontWeight: 700 }}>홍길동</p>
              <p style={{ color: 'var(--color-on-surface-variant)' }}>이메일: example@paprika.com</p>
              <p style={{ color: 'var(--color-secondary)', marginTop: 8 }}>매너 온도 36.5°C</p>
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
            <h2 style={{ margin: 0 }}>거래 내역</h2>
            <div style={{ display: 'flex', gap: 8 }}>
              <button
                type="button"
                onClick={() => setTab('active')}
                style={tabButtonStyle(tab === 'active')}
              >
                거래중 {activeTransactions.length > 0 ? `(${activeTransactions.length})` : ''}
              </button>
              <button
                type="button"
                onClick={() => setTab('all')}
                style={tabButtonStyle(tab === 'all')}
              >
                전체
              </button>
            </div>
          </div>
          <p style={{ color: 'var(--color-on-surface-variant)', margin: '8px 0 16px' }}>
            상태를 확인하고 항목을 누르면 거래 상세로 이동합니다.
          </p>
          <TransactionList transactions={visibleTransactions} loading={loading} error={error} />
        </div>

        <div style={cardStyle}>
          <h2 style={{ margin: 0 }}>대화 중</h2>
          <p style={{ color: 'var(--color-on-surface-variant)', margin: '8px 0 16px' }}>
            진행 중인 대화입니다. 누르면 채팅방으로 이동합니다.
          </p>
          {sampleChatRooms.length === 0 ? (
            <p style={{ color: 'var(--color-on-surface-variant)' }}>진행 중인 대화가 없습니다.</p>
          ) : (
            <div style={{ borderRadius: 12, overflow: 'hidden', background: 'var(--color-surface-container)' }}>
              {sampleChatRooms.map((room) => (
                <Link
                  key={room.id}
                  href={`/chat/${room.id}`}
                  style={{ display: 'block', textDecoration: 'none', color: 'inherit' }}
                >
                  <ChatRoomItem room={room} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

function tabButtonStyle(active: boolean): CSSProperties {
  return {
    padding: '8px 14px',
    borderRadius: 9999,
    border: active ? 'none' : '1px solid var(--color-outline-variant)',
    background: active ? 'var(--color-primary)' : 'transparent',
    color: active ? 'var(--color-on-primary)' : 'var(--color-on-surface)',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
  };
}
