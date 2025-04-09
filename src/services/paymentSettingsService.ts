
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';
import { 
  fetchSettingsData, 
  fetchApiConfig,
  saveSettingsData,
  saveApiConfig,
  checkSettingsExist,
  checkApiConfigExists,
  verifySettings,
  verifyApiConfig
} from './payment/dbOperations';
import { mapToAsaasSettings, getDefaultSettings } from './payment/mappers';

/**
 * Fetch payment settings from the database
 * @returns Promise with payment settings data
 */
export const getPaymentSettings = async (): Promise<AsaasSettings> => {
  try {
    logger.log('Fetching payment settings from database...');
    
    // First, query the settings table
    const settingsData = await fetchSettingsData();
    
    // Then, query the asaas_config table for API keys
    const configData = await fetchApiConfig();
    
    // Map database data to AsaasSettings object
    const settings = mapToAsaasSettings(settingsData, configData);
    
    // Log sanitized settings
    logger.log('Loaded payment settings:', {
      ...settings,
      sandboxApiKey: settings.sandboxApiKey ? `${settings.sandboxApiKey.substring(0, 5)}...` : '[empty]',
      productionApiKey: settings.productionApiKey ? `${settings.productionApiKey.substring(0, 5)}...` : '[empty]'
    });
    
    logger.log('Card status from database:', settings.manualCardStatus);
    
    return settings;
  } catch (error) {
    logger.error('Error fetching payment settings:', error);
    // Return default settings in case of error
    return getDefaultSettings();
  }
};

/**
 * Save payment settings to the database
 * @param settings AsaasSettings object
 * @returns Promise indicating success or failure
 */
export const savePaymentSettings = async (settings: AsaasSettings): Promise<boolean> => {
  try {
    // Log sanitized settings
    logger.log('Saving payment settings to database:', {
      ...settings,
      sandboxApiKey: settings.sandboxApiKey ? `${settings.sandboxApiKey.substring(0, 5)}...` : '[empty]',
      productionApiKey: settings.productionApiKey ? `${settings.productionApiKey.substring(0, 5)}...` : '[empty]'
    });
    
    // First, check if settings already exist
    const existingSettingsId = await checkSettingsExist();
    
    // Settings ID will be 1 if exists, otherwise create with ID 1
    const settingsId = existingSettingsId || 1;
    logger.log(`Using settings ID: ${settingsId} for upsert operation`);

    // Save settings data
    await saveSettingsData(settings, settingsId);

    // Check if API config already exists
    const existingConfigId = await checkApiConfigExists();
    
    // Config ID will be 1 if exists, otherwise create with ID 1
    const configId = existingConfigId || 1;
    logger.log(`Using config ID: ${configId} for upsert operation`);

    // Save API keys
    await saveApiConfig(settings, configId);

    logger.log('Successfully saved all payment settings to database');
    
    // Verify that settings were saved correctly by fetching them again
    const verifiedSettings = await verifySettings(settingsId);
    logger.log('Verified saved manual card status:', verifiedSettings?.manual_card_status);
    
    const verifiedConfig = await verifyApiConfig(configId);
    
    // Check if API keys were saved correctly
    if (verifiedConfig) {
      const sandboxSaved = verifiedConfig.sandbox_api_key && verifiedConfig.sandbox_api_key === settings.sandboxApiKey;
      const productionSaved = verifiedConfig.production_api_key && verifiedConfig.production_api_key === settings.productionApiKey;
      
      if (!sandboxSaved && settings.sandboxApiKey) {
        logger.warn('Sandbox API key was not saved correctly');
      }
      
      if (!productionSaved && settings.productionApiKey) {
        logger.warn('Production API key was not saved correctly');
      }
    }
    
    return true;
  } catch (error) {
    logger.error('Error saving payment settings:', error);
    return false;
  }
};
