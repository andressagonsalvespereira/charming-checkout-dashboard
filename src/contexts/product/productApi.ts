
import { Product, CriarProdutoInput } from '@/types/product';
import { 
  fetchProducts, 
  fetchProductById, 
  fetchProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from './api';

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

// Funções com nomes padronizados em inglês - reexportamos das implementações modularizadas
export { 
  fetchProducts,
  fetchProductById,
  fetchProductBySlug,
  createProduct,
  updateProduct,
  deleteProduct
} from './api';
