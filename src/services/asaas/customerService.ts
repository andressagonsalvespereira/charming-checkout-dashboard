
import { AsaasCustomer, AsaasSettings } from '@/types/asaas';
import { createCustomer as createCustomerApi } from './core/apiService';
import { logger } from '@/utils/logger';

/**
 * Creates a customer in Asaas payment service
 * @param customerData Customer data
 * @param settings Asaas settings
 * @returns Promise with API response
 */
export async function createAsaasCustomer(
  customerData: AsaasCustomer,
  settings: AsaasSettings
) {
  const { apiKey, sandboxMode } = settings;
  
  try {
    logger.log('Creating customer in Asaas', { 
      name: customerData.name,
      email: customerData.email
    });
    return await createCustomerApi(customerData, apiKey, sandboxMode);
  } catch (error) {
    logger.error('Error creating customer:', error);
    throw error;
  }
}
