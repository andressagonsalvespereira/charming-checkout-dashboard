
import { supabase } from '@/lib/supabase';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { logger } from '@/utils/logger';

/**
 * Validate that a status string is a valid ManualCardStatus
 * @param status String to validate
 * @returns Valid ManualCardStatus or 'ANALYSIS' as fallback
 */
const validateCardStatus = (status: string | null): ManualCardStatus => {
  const validStatuses: ManualCardStatus[] = ['APPROVED', 'PENDING', 'CONFIRMED', 'DECLINED', 'REJECTED', 'ANALYSIS'];
  return status && validStatuses.includes(status as ManualCardStatus) 
    ? (status as ManualCardStatus) 
    : 'ANALYSIS';
};

/**
 * Fetch payment settings from the database
 * @returns Promise with payment settings data
 */
export const getPaymentSettings = async (): Promise<AsaasSettings> => {
  try {
    logger.log('Fetching payment settings from database...');
    
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

    logger.log('Fetched settings data:', settingsData);

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

    logger.log('Fetched API config data:', configData);

    // Validate the card status to ensure it's a valid ManualCardStatus
    const cardStatus = validateCardStatus(settingsData?.manual_card_status);

    return {
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
    logger.log('Saving payment settings to database:', settings);
    
    // First, check if settings already exist
    const { data: existingData, error: existingError } = await supabase
      .from('settings')
      .select('id')
      .limit(1);
    
    if (existingError) {
      logger.error('Error checking existing settings:', existingError);
      return false;
    }

    // Settings ID will be 1 if exists, otherwise create with ID 1
    const settingsId = existingData && existingData.length > 0 ? existingData[0].id : 1;

    logger.log(`Using settings ID: ${settingsId} for upsert operation`);

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

    // Check if API config already exists
    const { data: existingKeysData, error: existingKeysError } = await supabase
      .from('asaas_config')
      .select('id')
      .limit(1);
    
    if (existingKeysError) {
      logger.error('Error checking existing API keys:', existingKeysError);
      return false;
    }

    // Config ID will be 1 if exists, otherwise create with ID 1
    const configId = existingKeysData && existingKeysData.length > 0 ? existingKeysData[0].id : 1;
    
    logger.log(`Using config ID: ${configId} for upsert operation`);

    // Save API keys
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

    logger.log('Successfully saved all payment settings to database');
    return true;
  } catch (error) {
    logger.error('Error saving payment settings:', error);
    return false;
  }
};
