
import { ManualCardStatus } from '@/types/asaas';
import { logger } from '@/utils/logger';

/**
 * Validate that a status string is a valid ManualCardStatus
 * @param status String to validate
 * @returns Valid ManualCardStatus or 'ANALYSIS' as fallback
 */
export const validateCardStatus = (status: string | null): ManualCardStatus => {
  const validStatuses: ManualCardStatus[] = [
    'APPROVED', 'PENDING', 'CONFIRMED', 'DECLINED', 
    'REJECTED', 'ANALYSIS', 'DENIED', 'CANCELLED',
    'FAILED', 'RECEIVED'
  ];
  
  logger.log('Validating card status:', status);
  
  if (!status) {
    logger.log('Status is null or undefined, using ANALYSIS as default');
    return 'ANALYSIS';
  }
  
  const upperStatus = status.toUpperCase() as ManualCardStatus;
  const isValid = validStatuses.includes(upperStatus);
  logger.log(`Status ${status} is ${isValid ? 'valid' : 'invalid'}`);
  
  return isValid ? upperStatus : 'ANALYSIS';
};
