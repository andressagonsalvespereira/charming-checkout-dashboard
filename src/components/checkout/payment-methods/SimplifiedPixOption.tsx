
import React, { useState } from 'react';
import RadioOption from './RadioOption';
import { QrCode } from 'lucide-react';
import { useAsaas } from '@/contexts/asaas';
import { PaymentResult } from '@/types/payment';

interface SimplifiedPixOptionProps {
  onSelect: () => void;
  isSelected: boolean;
  isProcessing?: boolean;
}

const SimplifiedPixOption: React.FC<SimplifiedPixOptionProps> = ({ 
  onSelect, 
  isSelected, 
  isProcessing = false 
}) => {
  const { settings } = useAsaas();
  const [isLocalProcessing, setIsLocalProcessing] = useState(false);

  const handlePixPayment = async () => {
    if (settings?.apiKey) {
      setIsLocalProcessing(true);
      try {
        // Generate PIX payment (handled by parent component)
        onSelect();
      } catch (error) {
        console.error("Error during PIX payment:", error);
      } finally {
        setIsLocalProcessing(false);
      }
    } else {
      console.error("Asaas API key is not configured.");
    }
  };

  // Use either the passed isProcessing prop or the local state
  const isLoading = isProcessing || isLocalProcessing;

  return (
    <RadioOption
      Icon={QrCode}
      label="Pagar com PIX"
      description="Pague usando seu aplicativo bancário"
      onClick={handlePixPayment}
      selected={isSelected}
      disabled={isLoading}
      loading={isLoading}
    />
  );
};

export default SimplifiedPixOption;
