
import { useState } from 'react';

export interface CustomerInfo {
  name: string;
  email: string;
  phone?: string;
  document: string;
}

export const useCustomerInfo = () => {
  const [customerDetails, setCustomerDetails] = useState<CustomerInfo>({
    name: '',
    email: '',
    phone: '',
    document: ''
  });

  const [step, setStep] = useState<'customer-info' | 'payment-method'>('customer-info');

  const handleSubmitCustomerInfo = () => {
    // Validate customer information
    if (!customerDetails.name || !customerDetails.email || !customerDetails.document) {
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
