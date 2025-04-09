
import { useState, useEffect } from 'react';
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
    const newFormState = updater(formState);
    logger.log('Updating form state with new values:', newFormState);
    logger.log('New manual card status:', newFormState.manualCardStatus);
    setFormState(newFormState);
    return asaasSettingsToFormValues(newFormState);
  };

  return { formState, updateFormState };
};
