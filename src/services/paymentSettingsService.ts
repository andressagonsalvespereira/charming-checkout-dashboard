
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';
import { 
  fetchSettingsData, 
  fetchApiConfig,
  saveSettingsData,
  saveApiConfig,
  checkSettingsExist,
  checkApiConfigExists,
  verifySettings
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
    
    logger.log('Loaded payment settings:', settings);
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
    logger.log('Saving payment settings to database:', settings);
    
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
    await verifySettings(settingsId);
    
    return true;
  } catch (error) {
    logger.error('Error saving payment settings:', error);
    return false;
  }
};
