
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

export interface CustomerInfo {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
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
  productPrice?: number; // Legacy compatibility
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
  orderDate?: string; // Legacy compatibility
  
  // Legacy compatibility for component interfaces
  customer?: {
    name: string;
    email: string;
    cpf: string;
    phone?: string;
    address?: {
      street?: string;
      number?: string;
      complement?: string;
      neighborhood?: string;
      city?: string;
      state?: string;
      postalCode?: string;
    };
  };
}

export interface CreateOrderInput {
  customer: CustomerInfo;
  productId: number | string;
  productName: string;
  productPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  cardDetails?: CardDetails;
  pixDetails?: PixDetails;
  orderDate?: string;
  deviceType?: string;
  isDigitalProduct?: boolean;
}
