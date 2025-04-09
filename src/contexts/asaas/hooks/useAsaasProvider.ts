
import { useState, useEffect } from 'react';
import { AsaasSettings } from '@/types/asaas';
import { defaultAsaasSettings } from '../types';
import { logger } from '@/utils/logger';
import { 
  fetchAsaasSettings, 
  fetchAsaasApiKeys, 
  saveAsaasSettingsToDb, 
  updateAsaasSettingsInDb 
} from '../utils/databaseUtils';
import { mapToAsaasSettings } from '../utils/mapperUtils';

export const useAsaasProvider = () => {
  const [settings, setSettings] = useState<AsaasSettings>(defaultAsaasSettings);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch settings from the database on mount
  useEffect(() => {
    fetchSettings();
  }, []);

  // Fetch Asaas settings
  const fetchSettings = async () => {
    try {
      setLoading(true);
      
      // Fetch Asaas settings
      const asaasConfigData = await fetchAsaasSettings();

      // Fetch Asaas API keys
      const asaasApiData = await fetchAsaasApiKeys();

      // If we got data, update settings
      if (asaasConfigData) {
        const mappedSettings = mapToAsaasSettings(asaasConfigData, asaasApiData);
        setSettings(mappedSettings);
      }
    } catch (error) {
      logger.error('Error in fetchSettings:', error);
    } finally {
      setLoading(false);
    }
  };

  // Save settings to the database
  const saveSettings = async (newSettings: AsaasSettings) => {
    try {
      setLoading(true);
      await saveAsaasSettingsToDb(newSettings);
      
      // Update local state
      setSettings(newSettings);
    } catch (error) {
      logger.error('Error in saveSettings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Update existing settings
  const updateSettings = async (newSettings: AsaasSettings) => {
    try {
      setLoading(true);
      await updateAsaasSettingsInDb(newSettings);
      
      // Update local state
      setSettings(newSettings);
    } catch (error) {
      logger.error('Error in updateSettings:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    saveSettings,
    updateSettings
  };
};
