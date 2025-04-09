
import React from 'react';
import { Product, CriarProdutoInput } from '@/types/product';

export interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  refreshProducts: () => Promise<void>;
  addProduct: (product: CriarProdutoInput) => Promise<Product>;
  updateProduct: (id: number, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: number) => Promise<void>;
  getProductById: (id: number | string) => Promise<Product | null>;
  getProductBySlug: (slug: string) => Promise<Product | null>;
}

export interface ProductProviderProps {
  children: React.ReactNode;
}
