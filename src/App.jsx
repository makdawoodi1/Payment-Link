import React from "react";
import { BrowserRouter, Routes, Route, redirect } from "react-router-dom";
import { STRIPE_PUBLISH_KEY } from "../config";

import LinkGenerator from "./pages/LinkGenerator" 
import LinkDetails from "./pages/LinkDetails" 
import PaymentPage from "./pages/PaymentPage" 
import FailedPayment from "./pages/FailedPayment" 
import FallBackComponent from "./pages/FallBackComponent" 
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
} from '@stripe/react-stripe-js';
import ConfirmedPayment from "./pages/ConfirmedPayment";

const stripePromise = loadStripe(STRIPE_PUBLISH_KEY);

const App = () => {

  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route exact path="/" element={<FallBackComponent />} />
          <Route exact path="/payments" element={<FallBackComponent />} />
          <Route
            path={`/payments/link-generator`}
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
          <Route
            path={`/payments/failed-payment`}
            element={<FailedPayment />}
          />
          <Route
            path={`/payments/confirm-payment`}
            element={<ConfirmedPayment />}
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
};

export default App;
