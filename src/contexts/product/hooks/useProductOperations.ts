
import { useCallback } from 'react';
import { Product, CriarProdutoInput } from '@/types/product';
import { slugify } from '../slugUtils';

// Type for the properties that the hook receives
interface UseProductOperationsProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  isOffline: boolean;
}

// Mock API functions until we implement the real ones
const adicionarProdutoAPI = async (productData: CriarProdutoInput): Promise<Product> => {
  // This would be an actual API call in production
  console.log('Adding product via API:', productData);
  return {
    id: Math.floor(Math.random() * 1000),
    name: productData.nome,
    nome: productData.nome,
    slug: slugify(productData.nome),
    description: productData.descricao,
    descricao: productData.descricao,
    price: productData.preco,
    preco: productData.preco,
    image_url: productData.urlImagem,
    urlImagem: productData.urlImagem,
    is_digital: productData.digital,
    digital: productData.digital,
    override_global_status: productData.usarProcessamentoPersonalizado,
    usarProcessamentoPersonalizado: productData.usarProcessamentoPersonalizado,
    custom_manual_status: productData.statusCartaoManual,
    statusCartaoManual: productData.statusCartaoManual,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
};

const editarProdutoAPI = async (id: number | string, productData: Partial<Product>): Promise<Product> => {
  // This would be an actual API call in production
  console.log('Editing product via API:', id, productData);
  return {
    id,
    name: productData.nome || productData.name || '',
    nome: productData.nome || productData.name || '',
    slug: productData.slug || '',
    description: productData.descricao || productData.description || '',
    descricao: productData.descricao || productData.description || '',
    price: productData.preco || productData.price || 0,
    preco: productData.preco || productData.price || 0,
    image_url: productData.urlImagem || productData.image_url || '',
    urlImagem: productData.urlImagem || productData.image_url || '',
    is_digital: productData.digital || productData.is_digital || false,
    digital: productData.digital || productData.is_digital || false,
    override_global_status: productData.usarProcessamentoPersonalizado || productData.override_global_status || false,
    usarProcessamentoPersonalizado: productData.usarProcessamentoPersonalizado || productData.override_global_status || false,
    custom_manual_status: productData.statusCartaoManual || productData.custom_manual_status || '',
    statusCartaoManual: productData.statusCartaoManual || productData.custom_manual_status || '',
    updated_at: new Date().toISOString()
  };
};

const removerProdutoAPI = async (id: number | string): Promise<void> => {
  // This would be an actual API call in production
  console.log('Removing product via API:', id);
};

const obterProdutoPorIdAPI = async (id: number | string): Promise<Product | undefined> => {
  // This would be an actual API call in production
  console.log('Getting product by ID via API:', id);
  return undefined; // In a real implementation, we'd return the product if found
};

const obterProdutoPorSlugAPI = async (slug: string): Promise<Product | undefined> => {
  // This would be an actual API call in production
  console.log('Getting product by slug via API:', slug);
  return undefined; // In a real implementation, we'd return the product if found
};

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
      const newProduct = await adicionarProdutoAPI(productData);
      
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
      const updatedProduct = await editarProdutoAPI(id, productData);
      
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
      await removerProdutoAPI(id);
      
      // Update the local product list
      setProducts(prevProducts => prevProducts.filter(p => String(p.id) !== String(id)));
    } catch (error) {
      console.error('Error removing product:', error);
      throw error;
    }
  }, [setProducts, isOffline]);
  
  // Get a product by ID
  const getProductById = useCallback(async (id: number | string): Promise<Product | undefined> => {
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
        return undefined;
      }
      
      // Fetch from server
      console.log('Fetching product from server by ID:', id);
      const product = await obterProdutoPorIdAPI(id);
      console.log('Server response for ID search:', product);
      
      return product;
    } catch (error) {
      console.error('Error getting product by ID:', error);
      return undefined;
    }
  }, [products, isOffline]);
  
  // Get a product by slug
  const getProductBySlug = useCallback(async (slug: string): Promise<Product | undefined> => {
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
        return undefined;
      }
      
      // Fetch from server
      console.log('Fetching product from server by slug:', slug);
      const product = await obterProdutoPorSlugAPI(slug);
      console.log('Server response for slug search:', product);
      
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
      return undefined;
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
