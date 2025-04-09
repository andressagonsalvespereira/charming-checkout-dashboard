
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { AsaasSettings } from '@/types/asaas';
import { 
  PaymentSettingsSchema, 
  PaymentSettingsFormValues, 
  formValuesToAsaasSettings, 
  asaasSettingsToFormValues 
} from '../../utils/formUtils';
import { getPaymentSettings, savePaymentSettings } from '@/services/paymentSettingsService';
import { logger } from '@/utils/logger';

export const usePaymentSettingsForm = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [formState, setFormState] = useState<AsaasSettings>({
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
  });

  const form = useForm<PaymentSettingsFormValues>({
    resolver: zodResolver(PaymentSettingsSchema),
    defaultValues: {
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
    },
  });

  // Load settings on mount
  useEffect(() => {
    const loadSettings = async () => {
      setLoading(true);
      try {
        const settings = await getPaymentSettings();
        logger.log('Loaded payment settings:', settings);
        const formValues = asaasSettingsToFormValues(settings);
        form.reset(formValues);
        setFormState(settings);
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
  }, [form, toast]);

  // Update formState when the form values change
  useEffect(() => {
    const subscription = form.watch((value) => {
      setFormState(formValuesToAsaasSettings(value as PaymentSettingsFormValues));
    });
    
    return () => subscription.unsubscribe();
  }, [form]);

  const onSubmit = async (data: PaymentSettingsFormValues) => {
    setIsSaving(true);
    try {
      logger.log('Saving payment settings with form values:', data);
      
      // Calculate apiKey based on sandbox mode
      const apiKey = data.sandboxMode 
        ? data.sandboxApiKey || ''
        : data.productionApiKey || '';
        
      const settingsToUpdate = formValuesToAsaasSettings({
        ...data,
        apiKey
      });
      
      logger.log('Transformed settings to save:', settingsToUpdate);
      
      const success = await savePaymentSettings(settingsToUpdate);
      
      if (success) {
        toast({
          title: "Configurações salvas",
          description: "As configurações de pagamento foram atualizadas com sucesso.",
        });
        
        // Re-fetch settings to ensure we have the latest data
        const updatedSettings = await getPaymentSettings();
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

  const updateFormState = (
    updater: (prev: AsaasSettings) => AsaasSettings
  ) => {
    const newFormState = updater(formState);
    form.reset(asaasSettingsToFormValues(newFormState));
  };

  return {
    form,
    formState,
    loading,
    isSaving,
    onSubmit,
    updateFormState
  };
};
