export type TransactionType = 'DIRECT' | 'DELIVERY';

export type PaymentMethod = 'CASH' | 'CARD';

export type TaxInvoiceStatus = 'NOT_REQUESTED' | 'REQUESTED' | 'ISSUED';

export type TransactionStatus =
  | 'REQUESTED'
  | 'MEETING_SET'
  | 'MEETING_COMPLETED'
  | 'PREPARING'
  | 'SHIPPED'
  | 'IN_TRANSIT'
  | 'DELIVERED'
  | 'COMPLETED';

export type DeliveryStatus = 'PREPARING' | 'SHIPPED' | 'IN_TRANSIT' | 'DELIVERED';

export interface TransactionResponse {
  id: number;
  productId: number;
  buyerId: number;
  sellerId: number;
  counterpartId: number | null;
  transactionType: TransactionType;
  status: TransactionStatus;
  amount: number;
  paymentMethod?: PaymentMethod;
  taxInvoiceStatus?: TaxInvoiceStatus;
  taxInvoiceCompanyName?: string | null;
  taxInvoiceBusinessNumber?: string | null;
  taxInvoiceEmail?: string | null;
  taxInvoiceNumber?: string | null;
  taxInvoiceIssuedAt?: string | null;
  taxInvoiceSupplyAmount?: number | null;
  taxInvoiceVatAmount?: number | null;
  meetingPlaceName?: string | null;
  meetingAddress?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  meetingAt?: string | null;
  courierCompany?: string | null;
  trackingNumber?: string | null;
  deliveryStatus?: DeliveryStatus | null;
  buyerCompleteConfirmed: boolean;
  sellerCompleteConfirmed: boolean;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TransactionCreatePayload {
  productId: number;
  sellerId: number;
  transactionType: TransactionType;
  amount: number;
  paymentMethod: PaymentMethod;
  taxInvoiceRequested: boolean;
  taxInvoiceCompanyName?: string;
  taxInvoiceBusinessNumber?: string;
  taxInvoiceEmail?: string;
}

export interface TaxInvoiceResponse {
  transactionId: number;
  status: TaxInvoiceStatus;
  invoiceNumber?: string | null;
  issuedAt?: string | null;
  companyName?: string | null;
  businessNumber?: string | null;
  email?: string | null;
  supplyAmount?: number | null;
  vatAmount?: number | null;
  totalAmount: number;
  paymentMethod: PaymentMethod;
}

export interface DirectMeetingPayload {
  meetingPlaceName: string;
  meetingAddress: string;
  latitude: number;
  longitude: number;
  meetingAt: string;
}

export interface DeliveryInvoicePayload {
  courierCompany: string;
  trackingNumber: string;
}

export interface DeliveryStatusPayload {
  status: DeliveryStatus;
}

export function getPaymentMethodLabel(method: PaymentMethod): string {
  return method === 'CASH' ? '현금' : '카드';
}

export function getTaxInvoiceStatusLabel(status: TaxInvoiceStatus): string {
  switch (status) {
    case 'REQUESTED':
      return '발행 대기';
    case 'ISSUED':
      return '발행 완료';
    default:
      return '미요청';
  }
}
