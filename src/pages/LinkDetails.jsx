import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { API_URL } from "../../config";

const LinkDetails = () => {
  const [sessionData, setSessionData] = useState("");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [link, setLink] = useState(null);
  const [copiedValue, setCopiedValue] = useState(null);

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
          setLink(
            `${API_URL}/payments/payment-form?token=${data.session_data?.link_token}`
          );
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
    <div className="container container pb-5 pt-3 col-md-6">
      <br />
      <img src="/logo.png" className="mb-4" style={{width: "300px"}} />
      <h1>Link Generator</h1>
      <h3 className="mt-3 mb-4">Project Detail</h3>
      <p>
        <strong>Project Name: {sessionData?.project_name}</strong>
      </p>
      <p>
        <strong>Client Email: {sessionData?.email}</strong>
      </p>
      <p>
        <strong>
          Amount: {sessionData?.item_price} {sessionData?.item_price_currency}
        </strong>
      </p>
      <p>
        <strong>Packages: {sessionData?.packages}</strong>
      </p>
      <p>
        <strong>Desc: {sessionData?.description}</strong>
      </p>
      <div className="d-flex">
        <button
          className="btn btn-primary mb-3 mr-3"
          type="button"
          onClick={() =>
            navigate(`/payments/payment-form?token=${sessionData?.link_token}`)
          }
        >
          Complete This Invoice
        </button>
        <CopyToClipboard
          text={copiedValue}
          className="btn btn-info mb-3"
          onCopy={() => setCopiedValue(link)}
        >
          <span>{copiedValue ? "Copied" : "Copy to Clipboard"}</span>
        </CopyToClipboard>
      </div>
      <br />
      {
        sessionData?.sale_mail ? (
          <p>This email is send to <a href={sessionData?.sale_mail}>{sessionData?.sale_mail}</a></p>
        ) : (
          <p class="alert alert-danger">No Record Found Matching Your Token!</p>
        )
      }
    </div>
  );
};

export default LinkDetails;
