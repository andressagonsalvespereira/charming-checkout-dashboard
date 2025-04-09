
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';

/**
 * Creates a customer in Asaas payment service
 * @param customerData Customer data to be sent to Asaas API
 * @param apiKey Asaas API key
 * @param sandboxMode Whether to use sandbox or production mode
 * @returns Promise with API response
 */
export async function createCustomer(
  customerData: any,
  apiKey: string,
  sandboxMode: boolean
) {
  try {
    logger.log('Creating customer in Asaas core API');
    return await createAsaasCustomer(customerData, apiKey, sandboxMode);
  } catch (error) {
    logger.error('Error creating customer in core API:', error);
    throw error;
  }
}

/**
 * Process payment through Asaas API
 * @param paymentData Payment data to process
 * @param apiKey Asaas API key
 * @param sandboxMode Whether to use sandbox or production mode
 * @returns Promise with API response
 */
export async function processPayment(
  paymentData: any,
  apiKey: string,
  sandboxMode: boolean
) {
  try {
    logger.log('Processing payment through Asaas core API');
    return await createAsaasPayment(paymentData, apiKey, sandboxMode);
  } catch (error) {
    logger.error('Error processing payment in core API:', error);
    throw error;
  }
}

/**
 * Get PIX QR code for a payment
 * @param paymentId Payment ID to get QR code for
 * @param apiKey Asaas API key
 * @param sandboxMode Whether to use sandbox or production mode
 * @returns Promise with API response containing QR code
 */
export async function getPixQrCode(
  paymentId: string,
  apiKey: string,
  sandboxMode: boolean
) {
  try {
    logger.log('Getting PIX QR code from Asaas core API');
    return await retrievePixQrCode(paymentId, apiKey, sandboxMode);
  } catch (error) {
    logger.error('Error getting PIX QR code from core API:', error);
    throw error;
  }
}

// Re-export functions from asaasApiService
import { 
  createAsaasCustomer, 
  createAsaasPayment,
  getPixQrCode as retrievePixQrCode 
} from '../asaasApiService';
