
import { Order, PaymentMethod, PaymentStatus } from '@/types/order';
import type { Order as DbOrder } from '@/services/orderService';

export const mapDatabaseOrderToOrder = (dbOrder: DbOrder): Order => {
  return {
    id: dbOrder.id,
    customerName: dbOrder.customer_name,
    customerEmail: dbOrder.customer_email,
    customerCpf: dbOrder.customer_cpf,
    customerPhone: dbOrder.customer_phone || undefined,
    productId: dbOrder.product_id || undefined,
    productName: dbOrder.product_name,
    price: dbOrder.price,
    paymentMethod: (dbOrder.payment_method as PaymentMethod) || 'CREDIT_CARD',
    paymentStatus: (dbOrder.payment_status as PaymentStatus) || 'PENDING',
    paymentId: dbOrder.payment_id || undefined,
    creditCardBrand: dbOrder.credit_card_brand || undefined,
    deviceType: dbOrder.device_type as any || undefined,
    isDigitalProduct: dbOrder.is_digital_product || false,
    asaasPaymentId: dbOrder.asaas_payment_id || undefined,
    createdAt: dbOrder.created_at || new Date().toISOString(),
    updatedAt: dbOrder.updated_at || new Date().toISOString(),
    
    // Legacy compatibility
    customer: {
      name: dbOrder.customer_name,
      email: dbOrder.customer_email,
      cpf: dbOrder.customer_cpf,
      phone: dbOrder.customer_phone || undefined
    }
  };
};
