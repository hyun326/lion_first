/**
 * 하단 탭 내비게이션 (모바일)
 * 담당: 공통
 *
 * 탭: 홈 | 채팅 | 상품등록 | 마이페이지
 * 활성 탭은 Primary Orange 색상
 *
 * TODO: 구현
 */
import Link from 'next/link';
import styles from './BottomTabBar.module.css';

export default function BottomTabBar() {
  return (
    <nav className={styles.tabBar}>
      <Link href="/" className={styles.tab} aria-label="Home">
        <span className="material-symbols-outlined">home</span>
        <span>홈</span>
      </Link>
      <Link href="/chat" className={styles.tab} aria-label="Chat">
        <span className="material-symbols-outlined">chat</span>
        <span>채팅</span>
      </Link>
      <Link href="/products/new" className={styles.tab} aria-label="Sell">
        <span className="material-symbols-outlined">add_circle</span>
        <span>등록</span>
      </Link>
      <Link href="/mypage" className={styles.tab} aria-label="My Page">
        <span className="material-symbols-outlined">person</span>
        <span>마이페이지</span>
      </Link>
    </nav>
  );
}
