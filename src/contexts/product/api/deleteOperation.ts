
import { supabase } from '@/lib/supabase';

/**
 * Remove um produto do banco de dados
 */
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
