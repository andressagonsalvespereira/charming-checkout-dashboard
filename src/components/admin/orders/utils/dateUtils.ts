
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

/**
 * Format a date string to full format with day of week
 * @param dateString Date string to format
 * @returns Formatted date string
 */
export const formatFullDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return format(date, "EEEE, dd 'de' MMMM 'de' yyyy 'às' HH:mm", { 
      locale: ptBR 
    });
  } catch (error) {
    console.error('Error formatting full date:', error);
    return 'Data não disponível';
  }
};
