
import { PaymentStatus } from '@/types/order';

export const resolveManualStatus = (
  input: boolean | string | undefined, 
  manualStatus?: string | null
): PaymentStatus => {
  // Normalize input to handle different scenarios
  const useCustomProcessing = typeof input === 'boolean' ? input : !!input;

  if (!useCustomProcessing) {
    return 'PENDING';
  }

  // Default to pending if no manual status is provided or if it's not a valid status
  if (!manualStatus) {
    return 'PENDING';
  }
  
  // Normalize status names
  const normalizedStatus = String(manualStatus).toUpperCase();
  
  switch (normalizedStatus) {
    case 'APROVADO':
    case 'APPROVED':
    case 'PAID':
      return 'PAID';
    case 'NEGADO':
    case 'DENIED':
    case 'REJECTED':
      return 'DENIED';
    case 'ANALISE':
    case 'ANALYSIS':
    case 'REVIEW':
      return 'ANALYSIS';
    case 'CANCELADO':
    case 'CANCELLED':
    case 'CANCELED':
      return 'CANCELLED';
    case 'PENDENTE':
    case 'PENDING':
    default:
      return 'PENDING';
  }
};

export const isRejectedStatus = (status: string | undefined | null): boolean => {
  if (!status) return false;
  
  const normalizedStatus = String(status).toUpperCase();
  const rejectedStatuses = [
    'NEGADO', 
    'DENIED', 
    'REJECTED', 
    'CANCEL', 
    'CANCELADO', 
    'FAILED'
  ];
  
  return rejectedStatuses.includes(normalizedStatus);
};
