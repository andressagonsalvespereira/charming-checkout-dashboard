
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
  setFormState: (state: AsaasSettings) => void
) => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (data: PaymentSettingsFormValues) => {
    setIsSaving(true);
    try {
      logger.log('Saving payment settings with form values:', data);
      logger.log('Selected card status to save:', data.manualCardStatus);
      
      // Calculate apiKey based on sandbox mode
      const apiKey = data.sandboxMode 
        ? data.sandboxApiKey || ''
        : data.productionApiKey || '';
        
      const settingsToUpdate = formValuesToAsaasSettings({
        ...data,
        apiKey
      });
      
      logger.log('Transformed settings to save:', settingsToUpdate);
      logger.log('Manual card status being saved:', settingsToUpdate.manualCardStatus);
      
      const success = await savePaymentSettings(settingsToUpdate);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As configurações de pagamento foram atualizadas com sucesso.",
        });
        
        // Re-fetch settings to ensure we have the latest data
        const updatedSettings = await getPaymentSettings();
        logger.log('Reloaded settings after save:', updatedSettings);
        logger.log('Reloaded manual card status:', updatedSettings.manualCardStatus);
        
        // Explicitly preserve the manualCardStatus that was just saved
        if (updatedSettings.manualCardStatus !== data.manualCardStatus) {
          logger.warn(`Manual card status changed from ${data.manualCardStatus} to ${updatedSettings.manualCardStatus} during reload. Restoring original value.`);
          updatedSettings.manualCardStatus = data.manualCardStatus;
        }
        
        form.reset(asaasSettingsToFormValues(updatedSettings));
        setFormState(updatedSettings);
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
