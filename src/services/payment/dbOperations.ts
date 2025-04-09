
import { supabase } from '@/lib/supabase';
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';

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
    
    const { error } = await supabase
      .from('settings')
      .upsert({
        id: id,
        asaas_enabled: settings.isEnabled,
        allow_pix: settings.allowPix,
        allow_credit_card: settings.allowCreditCard,
        manual_credit_card: settings.manualCreditCard,
        sandbox_mode: settings.sandboxMode,
        manual_card_processing: settings.manualCardProcessing,
        manual_pix_page: settings.manualPixPage,
        manual_payment_config: settings.manualPaymentConfig,
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
 * Verify that settings were saved correctly
 */
export const verifySettings = async (id: number): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error verifying settings:', error);
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Error in verifySettings:', error);
    return null;
  }
};

/**
 * Verify that API config was saved correctly
 */
export const verifyApiConfig = async (id: number): Promise<any> => {
  try {
    const { data, error } = await supabase
      .from('asaas_config')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      logger.error('Error verifying API config:', error);
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Error in verifyApiConfig:', error);
    return null;
  }
};
