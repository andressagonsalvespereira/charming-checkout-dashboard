
import { supabase } from '@/lib/supabase';
import { Product } from '@/types/product';
import { normalizeProduct } from './normalizers';

/**
 * Atualiza um produto existente no banco de dados
 */
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
