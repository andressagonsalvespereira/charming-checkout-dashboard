
import React, { useState, useEffect, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import CheckoutProgressBar from '@/components/checkout/CheckoutProgress';

// Define context type
interface CheckoutContainerContextType {
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
  productSlug?: string;
}

// Create the context
const CheckoutContainerContext = createContext<CheckoutContainerContextType | undefined>(undefined);

// Create provider component
export const CheckoutContainerProvider: React.FC<{
  children: React.ReactNode;
  value: CheckoutContainerContextType;
}> = ({ children, value }) => {
  return (
    <CheckoutContainerContext.Provider value={value}>
      {children}
    </CheckoutContainerContext.Provider>
  );
};

// Create hook to use this context
export const useCheckoutContainer = () => {
  const context = useContext(CheckoutContainerContext);
  if (context === undefined) {
    throw new Error('useCheckoutContainer must be used within a CheckoutContainerProvider');
  }
  return context;
};

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
  const { productSlug } = useParams<{ productSlug: string }>();
  const [steps, setSteps] = useState<string[]>(['Produto', 'Dados', 'Pagamento', 'Confirmação']);

  // Adjust steps based on payment method and settings
  useEffect(() => {
    // Default steps
    let newSteps = ['Produto', 'Dados', 'Pagamento', 'Confirmação'];
    
    setSteps(newSteps);
  }, [paymentMethod]);

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
        <div className="grid grid-cols-4 gap-2">
          {steps.map((step, index) => (
            <div 
              key={index}
              className={`text-center p-2 rounded-md ${
                index < currentStep ? 'bg-green-100 text-green-800' :
                index === currentStep ? 'bg-blue-100 text-blue-800' : 
                'bg-gray-100 text-gray-400'
              }`}
            >
              {step}
            </div>
          ))}
        </div>
      </div>
      {children}
    </CheckoutContainerProvider>
  );
};

export default CheckoutProgressContainer;
