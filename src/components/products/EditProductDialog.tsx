
import React from 'react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, 
  DialogContent, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { CreateProductInput } from '@/types/product';
import ProductForm from './ProductForm';

interface EditProductDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  formData: CreateProductInput;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSwitchChange: (checked: boolean) => void;
  handleUseCustomProcessingChange?: (checked: boolean) => void;
  handleManualCardStatusChange?: (value: string) => void;
  handleUpdateProduct: () => void;
}

const EditProductDialog = ({
  isOpen,
  setIsOpen,
  formData,
  handleInputChange,
  handleSwitchChange,
  handleUseCustomProcessingChange,
  handleManualCardStatusChange,
  handleUpdateProduct
}: EditProductDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
          <DialogDescription>
            Update the details of the existing product in your catalog.
          </DialogDescription>
        </DialogHeader>
        <ProductForm 
          formData={formData}
          handleInputChange={handleInputChange}
          handleSwitchChange={handleSwitchChange}
          handleUseCustomProcessingChange={handleUseCustomProcessingChange}
          handleManualCardStatusChange={handleManualCardStatusChange}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)}>Cancel</Button>
          <Button 
            className="bg-blue-600 hover:bg-blue-700 text-white" 
            onClick={handleUpdateProduct}
          >
            Update Product
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditProductDialog;
