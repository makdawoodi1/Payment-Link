import React, { useState, useEffect } from "react";
import { countries } from "../data/data";
import { API_URL } from "../../config";
import { useNavigate, useSearchParams } from "react-router-dom";
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";

const PaymentPage = () => {
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({ cardErrors: '', paymentErrors: '' })
  const [formData, setFormData] = useState({
    payment_method_id: "",
    amount: "",
    currency: "",
    project_name: "",
    description: "",
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    link_token: searchParams.get("token"),
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: name === "package" ? [...prevFormData.package, value] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    stripe
      .createPaymentMethod({
        type: "card",
        card: elements.getElement(CardElement)
      })
      .then(function (result) {
        // Handle result.error or result.paymentMethod
        if (result.error) {
          console.error(result.error)
          setErrors({ ...errors, cardErrors: result.error.message })
        }
        setFormData({ 
          ...formData, 
          payment_method_id: result.paymentMethod.id,
          amount: sessionData.item_price,
          currency: sessionData.item_price_currency,
          project_name: sessionData.project_name,
          description: sessionData.description,
          email: sessionData.email
         })
        fetch(`${API_URL}/api/payments/create-payment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ 
            ...formData, 
            payment_method_id: result.paymentMethod.id,
            amount: sessionData.item_price,
            currency: sessionData.item_price_currency,
            project_name: sessionData.project_name,
            description: sessionData.description,
            email: sessionData.email
          }),
        })
          .then((response) => response.json())
          .then((data) => {
            if (data.success) {
              console.log(data);
              navigate("/payments/confirm-payment")
            } else if (data.error) {
              setErrors({ ...errors, paymentErrors: data.error.message })
              navigate('/payments/failed-payment');
            }

            else if (data.requires_action) {
              setErrors({ ...errors, paymentErrors: 'Requires Action' })
              stripe.handleCardAction(
                data.payment_intent_client_secret
              ).then((result) => {
                if (result.error) {
                  setErrors({ ...errors, paymentErrors: result.error.message })
                }
                else {
                  fetch(`${API_URL}/api/payments/confirm-payment`, {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ 
                      payment_intent_id: result.paymentIntent.id,
                    }),
                  }).then(function(confirmResult) {
                    return confirmResult.json();
                }).then(() => {
                  console.log(data);
                  navigate("/payments/confirm-payment")
                });
                }
              })
            }
            console.log(data);
          })
          .catch((error) => {
            console.error("Error during fetch:", error);
          });


      });

  };

  useEffect(() => {
    fetchSessionDetails();
  }, []);

  const fetchSessionDetails = (e) => {
    fetch(
      `${API_URL}/api/payments/fetch-session-details/?token=${searchParams.get(
        "token"
      )}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setSessionData(data.session_data);
        } else {
          // Handle any errors or show an error message
        }
      })
      .catch((error) => {
        // Handle fetch errors or show an error message
        console.error("Error during fetch:", error);
      });
  };

  return (
    <div className="panel container col-md-6 py-5">
      <img src="/logo.png" className="mb-4" style={{ width: "300px" }} />
      {sessionData?.payment_status === "succeeded" && (
        <h1 style="text-align:center">Already Paid</h1>
      )}
      <h2>Payment Details</h2>
      <div className="panel-body">
        <div id="paymentResponse"></div>
        <form className="row" method="POST" id="payment-form">
          <div className="form-group col-md-6">
            <label>Amount Payable</label>
            <input
              type="number"
              name="amount"
              id="amount"
              className="field form-control"
              placeholder="Enter amount"
              value={sessionData?.item_price}
              onChange={handleChange}
              readOnly={true}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Currency</label>
            <input
              type="text"
              name="currency"
              className="form-control"
              id="currency"
              value={sessionData?.item_price_currency}
              onChange={handleChange}
              readOnly={true}
            />
          </div>
          <div className="form-group col-md-12">
            <label>Client's Name</label>
            <input
              type="text"
              name="project_name"
              id="p_name"
              className="field form-control"
              placeholder="Enter name"
              value={sessionData?.project_name}
              onChange={handleChange}
              readOnly={true}
            />
          </div>
          <div className="form-group col-md-12">
            <div
              id="description"
              style={{
                background: "#e9ecef",
                padding: "10px",
                borderRadius: "0.25rem",
                border: "1px solid #ced4da",
                minHeight: "100px",
              }}
            >
              {sessionData?.description}
            </div>
          </div>
          <div className="form-group col-md-12">
            <h2 className="my-2">Card Holder's Details</h2>
          </div>
          <div className="form-group col-md-6">
            <label>First Name</label>
            <input
              type="text"
              name="firstname"
              id="fname"
              className="field form-control"
              placeholder="Enter First Name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Last Name</label>
            <input
              type="text"
              name="lastname"
              id="lname"
              className="field form-control"
              placeholder="Enter Last Name"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Email</label>
            <input
              type="email"
              name="email"
              id="email"
              className="field form-control"
              placeholder="Enter email"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Phone</label>
            <input
              type="tel"
              name="phone"
              id="phone"
              className="field form-control"
              placeholder="Enter Phone"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-12">
            <h2 className="my-2">Billing Details</h2>
          </div>
          <div className="form-group col-md-6">
            <label>Address Line 1</label>
            <input
              type="text"
              name="address"
              id="address"
              className="field form-control"
              placeholder="Enter Address"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Address Line 2</label>
            <input
              type="text"
              name="address2"
              id="address2"
              className="field form-control"
              placeholder="Enter Address"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label>City</label>
            <input
              type="text"
              name="city"
              id="city"
              className="field form-control"
              placeholder="Enter City"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label>State / Province</label>
            <input
              type="text"
              name="state"
              id="state"
              className="field form-control"
              placeholder="Enter State / Province"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Zip / Postal Code</label>
            <input
              type="text"
              name="zip"
              id="zip"
              className="field form-control"
              placeholder="Enter Zip"
              onChange={handleChange}
            />
          </div>
          <div className="form-group col-md-6">
            <label>Country</label>
            <select
              name="country"
              id="country"
              className="field form-control"
              placeholder="Enter Country"
              onChange={handleChange}
            >
              {countries.map((country, index) => (
                <option key={index} value={country}>
                  {country}
                </option>
              ))}
            </select>
          </div>
          <div className="form-group col-md-12">
            <h2 className="my-2">Card Details</h2>
          </div>
          <div className="col-12">
            <div className="row">
              <div id="card-field" className="col-md-12">
                <CardElement />
              </div>
            </div>
          </div>
          <div className="col-12 mt-5">
            {stripe && elements && <>
              <button
                type="button"
                onClick={handleSubmit}
                className={`btn btn-block btn-primary ${submitting === true ? "d-none" : ""}`}
                id="payBtn"
              >
                Submit Payment
              </button>
              <button
                type="button"
                disabled
                className={`btn btn-block ${submitting === false ? "d-none" : ""} btn-primary`}
                id="proces"
              >
                Processing <div className="spinner-border text-primary"></div>
              </button>
            </>}
            <div className={`mt-5 alert ${errors?.cardErrors ? 'alert-danger' : ""}`} id="card-errors">
                {errors?.cardErrors}
            </div>
            <div className={`mt-5 alert ${errors?.paymentErrors ? 'alert-danger' : ""}`} id="payment-errors"></div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentPage;
