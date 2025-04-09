import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Index from './pages/Index';
import NotFound from './pages/NotFound';
import Checkout from './pages/Checkout';
import PaymentSuccess from './pages/PaymentSuccess';
import PaymentFailed from './pages/PaymentFailed';
import PixPaymentManual from './pages/PixPaymentManual';

// Admin Pages
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';
import PaymentSettings from './pages/admin/PaymentSettings';
import ManualPaymentSettingsPage from './pages/admin/ManualPaymentSettings';
import PixelSettings from './pages/admin/PixelSettings';
import CheckoutCustomization from './pages/admin/CheckoutCustomization';
import Customers from './pages/admin/Customers';
import Login from './pages/admin/Login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/checkout/:productSlug" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/payment-failed" element={<PaymentFailed />} />
        <Route path="/pix-payment-manual" element={<PixPaymentManual />} />
        
        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/products" element={<Products />} />
        <Route path="/admin/orders" element={<Orders />} />
        <Route path="/admin/settings/payment" element={<PaymentSettings />} />
        <Route path="/admin/settings/manual-payment" element={<ManualPaymentSettingsPage />} />
        <Route path="/admin/pixel-settings" element={<PixelSettings />} />
        <Route path="/admin/checkout-customization" element={<CheckoutCustomization />} />
        <Route path="/admin/customers" element={<Customers />} />
        <Route path="/admin/login" element={<Login />} />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
