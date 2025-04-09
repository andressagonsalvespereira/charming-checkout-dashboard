
import { useCallback } from 'react';
import { useProducts } from '@/contexts/ProductContext';
import { useToast } from '@/hooks/use-toast';
import { Product, CriarProdutoInput } from '@/types/product';

/**
 * Hook for product CRUD operations
 */
export const useProductOperations = () => {
  const { toast: showNotification } = useToast();
  const { 
    addProduct: addProductContext, 
    updateProduct: updateProductContext, 
    deleteProduct: deleteProductContext,
    refreshProducts: refreshProductsContext
  } = useProducts();

  const handleAdicionarProduto = async (formData: CriarProdutoInput) => {
    try {
      // Transform statusCartaoManual to custom_manual_status for backend compatibility
      const productData = {
        ...formData,
        custom_manual_status: formData.statusCartaoManual,
        override_global_status: formData.usarProcessamentoPersonalizado
      };
      
      const newProduct = await addProductContext(productData);
      showNotification({
        title: "Success",
        description: "Product added successfully",
      });
      return true;
    } catch (error) {
      console.error('Error adding product:', error);
      showNotification({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleAtualizarProduto = async (id: number | string, formData: CriarProdutoInput) => {
    try {
      // Transform statusCartaoManual to custom_manual_status for backend compatibility
      const productData = {
        ...formData,
        custom_manual_status: formData.statusCartaoManual,
        override_global_status: formData.usarProcessamentoPersonalizado
      };
      
      await updateProductContext(id, productData);
      showNotification({
        title: "Success",
        description: "Product updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      showNotification({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleRemoverProduto = async (id: number | string) => {
    try {
      await deleteProductContext(id);
      showNotification({
        title: "Success",
        description: "Product removed successfully",
      });
      return true;
    } catch (error) {
      console.error('Error removing product:', error);
      showNotification({
        title: "Error",
        description: "Failed to remove product",
        variant: "destructive",
      });
      return false;
    }
  };

  return {
    handleAdicionarProduto,
    handleAtualizarProduto,
    handleRemoverProduto,
    atualizarProdutos: refreshProductsContext
  };
};
