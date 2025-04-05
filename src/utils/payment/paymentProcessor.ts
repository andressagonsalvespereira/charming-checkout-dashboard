import { PaymentResult } from '@/types/payment';
import { CardFormData } from '@/components/checkout/payment-methods/CardForm';
import { detectCardBrand } from '@/utils/payment/cardDetection';
import { v4 as uuidv4 } from 'uuid';
import { DeviceType } from '@/types/order';
import { logger } from '@/utils/logger';
import { resolveManualStatus, isRejectedStatus } from '@/contexts/order/utils';

/**
 * Base interface for all payment processors
 */
export interface PaymentProcessorConfig {
  customerInfo?: {
    name: string;
    email: string;
    cpf: string;
    phone: string;
    address?: {
      street: string;
      number: string;
      complement?: string;
      neighborhood: string;
      city: string;
      state: string;
      postalCode: string;
    };
  };
  productDetails?: {
    productId?: string;
    productName?: string;
    productPrice?: number;
    isDigitalProduct?: boolean;
    custom_manual_status?: string;
    override_global_status?: boolean;
  };
  paymentSettings: {
    isSandbox: boolean;
    manualCardProcessing?: boolean;
    manualCardStatus?: string;
    useCustomProcessing?: boolean;
  };
  onSubmit: (result: PaymentResult) => Promise<any> | any;
  callbacks?: {
    onSuccess?: (result: PaymentResult) => Promise<any> | any;
    onError?: (errorMessage: string) => void;
    onStatusChange?: (status: string) => void;
    onSubmitting?: (isSubmitting: boolean) => void;
    onNavigation?: (path: string, state?: any) => void;
  };
  deviceInfo?: {
    deviceType: DeviceType;
  };
}

/**
 * Process credit card payment
 */
