
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CardFormData } from '@/components/checkout/payment-methods/CardForm';
import { PaymentResult } from '@/types/payment';
import { processCreditCardPayment } from '@/utils/payment/paymentProcessor';
import { AsaasSettings, ManualCardStatus } from '@/types/asaas';
import { DeviceType, PaymentStatus } from '@/types/order';
import { logger } from '@/utils/logger';
import { resolveManualStatus, isRejectedStatus } from '@/contexts/order/utils';

export interface UseCardPaymentProps {
  onSubmit: (data: PaymentResult) => Promise<any>;
  isSandbox: boolean;
  isDigitalProduct?: boolean;
  useCustomProcessing?: boolean;
  manualCardStatus?: ManualCardStatus;
  settings?: AsaasSettings;
}

export function useCardPayment({
  onSubmit,
  isSandbox,
  isDigitalProduct = false,
  useCustomProcessing = false,
  manualCardStatus = 'ANALYSIS',
  settings
}: UseCardPaymentProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  
  // Detect device type for analytics
  const isMobileDevice = typeof window !== 'undefined' ? 
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) : 
    false;
  
  const deviceType: DeviceType = isMobileDevice ? 'mobile' : 'desktop';
  
  const handleSubmit = useCallback(async (cardData: CardFormData) => {
    setError(null);
    setIsSubmitting(true);
    
    try {
      logger.log("Processing card payment", { 
        isSandbox, 
        useCustomProcessing,
        manualCardStatus,
        isDigitalProduct 
      });
      
      // Normalize status immediately for consistent evaluation
      let effectiveManualStatus = manualCardStatus;
      // Convert ManualCardStatus to PaymentStatus
      const resolvedStatus = resolveManualStatus(effectiveManualStatus);
      
      // Check if manual card status is REJECTED before processing
      if (useCustomProcessing && effectiveManualStatus) {
        logger.log("Checking manual status before processing:", {
          manualCardStatus: effectiveManualStatus,
          resolvedStatus
        });
        
        if (isRejectedStatus(resolvedStatus)) {
          logger.log("Payment rejected before processing due to manual status settings");
          setError('Pagamento recusado pela operadora.');
          toast({
            title: "Payment Declined",
            description: "Your payment was declined. Please try again.",
            variant: "destructive",
            duration: 5000,
          });
          
          // Return early with failed payment result
          const rejectedResult: PaymentResult = {
            success: false,
            error: 'Pagamento recusado pela operadora.',
            method: 'card',
            status: 'REJECTED',
            timestamp: new Date().toISOString()
          };
          
          // Still call onSubmit to record the rejected payment
          await onSubmit(rejectedResult);
          setIsSubmitting(false);
          
          return rejectedResult;
        }
      }
      
      // Continue with normal processing
      const result = await processCreditCardPayment(cardData, {
        productDetails: {
          isDigitalProduct,
          custom_manual_status: effectiveManualStatus,
          override_global_status: useCustomProcessing
        },
        paymentSettings: {
          isSandbox,
          manualCardProcessing: useCustomProcessing,
          manualCardStatus: effectiveManualStatus,
          useCustomProcessing
        },
        onSubmit,
        callbacks: {
          onSubmitting: setIsSubmitting,
          onError: setError,
          onStatusChange: setPaymentStatus
        },
        deviceInfo: {
          deviceType
        }
      });
      
      // Log the result to help diagnose redirection issues
      logger.log("Payment processing result:", {
        success: result.success,
        status: result.status,
        normalizedStatus: result.status ? resolveManualStatus(result.status) : 'UNKNOWN'
      });
      
      return result;
    } catch (error) {
      logger.error("Error processing card payment:", error);
      setError(error instanceof Error ? error.message : 'An error occurred processing your payment');
      setIsSubmitting(false);
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  }, [isSandbox, useCustomProcessing, manualCardStatus, isDigitalProduct, onSubmit, toast, deviceType]);
  
  const getButtonText = useCallback(() => {
    if (useCustomProcessing && settings?.manualCardProcessing) {
      const status = resolveManualStatus(manualCardStatus);
      if (isRejectedStatus(status)) {
        return 'Simular Pagamento Recusado';
      }
      return 'Simular Pagamento';
    }
    return 'Pagar com Cartão';
  }, [useCustomProcessing, settings, manualCardStatus]);
  
  const getAlertMessage = useCallback(() => {
    if (useCustomProcessing && settings?.manualCardProcessing) {
      const status = resolveManualStatus(manualCardStatus);
      if (isRejectedStatus(status)) {
        return 'Este pagamento está configurado para ser recusado (modo de teste)';
      }
      return 'Este pagamento é processado em modo de teste.';
    }
    return 'Processando pagamento...';
  }, [useCustomProcessing, settings, manualCardStatus]);
  
  const getAlertStyles = useCallback(() => {
    const status = manualCardStatus ? resolveManualStatus(manualCardStatus) : 'PENDING';
    
    if (useCustomProcessing) {
      if (isRejectedStatus(status)) {
        return {
          alertClass: 'bg-red-50 border-red-200',
          iconClass: 'text-red-600',
          textClass: 'text-red-800'
        };
      } else if (status === 'PAID') { // Changed from 'APPROVED' to 'PAID'
        return {
          alertClass: 'bg-green-50 border-green-200',
          iconClass: 'text-green-600',
          textClass: 'text-green-800'
        };
      }
    }
    return {
      alertClass: 'bg-blue-50 border-blue-200',
      iconClass: 'text-blue-600',
      textClass: 'text-blue-800'
    };
  }, [useCustomProcessing, manualCardStatus]);
  
  return {
    isSubmitting,
    setIsSubmitting,
    error,
    setError,
    paymentStatus,
    setPaymentStatus,
    handleSubmit,
    getButtonText,
    getAlertMessage,
    getAlertStyles,
    settings: {
      manualCardProcessing: settings?.manualCardProcessing || false,
      manualCardStatus: settings?.manualCardStatus || 'ANALYSIS'
    }
  };
}
