
import { useState } from 'react';
import { CriarProdutoInput } from '@/types/product';

const initialFormData: CriarProdutoInput = {
  nome: '',
  descricao: '',
  preco: 0,
  urlImagem: '',
  digital: false,
  usarProcessamentoPersonalizado: false,
  statusCartaoManual: 'ANALYSIS'
};

export const useProductForm = () => {
  const [formData, setFormData] = useState<CriarProdutoInput>({ ...initialFormData });
  
  const resetForm = () => {
    setFormData({ ...initialFormData });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Special handling for price to ensure it's a number
    if (name === 'preco') {
      const numericValue = value === '' ? 0 : Number(value);
      if (!isNaN(numericValue)) {
        setFormData(prev => ({ ...prev, [name]: numericValue }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, digital: checked }));
  };

  const handleUseCustomProcessingChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, usarProcessamentoPersonalizado: checked }));
  };

  const handleManualCardStatusChange = (value: string) => {
    setFormData(prev => ({ ...prev, statusCartaoManual: value }));
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
