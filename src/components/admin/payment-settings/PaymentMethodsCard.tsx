
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { QrCode, AlertCircle as AlertCircleIcon } from 'lucide-react';
import { AsaasSettings } from '@/types/asaas';

interface PaymentMethodsCardProps {
  formState: AsaasSettings;
  loading: boolean;
  onUpdateFormState: (updater: (prev: AsaasSettings) => AsaasSettings) => void;
}

const PaymentMethodsCard: React.FC<PaymentMethodsCardProps> = ({
  formState,
  loading,
  onUpdateFormState,
}) => {
  const isPaymentConfigEnabled = formState.isEnabled || formState.manualPaymentConfig;

  return (
    <Card className="shadow-sm">
      <CardHeader>
        <CardTitle>Configurações de PIX (Asaas)</CardTitle>
        <CardDescription>
          Configure as opções de pagamento PIX através da integração com Asaas
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!isPaymentConfigEnabled && (
          <Alert variant="warning" className="bg-amber-50 border-amber-200">
            <AlertCircleIcon className="h-4 w-4 text-amber-600" />
            <AlertDescription className="text-amber-800">
              Ative a integração com o Asaas para configurar pagamentos com PIX.
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex items-start space-x-3">
          <Checkbox
            id="pix"
            checked={formState.allowPix}
            onCheckedChange={(checked) => 
              onUpdateFormState(prev => ({ ...prev, allowPix: !!checked }))
            }
            disabled={loading || !isPaymentConfigEnabled}
          />
          <div className="grid gap-1.5">
            <Label
              htmlFor="pix"
              className="text-base font-medium leading-none flex items-center"
            >
              <QrCode className="mr-2 h-4 w-4 text-green-600" />
              Pagamentos via PIX
            </Label>
            <p className="text-sm text-muted-foreground">
              Permitir que os clientes paguem usando PIX
            </p>
          </div>
        </div>
        
        {/* Manual PIX Processing Option */}
        {formState.allowPix && (
          <div className="mt-4 pl-8 border-l-2 border-gray-200">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-base">Página de PIX Manual</Label>
                <p className="text-sm text-muted-foreground">
                  Ativar página de PIX manual para que os clientes possam copiar o código e pagar por fora do sistema
                </p>
              </div>
              <Switch
                checked={formState.manualPixPage || false}
                onCheckedChange={(checked) => 
                  onUpdateFormState(prev => ({ ...prev, manualPixPage: checked }))
                }
                disabled={loading || !isPaymentConfigEnabled || !formState.allowPix}
              />
            </div>
          </div>
        )}
        
        {(!formState.allowPix && isPaymentConfigEnabled) && (
          <Alert variant="destructive">
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Aviso</AlertTitle>
            <AlertDescription>
              Se o PIX não estiver habilitado, os clientes só poderão pagar usando cartão de crédito.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};

export default PaymentMethodsCard;
