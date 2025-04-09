
import React from 'react';
import { AsaasContext } from './AsaasContext';
import { useAsaasProvider } from './hooks/useAsaasProvider';

export const AsaasProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { settings, loading, saveSettings, updateSettings } = useAsaasProvider();

  return (
    <AsaasContext.Provider value={{ settings, loading, saveSettings, updateSettings }}>
      {children}
    </AsaasContext.Provider>
  );
};
