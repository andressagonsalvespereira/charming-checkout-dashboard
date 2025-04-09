
import { ManualCardStatus } from '@/types/asaas';
import { logger } from '@/utils/logger';

/**
 * Validate card status
 * @param status Card status to validate
 * @returns Valid card status
 */
export const validateCardStatus = (status?: string): ManualCardStatus => {
  logger.log('Validating card status:', status);
  
  // List of valid card statuses
  const validStatuses: ManualCardStatus[] = [
    'APPROVED', 'PENDING', 'CONFIRMED', 'REJECTED', 
    'ANALYSIS', 'RECEIVED', 'CANCELLED', 'FAILED', 
    'DECLINED', 'DENIED'
  ];
  
  // Default status if not provided or invalid
  const defaultStatus: ManualCardStatus = 'ANALYSIS';
  
  // Check if status is valid
  if (status && validStatuses.includes(status as ManualCardStatus)) {
    logger.log(`Status ${status} is valid`);
    return status as ManualCardStatus;
  }
  
  logger.log(`Status ${status} is invalid, using default status ${defaultStatus}`);
  return defaultStatus;
};

/**
 * Validate boolean value with strict conversion
 * This is essential for proper toggling functionality
 */
export const validateBoolean = (value: any): boolean => {
  logger.log('Validating boolean value:', value, 'type:', typeof value);
  
  if (typeof value === 'boolean') {
    return value;
  }
  
  if (value === 'true' || value === true) {
    return true;
  }
  
  if (value === 'false' || value === false) {
    return false;
  }
  
  if (value === 1 || value === '1') {
    return true;
  }
  
  if (value === 0 || value === '0' || value === null || value === undefined) {
    return false;
  }
  
  return Boolean(value);
};
