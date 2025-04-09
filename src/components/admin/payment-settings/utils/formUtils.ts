
import { z } from 'zod';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { logger } from '@/utils/logger';

// Define form validation schema with proper types
export const PaymentSettingsSchema = z.object({
  isEnabled: z.boolean().default(false),
  manualCardProcessing: z.boolean().default(false),
  manualCardStatus: z.enum([
    'APPROVED', 'PENDING', 'ANALYSIS', 'DECLINED', 'REJECTED', 
    'CONFIRMED', 'DENIED', 'CANCELLED', 'FAILED', 'RECEIVED'
  ]).default('ANALYSIS'),
  manualCreditCard: z.boolean().default(false),
  allowPix: z.boolean().default(true),
  allowCreditCard: z.boolean().default(true),
  sandboxMode: z.boolean().default(true),
  sandboxApiKey: z.string().optional(),
  productionApiKey: z.string().optional(),
  manualPixPage: z.boolean().default(false),
  manualPaymentConfig: z.boolean().default(false),
  apiKey: z.string().optional(),
});

export type PaymentSettingsFormValues = z.infer<typeof PaymentSettingsSchema>;

// Function to convert FormValues to AsaasSettings with proper logging
export const formValuesToAsaasSettings = (values: PaymentSettingsFormValues): AsaasSettings => {
  logger.log('Converting form values to AsaasSettings:', {
    isEnabled: values.isEnabled,
    sandboxMode: values.sandboxMode,
    sandboxApiKey: values.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
    productionApiKey: values.productionApiKey ? '[PRESENT]' : '[EMPTY]',
  });
  
  return {
    isEnabled: Boolean(values.isEnabled),
    apiKey: values.sandboxMode ? (values.sandboxApiKey || '') : (values.productionApiKey || ''),
    allowPix: Boolean(values.allowPix),
    allowCreditCard: Boolean(values.allowCreditCard),
    manualCreditCard: Boolean(values.manualCreditCard),
    sandboxMode: Boolean(values.sandboxMode),
    sandboxApiKey: values.sandboxApiKey || '',
    productionApiKey: values.productionApiKey || '',
    manualCardProcessing: Boolean(values.manualCardProcessing),
    manualCardStatus: values.manualCardStatus as ManualCardStatus,
    manualPixPage: Boolean(values.manualPixPage),
    manualPaymentConfig: Boolean(values.manualPaymentConfig),
  };
};

// Function to convert AsaasSettings to FormValues
export const asaasSettingsToFormValues = (settings: AsaasSettings): PaymentSettingsFormValues => {
  logger.log('Converting AsaasSettings to form values:', {
    isEnabled: settings.isEnabled,
    sandboxMode: settings.sandboxMode,
    sandboxApiKey: settings.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
    productionApiKey: settings.productionApiKey ? '[PRESENT]' : '[EMPTY]',
  });
  
  return {
    isEnabled: Boolean(settings.isEnabled),
    manualCardProcessing: Boolean(settings.manualCardProcessing),
    manualCardStatus: settings.manualCardStatus as ManualCardStatus,
    manualCreditCard: Boolean(settings.manualCreditCard),
    allowPix: Boolean(settings.allowPix),
    allowCreditCard: Boolean(settings.allowCreditCard),
    sandboxMode: Boolean(settings.sandboxMode),
    sandboxApiKey: settings.sandboxApiKey || '',
    productionApiKey: settings.productionApiKey || '',
    manualPixPage: Boolean(settings.manualPixPage),
    manualPaymentConfig: Boolean(settings.manualPaymentConfig),
    apiKey: settings.apiKey || '',
  };
};
