
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { validateCardStatus, validateBoolean } from './validators';
import { logger } from '@/utils/logger';

/**
 * Map database settings data to AsaasSettings object
 */
export const mapToAsaasSettings = (settingsData: any, configData: any): AsaasSettings => {
  if (!settingsData) {
    return getDefaultSettings();
  }

  logger.log('Mapping database data to AsaasSettings');
  logger.log('Raw settings data:', {
    asaas_enabled: settingsData.asaas_enabled,
    manual_card_status: settingsData.manual_card_status,
    sandbox_mode: settingsData.sandbox_mode
  });
  logger.log('Raw API config data:', {
    sandbox_api_key: configData?.sandbox_api_key ? '[PRESENT]' : '[EMPTY]',
    production_api_key: configData?.production_api_key ? '[PRESENT]' : '[EMPTY]'
  });
  
  // Ensure isEnabled is a proper boolean
  const isEnabled = validateBoolean(settingsData.asaas_enabled);
  logger.log('isEnabled after validation:', isEnabled);
  
  // Validate the card status
  const cardStatus = validateCardStatus(settingsData.manual_card_status);
  
  // Ensure API keys are proper strings
  const sandboxApiKey = configData?.sandbox_api_key || '';
  const productionApiKey = configData?.production_api_key || '';
  
  const sandboxMode = validateBoolean(settingsData.sandbox_mode);
  
  const result: AsaasSettings = {
    isEnabled: isEnabled,
    apiKey: sandboxMode ? sandboxApiKey : productionApiKey,
    allowPix: validateBoolean(settingsData.allow_pix ?? true),
    allowCreditCard: validateBoolean(settingsData.allow_credit_card ?? true),
    manualCreditCard: validateBoolean(settingsData.manual_credit_card ?? false),
    sandboxMode: sandboxMode,
    sandboxApiKey: sandboxApiKey,
    productionApiKey: productionApiKey,
    manualCardProcessing: validateBoolean(settingsData.manual_card_processing ?? false),
    manualPixPage: validateBoolean(settingsData.manual_pix_page ?? false),
    manualPaymentConfig: validateBoolean(settingsData.manual_payment_config ?? false),
    manualCardStatus: cardStatus
  };
  
  logger.log('Mapped settings:', {
    isEnabled: result.isEnabled,
    sandboxMode: result.sandboxMode,
    sandboxApiKey: result.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
    productionApiKey: result.productionApiKey ? '[PRESENT]' : '[EMPTY]'
  });
  
  return result;
};

/**
 * Get default AsaasSettings object
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
