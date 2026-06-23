'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getSampleProductById } from '@/lib/sampleProducts';
import { getMyTransactions } from '@/lib/transactionApi';
import type { TransactionResponse } from '@/types/transaction';
import styles from './page.module.css';

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const product = getSampleProductById(Number(params.id));
  const [myTransaction, setMyTransaction] = useState<TransactionResponse | null>(null);

  useEffect(() => {
    if (!product) return;
    let cancelled = false;

    getMyTransactions()
      .then((list) => {
        if (cancelled) return;
        const active = list.find(
          (t) =>
            t.productId === product.id &&
            t.status !== 'COMPLETED' &&
            t.status !== 'CANCELLED'
        );
        setMyTransaction(active ?? null);
      })
      .catch(() => {
        // 거래 조회 실패 시 기본 '거래하기' 노출
      });

    return () => {
      cancelled = true;
    };
  }, [product]);

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

          {myTransaction && (
            <p className={styles.hint}>이미 진행 중인 거래가 있어요.</p>
          )}

          <div className={styles.actionRow}>
            <button className={styles.secondaryButton} type="button">
              관심 등록
            </button>
            <button
              className={styles.secondaryButton}
              type="button"
              onClick={() => router.push('/chat')}
            >
              채팅하기
            </button>
            {myTransaction ? (
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => router.push(`/transactions/${myTransaction.id}`)}
              >
                거래 진행 중 보기
              </button>
            ) : product.status === 'SOLD' ? (
              <button className={styles.primaryButton} type="button" disabled>
                판매완료
              </button>
            ) : (
              <button
                className={styles.primaryButton}
                type="button"
                onClick={() => router.push(`/transaction/${product.id}`)}
              >
                거래하기
              </button>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
