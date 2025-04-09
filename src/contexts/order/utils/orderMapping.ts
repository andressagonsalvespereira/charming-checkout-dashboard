
import { Order, PaymentMethod, PaymentStatus, RawOrder } from '@/types/order';
import { mapOrderFromSupabase } from './orderMappers';

export const mapDatabaseOrderToOrder = (dbOrder: RawOrder): Order => {
  return mapOrderFromSupabase(dbOrder);
};
