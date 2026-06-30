'use client';

/**
 * 공개 채팅방 (로그인 없이 누구나 참여)
 * 담당: C - 한대천
 *
 * 현재: 입력하면 로컬에서 바로 메시지 추가(데모).
 * TODO:
 *  - WebSocket(STOMP) /topic/public 구독 + /app/public 발행으로 교체
 *  - 게스트 이름 localStorage 저장 / 입력 모달
 *  - 접속자 목록 실시간(presence)
 */
import { useState } from 'react';
import styles from './page.module.css';

interface Message {
  id: number;
  name: string;
  text: string;
  mine: boolean;
}

const sampleUsers = ['RetroLover99', 'CameraFan', 'Buyer123'];

export default function PublicChatPage() {
  // 게스트 임시 이름 (TODO: localStorage / 로그인 닉네임)
  const [name] = useState(() => '게스트-' + Math.floor(1000 + Math.random() * 9000));
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, name: 'CameraFan', text: '안녕하세요, 공개방입니다 👋', mine: false },
  ]);
  const [input, setInput] = useState('');

  const send = () => {
    const text = input.trim();
    if (!text) return;
    setMessages((prev) => [...prev, { id: Date.now(), name, text, mine: true }]);
    setInput('');
    // TODO: WebSocket /app/public 으로 발행
  };

  return (
    <div className={styles.chat}>
      <section>
        <header>전체 공개 채팅방 · {name}</header>

        <ul>
          {messages.map((m) => (
            <li key={m.id} data-mine={m.mine || undefined}>
              {!m.mine && <strong>{m.name}</strong>}
              {m.text}
            </li>
          ))}
        </ul>

        <footer>
          <input
            type="text"
            placeholder="메시지를 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') send();
            }}
          />
          <button type="button" onClick={send}>
            전송
          </button>
        </footer>
      </section>

      <aside>
        <h2>접속자 목록</h2>
        <ul>
          {sampleUsers.map((u) => (
            <li key={u}>{u}</li>
          ))}
        </ul>
      </aside>
    </div>
  );
}
