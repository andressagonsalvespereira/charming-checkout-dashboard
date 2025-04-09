
import { createAsaasCustomer, createAsaasPayment, getPixQrCode } from './asaasApiService';
import { loadAsaasSettings } from '../settingsService';
import { AsaasPayment } from '@/types/asaas';
import { logger } from '@/utils/logger';

// Interface that represents the result of creating a payment
export interface CreatePaymentResult {
  success: boolean;
  paymentId: string;
  status: string;
  qrCode?: string;
  qrCodeImage?: string;
  error?: string;
}

// Customer information required for payment
interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  cpfCnpj: string;
}

// Credit card information
interface CreditCardInfo {
  holderName: string;
  number: string;
  expiryMonth: string;
  expiryYear: string;
  ccv: string;
}

interface CreatePaymentOptions {
  customer: CustomerInfo;
  billingType: 'CREDIT_CARD' | 'PIX';
  value: number;
  creditCard?: CreditCardInfo;
  creditCardHolderInfo?: any;
  installmentCount?: number;
  description?: string;
  deviceType?: string;
  overrideGlobalStatus?: boolean;
  manualCardStatus?: string | null;
}

export const createPayment = async (options: CreatePaymentOptions): Promise<CreatePaymentResult> => {
  try {
    const settings = await loadAsaasSettings();
    if (!settings || !settings.apiKey) {
      throw new Error("Asaas settings not configured");
    }

    logger.log('Creating payment with billing type:', options.billingType);

    // Create or find customer
    const customerResponse = await createAsaasCustomer(
      {
        name: options.customer.name,
        email: options.customer.email,
        phone: options.customer.phone || undefined,
        cpfCnpj: options.customer.cpfCnpj,
        mobilePhone: options.customer.phone || undefined,
      },
      settings.apiKey,
      settings.sandboxMode
    );

    if (!customerResponse.success || !customerResponse.data) {
      logger.error('Failed to create customer:', customerResponse.error);
      throw new Error(customerResponse.error?.message || "Failed to create customer");
    }

    const customerId = customerResponse.data.id;
    logger.log('Customer created successfully with ID:', customerId);

    // Build payment data
    const paymentData: AsaasPayment = {
      customer: customerId,
      billingType: options.billingType,
      value: options.value,
      description: options.description || `Payment of R$ ${options.value}`,
      externalReference: `Payment_${Date.now()}`,
    };

    if (options.billingType === 'CREDIT_CARD' && options.creditCard && options.creditCardHolderInfo) {
      paymentData.creditCard = options.creditCard;
      paymentData.creditCardHolderInfo = options.creditCardHolderInfo;
      paymentData.installmentCount = options.installmentCount || 1;
    }

    // Create payment
    const paymentResponse = await createAsaasPayment(
      paymentData,
      settings.apiKey,
      settings.sandboxMode
    );

    if (!paymentResponse.success || !paymentResponse.data) {
      logger.error('Failed to create payment:', paymentResponse.error);
      throw new Error(paymentResponse.error?.message || "Failed to create payment");
    }

    const payment = paymentResponse.data;
    logger.log('Payment created successfully:', payment);

    let result: CreatePaymentResult = {
      success: true,
      paymentId: payment.id,
      status: payment.status
    };

    // If PIX payment, get QR code
    if (options.billingType === 'PIX') {
      const pixResponse = await getPixQrCode(
        payment.id,
        settings.apiKey,
        settings.sandboxMode
      );

      if (pixResponse.success && pixResponse.data) {
        result.qrCode = pixResponse.data.payload || '';
        result.qrCodeImage = pixResponse.data.encodedImage || '';
      } else {
        logger.warn('PIX QR code generation failed, but payment was created:', pixResponse.error);
      }
    }

    return result;
  } catch (error) {
    logger.error('Payment creation failed:', error);
    return {
      success: false,
      paymentId: '',
      status: 'FAILED',
      error: error instanceof Error ? error.message : 'Unknown payment error'
    };
  }
};

// Export the retrievePixQrCode method
export const retrievePixQrCode = async (paymentId: string, apiKey: string, sandboxMode: boolean) => {
  return await getPixQrCode(paymentId, apiKey, sandboxMode);
};
