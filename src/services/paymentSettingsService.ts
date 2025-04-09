
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
  verifyApiConfig,
  saveSettingsWithRetry
} from './payment/dbOperations';
import { mapToAsaasSettings, getDefaultSettings } from './payment/mappers';

/**
 * Fetch payment settings from the database
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
      isEnabled: settings.isEnabled,
      sandboxApiKey: settings.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
      productionApiKey: settings.productionApiKey ? '[PRESENT]' : '[EMPTY]'
    });
    
    // Log current card status from the database
    if (settingsData?.manual_card_status) {
      logger.log('Card status from database:', settingsData.manual_card_status);
    }
    
    return settings;
  } catch (error) {
    logger.error('Error fetching payment settings:', error);
    // Return default settings in case of error
    return getDefaultSettings();
  }
};

/**
 * Save payment settings to the database
 */
export const savePaymentSettings = async (settings: AsaasSettings): Promise<boolean> => {
  try {
    // Log sanitized settings
    logger.log('Saving payment settings:', {
      isEnabled: settings.isEnabled,
      sandboxApiKey: settings.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
      productionApiKey: settings.productionApiKey ? '[PRESENT]' : '[EMPTY]'
    });
    
    // Tente salvar usando o método otimizado com retry
    const success = await saveSettingsWithRetry(settings);
    
    if (success) {
      logger.log('Successfully saved all payment settings to database');
      return true;
    } else {
      // Se falhar, tente o método anterior
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
      
      // Verify that settings were saved correctly
      const verifiedSettings = await verifySettings(settingsId);
      
      // Verify that API keys were saved correctly
      const verifiedConfig = await verifyApiConfig(configId);
      
      return true;
    }
  } catch (error) {
    logger.error('Error saving payment settings:', error);
    return false;
  }
};
