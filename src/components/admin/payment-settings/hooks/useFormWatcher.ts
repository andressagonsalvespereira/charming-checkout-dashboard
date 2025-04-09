
import { useEffect } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { AsaasSettings } from '@/types/asaas';
import { PaymentSettingsFormValues, formValuesToAsaasSettings } from '../../utils/formUtils';
import { logger } from '@/utils/logger';

/**
 * Hook to watch form changes and update form state
 */
export const useFormWatcher = (
  form: UseFormReturn<PaymentSettingsFormValues>,
  updateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void,
  loading: boolean = false
) => {
  // Update formState when the form values change
  useEffect(() => {
    // Don't watch during initial loading to prevent unnecessary updates
    if (loading) return;
    
    let previousValues = JSON.stringify(form.getValues());
    
    const subscription = form.watch((value) => {
      if (!value) return;
      
      // Prevent unnecessary updates
      const currentValues = JSON.stringify(value);
      if (previousValues === currentValues) return;
      
      previousValues = currentValues;
      logger.log('Form values changed:', value);
      
      // Explicitly log the manual card status and integration status
      if (value.manualCardStatus) {
        logger.log('Manual card status updated in form:', value.manualCardStatus);
      }
      
      if (value.isEnabled !== undefined) {
        logger.log('Integration enabled status updated in form:', value.isEnabled);
      }
      
      const updatedSettings = formValuesToAsaasSettings(value as PaymentSettingsFormValues);
      logger.log('Transformed settings from form watch:', {
        ...updatedSettings,
        isEnabled: updatedSettings.isEnabled,
        sandboxApiKey: updatedSettings.sandboxApiKey ? '[present]' : '[empty]',
        productionApiKey: updatedSettings.productionApiKey ? '[present]' : '[empty]',
      });
      
      updateFormState(() => updatedSettings);
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateFormState, loading]);
};
