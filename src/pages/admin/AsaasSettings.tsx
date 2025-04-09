
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PaymentSettingsForm from '@/components/admin/payment-settings/PaymentSettingsForm';

/**
 * AsaasSettings page that uses the refactored PaymentSettingsForm component
 * This component is now much simpler as all the form logic has been moved to
 * the PaymentSettingsForm component
 */
const AsaasSettings = () => {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Asaas Payment Settings</h1>
        <p className="text-muted-foreground">Configure your Asaas payment integration</p>
      </div>
      
      <PaymentSettingsForm />
    </AdminLayout>
  );
};

export default AsaasSettings;
