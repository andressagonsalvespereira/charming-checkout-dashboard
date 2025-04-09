
export type PaymentMethod = 'CREDIT_CARD' | 'PIX';
export type PaymentStatus = 'PENDING' | 'PAID' | 'DENIED' | 'ANALYSIS' | 'CANCELLED';
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

// Tipo que representa os dados conforme retornados do Supabase (snake_case)
export interface RawOrder {
  id: number | string;
  customer_name: string;
  customer_email: string;
  customer_cpf: string;
  customer_phone?: string;
  product_id?: number;
  product_name: string;
  price: number;
  payment_method: string;
  payment_status: string;
  payment_id?: string;
  credit_card_brand?: string;
  device_type?: string;
  is_digital_product?: boolean;
  asaas_payment_id?: string;
  created_at: string;
  updated_at: string;
  // Campos adicionais que não estão no banco de dados
  card_details?: CardDetails;
  pix_details?: PixDetails;
}

// Tipo usado internamente na aplicação (camelCase)
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
