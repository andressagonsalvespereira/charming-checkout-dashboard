
import { Product } from '@/types/product';

export function mapResponseToProduct(data: any): Product {
  // Mapear dados de resposta da API para o formato padrão do produto
  const product: Product = {
    id: data.id?.toString() || '',
    name: data.name || data.nome || '',
    price: parseFloat(data.price || data.preco || 0),
    description: data.description || data.descricao || '',
    image_url: data.image_url || data.urlImagem || '',
    is_digital: Boolean(data.is_digital || data.digital),
    slug: data.slug || '',
    
    // Campos para compatibilidade
    nome: data.nome || data.name || '',
    descricao: data.description || data.descricao || '',
    preco: parseFloat(data.price || data.preco || 0),
    urlImagem: data.image_url || data.urlImagem || '',
    digital: Boolean(data.is_digital || data.digital),
    
    // Configurações de pagamento
    override_global_status: Boolean(data.override_global_status || data.usarProcessamentoPersonalizado),
    custom_manual_status: data.custom_manual_status || data.statusCartaoManual || null,
    usarProcessamentoPersonalizado: Boolean(data.override_global_status || data.usarProcessamentoPersonalizado),
    statusCartaoManual: data.custom_manual_status || data.statusCartaoManual || '',
  };
  
  return product;
}

export function normalizeProductData(data: any): Product {
  return {
    id: data.id?.toString() || '',
    name: data.name || data.nome || '',
    description: data.description || data.descricao || '',
    price: parseFloat(data.price || data.preco || 0),
    image_url: data.image_url || data.urlImagem || '',
    is_digital: Boolean(data.is_digital || data.digital),
    slug: data.slug || '',
    override_global_status: Boolean(data.override_global_status || data.usarProcessamentoPersonalizado),
    custom_manual_status: data.custom_manual_status || data.statusCartaoManual || null,
    
    // Campos para compatibilidade com código legado
    nome: data.name || data.nome || '',
    descricao: data.description || data.descricao || '',
    preco: parseFloat(data.price || data.preco || 0),
    urlImagem: data.image_url || data.urlImagem || '',
    digital: Boolean(data.is_digital || data.digital),
    usarProcessamentoPersonalizado: Boolean(data.override_global_status || data.usarProcessamentoPersonalizado),
    statusCartaoManual: data.custom_manual_status || data.statusCartaoManual || '',
  };
}
