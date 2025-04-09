
import { useCallback } from 'react';
import { Product, CriarProdutoInput } from '@/types/product';
import { slugify } from '../slugUtils';

// Type for the properties that the hook receives
interface UseProductOperationsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isOffline: boolean;
}

// Import the APIs
import { 
  createProduct, 
  updateProduct, 
  deleteProduct, 
  fetchProductById, 
  fetchProductBySlug 
} from '../api';

export const useProductOperations = ({
  products,
  setProducts,
  isOffline
}: UseProductOperationsProps) => {
  
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
    addProduct,
    editProduct,
    removeProduct,
    getProductById,
    getProductBySlug
  };
};
