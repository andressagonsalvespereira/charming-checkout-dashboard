
import { useCallback } from 'react';
import { Product } from '@/types/product';
import { updateProduct } from '../api';

interface UseProductEditProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isOffline: boolean;
}

export const useProductEdit = ({
  setProducts,
  isOffline
}: UseProductEditProps) => {
  
  // Edit an existing product
  const editProduct = useCallback(async (id: number | string, productData: Partial<Product>): Promise<Product> => {
    try {
      // If offline, we can't edit a product
      if (isOffline) {
        throw new Error('Cannot edit a product while offline.');
      }
      
      // Edit the product using the API
      const updatedProduct = await updateProduct(Number(id), productData);
      
      // Update the local product list
      setProducts(prevProducts => 
        prevProducts.map(p => String(p.id) === String(id) ? updatedProduct : p)
      );
      
      return updatedProduct;
    } catch (error) {
      console.error('Error editing product:', error);
      throw error;
    }
  }, [setProducts, isOffline]);

  return { editProduct };
};
