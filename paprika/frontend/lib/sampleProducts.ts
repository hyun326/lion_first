import type { Product } from '@/types';

/** 개발용 샘플 상품 (상품 API 연동 전까지 홈·상세·거래 페이지 공통 사용) */
export const sampleProducts: Product[] = [
  {
    id: 1,
    sellerId: 10,
    sellerNickname: 'RetroLover99',
    title: 'Mahogany Coffee Table',
    description: 'Rich mahogany coffee table in excellent condition.',
    price: 120,
    status: 'SELLING',
    category: 'Home',
    location: 'Brooklyn, NY',
    imageUrls: ['/images/product-placeholder.svg'],
    viewCount: 1200,
    wishCount: 25,
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    sellerId: 11,
    sellerNickname: 'KeyboardMaster',
    title: 'Custom Mechanical Keyboard',
    description: 'Handcrafted TKL keyboard with hot-swap switches.',
    price: 85,
    status: 'SELLING',
    category: 'Electronics',
    location: 'Jersey City, NJ',
    imageUrls: ['/images/product-placeholder.svg'],
    viewCount: 780,
    wishCount: 19,
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    sellerId: 12,
    sellerNickname: 'BikeLover',
    title: 'Trek Mountain Bike',
    description: 'Lightly used all-terrain bike, great for hiking trails.',
    price: 450,
    status: 'RESERVED',
    category: 'Sports',
    location: 'Queens, NY',
    imageUrls: ['/images/product-placeholder.svg'],
    viewCount: 430,
    wishCount: 12,
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    sellerId: 13,
    sellerNickname: 'PlantPeople',
    title: 'Velvet Reading Chair',
    description: 'Cozy accent chair in soft velvet fabric.',
    price: 175,
    status: 'SELLING',
    category: 'Home',
    location: 'Hoboken, NJ',
    imageUrls: ['/images/product-placeholder.svg'],
    viewCount: 980,
    wishCount: 33,
    createdAt: new Date().toISOString(),
  },
];

export function getSampleProductById(id: number): Product | undefined {
  return sampleProducts.find((product) => product.id === id);
}
