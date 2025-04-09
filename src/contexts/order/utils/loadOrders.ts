
import { Order } from '@/types/order';
import { getAllOrders } from '@/services/orderService';
import { mapDatabaseOrderToOrder } from './orderMapping';
import { logger } from '@/utils/logger';

export const loadOrders = async (): Promise<Order[]> => {
  try {
    const dbOrders = await getAllOrders();
    return dbOrders.map(mapDatabaseOrderToOrder);
  } catch (error) {
    logger.error('Error loading orders:', error);
    return [];
  }
};
