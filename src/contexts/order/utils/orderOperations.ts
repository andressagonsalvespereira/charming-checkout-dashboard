
import { Order, PaymentStatus } from '@/types/order';
import { 
  createOrder as apiCreateOrder,
  updateOrderStatus as apiUpdateOrderStatus,
  deleteOrder as apiDeleteOrder,
  deleteOrdersByPaymentMethod as apiDeleteOrdersByPaymentMethod
} from '@/services/orderService';
import { logger } from '@/utils/logger';
import { mapOrderFromSupabase } from './orderMappers';

export const createOrder = async (orderData: any): Promise<Order> => {
  try {
    logger.log("Creating order with service:", {
      paymentMethod: orderData.paymentMethod,
      hasCardDetails: !!orderData.cardDetails,
      hasPixDetails: !!orderData.pixDetails
    });
    
    const dbOrder = await apiCreateOrder(orderData);
    
    // Transformar a resposta do banco de dados para corresponder à estrutura do tipo Order
    const order = mapOrderFromSupabase(dbOrder, {
      cardDetails: orderData.cardDetails,
      pixDetails: orderData.pixDetails,
      customerAddress: orderData.customer?.address
    });
    
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
    
    // Transformar a resposta do banco de dados para corresponder à estrutura do tipo Order
    const updatedOrder = mapOrderFromSupabase(dbOrder);
    
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
