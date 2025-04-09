
import { supabase } from '@/lib/supabase';
import { Product, CreateProductInput } from '@/types/product';
import { logger } from '@/utils/logger';

// Get all products
export async function getAllProducts(): Promise<Product[]> {
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
}

// Get a product by ID
export async function getProductById(id: number | string): Promise<Product | null> {
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
}

// Get a product by slug
export async function getProductBySlug(slug: string): Promise<Product | null> {
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
}

// Create a new product
export async function createProduct(product: CreateProductInput): Promise<Product> {
  try {
    // Generate slug from name
    const slug = product.name.toLowerCase().replace(/\s+/g, '-');
    
    const newProduct = {
      ...product,
      slug,
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
}

// Update a product
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
  try {
    const productUpdate = {
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
}

// Delete a product
export async function deleteProduct(id: number): Promise<void> {
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
}
