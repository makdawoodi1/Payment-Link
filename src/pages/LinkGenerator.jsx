import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../config";

const LinkGenerator = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    p_name: "",
    desc: "",
    amount: "",
    email: "",
    currency: "USD",
    package: [],
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

    fetch(`${API_URL}/api/payments/generate-link`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          navigate(`/payments/link-details?token=${data.user.link_token}`);
        } else {
          // Handle any errors or show an error message
        }
        console.log(data);
      })
      .catch((error) => {
        // Handle fetch errors or show an error message
        console.error("Error during fetch:", error);
      });
  };

  return (
    <div className="container py-5 col-md-6">
      <img src="/logo.png" className="mb-4" style={{ width: "300px" }} />
      <h1>Link Generator</h1>
      <div className="panel">
        <div className="panel-body">
          <div id="paymentResponse"></div>

          <form method="POST" className="row" id="paymentFrm">
            <div className="mt-3 col-md-6">
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                id="amount"
                className="form-control"
                placeholder="Enter amount"
                onChange={handleChange}
              />
            </div>
            <div className="mt-3 col-md-6">
              <label>Currency</label>
              <select
                name="currency"
                id="currency"
                required=""
                className="form-control"
                onChange={handleChange}
              >
                <option value="USD">USD</option>
                <option value="GBP">GBP</option>
                <option value="EUR">EUR</option>
                <option value="CAD">CAD</option>
              </select>
            </div>
            <div className="mt-3 col-md-12">
              <label>Client's Name</label>
              <input
                type="text"
                name="p_name"
                id="p_name"
                className="form-control"
                placeholder="Enter name"
                onChange={handleChange}
              />
            </div>
            <div class="mt-3 col-md-12">
              <label>Description</label>
              <textarea
                name="desc"
                className="form-control"
                style={{height: "100px"}}
                id="desc"
                placeholder="Enter description"
              ></textarea>
            </div>
            <div className="mt-3 col-md-12">
              <label className="mr-3">
                <input
                  type="checkbox"
                  name="package"
                  id="package"
                  className="mr-2"
                  value="Logo Design"
                  onChange={handleChange}
                />
                Logo Design
              </label>
              <label className="mr-3">
                <input
                  type="checkbox"
                  name="package"
                  id="package"
                  className="mr-2"
                  value="Stationary Design"
                  onChange={handleChange}
                />
                Stationary Design
              </label>
              <label className="mr-3">
                <input
                  type="checkbox"
                  name="package"
                  id="package"
                  className="mr-2"
                  value="Website Design"
                  onChange={handleChange}
                />
                Website Design
              </label>
              <label className="mr-3">
                <input
                  type="checkbox"
                  name="package"
                  id="package"
                  className="mr-2"
                  value="Website Development"
                  onChange={handleChange}
                />
                Website Development
              </label>
              <label className="mr-3">
                <input
                  type="checkbox"
                  name="package"
                  id="package"
                  className="mr-2"
                  value="Broucher Design"
                  onChange={handleChange}
                />
                Broucher Design
              </label>
              <label className="mr-3">
                <input
                  type="checkbox"
                  name="package"
                  id="package"
                  className="mr-2"
                  value="Project Status"
                  onChange={handleChange}
                />
                Project Status
              </label>
              <label className="mr-3">
                <input
                  type="checkbox"
                  name="package"
                  id="package"
                  className="mr-2"
                  value="Digital Marketing"
                  onChange={handleChange}
                />
                Digital Marketing
              </label>
              <label className="mr-3">
                <input
                  type="checkbox"
                  name="package"
                  id="package"
                  className="mr-2"
                  value="Mobile Application"
                  onChange={handleChange}
                />
                Mobile Application
              </label>
              <label className="mr-3">
                <input
                  type="checkbox"
                  name="package"
                  id="package"
                  className="mr-2"
                  value="Other"
                  onChange={handleChange}
                />
                Other
              </label>
            </div>
            <div className="mt-3 col-md-6">
              <label>Agents Email</label>
              <input
                type="email"
                name="sales_mail"
                className="form-control"
                onChange={handleChange}
              />
            </div>
            <div className="mt-3 col-md-6">
              <label>Client's email</label>
              <input
                type="email"
                name="email"
                id="email"
                className="form-control"
                placeholder="Enter email"
                onChange={handleChange}
              />
            </div>

            <div className="mt-3 col-md-12">
              <button
                type="submit"
                className="btn-block mt-3 btn btn-primary"
                id="payBtn"
                onClick={handleSubmit}
              >
                Generate Link
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LinkGenerator;
