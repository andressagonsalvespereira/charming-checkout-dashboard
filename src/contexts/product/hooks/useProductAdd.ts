
import { useCallback } from 'react';
import { Product, CriarProdutoInput } from '@/types/product';
import { createProduct } from '../api';

interface UseProductAddProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isOffline: boolean;
}

export const useProductAdd = ({
  setProducts,
  isOffline
}: UseProductAddProps) => {
  
  // Add a new product
  const addProduct = useCallback(async (productData: CriarProdutoInput): Promise<Product> => {
    try {
      // If offline, we can't add a product
      if (isOffline) {
        throw new Error('Cannot add a product while offline.');
      }
      
      // Add the product using the API
      const newProduct = await createProduct(productData);
      
      // Update the local product list
      setProducts(prevProducts => [newProduct, ...prevProducts]);
      
      return newProduct;
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  }, [setProducts, isOffline]);

  return { addProduct };
};
