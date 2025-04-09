
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, ClipboardCopy, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAsaas } from '@/contexts/asaas';

interface PixPaymentProps {
  qrCode?: string | null;
  qrCodeImage?: string | null;
  expirationDate?: string | null;
  onCopyCode: () => void;
  isCopied: boolean;
  isProcessing: boolean;
  paymentError: string | null;
  onRetry: () => void;
}

const PixPayment: React.FC<PixPaymentProps> = ({
  qrCode,
  qrCodeImage,
  expirationDate,
  onCopyCode,
  isCopied,
  isProcessing,
  paymentError,
  onRetry
}) => {
  const { toast } = useToast();
  const { settings } = useAsaas();
  const [showFullQrCode, setShowFullQrCode] = useState(false);

  const handleCopyCode = () => {
    if (qrCode) {
      navigator.clipboard.writeText(qrCode);
      onCopyCode();
      toast({
        title: "Código copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      });
    }
  };

  const toggleQrCodeLength = () => {
    setShowFullQrCode(!showFullQrCode);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pagamento com PIX</CardTitle>
        <CardDescription>
          Escaneie o código QR ou copie o código PIX para pagar.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        {isProcessing ? (
          <>
            <Skeleton className="w-48 h-48 rounded-md mb-4" />
            <p className="text-sm text-muted-foreground">
              Gerando código PIX... aguarde um momento.
            </p>
          </>
        ) : paymentError ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro no pagamento</AlertTitle>
            <AlertDescription>
              {paymentError}
              <Button variant="link" onClick={onRetry}>Tentar novamente</Button>
            </AlertDescription>
          </Alert>
        ) : qrCodeImage && qrCode ? (
          <>
            <div className="w-48 h-48 mb-4">
              <img src={qrCodeImage} alt="QR Code PIX" className="rounded-md" />
            </div>
            <p className="text-sm text-muted-foreground mb-2">
              Vencimento: {expirationDate}
            </p>
            <Button variant="outline" className="mb-2" onClick={handleCopyCode} disabled={isCopied}>
              {isCopied ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <ClipboardCopy className="mr-2 h-4 w-4" />
                  Copiar Código PIX
                </>
              )}
            </Button>
            <Button variant="secondary" onClick={toggleQrCodeLength}>
              Mostrar Código {showFullQrCode ? "Curto" : "Completo"}
            </Button>
            {qrCode && (
              <textarea
                value={qrCode}
                readOnly
                rows={showFullQrCode ? 5 : 2}
                className="w-full mt-2 p-2 border rounded-md text-xs text-muted-foreground"
              />
            )}
          </>
        ) : (
          <Alert variant="warning">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aguardando a geração do código PIX...
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        {settings?.manualPixPage && (
          <Button>
            Enviar comprovante
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default PixPayment;
