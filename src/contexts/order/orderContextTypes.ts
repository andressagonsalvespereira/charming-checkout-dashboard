
import { ReactNode } from 'react';
import { Order, PaymentMethod, PaymentStatus } from '@/types/order';

export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (orderData: any) => Promise<Order>;
  getOrdersByPaymentMethod: (method: PaymentMethod) => Order[];
  getOrdersByStatus: (status: PaymentStatus) => Order[];
  getOrdersByDevice: (deviceType: string) => Order[];
  getLatestOrders: (count?: number) => Order[];
  updateOrderStatus: (id: string, status: PaymentStatus) => Promise<Order>;
  refreshOrders: () => Promise<void>;
  deleteOrder: (id: string) => Promise<void>;
  deleteAllOrdersByPaymentMethod: (method: PaymentMethod) => Promise<void>;
}

export interface OrderProviderProps {
  children: ReactNode;
}
