
import React, { useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { useAsaas } from '@/contexts/AsaasContext';
import CheckoutContainer from '@/components/checkout/CheckoutContainer';
import CheckoutForm from '@/components/checkout/CheckoutForm';
import PixPayment from '@/components/checkout/PixPayment';
import { useQuickCheckout } from '@/hooks/useQuickCheckout';
import CustomerForm from '@/components/checkout/quick-checkout/CustomerForm';
import PaymentMethodSelector from '@/components/checkout/quick-checkout/PaymentMethodSelector';
import OrderSuccessMessage from '@/components/checkout/quick-checkout/OrderSuccessMessage';
import ProductSummary from '@/components/checkout/quick-checkout/ProductSummary';
import ProductNotFound from '@/components/checkout/quick-checkout/ProductNotFound';
import { useProductCheckout } from '@/hooks/useProductCheckout';
import { useProducts } from '@/contexts/product/useProducts';
import { useToast } from '@/hooks/use-toast';
import CheckoutProgress from '@/components/checkout/CheckoutProgress';
import { ManualCardStatus } from '@/types/asaas';
import { CustomerInfo } from '@/hooks/checkout/useCustomerInfo';

// Quick adapter to convert CustomerInfo to CustomerData expected by PixPayment
interface CustomerData {
  name: string;
  email: string;
  phone: string;
  document: string;
}

const QuickCheckout = () => {
  const { productId } = useParams<{ productId: string }>();
  const { settings } = useAsaas();
  const { products } = useProducts();
  const location = useLocation();
  const { toast } = useToast();
  
  console.log(`QuickCheckout - Current route: ${location.pathname}`);
  console.log(`QuickCheckout - Starting with productId: ${productId}`);
  console.log('QuickCheckout - Available products:', products);
  
  // Display products slugs for debugging
  useEffect(() => {
    if (products && products.length > 0) {
      console.log('QuickCheckout - Available product slugs:');
      products.forEach(p => console.log(`- ${p.slug} (ID: ${p.id})`));
    }
  }, [products]);
  
  // Using useProductCheckout for improved slug-based product fetching
  const {
    product,
    loading,
    productNotFound
  } = useProductCheckout(productId);
  
  useEffect(() => {
    console.log('QuickCheckout - Loading status:', loading);
    console.log('QuickCheckout - Product found:', product);
    console.log('QuickCheckout - Product not found:', productNotFound);
    
    if (productNotFound) {
      toast({
        title: "Product not found",
        description: `Could not find product with identifier "${productId}".`,
        variant: "destructive",
      });
    }
  }, [product, loading, productNotFound, productId, toast]);
  
  const {
    paymentMethod,
    setPaymentMethod,
    customerDetails,
    setCustomerDetails,
    isOrderSubmitted,
    handleSubmitCustomerInfo,
    handlePaymentSubmit
  } = useQuickCheckout(productId, product);
  
  if (loading) {
    return (
      <CheckoutContainer>
        <div className="flex justify-center items-center min-h-[300px]">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          <span className="ml-2">Loading product data...</span>
        </div>
      </CheckoutContainer>
    );
  }
  
  if (!product || productNotFound) {
    console.log(`QuickCheckout - Showing product not found screen for slug: ${productId}`);
    return (
      <CheckoutContainer>
        <ProductNotFound slug={productId} />
      </CheckoutContainer>
    );
  }
  
  // Make sure we're using the correct limited set of payment methods
  const safePaymentMethod = paymentMethod === 'PIX' ? 'PIX' : 'CREDIT_CARD';
  
  // Convert CustomerInfo to CustomerData for PixPayment component
  const customerData: CustomerData = {
    name: customerDetails.name,
    email: customerDetails.email, 
    phone: customerDetails.phone || '',
    document: customerDetails.document
  };
  
  return (
    <CheckoutContainer>
      <Card className="mb-6 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle>Quick Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          {product && <ProductSummary product={product} />}
          
          {!customerDetails.name ? (
            <CustomerForm 
              customerDetails={customerDetails}
              setCustomerDetails={setCustomerDetails}
              onSubmit={handleSubmitCustomerInfo}
            />
          ) : !isOrderSubmitted ? (
            <div className="space-y-4">
              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold mb-3">Payment Method</h3>
                
                <PaymentMethodSelector 
                  paymentMethod={safePaymentMethod}
                  setPaymentMethod={setPaymentMethod}
                  settings={settings}
                />
                
                {safePaymentMethod === 'CREDIT_CARD' && (
                  <CheckoutForm 
                    onSubmit={handlePaymentSubmit} 
                    isSandbox={settings.sandboxMode}
                    isDigitalProduct={Boolean(product.digital || product.is_digital)}
                    useCustomProcessing={Boolean(product.usarProcessamentoPersonalizado || product.override_global_status)}
                    manualCardStatus={(product.statusCartaoManual || product.custom_manual_status) as ManualCardStatus}
                  />
                )}
                
                {safePaymentMethod === 'PIX' && (
                  <PixPayment 
                    onSubmit={handlePaymentSubmit}
                    isSandbox={settings.sandboxMode}
                    isDigitalProduct={Boolean(product.digital || product.is_digital)}
                    customerData={customerData}
                  />
                )}
              </div>
            </div>
          ) : (
            <OrderSuccessMessage paymentMethod={safePaymentMethod} />
          )}
        </CardContent>
      </Card>
    </CheckoutContainer>
  );
};

export default QuickCheckout;
