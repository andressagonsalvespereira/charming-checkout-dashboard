
export type PaymentMethod = 'CREDIT_CARD' | 'PIX';
export type PaymentStatus = 'PENDING' | 'PAID' | 'APPROVED' | 'DENIED' | 'ANALYSIS' | 'CANCELLED';
export type DeviceType = 'desktop' | 'mobile' | 'tablet';

export interface CardDetails {
  number?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  brand?: string;
  name?: string;
  token?: string;
}

export interface PixDetails {
  qrCode?: string;
  qrCodeImage?: string;
  expirationDate?: string;
  paymentId?: string;
}

export interface Order {
  id: number | string;
  customerName: string;
  customerEmail: string;
  customerCpf: string;
  customerPhone?: string;
  productId?: number;
  productName: string;
  price: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  cardDetails?: CardDetails;
  pixDetails?: PixDetails;
  creditCardBrand?: string;
  deviceType?: DeviceType;
  isDigitalProduct?: boolean;
  asaasPaymentId?: string;
  createdAt: string;
  updatedAt: string;
}
