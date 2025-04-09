
import { AsaasSettings, AsaasCustomer, AsaasPayment } from '@/types/asaas';
import { createAsaasCustomer } from './asaas/customerService';
import { processAsaasPayment } from './asaas/paymentProcessor';
import { getAsaasPixQrCode } from './asaas/pixService';

// Re-export the functions with the same interface for backward compatibility
export const createCustomer = createAsaasCustomer;
export const processPayment = processAsaasPayment;
export const getPixQrCode = getAsaasPixQrCode;
