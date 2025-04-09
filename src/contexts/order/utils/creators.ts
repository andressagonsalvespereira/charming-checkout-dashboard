
import { Order, CardDetails, PixDetails, PaymentStatus, PaymentMethod } from '@/types/order';
import { supabase } from '@/lib/supabase';
import { convertDBOrderToOrder } from './converters';

export interface CreateOrderInput {
  customer: {
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
  };
  productId: number | string;
  productName: string;
  productPrice: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  paymentId?: string;
  cardDetails?: CardDetails;
  pixDetails?: PixDetails;
  orderDate?: string;
  deviceType?: string;
  isDigitalProduct?: boolean;
}

// Create a new order
export const createOrderData = async (orderData: CreateOrderInput): Promise<Order> => {
  try {
    const { customer, ...rest } = orderData;
    
    const newOrder = {
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
      credit_card_brand: rest.cardDetails?.brand || 'Desconhecida',
      device_type: rest.deviceType || 'desktop',
      is_digital_product: rest.isDigitalProduct || false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('orders')
      .insert(newOrder)
      .select()
      .single();

    if (error) throw error;
    
    // Create Asaas payment record if PixDetails are provided
    if (rest.pixDetails) {
      await createAsaasPaymentRecord(data.id, rest.pixDetails, rest.productPrice);
    }
    
    return convertDBOrderToOrder(data);
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Create Asaas payment record
const createAsaasPaymentRecord = async (orderId: number, pixDetails: PixDetails, amount: number) => {
  try {
    const payment = {
      order_id: orderId,
      payment_id: pixDetails.paymentId || '',
      method: 'PIX',
      status: 'PENDING',
      qr_code: pixDetails.qrCode || '',
      qr_code_image: pixDetails.qrCodeImage || '',
      amount: amount,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    const { error } = await supabase
      .from('asaas_payments')
      .insert(payment);
      
    if (error) throw error;
  } catch (error) {
    console.error('Error creating Asaas payment record:', error);
    // We don't throw here to avoid failing the entire order creation
    // Just log the error and continue
  }
};
