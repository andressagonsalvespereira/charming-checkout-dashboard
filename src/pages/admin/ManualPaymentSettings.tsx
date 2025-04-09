
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Form } from '@/components/ui/form';
import { Loader2 } from 'lucide-react';
import { usePaymentSettingsForm } from '@/components/admin/payment-settings/hooks/usePaymentSettingsForm';
import ManualPaymentSettingsPanel from '@/components/admin/payment-settings/ManualPaymentSettingsPanel';
import SubmitButton from '@/components/admin/payment-settings/SubmitButton';

const ManualPaymentSettingsPage = () => {
  const { form, formState, loading, isSaving, onSubmit } = usePaymentSettingsForm();

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2 text-lg">Carregando configurações...</span>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Configurações de Pagamento Manual</h1>
        <p className="text-muted-foreground">Gerencie como os pagamentos manuais são processados</p>
      </div>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ManualPaymentSettingsPanel form={form} />
          <SubmitButton isSaving={isSaving} />
        </form>
      </Form>
    </AdminLayout>
  );
};

export default ManualPaymentSettingsPage;
