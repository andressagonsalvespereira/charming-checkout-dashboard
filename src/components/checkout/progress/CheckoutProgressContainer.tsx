import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import CheckoutProgressBar from '@/components/checkout/CheckoutProgress';
import { useAsaas } from '@/contexts/asaas';
import { CheckoutContainerProvider } from './hooks/useCheckoutContainerOrder';

interface CheckoutProgressContainerProps {
  children: React.ReactNode;
  currentStep: number;
  setCurrentStep: React.Dispatch<React.SetStateAction<number>>;
  isProcessing: boolean;
  setIsProcessing: React.Dispatch<React.SetStateAction<boolean>>;
  paymentMethod: 'card' | 'pix';
  setPaymentMethod: React.Dispatch<React.SetStateAction<'card' | 'pix'>>;
  customerData: any;
  setCustomerData: React.Dispatch<React.SetStateAction<any>>;
  productDetails: any;
  setProductDetails: React.Dispatch<React.SetStateAction<any>>;
  orderId: string | null;
  setOrderId: React.Dispatch<React.SetStateAction<string | null>>;
  paymentId: string | null;
  setPaymentId: React.Dispatch<React.SetStateAction<string | null>>;
  pixCode: string | null;
  setPixCode: React.Dispatch<React.SetStateAction<string | null>>;
  pixImage: string | null;
  setPixImage: React.Dispatch<React.SetStateAction<string | null>>;
  paymentStatus: string | null;
  setPaymentStatus: React.Dispatch<React.SetStateAction<string | null>>;
  error: string | null;
  setError: React.Dispatch<React.SetStateAction<string | null>>;
}

const CheckoutProgressContainer: React.FC<CheckoutProgressContainerProps> = ({
  children,
  currentStep,
  setCurrentStep,
  isProcessing,
  setIsProcessing,
  paymentMethod,
  setPaymentMethod,
  customerData,
  setCustomerData,
  productDetails,
  setProductDetails,
  orderId,
  setOrderId,
  paymentId,
  setPaymentId,
  pixCode,
  setPixCode,
  pixImage,
  setPixImage,
  paymentStatus,
  setPaymentStatus,
  error,
  setError,
}) => {
  const { settings } = useAsaas();
  const { productSlug } = useParams<{ productSlug: string }>();
  const [steps, setSteps] = useState<string[]>(['Produto', 'Dados', 'Pagamento', 'Confirmação']);

  // Adjust steps based on payment method and settings
  useEffect(() => {
    if (settings) {
      // Default steps
      let newSteps = ['Produto', 'Dados', 'Pagamento', 'Confirmação'];
      
      // If manual PIX page is enabled and PIX is selected, add a PIX step
      if (settings.manualPixPage && paymentMethod === 'pix') {
        newSteps = ['Produto', 'Dados', 'Pagamento', 'PIX', 'Confirmação'];
      }
      
      setSteps(newSteps);
    }
  }, [settings, paymentMethod]);

  return (
    <CheckoutContainerProvider
      value={{
        currentStep,
        setCurrentStep,
        isProcessing,
        setIsProcessing,
        paymentMethod,
        setPaymentMethod,
        customerData,
        setCustomerData,
        productDetails,
        setProductDetails,
        orderId,
        setOrderId,
        paymentId,
        setPaymentId,
        pixCode,
        setPixCode,
        pixImage,
        setPixImage,
        paymentStatus,
        setPaymentStatus,
        error,
        setError,
        productSlug,
      }}
    >
      <div className="mb-8">
        <CheckoutProgressBar steps={steps} currentStep={currentStep} />
      </div>
      {children}
    </CheckoutContainerProvider>
  );
};

export default CheckoutProgressContainer;
