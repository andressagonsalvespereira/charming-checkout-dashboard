
import { CardFormData } from '@/components/checkout/payment-methods/CardForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { PaymentProcessorProps, PaymentResult } from '../../types';
import { detectCardBrand } from '../cardDetection';
import { simulatePayment } from '../../paymentSimulator';
import { DeviceType } from '@/types/order';
import { logger } from '@/utils/logger';
import { logCardProcessingDecisions } from '../cardProcessorLogs';
import { resolveManualStatus, isRejectedStatus } from '@/contexts/order/utils';

interface ProcessAutomaticPaymentParams {
  cardData: CardFormData;
  formState: any;
  settings: any;
  isSandbox: boolean;
  deviceType: DeviceType;
  setPaymentStatus?: (status: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  navigate: ReturnType<typeof useNavigate>;
  toast?: ReturnType<typeof useToast>['toast'];
  onSubmit?: (data: any) => Promise<any> | any;
}

interface AlertStyles {
  alertClass: string;
  iconClass: string;
  textClass: string;
}

const getAlertStyles = (): AlertStyles => {
  return {
    alertClass: "alert alert-info",
    iconClass: "lucide-info",
    textClass: "font-semibold"
  };
};

export const processAutomaticPayment = async ({
  cardData,
  formState,
  settings,
  isSandbox,
  deviceType,
  setPaymentStatus = () => {},
  setIsSubmitting,
  setError,
  navigate,
  toast,
  onSubmit
}: ProcessAutomaticPaymentParams): Promise<PaymentResult> => {
  try {
    logger.log("Automatic processing with settings:", {
      manualCardStatus: settings.manualCardStatus,
      isDigitalProduct: formState.isDigitalProduct,
      useCustomProcessing: formState.useCustomProcessing || false,
      productManualStatus: formState.custom_manual_status,
      globalManualStatus: settings.manualCardStatus
    });

    // Check if we should respect manual settings despite being in automatic mode
    // This allows product-specific or global manual settings to override automatic processing
    let resolvedStatus = 'CONFIRMED';

    // Decision logic for determining payment status
    const useCustomProcessing = formState.useCustomProcessing || false;
    const productManualStatus = formState.custom_manual_status;
    const globalManualStatus = settings.manualCardStatus;

    logCardProcessingDecisions(useCustomProcessing, productManualStatus, settings.manualCardProcessing, globalManualStatus);

    // If product has custom processing enabled, respect its status
    if (useCustomProcessing && productManualStatus) {
      resolvedStatus = resolveManualStatus(productManualStatus);
      logger.log("Using product-specific manual status:", resolvedStatus);
    }
    // If global manual processing is enabled, respect global status
    else if (settings.manualCardProcessing && globalManualStatus) {
      resolvedStatus = resolveManualStatus(globalManualStatus);
      logger.log("Using global manual status:", resolvedStatus);
    }
    
    // Generate a payment ID for tracking
    const paymentId = `card_${Date.now()}`;

    // Log the final resolved status to help debug
    logger.log("Final payment status decision:", {
      resolvedStatus,
      isRejected: isRejectedStatus(resolvedStatus)
    });

    // Processing decisions based on the resolved status
    if (isRejectedStatus(resolvedStatus)) {
      logger.log("Payment automatically declined based on manual settings");
      
      // If payment is rejected, create a rejected result and call onSubmit
      if (onSubmit) {
        // Create the rejected payment data
        const rejectedPaymentData: PaymentResult = {
          success: false,
          paymentId,
          method: 'card',
          status: 'REJECTED',
          timestamp: new Date().toISOString(),
          cardNumber: cardData.cardNumber,
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          cvv: cardData.cvv,
          brand: detectCardBrand(cardData.cardNumber),
          deviceType,
          error: 'Payment declined by the processor based on settings'
        };
        
        // Record the rejected payment
        await onSubmit(rejectedPaymentData);
        
        // Set status for UI updates
        setPaymentStatus('REJECTED');
      }
      
      if (toast) {
        toast({
          title: "Payment Declined",
          description: "Your payment was declined. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
      
      // Navigate to the failure page with explicit state data
      navigate('/payment-failed', {
        state: { 
          orderData: {
            productId: formState.productId,
            productName: formState.productName,
            productPrice: formState.productPrice,
            productSlug: formState.productSlug,
            paymentStatus: 'DENIED',
            status: 'DENIED'
          }
        }
      });
      
      // Return a rejected payment result
      return {
        success: false,
        paymentId,
        method: 'card',
        status: 'REJECTED',
        timestamp: new Date().toISOString(),
        error: 'Pagamento recusado pela operadora'
      };
    }

    // Simulate payment with a timeout
    await simulatePayment(isSandbox ? 1500 : 1000);

    // Update payment status in UI
    setPaymentStatus(resolvedStatus);

    // Detect card brand for the payment data
    const brand = detectCardBrand(cardData.cardNumber);

    // Format the data for creating the order
    const orderData = {
      orderId: paymentId,
      productId: formState.productId,
      productName: formState.productName,
      productPrice: formState.productPrice,
      productSlug: formState.productSlug,
      paymentMethod: 'card',
      paymentStatus: resolvedStatus,
      status: resolvedStatus,
      cardDetails: {
        brand,
        last4: cardData.cardNumber.slice(-4)
      }
    };

    // Call onSubmit and await result
    if (onSubmit) {
      await onSubmit(orderData);
      logger.log("Order created successfully");
    }

    // Determine redirect path based on payment status
    const redirectPath = resolvedStatus === 'PAID' || resolvedStatus === 'CONFIRMED' 
      ? '/payment-success' 
      : isRejectedStatus(resolvedStatus) ? '/payment-failed' : '/payment-success';
    
    logger.log(`Redirecting to: ${redirectPath} with status: ${resolvedStatus}`);

    // Toast notification based on status
    if (toast) {
      if (!isRejectedStatus(resolvedStatus)) {
        toast({
          title: resolvedStatus === "PAID" || resolvedStatus === "CONFIRMED" 
            ? "Payment Approved" 
            : "Payment in Analysis",
          description: resolvedStatus === "PAID" || resolvedStatus === "CONFIRMED"
            ? "Your payment was successfully approved!"
            : "Your payment has been received and is being analyzed.",
          duration: 5000,
          variant: "default"
        });
      } else {
        toast({
          title: "Payment Declined",
          description: "Your payment was declined. Please try again.",
          variant: "destructive",
          duration: 5000,
        });
      }
    }

    // Navigate to appropriate page with complete state data
    navigate(redirectPath, {
      state: { 
        orderData: {
          ...orderData,
          paymentStatus: resolvedStatus,
          status: resolvedStatus
        }
      }
    });

    // Return payment result
    return {
      success: true,
      paymentId,
      method: 'card',
      status: resolvedStatus,
      timestamp: new Date().toISOString(),
      cardNumber: cardData.cardNumber,
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv,
      brand
    };
  } catch (error) {
    logger.error("Error in automatic card processing:", error);
    setError(error instanceof Error ? error.message : 'Falha ao processar pagamento');
    setIsSubmitting(false);

    // Navigate to failure page for persistent errors
    navigate('/payment-failed', {
      state: {
        orderData: {
          productName: formState.productName,
          productId: formState.productId,
          productSlug: formState.productSlug,
          productPrice: formState.productPrice,
          error: error instanceof Error ? error.message : 'Falha ao processar pagamento'
        }
      }
    });

    return {
      success: false,
      error: 'Falha ao processar pagamento',
      method: 'card',
      status: 'FAILED',
      timestamp: new Date().toISOString()
    };
  }
};

export default processAutomaticPayment;
