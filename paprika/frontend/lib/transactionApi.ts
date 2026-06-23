import api from '@/lib/api';
import type { ApiResponse } from '@/types';
import type {
  DeliveryInvoicePayload,
  DeliveryStatusPayload,
  DirectMeetingPayload,
  TaxInvoiceResponse,
  TransactionCreatePayload,
  TransactionResponse,
} from '@/types/transaction';

function unwrap<T>(response: ApiResponse<T>): T {
  if (!response.success || response.data == null) {
    throw new Error(response.message || '요청에 실패했습니다.');
  }
  return response.data;
}

export async function createTransaction(payload: TransactionCreatePayload): Promise<TransactionResponse> {
  const { data } = await api.post<ApiResponse<TransactionResponse>>('/api/transactions', payload);
  return unwrap(data);
}

export async function getTaxInvoice(transactionId: number): Promise<TaxInvoiceResponse> {
  const { data } = await api.get<ApiResponse<TaxInvoiceResponse>>(
    `/api/transactions/${transactionId}/tax-invoice`
  );
  return unwrap(data);
}

export async function getMyTransactions(): Promise<TransactionResponse[]> {
  const { data } = await api.get<ApiResponse<TransactionResponse[]>>('/api/transactions/my');
  return unwrap(data);
}

export async function getTransaction(transactionId: number): Promise<TransactionResponse> {
  const { data } = await api.get<ApiResponse<TransactionResponse>>(`/api/transactions/${transactionId}`);
  return unwrap(data);
}

export async function updateDirectMeeting(
  transactionId: number,
  payload: DirectMeetingPayload
): Promise<TransactionResponse> {
  const { data } = await api.patch<ApiResponse<TransactionResponse>>(
    `/api/transactions/${transactionId}/direct-meeting`,
    payload
  );
  return unwrap(data);
}

export async function confirmDirectComplete(transactionId: number): Promise<TransactionResponse> {
  const { data } = await api.patch<ApiResponse<TransactionResponse>>(
    `/api/transactions/${transactionId}/direct-complete`,
    {}
  );
  return unwrap(data);
}

export async function updateDeliveryInvoice(
  transactionId: number,
  payload: DeliveryInvoicePayload
): Promise<TransactionResponse> {
  const { data } = await api.patch<ApiResponse<TransactionResponse>>(
    `/api/transactions/${transactionId}/delivery/invoice`,
    payload
  );
  return unwrap(data);
}

export async function updateDeliveryStatus(
  transactionId: number,
  payload: DeliveryStatusPayload
): Promise<TransactionResponse> {
  const { data } = await api.patch<ApiResponse<TransactionResponse>>(
    `/api/transactions/${transactionId}/delivery/status`,
    payload
  );
  return unwrap(data);
}

export async function confirmDeliveryReceive(transactionId: number): Promise<TransactionResponse> {
  const { data } = await api.patch<ApiResponse<TransactionResponse>>(
    `/api/transactions/${transactionId}/delivery/receive`
  );
  return unwrap(data);
}

/** dev/local 전용 API */
export async function markDevDeliveryDelivered(transactionId: number): Promise<TransactionResponse> {
  const { data } = await api.patch<ApiResponse<TransactionResponse>>(
    `/api/transactions/${transactionId}/delivery/dev-delivered`
  );
  return unwrap(data);
}
