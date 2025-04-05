
/**
 * Normaliza status de pagamento manual para valores padrão suportados pelo sistema
 * @param status Status original do pagamento (pode ser qualquer string)
 * @returns Status normalizado: "PENDING", "CONFIRMED" ou "REJECTED"
 */
export const resolveManualStatus = (status: string | undefined | null): "PENDING" | "CONFIRMED" | "REJECTED" => {
  if (!status) return "PENDING";
  
  // Normaliza para maiúsculas para comparação consistente
  const normalizedStatus = status.toUpperCase();
  
  // Status que indicam confirmação/aprovação
  if ([
    'CONFIRMED', 
    'APPROVED', 
    'PAID', 
    'APROVADO', 
    'PAGO', 
    'COMPLETED',
    'SUCCESS'
  ].includes(normalizedStatus)) {
    return "CONFIRMED";
  }
  
  // Status que indicam rejeição/recusa
  if ([
    'REJECTED', 
    'DENIED', 
    'FAILED', 
    'RECUSADO', 
    'NEGADO', 
    'CANCELADO',
    'DECLINED'
  ].includes(normalizedStatus)) {
    return "REJECTED";
  }
  
  // Qualquer outro status é considerado pendente/em análise
  return "PENDING";
};

/**
 * Verifica se um status é considerado rejeitado/recusado
 * @param status Status a ser verificado
 * @returns true se o status for rejeitado
 */
export const isRejectedStatus = (status: string | undefined | null): boolean => {
  if (!status) return false;
  
  // First normalize the status using our utility
  const normalizedStatus = resolveManualStatus(status);
  
  // Then check if it's rejected
  return normalizedStatus === "REJECTED";
};

/**
 * Verifica se um status é considerado confirmado/aprovado
 * @param status Status a ser verificado
 * @returns true se o status for confirmado
 */
export const isConfirmedStatus = (status: string | undefined | null): boolean => {
  return resolveManualStatus(status) === "CONFIRMED";
};

/**
 * Verifica se um status é considerado pendente/em análise
 * @param status Status a ser verificado
 * @returns true se o status for pendente
 */
export const isPendingStatus = (status: string | undefined | null): boolean => {
  return resolveManualStatus(status) === "PENDING";
};
