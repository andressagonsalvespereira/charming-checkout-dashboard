
import { supabase } from '@/integrations/supabase/client';
import { format, subDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  cardOrders: number;
  pixOrders: number;
  pixCompleted: number;
  recentOrders: any[];
  paymentMethodsDistribution: {
    name: string;
    value: number;
  }[];
  visitorsData: {
    name: string;
    visitors: number;
  }[];
}

// Fetch dashboard statistics from the database
export const fetchDashboardStats = async (): Promise<DashboardStats> => {
  try {
    // Get total orders count
    const { count: totalOrders, error: ordersError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true });
    
    if (ordersError) throw ordersError;
    
    // Get total revenue
    const { data: revenueData, error: revenueError } = await supabase
      .from('orders')
      .select('price')
      .eq('payment_status', 'Pago');
    
    if (revenueError) throw revenueError;
    
    const totalRevenue = revenueData.reduce((sum, order) => sum + Number(order.price), 0);
    
    // Get card orders count
    const { count: cardOrders, error: cardError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('payment_method', 'CREDIT_CARD');
    
    if (cardError) throw cardError;
    
    // Get PIX orders count
    const { count: pixOrders, error: pixError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('payment_method', 'PIX');
    
    if (pixError) throw pixError;
    
    // Get completed PIX orders count
    const { count: pixCompleted, error: pixCompletedError } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .eq('payment_method', 'PIX')
      .eq('payment_status', 'Pago');
    
    if (pixCompletedError) throw pixCompletedError;
    
    // Get recent orders
    const { data: recentOrders, error: recentOrdersError } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);
    
    if (recentOrdersError) throw recentOrdersError;
    
    // Calculate payment methods distribution
    const totalOrderCount = (cardOrders || 0) + (pixOrders || 0);
    
    // Resolve the infinite type recursion by simplifying the calculation
    let paymentMethodsDistribution = [
      { name: 'Cartão de Crédito', value: 0 },
      { name: 'PIX', value: 0 }
    ];
    
    // Only calculate percentages if there are any orders
    if (totalOrderCount > 0) {
      paymentMethodsDistribution = [
        { name: 'Cartão de Crédito', value: Math.round((cardOrders || 0) / totalOrderCount * 100) },
        { name: 'PIX', value: Math.round((pixOrders || 0) / totalOrderCount * 100) }
      ];
    }
    
    // Generate visitor data for the last 7 days (still using random data as we don't track visitors)
    const visitorsData = generateVisitorData(7);
    
    return {
      totalOrders: totalOrders || 0,
      totalRevenue,
      cardOrders: cardOrders || 0,
      pixOrders: pixOrders || 0,
      pixCompleted: pixCompleted || 0,
      recentOrders: recentOrders || [],
      paymentMethodsDistribution,
      visitorsData
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

// Format currency for display
export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

// Generate dates for the last n days
export const generateDateLabels = (days: number): string[] => {
  return Array.from({ length: days }).map((_, i) => {
    return format(subDays(new Date(), days - 1 - i), 'dd/MM');
  });
};

// Generate visitor data for the last n days (using random data since we don't track visitors)
export const generateVisitorData = (days: number) => {
  const dates = generateDateLabels(days);
  const visitors = Array.from({ length: days }).map(() => Math.floor(Math.random() * 100) + 20);
  
  return dates.map((date, index) => ({
    name: date,
    visitors: visitors[index],
  }));
};

// Format date using date-fns
export const formatDate = (dateString: string) => {
  return format(new Date(dateString), "dd/MM/yyyy HH:mm", { locale: ptBR });
};
