
import { Order, PaymentStatus, PaymentMethod, DeviceType, CardDetails, PixDetails } from '@/types/order';
import { ProductDetailsType } from '@/components/checkout/ProductDetails';
import { CustomerData } from '@/components/checkout/payment/shared/types';
import { detectDeviceType } from '../utils/deviceDetection';
import { logger } from '@/utils/logger';

interface CreateOrderServiceProps {
  customerData: CustomerData;
  productDetails: ProductDetailsType;
  status: 'pending' | 'confirmed';
  paymentId: string;
  cardDetails?: CardDetails;
  pixDetails?: PixDetails;
  toast: (config: { title: string; description: string; variant?: "default" | "destructive"; duration?: number }) => void;
  addOrder: (orderData: any) => Promise<Order>;
}

/**
 * Service to handle order creation
 */
export const createOrderService = async ({
  customerData,
  productDetails,
  status,
  paymentId,
  cardDetails,
  pixDetails,
  toast,
  addOrder
}: CreateOrderServiceProps): Promise<Order> => {
  // Ensure card details are properly structured and passed to the order creation
  if (cardDetails) {
    logger.log("Creating order with card details:", {
      brand: cardDetails.brand || 'Unknown',
      last4: cardDetails.number ? cardDetails.number.slice(-4) : 'Unknown'
    });
    
    // Make sure default brand is set if not provided
    if (!cardDetails.brand) {
      cardDetails.brand = 'Unknown';
    }
  }
  
  if (pixDetails) {
    logger.log("Creating order with PIX details:", {
      hasQrCode: !!pixDetails.qrCode,
      hasQrCodeImage: !!pixDetails.qrCodeImage
    });
  }
  
  // Detect device type in a type-safe way
  const deviceType: DeviceType = detectDeviceType();
  
  const orderData = {
    customer: customerData,
    productId: productDetails.id,
    productName: productDetails.name,
    productPrice: productDetails.price,
    paymentMethod: cardDetails ? 'CREDIT_CARD' as PaymentMethod : 'PIX' as PaymentMethod,
    paymentStatus: status === 'pending' ? 'PENDING' as PaymentStatus : 'PAID' as PaymentStatus,
    paymentId: paymentId,
    cardDetails,
    pixDetails,
    deviceType,
    isDigitalProduct: productDetails.isDigital
  };
  
  try {
    logger.log("Creating order with data:", {
      productId: orderData.productId,
      productName: orderData.productName,
      paymentMethod: orderData.paymentMethod,
      paymentStatus: orderData.paymentStatus,
      hasCardDetails: !!cardDetails,
      hasPixDetails: !!pixDetails
    });
    
    const newOrder = await addOrder(orderData);
    
    logger.log("Order created successfully:", {
      orderId: newOrder.id,
      paymentStatus: newOrder.paymentStatus
    });
    
    toast({
      title: "Order created",
      description: "Your order has been registered successfully!",
      variant: "default",
    });
    
    return newOrder;
  } catch (error) {
    logger.error('Error creating order:', error);
    
    toast({
      title: "Order error",
      description: "It wasn't possible to complete the order. Please try again.",
      variant: "destructive",
    });
    throw error;
  }
};
