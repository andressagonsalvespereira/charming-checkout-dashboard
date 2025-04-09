
import React, { useState, useEffect } from 'react';
import { Clock, Timer } from 'lucide-react';
import type { CheckoutCustomization } from '@/services/checkoutCustomizationService';

interface CheckoutHeaderProps {
  customization: CheckoutCustomization | null;
}

const CheckoutHeader: React.FC<CheckoutHeaderProps> = ({ customization }) => {
  const [timeLeft, setTimeLeft] = useState({
    minutes: 14,
    seconds: 59
  });

  const defaultCustomization: CheckoutCustomization = {
    id: 0,
    header_message: 'Oferta por tempo limitado!',
    banner_image_url: '',
    show_banner: true,
    button_color: '#3b82f6',
    button_text_color: '#ffffff',
    heading_color: '#000000',
    button_text: 'Finalizar Pagamento',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  // Use provided customization or default values
  const settings = customization || defaultCustomization;

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(timer);
          return { minutes: 0, seconds: 0 };
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (minutes: number, seconds: number) => {
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <header className="bg-gradient-to-r from-black to-gray-800 text-white py-3 px-4 text-center">
        <div className="max-w-5xl mx-auto">
          <div className="text-base md:text-lg">
            {settings.header_message} <span className="font-bold text-yellow-300">{formatTime(timeLeft.minutes, timeLeft.seconds)}</span>
          </div>
        </div>
      </header>
      
      {settings.show_banner && settings.banner_image_url && (
        <div className="w-full flex justify-center mt-2 mb-4">
          <div className="max-w-xl w-full px-4">
            <img 
              src={settings.banner_image_url} 
              alt="Checkout Banner" 
              className="w-full h-auto object-cover rounded-md"
            />
          </div>
        </div>
      )}
    </>
  );
};

export default CheckoutHeader;
