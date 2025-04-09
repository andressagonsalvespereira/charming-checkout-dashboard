
import { useCallback } from 'react';
import { Product, CriarProdutoInput } from '@/types/product';
import { useProductAdd } from './useProductAdd';
import { useProductEdit } from './useProductEdit';
import { useProductRemove } from './useProductRemove';
import { useProductFetch } from './useProductFetch';

// Type for the properties that the hook receives
interface UseProductOperationsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isOffline: boolean;
}

export const useProductOperations = (props: UseProductOperationsProps) => {
  const { addProduct } = useProductAdd(props);
  const { editProduct } = useProductEdit(props);
  const { removeProduct } = useProductRemove(props);
  const { getProductById, getProductBySlug } = useProductFetch(props);
  
  return {
    addProduct,
    editProduct,
    removeProduct,
    getProductById,
    getProductBySlug
  };
};
