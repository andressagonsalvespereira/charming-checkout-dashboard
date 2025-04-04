
import { CardFormData } from '@/components/checkout/payment-methods/CardForm';
import { detectCardBrand } from '../cardDetection';
import { DeviceType } from '@/types/order';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '@/utils/logger';
import { resolveManualStatus } from '@/contexts/order/utils/resolveManualStatus';

interface ProcessManualPaymentParams {
  cardData: CardFormData;
  formState: any;
  settings: any;
  deviceType: DeviceType;
  navigate: (path: string, state?: any) => void;
  setIsSubmitting: (isSubmitting: boolean) => void;
  setError: (error: string) => void;
  toast: (config: { title: string; description: string; variant?: "default" | "destructive"; duration?: number }) => void;
  onSubmit?: (data: any) => Promise<any> | any;
}

/**
 * Processa pagamento manual de cartão (modo de testes/sandbox)
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
}: ProcessManualPaymentParams) {
  setIsSubmitting(true);
  
  try {
    logger.log("Processamento manual com configurações:", {
      formState: {
        useCustomProcessing: formState.useCustomProcessing,
        manualCardStatus: formState.manualCardStatus
      },
      settings: {
        manualCardStatus: settings.manualCardStatus
      },
      isDigitalProduct: formState.isDigitalProduct
    });
    
    // Gera ID de pagamento simulado para rastreamento
    const paymentId = `manual_${uuidv4()}`;
    
    // Determina status do pagamento com base nas configurações
    let rawPaymentStatus = 'PENDING';
    
    // Verifica se deve usar configurações específicas do produto primeiro
    if (formState.useCustomProcessing && formState.manualCardStatus) {
      rawPaymentStatus = formState.manualCardStatus;
      logger.log(`Usando configuração de status específica do produto: ${rawPaymentStatus}`);
    } else if (settings.manualCardStatus) {
      rawPaymentStatus = settings.manualCardStatus;
      logger.log(`Usando configuração de status global: ${rawPaymentStatus}`);
    }
    
    // Normaliza o status para um dos valores suportados pelo sistema
    const normalizedStatus = resolveManualStatus(rawPaymentStatus);
    logger.log("Status normalizado:", { 
      raw: rawPaymentStatus, 
      normalized: normalizedStatus 
    });
    
    // Detecta bandeira do cartão
    const brand = detectCardBrand(cardData.cardNumber);
    
    // Prepara o objeto de resultado de pagamento
    const paymentResult = {
      success: normalizedStatus !== "REJECTED",
      method: 'card',
      paymentId,
      status: normalizedStatus,
      cardNumber: cardData.cardNumber.replace(/\s+/g, ''),
      expiryMonth: cardData.expiryMonth,
      expiryYear: cardData.expiryYear,
      cvv: cardData.cvv,
      brand,
      timestamp: new Date().toISOString(),
      deviceType
    };
    
    // Envia os dados de pagamento para criar um pedido
    logger.log("Enviando dados para criar pedido");
    
    // Chama onSubmit e aguarda o resultado
    const result = onSubmit ? await onSubmit(paymentResult) : null;
    logger.log("Pedido criado com sucesso");
    
    // Determina para onde navegar com base no status do pagamento
    const orderData = result ? {
      orderId: result.id,
      productName: result.productName,
      productPrice: result.productPrice,
      productId: result.productId,
      productSlug: result.productSlug || formState.productSlug, // Adiciona productSlug para uso no PaymentFailed
      paymentMethod: result.paymentMethod,
      paymentStatus: normalizedStatus
    } : {
      paymentStatus: normalizedStatus
    };
    
    // Função auxiliar para determinar o caminho de redirecionamento com base no status
    const getRedirectPath = () => {
      if (normalizedStatus === "REJECTED") {
        logger.log(`Redirecionando para página de falha devido ao status: ${normalizedStatus}`);
        return '/payment-failed';
      } else if (normalizedStatus === "CONFIRMED") {
        logger.log(`Redirecionando para página de sucesso devido ao status: ${normalizedStatus}`);
        return '/payment-success';
      } else {
        // Se o status for PENDING ou qualquer outro, usa a página de sucesso mas indica que está em análise
        logger.log(`Redirecionando para página de sucesso com status em análise: ${normalizedStatus}`);
        return '/payment-success';
      }
    };
    
    // Notificação toast com base no status
    if (normalizedStatus !== "REJECTED") {
      toast({
        title: normalizedStatus === "CONFIRMED" ? "Pagamento Aprovado" : "Pagamento em Análise",
        description: normalizedStatus === "CONFIRMED"
          ? "Seu pagamento foi aprovado com sucesso!" 
          : "Seu pagamento foi recebido e está em análise.",
        duration: 5000,
        variant: "default"
      });
    } else {
      toast({
        title: "Pagamento Recusado",
        description: "Seu pagamento foi recusado. Por favor, tente novamente.",
        variant: "destructive",
        duration: 5000,
      });
    }
    
    // Navega para a página apropriada
    const redirectPath = getRedirectPath();
    logger.log(`Redirecionando para: ${redirectPath} com estado:`, orderData);
    
    navigate(redirectPath, { 
      state: { orderData }
    });
    
    return paymentResult;
  } catch (error) {
    logger.error('Erro no processamento manual:', error);
    setError('Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.');
    
    // Mostrar toast de erro
    toast({
      title: "Erro no Processamento",
      description: "Ocorreu um erro ao processar seu pagamento. Por favor, tente novamente.",
      variant: "destructive",
      duration: 5000,
    });
    
    // Retorna um resultado de erro corretamente tipado
    return {
      success: false,
      method: 'card',
      error: error instanceof Error ? error.message : 'Erro desconhecido',
      status: 'REJECTED', // Usamos REJECTED como status padrão para erros
      timestamp: new Date().toISOString()
    };
  } finally {
    setIsSubmitting(false);
  }
}