export const processCreditCardPayment = async (
  cardData: CardFormData, 
  config: PaymentProcessorConfig
): Promise<PaymentResult> => {
  const { 
    paymentSettings, 
    callbacks,
    deviceInfo,
    productDetails,
    onSubmit
  } = config;

  // Create default callbacks if not provided
  const safeCallbacks = callbacks || {};
  const setSubmitting = safeCallbacks.onSubmitting || (() => {});
  const handleError = safeCallbacks.onError || (() => {});
  const handleStatusChange = safeCallbacks.onStatusChange || (() => {});

  // Set form to submitting state
  setSubmitting(true);

  try {
    logger.log("Processing credit card payment", {
      productId: productDetails?.productId,
      isDigital: productDetails?.isDigitalProduct,
      manualProcessing: paymentSettings.manualCardProcessing,
      deviceType: deviceInfo?.deviceType || 'unknown',
      customManualStatus: productDetails?.custom_manual_status,
      useCustomStatus: productDetails?.override_global_status
    });

    // Detect card brand
    const brand = detectCardBrand(cardData.cardNumber);

    // Generate payment ID
    const paymentId = `card_${uuidv4()}`;
    
    // Determine payment status based on settings
    let paymentStatus = 'PENDING';
    
    if (paymentSettings.manualCardProcessing) {
      // First check if product has a custom manual status that overrides global settings
      if (productDetails?.override_global_status && productDetails?.custom_manual_status) {
        paymentStatus = productDetails.custom_manual_status;
        logger.log("Using product-specific manual status:", paymentStatus);
      } else if (paymentSettings.manualCardStatus) {
        paymentStatus = paymentSettings.manualCardStatus;
        logger.log("Using global manual status:", paymentStatus);
      }

      // Use resolveManualStatus to normalize status
      const normalizedStatus = resolveManualStatus(paymentStatus);
      paymentStatus = normalizedStatus;

      logger.log("Final manual card status after normalization:", paymentStatus);
      
      // If status is 'REJECTED', we should handle it accordingly
      if (paymentStatus === 'REJECTED') {
        logger.log("Payment status is set to REJECTED, creating rejected payment result");
        
        // Create rejected payment result
        const rejectedResult: PaymentResult = {
          success: false,
          method: 'card',
          paymentId,
          status: 'REJECTED',
          timestamp: new Date().toISOString(),
          cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
          expiryMonth: cardData.expiryMonth,
          expiryYear: cardData.expiryYear,
          cvv: cardData.cvv,
          brand,
          deviceType: deviceInfo?.deviceType,
          error: 'Payment declined by the processor'
        };
        
        // Still record the rejected payment
        await onSubmit(rejectedResult);
        
        if (handleStatusChange) {
          handleStatusChange('REJECTED');
        }
        
        // Return early with the rejected result
        return rejectedResult;
      }
    } else {
      // In automatic mode, simulate a successful payment
      paymentStatus = 'CONFIRMED';
    }

    // Create payment result
    const paymentResult: PaymentResult = {
      success: paymentStatus !== 'REJECTED',
      method: 'card',
      paymentId,
      status: paymentStatus,
      timestamp: new Date().toISOString(),
      cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv,
      brand,
      deviceType: deviceInfo?.deviceType
    };

    // If success, send to onSubmit callback
    if (paymentResult.success) {
      logger.log("Card payment processed successfully", {
        paymentId,
        status: paymentStatus
      });

      await onSubmit(paymentResult);
      
      if (handleStatusChange) {
        handleStatusChange(paymentStatus);
      }
    } else {
      throw new Error('Payment declined by the processor');
    }

    return paymentResult;
  } catch (error) {
    logger.error('Error processing card payment:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unexpected error during payment processing';
    
    handleError(errorMessage);
    
    return {
      success: false,
      method: 'card',
      status: 'FAILED',
      timestamp: new Date().toISOString(),
      error: errorMessage
    };
  } finally {
    // Set form back to non-submitting state
    setSubmitting(false);
  }
};

/**
 * Process PIX payment
 */
export const processPixPayment = async (
  config: PaymentProcessorConfig
): Promise<PaymentResult> => {
  const { 
    paymentSettings, 
    callbacks,
    deviceInfo,
    productDetails,
    onSubmit
  } = config;

  // Create default callbacks if not provided
  const safeCallbacks = callbacks || {};
  const setSubmitting = safeCallbacks.onSubmitting || (() => {});
  const handleError = safeCallbacks.onError || (() => {});
  const handleStatusChange = safeCallbacks.onStatusChange || (() => {});

  // Set form to submitting state
  setSubmitting(true);

  try {
    logger.log("Processing PIX payment", {
      productId: productDetails?.productId,
      isDigital: productDetails?.isDigitalProduct,
      deviceType: deviceInfo?.deviceType || 'unknown'
    });

    // Generate payment ID and PIX data
    const paymentId = `pix_${uuidv4()}`;
    const currentTime = new Date().toISOString();
    const expirationDate = new Date(Date.now() + 30 * 60 * 1000).toISOString();
    
    // PIX test data
    const qrCode = '00020126580014BR.GOV.BCB.PIX01362979144b5e9f45a48fcb311d8981b64883a44c520400005303986540510.005802BR5925Test Recipient6009Sao Paulo62070503***63048A9D';
    const qrCodeImage = 'https://chart.googleapis.com/chart?chs=300x300&cht=qr&chl=00020126580014BR.GOV.BCB.PIX01362979144b5e9f45a48fcb311d8981b64883a44c520400005303986540510.005802BR5925Test Recipient6009Sao Paulo62070503***63048A9D';

    // Create payment result
    const paymentResult: PaymentResult = {
      success: true,
      method: 'pix',
      paymentId,
      status: 'PENDING',
      timestamp: currentTime,
      qrCode,
      qrCodeImage,
      expirationDate,
      deviceType: deviceInfo?.deviceType
    };

    logger.log("PIX payment processed successfully", {
      paymentId,
      status: 'PENDING',
      expirationDate
    });

    await onSubmit(paymentResult);
      
    if (handleStatusChange) {
      handleStatusChange('PENDING');
    }

    return paymentResult;
  } catch (error) {
    logger.error('Error processing PIX payment:', error);
    
    const errorMessage = error instanceof Error 
      ? error.message 
      : 'Unexpected error during PIX processing';
    
    handleError(errorMessage);
    
    return {
      success: false,
      method: 'pix',
      status: 'FAILED',
      timestamp: new Date().toISOString(),
      error: errorMessage
    };
  } finally {
    // Set form back to non-submitting state
    setSubmitting(false);
  }
};
