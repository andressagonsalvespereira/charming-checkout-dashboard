
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import PaymentSettingsForm from '@/components/admin/payment-settings/PaymentSettingsForm';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { CreditCard } from 'lucide-react';

const PaymentSettings = () => {
  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Integração com Asaas</h1>
          <p className="text-muted-foreground">Configure o processamento de pagamentos PIX com o Asaas</p>
        </div>
        
        <Link to="/admin/settings/manual-payment">
          <Button variant="outline" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Configuração de Cartão Manual
          </Button>
        </Link>
      </div>
      
      <PaymentSettingsForm />
    </AdminLayout>
  );
};

export default PaymentSettings;
