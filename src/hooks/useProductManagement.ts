
import { useState, useEffect } from 'react';
import { useProducts } from '@/contexts/product';
import { Product, CreateProductInput } from '@/types/product';
import { useProductForm } from './useProductForm';
import { useProductDialogs } from './useProductDialogs';
import { useProductPagination } from './useProductPagination';
import { useToast } from '@/hooks/use-toast';

export const useProductManagement = () => {
  const { 
    products, 
    loading, 
    error,
    isOffline,
    addProduct,
    updateProduct,
    deleteProduct,
    refreshProducts
  } = useProducts();

  const { toast } = useToast();

  const { 
    formData, 
    setFormData, 
    resetForm,
    handleInputChange,
    handleSwitchChange,
    handleUseCustomProcessingChange,
    handleManualCardStatusChange
  } = useProductForm();

  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingProduct,
    setEditingProduct,
    productToDelete,
    setProductToDelete
  } = useProductDialogs();

  const {
    currentPage,
    pageSize,
    handlePageChange
  } = useProductPagination(products.length);

  // Handle edit button click
  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image_url: product.image_url || '',
      is_digital: product.is_digital || false,
      override_global_status: product.override_global_status || false,
      custom_manual_status: product.custom_manual_status || 'ANALYSIS'
    });
    setIsEditDialogOpen(true);
  };

  // Handle delete button click
  const handleDeleteClick = (product: Product) => {
    setProductToDelete(product);
    setIsDeleteDialogOpen(true);
  };

  // Handlers for CRUD operations
  const handleAddProduct = async () => {
    try {
      await addProduct(formData);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
      resetForm();
      setIsAddDialogOpen(false);
      refreshProducts();
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;
    
    try {
      await updateProduct(editingProduct.id, formData);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      refreshProducts();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async () => {
    if (!productToDelete) return;
    
    try {
      await deleteProduct(productToDelete.id);
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
      setIsDeleteDialogOpen(false);
      setProductToDelete(null);
      refreshProducts();
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  return {
    // Product state
    products,
    loading,
    error,
    isOffline,
    
    // Form state
    formData,
    handleInputChange,
    handleSwitchChange,
    handleUseCustomProcessingChange,
    handleManualCardStatusChange,
    resetForm,
    
    // Dialog state
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    editingProduct,
    productToDelete,
    
    // Action handlers
    handleAddProduct,
    handleEditClick,
    handleDeleteClick,
    handleUpdateProduct,
    handleDeleteProduct,
    refreshProducts,
    
    // Pagination
    currentPage,
    pageSize,
    handlePageChange
  };
};
