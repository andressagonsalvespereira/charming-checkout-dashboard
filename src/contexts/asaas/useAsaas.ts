
import { useContext } from 'react';
import { AsaasContext } from './AsaasContext';
import { AsaasContextType } from './types';

export const useAsaas = (): AsaasContextType => {
  const context = useContext(AsaasContext);
  if (context === undefined) {
    throw new Error('useAsaas must be used within an AsaasProvider');
  }
  return context;
};
