
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Format a date string to localized format
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatDate = (dateString: string | undefined): string => {
  if (!dateString) return 'Data não disponível';
  
  try {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm', { locale: ptBR });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Data inválida';
  }
};

/**
 * Format a number as Brazilian currency
 * @param value Number to format
 * @returns Formatted currency string
 */
export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined) return 'R$ 0,00';
  
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};
