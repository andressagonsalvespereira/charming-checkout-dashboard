
import { useState } from 'react';

// Export the interface so it can be imported elsewhere
export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  cpf: string;
  // Ensure we use consistent property names (cpf instead of document)
}

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
