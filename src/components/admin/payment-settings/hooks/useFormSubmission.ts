
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
      // Explicitly log the API keys being saved
      const sandboxKeyPreview = data.sandboxApiKey ? `${data.sandboxApiKey.substring(0, 5)}...` : 'empty';
      const productionKeyPreview = data.productionApiKey ? `${data.productionApiKey.substring(0, 5)}...` : 'empty';
      
      logger.log('Saving payment settings with form values:', {
        ...data,
        sandboxApiKey: sandboxKeyPreview,
        productionApiKey: productionKeyPreview
      });
      logger.log('Selected card status to save:', data.manualCardStatus);
      logger.log('API keys to save - Sandbox:', sandboxKeyPreview, 'Production:', productionKeyPreview);
      logger.log('Integration enabled status:', data.isEnabled);
      
      // Preserve API keys for transformation
      const settingsToUpdate = formValuesToAsaasSettings({
        ...data,
        apiKey: data.sandboxMode ? data.sandboxApiKey || '' : data.productionApiKey || ''
      });
      
      // Double-check that API keys are included
      settingsToUpdate.sandboxApiKey = data.sandboxApiKey || '';
      settingsToUpdate.productionApiKey = data.productionApiKey || '';
      
      // Ensure isEnabled is correctly set
      settingsToUpdate.isEnabled = data.isEnabled;
      
      logger.log('Transformed settings to save:', {
        ...settingsToUpdate,
        sandboxApiKey: settingsToUpdate.sandboxApiKey ? `${settingsToUpdate.sandboxApiKey.substring(0, 5)}...` : '[empty]',
        productionApiKey: settingsToUpdate.productionApiKey ? `${settingsToUpdate.productionApiKey.substring(0, 5)}...` : '[empty]'
      });
      
      logger.log('Manual card status being saved:', settingsToUpdate.manualCardStatus);
      logger.log('Integration enabled status being saved:', settingsToUpdate.isEnabled);
      
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
          sandboxApiKey: updatedSettings.sandboxApiKey ? `${updatedSettings.sandboxApiKey.substring(0, 5)}...` : '[empty]',
          productionApiKey: updatedSettings.productionApiKey ? `${updatedSettings.productionApiKey.substring(0, 5)}...` : '[empty]'
        });
        logger.log('Reloaded manual card status:', updatedSettings.manualCardStatus);
        logger.log('Reloaded integration enabled status:', updatedSettings.isEnabled);
        
        // Preserve the original API keys if they're not returned properly from the database
        if (!updatedSettings.sandboxApiKey && data.sandboxApiKey) {
          logger.log('Restoring sandbox API key from form data');
          updatedSettings.sandboxApiKey = data.sandboxApiKey;
        }
        
        if (!updatedSettings.productionApiKey && data.productionApiKey) {
          logger.log('Restoring production API key from form data');
          updatedSettings.productionApiKey = data.productionApiKey;
        }
        
        // Update form state with the latest settings
        updateFormState(() => updatedSettings);
        
        // Reset the form with the updated values
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
