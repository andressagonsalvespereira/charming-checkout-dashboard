
import React from 'react';
import { Product, CriarProdutoInput } from '@/types/product';

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  retryFetchProducts: () => Promise<void>;
  addProduct: (product: CriarProdutoInput) => Promise<Product>;
  updateProduct: (id: number | string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: number | string) => Promise<void>;
  getProductById: (id: number | string) => Promise<Product | null>;
  getProductBySlug: (slug: string) => Promise<Product | null>;
  isOffline: boolean;
}

export interface ProductProviderProps {
  children: React.ReactNode;
}
