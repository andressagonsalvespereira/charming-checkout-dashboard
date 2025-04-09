
import { AsaasSettings } from '@/types/asaas';
import { getPixQrCode as getPixQrCodeApi } from './core/apiService';
import { logger } from '@/utils/logger';

/**
 * Get PIX QR code for a payment
 * @param paymentId Payment ID to get QR code for
 * @param settings Asaas settings
 * @returns Promise with API response containing QR code
 */
export async function getAsaasPixQrCode(
  paymentId: string,
  settings: AsaasSettings
) {
  const { apiKey, sandboxMode } = settings;
  
  try {
    logger.log('Getting PIX QR code for payment', paymentId);
    return await getPixQrCodeApi(paymentId, apiKey, sandboxMode);
  } catch (error) {
    logger.error('Error getting PIX QR code:', error);
    throw error;
  }
}
