
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';

// Define the context type
export interface AsaasContextType {
  settings: AsaasSettings;
  loading: boolean;
  saveSettings: (settings: AsaasSettings) => Promise<void>;
  updateSettings: (settings: AsaasSettings) => Promise<void>;
}

// Default settings to use when no settings are found
export const defaultAsaasSettings: AsaasSettings = {
  isEnabled: false,
  apiKey: '',
  allowCreditCard: true,
  allowPix: true,
  manualCreditCard: false,
  sandboxMode: true,
  sandboxApiKey: '',
  productionApiKey: '',
  manualCardProcessing: false,
  manualPixPage: false,
  manualPaymentConfig: false,
  manualCardStatus: 'ANALYSIS',
};
