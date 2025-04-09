
import { PaymentStatus } from '@/types/order';
import { getPaymentSettings } from '@/services/paymentSettingsService';

// Define the possible manual card status values
export type ManualCardStatus = 'APPROVED' | 'PENDING' | 'CONFIRMED' | 'DECLINED' | 'REJECTED' | 'ANALYSIS';

/**
 * Get the manual card status from settings
 */
export const resolveManualCardStatus = async (): Promise<PaymentStatus> => {
  try {
    const settings = await getPaymentSettings();
    return normalizeStatus(settings.manualCardStatus);
  } catch (error) {
    console.error('Error getting manual card status:', error);
    return 'ANALYSIS';
  }
};

/**
 * Normalize a manual status string to a valid PaymentStatus
 * This is a synchronous version of resolveManualCardStatus for use in components
 */
export const resolveManualStatus = (status: string | ManualCardStatus | null | undefined): PaymentStatus => {
  return normalizeStatus(status);
};

/**
 * Helper function to normalize status values
 */
const normalizeStatus = (status: string | ManualCardStatus | null | undefined): PaymentStatus => {
  if (!status) return 'ANALYSIS';
  
  // Map between API/manual status values and our internal PaymentStatus
  switch (status.toUpperCase()) {
    case 'APPROVED':
    case 'CONFIRMED':
    case 'PAID':
      return 'PAID';
    case 'PENDING':
      return 'PENDING';
    case 'DECLINED':
    case 'REJECTED':
    case 'DENIED':
      return 'DENIED';
    case 'CANCELLED':
      return 'CANCELLED';
    case 'ANALYSIS':
    default:
      return 'ANALYSIS';
  }
};

/**
 * Check if a status is a rejected/declined status
 */
export const isRejectedStatus = (status: string | ManualCardStatus | null | undefined): boolean => {
  if (!status) return false;
  
  const upperStatus = status.toUpperCase();
  return upperStatus === 'REJECTED' || 
         upperStatus === 'DECLINED' || 
         upperStatus === 'DENIED';
};
