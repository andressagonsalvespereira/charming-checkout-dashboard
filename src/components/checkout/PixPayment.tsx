import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { QrCode, ClipboardCopy, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { useAsaas } from '@/contexts/asaas';

interface PixPaymentProps {
  onPaymentSuccess: (paymentId: string) => void;
  onPaymentError: (error: string) => void;
  value: number;
  customerName: string;
  customerCpfCnpj: string;
  customerEmail: string;
  description: string;
}

const PixPayment: React.FC<PixPaymentProps> = ({ 
  onPaymentSuccess, 
  onPaymentError,
  value,
  customerName,
  customerCpfCnpj,
  customerEmail,
  description
}) => {
  const [pixCode, setPixCode] = useState<string | null>(null);
  const [qrCodeImage, setQrCodeImage] = useState<string | null>(null);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [copied, setCopied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { settings } = useAsaas();

  useEffect(() => {
    const processPixPayment = async () => {
      setLoading(true);
      setError(null);
      try {
        // 1. Create customer
        const customerData = {
          name: customerName,
          cpfCnpj: customerCpfCnpj,
          email: customerEmail,
        };

        // 2. Create payment
        const paymentData = {
          customer: customerName,
          billingType: 'PIX',
          value: value,
          description: description,
        };

        // 3. Call the payment processing function
        const response = await fetch('/api/asaas/process-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ customerData, paymentData, settings }),
        });

        const result = await response.json();

        if (result.success) {
          setPaymentId(result.paymentId);
          setPixCode(result.pixQrCode);
          setQrCodeImage(result.pixQrCodeImage);
          onPaymentSuccess(result.paymentId);
        } else {
          setError(result.error || 'Erro ao processar pagamento via PIX.');
          onPaymentError(result.error || 'Erro ao processar pagamento via PIX.');
        }
      } catch (err: any) {
        setError(err.message || 'Erro ao processar pagamento.');
        onPaymentError(err.message || 'Erro ao processar pagamento.');
      } finally {
        setLoading(false);
      }
    };

    processPixPayment();
  }, [customerCpfCnpj, customerEmail, customerName, description, onPaymentError, onPaymentSuccess, settings, value]);

  const handleCopyCode = () => {
    if (pixCode) {
      navigator.clipboard.writeText(pixCode);
      setCopied(true);
      toast({
        title: "Código PIX copiado!",
        description: "O código PIX foi copiado para a área de transferência.",
      });
      setTimeout(() => setCopied(false), 3000);
    }
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
        {loading ? (
          <>
            <Skeleton className="w-48 h-48 rounded-md mb-4" />
            <Skeleton className="w-64 h-8 rounded-md" />
          </>
        ) : error ? (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erro</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : qrCodeImage && pixCode ? (
          <>
            <img src={qrCodeImage} alt="QR Code PIX" className="w-48 h-48 rounded-md mb-4" />
            <Button variant="outline" className="mb-2 relative" onClick={handleCopyCode} disabled={copied}>
              {copied ? (
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
          </>
        ) : (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Aguardando a geração do código PIX...
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
      {paymentId && (
        <CardFooter className="flex justify-end">
          <Button onClick={() => window.open(`https://app.asaas.com/assinatura/checkout/${paymentId}`, '_blank')}>
            Ver Detalhes da Fatura
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default PixPayment;
