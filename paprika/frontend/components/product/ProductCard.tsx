/**
 * 상품 카드 컴포넌트 (목록에서 사용)
 * 담당: B - 백성민
 *
 * TODO:
 *  - 상품 썸네일 이미지
 *  - 제목, 가격, 위치, 시간
 *  - 상태 배지 (판매중/예약중/판매완료)
 *  - 관심 버튼 (하트)
 */
import Link from 'next/link';
import styles from './ProductCard.module.css';
import type { Product } from '@/types';
import StatusBadge from './StatusBadge';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`} className={styles.link}>
      <article className={styles.card}>
        <div className={styles.thumb}>
          <img src={product.imageUrls?.[0] || '/images/product-placeholder.svg'} alt={product.title} />
          <div className={styles.badgeWrap}>
            <StatusBadge status={product.status} />
          </div>
        </div>

        <div className={styles.body}>
          <h3 className={styles.title}>{product.title}</h3>
          <div className={styles.meta}>
            <span className={styles.price}>${product.price.toLocaleString()}</span>
            <span className={styles.location}>{product.location}</span>
          </div>
          <div className={styles.footer}>
            <span className={styles.wish}>❤ {product.wishCount}</span>
            <span className={styles.time}>{new Date(product.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </article>
    </Link>
  );
}
