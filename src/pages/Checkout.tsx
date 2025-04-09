
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CheckoutLayout from '@/components/checkout/CheckoutLayout';
import CheckoutHeader from '@/components/checkout/CheckoutHeader';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import ProductDetails from '@/components/checkout/ProductDetails';
import ProductNotFound from '@/components/checkout/quick-checkout/ProductNotFound';
import { useProductLoader } from '@/hooks/checkout/useProductLoader';
import { useAsaas } from '@/contexts/asaas';
import { useCheckoutCustomization } from '@/contexts/CheckoutCustomizationContext';
import { logger } from '@/utils/logger';

const Checkout = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const { product, loading } = useProductLoader(productSlug);
  const { settings } = useAsaas();
  const { customization } = useCheckoutCustomization();
  const [isCheckoutEnabled, setIsCheckoutEnabled] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (settings) {
      setIsCheckoutEnabled(settings.isEnabled || settings.manualPaymentConfig);
    }
  }, [settings]);

  // Handle form submission
  const handlePayment = async (paymentData: any) => {
    logger.log("Payment processed:", paymentData);
    // Redirect to success page or confirmation page
    navigate('/payment-success', { state: { paymentData } });
  };

  if (loading) {
    return (
      <CheckoutLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-lg">Carregando produto...</p>
        </div>
      </CheckoutLayout>
    );
  }

  if (!product) {
    return (
      <CheckoutLayout>
        <ProductNotFound />
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout>
      <CheckoutHeader customization={customization} />
      <CheckoutContainer>
        {isCheckoutEnabled ? (
          <div className="flex flex-col space-y-6">
            <CheckoutForm 
              onSubmit={handlePayment}
              isSandbox={settings?.sandboxMode || false}
              isDigitalProduct={product.is_digital || false}
            />
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
                {error}
              </div>
            )}
          </div>
        ) : (
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded-md">
            <p>O checkout está desabilitado. Por favor, entre em contato com o administrador.</p>
          </div>
        )}
        
        {product && (
          <div className="mt-6 border-t pt-6">
            <h2 className="text-lg font-semibold mb-4">Detalhes do Produto</h2>
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-bold text-xl">{product.name}</h3>
              <p className="text-lg font-semibold text-green-600">
                R$ {(product.price || 0).toFixed(2)}
              </p>
              <p className="mt-2 text-gray-600">{product.description}</p>
            </div>
          </div>
        )}
      </CheckoutContainer>
    </CheckoutLayout>
  );
};

export default Checkout;
