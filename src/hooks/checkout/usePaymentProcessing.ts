
import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/types/product';
import { CustomerInfo } from '@/types/order';
import { createPayment } from '@/services/asaas/paymentService';
import { resolveManualStatus } from '@/contexts/order/utils/resolveManualStatus';
import { useOrders } from '@/contexts/order/useOrders';

type PaymentMethod = 'CREDIT_CARD' | 'PIX';

export const usePaymentProcessing = (product: Product | null, customerInfo: CustomerInfo) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { addOrder } = useOrders();
  
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('CREDIT_CARD');
  const [isOrderSubmitted, setIsOrderSubmitted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleCreditCardPayment = useCallback(async (cardData: any) => {
    if (!product) {
      toast({
        title: "Error",
        description: "Product information not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      console.log('Processing credit card payment for product:', product);
      
      // Get product properties using both legacy and new property names
      const productName = product.nome || product.name || '';
      const productPrice = product.preco || product.price || 0;
      const isDigital = product.digital || product.is_digital || false;
      const useCustomProcessing = product.usarProcessamentoPersonalizado || product.override_global_status || false;
      const manualCardStatus = product.statusCartaoManual || product.custom_manual_status || null;
      
      // Create payment with Asaas
      const paymentResult = await createPayment({
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || '',
          cpfCnpj: customerInfo.cpf
        },
        billingType: 'CREDIT_CARD',
        value: productPrice,
        creditCard: cardData.creditCard,
        creditCardHolderInfo: cardData.creditCardHolderInfo,
        installmentCount: 1,
        description: `Payment for ${productName}`,
        overrideGlobalStatus: useCustomProcessing,
        manualCardStatus: useCustomProcessing ? manualCardStatus : null,
        deviceType: 'MOBILE'
      });
      
      console.log('Payment processed successfully:', paymentResult);
      
      // Create order record in database
      const order = await addOrder({
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || '',
          cpf: customerInfo.cpf
        },
        paymentMethod: 'CREDIT_CARD',
        productId: product.id,
        productName: productName,
        productPrice: productPrice,
        isDigitalProduct: isDigital,
        paymentStatus: resolveManualStatus(useCustomProcessing ? manualCardStatus : 'PENDING'),
        paymentId: paymentResult.paymentId,
        deviceType: 'MOBILE'
      });
      
      console.log('Order created successfully:', order);
      
      setIsOrderSubmitted(true);
      toast({
        title: "Success",
        description: "Payment processed successfully",
      });
    } catch (error) {
      console.error('Error processing payment:', error);
      toast({
        title: "Payment Error",
        description: typeof error === 'string' ? error : "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [product, customerInfo, addOrder, toast]);
  
  const handlePixPayment = useCallback(async () => {
    if (!product) {
      toast({
        title: "Error",
        description: "Product information not available",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsProcessing(true);
      
      console.log('Processing PIX payment for product:', product);
      
      // Get product properties using both legacy and new property names
      const productName = product.nome || product.name || '';
      const productPrice = product.preco || product.price || 0;
      const isDigital = product.digital || product.is_digital || false;
      
      // Create payment with Asaas
      const paymentResult = await createPayment({
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || '',
          cpfCnpj: customerInfo.cpf
        },
        billingType: 'PIX',
        value: productPrice,
        description: `Payment for ${productName}`,
        deviceType: 'MOBILE'
      });
      
      console.log('PIX payment created successfully:', paymentResult);
      
      // Calculate expiration date (24 hours from now)
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + 24);
      
      // Create order record in database
      await addOrder({
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone || '',
          cpf: customerInfo.cpf
        },
        paymentMethod: 'PIX',
        productId: product.id,
        productName: productName,
        productPrice: productPrice,
        isDigitalProduct: isDigital,
        paymentStatus: 'PENDING',
        paymentId: paymentResult.paymentId,
        deviceType: 'MOBILE'
      });
      
      // Adaptar para os nomes de campo corretos
      // Se o resultado não vier com encodedImage e payload, use os campos que estiverem disponíveis
      const pixImageUrl = paymentResult.qrCodeImage || '';
      const pixCode = paymentResult.qrCode || '';
      
      // Redirect to PIX payment page
      navigate(`/payment/pix/${paymentResult.paymentId}`, {
        state: {
          pixCode: pixImageUrl,
          pixKey: pixCode,
          totalAmount: String(productPrice),
          productName: productName,
          expirationDate: expirationDate
        }
      });
    } catch (error) {
      console.error('Error creating PIX payment:', error);
      toast({
        title: "PIX Error",
        description: typeof error === 'string' ? error : "Failed to create PIX payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [product, customerInfo, addOrder, navigate, toast]);
  
  const handlePaymentSubmit = useCallback((formData?: any) => {
    if (paymentMethod === 'CREDIT_CARD' && formData) {
      handleCreditCardPayment(formData);
    } else if (paymentMethod === 'PIX') {
      handlePixPayment();
    } else {
      toast({
        title: "Error",
        description: "Please select a payment method",
        variant: "destructive",
      });
    }
  }, [paymentMethod, handleCreditCardPayment, handlePixPayment, toast]);
  
  return {
    paymentMethod,
    setPaymentMethod,
    isOrderSubmitted,
    isProcessing,
    handlePaymentSubmit
  };
};
