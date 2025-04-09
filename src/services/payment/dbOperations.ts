
import { supabase } from '@/lib/supabase';
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';
import { validateBoolean } from './validators';

/**
 * Fetch settings data from the database
 */
export const fetchSettingsData = async () => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error('Error fetching settings data:', error);
      throw error;
    }

    if (data) {
      logger.log('Fetched settings data:', {
        asaas_enabled: data.asaas_enabled,
        sandbox_mode: data.sandbox_mode,
        manual_card_status: data.manual_card_status
      });
    } else {
      logger.log('No settings data found');
    }

    return data;
  } catch (error) {
    logger.error('Error in fetchSettingsData:', error);
    return null;
  }
};

/**
 * Fetch API configuration from the database
 */
export const fetchApiConfig = async () => {
  try {
    const { data, error } = await supabase
      .from('asaas_config')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error('Error fetching API config:', error);
      throw error;
    }

    if (data) {
      logger.log('Fetched API config:', {
        sandbox_api_key: data.sandbox_api_key ? '[PRESENT]' : '[EMPTY]',
        production_api_key: data.production_api_key ? '[PRESENT]' : '[EMPTY]'
      });
    } else {
      logger.log('No API config found');
    }

    return data;
  } catch (error) {
    logger.error('Error in fetchApiConfig:', error);
    return null;
  }
};

/**
 * Check if settings exist in the database
 */
export const checkSettingsExist = async (): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('id')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error('Error checking if settings exist:', error);
      throw error;
    }

    return data?.id || null;
  } catch (error) {
    logger.error('Error in checkSettingsExist:', error);
    return null;
  }
};

/**
 * Check if API config exists in the database
 */
export const checkApiConfigExists = async (): Promise<number | null> => {
  try {
    const { data, error } = await supabase
      .from('asaas_config')
      .select('id')
      .limit(1)
      .single();

    if (error && error.code !== 'PGRST116') {
      logger.error('Error checking if API config exists:', error);
      throw error;
    }

    return data?.id || null;
  } catch (error) {
    logger.error('Error in checkApiConfigExists:', error);
    return null;
  }
};

/**
 * Save settings data to the database
 */
export const saveSettingsData = async (settings: AsaasSettings, id: number = 1) => {
  try {
    logger.log('Saving settings data with ID:', id);
    logger.log('isEnabled value being saved:', settings.isEnabled);
    logger.log('Settings to save:', {
      isEnabled: settings.isEnabled,
      allowPix: settings.allowPix,
      allowCreditCard: settings.allowCreditCard,
      manualCardStatus: settings.manualCardStatus
    });
    
    const { error } = await supabase
      .from('settings')
      .upsert({
        id: id,
        asaas_enabled: validateBoolean(settings.isEnabled),
        allow_pix: validateBoolean(settings.allowPix),
        allow_credit_card: validateBoolean(settings.allowCreditCard),
        manual_credit_card: validateBoolean(settings.manualCreditCard),
        sandbox_mode: validateBoolean(settings.sandboxMode),
        manual_card_processing: validateBoolean(settings.manualCardProcessing),
        manual_pix_page: validateBoolean(settings.manualPixPage),
        manual_payment_config: validateBoolean(settings.manualPaymentConfig),
        manual_card_status: settings.manualCardStatus,
        updated_at: new Date().toISOString()
      });

    if (error) {
      logger.error('Error saving settings data:', error);
      throw error;
    }

    logger.log('Settings data saved successfully');
  } catch (error) {
    logger.error('Error in saveSettingsData:', error);
    throw error;
  }
};

/**
 * Save API config to the database
 */
export const saveApiConfig = async (settings: AsaasSettings, id: number = 1) => {
  try {
    logger.log('Saving API config with ID:', id);
    logger.log('API keys being saved - Sandbox:', settings.sandboxApiKey ? 'PRESENT' : 'EMPTY', 'Production:', settings.productionApiKey ? 'PRESENT' : 'EMPTY');
    
    const { error } = await supabase
      .from('asaas_config')
      .upsert({
        id: id,
        sandbox_api_key: settings.sandboxApiKey || '',
        production_api_key: settings.productionApiKey || '',
        updated_at: new Date().toISOString()
      });

    if (error) {
      logger.error('Error saving API config:', error);
      throw error;
    }

    logger.log('API config saved successfully');
  } catch (error) {
    logger.error('Error in saveApiConfig:', error);
    throw error;
  }
};

/**
 * Save settings with retry mechanism
 * This is the main function that should be used to save settings
 */
export const saveSettingsWithRetry = async (settings: AsaasSettings): Promise<boolean> => {
  try {
    // Check if settings already exist
    const settingsId = await checkSettingsExist();
    
    // Settings ID will be 1 if exists, otherwise create with ID 1
    const finalSettingsId = settingsId || 1;
    logger.log(`Using settings ID: ${finalSettingsId} for upsert operation`);

    // Save settings data
    await saveSettingsData(settings, finalSettingsId);

    // Check if API config already exists
    const configId = await checkApiConfigExists();
    
    // Config ID will be 1 if exists, otherwise create with ID 1
    const finalConfigId = configId || 1;
    logger.log(`Using config ID: ${finalConfigId} for upsert operation`);

    // Save API keys
    await saveApiConfig(settings, finalConfigId);

    logger.log('Successfully saved all payment settings to database');
    
    // Verify settings were saved
    const { data: settingsData } = await supabase
      .from('settings')
      .select('*')
      .eq('id', finalSettingsId)
      .single();
      
    logger.log('Verified settings saved:', {
      asaas_enabled: settingsData?.asaas_enabled,
      sandbox_mode: settingsData?.sandbox_mode
    });
    
    return true;
  } catch (error) {
    logger.error('Error saving settings with retry:', error);
    return false;
  }
};
