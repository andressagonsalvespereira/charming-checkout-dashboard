import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import { Toaster } from '@/components/ui/toaster';
import PaymentSettings from '@/pages/admin/PaymentSettings';
import Payments from '@/pages/admin/Payments';
import Checkout from '@/pages/Checkout';
import { AsaasProvider } from '@/contexts/asaas';

function App() {
  return (
    <AsaasProvider>
      <Router>
        <Routes>
          <Route path="/admin/settings/payment" element={<PaymentSettings />} />
          <Route path="/admin/payments" element={<Payments />} />
          <Route path="/checkout/:productSlug" element={<Checkout />} />
          {/* Other routes here */}
        </Routes>
        <Toaster />
      </Router>
    </AsaasProvider>
  );
}

export default App;
