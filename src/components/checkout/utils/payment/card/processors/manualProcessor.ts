
import { CardFormData } from '@/components/checkout/payment-methods/CardForm';
import { PaymentResult } from '@/types/payment';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { detectCardBrand } from '../cardDetection';
import { v4 as uuidv4 } from 'uuid';
import { DeviceType } from '@/types/order';
import { logger } from '@/utils/logger';
import { resolveManualStatus } from '@/contexts/order/utils';

interface ProcessManualPaymentParams {
  cardData: CardFormData;
  formState: any;
  settings: any;
  deviceType: DeviceType;
  navigate: ReturnType<typeof useNavigate>;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  toast?: ReturnType<typeof useToast>['toast'];
  onSubmit?: (data: any) => Promise<any> | any;
}

/**
 * Processes manual card payment (test/sandbox mode)
 */
export async function processManualPayment({
  cardData,
  formState,
  settings,
  deviceType,
  navigate,
  setIsSubmitting,
  setError,
  toast,
  onSubmit
}: ProcessManualPaymentParams): Promise<PaymentResult> {
  setIsSubmitting(true);
  
  try {
    logger.log("Manual processing with settings:", {
      manualCardStatus: settings.manualCardStatus,
      isDigitalProduct: formState.isDigitalProduct
    });
    
    // Generate simulated payment ID for tracking
    const paymentId = `manual_${uuidv4()}`;
    
    // Determine payment status based on settings
    let paymentStatus = 'PENDING';
    
    // Check if should use product-specific settings first
    if (formState.useCustomProcessing && formState.manualCardStatus) {
      paymentStatus = formState.manualCardStatus;
      logger.log(`Using product-specific status: ${paymentStatus}`);
    } else if (settings.manualCardStatus) {
      paymentStatus = settings.manualCardStatus;
      logger.log(`Using global status: ${paymentStatus}`);
    }
    
    // Normalize payment status using resolveManualStatus
    paymentStatus = resolveManualStatus(paymentStatus);
    
    // Detect card brand
    const brand = detectCardBrand(cardData.cardNumber);
    
    // Prepare payment result object
    const paymentResult: PaymentResult = {
      success: paymentStatus !== 'REJECTED',
      method: 'card', // Fixed: using literal 'card' instead of string
      paymentId,
      status: paymentStatus,
      cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv,
      brand,
      timestamp: new Date().toISOString(),
      deviceType
    };
    
    // Send payment data to create an order
    logger.log("Sending data to create order");
    
    // Call onSubmit and await result
    const result = onSubmit ? await onSubmit(paymentResult) : null;
    logger.log("Order created successfully");
    
    // Determine where to navigate based on payment status
    const orderData = result ? {
      orderId: result.id,
      productName: result.productName,
      productPrice: result.productPrice,
      productId: result.productId,
      productSlug: result.productSlug, // Include productSlug for redirection
      paymentMethod: result.paymentMethod,
      paymentStatus: paymentStatus
    } : {
      paymentStatus: paymentStatus
    };
    
    // Helper function to determine redirect path based on status
    const getRedirectPath = () => {
      if (paymentStatus === 'REJECTED') {
        logger.log(`Redirecting to failure page due to status: ${paymentStatus}`);
        return '/payment-failed';
      } else if (paymentStatus === 'CONFIRMED') {
        logger.log(`Redirecting to success page due to status: ${paymentStatus}`);
        return '/payment-success';
      } else {
        // If status is PENDING or any other, use success page but indicate it's in analysis
        logger.log(`Redirecting to success page with pending status: ${paymentStatus}`);
        return '/payment-success';
      }
    };
    
    // Toast notification based on status
    if (paymentStatus !== 'REJECTED') {
      toast?.({
        title: paymentStatus === 'CONFIRMED' ? "Payment Approved" : "Payment in Analysis",
        description: paymentStatus === 'CONFIRMED' 
          ? "Your payment was successfully approved!" 
          : "Your payment has been received and is being analyzed.",
        duration: 5000,
        variant: "default"
      });
    } else {
      toast?.({
        title: "Payment Declined",
        description: "Your payment was declined. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
    
    // Navigate to appropriate page
    const redirectPath = getRedirectPath();
    logger.log(`Redirecting to: ${redirectPath} with state:`, orderData);
    
    navigate(redirectPath, { 
      state: { orderData }
    });
    
    return paymentResult;
  } catch (error) {
    logger.error('Error in manual processing:', error);
    setError('An error occurred while processing your payment. Please try again.');
    
    // Show error toast
    toast?.({
      title: "Processing Error",
      description: "An error occurred while processing your payment. Please try again.",
      variant: "destructive",
      duration: 5000,
    });
    
    // Return correctly typed error result
    return {
      success: false,
      method: 'card', // Fixed: using literal 'card' instead of string
      error: error instanceof Error ? error.message : 'Unknown error',
      status: 'FAILED',
      timestamp: new Date().toISOString()
    };
  } finally {
    setIsSubmitting(false);
  }
}
