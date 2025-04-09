
import { PaymentStatus } from '@/types/order';

export const resolveManualStatus = (
  useCustomProcessing: boolean | undefined,
  manualStatus: string | null | undefined
): PaymentStatus => {
  if (!useCustomProcessing) {
    return 'PENDING';
  }

  // Default to pending if no manual status is provided or if it's not a valid status
  if (!manualStatus) {
    return 'PENDING';
  }
  
  // Normalize status names
  const normalizedStatus = manualStatus.toUpperCase();
  
  switch (normalizedStatus) {
    case 'APROVADO':
    case 'APPROVED':
    case 'PAID':
      return 'APPROVED';
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
