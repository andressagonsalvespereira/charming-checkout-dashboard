
import { Order, PaymentMethod, PaymentStatus, CustomerInfo, RawOrder } from '@/types/order';
import { mapOrderFromSupabase, mapOrderToSupabase } from './orderMappers';

export const convertDBOrderToOrder = (dbOrder: any): Order => {
  return mapOrderFromSupabase({
    ...dbOrder,
    pix_details: dbOrder.asaas_payments ? {
      qrCode: dbOrder.asaas_payments.qr_code,
      qrCodeImage: dbOrder.asaas_payments.qr_code_image,
      paymentId: dbOrder.asaas_payments.payment_id
    } : undefined
  });
};

export const convertOrderToDBOrder = (order: Order): any => {
  return mapOrderToSupabase(order);
};

export const convertCustomerInfoToCustomer = (customerInfo: CustomerInfo): Order['customer'] => {
  return {
    name: customerInfo.name,
    email: customerInfo.email,
    cpf: customerInfo.cpf,
    phone: customerInfo.phone,
    address: customerInfo.address
  };
};
