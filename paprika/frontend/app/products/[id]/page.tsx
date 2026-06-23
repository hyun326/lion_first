'use client';

import { useRouter } from 'next/navigation';
import { getSampleProductById } from '@/lib/sampleProducts';
import styles from './page.module.css';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const product = getSampleProductById(Number(params.id));

  if (!product) {
    return (
      <main className={styles.page}>
        <p className={styles.stateMessage}>상품을 찾을 수 없습니다.</p>
      </main>
    );
  }

  return (
    <main className={styles.page}>
      <section className={styles.gallery}>
        <div className={styles.mainImage}>
          <img
            src={product.imageUrls[0] ?? '/images/product-placeholder.svg'}
            alt={product.title}
          />
        </div>

        <div className={styles.thumbnails}>
          {product.imageUrls.map((url, index) => (
            <button key={index} className={styles.thumbnail} type="button">
              <img src={url} alt={`${product.title} ${index + 1}`} />
            </button>
          ))}
        </div>
      </section>

      <section className={styles.detailCard}>
        <div className={styles.headerRow}>
          <div>
            <p className={styles.category}>{product.category}</p>
            <h1 className={styles.title}>{product.title}</h1>
          </div>
          <p className={styles.price}>${product.price.toLocaleString()}</p>
        </div>

        <div className={styles.stats}>
          <span>{product.location}</span>
          <span>{product.viewCount} views</span>
          <span>{product.wishCount} likes</span>
        </div>

        <div className={styles.descriptionCard}>
          <h2 className={styles.descriptionTitle}>상품 설명</h2>
          <p className={styles.descriptionText}>{product.description}</p>
        </div>

        <div className={styles.sellerCard}>
          <h2 className={styles.sellerTitle}>판매자 정보</h2>
          <div className={styles.sellerInfo}>
            <div className={styles.sellerMeta}>
              <div className={styles.avatar}>
                <img
                  src="/images/avatar-placeholder.svg"
                  alt={product.sellerNickname}
                />
              </div>
              <div>
                <p className={styles.sellerName}>{product.sellerNickname}</p>
                <p className={styles.sellerSub}>Trusted seller</p>
              </div>
            </div>
            <span className={styles.sellerTag}>Manner Temperature 36.5°C</span>
          </div>
        </div>

        <div className={styles.actionsCard}>
          <h2 className={styles.actionsTitle}>거래 옵션</h2>
          <div className={styles.actionRow}>
            <button className={styles.secondaryButton} type="button">
              관심 등록
            </button>
            <button className={styles.secondaryButton} type="button">
              채팅하기
            </button>
            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => router.push(`/transaction/${product.id}`)}
            >
              거래하기
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
