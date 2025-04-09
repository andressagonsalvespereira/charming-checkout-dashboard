
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useToast } from '@/hooks/use-toast';
import { 
  getCheckoutCustomization, 
  updateCheckoutCustomization, 
  uploadBannerImage,
  type CheckoutCustomization 
} from '@/services/checkoutCustomizationService';

interface CheckoutCustomizationContextType {
  customization: CheckoutCustomization | null;
  loading: boolean;
  error: string | null;
  updateCustomization: (data: Partial<CheckoutCustomization>) => Promise<void>;
  uploadBanner: (file: File) => Promise<string | null>;
  refreshCustomization: () => Promise<void>;
}

const CheckoutCustomizationContext = createContext<CheckoutCustomizationContextType | undefined>(undefined);

export const useCheckoutCustomization = () => {
  const context = useContext(CheckoutCustomizationContext);
  if (!context) {
    throw new Error('useCheckoutCustomization must be used within a CheckoutCustomizationProvider');
  }
  return context;
};

interface CheckoutCustomizationProviderProps {
  children: ReactNode;
}

export const CheckoutCustomizationProvider: React.FC<CheckoutCustomizationProviderProps> = ({ children }) => {
  const [customization, setCustomization] = useState<CheckoutCustomization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const fetchCustomization = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getCheckoutCustomization();
      setCustomization(data);
    } catch (err) {
      console.error('Error fetching checkout customization:', err);
      setError('Falha ao carregar configurações de personalização do checkout');
    } finally {
      setLoading(false);
    }
  };

  const refreshCustomization = async () => {
    await fetchCustomization();
  };

  const updateCustomization = async (data: Partial<CheckoutCustomization>) => {
    try {
      setLoading(true);
      setError(null);

      if (!customization?.id) {
        throw new Error('No customization record found to update');
      }

      const updated = await updateCheckoutCustomization(customization.id, data);

      if (updated) {
        setCustomization(updated);
        
        toast({
          title: 'Personalização atualizada',
          description: 'As configurações do checkout foram atualizadas com sucesso',
        });
      }
    } catch (err) {
      console.error('Error updating checkout customization:', err);
      setError('Falha ao atualizar configurações de personalização');
      
      toast({
        title: 'Erro',
        description: 'Não foi possível atualizar as configurações de personalização',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadBanner = async (file: File): Promise<string | null> => {
    try {
      const url = await uploadBannerImage(file);
      
      if (url) {
        toast({
          title: 'Imagem enviada',
          description: 'A imagem do banner foi enviada com sucesso',
        });
      }
      
      return url;
    } catch (err) {
      console.error('Error uploading banner image:', err);
      
      toast({
        title: 'Erro',
        description: 'Não foi possível enviar a imagem do banner',
        variant: 'destructive',
      });
      
      return null;
    }
  };

  useEffect(() => {
    fetchCustomization();
  }, []);

  const value = {
    customization,
    loading,
    error,
    updateCustomization,
    uploadBanner,
    refreshCustomization
  };

  return (
    <CheckoutCustomizationContext.Provider value={value}>
      {children}
    </CheckoutCustomizationContext.Provider>
  );
};
