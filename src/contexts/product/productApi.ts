
import { supabase } from '@/lib/supabase';
import { Product, CriarProdutoInput } from '@/types/product';
import { generateUniqueSlug } from './slugUtils';

// Funções com nomes legados para compatibilidade
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

// Funções com nomes padronizados em inglês
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

export async function createProduct(productInput: CriarProdutoInput): Promise<Product> {
  try {
    // Converter o formato de entrada legado para o novo
    const product = {
      name: productInput.nome || productInput.name,
      description: productInput.descricao || productInput.description,
      price: productInput.preco || productInput.price,
      image_url: productInput.urlImagem || productInput.image_url,
      is_digital: productInput.digital !== undefined ? productInput.digital : productInput.is_digital,
      slug: await generateUniqueSlug((productInput.nome || productInput.name || '').toLowerCase().replace(/\s+/g, '-')),
      override_global_status: productInput.usarProcessamentoPersonalizado || productInput.override_global_status,
      custom_manual_status: productInput.statusCartaoManual || productInput.custom_manual_status,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('products')
      .insert(product)
      .select()
      .single();

    if (error) throw error;
    if (!data) throw new Error('Falha ao criar produto');
    
    return normalizeProduct(data);
  } catch (error) {
    console.error('Erro ao criar produto:', error);
    throw error;
  }
}

export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product> {
  try {
    // Normalizar as atualizações para corresponder ao esquema do banco de dados
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
    if (!data) throw new Error('Falha ao atualizar produto');
    
    return normalizeProduct(data);
  } catch (error) {
    console.error(`Erro ao atualizar produto com ID ${id}:`, error);
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
    console.error(`Erro ao excluir produto com ID ${id}:`, error);
    throw error;
  }
}

// Função auxiliar para normalizar os dados do produto para componentes de UI
function normalizeProduct(data: any): Product {
  return {
    id: data.id,
    name: data.name,
    nome: data.name, // Campo legado
    slug: data.slug,
    description: data.description,
    descricao: data.description, // Campo legado
    price: data.price,
    preco: data.price, // Campo legado
    image_url: data.image_url,
    urlImagem: data.image_url, // Campo legado
    is_digital: data.is_digital,
    digital: data.is_digital, // Campo legado
    override_global_status: data.override_global_status,
    usarProcessamentoPersonalizado: data.override_global_status, // Campo legado
    custom_manual_status: data.custom_manual_status,
    statusCartaoManual: data.custom_manual_status, // Campo legado
    created_at: data.created_at,
    updated_at: data.updated_at
  };
}

function normalizeProducts(data: any[]): Product[] {
  return data.map(normalizeProduct);
}
