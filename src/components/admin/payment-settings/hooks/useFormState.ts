
import { useState } from 'react';
import { AsaasSettings } from '@/types/asaas';
import { PaymentSettingsFormValues, asaasSettingsToFormValues } from '../../utils/formUtils';
import { logger } from '@/utils/logger';

/**
 * Hook to manage the form state in the payment settings form
 */
export const useFormState = (initialState: AsaasSettings) => {
  const [formState, setFormState] = useState<AsaasSettings>(initialState);
  
  const updateFormState = (
    updater: (prev: AsaasSettings) => AsaasSettings
  ) => {
    setFormState(prev => {
      const newFormState = updater(prev);
      
      // Only log if there's an actual change
      if (JSON.stringify(prev) !== JSON.stringify(newFormState)) {
        logger.log('Updating form state with new values:', newFormState);
        logger.log('New manual card status:', newFormState.manualCardStatus);
        logger.log('New integration enabled status:', newFormState.isEnabled);
      }
      
      return newFormState;
    });
    
    return asaasSettingsToFormValues(formState);
  };

  return { formState, updateFormState };
};
