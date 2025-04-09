
export interface AsaasCustomer {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  mobilePhone?: string;
  cpfCnpj: string;
  postalCode?: string;
  address?: string;
  addressNumber?: string;
  complement?: string;
  province?: string;
  externalReference?: string;
  notificationDisabled?: boolean;
  additionalEmails?: string;
  municipalInscription?: string;
  stateInscription?: string;
}

export interface AsaasPayment {
  id?: string;
  customer: string;
  billingType: 'CREDIT_CARD' | 'PIX' | 'BOLETO' | 'UNDEFINED';
  value: number;
  dueDate?: string;
  description?: string;
  externalReference?: string;
  installmentCount?: number;
  totalValue?: number;
  creditCard?: any;
  creditCardHolderInfo?: any;
  remoteIp?: string;
  status?: string;
}

export interface AsaasSettings {
  apiKey: string;
  sandboxMode: boolean;
  allowCreditCard: boolean;
  allowPix: boolean;
  manualCardStatus: ManualCardStatus;
}

export type ManualCardStatus = 'APPROVED' | 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'REJECTED' | 'ANALYSIS';

export interface AsaasApiResponse<T> {
  data: T | null;
  error: {
    message: string;
    code: string;
  } | null;
  success: boolean;
}
