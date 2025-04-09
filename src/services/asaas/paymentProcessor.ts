
import { AsaasPayment, AsaasSettings } from '@/types/asaas';
import { processPayment as processPaymentApi } from './core/apiService';
import { getAsaasPixQrCode } from './pixService';
import { logger } from '@/utils/logger';

/**
 * Process a payment through Asaas
 * @param paymentData Payment data
 * @param settings Asaas settings
 * @returns Promise with payment result including QR code if PIX
 */
export async function processAsaasPayment(
  paymentData: AsaasPayment,
  settings: AsaasSettings
) {
  const { apiKey, sandboxMode } = settings;
  
  try {
    logger.log('Processing payment through Asaas', { 
      billingType: paymentData.billingType,
      value: paymentData.value
    });
    
    // Create sanitized payment data with only the allowed billing types
    const sanitizedPaymentData = {
      customer: {
        name: paymentData.customer,
        email: '',
        cpfCnpj: ''
      },
      // Restrict billingType to only allowed values
      billingType: paymentData.billingType === 'CREDIT_CARD' || paymentData.billingType === 'PIX' 
        ? paymentData.billingType 
        : 'PIX', // Default to PIX if an unsupported type is provided
      value: paymentData.value,
      description: paymentData.description
    };
    
    const paymentResult = await processPaymentApi(sanitizedPaymentData, apiKey, sandboxMode);
    
    if (!paymentResult.success) {
      throw new Error(paymentResult.error || 'Unknown payment error');
    }
    
    // For PIX payments, we need to get the QR code
    if (sanitizedPaymentData.billingType === 'PIX' && paymentResult.paymentId) {
      logger.log('Getting PIX QR code for payment', paymentResult.paymentId);
      
      const pixResult = await getAsaasPixQrCode(paymentResult.paymentId, settings);
      
      if (!pixResult.success) {
        // Extract the message if it's an object
        const errorMessage = typeof pixResult.error === 'object' && pixResult.error !== null
          ? pixResult.error.message
          : String(pixResult.error || 'Failed to retrieve PIX QR code');
        
        throw new Error(errorMessage);
      }
      
      // Access data from the data property of the response
      return {
        ...paymentResult,
        pixQrCode: pixResult.data?.payload,
        pixQrCodeImage: pixResult.data?.encodedImage,
        pixExpirationDate: pixResult.data?.expirationDate
      };
    }
    
    return paymentResult;
  } catch (error) {
    logger.error('Error processing payment:', error);
    throw error;
  }
}
