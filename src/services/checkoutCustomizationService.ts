
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { logger } from '@/utils/logger';

export type CheckoutCustomization = Database['public']['Tables']['checkout_customization']['Row'];
export type CheckoutCustomizationUpdate = Database['public']['Tables']['checkout_customization']['Update'];

// Get the latest checkout customization
export const getCheckoutCustomization = async (): Promise<CheckoutCustomization | null> => {
  try {
    const { data, error } = await supabase
      .from('checkout_customization')
      .select('*')
      .order('id', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No customization found
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    logger.error('Error loading checkout customization:', error);
    throw error;
  }
};

// Update checkout customization
export const updateCheckoutCustomization = async (
  id: number, 
  updates: Partial<CheckoutCustomization>
): Promise<CheckoutCustomization | null> => {
  try {
    const customizationUpdate: CheckoutCustomizationUpdate = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('checkout_customization')
      .update(customizationUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    logger.error('Error updating checkout customization:', error);
    throw error;
  }
};

// Upload a banner image
export const uploadBannerImage = async (file: File): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}-${Date.now()}.${fileExt}`;
    const filePath = `checkout-banners/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('public')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('public')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    logger.error('Error uploading banner image:', error);
    return null;
  }
};
