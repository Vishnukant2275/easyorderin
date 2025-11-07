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
  const [errors, setErrors] = useState({});

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

  // Validation functions
  const validateStep1 = () => {
    const newErrors = {};

    if (!restaurant.restaurantName.trim()) {
      newErrors.restaurantName = "Restaurant name is required";
    }

    if (!restaurant.ownerName.trim()) {
      newErrors.ownerName = "Owner name is required";
    }

    if (!restaurant.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(restaurant.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!restaurant.contactNumber.trim()) {
      newErrors.contactNumber = "Contact number is required";
    } else if (!/^\d{10}$/.test(restaurant.contactNumber)) {
      newErrors.contactNumber = "Contact number must be 10 digits";
    }

    if (!otpVerified) {
      newErrors.otp = "Email verification is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};

    if (!restaurant.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!restaurant.city.trim()) {
      newErrors.city = "City is required";
    }

    if (!restaurant.state.trim()) {
      newErrors.state = "State is required";
    }

    if (!restaurant.pinCode.trim()) {
      newErrors.pinCode = "Pincode is required";
    } else if (!/^\d{6}$/.test(restaurant.pinCode)) {
      newErrors.pinCode = "Pincode must be 6 digits";
    }

    if (!restaurant.restaurantType) {
      newErrors.restaurantType = "Restaurant type is required";
    }

    if (!restaurant.seatingCapacity) {
      newErrors.seatingCapacity = "Seating capacity is required";
    } else if (restaurant.seatingCapacity < 1 || restaurant.seatingCapacity > 500) {
      newErrors.seatingCapacity = "Seating capacity must be between 1 and 500";
    }

    if (!restaurant.password) {
      newErrors.password = "Password is required";
    } else if (restaurant.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!restaurant.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (restaurant.password !== restaurant.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const sendOtp = async (e) => {
    e.preventDefault();
    
    // Validate email before sending OTP
    if (!restaurant.email.trim()) {
      setErrors({ email: "Email is required" });
      return;
    } else if (!/\S+@\S+\.\S+/.test(restaurant.email)) {
      setErrors({ email: "Email is invalid" });
      return;
    }

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
        setErrors({}); // Clear errors
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
    if (!otp.trim()) {
      setErrors({ otp: "OTP is required" });
      return;
    } else if (otp.length !== 6) {
      setErrors({ otp: "OTP must be 6 digits" });
      return;
    }

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
        setErrors({}); // Clear errors
        otpVerifiedMsg();
      } else {
        setErrors({ otp: data.message || "Invalid OTP" });
        otpNotVerifiedMsg(data.message);
      }
    } catch (error) {
      setErrors({ otp: error.message });
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

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ""
      }));
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6); // Only numbers, max 6 digits
    setOtp(value);
    
    // Clear OTP error when user types
    if (errors.otp) {
      setErrors(prev => ({
        ...prev,
        otp: ""
      }));
    }
  };

  const handleRegistration = async (e) => {
    e.preventDefault();
    
    // Validate step 2 before submission
    if (!validateStep2()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

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
    if (validateStep1()) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast.error("Please fill all required fields correctly");
    }
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
                    Restaurant Name *
                  </label>
                  <input
                    type="text"
                    name="restaurantName"
                    value={restaurant.restaurantName}
                    onChange={handleChange}
                    placeholder="Enter restaurant name"
                    className={`form-input ${errors.restaurantName ? 'error' : ''}`}
                    required
                  />
                  {errors.restaurantName && <span className="error-message">{errors.restaurantName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-person-badge"></i>
                    Owner's Name *
                  </label>
                  <input
                    type="text"
                    name="ownerName"
                    value={restaurant.ownerName}
                    onChange={handleChange}
                    placeholder="Enter owner's name"
                    className={`form-input ${errors.ownerName ? 'error' : ''}`}
                    required
                  />
                  {errors.ownerName && <span className="error-message">{errors.ownerName}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-envelope"></i>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={restaurant.email}
                    onChange={handleChange}
                    placeholder="Enter email address"
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    disabled={otpVerified}
                    required
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-phone"></i>
                    Contact Number *
                  </label>
                  <input
                    type="tel"
                    name="contactNumber"
                    value={restaurant.contactNumber}
                    onChange={handleChange}
                    placeholder="Enter 10-digit contact number"
                    className={`form-input ${errors.contactNumber ? 'error' : ''}`}
                    maxLength="10"
                    required
                  />
                  {errors.contactNumber && <span className="error-message">{errors.contactNumber}</span>}
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
                      Enter OTP *
                    </label>
                    <input
                      type="text"
                      name="otp"
                      value={otp}
                      onChange={handleOtpChange}
                      placeholder="Enter the 6-digit OTP"
                      className={`form-input ${errors.otp ? 'error' : ''}`}
                      maxLength="6"
                    />
                    {errors.otp && <span className="error-message">{errors.otp}</span>}
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
                  disabled={!otpVerified}
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
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={restaurant.address}
                    onChange={handleChange}
                    placeholder="Enter complete address"
                    rows="3"
                    className={`form-textarea ${errors.address ? 'error' : ''}`}
                    required
                  ></textarea>
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-building"></i>
                    City *
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={restaurant.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className={`form-input ${errors.city ? 'error' : ''}`}
                    required
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-map"></i>
                    State *
                  </label>
                  <input
                    type="text"
                    name="state"
                    value={restaurant.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    className={`form-input ${errors.state ? 'error' : ''}`}
                    required
                  />
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-pin-map"></i>
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pinCode"
                    value={restaurant.pinCode}
                    onChange={handleChange}
                    placeholder="Enter 6-digit pincode"
                    className={`form-input ${errors.pinCode ? 'error' : ''}`}
                    maxLength="6"
                    required
                  />
                  {errors.pinCode && <span className="error-message">{errors.pinCode}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-tags"></i>
                    Restaurant Type *
                  </label>
                  <select
                    name="restaurantType"
                    value={restaurant.restaurantType}
                    onChange={handleChange}
                    className={`form-select ${errors.restaurantType ? 'error' : ''}`}
                    required
                  >
                    <option value="" disabled>Select Type</option>
                    <option value="dineIn">Dine-In</option>
                    <option value="takeAway">Takeaway</option>
                    <option value="delivery">Delivery</option>
                    <option value="all">All Services</option>
                  </select>
                  {errors.restaurantType && <span className="error-message">{errors.restaurantType}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-people"></i>
                    Seating Capacity *
                  </label>
                  <input
                    type="number"
                    name="seatingCapacity"
                    value={restaurant.seatingCapacity}
                    onChange={handleChange}
                    placeholder="Enter capacity"
                    min="1"
                    max="500"
                    className={`form-input ${errors.seatingCapacity ? 'error' : ''}`}
                    required
                  />
                  {errors.seatingCapacity && <span className="error-message">{errors.seatingCapacity}</span>}
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
                    Password *
                  </label>
                  <input
                    type="password"
                    name="password"
                    value={restaurant.password}
                    onChange={handleChange}
                    placeholder="Enter password (min 6 characters)"
                    className={`form-input ${errors.password ? 'error' : ''}`}
                    required
                  />
                  {errors.password && <span className="error-message">{errors.password}</span>}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    <i className="bi bi-lock-fill"></i>
                    Confirm Password *
                  </label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={restaurant.confirmPassword}
                    onChange={handleChange}
                    placeholder="Re-enter password"
                    className={`form-input ${errors.confirmPassword ? 'error' : ''}`}
                    required
                  />
                  {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-prev" onClick={prevStep}>
                  <i className="bi bi-arrow-left"></i>
                  Back
                </button>
                <button
                  type="submit"
                  className="btn-submit"
                  disabled={isLoading}
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