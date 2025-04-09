
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getAllOrders, 
  createOrder, 
  updateOrderStatus, 
  deleteOrder, 
  deleteOrdersByPaymentMethod,
  type DBOrder,
  type OrderInsert,
  type OrderUpdate
} from '@/services/orderService';
import { Order, PaymentMethod, PaymentStatus, RawOrder } from '@/types/order';
import { logger } from '@/utils/logger';
import { mapOrderFromSupabase, mapOrdersFromSupabase } from '@/contexts/order/utils/orderMappers';

export const useOrdersManagement = () => {
  const { toast } = useToast();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingOrder, setPendingOrder] = useState(false);
  const [filterMethod, setFilterMethod] = useState<PaymentMethod | 'ALL'>('ALL');

  // Load orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  // Get orders from the database
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const loadedRawOrders = await getAllOrders();
      const mappedOrders = mapOrdersFromSupabase(loadedRawOrders);
      setOrders(mappedOrders);
      setError(null);
    } catch (err) {
      logger.error('Error loading orders:', err);
      setError('Failed to load orders');
      
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Create a new order
  const addOrder = async (orderData: any): Promise<Order> => {
    try {
      if (pendingOrder) {
        logger.warn("Duplicate order creation request detected");
        throw new Error("An order is already being processed");
      }
      
      setPendingOrder(true);
      
      const rawNewOrder = await createOrder(orderData);
      const newOrder = mapOrderFromSupabase(rawNewOrder);
      
      setOrders(prev => [newOrder, ...prev]);
      
      toast({
        title: "Success",
        description: "Order added successfully",
      });
      
      return newOrder;
    } catch (err) {
      logger.error('Error adding order:', err);
      
      toast({
        title: "Error",
        description: "Failed to add order",
        variant: "destructive",
      });
      
      throw err;
    } finally {
      // Reset pending state after a delay to prevent duplicate submissions
      setTimeout(() => {
        setPendingOrder(false);
      }, 1000);
    }
  };

  // Update an order's status
  const changeOrderStatus = async (
    id: string, 
    status: PaymentStatus
  ): Promise<Order> => {
    try {
      const rawUpdatedOrder = await updateOrderStatus(id, status);
      const updatedOrder = mapOrderFromSupabase(rawUpdatedOrder);
      
      setOrders(prev => 
        prev.map(order => 
          String(order.id) === String(id) ? updatedOrder : order
        )
      );
      
      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
      
      return updatedOrder;
    } catch (err) {
      logger.error('Error updating order status:', err);
      
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive",
      });
      
      throw err;
    }
  };

  // Delete an order
  const removeOrder = async (id: string): Promise<void> => {
    try {
      await deleteOrder(id);
      
      setOrders(prev => prev.filter(order => String(order.id) !== String(id)));
      
      toast({
        title: "Success",
        description: "Order removed successfully",
      });
    } catch (err) {
      logger.error('Error deleting order:', err);
      
      toast({
        title: "Error",
        description: "Failed to delete order",
        variant: "destructive",
      });
      
      throw err;
    }
  };

  // Delete all orders by payment method
  const removeAllOrdersByPaymentMethod = async (method: PaymentMethod): Promise<void> => {
    try {
      await deleteOrdersByPaymentMethod(method);
      
      setOrders(prev => prev.filter(order => order.paymentMethod !== method));
      
      toast({
        title: "Success",
        description: `All ${method === 'PIX' ? 'PIX' : 'Credit Card'} orders were removed`,
      });
    } catch (err) {
      logger.error('Error deleting orders by payment method:', err);
      
      toast({
        title: "Error",
        description: `Failed to delete ${method === 'PIX' ? 'PIX' : 'Credit Card'} orders`,
        variant: "destructive",
      });
      
      throw err;
    }
  };

  // Filter orders by payment method
  const filteredOrders = filterMethod === 'ALL' 
    ? orders 
    : orders.filter(order => order.paymentMethod === filterMethod);

  return {
    orders: filteredOrders,
    allOrders: orders,
    loading,
    error,
    filterMethod,
    setFilterMethod,
    refreshOrders: fetchOrders,
    addOrder,
    updateOrderStatus: changeOrderStatus,
    deleteOrder: removeOrder,
    deleteAllOrdersByPaymentMethod: removeAllOrdersByPaymentMethod
  };
};
