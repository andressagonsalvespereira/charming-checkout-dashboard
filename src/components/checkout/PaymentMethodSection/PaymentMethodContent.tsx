
import React from 'react';
import PaymentOptions from '@/components/checkout/payment-methods/PaymentOptions';
import PaymentError from '@/components/checkout/payment-methods/PaymentError';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import SimplifiedPixOption from '@/components/checkout/payment-methods/SimplifiedPixOption';
import PixPayment from '@/components/checkout/PixPayment';
import { PaymentMethodType } from './usePaymentMethodLogic';
import { PaymentResult } from '@/types/payment';
import { logger } from '@/utils/logger';

// Set para rastrear IDs de pagamento já processados
const processedPaymentIds = new Set<string>();

interface PaymentMethodContentProps {
  pixEnabled: boolean;
  cardEnabled: boolean;
  paymentMethod: PaymentMethodType;
  setPaymentMethod: React.Dispatch<React.SetStateAction<PaymentMethodType>>;
  settings: any;
  error: string | null;
  createOrder?: (
    paymentId: string, 
    status: 'pending' | 'confirmed',
    cardDetails?: any,
    pixDetails?: any
  ) => Promise<any>;
  isProcessing: boolean;
  productDetails?: any;
  customerData?: any;
  showPixPayment: boolean;
  setShowPixPayment: React.Dispatch<React.SetStateAction<boolean>>;
}

const PaymentMethodContent: React.FC<PaymentMethodContentProps> = ({
  pixEnabled,
  cardEnabled,
  paymentMethod,
  setPaymentMethod,
  settings,
  error,
  createOrder,
  isProcessing,
  productDetails,
  customerData,
  showPixPayment,
  setShowPixPayment
}) => {
  // Adapt callback functions for different payment components
  const cardFormCallback = async (data: PaymentResult): Promise<any> => {
    if (!createOrder) {
      logger.warn("Tentativa de criar pedido sem função createOrder disponível");
      return null;
    }
    
    // Gerar ID único de pagamento se não fornecido
    const paymentId = data.paymentId || `card_${Date.now()}`;
    
    logger.log("Card form callback triggered", {
      paymentId,
      status: data.status,
      cardLast4: data.cardNumber ? data.cardNumber.slice(-4) : 'N/A',
      brand: data.brand || 'unknown'
    });
    
    // Verificar se este pagamento já foi processado
    if (processedPaymentIds.has(paymentId)) {
      logger.warn(`PaymentMethodContent: Pagamento ${paymentId} já foi processado anteriormente`);
      return { duplicated: true, alreadyProcessed: true, paymentId };
    }
    
    // Marcar como processado
    processedPaymentIds.add(paymentId);
    
    try {
      return await createOrder(
        paymentId,
        data.status === 'confirmed' ? 'confirmed' : 'pending',
        {
          number: data.cardNumber,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          cvv: data.cvv,
          brand: data.brand || 'unknown'
        },
        undefined
      );
    } catch (error) {
      logger.error("Erro ao criar pedido com cartão:", error);
      throw error;
    }
  };
  
  const pixFormCallback = async (data: PaymentResult): Promise<any> => {
    if (!createOrder) {
      logger.warn("Tentativa de criar pedido sem função createOrder disponível");
      return null;
    }
    
    // Gerar ID único de pagamento se não fornecido
    const paymentId = data.paymentId || `pix_${Date.now()}`;
    
    logger.log("PIX form callback triggered", {
      paymentId,
      hasQrCode: !!data.qrCode,
      hasQrCodeImage: !!data.qrCodeImage
    });
    
    // Verificar se este pagamento já foi processado
    if (processedPaymentIds.has(paymentId)) {
      logger.warn(`PaymentMethodContent: Pagamento ${paymentId} já foi processado anteriormente`);
      return { duplicated: true, alreadyProcessed: true, paymentId };
    }
    
    // Marcar como processado
    processedPaymentIds.add(paymentId);
    
    try {
      return await createOrder(
        paymentId,
        'pending',
        undefined,
        {
          qrCode: data.qrCode,
          qrCodeImage: data.qrCodeImage,
          expirationDate: data.expirationDate
        }
      );
    } catch (error) {
      logger.error("Erro ao criar pedido com PIX:", error);
      throw error;
    }
  };

  // Function to handle PIX button click
  const handleShowPixPayment = () => {
    setShowPixPayment(true);
    return Promise.resolve({
      success: true,
      method: 'pix',
      status: 'pending',
      timestamp: new Date().toISOString()
    });
  };

  // Check if the product is digital
  const isDigitalProduct = productDetails?.isDigital || false;

  return (
    <div>
      {pixEnabled && cardEnabled && (
        <PaymentOptions 
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          settings={settings}
        />
      )}
      
      <PaymentError error={error} />
      
      {cardEnabled && paymentMethod === 'card' && (
        <CheckoutForm 
          onSubmit={cardFormCallback}
          isSandbox={settings.sandboxMode}
          isDigitalProduct={isDigitalProduct}
        />
      )}
      
      {pixEnabled && paymentMethod === 'pix' && !showPixPayment && (
        <SimplifiedPixOption 
          onSelect={handleShowPixPayment}
          isSelected={true}
          isProcessing={isProcessing}
        />
      )}
      
      {pixEnabled && paymentMethod === 'pix' && showPixPayment && (
        <PixPayment 
          onPaymentSuccess={(paymentId) => {
            logger.log("PIX payment success with ID:", paymentId);
            return pixFormCallback({
              success: true,
              method: 'pix',
              paymentId,
              status: 'pending',
              timestamp: new Date().toISOString()
            });
          }}
          onPaymentError={(error) => {
            logger.error("PIX payment error:", error);
          }}
          value={productDetails?.price || 0}
          customerName={customerData?.name || ''}
          customerCpfCnpj={customerData?.cpf || ''}
          customerEmail={customerData?.email || ''}
          description={`Payment for ${productDetails?.name || 'product'}`}
        />
      )}
    </div>
  );
};

export default PaymentMethodContent;

// Função para limpar o conjunto de IDs processados (útil para testes)
export const clearProcessedPaymentIds = () => {
  processedPaymentIds.clear();
};
