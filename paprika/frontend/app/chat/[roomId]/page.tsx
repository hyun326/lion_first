/**
 * 1:1 채팅방 페이지
 * 담당: C - 한대천
 *
 * TODO:
 *  - WebSocket 연결 (STOMP)
 *  - 이전 메시지 로드 (GET /api/v1/chat/rooms/:id/messages, 무한 스크롤)
 *  - 실시간 메시지 송수신
 *  - 상품 정보 미리보기 (상단)
 *  - 메시지 읽음 처리
 */
export default function ChatRoomPage({
  params,
}: {
  params: { roomId: string };
}) {
  return (
    <main style={{ padding: 24 }}>
      <section style={{ maxWidth: 900, margin: '0 auto', display: 'flex', flexDirection: 'column', height: '70vh' }}>
        <header style={{ padding: 12, borderBottom: '1px solid var(--color-outline-variant)' }}>
          <h2>채팅방 (ID: {params.roomId})</h2>
        </header>

        <div style={{ flex: 1, overflow: 'auto', padding: 12 }}>
          <p style={{ color: 'var(--color-on-surface-variant)' }}>메시지 목록 (샘플)</p>
        </div>

        <div style={{ padding: 12, borderTop: '1px solid var(--color-outline-variant)' }}>
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', gap: 8 }}>
            <input placeholder="Type a message" style={{ flex: 1, padding: '10px 12px', borderRadius: 8, border: '1px solid var(--color-outline-variant)' }} />
            <button style={{ background: 'var(--color-primary)', color: 'white', padding: '8px 14px', borderRadius: 8 }}>Send</button>
          </form>
        </div>
      </section>
    </main>
  );
}
