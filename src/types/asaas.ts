
export type ManualCardStatus = 'APPROVED' | 'DENIED' | 'ANALYSIS';

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
  manualCardStatus: string;
}

export interface AsaasCustomer {
  id?: string;
  name: string;
  email: string;
  cpfCnpj: string;
  phone?: string;
  mobilePhone?: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  city?: string;
  state?: string;
}

export interface AsaasPayment {
  id?: string;
  customer: string;
  billingType: string;
  value: number;
  dueDate: string;
  description?: string;
  creditCard?: {
    holderName: string;
    number: string;
    expiryMonth: string;
    expiryYear: string;
    ccv: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone?: string;
    mobilePhone?: string;
  };
}

export interface AsaasPaymentInfo {
  id: string;
  dateCreated: string;
  customer: string;
  value: number;
  status: string;
  description?: string;
  billingType: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  invoiceUrl?: string;
  invoiceNumber?: string;
  externalReference?: string;
}

export interface AsaasPaymentResponse {
  id: string;
  dateCreated: string;
  customer: string;
  value: number;
  netValue: number;
  status: string;
  description?: string;
  billingType: string;
  invoiceUrl?: string;
  bankSlipUrl?: string;
}

export interface AsaasPixQrCodeResponse {
  success: boolean;
  encodedImage: string;
  payload: string;
  expirationDate: string;
}

export interface AsaasApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  errors?: Array<{
    code: string;
    description: string;
  }>;
}
