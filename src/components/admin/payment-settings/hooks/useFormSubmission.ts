
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
      logger.log('Submitting form with values:', {
        isEnabled: data.isEnabled,
        sandboxMode: data.sandboxMode,
        sandboxApiKey: data.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
        productionApiKey: data.productionApiKey ? '[PRESENT]' : '[EMPTY]'
      });
      
      // Prepare settings object
      const settingsToUpdate: AsaasSettings = formValuesToAsaasSettings(data);
      
      logger.log('Saving payment settings:', {
        isEnabled: settingsToUpdate.isEnabled,
        sandboxMode: settingsToUpdate.sandboxMode,
        apiKey: settingsToUpdate.apiKey ? '[PRESENT]' : '[EMPTY]',
        sandboxApiKey: settingsToUpdate.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
        productionApiKey: settingsToUpdate.productionApiKey ? '[PRESENT]' : '[EMPTY]'
      });
      
      // Save settings
      const success = await savePaymentSettings(settingsToUpdate);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As configurações de pagamento foram atualizadas com sucesso.",
        });
        
        // Re-fetch settings to ensure we have the latest data
        const updatedSettings = await getPaymentSettings();
        
        logger.log('Settings fetched after save:', {
          isEnabled: updatedSettings.isEnabled,
          sandboxMode: updatedSettings.sandboxMode,
          sandboxApiKey: updatedSettings.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
          productionApiKey: updatedSettings.productionApiKey ? '[PRESENT]' : '[EMPTY]'
        });
        
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
