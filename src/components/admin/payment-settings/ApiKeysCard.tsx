
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Eye, EyeOff, AlertCircle as AlertCircleIcon, Key } from 'lucide-react';
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';

interface ApiKeysCardProps {
  formState: AsaasSettings;
  onUpdateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void;
}

const ApiKeysCard: React.FC<ApiKeysCardProps> = ({
  formState,
  onUpdateFormState,
}) => {
  const [showSandboxKey, setShowSandboxKey] = useState(false);
  const [showProductionKey, setShowProductionKey] = useState(false);
  const [sandboxApiKey, setSandboxApiKey] = useState(formState.sandboxApiKey || '');
  const [productionApiKey, setProductionApiKey] = useState(formState.productionApiKey || '');

  // Update local state when form state changes
  useEffect(() => {
    logger.log('ApiKeysCard received updated formState', {
      sandboxApiKey: formState.sandboxApiKey ? '[PRESENT]' : '[EMPTY]',
      productionApiKey: formState.productionApiKey ? '[PRESENT]' : '[EMPTY]'
    });
    
    if (formState.sandboxApiKey !== sandboxApiKey) {
      setSandboxApiKey(formState.sandboxApiKey || '');
    }
    
    if (formState.productionApiKey !== productionApiKey) {
      setProductionApiKey(formState.productionApiKey || '');
    }
  }, [formState.sandboxApiKey, formState.productionApiKey]);

  const handleSandboxKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSandboxApiKey(value);
    
    // Log a sanitized version of the key for debugging
    const previewKey = value ? `${value.substring(0, 5)}...` : 'empty';
    logger.log('Sandbox API key changed to:', previewKey);
    
    // Update form state with the new key
    onUpdateFormState(prev => {
      logger.log('Updating formState with new sandbox key');
      return { ...prev, sandboxApiKey: value };
    });
  };

  const handleProductionKeyChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setProductionApiKey(value);
    
    // Log a sanitized version of the key for debugging
    const previewKey = value ? `${value.substring(0, 5)}...` : 'empty';
    logger.log('Production API key changed to:', previewKey);
    
    // Update form state with the new key
    onUpdateFormState(prev => {
      logger.log('Updating formState with new production key');
      return { ...prev, productionApiKey: value };
    });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="mr-2 h-5 w-5" />
          Chaves de API do Asaas
        </CardTitle>
        <CardDescription>
          Configure suas chaves de API para os ambientes de sandbox e produção
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!formState.isEnabled && (
          <Alert className="bg-amber-50 border-amber-200">
            <AlertCircleIcon className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Ative a integração com o Asaas na aba Configurações Gerais para utilizar as chaves de API.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="sandbox-key">Chave API Sandbox</Label>
            <div className="flex">
              <Input
                id="sandbox-key"
                type={showSandboxKey ? "text" : "password"}
                placeholder="Digite a chave de API para ambiente sandbox"
                value={sandboxApiKey}
                onChange={handleSandboxKeyChange}
                disabled={!formState.isEnabled || !formState.sandboxMode}
                className="rounded-r-none"
              />
              <Button
                type="button"
                onClick={() => setShowSandboxKey(!showSandboxKey)}
                variant="outline"
                className="rounded-l-none border-l-0"
                disabled={!formState.isEnabled || !formState.sandboxMode}
              >
                {showSandboxKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Use esta chave para testes no ambiente sandbox
            </p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="production-key">Chave API Produção</Label>
            <div className="flex">
              <Input
                id="production-key"
                type={showProductionKey ? "text" : "password"}
                placeholder="Digite a chave de API para ambiente de produção"
                value={productionApiKey}
                onChange={handleProductionKeyChange}
                disabled={!formState.isEnabled || formState.sandboxMode}
                className="rounded-r-none"
              />
              <Button
                type="button"
                onClick={() => setShowProductionKey(!showProductionKey)}
                variant="outline"
                className="rounded-l-none border-l-0"
                disabled={!formState.isEnabled || formState.sandboxMode}
              >
                {showProductionKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <p className="text-sm text-muted-foreground">
              Use esta chave para processar pagamentos reais no ambiente de produção
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ApiKeysCard;
