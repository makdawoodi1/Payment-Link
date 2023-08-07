import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { STRIPE_PUBLISH_KEY } from "../config";

import LinkGenerator from "./pages/LinkGenerator" 
import LinkDetails from "./pages/LinkDetails" 
import PaymentPage from "./pages/PaymentPage" 
import { loadStripe } from '@stripe/stripe-js';
import {
  PaymentElement,
  Elements,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

const stripePromise = loadStripe(STRIPE_PUBLISH_KEY);

const App = () => {
  const options = {
    mode: 'payment',
    amount: 1099,
    currency: 'USD'
  };

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route
            path={`/payments/link-generator` || '/payments' || ''}
            element={<LinkGenerator />}
          />
          <Route
            path={`/payments/link-details`}
            element={<LinkDetails />}
          />
          <Route
            path={`/payments/payment-form`}
            element={
            <Elements stripe={stripePromise} >
              <PaymentPage />
            </Elements>
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
