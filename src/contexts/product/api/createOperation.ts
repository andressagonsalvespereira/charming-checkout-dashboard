
import { supabase } from '@/lib/supabase';
import { Product, CriarProdutoInput } from '@/types/product';
import { normalizeProduct } from './normalizers';
import { generateUniqueSlug } from '../slugUtils';

/**
 * Cria um novo produto no banco de dados
 */
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
