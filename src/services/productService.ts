
import { supabase } from '@/lib/supabase';
import type { Database } from '@/types/supabase';
import { logger } from '@/utils/logger';

export type Product = Database['public']['Tables']['products']['Row'];
export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface ProductCreateInput {
  name: string;
  slug: string;
  description?: string;
  price: number;
  image_url?: string;
  is_digital?: boolean;
}

// Get all products
export const getAllProducts = async (): Promise<Product[]> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    logger.error('Error loading products:', error);
    throw error;
  }
};

// Get a product by ID
export const getProductById = async (id: number | string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    logger.error(`Error loading product with ID ${id}:`, error);
    throw error;
  }
};

// Get a product by slug
export const getProductBySlug = async (slug: string): Promise<Product | null> => {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Product not found
      }
      throw error;
    }
    
    return data;
  } catch (error) {
    logger.error(`Error loading product with slug ${slug}:`, error);
    throw error;
  }
};

// Create a new product
export const createProduct = async (product: ProductCreateInput): Promise<Product> => {
  try {
    const newProduct: ProductInsert = {
      ...product,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('products')
      .insert(newProduct)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create product');
    
    return data;
  } catch (error) {
    logger.error('Error creating product:', error);
    throw error;
  }
};

// Update a product
export const updateProduct = async (id: number, updates: Partial<Product>): Promise<Product> => {
  try {
    const productUpdate: ProductUpdate = {
      ...updates,
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('products')
      .update(productUpdate)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update product');
    
    return data;
  } catch (error) {
    logger.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
};

// Delete a product
export const deleteProduct = async (id: number): Promise<void> => {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    logger.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
};
