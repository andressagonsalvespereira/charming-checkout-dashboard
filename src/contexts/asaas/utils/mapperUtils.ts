
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { logger } from '@/utils/logger';
import { defaultAsaasSettings } from '../types';

/**
 * Maps database data to AsaasSettings object
 */
export const mapToAsaasSettings = (asaasConfigData: any, asaasApiData: any): AsaasSettings => {
  if (!asaasConfigData) {
    return defaultAsaasSettings;
  }

  logger.log('Loaded settings from database with card status:', asaasConfigData.manual_card_status);
  
  return {
    isEnabled: asaasConfigData.asaas_enabled || false,
    apiKey: '',
    allowCreditCard: asaasConfigData.allow_credit_card || true,
    allowPix: asaasConfigData.allow_pix || true,
    manualCreditCard: asaasConfigData.manual_credit_card || false,
    sandboxMode: asaasConfigData.sandbox_mode || true,
    sandboxApiKey: asaasApiData?.sandbox_api_key || '',
    productionApiKey: asaasApiData?.production_api_key || '',
    manualCardProcessing: asaasConfigData.manual_card_processing || false,
    manualPixPage: asaasConfigData.manual_pix_page || false,
    manualPaymentConfig: asaasConfigData.manual_payment_config || false,
    manualCardStatus: (asaasConfigData.manual_card_status as ManualCardStatus) || 'ANALYSIS',
  };
};
