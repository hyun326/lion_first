/**
 * 회원가입 페이지
 * 담당: A - 민동현
 *
 * TODO:
 *  - 이메일/닉네임/비밀번호 입력 폼
 *  - 이메일 중복 체크
 *  - 가입 후 자동 로그인 처리
 */
import Link from 'next/link';

export default function RegisterPage() {
  return (
    <main style={{ padding: 24, maxWidth: 500, margin: '0 auto' }}>
      <section style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-card)' }}>
        <h1>회원가입</h1>
        <div style={{ display: 'grid', gap: 16, marginTop: 24 }}>
          <input type="email" placeholder="이메일" style={{ padding: 14, borderRadius: 16, border: '1px solid var(--color-outline-variant)' }} />
          <input type="text" placeholder="닉네임" style={{ padding: 14, borderRadius: 16, border: '1px solid var(--color-outline-variant)' }} />
          <input type="password" placeholder="비밀번호" style={{ padding: 14, borderRadius: 16, border: '1px solid var(--color-outline-variant)' }} />
          <button style={{ padding: '14px 18px', borderRadius: 16, background: 'var(--color-primary)', color: 'white', fontWeight: 700 }}>회원가입</button>
          <div style={{ textAlign: 'center', color: 'var(--color-on-surface-variant)' }}>
            이미 계정이 있으신가요? <Link href="/login" style={{ color: 'var(--color-primary)' }}>로그인</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
