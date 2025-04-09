
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AsaasSettings } from '@/types/asaas';
import { 
  PaymentSettingsSchema, 
  PaymentSettingsFormValues, 
  asaasSettingsToFormValues 
} from '../../utils/formUtils';
import { useFormState } from './useFormState';
import { useSettingsLoader } from './useSettingsLoader';
import { useFormSubmission } from './useFormSubmission';
import { useFormWatcher } from './useFormWatcher';

/**
 * Main hook for payment settings form that combines all the smaller hooks
 */
export const usePaymentSettingsForm = () => {
  // Initial default form state
  const initialFormState: AsaasSettings = {
    isEnabled: false,
    manualCardProcessing: false,
    manualCardStatus: 'ANALYSIS',
    manualCreditCard: false,
    allowPix: true,
    allowCreditCard: true,
    sandboxMode: true,
    sandboxApiKey: '',
    productionApiKey: '',
    manualPixPage: false,
    manualPaymentConfig: false,
    apiKey: '',
  };

  // Initialize the form with Zod resolver
  const form = useForm<PaymentSettingsFormValues>({
    resolver: zodResolver(PaymentSettingsSchema),
    defaultValues: asaasSettingsToFormValues(initialFormState),
    mode: 'onChange',
  });

  // Use our refactored hooks
  const { formState, updateFormState } = useFormState(initialFormState);
  const { loading } = useSettingsLoader(form, updateFormState);
  const { isSaving, onSubmit } = useFormSubmission(form, updateFormState);
  
  // Watch for form changes
  useFormWatcher(form, updateFormState);

  return {
    form,
    formState,
    loading,
    isSaving,
    onSubmit,
    updateFormState
  };
};
