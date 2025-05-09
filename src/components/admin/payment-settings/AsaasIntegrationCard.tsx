
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { QrCode } from 'lucide-react';
import { AsaasSettings } from '@/types/asaas';
import { logger } from '@/utils/logger';

interface AsaasIntegrationCardProps {
  formState: AsaasSettings;
  loading: boolean;
  onUpdateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void;
}

const AsaasIntegrationCard: React.FC<AsaasIntegrationCardProps> = ({
  formState,
  loading,
  onUpdateFormState,
}) => {
  const handleToggleEnable = (checked: boolean) => {
    logger.log('AsaasIntegrationCard - Toggling isEnabled to:', checked);
    onUpdateFormState(prev => ({ ...prev, isEnabled: checked }));
  };

  const handleToggleSandboxMode = (checked: boolean) => {
    logger.log('AsaasIntegrationCard - Toggling sandboxMode to:', checked);
    onUpdateFormState(prev => ({ ...prev, sandboxMode: checked }));
  };

  return (
    <Card className="shadow-sm" data-testid="asaas-integration-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="mr-2 h-5 w-5 text-green-600" />
          Integração com Asaas
        </CardTitle>
        <CardDescription>
          Configure a integração com o Asaas para processamento de pagamentos PIX
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Ativar Integração com Asaas</Label>
            <p className="text-sm text-muted-foreground">
              Ative para habilitar o processamento de pagamentos PIX através do Asaas
            </p>
          </div>
          <Switch
            checked={Boolean(formState.isEnabled)}
            onCheckedChange={handleToggleEnable}
            disabled={loading}
            data-testid="asaas-integration-toggle"
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label className="text-base">Modo Sandbox</Label>
            <p className="text-sm text-muted-foreground">
              Use o sandbox do Asaas para testes (não processa pagamentos reais)
            </p>
          </div>
          <Switch
            checked={Boolean(formState.sandboxMode)}
            onCheckedChange={handleToggleSandboxMode}
            disabled={loading || !formState.isEnabled}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default AsaasIntegrationCard;
