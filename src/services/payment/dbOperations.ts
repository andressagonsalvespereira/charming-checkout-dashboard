
import { supabase } from '@/lib/supabase';
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';
import { validateCardStatus } from './validators';

/**
 * Fetch settings data from the database
 * @returns Promise with settings data or null if not found
 */
export const fetchSettingsData = async () => {
  logger.log('Fetching settings data from database...');
  
  const { data: settingsData, error: settingsError } = await supabase
    .from('settings')
    .select('*')
    .order('updated_at', { ascending: false })
    .limit(1)
    .single();

  if (settingsError) {
    logger.error('Error loading settings data:', settingsError);
    throw settingsError;
  }

  logger.log('Fetched settings data:', settingsData);
  return settingsData;
};

/**
 * Fetch API configuration from the database
 * @returns Promise with API configuration or null if not found
 */
export const fetchApiConfig = async () => {
  logger.log('Fetching API config data from database...');
  
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
  return configData;
};

/**
 * Save settings data to the database
 * @param settings AsaasSettings object to save
 * @param settingsId ID of the settings record
 * @returns Promise indicating success or failure
 */
export const saveSettingsData = async (settings: AsaasSettings, settingsId: number) => {
  logger.log(`Saving settings data with ID ${settingsId}...`);
  logger.log(`Saving manual card status: ${settings.manualCardStatus}`);

  // Validate the status before saving
  const validatedStatus = validateCardStatus(settings.manualCardStatus);
  logger.log(`Validated status for saving: ${validatedStatus}`);

  const { error } = await supabase
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
      manual_card_status: validatedStatus,
      updated_at: new Date().toISOString()
    });

  if (error) {
    logger.error('Error saving settings data:', error);
    throw error;
  }

  logger.log('Settings data saved successfully');
  return true;
};

/**
 * Save API configuration to the database
 * @param settings AsaasSettings object containing API keys
 * @param configId ID of the API config record
 * @returns Promise indicating success or failure
 */
export const saveApiConfig = async (settings: AsaasSettings, configId: number) => {
  logger.log(`Saving API config with ID ${configId}...`);
  
  // Log sanitized keys for security
  const sandboxKeyPreview = settings.sandboxApiKey ? `${settings.sandboxApiKey.substring(0, 5)}...` : '[empty]';
  const productionKeyPreview = settings.productionApiKey ? `${settings.productionApiKey.substring(0, 5)}...` : '[empty]';
  logger.log(`Saving API keys - Sandbox: ${sandboxKeyPreview}, Production: ${productionKeyPreview}`);
  
  const { error } = await supabase
    .from('asaas_config')
    .upsert({
      id: configId,
      sandbox_api_key: settings.sandboxApiKey || '',
      production_api_key: settings.productionApiKey || '',
      updated_at: new Date().toISOString()
    });

  if (error) {
    logger.error('Error saving API config:', error);
    throw error;
  }

  logger.log('API config saved successfully');
  return true;
};

/**
 * Check if settings exist in the database
 * @returns Promise with settings ID or null if not found
 */
export const checkSettingsExist = async () => {
  const { data, error } = await supabase
    .from('settings')
    .select('id')
    .limit(1);
  
  if (error) {
    logger.error('Error checking existing settings:', error);
    throw error;
  }

  return data && data.length > 0 ? data[0].id : null;
};

/**
 * Check if API config exists in the database
 * @returns Promise with config ID or null if not found
 */
export const checkApiConfigExists = async () => {
  const { data, error } = await supabase
    .from('asaas_config')
    .select('id')
    .limit(1);
  
  if (error) {
    logger.error('Error checking existing API keys:', error);
    throw error;
  }

  return data && data.length > 0 ? data[0].id : null;
};

/**
 * Verify that settings were saved correctly
 * @param settingsId ID of the settings record
 * @returns Promise with verification data
 */
export const verifySettings = async (settingsId: number) => {
  const { data, error } = await supabase
    .from('settings')
    .select('manual_card_status')
    .eq('id', settingsId)
    .single();
    
  if (error) {
    logger.warn('Could not verify settings were saved correctly:', error);
    return null;
  }

  logger.log('Verified saved manual card status:', data.manual_card_status);
  return data;
};

/**
 * Verify that API config was saved correctly
 * @param configId ID of the API config record
 * @returns Promise with verification data
 */
export const verifyApiConfig = async (configId: number) => {
  const { data, error } = await supabase
    .from('asaas_config')
    .select('sandbox_api_key, production_api_key')
    .eq('id', configId)
    .single();
    
  if (error) {
    logger.warn('Could not verify API config was saved correctly:', error);
    return null;
  }
  
  // Log sanitized keys for security
  logger.log('Verified API keys were saved', 
    data.sandbox_api_key ? 'Sandbox: [present]' : 'Sandbox: [empty]',
    data.production_api_key ? 'Production: [present]' : 'Production: [empty]'
  );
  
  return data;
};
