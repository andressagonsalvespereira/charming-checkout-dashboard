
import React, { useState } from 'react';
import RadioOption from './RadioOption';
import { QrCode } from 'lucide-react';
import { useAsaas } from '@/contexts/asaas';
import { PaymentResult } from '@/types/payment';

interface SimplifiedPixOptionProps {
  onSelect: () => void;
  isSelected: boolean;
}

const SimplifiedPixOption: React.FC<SimplifiedPixOptionProps> = ({ onSelect, isSelected }) => {
  const { settings } = useAsaas();
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePixPayment = async () => {
    if (settings?.apiKey) {
      setIsProcessing(true);
      try {
        // Generate PIX payment (handled by parent component)
        onSelect();
      } catch (error) {
        console.error("Error during PIX payment:", error);
      } finally {
        setIsProcessing(false);
      }
    } else {
      console.error("Asaas API key is not configured.");
    }
  };

  return (
    <RadioOption
      Icon={QrCode}
      label="Pagar com PIX"
      description="Pague usando seu aplicativo bancário"
      onClick={handlePixPayment}
      selected={isSelected}
      disabled={isProcessing}
      loading={isProcessing}
    />
  );
};

export default SimplifiedPixOption;
