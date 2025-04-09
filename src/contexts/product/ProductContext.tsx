
import { createContext, useState, useEffect, ReactNode } from 'react';
import { Product, CreateProductInput } from '@/types/product';
import { getAllProducts, getProductById, getProductBySlug, createProduct, updateProduct, deleteProduct } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

interface ProductContextType {
  products: Product[];
  loading: boolean;
  error: string | null;
  isOffline: boolean;
  refreshProducts: () => Promise<void>;
  retryFetchProducts: () => Promise<void>;
  addProduct: (product: CreateProductInput) => Promise<Product>;
  updateProduct: (id: number | string, product: Partial<Product>) => Promise<Product>;
  deleteProduct: (id: number | string) => Promise<void>;
  getProductById: (id: number | string) => Promise<Product | null>;
  getProductBySlug: (slug: string) => Promise<Product | null>;
}

export const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: ReactNode;
}

export const ProductProvider = ({ children }: ProductProviderProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOffline, setIsOffline] = useState(false);
  const { toast } = useToast();

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProducts();
      setProducts(data);
      setIsOffline(false);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to load products');
      setIsOffline(true);
      toast({
        title: "Error",
        description: "Failed to load products. You're working in offline mode.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const retryFetchProducts = async () => {
    return fetchProducts();
  };

  const refreshProducts = async () => {
    return fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const addProduct = async (productData: CreateProductInput) => {
    try {
      const newProduct = await createProduct(productData);
      setProducts([newProduct, ...products]);
      return newProduct;
    } catch (err) {
      console.error('Error adding product:', err);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateProductState = async (id: number | string, productData: Partial<Product>) => {
    try {
      const updatedProduct = await updateProduct(Number(id), productData);
      setProducts(products.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      console.error('Error updating product:', err);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteProductState = async (id: number | string) => {
    try {
      await deleteProduct(Number(id));
      setProducts(products.filter(p => p.id !== id));
    } catch (err) {
      console.error('Error deleting product:', err);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      throw err;
    }
  };

  const getProductByIdState = async (id: number | string): Promise<Product | null> => {
    // First check if product is already in the state
    const existingProduct = products.find(p => p.id == id);
    if (existingProduct) return existingProduct;
    
    try {
      return await getProductById(id);
    } catch (err) {
      console.error(`Error getting product with ID ${id}:`, err);
      return null;
    }
  };

  const getProductBySlugState = async (slug: string): Promise<Product | null> => {
    // First check if product is already in the state
    const existingProduct = products.find(p => p.slug === slug);
    if (existingProduct) return existingProduct;
    
    try {
      return await getProductBySlug(slug);
    } catch (err) {
      console.error(`Error getting product with slug ${slug}:`, err);
      return null;
    }
  };

  return (
    <ProductContext.Provider value={{
      products,
      loading,
      error,
      isOffline,
      refreshProducts,
      retryFetchProducts,
      addProduct,
      updateProduct: updateProductState,
      deleteProduct: deleteProductState,
      getProductById: getProductByIdState,
      getProductBySlug: getProductBySlugState
    }}>
      {children}
    </ProductContext.Provider>
  );
};
