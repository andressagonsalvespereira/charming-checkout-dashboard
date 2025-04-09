
import React, { useMemo, useCallback } from 'react';
import { ProductContext } from './ProductContext';
import { ProductProviderProps } from './productContextTypes';
import { useProductFetching } from './hooks/useProductFetching';
import { useProductOperations } from './hooks/useProductOperations';

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  // Debug log to track component mounting
  React.useEffect(() => {
    console.log('ProductProvider mounted');
    return () => console.log('ProductProvider unmounted');
  }, []);

  const {
    products,
    setProducts,
    loading,
    error,
    networkError: isOffline,
    retryFetchProducts
  } = useProductFetching();

  // Memoize the props for the useProductOperations hook
  const productOperationsProps = useMemo(() => ({
    products,
    setProducts,
    isOffline
  }), [products, setProducts, isOffline]);

  const {
    addProduct,
    editProduct,
    removeProduct,
    getProductById,
    getProductBySlug
  } = useProductOperations(productOperationsProps);

  // Memoize the context value to avoid unnecessary re-renders
  const contextValue = useMemo(() => ({
    products, 
    loading, 
    error, 
    addProduct, 
    updateProduct: editProduct, 
    deleteProduct: removeProduct,
    getProductById,
    getProductBySlug,
    refreshProducts: retryFetchProducts,
    retryFetchProducts,
    isOffline
  }), [
    products, 
    loading, 
    error, 
    addProduct, 
    editProduct, 
    removeProduct,
    getProductById,
    getProductBySlug,
    retryFetchProducts,
    isOffline
  ]);

  return (
    <ProductContext.Provider value={contextValue}>
      {children}
    </ProductContext.Provider>
  );
};
