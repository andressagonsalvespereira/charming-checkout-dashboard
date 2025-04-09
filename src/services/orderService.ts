
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { logger } from '@/utils/logger';

export type Order = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

export type PaymentMethod = 'CREDIT_CARD' | 'PIX';
export type PaymentStatus = 'PENDING' | 'PAID' | 'DENIED' | 'ANALYSIS' | 'CANCELLED';

export interface CustomerInfo {
  name: string;
  email: string;
  cpf: string;
  phone?: string;
  address?: {
    street?: string;
    number?: string;
    complement?: string;
    neighborhood?: string;
    city?: string;
    state?: string;
    postalCode?: string;
  };
}

export interface CardDetails {
  number?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
  brand?: string;
}

export interface PixDetails {
  qrCode?: string;
  qrCodeImage?: string;
  expirationDate?: string;
}

export interface CreateOrderInput {
  customer: CustomerInfo;
  productId: number | string;
  productName: string;
  productPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  isDigitalProduct?: boolean;
  cardDetails?: CardDetails;
  pixDetails?: PixDetails;
}

// Get all orders
export const getAllOrders = async (): Promise<Order[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error loading orders:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData: CreateOrderInput): Promise<Order> => {
  try {
    const { customer, ...rest } = orderData;
    
    const newOrder: OrderInsert = {
      customer_name: customer.name,
      customer_email: customer.email,
      customer_cpf: customer.cpf,
      customer_phone: customer.phone,
      product_id: typeof rest.productId === 'string' ? parseInt(rest.productId) : rest.productId,
      product_name: rest.productName,
      price: rest.productPrice,
      payment_method: rest.paymentMethod,
      payment_status: rest.paymentStatus,
      payment_id: rest.paymentId,
      is_digital_product: rest.isDigitalProduct,
      credit_card_brand: rest.cardDetails?.brand || 'Desconhecida',
      device_type: 'desktop',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create order');
    
    return data;
  } catch (error) {
    logger.error('Error creating order:', error);
    throw error;
  }
};

// Update an order's status
export const updateOrderStatus = async (orderId: string | number, status: PaymentStatus): Promise<Order> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .update({ 
        payment_status: status,
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update order status');
    
    return data;
  } catch (error) {
    logger.error('Error updating order status:', error);
    throw error;
  }
};

// Delete an order
export const deleteOrder = async (orderId: string | number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('id', orderId);

    if (error) throw error;
  } catch (error) {
    logger.error('Error deleting order:', error);
    throw error;
  }
};

// Delete all orders with a specific payment method
export const deleteOrdersByPaymentMethod = async (method: PaymentMethod): Promise<void> => {
  try {
    const { error } = await supabase
      .from('orders')
      .delete()
      .eq('payment_method', method);

    if (error) throw error;
  } catch (error) {
    logger.error('Error deleting orders by payment method:', error);
    throw error;
  }
};
