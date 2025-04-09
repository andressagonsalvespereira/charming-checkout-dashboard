
export type ManualCardStatus = 'CONFIRMED' | 'RECEIVED' | 'PENDING' | 'APPROVED' | 'CANCELLED' | 'FAILED' | 'ANALYSIS' | 'REJECTED';

export interface AsaasSettings {
  isEnabled: boolean;
  apiKey: string;
  allowCreditCard: boolean;
  allowPix: boolean;
  manualCreditCard: boolean;
  sandboxMode: boolean;
  sandboxApiKey: string;
  productionApiKey: string;
  manualCardProcessing: boolean;
  manualPixPage: boolean;
  manualPaymentConfig: boolean;
  manualCardStatus: ManualCardStatus;
}

export interface AsaasPayment {
  customer: string;
  value: number;
  billingType: 'CREDIT_CARD' | 'PIX';
  description?: string;
  dueDate?: string;
  creditCard?: any;
  creditCardHolderInfo?: any;
}

export interface AsaasResponse {
  id: string;
  dateCreated: string;
  customer: string;
  value: number;
  netValue: number;
  billingType: string;
  status: string;
  dueDate: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  installmentCount?: number;
  invoiceUrl?: string;
  bankSlipUrl?: string;
  invoiceNumber?: string;
  deleted: boolean;
  postalService: boolean;
  anticipated: boolean;
  creditCard?: {
    creditCardToken: string;
    creditCardBrand: string;
    creditCardNumber: string;
  };
}
