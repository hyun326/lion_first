'use client';

/**

 *
 * 사용법:
 *   <ChatButton productId={product.id} sellerId={product.sellerId} />

 */
import { useState } from 'react';
import api from '@/lib/api';
import ChatRoom from './ChatRoom';
import ChatRoomList, { type RoomSummary } from './ChatRoomList';
import styles from './ChatButton.module.css';

interface ChatButtonProps {
  postId: number; // 상품 id (= 백엔드 post_id)
  sellerId: number; // 판매자 id
  buyerId?: number; // 테스트용: 현재 유저(나). 실제 앱에선 생략(백엔드가 인증값 사용)
}

export default function ChatButton({ postId, sellerId, buyerId }: ChatButtonProps) {
  const [roomId, setRoomId] = useState<number | null>(null);     // 열린 방
  const [rooms, setRooms] = useState<RoomSummary[] | null>(null); // 방 목록(N개일 때)

  const isOpen = roomId !== null || rooms !== null;

  const handleClick = async () => {
    if (isOpen) {
      // 다시 누르면 전체 닫기
      setRoomId(null);
      setRooms(null);
      return;
    }
    try {
      // enter → 항상 방 배열 반환 (구매자는 1개 보장, 판매자는 0~N개)
      const res = await api.post('/api/v1/chat/rooms/enter', { postId, sellerId, buyerId });
      const list: RoomSummary[] = res.data.data ?? [];

      if (list.length === 1) {
        setRoomId(list[0].id); // 1개면 목록 안 거치고 바로 열기
      } else if (list.length === 0) {
        alert('아직 대화가 없습니다.');
      } else {
        setRooms(list); // N개면 목록 표시
      }
    } catch (e) {
      console.error('[ChatButton] enter 실패', e);
      alert('채팅방을 열지 못했습니다. (백엔드 확인 필요)');
    }
  };

  return (
    <div className={styles.chatButton}>
      <button type="button" onClick={handleClick}>
        {isOpen ? '채팅 닫기' : '채팅하기'}
      </button>

      {/* 방 열림. 목록에서 들어온 경우 '목록으로' 뒤로가기 제공 */}
      {roomId !== null && (
        <>
          {rooms && (
            <button type="button" onClick={() => setRoomId(null)}>
              ← 목록으로
            </button>
          )}
          <ChatRoom roomId={roomId} myId={buyerId} />
        </>
      )}

      {/* 방 N개 → 목록 표시 */}
      {roomId === null && rooms && <ChatRoomList rooms={rooms} onSelect={setRoomId} />}
    </div>
  );
}
