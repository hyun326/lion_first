/**
 * 채팅방 목록 아이템
 * 담당: C - 한대천
 * TODO: 구현
 */
import styles from './ChatRoomItem.module.css';
import type { ChatRoom } from '@/types';

export default function ChatRoomItem({ room }: { room: ChatRoom }) {
  return (
    <div className={styles.room}>
      <div className={styles.avatar}>
        <img src={room.counterpartProfileImageUrl || '/images/avatar-placeholder.png'} alt={room.counterpartNickname} />
      </div>

      <div className={styles.info}>
        <div className={styles.titleRow}>
          <div className={styles.name}>{room.counterpartNickname}</div>
          <div className={styles.preview}>{room.lastMessageAt ? new Date(room.lastMessageAt).toLocaleTimeString() : ''}</div>
        </div>
        <div className={styles.preview}>{room.lastMessage || 'No messages yet'}</div>
      </div>

      {room.unreadCount > 0 && <div className={styles.unread}>{room.unreadCount}</div>}
    </div>
  );
}
