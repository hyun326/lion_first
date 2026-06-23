/**
 * 로그인 페이지
 * 담당: A - 민동현
 *
 * TODO:
 *  - 이메일/비밀번호 로그인 폼
 *  - 소셜 로그인 버튼 (Google, Naver, GitHub)
 *  - JWT 토큰 저장 후 홈으로 리다이렉트
 */
import Link from 'next/link';

export default function LoginPage() {
  return (
    <main style={{ padding: 24, maxWidth: 500, margin: '0 auto' }}>
      <section style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-card)' }}>
        <h1>로그인</h1>
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <input type="email" placeholder="이메일" style={{ padding: 14, borderRadius: 16, border: '1px solid var(--color-outline-variant)' }} />
          <input type="password" placeholder="비밀번호" style={{ padding: 14, borderRadius: 16, border: '1px solid var(--color-outline-variant)' }} />
          <button style={{ padding: '14px 18px', borderRadius: 16, background: 'var(--color-primary)', color: 'white', fontWeight: 700 }}>로그인</button>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--color-on-surface-variant)', fontSize: 14 }}>
            <button style={{ background: 'transparent', border: 'none', color: 'var(--color-primary)' }}>비밀번호 찾기</button>
            <Link href="/register" style={{ color: 'var(--color-primary)' }}>회원가입</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
