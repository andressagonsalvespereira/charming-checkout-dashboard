
import { Order } from '@/types/order';
import { getAllOrders } from '@/services/orderService';
import { mapOrdersFromSupabase } from './orderMappers';
import { logger } from '@/utils/logger';

export const loadOrders = async (): Promise<Order[]> => {
  try {
    const rawOrders = await getAllOrders();
    return mapOrdersFromSupabase(rawOrders);
  } catch (error) {
    logger.error('Error loading orders:', error);
    return [];
  }
};
