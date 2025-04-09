
export type ManualCardStatus = 'APPROVED' | 'DENIED' | 'ANALYSIS';

export interface AsaasSettings {
  isEnabled: boolean;
  apiKey: string;
  allowPix: boolean;
  allowCreditCard: boolean;
  manualCreditCard: boolean;
  sandboxMode: boolean;
  sandboxApiKey: string;
  productionApiKey: string;
  manualCardProcessing: boolean;
  manualPixPage: boolean;
  manualPaymentConfig: boolean;
  manualCardStatus: ManualCardStatus;
}

export interface AsaasPaymentInfo {
  id: string;
  customer: string;
  value: number;
  netValue: number;
  billingType: string;
  status: string;
  dueDate: string;
  paymentDate?: string;
  clientPaymentDate?: string;
  installmentCount?: number;
  invoiceUrl: string;
  bankSlipUrl?: string;
  invoiceNumber: string;
  externalReference?: string;
  deleted: boolean;
  postalService: boolean;
  creditCard?: {
    creditCardNumber: string;
    creditCardBrand: string;
    creditCardToken: string;
  };
  creditCardHolderInfo?: {
    name: string;
    email: string;
    cpfCnpj: string;
    postalCode: string;
    addressNumber: string;
    addressComplement?: string;
    phone: string;
    mobilePhone: string;
  };
  fine?: {
    value: number;
    type: string;
  };
  interest?: {
    value: number;
    type: string;
  };
  discount?: {
    value: number;
    limitDate: string;
    type: string;
    dueDateLimitDays: number;
  };
}

export interface AsaasPixInfo {
  encodedImage: string;
  payload: string;
  expirationDate: string;
}
