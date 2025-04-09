
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

// Local storage functions for offline functionality
export const LOCAL_STORAGE_KEY = 'product_cache';

export function saveProducts(products: Product[]): void {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(products));
    console.log('Products saved to local storage:', products.length);
  } catch (error) {
    console.error('Error saving products to local storage:', error);
  }
}

export function loadProducts(): Product[] {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!data) {
      console.log('No products found in local storage');
      return [];
    }
    
    const products: Product[] = JSON.parse(data);
    console.log('Products loaded from local storage:', products.length);
    return products.map(normalizeProductData);
  } catch (error) {
    console.error('Error loading products from local storage:', error);
    return [];
  }
}

export function clearProductCache(): void {
  try {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    console.log('Product cache cleared');
  } catch (error) {
    console.error('Error clearing product cache:', error);
  }
}
