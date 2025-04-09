
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';
import { validateCardStatus } from './validators';

/**
 * Map database data to AsaasSettings object
 * @param settingsData Settings data from the database
 * @param configData API config data from the database
 * @returns AsaasSettings object
 */
export const mapToAsaasSettings = (settingsData: any, configData: any): AsaasSettings => {
  // Validate the card status to ensure it's a valid ManualCardStatus
  const cardStatus = validateCardStatus(settingsData?.manual_card_status);
  logger.log('Validated card status:', cardStatus);

  // Create the settings object with all retrieved data
  const settings: AsaasSettings = {
    isEnabled: settingsData?.asaas_enabled || false,
    apiKey: settingsData?.sandbox_mode ? 
      (configData?.sandbox_api_key || '') : (configData?.production_api_key || ''),
    allowPix: settingsData?.allow_pix || true,
    allowCreditCard: settingsData?.allow_credit_card || true,
    manualCreditCard: settingsData?.manual_credit_card || false,
    sandboxMode: settingsData?.sandbox_mode || true,
    sandboxApiKey: configData?.sandbox_api_key || '',
    productionApiKey: configData?.production_api_key || '',
    manualCardProcessing: settingsData?.manual_card_processing || false,
    manualPixPage: settingsData?.manual_pix_page || false,
    manualPaymentConfig: settingsData?.manual_payment_config || false,
    manualCardStatus: cardStatus
  };
  
  return settings;
};

/**
 * Get default AsaasSettings object
 * @returns Default AsaasSettings object
 */
export const getDefaultSettings = (): AsaasSettings => {
  return {
    isEnabled: false,
    apiKey: '',
    allowPix: true,
    allowCreditCard: true,
    manualCreditCard: false,
    sandboxMode: true,
    sandboxApiKey: '',
    productionApiKey: '',
    manualCardProcessing: false,
    manualPixPage: false,
    manualPaymentConfig: false,
    manualCardStatus: 'ANALYSIS'
  };
};
