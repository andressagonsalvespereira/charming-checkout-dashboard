
import { supabase } from '@/lib/supabase';
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';

/**
 * Fetch payment settings from the database
 * @returns Promise with payment settings data
 */
export const getPaymentSettings = async (): Promise<AsaasSettings> => {
  try {
    // First, query the settings table
    const { data: settingsData, error: settingsError } = await supabase
      .from('settings')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (settingsError) {
      logger.error('Error loading payment settings:', settingsError);
      throw settingsError;
    }

    // Then, query the asaas_config table for API keys
    const { data: configData, error: configError } = await supabase
      .from('asaas_config')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (configError && configError.code !== 'PGRST116') {
      // PGRST116 is "no rows returned" - this is OK if there's no config yet
      logger.warn('No Asaas config found, using defaults for API keys');
    }

    // Valid status values
    const validStatuses = ['APPROVED', 'PENDING', 'CONFIRMED', 'DECLINED', 'REJECTED', 'ANALYSIS'];
    const cardStatus = settingsData.manual_card_status as string;
    const validatedStatus = validStatuses.includes(cardStatus) ? cardStatus : 'ANALYSIS';

    return {
      isEnabled: settingsData.asaas_enabled || false,
      apiKey: settingsData.sandbox_mode ? 
        (configData?.sandbox_api_key || '') : (configData?.production_api_key || ''),
      allowPix: settingsData.allow_pix || true,
      allowCreditCard: settingsData.allow_credit_card || true,
      manualCreditCard: settingsData.manual_credit_card || false,
      sandboxMode: settingsData.sandbox_mode || true,
      sandboxApiKey: configData?.sandbox_api_key || '',
      productionApiKey: configData?.production_api_key || '',
      manualCardProcessing: settingsData.manual_card_processing || false,
      manualPixPage: settingsData.manual_pix_page || false,
      manualPaymentConfig: settingsData.manual_payment_config || false,
      manualCardStatus: validatedStatus
    };
  } catch (error) {
    logger.error('Error fetching payment settings:', error);
    // Return default settings in case of error
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
  }
};

/**
 * Save payment settings to the database
 * @param settings AsaasSettings object
 * @returns Promise indicating success or failure
 */
export const savePaymentSettings = async (settings: AsaasSettings): Promise<boolean> => {
  try {
    // Check if settings already exist
    const { data: existingData } = await supabase
      .from('settings')
      .select('id')
      .limit(1)
      .single();

    const settingsId = existingData?.id || 1;

    // Save settings data
    const { error: settingsError } = await supabase
      .from('settings')
      .upsert({
        id: settingsId,
        asaas_enabled: settings.isEnabled,
        allow_credit_card: settings.allowCreditCard,
        allow_pix: settings.allowPix,
        manual_credit_card: settings.manualCreditCard,
        sandbox_mode: settings.sandboxMode,
        manual_card_processing: settings.manualCardProcessing,
        manual_pix_page: settings.manualPixPage,
        manual_payment_config: settings.manualPaymentConfig,
        manual_card_status: settings.manualCardStatus,
        updated_at: new Date().toISOString()
      });

    if (settingsError) {
      logger.error('Error saving settings:', settingsError);
      return false;
    }

    // Save API keys
    const { data: existingKeysData } = await supabase
      .from('asaas_config')
      .select('id')
      .limit(1)
      .single();

    const configId = existingKeysData?.id || 1;

    const { error: keysError } = await supabase
      .from('asaas_config')
      .upsert({
        id: configId,
        sandbox_api_key: settings.sandboxApiKey || '',
        production_api_key: settings.productionApiKey || '',
        updated_at: new Date().toISOString()
      });

    if (keysError) {
      logger.error('Error saving API keys:', keysError);
      return false;
    }

    return true;
  } catch (error) {
    logger.error('Error saving payment settings:', error);
    return false;
  }
};
