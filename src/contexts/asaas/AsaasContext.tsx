
import { createContext } from 'react';
import { AsaasContextType, defaultAsaasSettings } from './types';

// Create the context with a default value
export const AsaasContext = createContext<AsaasContextType | undefined>(undefined);

// Set a displayName for better debugging
AsaasContext.displayName = 'AsaasContext';
