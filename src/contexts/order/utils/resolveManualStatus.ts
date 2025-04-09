
import { PaymentStatus } from '@/types/order';
import { logger } from '@/utils/logger';

/**
 * Resolves the payment status from various input formats
 * to ensure consistent status values throughout the application
 * 
 * @param status Input status which may come in different formats
 * @returns Normalized PaymentStatus
 */
export const resolveManualStatus = (status: string | undefined): PaymentStatus => {
  if (!status) return 'PENDING';
  
  // Convert to uppercase for consistent comparison
  const upperStatus = status.toUpperCase();
  
  logger.log('Resolving manual status from:', upperStatus);
  
  // Map various status formats to our application's payment status enum
  switch (upperStatus) {
    case 'APPROVED':
    case 'CONFIRMED':
    case 'PAID':
    case 'RECEIVED':
    case 'COMPLETED':
      return 'CONFIRMED';
    
    case 'REJECTED':
    case 'DECLINED':
    case 'FAILED':
    case 'CANCELED':
    case 'CANCELLED':
      return 'REJECTED';
    
    case 'ANALYSIS':
    case 'REVIEW':
    case 'ANALYZING':
    case 'IN_ANALYSIS':
    case 'UNDER_ANALYSIS':
      return 'ANALYSIS';
    
    case 'PENDING':
    case 'AWAITING':
    case 'AWAITING_PAYMENT':
    case 'WAITING':
      return 'PENDING';
    
    default:
      logger.warn(`Unknown status format: "${upperStatus}", defaulting to PENDING`);
      return 'PENDING';
  }
};

/**
 * Checks if a payment status is considered rejected
 * 
 * @param status PaymentStatus to check
 * @returns boolean indicating if the status is rejected
 */
export const isRejectedStatus = (status: PaymentStatus): boolean => {
  return status === 'REJECTED';
};
