
import { Order, PaymentStatus } from '@/types/order';
import { 
  createOrder as createOrderService, 
  updateOrderStatus as updateOrderStatusService,
  deleteOrder as deleteOrderService,
  deleteOrdersByPaymentMethod as deleteOrdersByPaymentMethodService,
  type CreateOrderInput
} from '@/services/orderService';
import { mapDatabaseOrderToOrder } from './orderMapping';
import { logger } from '@/utils/logger';

export const createOrder = async (orderData: CreateOrderInput): Promise<Order> => {
  try {
    const dbOrder = await createOrderService(orderData);
    return mapDatabaseOrderToOrder(dbOrder);
  } catch (error) {
    logger.error('Error creating order:', error);
    throw error;
  }
};

export const updateOrderStatusData = async (
  orders: Order[],
  id: string,
  status: PaymentStatus
): Promise<{ updatedOrder: Order; updatedOrders: Order[] }> => {
  try {
    const dbOrder = await updateOrderStatusService(id, status);
    const updatedOrder = mapDatabaseOrderToOrder(dbOrder);
    
    const updatedOrders = orders.map(order => 
      String(order.id) === String(id) ? updatedOrder : order
    );
    
    return { updatedOrder, updatedOrders };
  } catch (error) {
    logger.error('Error updating order status:', error);
    throw error;
  }
};

export const deleteOrderData = async (id: string): Promise<void> => {
  try {
    await deleteOrderService(id);
  } catch (error) {
    logger.error('Error deleting order:', error);
    throw error;
  }
};

export const deleteAllOrdersByPaymentMethodData = async (method: 'CREDIT_CARD' | 'PIX'): Promise<void> => {
  try {
    await deleteOrdersByPaymentMethodService(method);
  } catch (error) {
    logger.error('Error deleting orders by payment method:', error);
    throw error;
  }
};
