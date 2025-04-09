
import { useState, useEffect, useRef } from 'react';
import { useToast } from '@/hooks/use-toast';
import { UseFormReturn } from 'react-hook-form';
import { AsaasSettings } from '@/types/asaas';
import { PaymentSettingsFormValues, asaasSettingsToFormValues } from '../../utils/formUtils';
import { getPaymentSettings } from '@/services/paymentSettingsService';
import { logger } from '@/utils/logger';

/**
 * Hook to handle loading settings from the API
 */
export const useSettingsLoader = (
  form: UseFormReturn<PaymentSettingsFormValues>,
  updateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void
) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const isLoadedRef = useRef(false);

  // Load settings on mount - only once
  useEffect(() => {
    // Prevent multiple loads
    if (isLoadedRef.current) return;

    const loadSettings = async () => {
      setLoading(true);
      try {
        const settings = await getPaymentSettings();
        logger.log('Loaded payment settings:', settings);
        
        // Ensure status is properly set
        logger.log('Card status from database:', settings.manualCardStatus);
        
        const formValues = asaasSettingsToFormValues(settings);
        form.reset(formValues);
        updateFormState(() => settings);
        
        // Mark as loaded
        isLoadedRef.current = true;
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: "Erro ao carregar configurações",
          description: "Não foi possível carregar as configurações de pagamento.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadSettings();
  }, [form, toast, updateFormState]);

  return { loading };
};
