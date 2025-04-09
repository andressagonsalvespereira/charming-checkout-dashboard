
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useFormContext } from 'react-hook-form';
import { Key } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { AsaasSettings } from '@/types/asaas';
import { PaymentSettingsFormValues } from '../utils/formUtils';
import { logger } from '@/utils/logger';

interface ApiKeysCardProps {
  formState: AsaasSettings;
  onUpdateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void;
}

const ApiKeysCard: React.FC<ApiKeysCardProps> = ({
  formState,
  onUpdateFormState,
}) => {
  const form = useFormContext<PaymentSettingsFormValues>();
  
  const handleSandboxKeyChange = (value: string) => {
    logger.log('Sandbox API key changed:', value ? '[VALUE SET]' : '[EMPTY]');
    onUpdateFormState(prev => ({
      ...prev,
      sandboxApiKey: value,
      apiKey: prev.sandboxMode ? value : prev.apiKey
    }));
  };
  
  const handleProductionKeyChange = (value: string) => {
    logger.log('Production API key changed:', value ? '[VALUE SET]' : '[EMPTY]');
    onUpdateFormState(prev => ({
      ...prev,
      productionApiKey: value,
      apiKey: !prev.sandboxMode ? value : prev.apiKey
    }));
  };

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Key className="mr-2 h-5 w-5 text-yellow-600" />
          Chaves de API
        </CardTitle>
        <CardDescription>
          Configure as chaves de API para integração com o Asaas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!formState.isEnabled && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <InfoCircledIcon className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Ative a integração com o Asaas para configurar as chaves de API.
            </AlertDescription>
          </Alert>
        )}

        <FormField
          control={form.control}
          name="sandboxApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave de API do Sandbox</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Informe a chave de API de teste"
                  disabled={!formState.isEnabled || !formState.sandboxMode}
                  type="password"
                  onChange={(e) => {
                    field.onChange(e);
                    handleSandboxKeyChange(e.target.value);
                  }}
                  data-testid="sandbox-api-key"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="productionApiKey"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chave de API de Produção</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder="Informe a chave de API de produção"
                  disabled={!formState.isEnabled || formState.sandboxMode}
                  type="password"
                  onChange={(e) => {
                    field.onChange(e);
                    handleProductionKeyChange(e.target.value);
                  }}
                  data-testid="production-api-key"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </CardContent>
    </Card>
  );
};

export default ApiKeysCard;
