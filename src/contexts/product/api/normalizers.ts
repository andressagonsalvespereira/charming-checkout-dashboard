
import { Product } from '@/types/product';

/**
 * Normaliza dados do produto vindo do banco para o formato usado pela aplicação
 * incluindo campos legados para compatibilidade
 */
export function normalizeProduct(data: any): Product {
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

/**
 * Normaliza uma lista de produtos
 */
export function normalizeProducts(data: any[]): Product[] {
  return data.map(normalizeProduct);
}
