
import { AsaasSettings, AsaasCustomer, AsaasPayment } from '@/types/asaas';
import { createAsaasCustomer } from './asaas/asaasApiService';
import { createPayment, retrievePixQrCode } from './asaas/paymentService';
import { logger } from '@/utils/logger';

// Customer creation
export async function createCustomer(
  customerData: AsaasCustomer,
  settings: AsaasSettings
) {
  const { apiKey, sandboxMode } = settings;
  
  try {
    logger.log('Creating customer in Asaas');
    return await createAsaasCustomer(customerData, apiKey, sandboxMode);
  } catch (error) {
    logger.error('Error creating customer:', error);
    throw error;
  }
}

// Payment creation
export async function processPayment(
  paymentData: AsaasPayment,
  settings: AsaasSettings
) {
  const { apiKey, sandboxMode } = settings;
  
  try {
    logger.log('Processing payment through Asaas');
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
    
    const paymentResult = await createPayment(sanitizedPaymentData);
    
    if (!paymentResult.success) {
      throw new Error(paymentResult.error || 'Unknown payment error');
    }
    
    // For PIX payments, we need to get the QR code
    if (sanitizedPaymentData.billingType === 'PIX' && paymentResult.paymentId) {
      logger.log('Getting PIX QR code for payment', paymentResult.paymentId);
      
      const pixResult = await retrievePixQrCode(
        paymentResult.paymentId,
        apiKey,
        sandboxMode
      );
      
      if (!pixResult.success) {
        // Fix the error handling by extracting the message if it's an object
        const errorMessage = typeof pixResult.error === 'object' && pixResult.error !== null
          ? pixResult.error.message
          : pixResult.error || 'Failed to retrieve PIX QR code';
        
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

// Get PIX QR code
export async function getPixQrCode(
  paymentId: string,
  settings: AsaasSettings
) {
  const { apiKey, sandboxMode } = settings;
  
  try {
    logger.log('Getting PIX QR code for payment', paymentId);
    return await retrievePixQrCode(paymentId, apiKey, sandboxMode);
  } catch (error) {
    logger.error('Error getting PIX QR code:', error);
    throw error;
  }
}
