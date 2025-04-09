
import React from 'react';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import AsaasIntegrationCard from './AsaasIntegrationCard';
import PaymentMethodsCard from './PaymentMethodsCard';
import ApiKeysCard from './ApiKeysCard';
import ManualPaymentSettings from './ManualPaymentSettings';
import SubmitButton from './SubmitButton';
import { usePaymentSettingsForm } from './hooks/usePaymentSettingsForm';
import { AsaasSettings } from '@/types/asaas';

const LoadingState = () => (
  <div className="flex items-center justify-center h-40">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
    <span className="ml-2 text-lg">Carregando configurações...</span>
  </div>
);

const PaymentSettingsContent = ({ 
  form, 
  formState, 
  loading, 
  isSaving, 
  onSubmit, 
  updateFormState 
}: ReturnType<typeof usePaymentSettingsForm>) => (
  <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <AsaasIntegrationCard 
        formState={formState as AsaasSettings} 
        loading={loading}
        onUpdateFormState={updateFormState as (updater: (prev: AsaasSettings) => AsaasSettings) => void}
      />
      
      <PaymentMethodsCard 
        formState={formState as AsaasSettings} 
        loading={loading}
        onUpdateFormState={updateFormState as (updater: (prev: AsaasSettings) => AsaasSettings) => void}
      />
      
      <ApiKeysCard 
        formState={formState as AsaasSettings}
        onUpdateFormState={updateFormState as (updater: (prev: AsaasSettings) => AsaasSettings) => void}
      />
      
      <ManualPaymentSettings form={form} />
      
      <SubmitButton isSaving={isSaving} />
    </form>
  </Form>
);

const PaymentSettingsForm = () => {
  const { form, formState, loading, isSaving, onSubmit, updateFormState } = usePaymentSettingsForm();

  if (loading) {
    return <LoadingState />;
  }

  return (
    <PaymentSettingsContent 
      form={form}
      formState={formState} 
      loading={loading}
      isSaving={isSaving}
      onSubmit={onSubmit}
      updateFormState={updateFormState}
    />
  );
};

export default PaymentSettingsForm;
