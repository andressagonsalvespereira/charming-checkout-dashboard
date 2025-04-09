
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import { normalizeProduct, normalizeProducts } from './normalizers';

/**
 * Busca todos os produtos do banco de dados
 */
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return normalizeProducts(data || []);
  } catch (error) {
    console.error('Erro ao buscar produtos:', error);
    return [];
  }
}

/**
 * Busca um produto específico pelo ID
 */
export async function fetchProductById(id: number | string): Promise<Product | null> {
  try {
    const productId = typeof id === 'string' ? parseInt(id, 10) : id;
    
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Nenhum resultado encontrado
      }
      throw error;
    }
    
    return normalizeProduct(data);
  } catch (error) {
    console.error(`Erro ao buscar produto com ID ${id}:`, error);
    return null;
  }
}

/**
 * Busca um produto específico pelo slug
 */
export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // Nenhum resultado encontrado
      }
      throw error;
    }
    
    return normalizeProduct(data);
  } catch (error) {
    console.error(`Erro ao buscar produto com slug ${slug}:`, error);
    return null;
  }
}
