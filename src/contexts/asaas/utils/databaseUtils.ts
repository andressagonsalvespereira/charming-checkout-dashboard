
import { supabase } from '@/lib/supabase';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { logger } from '@/utils/logger';

/**
 * Fetch Asaas settings from the database
 */
export const fetchAsaasSettings = async () => {
  try {
    // Fetch Asaas settings
    const { data: asaasConfigData, error: asaasConfigError } = await supabase
      .from('settings')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (asaasConfigError && asaasConfigError.code !== 'PGRST116') {
      logger.error('Error fetching Asaas settings:', asaasConfigError);
      return null;
    }

    return asaasConfigData;
  } catch (error) {
    logger.error('Error in fetchAsaasSettings:', error);
    return null;
  }
};

/**
 * Fetch Asaas API keys from the database
 */
export const fetchAsaasApiKeys = async () => {
  try {
    // Fetch Asaas API keys
    const { data: asaasApiData, error: asaasApiError } = await supabase
      .from('asaas_config')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (asaasApiError && asaasApiError.code !== 'PGRST116') {
      logger.error('Error fetching Asaas API keys:', asaasApiError);
      return null;
    }

    return asaasApiData;
  } catch (error) {
    logger.error('Error in fetchAsaasApiKeys:', error);
    return null;
  }
};

/**
 * Save Asaas settings to the database
 */
export const saveAsaasSettingsToDb = async (settings: AsaasSettings) => {
  try {
    logger.log('Saving settings to database with card status:', settings.manualCardStatus);

    const { error: settingsError } = await supabase.from('settings').insert({
      asaas_enabled: settings.isEnabled,
      allow_credit_card: settings.allowCreditCard,
      allow_pix: settings.allowPix,
      manual_credit_card: settings.manualCreditCard,
      sandbox_mode: settings.sandboxMode,
      manual_card_processing: settings.manualCardProcessing,
      manual_pix_page: settings.manualPixPage,
      manual_payment_config: settings.manualPaymentConfig,
      manual_card_status: settings.manualCardStatus,
    });

    if (settingsError) {
      logger.error('Error saving settings:', settingsError);
      throw settingsError;
    }

    // Save Asaas API keys
    const { error: apiKeysError } = await supabase.from('asaas_config').insert({
      sandbox_api_key: settings.sandboxApiKey,
      production_api_key: settings.productionApiKey,
    });

    if (apiKeysError) {
      logger.error('Error saving API keys:', apiKeysError);
      throw apiKeysError;
    }

    return true;
  } catch (error) {
    logger.error('Error in saveAsaasSettingsToDb:', error);
    throw error;
  }
};

/**
 * Update existing Asaas settings in the database
 */
export const updateAsaasSettingsInDb = async (settings: AsaasSettings) => {
  try {
    // Get existing settings ID
    const { data: existingSettings } = await supabase
      .from('settings')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (existingSettings) {
      logger.log('Updating settings with ID:', existingSettings.id);
      logger.log('Updating card status to:', settings.manualCardStatus);

      const { error: settingsError } = await supabase
        .from('settings')
        .update({
          asaas_enabled: settings.isEnabled,
          allow_credit_card: settings.allowCreditCard,
          allow_pix: settings.allowPix,
          manual_credit_card: settings.manualCreditCard,
          sandbox_mode: settings.sandboxMode,
          manual_card_processing: settings.manualCardProcessing,
          manual_pix_page: settings.manualPixPage,
          manual_payment_config: settings.manualPaymentConfig,
          manual_card_status: settings.manualCardStatus,
        })
        .eq('id', existingSettings.id);

      if (settingsError) {
        logger.error('Error updating settings:', settingsError);
        throw settingsError;
      }
    } else {
      // If no settings exist yet, create them
      return await saveAsaasSettingsToDb(settings);
    }

    // Get existing API keys ID
    const { data: existingApiKeys } = await supabase
      .from('asaas_config')
      .select('id')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (existingApiKeys) {
      logger.log('Updating API keys with ID:', existingApiKeys.id);
      
      const { error: apiKeysError } = await supabase
        .from('asaas_config')
        .update({
          sandbox_api_key: settings.sandboxApiKey,
          production_api_key: settings.productionApiKey,
        })
        .eq('id', existingApiKeys.id);

      if (apiKeysError) {
        logger.error('Error updating API keys:', apiKeysError);
        throw apiKeysError;
      }
    } else {
      // If no API keys exist yet, create them
      const { error: apiKeysError } = await supabase.from('asaas_config').insert({
        sandbox_api_key: settings.sandboxApiKey,
        production_api_key: settings.productionApiKey,
      });

      if (apiKeysError) {
        logger.error('Error creating API keys:', apiKeysError);
        throw apiKeysError;
      }
    }

    return true;
  } catch (error) {
    logger.error('Error in updateAsaasSettingsInDb:', error);
    throw error;
  }
};
