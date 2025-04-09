
import { Order, PaymentStatus } from '@/types/order';
import { 
  createOrder as createOrderUtil, 
  updateOrderStatusData, 
  deleteOrderData, 
  deleteAllOrdersByPaymentMethodData 
} from '../utils/orderOperations';
import { useToast } from '@/hooks/use-toast';
import { Dispatch, SetStateAction } from 'react';
import { logger } from '@/utils/logger';

export const useOrderOperations = (
  orders: Order[], 
  setOrders: Dispatch<SetStateAction<Order[]>>
) => {
  const { toast } = useToast();

  const addOrder = async (orderData: any) => {
    try {
      logger.log("Adding order with data:", {
        paymentMethod: orderData.paymentMethod,
        hasCardDetails: !!orderData.cardDetails,
        hasPixDetails: !!orderData.pixDetails
      });
      
      // Ensure all required data is included
      const newOrder = await createOrderUtil(orderData);
      
      logger.log("Order created successfully:", {
        orderId: newOrder.id,
        paymentStatus: newOrder.paymentStatus,
        hasCardDetails: !!newOrder.cardDetails,
        hasPixDetails: !!newOrder.pixDetails
      });
      
      setOrders(prev => [newOrder, ...prev]);
      
      toast({
        title: "Pedido criado",
        description: "O pedido foi criado com sucesso.",
      });
      
      return newOrder;
    } catch (error) {
      logger.error('Error adding order:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível criar o pedido.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: PaymentStatus) => {
    try {
      const { updatedOrder, updatedOrders } = await updateOrderStatusData(orders, id, status);
      
      setOrders(updatedOrders);
      
      toast({
        title: "Status atualizado",
        description: "O status do pedido foi atualizado com sucesso.",
      });
      
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order status:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o status do pedido.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await deleteOrderData(id);
      
      setOrders(prev => prev.filter(order => String(order.id) !== id));
      
      toast({
        title: "Pedido removido",
        description: "O pedido foi removido com sucesso.",
      });
    } catch (error) {
      console.error('Error deleting order:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível remover o pedido.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  const deleteAllOrdersByPaymentMethod = async (method: 'CREDIT_CARD' | 'PIX') => {
    try {
      await deleteAllOrdersByPaymentMethodData(method);
      
      setOrders(prev => prev.filter(order => order.paymentMethod !== method));
      
      toast({
        title: "Pedidos removidos",
        description: `Todos os pedidos via ${method === 'PIX' ? 'PIX' : 'Cartão'} foram removidos com sucesso.`,
      });
    } catch (error) {
      console.error('Error deleting orders by payment method:', error);
      
      toast({
        title: "Erro",
        description: "Não foi possível remover os pedidos.",
        variant: "destructive",
      });
      
      throw error;
    }
  };

  return {
    addOrder,
    updateOrderStatus,
    deleteOrder,
    deleteAllOrdersByPaymentMethod
  };
};
