/**
 * 채팅 페이지 (좌: 채팅창 / 우: 접속자 목록)
 * 담당: C - 한대천
 *
 * TODO:
 *  - 채팅 메시지 목록 API 호출 / WebSocket 연동
 *  - 접속자 목록 실시간 갱신
 */
import styles from './page.module.css';

const sampleUsers = ['RetroLover99', 'CameraFan', 'Buyer123'];

export default function ChatPage() {
  return (
    <div className={styles.container}>
      <section className={styles.chatPanel}>
        <div className={styles.chatHeader}>채팅</div>
        <div className={styles.messageList}>{/* TODO: 메시지 목록 */}</div>
      </section>

      <aside className={styles.usersPanel}>
        <div className={styles.usersTitle}>접속자 목록</div>
        {sampleUsers.map((user) => (
          <div key={user} className={styles.userItem}>
            {user}
          </div>
        ))}
      </aside>
    </div>
  );
}
