
import { useCallback } from 'react';
import { Product } from '@/types/product';
import { fetchProductById, fetchProductBySlug } from '../api';

interface UseProductFetchProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isOffline: boolean;
}

export const useProductFetch = ({
  products,
  setProducts,
  isOffline
}: UseProductFetchProps) => {
  
  // Get a product by ID
  const getProductById = useCallback(async (id: number | string): Promise<Product | null> => {
    try {
      console.log('getProductById called with ID:', id);
      
      // First check if we already have the product in cache
      const cachedProduct = products.find(p => String(p.id) === String(id));
      if (cachedProduct) {
        console.log('Product found in cache by ID:', cachedProduct);
        return cachedProduct;
      }
      
      // If not in cache and offline, we can't fetch from server
      if (isOffline) {
        console.warn('Offline: Could not find product with ID', id);
        return null;
      }
      
      // Fetch from server
      console.log('Fetching product from server by ID:', id);
      return await fetchProductById(id);
    } catch (error) {
      console.error('Error getting product by ID:', error);
      return null;
    }
  }, [products, isOffline]);
  
  // Get a product by slug
  const getProductBySlug = useCallback(async (slug: string): Promise<Product | null> => {
    try {
      console.log('getProductBySlug called with slug:', slug);
      
      // First check if we already have the product in cache
      const cachedProduct = products.find(p => p.slug === slug);
      if (cachedProduct) {
        console.log('Product found in cache by exact slug:', cachedProduct);
        return cachedProduct;
      }
      
      // If not in cache and offline, we can't fetch from server
      if (isOffline) {
        console.warn('Offline: Could not find product with slug', slug);
        return null;
      }
      
      // Fetch from server
      console.log('Fetching product from server by slug:', slug);
      const product = await fetchProductBySlug(slug);
      
      if (product) {
        // Add to cache for future lookups
        setProducts(prevProducts => {
          // Check if product already exists in cache
          const exists = prevProducts.some(p => String(p.id) === String(product.id));
          if (!exists) {
            return [...prevProducts, product];
          }
          return prevProducts;
        });
      }
      
      return product;
    } catch (error) {
      console.error('Error getting product by slug:', error);
      return null;
    }
  }, [products, isOffline, setProducts]);

  return {
    getProductById,
    getProductBySlug
  };
};
