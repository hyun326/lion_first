/**
 * 마이페이지
 * 화면 참조: _1 (My Page - Paprika)
 * 담당: E - 장인호
 *
 * TODO:
 *  - 내 프로필 조회 (GET /api/v1/users/me)
 *  - 매너 온도 시각화 (온도계 그래픽)
 *  - 나의 거래 내역 탭 (판매중/예약중/완료)
 *  - 관심 상품(찜) 목록
 *  - 받은 리뷰 목록
 *  - 로그아웃 버튼 (A - 민동현과 연동)
 */
export default function MyPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <section style={{ display: 'grid', gap: 24 }}>
        <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-card)' }}>
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

        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-card)' }}>
            <h2>관심 상품</h2>
            <p style={{ color: 'var(--color-on-surface-variant)', marginTop: 8 }}>찜한 상품 목록이 여기에 표시됩니다.</p>
          </div>

          <div style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-card)' }}>
            <h2>거래 내역</h2>
            <p style={{ color: 'var(--color-on-surface-variant)', marginTop: 8 }}>판매중, 예약중, 완료된 거래 내역을 확인할 수 있습니다.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
