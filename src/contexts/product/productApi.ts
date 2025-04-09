
import { supabase } from '@/lib/supabase';
import { Product, CriarProdutoInput } from '@/types/product';
import { generateUniqueSlug } from './slugUtils';

// Legacy function names for compatibility
export const buscarProdutosAPI = async (): Promise<Product[]> => {
  return fetchProducts();
};

export const adicionarProdutoAPI = async (produto: CriarProdutoInput): Promise<Product> => {
  return createProduct(produto);
};

export const editarProdutoAPI = async (id: number, produto: Partial<Product>): Promise<Product> => {
  return updateProduct(id, produto);
};

export const removerProdutoAPI = async (id: number): Promise<void> => {
  return deleteProduct(id);
};

export const obterProdutoPorIdAPI = async (id: number): Promise<Product | null> => {
  return fetchProductById(id);
};

export const obterProdutoPorSlugAPI = async (slug: string): Promise<Product | null> => {
  return fetchProductBySlug(slug);
};

// Standard function names
export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return normalizeProducts(data || []);
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
}

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
        return null; // No rows returned
      }
      throw error;
    }
    
    return normalizeProduct(data);
  } catch (error) {
    console.error(`Error fetching product with id ${id}:`, error);
    return null;
  }
}

export async function fetchProductBySlug(slug: string): Promise<Product | null> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null; // No rows returned
      }
      throw error;
    }
    
    return normalizeProduct(data);
  } catch (error) {
    console.error(`Error fetching product with slug ${slug}:`, error);
    return null;
  }
}

export async function createProduct(productInput: CriarProdutoInput): Promise<Product> {
  try {
    // Convert the legacy input format to the new one
    const product = {
      name: productInput.nome,
      description: productInput.descricao,
      price: productInput.preco,
      image_url: productInput.urlImagem,
      is_digital: productInput.digital,
      slug: await generateUniqueSlug(productInput.nome.toLowerCase().replace(/\s+/g, '-')),
      override_global_status: productInput.usarProcessamentoPersonalizado,
      custom_manual_status: productInput.statusCartaoManual,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to create product');
    
    return normalizeProduct(data);
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
  try {
    // Normalize updates to match the database schema
    const dbUpdates: any = {};
    
    if (updates.name || updates.nome) 
      dbUpdates.name = updates.name || updates.nome;
    
    if (updates.description || updates.descricao) 
      dbUpdates.description = updates.description || updates.descricao;
    
    if (updates.price || updates.preco) 
      dbUpdates.price = updates.price || updates.preco;
    
    if (updates.image_url || updates.urlImagem) 
      dbUpdates.image_url = updates.image_url || updates.urlImagem;
    
    if (updates.is_digital !== undefined || updates.digital !== undefined) 
      dbUpdates.is_digital = updates.is_digital !== undefined ? updates.is_digital : updates.digital;
    
    if (updates.override_global_status !== undefined || updates.usarProcessamentoPersonalizado !== undefined) 
      dbUpdates.override_global_status = updates.override_global_status !== undefined ? 
        updates.override_global_status : updates.usarProcessamentoPersonalizado;
    
    if (updates.custom_manual_status || updates.statusCartaoManual) 
      dbUpdates.custom_manual_status = updates.custom_manual_status || updates.statusCartaoManual;
    
    dbUpdates.updated_at = new Date().toISOString();

    const { data, error } = await supabase
      .from('products')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Failed to update product');
    
    return normalizeProduct(data);
  } catch (error) {
    console.error(`Error updating product with ID ${id}:`, error);
    throw error;
  }
}

export async function deleteProduct(id: number): Promise<void> {
  try {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error(`Error deleting product with ID ${id}:`, error);
    throw error;
  }
}

// Helper function to normalize product data for UI components
function normalizeProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    nome: data.name, // Legacy
    slug: data.slug,
    description: data.description,
    descricao: data.description, // Legacy
    price: data.price,
    preco: data.price, // Legacy
    image_url: data.image_url,
    urlImagem: data.image_url, // Legacy
    image: data.image,
    is_digital: data.is_digital,
    digital: data.is_digital, // Legacy
    override_global_status: data.override_global_status,
    usarProcessamentoPersonalizado: data.override_global_status, // Legacy
    custom_manual_status: data.custom_manual_status,
    statusCartaoManual: data.custom_manual_status, // Legacy
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

function normalizeProducts(data: any[]): Product[] {
  return data.map(normalizeProduct);
}
