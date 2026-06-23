import api from '@/lib/api';
import type { ApiResponse, Product } from '@/types';

export async function getProduct(productId: number): Promise<Product> {
  const { data } = await api.get<ApiResponse<Product | null>>(`/api/v1/products/${productId}`);

  if (!data.success || !data.data) {
    throw new Error(data.message || '상품을 불러올 수 없습니다.');
  }

  if (data.data.sellerId == null) {
    throw new Error('상품에 판매자 ID(sellerId)가 없습니다. 상품 API 응답을 확인해주세요.');
  }

  return data.data;
}
