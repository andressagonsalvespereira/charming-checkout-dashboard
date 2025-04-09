
import React from 'react';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import CardForm, { CardFormData } from './payment-methods/CardForm';
import PaymentError from './payment-methods/PaymentError';
import PaymentStatusMessage from './payment-methods/PaymentStatusMessage';
import { useCardPayment } from '@/hooks/payment/useCardPayment';
import { PaymentResult } from '@/types/payment';
import { logger } from '@/utils/logger';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { isRejectedStatus, resolveManualStatus } from '@/contexts/order/utils/resolveManualStatus';
import { useNavigate } from 'react-router-dom';

interface CheckoutFormProps {
  onSubmit: (data: PaymentResult) => Promise<any>;
  isSandbox: boolean;
  isDigitalProduct?: boolean;
  useCustomProcessing?: boolean;
  manualCardStatus?: ManualCardStatus;
}

const CheckoutForm = ({ 
  onSubmit, 
  isSandbox, 
  isDigitalProduct = false,
  useCustomProcessing = false,
  manualCardStatus
}: CheckoutFormProps) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    paymentStatus,
    handleSubmit,
    getButtonText,
    getAlertMessage,
    getAlertStyles
  } = useCardPayment({
    isSandbox,
    useCustomProcessing,
    manualCardStatus,
    isDigitalProduct,
    onSubmit
  });

  const handleCardFormSubmit = async (cardData: CardFormData) => {
    logger.log("Processing card payment form submission");
    
    try {
      // Log important debug information
      logger.log("Payment configuration:", {
        isSandbox,
        useCustomProcessing,
        manualCardStatus,
        isStatusRejected: manualCardStatus ? isRejectedStatus(resolveManualStatus(manualCardStatus)) : false
      });
      
      const result = await handleSubmit(cardData);
      
      // Enhanced logging to track payment flow
      logger.log("Payment result received:", {
        status: result.status,
        success: result.success,
        hasError: !!result.error
      });
      
      // Check if payment was rejected
      if (result.status === 'REJECTED' || (result.status && isRejectedStatus(resolveManualStatus(result.status)))) {
        logger.log("Payment was rejected:", result);
        toast({
          title: "Payment Declined",
          description: "Your payment was declined by the payment processor.",
          variant: "destructive",
          duration: 5000,
        });
        
        // Redirect to payment failed page for rejected payments
        navigate('/payment-failed', {
          state: { 
            orderData: {
              error: result.error,
              status: 'DENIED'
            }
          }
        });
        
        // Still return the result for further processing
        return result;
      }
      
      // For successful payments, ensure redirection happens
      if (result.success) {
        const normalizedStatus = result.status ? resolveManualStatus(result.status) : 'PENDING';
        logger.log("Successful payment, normalized status:", normalizedStatus);
        
        // Redirect based on the normalized status
        if (normalizedStatus === 'PAID') {
          navigate('/payment-success', {
            state: { 
              orderData: {
                status: normalizedStatus
              }
            }
          });
        } else if (normalizedStatus === 'PENDING' || normalizedStatus === 'ANALYSIS') {
          navigate('/payment-success', {
            state: { 
              orderData: {
                status: normalizedStatus
              }
            }
          });
        }
      }
      
      return result;
    } catch (error) {
      logger.error("Error in handleCardFormSubmit:", error);
      
      toast({
        title: "Payment processing error",
        description: "There was an error processing your payment. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      
      // Redirect to payment failed page on error
      navigate('/payment-failed', {
        state: { 
          orderData: {
            error: error instanceof Error ? error.message : 'Unknown error'
          }
        }
      });
      
      throw error;
    }
  };

  if (paymentStatus) {
    return <PaymentStatusMessage status={paymentStatus} />;
  }

  const alertStyles = getAlertStyles();
  const buttonText = getButtonText();

  return (
    <div className="space-y-4">
      {useCustomProcessing && (
        <Alert className={alertStyles.alertClass}>
          <AlertCircle className={`h-4 w-4 ${alertStyles.iconClass}`} />
          <AlertDescription className={alertStyles.textClass}>
            {getAlertMessage()}
          </AlertDescription>
        </Alert>
      )}
      
      <PaymentError error={error} />
      
      <CardForm 
        onSubmit={handleCardFormSubmit}
        isSubmitting={isSubmitting}
        buttonText={buttonText}
        loading={isSubmitting}
      />
    </div>
  );
};

export default CheckoutForm;
