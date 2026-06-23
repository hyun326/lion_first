/**
 * 상품 등록 페이지
 * 화면 참조: _3 (Sell on Paprika | Product Registration)
 * 담당: B - 백성민
 *
 * TODO:
 *  - 이미지 업로드 (최대 10장)
 *  - 제목, 카테고리, 가격, 설명 입력 폼
 *  - 지도 API로 거래 위치 설정 (Kakao/Google Maps)
 *  - 임시 저장 기능
 *  - 상품 등록 API 호출 (POST /api/v1/products)
 */
export default function NewProductPage() {
  return (
    <main style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      <section style={{ background: 'var(--color-surface-container-lowest)', borderRadius: 24, padding: 24, boxShadow: 'var(--shadow-card)' }}>
        <h1>상품 등록</h1>
        <p style={{ color: 'var(--color-on-surface-variant)', marginBottom: 24 }}>상품 정보를 입력하고 이미지를 업로드하면 등록 준비가 완료됩니다.</p>

        <div style={{ display: 'grid', gap: 20 }}>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>상품 제목</label>
            <input style={{ padding: 14, borderRadius: 16, border: '1px solid var(--color-outline-variant)' }} placeholder="예: 빈티지 캐논 AE-1" />
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>카테고리</label>
            <select style={{ padding: 14, borderRadius: 16, border: '1px solid var(--color-outline-variant)' }}>
              <option>카테고리 선택</option>
              <option>Electronics</option>
              <option>Home</option>
              <option>Fashion</option>
            </select>
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>가격</label>
            <input type="number" style={{ padding: 14, borderRadius: 16, border: '1px solid var(--color-outline-variant)' }} placeholder="₩0" />
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>상품 설명</label>
            <textarea rows={6} style={{ padding: 14, borderRadius: 16, border: '1px solid var(--color-outline-variant)', resize: 'vertical' }} placeholder="상품 상태, 특징, 거래 지역 등을 입력해 주세요." />
          </div>
          <div style={{ display: 'grid', gap: 8 }}>
            <label>사진 업로드</label>
            <div style={{ minHeight: 140, borderRadius: 20, border: '1px dashed var(--color-outline-variant)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-on-surface-variant)' }}>
              이미지 업로드 영역 (최대 10장)
            </div>
          </div>
          <button style={{ padding: '16px 20px', borderRadius: 16, background: 'var(--color-primary)', color: 'white', fontWeight: 700 }}>상품 등록하기</button>
        </div>
      </section>
    </main>
  );
}
