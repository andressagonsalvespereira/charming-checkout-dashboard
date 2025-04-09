
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  getCheckoutCustomization,
  updateCheckoutCustomization,
  uploadBannerImage as uploadBannerImageService,
  CheckoutCustomization
} from '@/services/checkoutCustomizationService';
import { useToast } from '@/hooks/use-toast';

export interface CheckoutCustomizationContextType {
  customization: CheckoutCustomization | null;
  loading: boolean;
  error: Error | null;
  updateCustomization: (updates: Partial<CheckoutCustomization>) => Promise<void>;
  uploadBannerImage: (file: File) => Promise<string | null>;
}

const CheckoutCustomizationContext = createContext<CheckoutCustomizationContextType | undefined>(undefined);

export const CheckoutCustomizationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { toast } = useToast();
  const [customization, setCustomization] = useState<CheckoutCustomization | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    fetchCheckoutCustomization();
  }, []);

  const fetchCheckoutCustomization = async () => {
    try {
      setLoading(true);
      const data = await getCheckoutCustomization();
      setCustomization(data);
    } catch (err) {
      console.error('Error fetching checkout customization:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        title: 'Error',
        description: 'Failed to load checkout customization',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const updateCustomization = async (updates: Partial<CheckoutCustomization>) => {
    if (!customization) return;
    
    try {
      setLoading(true);
      const updated = await updateCheckoutCustomization(customization.id, updates);
      setCustomization(updated);
      toast({
        title: 'Success',
        description: 'Checkout customization updated',
      });
    } catch (err) {
      console.error('Error updating checkout customization:', err);
      setError(err instanceof Error ? err : new Error('An unknown error occurred'));
      toast({
        title: 'Error',
        description: 'Failed to update checkout customization',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const uploadBannerImage = async (file: File): Promise<string | null> => {
    try {
      setLoading(true);
      const imageUrl = await uploadBannerImageService(file);
      return imageUrl;
    } catch (err) {
      console.error('Error uploading banner image:', err);
      toast({
        title: 'Error',
        description: 'Failed to upload banner image',
        variant: 'destructive',
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  return (
    <CheckoutCustomizationContext.Provider
      value={{
        customization,
        loading,
        error,
        updateCustomization,
        uploadBannerImage
      }}
    >
      {children}
    </CheckoutCustomizationContext.Provider>
  );
};

export const useCheckoutCustomization = () => {
  const context = useContext(CheckoutCustomizationContext);
  
  if (context === undefined) {
    throw new Error('useCheckoutCustomization must be used within a CheckoutCustomizationProvider');
  }
  
  return context;
};
