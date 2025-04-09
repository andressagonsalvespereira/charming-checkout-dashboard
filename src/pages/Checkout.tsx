
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

const Checkout = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const navigate = useNavigate();
  const { product, loading, error } = useProductLoader(productSlug);
  const { settings } = useAsaas();
  const [isCheckoutEnabled, setIsCheckoutEnabled] = useState(false);

  useEffect(() => {
    if (settings) {
      setIsCheckoutEnabled(settings.isEnabled || settings.manualPaymentConfig);
    }
  }, [settings]);

  if (loading) {
    return (
      <CheckoutLayout>
        <p>Carregando...</p>
      </CheckoutLayout>
    );
  }

  if (error || !product) {
    return (
      <CheckoutLayout>
        <ProductNotFound />
      </CheckoutLayout>
    );
  }

  return (
    <CheckoutLayout>
      <CheckoutHeader />
      <CheckoutContainer>
        {isCheckoutEnabled ? (
          <CheckoutForm />
        ) : (
          <div>
            <p>O checkout está desabilitado. Por favor, entre em contato com o administrador.</p>
          </div>
        )}
        <ProductDetails slug={productSlug} />
      </CheckoutContainer>
    </CheckoutLayout>
  );
};

export default Checkout;
