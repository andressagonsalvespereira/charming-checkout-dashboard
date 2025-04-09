
import { Order, RawOrder, PaymentMethod, PaymentStatus, DeviceType, CardDetails, PixDetails } from '@/types/order';
import { logger } from '@/utils/logger';

/**
 * Converte um objeto RawOrder (snake_case do Supabase) para Order (camelCase)
 */
export const mapOrderFromSupabase = (rawOrder: RawOrder, 
  extraData?: { 
    cardDetails?: CardDetails, 
    pixDetails?: PixDetails,
    customerAddress?: any 
  }): Order => {
  
  try {
    logger.log('Mapping order from Supabase format:', {
      orderId: rawOrder.id,
      hasCardDetails: !!extraData?.cardDetails,
      hasPixDetails: !!extraData?.pixDetails
    });
    
    const order: Order = {
      id: rawOrder.id,
      customerName: rawOrder.customer_name,
      customerEmail: rawOrder.customer_email,
      customerCpf: rawOrder.customer_cpf,
      customerPhone: rawOrder.customer_phone,
      productId: rawOrder.product_id,
      productName: rawOrder.product_name,
      price: rawOrder.price,
      productPrice: rawOrder.price, // Para compatibilidade com componentes legados
      paymentMethod: rawOrder.payment_method as PaymentMethod,
      paymentStatus: rawOrder.payment_status as PaymentStatus,
      paymentId: rawOrder.payment_id,
      creditCardBrand: rawOrder.credit_card_brand,
      deviceType: rawOrder.device_type as DeviceType,
      isDigitalProduct: rawOrder.is_digital_product,
      asaasPaymentId: rawOrder.asaas_payment_id,
      createdAt: rawOrder.created_at,
      updatedAt: rawOrder.updated_at,
      orderDate: rawOrder.created_at, // Para compatibilidade com componentes legados
      
      // Adiciona os detalhes extras, se fornecidos
      cardDetails: extraData?.cardDetails || rawOrder.card_details,
      pixDetails: extraData?.pixDetails || rawOrder.pix_details,
      
      // Adiciona objeto customer para compatibilidade com componentes legados
      customer: {
        name: rawOrder.customer_name,
        email: rawOrder.customer_email,
        cpf: rawOrder.customer_cpf,
        phone: rawOrder.customer_phone,
        address: extraData?.customerAddress
      }
    };
    
    return order;
  } catch (error) {
    logger.error('Error mapping order from Supabase:', error);
    throw error;
  }
};

/**
 * Converte um objeto Order (camelCase) para RawOrder (snake_case para Supabase)
 */
export const mapOrderToSupabase = (order: Order): Omit<RawOrder, 'card_details' | 'pix_details'> => {
  try {
    return {
      id: order.id,
      customer_name: order.customerName || order.customer?.name || '',
      customer_email: order.customerEmail || order.customer?.email || '',
      customer_cpf: order.customerCpf || order.customer?.cpf || '',
      customer_phone: order.customerPhone || order.customer?.phone,
      product_id: typeof order.productId === 'string' ? parseInt(order.productId) : order.productId,
      product_name: order.productName,
      price: order.price || order.productPrice || 0,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      payment_id: order.paymentId,
      credit_card_brand: order.creditCardBrand,
      device_type: order.deviceType,
      is_digital_product: order.isDigitalProduct,
      asaas_payment_id: order.asaasPaymentId,
      created_at: order.createdAt || order.orderDate || new Date().toISOString(),
      updated_at: order.updatedAt || new Date().toISOString()
    };
  } catch (error) {
    logger.error('Error mapping order to Supabase:', error);
    throw error;
  }
};

/**
 * Mapeia um array de RawOrder para Order
 */
export const mapOrdersFromSupabase = (rawOrders: RawOrder[]): Order[] => {
  return rawOrders.map(rawOrder => mapOrderFromSupabase(rawOrder));
};
