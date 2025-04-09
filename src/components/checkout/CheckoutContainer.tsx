
import React, { useEffect, useState } from 'react';
import CheckoutHeader from './CheckoutHeader';
import CheckoutFooter from './CheckoutFooter';
import { useToast } from '@/hooks/use-toast';
import { getCheckoutCustomization } from '@/services/checkoutCustomizationService';
import type { CheckoutCustomization } from '@/services/checkoutCustomizationService';

interface CheckoutContainerProps {
  children: React.ReactNode;
}

const CheckoutContainer: React.FC<CheckoutContainerProps> = ({ children }) => {
  const { toast } = useToast();
  const [customization, setCustomization] = useState<CheckoutCustomization | null>(null);
  const [isCustomizationLoaded, setIsCustomizationLoaded] = useState(false);

  useEffect(() => {
    const fetchCustomization = async () => {
      try {
        console.log("Fetching checkout customization...");
        
        const data = await getCheckoutCustomization();

        if (!data) {
          console.log("No checkout customization found, using defaults");
          setIsCustomizationLoaded(true);
          return;
        }

        console.log("Checkout customization loaded:", data);
        setCustomization(data);
        
        setIsCustomizationLoaded(true);
      } catch (err) {
        console.error('Failed to fetch checkout customization', err);
        // Continue with defaults even on error
        setIsCustomizationLoaded(true);
      }
    };

    fetchCustomization();
  }, []);

  // Add CSS variables for checkout button styling
  const customStyles = {
    '--button-color': customization?.button_color || '#3b82f6',
    '--button-text-color': customization?.button_text_color || '#ffffff',
    '--button-text': `'${customization?.button_text || 'Finalizar Pagamento'}'`,
    '--heading-color': customization?.heading_color || '#000000',
  } as React.CSSProperties;

  // Show a simple loading state while customization is loading
  if (!isCustomizationLoaded) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-pulse">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 touch-manipulation" style={customStyles}>
      <CheckoutHeader customization={customization} />
      <main className="max-w-xl mx-auto py-2 px-4">
        {children}
      </main>
      <CheckoutFooter />
    </div>
  );
};

export default CheckoutContainer;
