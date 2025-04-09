
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
  updateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void
) => {
  // Update formState when the form values change
  useEffect(() => {
    let previousValues = JSON.stringify(form.getValues());
    
    const subscription = form.watch((value) => {
      if (!value) return;
      
      // Prevent unnecessary updates
      const currentValues = JSON.stringify(value);
      if (previousValues === currentValues) return;
      
      previousValues = currentValues;
      logger.log('Form values changed:', value);
      
      // Explicitly log the manual card status
      if (value.manualCardStatus) {
        logger.log('Manual card status updated in form:', value.manualCardStatus);
      }
      
      updateFormState(() => formValuesToAsaasSettings(value as PaymentSettingsFormValues));
    });
    
    return () => subscription.unsubscribe();
  }, [form, updateFormState]);
};
