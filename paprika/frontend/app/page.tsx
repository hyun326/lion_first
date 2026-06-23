/**
 * 홈 - 상품 목록 피드
 * 화면 참조: _5 (Paprika - Fresh Neighborhood Market)
 * 담당: B - 백성민 (상품 목록/검색), A - 민동현 (로그인 상태 연동)
 *
 * TODO:
 *  - 상품 목록 API 호출 (GET /api/v1/products)
 *  - 카테고리 필터
 *  - 검색 기능
 *  - 무한 스크롤 또는 페이지네이션
 */
import ProductCard from '@/components/product/ProductCard';
import { sampleProducts } from '@/lib/sampleProducts';
import styles from './page.module.css';

const categoryItems = [
  { label: 'Electronics', icon: 'devices' },
  { label: 'Fashion', icon: 'checkroom' },
  { label: 'Home', icon: 'home' },
  { label: 'Kids', icon: 'toys' },
  { label: 'Sports', icon: 'sports_tennis' },
  { label: 'Books', icon: 'menu_book' },
  { label: 'Hobbies', icon: 'palette' },
  { label: 'Others', icon: 'more_horiz' },
];

export default function HomePage() {
  return (
    <main className={styles.container}>
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <p className={styles.heroOverline}>Paprika</p>
          <h1 className={styles.heroTitle}>
            The neighborhood marketplace for <span>fresh finds.</span>
          </h1>
          <p className={styles.heroSubtitle}>
            Snap a photo, set a price, and sell to your neighbors in minutes. It’s that easy.
          </p>
          <div className={styles.searchCard}>
            <span className="material-symbols-outlined">search</span>
            <input type="search" placeholder="Search for items near you..." />
            <button type="button">Search</button>
          </div>
          <p className={styles.trending}>Trending: Vintage Camera Coffee Table Nike Dunks Plants</p>
        </div>
        <div className={styles.heroVisual}>
          <div className={styles.heroBanner}>
            <span className={styles.badge}>Sell</span>
          </div>
        </div>
      </section>

      <section className={styles.categoryGrid}>
        {categoryItems.map((item) => (
          <button key={item.label} type="button" className={styles.categoryItem}>
            <span className="material-symbols-outlined">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </section>

      <section className={styles.cardSection}>
        <div className={styles.sectionHeader}>
          <h2>New Arrivals</h2>
          <button type="button">View All</button>
        </div>
        <div className={styles.grid}>
          {sampleProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section className={styles.ctaCard}>
        <div>
          <h2>Turn your clutter into cash</h2>
          <p>Snap a photo, set a price, and sell to your neighbors in minutes. It’s that easy.</p>
        </div>
        <button type="button">Start Selling Now</button>
      </section>

      <section className={styles.recommendedSection}>
        <div className={styles.sectionHeader}>
          <h2>Recommended for You</h2>
          <button type="button">See more</button>
        </div>
        <div className={styles.recommendedGrid}>
          {sampleProducts.map((product) => (
            <ProductCard key={`rec-${product.id}`} product={product} />
          ))}
        </div>
      </section>
    </main>
  );
}
