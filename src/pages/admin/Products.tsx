
import React, { useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import AdminLayout from '@/components/layout/AdminLayout';
import ProductTable from '@/components/products/ProductTable';
import AddProductDialog from '@/components/products/AddProductDialog';
import EditProductDialog from '@/components/products/EditProductDialog';
import ProductHeader from '@/components/products/ProductHeader';
import DeleteProductDialog from '@/components/products/DeleteProductDialog';
import { useProductManagement } from '@/hooks/useProductManagement';

const Products: React.FC = () => {
  const {
    isAddDialogOpen,
    setIsAddDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    productToDelete,
    formData,
    products,
    loading,
    error,
    isOffline,
    handleInputChange,
    handleSwitchChange,
    handleUseCustomProcessingChange,
    handleManualCardStatusChange,
    handleAddProduct,
    handleEditClick,
    handleDeleteClick,
    handleUpdateProduct,
    handleDeleteProduct,
    // Pagination props
    currentPage,
    pageSize,
    handlePageChange
  } = useProductManagement();
  
  // Logging for debugging
  useEffect(() => {
    console.log('Products page mounted, initial state:', { 
      productsCount: products.length,
      loading, 
      error 
    });
    
    return () => {
      console.log('Products page unmounted');
    };
  }, []);
  
  // Log to monitor changes in loading state
  useEffect(() => {
    console.log('Loading state updated:', { loading, error, productsCount: products.length });
  }, [loading, error, products.length]);
  
  return (
    <AdminLayout>
      <div className="container py-6">
        <Card className="shadow-md">
          <ProductHeader onAddProduct={() => setIsAddDialogOpen(true)} />
          <CardContent className="pt-6">
            <ProductTable 
              products={products}
              loading={loading}
              error={error}
              onEdit={handleEditClick}
              onDelete={handleDeleteClick}
              currentPage={currentPage}
              pageSize={pageSize}
              totalProducts={products.length}
              onPageChange={handlePageChange}
            />
          </CardContent>
        </Card>
        
        {isOffline && (
          <div className="mt-4 p-4 bg-amber-50 rounded-md border border-amber-200 text-amber-800">
            <p className="text-sm">
              You are working in offline mode. Changes will be saved locally 
              and synchronized when your connection is restored.
            </p>
          </div>
        )}
      </div>

      <AddProductDialog
        isOpen={isAddDialogOpen}
        setIsOpen={setIsAddDialogOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSwitchChange={handleSwitchChange}
        handleUseCustomProcessingChange={handleUseCustomProcessingChange}
        handleManualCardStatusChange={handleManualCardStatusChange}
        handleAddProduct={handleAddProduct}
      />

      <EditProductDialog
        isOpen={isEditDialogOpen}
        setIsOpen={setIsEditDialogOpen}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSwitchChange={handleSwitchChange}
        handleUseCustomProcessingChange={handleUseCustomProcessingChange}
        handleManualCardStatusChange={handleManualCardStatusChange}
        handleUpdateProduct={handleUpdateProduct}
      />

      {productToDelete && (
        <DeleteProductDialog
          isOpen={isDeleteDialogOpen}
          setIsOpen={setIsDeleteDialogOpen}
          productName={productToDelete.name}
          onConfirm={handleDeleteProduct}
        />
      )}
    </AdminLayout>
  );
};

export default Products;
