import React, { useState } from "react";
import "../styles/RestoSignUp.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RestoSignUp = () => {
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);
  const [otpButtonText, setOtpButtonText] = useState("Send OTP");
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [restaurant, setRestaurant] = useState({
    restaurantName: "",
    ownerName: "",
    email: "",
    password: "",
    confirmPassword: "",
    contactNumber: "",
    address: "",
    city: "",
    state: "",
    pinCode: "",
    restaurantType: "",
    seatingCapacity: "",
    logoImage: null,
  });

  const sendOtp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const notify = () => toast.success("OTP sent successfully!");
    const otpNotSent = (error) =>
      toast.error(`Failed to send OTP. ${error || ""}`);

    try {
      const response = await fetch(
        `/api/restaurant/send-otp?email=${restaurant.email}`
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setOtpSent(true);
        notify();
        setOtpButtonText("Resend OTP");
      } else {
        otpNotSent(data.message);
      }
    } catch (error) {
      otpNotSent(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const verifyOtp = async () => {
    setIsLoading(true);
    const otpVerifiedMsg = () => toast.success("OTP verified successfully!");
    const otpNotVerifiedMsg = (error) =>
      toast.error(`Failed to verify OTP. ${error || ""}`);

    try {
      const response = await fetch(
        `/api/restaurant/verify-otp?email=${restaurant.email}&otp=${otp}`
      );

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      const data = await response.json();

      if (data.success) {
        setOtpVerified(true);
        otpVerifiedMsg();
        setCurrentStep(2);
      } else {
        otpNotVerifiedMsg(data.message);
      }
    } catch (error) {
      otpNotVerifiedMsg(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setRestaurant((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();

      for (const key in restaurant) {
        formData.append(key, restaurant[key]);
      }

      const response = await fetch("/api/restaurant/register", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      if (data.success) {
        toast.success("Restaurant registered successfully!");
        setCurrentStep(3);
      } else {
        toast.error(`Failed: ${data.message}`);
      }
    } catch (error) {
      toast.error(`Error: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Progress Steps
  const steps = [
    { number: 1, title: "Basic Info" },
    { number: 2, title: "Restaurant Details" },
    { number: 3, title: "Complete" }
  ];

  return (
    <div className="resto-signup-container">
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      
      <div className="resto-signup-card">
        {/* Header */}
        <div className="resto-signup-header">
          <div className="resto-logo-placeholder">
            <i className="bi bi-shop-window"></i>
          </div>
          <h2 className="resto-signup-title">Join Our Restaurant Network</h2>
          <p className="resto-signup-subtitle">
            Register your restaurant and start serving customers today
          </p>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          {steps.map((step, index) => (
            <div key={step.number} className="step-container">
              <div className={`step ${currentStep >= step.number ? 'active' : ''} ${currentStep > step.number ? 'completed' : ''}`}>
                {currentStep > step.number ? (
                  <i className="bi bi-check-lg"></i>
                ) : (
                  <span>{step.number}</span>
                )}
              </div>
              <span className="step-label">{step.title}</span>
              {index < steps.length - 1 && (
                <div className={`step-connector ${currentStep > step.number ? 'active' : ''}`}></div>
              )}
            </div>
          ))}
        </div>

        <form onSubmit={handleRegistration} className="resto-signup-form">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div className="form-step active">
              <div className="step-header">
                <h3>Basic Information</h3>
                <p>Tell us about your restaurant</p>
              </div>

              <div className="form-grid">
                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-shop"></i>
                    Restaurant Name
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={restaurant.restaurantName}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-person-badge"></i>
                    Owner's Name
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={restaurant.ownerName}
                    onChange={handleChange}
                    placeholder="Enter owner's name"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-envelope"></i>
                    Email Address
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={restaurant.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className="form-input"
                    disabled={otpVerified}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-phone"></i>
                    Contact Number
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={restaurant.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter contact number"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              {/* OTP Section */}
              {/\S+@\S+\.\S+/.test(restaurant.email) && (
                <div className="otp-section">
                  <button
                    type="button"
                    className={`otp-btn ${otpVerified ? 'verified' : ''}`}
                    disabled={!/\S+@\S+\.\S+/.test(restaurant.email) || otpVerified || isLoading}
                    onClick={sendOtp}
                  >
                    {isLoading ? (
                      <div className="loading-spinner"></div>
                    ) : otpVerified ? (
                      <>
                        <i className="bi bi-check-circle-fill"></i>
                        Email Verified
                      </>
                    ) : (
                      <>
                        <i className="bi bi-send"></i>
                        {otpButtonText}
                      </>
                    )}
                  </button>
                </div>
              )}

              {otpSent && !otpVerified && (
                <div className="otp-verify-section">
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-shield-check"></i>
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter the 6-digit OTP"
                      className="form-input"
                      maxLength="6"
                    />
                  </div>
                  <button 
                    type="button" 
                    className="verify-otp-btn"
                    onClick={verifyOtp}
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? (
                      <div className="loading-spinner"></div>
                    ) : (
                      <>
                        <i className="bi bi-check-lg"></i>
                        Verify OTP
                      </>
                    )}
                  </button>
                </div>
              )}

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-next"
                  onClick={nextStep}
                  disabled={!otpVerified || !restaurant.restaurantName || !restaurant.ownerName || !restaurant.contactNumber}
                >
                  Continue
                  <i className="bi bi-arrow-right"></i>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Restaurant Details */}
          {currentStep === 2 && (
            <div className="form-step active">
              <div className="step-header">
                <h3>Restaurant Details</h3>
                <p>Complete your restaurant profile</p>
              </div>

              <div className="form-grid">
                <div className="form-group full-width">
                  <label className="form-label">
                    <i className="bi bi-geo-alt"></i>
                    Address
                  </label>
                  <textarea
                    name="address"
                    value={restaurant.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows="3"
                    className="form-textarea"
                    required
                  ></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-building"></i>
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={restaurant.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-map"></i>
                    State
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={restaurant.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-pin-map"></i>
                    Pincode
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={restaurant.pinCode}
                    onChange={handleChange}
                    placeholder="Enter pincode"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-tags"></i>
                    Restaurant Type
                  </label>
                  <select
                    name="restaurantType"
                    value={restaurant.restaurantType}
                    onChange={handleChange}
                    className="form-select"
                    required
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="dineIn">Dine-In</option>
                    <option value="takeAway">Takeaway</option>
                    <option value="delivery">Delivery</option>
                    <option value="all">All Services</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-people"></i>
                    Seating Capacity
                  </label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={restaurant.seatingCapacity}
                    onChange={handleChange}
                    placeholder="Enter capacity"
                    min="1"
                    max="500"
                    className="form-input"
                    required
                  />
                </div>

                <div className="form-group full-width">
                  <label className="form-label">
                    <i className="bi bi-image"></i>
                    Restaurant Logo
                  </label>
                  <div className="file-upload">
                    <input
                      type="file"
                      name="logoImage"
                      onChange={handleChange}
                      accept="image/*"
                      className="file-input"
                    />
                    <div className="file-upload-label">
                      <i className="bi bi-cloud-arrow-up"></i>
                      <span>Click to upload logo</span>
                      <small>PNG, JPG, JPEG up to 5MB</small>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-lock"></i>
                    Password
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={restaurant.password}
                    onChange={handleChange}
                    placeholder="Enter password"
                    className="form-input"
                    required
                  />
                </div>

                {restaurant.password.length > 0 && (
                  <div className="form-group">
                    <label className="form-label">
                      <i className="bi bi-lock-fill"></i>
                      Confirm Password
                    </label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={restaurant.confirmPassword}
                      onChange={handleChange}
                      placeholder="Re-enter password"
                      className="form-input"
                      required
                    />
                    {restaurant.confirmPassword && restaurant.password !== restaurant.confirmPassword && (
                      <span className="password-error">
                        <i className="bi bi-exclamation-circle"></i>
                        Passwords don't match
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  <i className="bi bi-arrow-left"></i>
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isLoading || !restaurant.password || !restaurant.confirmPassword || restaurant.password !== restaurant.confirmPassword}
                >
                  {isLoading ? (
                    <div className="loading-spinner"></div>
                  ) : (
                    <>
                      <i className="bi bi-check-lg"></i>
                      Complete Registration
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Success */}
          {currentStep === 3 && (
            <div className="form-step success-step">
              <div className="success-animation">
                <div className="success-icon">
                  <i className="bi bi-check-circle"></i>
                </div>
                <h3>Registration Successful!</h3>
                <p>Your restaurant has been registered successfully. You'll receive a confirmation email shortly.</p>
                <div className="success-actions">
                  <button className="btn-dashboard">
                    <i className="bi bi-speedometer2"></i>
                    Go to Dashboard
                  </button>
                  <button className="btn-add-menu">
                    <i className="bi bi-plus-circle"></i>
                    Add Menu Items
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>

        <div className="resto-signup-footer">
          <p>
            Already have an account? <a href="/restaurant/login" className="login-link">Sign In</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RestoSignUp;