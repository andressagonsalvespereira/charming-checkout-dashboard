
import { Order, PaymentStatus } from '@/types/order';
import { 
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  deleteOrder as apiDeleteOrder,
  deleteOrdersByPaymentMethod as apiDeleteOrdersByPaymentMethod
} from '@/services/orderService';
import { logger } from '@/utils/logger';

export const createOrder = async (orderData: any): Promise<Order> => {
  try {
    logger.log("Creating order with service:", {
      paymentMethod: orderData.paymentMethod,
      hasCardDetails: !!orderData.cardDetails,
      hasPixDetails: !!orderData.pixDetails
    });
    
    const dbOrder = await apiCreateOrder(orderData);
    
    // Transform the database response to match the Order type structure
    const order: Order = {
      id: dbOrder.id,
      customerName: dbOrder.customer_name,
      customerEmail: dbOrder.customer_email,
      customerCpf: dbOrder.customer_cpf,
      customerPhone: dbOrder.customer_phone || undefined,
      productId: dbOrder.product_id,
      productName: dbOrder.product_name,
      price: dbOrder.price,
      productPrice: dbOrder.price, // For legacy component compatibility
      paymentMethod: dbOrder.payment_method as any,
      paymentStatus: dbOrder.payment_status as PaymentStatus,
      paymentId: dbOrder.payment_id,
      creditCardBrand: dbOrder.credit_card_brand,
      deviceType: dbOrder.device_type as any,
      isDigitalProduct: dbOrder.is_digital_product,
      asaasPaymentId: dbOrder.asaas_payment_id,
      createdAt: dbOrder.created_at,
      updatedAt: dbOrder.updated_at,
      orderDate: dbOrder.created_at, // For legacy component compatibility
      
      // Add the additional fields from orderData
      cardDetails: orderData.cardDetails || undefined,
      pixDetails: orderData.pixDetails || undefined,
      
      // Add customer object for legacy components
      customer: {
        name: dbOrder.customer_name || orderData.customer?.name,
        email: dbOrder.customer_email || orderData.customer?.email,
        cpf: dbOrder.customer_cpf || orderData.customer?.cpf,
        phone: dbOrder.customer_phone || orderData.customer?.phone,
        address: orderData.customer?.address
      }
    };
    
    return order;
  } catch (error) {
    logger.error('Error in createOrder utility:', error);
    throw error;
  }
};

export const updateOrderStatusData = async (
  orders: Order[], 
  id: string, 
  status: PaymentStatus
): Promise<{ updatedOrder: Order; updatedOrders: Order[] }> => {
  try {
    const dbOrder = await apiUpdateOrderStatus(id, status);
    
    // Transform the database response to match the Order type structure
    const updatedOrder: Order = {
      id: dbOrder.id,
      customerName: dbOrder.customer_name,
      customerEmail: dbOrder.customer_email,
      customerCpf: dbOrder.customer_cpf,
      customerPhone: dbOrder.customer_phone || undefined,
      productId: dbOrder.product_id,
      productName: dbOrder.product_name,
      price: dbOrder.price,
      productPrice: dbOrder.price, // For legacy component compatibility
      paymentMethod: dbOrder.payment_method as any,
      paymentStatus: dbOrder.payment_status as PaymentStatus,
      paymentId: dbOrder.payment_id,
      creditCardBrand: dbOrder.credit_card_brand,
      deviceType: dbOrder.device_type as any,
      isDigitalProduct: dbOrder.is_digital_product,
      asaasPaymentId: dbOrder.asaas_payment_id,
      createdAt: dbOrder.created_at,
      updatedAt: dbOrder.updated_at,
      orderDate: dbOrder.created_at, // For legacy component compatibility
      
      // Add customer object for legacy components
      customer: {
        name: dbOrder.customer_name,
        email: dbOrder.customer_email,
        cpf: dbOrder.customer_cpf,
        phone: dbOrder.customer_phone
      }
    };
    
    const updatedOrders = orders.map(order => {
      if (String(order.id) === String(id)) {
        return {
          ...order,
          paymentStatus: status,
          updatedAt: new Date().toISOString()
        };
      }
      return order;
    });
    
    return { updatedOrder, updatedOrders };
  } catch (error) {
    logger.error('Error updating order status:', error);
    throw error;
  }
};

export const deleteOrderData = async (id: string): Promise<void> => {
  try {
    await apiDeleteOrder(id);
  } catch (error) {
    logger.error('Error deleting order:', error);
    throw error;
  }
};

export const deleteAllOrdersByPaymentMethodData = async (
  method: 'CREDIT_CARD' | 'PIX'
): Promise<void> => {
  try {
    await apiDeleteOrdersByPaymentMethod(method);
  } catch (error) {
    logger.error('Error deleting orders by payment method:', error);
    throw error;
  }
};
