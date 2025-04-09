
import { z } from 'zod';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';

// Define form validation schema
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

// Function to convert FormValues to AsaasSettings
export const formValuesToAsaasSettings = (values: PaymentSettingsFormValues): AsaasSettings => {
  // Importante: mantenha a lógica em sincronia com o atual estado do formulário
  return {
    isEnabled: values.isEnabled,
    apiKey: values.sandboxMode ? values.sandboxApiKey || '' : values.productionApiKey || '',
    allowPix: values.allowPix,
    allowCreditCard: values.allowCreditCard,
    manualCreditCard: values.manualCreditCard,
    sandboxMode: values.sandboxMode,
    sandboxApiKey: values.sandboxApiKey || '',
    productionApiKey: values.productionApiKey || '',
    manualCardProcessing: values.manualCardProcessing,
    manualCardStatus: values.manualCardStatus as ManualCardStatus,
    manualPixPage: values.manualPixPage,
    manualPaymentConfig: values.manualPaymentConfig,
  };
};

// Function to convert AsaasSettings to FormValues
export const asaasSettingsToFormValues = (settings: AsaasSettings): PaymentSettingsFormValues => {
  return {
    isEnabled: settings.isEnabled || false,
    manualCardProcessing: settings.manualCardProcessing || false,
    manualCardStatus: settings.manualCardStatus as any,
    manualCreditCard: settings.manualCreditCard || false,
    allowPix: settings.allowPix,
    allowCreditCard: settings.allowCreditCard,
    sandboxMode: settings.sandboxMode,
    sandboxApiKey: settings.sandboxApiKey || '',
    productionApiKey: settings.productionApiKey || '',
    manualPixPage: settings.manualPixPage || false,
    manualPaymentConfig: settings.manualPaymentConfig || false,
    apiKey: settings.apiKey || '',
  };
};
