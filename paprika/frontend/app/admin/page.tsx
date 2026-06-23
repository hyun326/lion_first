/**
 * 관리자 백오피스
 * 담당: E - 장인호
 *
 * TODO:
 *  - 관리자 권한 가드 (A - 민동현과 연동)
 *  - 공지사항 CRUD
 *  - 카테고리 관리
 *  - 신고 접수 목록 및 처리
 *  - 유저 정지/해제
 */
export default function AdminPage() {
  return (
    <main style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <section style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-card)' }}>
        <h1>관리자 대시보드</h1>
        <p style={{ color: 'var(--color-on-surface-variant)', marginTop: 8 }}>공지, 신고, 카테고리 관리를 위한 관리 도구 화면입니다.</p>

        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <div style={{ background: 'white', borderRadius: 20, padding: 18, border: '1px solid var(--color-outline-variant)' }}>
            <h2>공지사항 관리</h2>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>공지 목록 및 신규 공지 등록 기능</p>
          </div>
          <div style={{ background: 'white', borderRadius: 20, padding: 18, border: '1px solid var(--color-outline-variant)' }}>
            <h2>신고 접수</h2>
            <p style={{ color: 'var(--color-on-surface-variant)' }}>사용자 신고 처리 화면</p>
          </div>
        </div>
      </section>
    </main>
  );
}
