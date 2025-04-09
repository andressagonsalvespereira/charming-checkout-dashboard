
import { useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { AsaasSettings } from '@/types/asaas';
import { 
  PaymentSettingsFormValues, 
  formValuesToAsaasSettings, 
  asaasSettingsToFormValues 
} from '../../utils/formUtils';
import { savePaymentSettings, getPaymentSettings } from '@/services/paymentSettingsService';
import { logger } from '@/utils/logger';

/**
 * Hook to handle form submission
 */
export const useFormSubmission = (
  form: UseFormReturn<PaymentSettingsFormValues>,
  updateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void
) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: PaymentSettingsFormValues) => {
    setIsSaving(true);
    try {
      logger.log('Saving payment settings with form values:', data);
      logger.log('Selected card status to save:', data.manualCardStatus);
      logger.log('API keys to save - Sandbox:', data.sandboxApiKey?.substring(0, 5) + '...', 'Production:', data.productionApiKey?.substring(0, 5) + '...');
      
      // Calculate apiKey based on sandbox mode
      const apiKey = data.sandboxMode 
        ? data.sandboxApiKey || ''
        : data.productionApiKey || '';
        
      const settingsToUpdate = formValuesToAsaasSettings({
        ...data,
        apiKey
      });
      
      logger.log('Transformed settings to save:', {
        ...settingsToUpdate,
        sandboxApiKey: settingsToUpdate.sandboxApiKey ? `${settingsToUpdate.sandboxApiKey.substring(0, 5)}...` : '',
        productionApiKey: settingsToUpdate.productionApiKey ? `${settingsToUpdate.productionApiKey.substring(0, 5)}...` : ''
      });
      
      logger.log('Manual card status being saved:', settingsToUpdate.manualCardStatus);
      
      const success = await savePaymentSettings(settingsToUpdate);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As configurações de pagamento foram atualizadas com sucesso.",
        });
        
        // Re-fetch settings to ensure we have the latest data
        const updatedSettings = await getPaymentSettings();
        logger.log('Reloaded settings after save:', {
          ...updatedSettings,
          sandboxApiKey: updatedSettings.sandboxApiKey ? `${updatedSettings.sandboxApiKey.substring(0, 5)}...` : '',
          productionApiKey: updatedSettings.productionApiKey ? `${updatedSettings.productionApiKey.substring(0, 5)}...` : ''
        });
        logger.log('Reloaded manual card status:', updatedSettings.manualCardStatus);
        
        // Explicitly preserve the manualCardStatus and API keys that were just saved
        if (updatedSettings.manualCardStatus !== data.manualCardStatus ||
            updatedSettings.sandboxApiKey !== data.sandboxApiKey ||
            updatedSettings.productionApiKey !== data.productionApiKey) {
          logger.warn(`Some values changed during reload. Restoring original values.`);
          updateFormState(prev => ({
            ...updatedSettings,
            manualCardStatus: data.manualCardStatus,
            sandboxApiKey: data.sandboxApiKey || '',
            productionApiKey: data.productionApiKey || ''
          }));
        } else {
          updateFormState(() => updatedSettings);
        }
        
        form.reset(asaasSettingsToFormValues(updatedSettings));
      } else {
        throw new Error("Failed to save settings");
      }
    } catch (error) {
      console.error('Erro ao salvar configurações:', error);
      toast({
        title: "Erro ao salvar",
        description: "Ocorreu um erro ao tentar salvar as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return { isSaving, onSubmit };
};
