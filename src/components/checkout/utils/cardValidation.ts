
// Arquivo dedicado à validação de cartões de crédito

export interface CardValidationErrors {
  cardName?: string;
  cardNumber?: string;
  expiryMonth?: string;
  expiryYear?: string;
  cvv?: string;
}

/**
 * Valida os dados do cartão de crédito
 */
export const validateCardForm = (
  cardName: string,
  cardNumber: string,
  expiryMonth: string,
  expiryYear: string,
  cvv: string
): CardValidationErrors | null => {
  const errors: CardValidationErrors = {};
  
  if (!cardName.trim()) {
    errors.cardName = 'Nome no cartão é obrigatório';
  }
  
  if (cardNumber.replace(/\s+/g, '').length < 16) {
    errors.cardNumber = 'Número do cartão inválido';
  }
  
  if (!expiryMonth) {
    errors.expiryMonth = 'Mês de validade é obrigatório';
  }
  
  if (!expiryYear) {
    errors.expiryYear = 'Ano de validade é obrigatório';
  }
  
  if (cvv.length < 3) {
    errors.cvv = 'CVV inválido';
  }
  
  return Object.keys(errors).length > 0 ? errors : null;
};

/**
 * Formata o número do cartão com espaços a cada 4 dígitos
 */
export const formatCardNumber = (value: string): string => {
  const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
  const matches = v.match(/\d{4,16}/g);
  const match = (matches && matches[0]) || '';
  const parts = [];

  for (let i = 0, len = match.length; i < len; i += 4) {
    parts.push(match.substring(i, i + 4));
  }

  if (parts.length) {
    return parts.join(' ');
  } else {
    return value;
  }
};

/**
 * Mascara o número do cartão para exibição segura
 */
export const maskCardNumber = (cardNumber: string): string => {
  return cardNumber.replace(/\d(?=\d{4})/g, '*');
};
