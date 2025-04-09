
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';
import { 
  fetchSettingsData, 
  fetchApiConfig,
  saveSettingsWithRetry
} from './payment/dbOperations';
import { mapToAsaasSettings, getDefaultSettings } from './payment/mappers';
import { validateBoolean } from './payment/validators';

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
      sandboxMode: settings.sandboxMode,
      sandboxApiKey: settings.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
      productionApiKey: settings.productionApiKey ? '[PRESENT]' : '[EMPTY]'
    });
    
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
    // Ensure boolean values are correctly typed
    const sanitizedSettings: AsaasSettings = {
      ...settings,
      isEnabled: validateBoolean(settings.isEnabled),
      allowPix: validateBoolean(settings.allowPix),
      allowCreditCard: validateBoolean(settings.allowCreditCard),
      manualCreditCard: validateBoolean(settings.manualCreditCard),
      sandboxMode: validateBoolean(settings.sandboxMode),
      manualCardProcessing: validateBoolean(settings.manualCardProcessing),
      manualPixPage: validateBoolean(settings.manualPixPage),
      manualPaymentConfig: validateBoolean(settings.manualPaymentConfig)
    };
    
    // Log what we're about to save
    logger.log('Saving payment settings:', {
      isEnabled: sanitizedSettings.isEnabled,
      sandboxMode: sanitizedSettings.sandboxMode,
      sandboxApiKey: sanitizedSettings.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
      productionApiKey: sanitizedSettings.productionApiKey ? '[PRESENT]' : '[EMPTY]'
    });
    
    // Use the optimized function to save settings
    const success = await saveSettingsWithRetry(sanitizedSettings);
    
    if (success) {
      logger.log('Successfully saved all payment settings to database');
      return true;
    } else {
      logger.error('Failed to save settings');
      return false;
    }
  } catch (error) {
    logger.error('Error saving payment settings:', error);
    return false;
  }
};
