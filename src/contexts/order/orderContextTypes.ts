
import React from 'react';
import { Order, PaymentMethod, PaymentStatus, CreateOrderInput } from '@/types/order';

export interface OrderContextType {
  orders: Order[];
  loading: boolean;
  error: string | null;
  addOrder: (orderData: CreateOrderInput) => Promise<Order>;
  getOrdersByPaymentMethod: (method: PaymentMethod) => Order[];
  getOrdersByStatus: (status: PaymentStatus) => Order[];
  getOrdersByDevice: (deviceType: Order['deviceType']) => Order[];
  getLatestOrders: (count?: number) => Order[];
  updateOrderStatus: (id: string, status: PaymentStatus) => Promise<Order>;
  refreshOrders: () => void;
  deleteOrder: (id: string) => Promise<void>;
  deleteAllOrdersByPaymentMethod: (method: PaymentMethod) => Promise<void>;
}

export interface OrderProviderProps {
  children: React.ReactNode;
}
