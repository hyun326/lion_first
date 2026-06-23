/**
 * 채팅 목록 & 알림 페이지
 * 화면 참조: _2 (Paprika | Chat & Notifications)
 * 담당: C - 한대천
 *
 * TODO:
 *  - 채팅방 목록 API 호출 (GET /api/v1/chat/rooms)
 *  - 읽지 않은 메시지 배지 표시
 *  - 알림 목록 탭 (새 채팅, 거래 상태 변경 등)
 *  - 실시간 새 메시지 알림 (WebSocket)
 */
import ChatRoomItem from '@/components/chat/ChatRoomItem';
import type { ChatRoom } from '@/types';

const sampleRooms: ChatRoom[] = [
  {
    id: 1,
    productId: 1,
    productTitle: 'Vintage Canon AE-1',
    counterpartId: 20,
    counterpartNickname: 'RetroLover99',
    lastMessage: 'Is the price negotiable?',
    lastMessageAt: new Date().toISOString(),
    unreadCount: 2,
  } as ChatRoom,
];

export default function ChatListPage() {
  return (
    <main style={{ padding: 24 }}>
      <section style={{ maxWidth: 800, margin: '0 auto' }}>
        <h1>채팅 & 알림</h1>

        <div style={{ marginTop: 16, borderRadius: 12, overflow: 'hidden', background: 'var(--color-surface-container-lowest)' }}>
          {sampleRooms.map((r) => (
            <ChatRoomItem key={r.id} room={r} />
          ))}
        </div>
      </section>
    </main>
  );
}
