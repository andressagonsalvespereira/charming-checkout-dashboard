
import { AsaasCustomer, AsaasPayment, AsaasApiResponse } from '@/types/asaas';
import { logger } from '@/utils/logger';

// Base URL configuration
const getBaseUrl = (sandbox: boolean) => {
  return sandbox
    ? 'https://sandbox.asaas.com/api/v3'
    : 'https://api.asaas.com/api/v3';
};

// Generic API call handler with error management
async function asaasApiCall<T>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE',
  apiKey: string,
  sandbox: boolean,
  data?: any
): Promise<AsaasApiResponse<T>> {
  try {
    const baseUrl = getBaseUrl(sandbox);
    const url = `${baseUrl}${endpoint}`;

    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'access_token': apiKey
      },
      body: data ? JSON.stringify(data) : undefined
    });

    const responseData = await response.json();

    // Check if response contains errors
    if (!response.ok) {
      logger.error('Asaas API error:', responseData);
      
      return {
        data: null,
        error: {
          message: responseData.errors?.[0]?.description || 'Unknown error',
          code: responseData.errors?.[0]?.code || 'UNKNOWN_ERROR'
        },
        success: false
      };
    }

    return { 
      data: responseData, 
      error: null,
      success: true
    };
  } catch (error) {
    logger.error('Error calling Asaas API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return {
      data: null,
      error: {
        message: errorMessage,
        code: 'REQUEST_FAILED'
      },
      success: false
    };
  }
}

// Create a customer in Asaas
export async function createAsaasCustomer(
  customer: AsaasCustomer,
  apiKey: string,
  sandbox: boolean
) {
  logger.log('Creating Asaas customer:', { name: customer.name, email: customer.email });
  return asaasApiCall<any>('/customers', 'POST', apiKey, sandbox, customer);
}

// Create a payment in Asaas
export async function createAsaasPayment(
  payment: AsaasPayment,
  apiKey: string,
  sandbox: boolean
) {
  logger.log('Creating Asaas payment:', { 
    value: payment.value, 
    billingType: payment.billingType,
    customer: payment.customer
  });
  return asaasApiCall<any>('/payments', 'POST', apiKey, sandbox, payment);
}

// Get PIX QR code for a payment
export async function getPixQrCode(
  paymentId: string,
  apiKey: string,
  sandbox: boolean
) {
  logger.log('Getting PIX QR code for payment:', paymentId);
  return asaasApiCall<any>(`/payments/${paymentId}/pixQrCode`, 'GET', apiKey, sandbox);
}

export default {
  createAsaasCustomer,
  createAsaasPayment,
  getPixQrCode
};
