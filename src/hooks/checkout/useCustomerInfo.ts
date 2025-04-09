
import { useState } from 'react';
import { CustomerInfo } from '@/types/order';

export const useCustomerInfo = () => {
  const [customerDetails, setCustomerDetails] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    cpf: ''
  });

  const [step, setStep] = useState<'customer-info' | 'payment-method'>('customer-info');

  const handleSubmitCustomerInfo = () => {
    // Validate customer information
    if (!customerDetails.name || !customerDetails.email || !customerDetails.cpf) {
      console.error('Missing required customer information');
      return false;
    }

    // Move to payment method selection
    setStep('payment-method');
    return true;
  };

  return {
    customerDetails,
    setCustomerDetails,
    step,
    setStep,
    handleSubmitCustomerInfo
  };
};
