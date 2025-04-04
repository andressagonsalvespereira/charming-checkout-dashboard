import { CardFormData } from '@/components/checkout/payment-methods/CardForm';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { PaymentProcessorProps, PaymentResult } from '../../types';
import { detectCardBrand } from '../cardDetection';
import { simulatePayment } from '../../paymentSimulator';
import { DeviceType } from '@/types/order';
import { logger } from '@/utils/logger';
import { logCardProcessingDecisions } from '../cardProcessorLogs';
import { resolveManualStatus } from '@/contexts/order/utils';

interface ProcessAutomaticPaymentParams {
  cardData: CardFormData;
  formState: any;
  settings: any;
  isSandbox: boolean;
  deviceType: DeviceType;
  setPaymentStatus: (status: string) => void;
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

interface PaymentError {
  error: string | null;
}

const PaymentError = ({ error }: PaymentError) => {
  if (!error) return null;

  return (
    <div className="alert alert-error">
      <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      <span>{error}</span>
    </div>
  );
};

interface AlertCircle {
  className: string;
}

const AlertCircle = ({ className }: AlertCircle) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="8" x2="12" y2="12" />
      <line x1="12" y1="16" x2="12" y2="16" />
    </svg>
  );
};

interface AlertDescription {
  children: React.ReactNode;
  className: string;
}

const AlertDescription = ({ children, className }: AlertDescription) => {
  return (
    <span className={className}>{children}</span>
  );
};

interface Alert {
  children: React.ReactNode;
  className: string;
}

const Alert = ({ children, className }: Alert) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

interface CardFormProps {
  onSubmit: (data: any) => Promise<any> | any;
  isSubmitting: boolean;
  buttonText: string;
  loading: boolean;
  handleCardFormSubmit: (cardData: CardFormData) => Promise<void>;
}

const CardForm = ({ onSubmit, isSubmitting, buttonText, loading, handleCardFormSubmit }: CardFormProps) => {
  return (
    <form onSubmit={async (e) => {
      e.preventDefault();
      const formData = new FormData(e.currentTarget);

      const cardData: CardFormData = {
        cardNumber: formData.get('cardNumber') as string,
        expiryMonth: formData.get('expiryMonth') as string,
        expiryYear: formData.get('expiryYear') as string,
        cvv: formData.get('cvv') as string,
        cardHolderName: formData.get('cardHolderName') as string,
        installments: formData.get('installments') as string,
      };

      await handleCardFormSubmit(cardData);
    }}>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label htmlFor="cardNumber" className="label">
            <span className="label-text">Número do Cartão</span>
          </label>
          <input type="text" name="cardNumber" placeholder="0000 0000 0000 0000" className="input input-bordered w-full" />
        </div>

        <div>
          <label htmlFor="expiryMonth" className="label">
            <span className="label-text">Mês de Expiração</span>
          </label>
          <input type="text" name="expiryMonth" placeholder="MM" className="input input-bordered w-24" />
        </div>

        <div>
          <label htmlFor="expiryYear" className="label">
            <span className="label-text">Ano de Expiração</span>
          </label>
          <input type="text" name="expiryYear" placeholder="AA" className="input input-bordered w-24" />
        </div>

        <div>
          <label htmlFor="cvv" className="label">
            <span className="label-text">CVV</span>
          </label>
          <input type="text" name="cvv" placeholder="CVV" className="input input-bordered w-24" />
        </div>

        <div>
          <label htmlFor="cardHolderName" className="label">
            <span className="label-text">Nome do Titular</span>
          </label>
          <input type="text" name="cardHolderName" placeholder="Nome Completo" className="input input-bordered w-full" />
        </div>

        <div>
          <label htmlFor="installments" className="label">
            <span className="label-text">Parcelas</span>
          </label>
          <select name="installments" className="select select-bordered w-full">
            <option value="1">1x à vista</option>
            <option value="2">2x sem juros</option>
            <option value="3">3x sem juros</option>
          </select>
        </div>

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? <span className="loading loading-spinner"></span> : buttonText}
        </button>
      </div>
    </form>
  );
};

interface CheckoutFormProps {
  cardData: CardFormData;
  formState: any;
  settings: any;
  isSandbox: boolean;
  deviceType: DeviceType;
  setPaymentStatus: (status: string) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  navigate: ReturnType<typeof useNavigate>;
  toast?: ReturnType<typeof useToast>['toast'];
  onSubmit?: (data: any) => Promise<any> | any;
}

const getButtonText = () => {
  return "Finalizar Pagamento";
};

