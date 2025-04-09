
import { useCallback } from 'react';
import { Product } from '@/types/product';
import { deleteProduct } from '../api';

interface UseProductRemoveProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isOffline: boolean;
}

export const useProductRemove = ({
  setProducts,
  isOffline
}: UseProductRemoveProps) => {
  
  // Remove an existing product
  const removeProduct = useCallback(async (id: number | string): Promise<void> => {
    try {
      // If offline, we can't remove a product
      if (isOffline) {
        throw new Error('Cannot remove a product while offline.');
      }
      
      // Remove the product using the API
      await deleteProduct(Number(id));
      
      // Update the local product list
      setProducts(prevProducts => prevProducts.filter(p => String(p.id) !== String(id)));
    } catch (error) {
      console.error('Error removing product:', error);
      throw error;
    }
  }, [setProducts, isOffline]);

  return { removeProduct };
};
