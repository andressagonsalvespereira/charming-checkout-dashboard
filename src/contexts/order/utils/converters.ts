
import { Order, PaymentMethod, PaymentStatus } from '@/types/order';

export const convertDBOrderToOrder = (dbOrder: any): Order => {
  return {
    id: dbOrder.id,
    customerName: dbOrder.customer_name,
    customerEmail: dbOrder.customer_email,
    customerCpf: dbOrder.customer_cpf,
    customerPhone: dbOrder.customer_phone,
    productId: dbOrder.product_id,
    productName: dbOrder.product_name,
    price: dbOrder.price,
    paymentMethod: dbOrder.payment_method as PaymentMethod,
    paymentStatus: dbOrder.payment_status as PaymentStatus,
    paymentId: dbOrder.payment_id,
    creditCardBrand: dbOrder.credit_card_brand,
    deviceType: dbOrder.device_type,
    isDigitalProduct: dbOrder.is_digital_product,
    asaasPaymentId: dbOrder.asaas_payment_id,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
    // If asaas_payments is included in the query, extract the PIX details
    pixDetails: dbOrder.asaas_payments ? {
      qrCode: dbOrder.asaas_payments.qr_code,
      qrCodeImage: dbOrder.asaas_payments.qr_code_image,
      paymentId: dbOrder.asaas_payments.payment_id
    } : undefined
  };
};

export const convertOrderToDBOrder = (order: Order): any => {
  return {
    id: order.id,
    customer_name: order.customerName,
    customer_email: order.customerEmail,
    customer_cpf: order.customerCpf,
    customer_phone: order.customerPhone,
    product_id: order.productId,
    product_name: order.productName,
    price: order.price,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    payment_id: order.paymentId,
    credit_card_brand: order.creditCardBrand,
    device_type: order.deviceType,
    is_digital_product: order.isDigitalProduct,
    asaas_payment_id: order.asaasPaymentId,
    created_at: order.createdAt,
    updated_at: order.updatedAt
  };
};