const CheckoutForm = ({
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
}: CheckoutFormProps) => {
  const [error, setErrorState] = React.useState<string | null>(null);
  const [isSubmitting, setIsSubmittingState] = React.useState(false);
  const useCustomProcessing = formState.useCustomProcessing || false;
  const productManualStatus = formState.manualCardStatus;
  const globalManualStatus = settings.manualCardStatus;

  const handleCardFormSubmit = async (cardData: CardFormData) => {
    setIsSubmittingState(true);
    setErrorState(null);

    try {
      logger.log("Automatic processing with settings:", {
        manualCardStatus: settings.manualCardStatus,
        isDigitalProduct: formState.isDigitalProduct,
        useCustomProcessing,
        productManualStatus,
        globalManualStatus
      });

      // Check if we should respect manual settings despite being in automatic mode
      // This allows product-specific or global manual settings to override automatic processing
      let resolvedStatus = 'CONFIRMED';

      // Decision logic for determining payment status
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

      // Processing decisions based on the resolved status
      if (resolvedStatus === 'PENDING') {
        logger.log("Payment set to pending based on manual settings");
      } else {
        logger.log("Payment automatically confirmed based on automatic settings");
      }

      // For declined payments, we should fail the transaction immediately
      if (resolvedStatus === 'REJECTED') {
        logger.log("Payment automatically declined based on manual settings");
        throw new Error('Pagamento recusado pela operadora');
      }

      // Simulate payment
      const paymentId = `card_${Date.now()}`;
      await simulatePayment(isSandbox);

      setPaymentStatus(resolvedStatus);

      // Format the data for creating the order
      const orderData = {
        orderId: paymentId,
        productName: formState.productName,
        productPrice: formState.productPrice,
        productId: formState.productId,
        productSlug: formState.productSlug, // Include productSlug for redirection
        paymentMethod: 'card',
        paymentStatus: resolvedStatus
      };

      // Call onSubmit and await result
      const result = onSubmit ? await onSubmit(orderData) : null;
      logger.log("Order created successfully");

      // Determine where to navigate based on payment status
      const getRedirectPath = () => {
        if (resolvedStatus === 'REJECTED') {
          logger.log(`Redirecting to failure page due to status: ${resolvedStatus}`);
          return '/payment-failed';
        } else if (resolvedStatus === 'CONFIRMED') {
          logger.log(`Redirecting to success page due to status: ${resolvedStatus}`);
          return '/payment-success';
        } else {
          // If status is PENDING or any other, use success page but indicate it's in analysis
          logger.log(`Redirecting to success page with pending status: ${resolvedStatus}`);
          return '/payment-success';
        }
      };

      // Toast notification based on status
      if (resolvedStatus !== 'REJECTED') {
        toast?.({
          title: resolvedStatus === "CONFIRMED" ? "Payment Approved" : "Payment in Analysis",
          description: resolvedStatus === "CONFIRMED"
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

      return {
        success: true,
        paymentId,
        method: 'card', // Fixed: using literal 'card' instead of string
        status: resolvedStatus,
        timestamp: new Date().toISOString()
      };
    } catch (error) {
      logger.error("Error in automatic card processing:", error);
      setErrorState(error instanceof Error ? error.message : 'Falha ao processar pagamento');
      setIsSubmittingState(false);

      // Navigate to failure page for persistent errors
      navigate('/payment-failed', {
        state: {
          productName: formState.productName,
          error: error instanceof Error ? error.message : 'Falha ao processar pagamento'
        }
      });

      return {
        success: false,
        error: 'Falha ao processar pagamento',
        method: 'card', // Fixed: using literal 'card' instead of string
        status: 'FAILED',
        timestamp: new Date().toISOString()
      };
    }
  };

  const getAlertMessage = () => {
    return "This is a test payment, no real money will be charged.";
  };

  const alertStyles = getAlertStyles();
  const buttonText = getButtonText();

  return (
    <div className="space-y-4">
      {isSandbox && (
        <Alert className={alertStyles.alertClass}>
          <AlertCircle className={`h-4 w-4 ${alertStyles.iconClass}`} />
          <AlertDescription className={alertStyles.textClass}>
            {getAlertMessage()}
          </AlertDescription>
        </Alert>
      )}

      <PaymentError error={error} />

      <CardForm
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
        buttonText={buttonText}
        loading={isSubmitting}
        handleCardFormSubmit={handleCardFormSubmit}
      />
    </div>
  );
};

export default CheckoutForm;
