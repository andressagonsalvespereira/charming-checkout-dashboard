
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { logger } from '@/utils/logger';

export type CheckoutCustomization = Database['public']['Tables']['checkout_customization']['Row'];
export type CheckoutCustomizationInsert = Database['public']['Tables']['checkout_customization']['Insert'];
export type CheckoutCustomizationUpdate = Database['public']['Tables']['checkout_customization']['Update'];

// Get checkout customization settings
export const getCheckoutCustomization = async (): Promise<CheckoutCustomization | null> => {
  try {
    // Attempt to get the first record, or create default if none exists
    const { data, error } = await supabase
      .from('checkout_customization')
      .select('*')
      .order('id', { ascending: true })
      .limit(1)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        // No records found, create default
        return createDefaultCustomization();
      }
      throw error;
    }

    return data;
  } catch (error) {
    logger.error('Error loading checkout customization:', error);
    throw error;
  }
};

// Create default customization (if none exists)
export const createDefaultCustomization = async (): Promise<CheckoutCustomization> => {
  try {
    const defaultCustomization: CheckoutCustomizationInsert = {
      header_message: 'Complete your purchase',
      show_banner: true,
      button_color: '#3b82f6',
      button_text_color: '#ffffff',
      heading_color: '#1f2937',
      button_text: 'Complete Purchase',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('checkout_customization')
      .insert(defaultCustomization)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create default checkout customization');
    
    return data;
  } catch (error) {
    logger.error('Error creating default checkout customization:', error);
    throw error;
  }
};

// Update checkout customization
export const updateCheckoutCustomization = async (
  id: number, 
  updates: Partial<CheckoutCustomization>
): Promise<CheckoutCustomization> => {
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
    if (!data) throw new Error('Failed to update checkout customization');
    
    return data;
  } catch (error) {
    logger.error(`Error updating checkout customization with ID ${id}:`, error);
    throw error;
  }
};

// Upload banner image
export const uploadBannerImage = async (file: File): Promise<string> => {
  try {
    const fileName = `banner-${Date.now()}-${file.name}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('product-images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) throw uploadError;
    if (!data) throw new Error('Failed to upload banner image');

    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    logger.error('Error uploading banner image:', error);
    throw error;
  }
};
