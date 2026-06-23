/**
 * 채팅 메시지 버블
 * 담당: C - 한대천
 * TODO: 내 메시지 (오른쪽, Primary 색상) / 상대 메시지 (왼쪽, 회색)
 */
import type { ChatMessage } from '@/types';

interface MessageBubbleProps {
  message: ChatMessage;
  isMine: boolean;
}

export default function MessageBubble({ message, isMine }: MessageBubbleProps) {
  return <div>{/* TODO: 구현 */}</div>;
}
