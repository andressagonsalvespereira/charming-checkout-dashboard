
import React from 'react';
import { CreditCard, QrCode } from 'lucide-react';
import { RadioGroup } from '@/components/ui/radio-group';
import RadioOption from './RadioOption';
import { AsaasSettings } from '@/types/asaas';

interface PaymentOptionsProps {
  paymentMethod: 'card' | 'pix';
  setPaymentMethod: React.Dispatch<React.SetStateAction<'card' | 'pix'>>;
  settings: AsaasSettings;
}

const PaymentOptions: React.FC<PaymentOptionsProps> = ({ 
  paymentMethod, 
  setPaymentMethod, 
  settings 
}) => {
  // Check if we need to show the radio group (both payment methods available)
  const showRadioGroup = settings.allowPix && settings.allowCreditCard;

  if (!showRadioGroup) {
    return null;
  }

  return (
    <RadioGroup
      defaultValue={paymentMethod}
      className="flex flex-row space-x-3 mb-4"
      onValueChange={(value) => setPaymentMethod(value as 'card' | 'pix')}
    >
      {settings.allowCreditCard && (
        <RadioOption
          id="card"
          value="card"
          Icon={CreditCard}
          label="Cartão de Crédito"
          description="Pague com seu cartão de crédito"
          onClick={() => setPaymentMethod('card')}
          selected={paymentMethod === 'card'}
          iconColor="text-blue-600"
        />
      )}
      
      {settings.allowPix && (
        <RadioOption
          id="pix"
          value="pix"
          Icon={QrCode}
          label="PIX"
          description="Pague usando seu aplicativo bancário"
          onClick={() => setPaymentMethod('pix')}
          selected={paymentMethod === 'pix'}
          iconColor="text-green-600"
        />
      )}
    </RadioGroup>
  );
};

export default PaymentOptions;
