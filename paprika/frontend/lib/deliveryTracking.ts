import type { TransactionStatus } from '@/types/transaction';

const COURIERS = ['CJ대한통운', '한진택배', '롯데택배', '우체국택배', '쿠팡로켓배송'];

export function generateTrackingNumber(): string {
  const prefix = String(Math.floor(Math.random() * 900) + 100);
  const body = String(Math.floor(Math.random() * 900000000) + 100000000);
  return `${prefix}${body}`.slice(0, 12);
}

export function randomCourier(): string {
  return COURIERS[Math.floor(Math.random() * COURIERS.length)];
}

export const DELIVERY_PROGRESS: {
  status: TransactionStatus;
  label: string;
  location: string;
}[] = [
  { status: 'REQUESTED', label: '거래 요청', location: '주문 접수 완료' },
  { status: 'PREPARING', label: '배송 준비', location: '판매자 물류센터에서 포장 중' },
  { status: 'SHIPPED', label: '발송 완료', location: '집하 완료 · 터미널로 이동 중' },
  { status: 'IN_TRANSIT', label: '배송 중', location: '배송지 인근 터미널 통과' },
  { status: 'DELIVERED', label: '배송 완료', location: '기사님 배달 중 / 도착 직전' },
  { status: 'COMPLETED', label: '거래 완료', location: '수령 완료' },
];

export function getCurrentProgress(status: TransactionStatus) {
  const index = DELIVERY_PROGRESS.findIndex((item) => item.status === status);
  if (index === -1) {
    return DELIVERY_PROGRESS[0];
  }
  return DELIVERY_PROGRESS[index];
}

export function getProgressIndex(status: TransactionStatus): number {
  const index = DELIVERY_PROGRESS.findIndex((item) => item.status === status);
  return index === -1 ? 0 : index;
}
