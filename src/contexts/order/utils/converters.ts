
import { Order, PaymentMethod, PaymentStatus, CustomerInfo } from '@/types/order';

export const convertDBOrderToOrder = (dbOrder: any): Order => {
  const order: Order = {
    id: dbOrder.id,
    customerName: dbOrder.customer_name,
    customerEmail: dbOrder.customer_email,
    customerCpf: dbOrder.customer_cpf,
    customerPhone: dbOrder.customer_phone,
    productId: dbOrder.product_id,
    productName: dbOrder.product_name,
    price: dbOrder.price,
    productPrice: dbOrder.price, // For legacy component compatibility
    paymentMethod: dbOrder.payment_method as PaymentMethod,
    paymentStatus: dbOrder.payment_status as PaymentStatus,
    paymentId: dbOrder.payment_id,
    creditCardBrand: dbOrder.credit_card_brand,
    deviceType: dbOrder.device_type,
    isDigitalProduct: dbOrder.is_digital_product,
    asaasPaymentId: dbOrder.asaas_payment_id,
    createdAt: dbOrder.created_at,
    updatedAt: dbOrder.updated_at,
    orderDate: dbOrder.created_at, // For legacy component compatibility
    
    // Add customer object for legacy components
    customer: {
      name: dbOrder.customer_name,
      email: dbOrder.customer_email,
      cpf: dbOrder.customer_cpf,
      phone: dbOrder.customer_phone
    },
    
    // If asaas_payments is included in the query, extract the PIX details
    pixDetails: dbOrder.asaas_payments ? {
      qrCode: dbOrder.asaas_payments.qr_code,
      qrCodeImage: dbOrder.asaas_payments.qr_code_image,
      paymentId: dbOrder.asaas_payments.payment_id
    } : undefined
  };
  
  return order;
};

export const convertOrderToDBOrder = (order: Order): any => {
  return {
    id: order.id,
    customer_name: order.customerName || order.customer?.name,
    customer_email: order.customerEmail || order.customer?.email,
    customer_cpf: order.customerCpf || order.customer?.cpf,
    customer_phone: order.customerPhone || order.customer?.phone,
    product_id: order.productId,
    product_name: order.productName,
    price: order.price || order.productPrice,
    payment_method: order.paymentMethod,
    payment_status: order.paymentStatus,
    payment_id: order.paymentId,
    credit_card_brand: order.creditCardBrand,
    device_type: order.deviceType,
    is_digital_product: order.isDigitalProduct,
    asaas_payment_id: order.asaasPaymentId,
    created_at: order.createdAt || order.orderDate,
    updated_at: order.updatedAt
  };
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
