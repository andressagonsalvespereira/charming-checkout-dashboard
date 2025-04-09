import React from 'react';
import RadioOption from './RadioOption';
import { QrCode } from 'lucide-react';
import { usePixPayment } from '@/hooks/payment/usePixPayment';
import { usePaymentProcessing } from '@/hooks/payment/usePaymentProcessing';
import { useAsaas } from '@/contexts/asaas';

interface SimplifiedPixOptionProps {
  onSelect: () => void;
  isSelected: boolean;
}

const SimplifiedPixOption: React.FC<SimplifiedPixOptionProps> = ({ onSelect, isSelected }) => {
  const { settings } = useAsaas();
  const { handlePixPayment } = usePixPayment();
  const { processing, startProcessing, stopProcessing } = usePaymentProcessing();

  const handlePayment = async () => {
    if (settings?.apiKey) {
      startProcessing();
      try {
        await handlePixPayment();
        onSelect();
      } catch (error) {
        console.error("Error during PIX payment:", error);
      } finally {
        stopProcessing();
      }
    } else {
      console.error("Asaas API key is not configured.");
    }
  };

  return (
    <RadioOption
      icon={QrCode}
      label="Pagar com PIX"
      description="Pague usando seu aplicativo bancário"
      onClick={handlePayment}
      selected={isSelected}
      disabled={processing}
      loading={processing}
    />
  );
};

export default SimplifiedPixOption;
