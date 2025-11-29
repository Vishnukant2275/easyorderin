import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Payment.css";

const Payment = () => {
  const [paymentQRCodes, setPaymentQRCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [activeTab, setActiveTab] = useState("upi"); // "upi" or "bank"
  const [formData, setFormData] = useState({
    paymentMethod: "",
    upiId: "",
    note: "",
    file: null,
  });

  const [bankFormData, setBankFormData] = useState({
    accountNumber: "",
    confirmAccountNumber: "",
    ifscCode: "",
    accountHolderName: "",
    phoneNumber: "",
    email: "",
    panNumber: "",
    gstin: "",
    document: null,
  });

  const paymentOptions = [
    { value: "", label: "Select Payment Method" },
    { value: "PhonePe", label: "PhonePe" },
    { value: "GooglePay", label: "Google Pay" },
    { value: "Paytm", label: "Paytm" },
    { value: "UPI", label: "UPI" },
    { value: "Other", label: "Other" },
  ];

  useEffect(() => {
    fetchPaymentQRCodes();
  }, []);

  const fetchPaymentQRCodes = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get("/api/restaurant/get-paymentqr", {
        withCredentials: true,
      });

      if (res.data?.success && Array.isArray(res.data.qrCodes)) {
        setPaymentQRCodes(res.data.qrCodes);
      } else {
        setPaymentQRCodes([]);
      }
    } catch (error) {
      console.error("Error fetching QR codes:", error);
      setError("Failed to load payment methods");
      setPaymentQRCodes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleBankInputChange = (e) => {
    const { name, value } = e.target;
    setBankFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      file: e.target.files[0],
    }));
  };

  const handleBankFileChange = (e) => {
    setBankFormData((prev) => ({
      ...prev,
      document: e.target.files[0],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!formData.paymentMethod || !formData.file) {
      setError("Please select payment method and upload QR code image");
      return;
    }

    const submitData = new FormData();
    submitData.append("paymentMethod", formData.paymentMethod);
    submitData.append("upiId", formData.upiId);
    submitData.append("note", formData.note);
    submitData.append("files", formData.file);

    try {
      setUploading(true);
      const response = await axios.post(
        "/api/restaurant/upload-paymentqr",
        submitData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      setSuccess("QR code uploaded successfully!");

      // Reset form
      setFormData({
        paymentMethod: "",
        upiId: "",
        note: "",
        file: null,
      });

      // Refresh payment methods
      await fetchPaymentQRCodes();

      // Reset file input
      const fileInput = document.getElementById("file");
      if (fileInput) fileInput.value = "";
    } catch (error) {
      console.error("Error uploading QR code:", error);
      setError(error.response?.data?.error || "Failed to upload QR code");
    } finally {
      setUploading(false);
    }
  };

  const handleBankSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Validation
    if (bankFormData.accountNumber !== bankFormData.confirmAccountNumber) {
      setError("Account numbers do not match");
      return;
    }

    if (!bankFormData.accountNumber || !bankFormData.ifscCode || 
        !bankFormData.accountHolderName || !bankFormData.phoneNumber || 
        !bankFormData.email || !bankFormData.panNumber) {
      setError("Please fill all required fields");
      return;
    }

    const bankData = {
      accountNumber: bankFormData.accountNumber,
      ifscCode: bankFormData.ifscCode,
      accountHolderName: bankFormData.accountHolderName,
      phoneNumber: bankFormData.phoneNumber,
      email: bankFormData.email,
      panNumber: bankFormData.panNumber,
      gstin: bankFormData.gstin || "",
    };

    try {
      setVerifying(true);
      const response = await axios.post(
        "/api/restaurant/verify-bank-account",
        bankData,
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        setSuccess("Bank account verification initiated! Razorpay will send ₹1 to verify your account. Once verified, you can accept payments seamlessly.");
        
        // Reset form
        setBankFormData({
          accountNumber: "",
          confirmAccountNumber: "",
          ifscCode: "",
          accountHolderName: "",
          phoneNumber: "",
          email: "",
          panNumber: "",
          gstin: "",
          document: null,
        });
      } else {
        setError(response.data.error || "Failed to initiate bank verification");
      }
    } catch (error) {
      console.error("Error verifying bank account:", error);
      setError(error.response?.data?.error || "Failed to verify bank account");
    } finally {
      setVerifying(false);
    }
  };

  const deletePaymentMethod = async (qrId) => {
    try {
      const res = await axios.delete(`/api/restaurant/delete-paymentqr/${qrId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setSuccess("Payment method deleted successfully!");
        fetchPaymentQRCodes();
      } else {
        setError(res.data.error || "Failed to delete payment method");
      }
    } catch (error) {
      console.error("Error deleting payment method:", error);
      setError("Server error: Failed to delete payment method");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setSuccess("UPI ID copied to clipboard!");
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess("");
        setError("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <div className="payment-container">
      <div className="payment-header">
        <div className="header-content">
          <h1>Payment Methods</h1>
          <p>Manage your payment methods for seamless transactions</p>
        </div>
        <div className="header-stats">
          <div className="stat-card">
            <span className="stat-number">{paymentQRCodes.length}</span>
            <span className="stat-label">Active Methods</span>
          </div>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="message error-message">
          <span className="message-icon">⚠️</span>
          {error}
        </div>
      )}
      {success && (
        <div className="message success-message">
          <span className="message-icon">✅</span>
          {success}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="tab-navigation">
        <button
          className={`tab-button ${activeTab === "upi" ? "active" : ""}`}
          onClick={() => setActiveTab("upi")}
        >
          <span className="tab-icon">📱</span>
          UPI & QR Codes
        </button>
        <button
          className={`tab-button ${activeTab === "bank" ? "active" : ""}`}
          onClick={() => setActiveTab("bank")}
        >
          <span className="tab-icon">🏦</span>
          Bank Account
        </button>
      </div>

      <div className="payment-content">
        {activeTab === "upi" ? (
          /* UPI & QR Code Section */
          <div className="upload-section">
            <div className="section-header">
              <h2>Add UPI QR Code</h2>
              <div className="section-badge">Quick Setup</div>
            </div>

            <form onSubmit={handleSubmit} className="payment-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="paymentMethod" className="form-label">
                    Payment Method *
                  </label>
                  <select
                    id="paymentMethod"
                    name="paymentMethod"
                    value={formData.paymentMethod}
                    onChange={handleInputChange}
                    className="form-select"
                    required
                  >
                    {paymentOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label htmlFor="upiId" className="form-label">
                    UPI ID
                  </label>
                  <input
                    type="text"
                    id="upiId"
                    name="upiId"
                    value={formData.upiId}
                    onChange={handleInputChange}
                    className="form-input"
                    placeholder="yourname@upi"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="note" className="form-label">
                    Note
                  </label>
                  <textarea
                    id="note"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    className="form-textarea"
                    placeholder="Additional information for customers..."
                    rows="3"
                  />
                </div>

                <div className="form-group full-width">
                  <label htmlFor="file" className="form-label">
                    QR Code Image *
                  </label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="file"
                      name="file"
                      onChange={handleFileChange}
                      accept="image/*"
                      className="file-input"
                      required
                    />
                    <label htmlFor="file" className="file-label">
                      <span className="file-icon">📁</span>
                      <span className="file-text">
                        {formData.file
                          ? formData.file.name
                          : "Choose QR code image"}
                      </span>
                      <span className="file-button">Browse</span>
                    </label>
                  </div>
                  <small className="form-hint">
                    Supported formats: PNG, JPG, JPEG • Max size: 5MB
                  </small>
                </div>
              </div>

              <button
                type="submit"
                className={`submit-btn ${uploading ? "loading" : ""}`}
                disabled={uploading}
              >
                {uploading ? (
                  <>
                    <div className="spinner"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">📤</span>
                    Upload QR Code
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Bank Account Section */
          <div className="upload-section">
            <div className="section-header">
              <h2>Add Bank Account</h2>
              <div className="section-badge">Direct Transfers</div>
            </div>

            {/* Security Warning */}
            <div className="security-warning">
              <div className="warning-header">
                <span className="warning-icon">🔒</span>
                <h4>Secure Bank Verification</h4>
              </div>
              <div className="warning-content">
                <p>
                  <strong>Important:</strong> Your bank details are not stored on our servers. 
                  They are securely sent to Razorpay for verification purposes only.
                </p>
                <ul>
                  <li>Razorpay will send ₹1 to your account for verification</li>
                  <li>Once verified, you can accept payments seamlessly</li>
                  <li>All transactions are secured with bank-level encryption</li>
                </ul>
              </div>
            </div>

            <form onSubmit={handleBankSubmit} className="payment-form">
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="accountNumber" className="form-label">
                    Bank Account Number *
                  </label>
                  <input
                    type="text"
                    id="accountNumber"
                    name="accountNumber"
                    value={bankFormData.accountNumber}
                    onChange={handleBankInputChange}
                    className="form-input"
                    placeholder="Enter account number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmAccountNumber" className="form-label">
                    Confirm Account Number *
                  </label>
                  <input
                    type="text"
                    id="confirmAccountNumber"
                    name="confirmAccountNumber"
                    value={bankFormData.confirmAccountNumber}
                    onChange={handleBankInputChange}
                    className="form-input"
                    placeholder="Re-enter account number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="ifscCode" className="form-label">
                    IFSC Code *
                  </label>
                  <input
                    type="text"
                    id="ifscCode"
                    name="ifscCode"
                    value={bankFormData.ifscCode}
                    onChange={handleBankInputChange}
                    className="form-input"
                    placeholder="e.g., SBIN0000123"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="accountHolderName" className="form-label">
                    Account Holder Name *
                  </label>
                  <input
                    type="text"
                    id="accountHolderName"
                    name="accountHolderName"
                    value={bankFormData.accountHolderName}
                    onChange={handleBankInputChange}
                    className="form-input"
                    placeholder="As per bank records"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="phoneNumber" className="form-label">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phoneNumber"
                    value={bankFormData.phoneNumber}
                    onChange={handleBankInputChange}
                    className="form-input"
                    placeholder="10-digit mobile number"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={bankFormData.email}
                    onChange={handleBankInputChange}
                    className="form-input"
                    placeholder="your@email.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="panNumber" className="form-label">
                    PAN Number *
                  </label>
                  <input
                    type="text"
                    id="panNumber"
                    name="panNumber"
                    value={bankFormData.panNumber}
                    onChange={handleBankInputChange}
                    className="form-input"
                    placeholder="ABCDE1234F"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="gstin" className="form-label">
                    GSTIN (Optional)
                    <span className="optional-badge">Recommended</span>
                  </label>
                  <input
                    type="text"
                    id="gstin"
                    name="gstin"
                    value={bankFormData.gstin}
                    onChange={handleBankInputChange}
                    className="form-input"
                    placeholder="22AAAAA0000A1Z5"
                  />
                  <small className="form-hint">
                    Required for tax benefits and business transactions
                  </small>
                </div>

                <div className="form-group full-width">
                  <label htmlFor="bankDocument" className="form-label">
                    Verification Document (Optional)
                  </label>
                  <div className="file-upload">
                    <input
                      type="file"
                      id="bankDocument"
                      name="bankDocument"
                      onChange={handleBankFileChange}
                      accept=".pdf,.jpg,.jpeg,.png"
                      className="file-input"
                    />
                    <label htmlFor="bankDocument" className="file-label">
                      <span className="file-icon">📄</span>
                      <span className="file-text">
                        {bankFormData.document
                          ? bankFormData.document.name
                          : "Upload cancelled cheque or bank statement"}
                      </span>
                      <span className="file-button">Browse</span>
                    </label>
                  </div>
                  <small className="form-hint">
                    Upload cancelled cheque or bank statement for faster verification
                  </small>
                </div>
              </div>

              <button
                type="submit"
                className={`submit-btn ${verifying ? "loading" : ""}`}
                disabled={verifying}
              >
                {verifying ? (
                  <>
                    <div className="spinner"></div>
                    Verifying Account...
                  </>
                ) : (
                  <>
                    <span className="btn-icon">🏦</span>
                    Verify Bank Account
                  </>
                )}
              </button>
            </form>

            {/* Verification Failed Section */}
            <div className="verification-failed">
              <h4>Verification Failed?</h4>
              <p>
                If your bank account verification failed, please upload the required documents:
              </p>
              <div className="failed-actions">
                <button className="secondary-btn">
                  <span className="btn-icon">📋</span>
                  Upload Cancelled Cheque
                </button>
                <button className="secondary-btn">
                  <span className="btn-icon">🏛️</span>
                  Upload Bank Statement
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Existing Payment Methods */}
        <div className="existing-methods-section">
          <div className="section-header">
            <h2>Your Payment Methods</h2>
            <button
              onClick={fetchPaymentQRCodes}
              className="refresh-btn"
              disabled={loading}
            >
              <span className="refresh-icon">🔄</span>
              Refresh
            </button>
          </div>

          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading payment methods...</p>
            </div>
          ) : paymentQRCodes.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💳</div>
              <h3>No Payment Methods Yet</h3>
              <p>Add your first payment method to start accepting digital payments</p>
            </div>
          ) : (
            <div className="methods-grid">
              {paymentQRCodes.map((method) => (
                <div key={method._id} className="method-card">
                  <div className="card-header">
                    <div className="method-badge">{method.paymentMethod}</div>
                    <button
                      className="delete-btn"
                      onClick={() => deletePaymentMethod(method._id)}
                      title="Delete payment method"
                    >
                      <span className="delete-icon">🗑️</span>
                    </button>
                  </div>

                  <div className="qr-container">
                    <img
                      src={method.imageBase64}
                      alt={`${method.paymentMethod} QR Code`}
                      className="qr-image"
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div className="image-fallback">
                      <span>📷</span>
                      <p>QR Code Image</p>
                    </div>
                  </div>

                  <div className="card-content">
                    {method.upiId && (
                      <div className="detail-item">
                        <label>UPI ID:</label>
                        <div className="upi-container">
                          <span className="upi-id">{method.upiId}</span>
                          <button
                            onClick={() => copyToClipboard(method.upiId)}
                            className="copy-btn"
                            title="Copy UPI ID"
                          >
                            📋
                          </button>
                        </div>
                      </div>
                    )}

                    {method.note && (
                      <div className="detail-item">
                        <label>Note:</label>
                        <p className="note-text">{method.note}</p>
                      </div>
                    )}

                    <div className="card-footer">
                      <span className="created-date">
                        Added {new Date(method.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;