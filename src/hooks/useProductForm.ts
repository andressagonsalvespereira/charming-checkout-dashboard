
import { useState } from 'react';
import { CreateProductInput } from '@/types/product';

const initialFormData: CreateProductInput = {
  name: '',
  description: '',
  price: 0,
  image_url: '',
  is_digital: false,
  override_global_status: false,
  custom_manual_status: 'ANALYSIS'
};

export const useProductForm = () => {
  const [formData, setFormData] = useState<CreateProductInput>({ ...initialFormData });
  
  const resetForm = () => {
    setFormData({ ...initialFormData });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for price to ensure it's a number
    if (name === 'price') {
      const numericValue = value === '' ? 0 : Number(value);
      if (!isNaN(numericValue)) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, is_digital: checked }));
  };

  const handleUseCustomProcessingChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, override_global_status: checked }));
  };

  const handleManualCardStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, custom_manual_status: value }));
  };

  return {
    formData,
    setFormData,
    resetForm,
    handleInputChange,
    handleSwitchChange,
    handleUseCustomProcessingChange,
    handleManualCardStatusChange
  };
};
