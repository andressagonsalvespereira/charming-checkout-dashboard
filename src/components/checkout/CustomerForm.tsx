
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { CustomerInfo } from '@/types/order';

interface CustomerFormProps {
  customerDetails: CustomerInfo;
  setCustomerDetails: React.Dispatch<React.SetStateAction<CustomerInfo>>;
  onSubmit: () => boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({ 
  customerDetails, 
  setCustomerDetails, 
  onSubmit 
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerDetails(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium mb-1">
          Nome completo
        </label>
        <Input
          id="name"
          name="name"
          value={customerDetails.name}
          onChange={handleChange}
          placeholder="Digite seu nome completo"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium mb-1">
          Email
        </label>
        <Input
          id="email"
          name="email"
          type="email"
          value={customerDetails.email}
          onChange={handleChange}
          placeholder="seu@email.com"
          required
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium mb-1">
          Telefone
        </label>
        <Input
          id="phone"
          name="phone"
          value={customerDetails.phone || ''}
          onChange={handleChange}
          placeholder="(00) 00000-0000"
        />
      </div>

      <div>
        <label htmlFor="cpf" className="block text-sm font-medium mb-1">
          CPF
        </label>
        <Input
          id="cpf"
          name="cpf"
          value={customerDetails.cpf}
          onChange={handleChange}
          placeholder="000.000.000-00"
          required
        />
      </div>

      <Button 
        type="submit" 
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        Continuar
      </Button>
    </form>
  );
};

export default CustomerForm;
