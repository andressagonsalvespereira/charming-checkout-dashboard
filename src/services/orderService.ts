
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { logger } from '@/utils/logger';
import { RawOrder, Order, PaymentMethod, PaymentStatus, CustomerInfo, CardDetails, PixDetails } from '@/types/order';

export type DBOrder = Database['public']['Tables']['orders']['Row'];
export type OrderInsert = Database['public']['Tables']['orders']['Insert'];
export type OrderUpdate = Database['public']['Tables']['orders']['Update'];

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
  deviceType?: string;
}

// Get all orders
export const getAllOrders = async (): Promise<RawOrder[]> => {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as RawOrder[] || [];
  } catch (error) {
    logger.error('Error loading orders:', error);
    throw error;
  }
};

// Create a new order
export const createOrder = async (orderData: CreateOrderInput): Promise<RawOrder> => {
  try {
    const { customer, cardDetails, pixDetails, ...rest } = orderData;
    
    logger.log("Creating order in database:", {
      customer_email: customer.email,
      payment_method: rest.paymentMethod,
      has_card_details: !!cardDetails,
      has_pix_details: !!pixDetails
    });
    
    // Store card details as a JSON string in metadata column or dedicated columns
    // This example assumes your database has these columns or you add them
    const cardDetailsJSON = cardDetails ? JSON.stringify(cardDetails) : null;
    const pixDetailsJSON = pixDetails ? JSON.stringify(pixDetails) : null;
    
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
      credit_card_brand: cardDetails?.brand || null,
      device_type: rest.deviceType || 'desktop',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      // Add metadata fields if your database has them
      // card_details_json: cardDetailsJSON,
      // pix_details_json: pixDetailsJSON,
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create order');
    
    // Add the details back to the returned object for the client
    const returnData = {
      ...data,
      card_details: cardDetails,
      pix_details: pixDetails,
    } as RawOrder;
    
    return returnData;
  } catch (error) {
    logger.error('Error creating order:', error);
    throw error;
  }
};

// Update an order's status
export const updateOrderStatus = async (orderId: string | number, status: PaymentStatus): Promise<RawOrder> => {
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
    
    return data as RawOrder;
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
