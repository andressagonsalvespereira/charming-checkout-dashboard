
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { logger } from '@/utils/logger';

/**
 * Map database settings data to AsaasSettings object
 * @param settingsData Settings data from database
 * @param configData API configuration data from database
 * @returns AsaasSettings object
 */
export const mapToAsaasSettings = (settingsData: any, configData: any): AsaasSettings => {
  // Validate the card status
  const cardStatus = validateCardStatus(settingsData?.manual_card_status);
  logger.log('Validated card status:', cardStatus);
  
  // Ensure isEnabled is a proper boolean
  const isEnabled = settingsData?.asaas_enabled === true;
  
  // Log the enabled status from database
  logger.log('Asaas enabled status from database:', settingsData?.asaas_enabled);
  logger.log('Mapped isEnabled value (after proper boolean conversion):', isEnabled);
  
  return {
    isEnabled: isEnabled,
    apiKey: settingsData?.sandbox_mode ? 
      (configData?.sandbox_api_key || '') : 
      (configData?.production_api_key || ''),
    allowPix: settingsData?.allow_pix ?? true,
    allowCreditCard: settingsData?.allow_credit_card ?? true,
    manualCreditCard: settingsData?.manual_credit_card ?? false,
    sandboxMode: settingsData?.sandbox_mode ?? true,
    sandboxApiKey: configData?.sandbox_api_key || '',
    productionApiKey: configData?.production_api_key || '',
    manualCardProcessing: settingsData?.manual_card_processing ?? false,
    manualPixPage: settingsData?.manual_pix_page ?? false,
    manualPaymentConfig: settingsData?.manual_payment_config ?? false,
    manualCardStatus: cardStatus
  };
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

/**
 * Validate card status
 * @param status Card status to validate
 * @returns Valid card status
 */
const validateCardStatus = (status?: string): ManualCardStatus => {
  logger.log('Validating card status:', status);
  
  // List of valid card statuses
  const validStatuses: ManualCardStatus[] = [
    'APPROVED', 'PENDING', 'CONFIRMED', 'REJECTED', 
    'ANALYSIS', 'RECEIVED', 'CANCELLED', 'FAILED', 
    'DECLINED', 'DENIED'
  ];
  
  // Default status if not provided or invalid
  const defaultStatus: ManualCardStatus = 'ANALYSIS';
  
  // Check if status is valid
  if (status && validStatuses.includes(status as ManualCardStatus)) {
    logger.log(`Status ${status} is valid`);
    return status as ManualCardStatus;
  }
  
  logger.log(`Status ${status} is invalid, using default status ${defaultStatus}`);
  return defaultStatus;
};
