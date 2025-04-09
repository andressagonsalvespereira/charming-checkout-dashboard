
import { supabase } from '@/lib/supabase';
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';

// Default settings when none are found
export const DEFAULT_ASAAS_SETTINGS: AsaasSettings = {
  apiKey: '',
  sandboxMode: true,
  allowCreditCard: false,
  allowPix: false,
  manualCardStatus: 'PENDING',
  isEnabled: false,
  sandboxApiKey: '',
  productionApiKey: '',
  manualCardProcessing: false,
  manualPixPage: false
};

// Load settings from Supabase
export const loadAsaasSettings = async (): Promise<AsaasSettings> => {
  try {
    const { data, error } = await supabase
      .from('payment_settings')
      .select('*')
      .maybeSingle();

    if (error) {
      logger.error('Error loading Asaas settings:', error);
      return DEFAULT_ASAAS_SETTINGS;
    }

    if (!data) {
      logger.log('No Asaas settings found, using defaults');
      return DEFAULT_ASAAS_SETTINGS;
    }

    // Map from database to AsaasSettings type
    const settings: AsaasSettings = {
      apiKey: data.sandbox_mode ? data.sandbox_api_key : data.production_api_key,
      sandboxMode: data.sandbox_mode || false,
      allowCreditCard: data.allow_credit_card || false, 
      allowPix: data.allow_pix || false,
      manualCardStatus: data.manual_card_status || 'PENDING',
      isEnabled: data.is_enabled || false,
      sandboxApiKey: data.sandbox_api_key || '',
      productionApiKey: data.production_api_key || '',
      manualCardProcessing: data.manual_card_processing || false,
      manualPixPage: data.manual_pix_page || false,
      manualPaymentConfig: data.manual_payment_config || {},
      manualCreditCard: data.manual_credit_card || {}
    };

    logger.log('Asaas settings loaded successfully');
    return settings;
  } catch (err) {
    logger.error('Error loading Asaas settings:', err);
    return DEFAULT_ASAAS_SETTINGS;
  }
};

// Save settings to Supabase
export const saveAsaasSettings = async (settings: AsaasSettings): Promise<boolean> => {
  try {
    const { error } = await supabase
      .from('payment_settings')
      .upsert({
        id: 1, // Always use a single row with ID 1 for global settings
        sandbox_mode: settings.sandboxMode,
        sandbox_api_key: settings.sandboxApiKey || '',
        production_api_key: settings.productionApiKey || '',
        allow_credit_card: settings.allowCreditCard,
        allow_pix: settings.allowPix,
        manual_card_status: settings.manualCardStatus,
        is_enabled: settings.isEnabled || false,
        manual_card_processing: settings.manualCardProcessing || false,
        manual_pix_page: settings.manualPixPage || false,
        manual_payment_config: settings.manualPaymentConfig || {},
        manual_credit_card: settings.manualCreditCard || {},
        updated_at: new Date().toISOString()
      });

    if (error) {
      logger.error('Error saving Asaas settings:', error);
      return false;
    }

    logger.log('Asaas settings saved successfully');
    return true;
  } catch (err) {
    logger.error('Error saving Asaas settings:', err);
    return false;
  }
};
