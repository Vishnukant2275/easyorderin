import React, { useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { useUser } from "../../context/UserContext";
import styles from "./UserCart.module.css";
import PaymentSection from "./PaymentSection";
import api from "../../services/api";

const UserInfoForm = forwardRef(({ 
  restaurantID, 
  tableNumber, 
  cartItems, 
  total, 
  specialInstructions, 
  onClose,
  onSubmit,
  onFormValidityChange,
  children 
}, ref) => {
  const { user, isAuthenticated, sendOtp, verifyOtp, checkAuthStatus } = useUser();
  
  const [userInfo, setUserInfo] = useState({
    name: "",
    mobile: "",
    otp: "",
  });
  
  const [formErrors, setFormErrors] = useState({});
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [showPaymentSection, setShowPaymentSection] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpMessage, setOtpMessage] = useState(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Check session on component mount
  useEffect(() => {
    checkUserSession();
  }, []);

  const checkUserSession = async () => {
    setIsCheckingSession(true);
    try {
      // Check if user is authenticated via session
      await checkAuthStatus();
      
      // If user is authenticated, auto-fill their info
      if (isAuthenticated && user) {
        setUserInfo({
          name: user.name || "",
          mobile: user.phone || "",
          otp: "",
        });
        setIsOtpVerified(true);
        setShowPaymentSection(true);
      }
    } catch (error) {
      console.error("Error checking user session:", error);
    } finally {
      setIsCheckingSession(false);
    }
  };

  // Calculate form validity
  const isFormValid = (isAuthenticated || isOtpVerified) && 
    selectedPaymentMethod && 
    isPaymentConfirmed;

  // Notify parent about form validity changes
  useEffect(() => {
    onFormValidityChange && onFormValidityChange(isFormValid);
  }, [isFormValid, onFormValidityChange]);

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;

    if (name === "mobile" || name === "otp") {
      const numbersOnly = value.replace(/[^0-9]/g, "");
      setUserInfo((prev) => ({
        ...prev,
        [name]: numbersOnly,
      }));
    } else {
      setUserInfo((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    if (name === "mobile" && otpMessage) {
      setOtpMessage(null);
      setShowOtpSection(false);
      setIsOtpVerified(false);
      setShowPaymentSection(false);
      setIsPaymentConfirmed(false);
      setUserInfo((prev) => ({ ...prev, otp: "" }));
    }
  };

  const handleSendOtp = async () => {
    if (!userInfo.mobile || userInfo.mobile.length !== 10) {
      setFormErrors((prev) => ({
        ...prev,
        mobile: "Please enter a valid 10-digit mobile number",
      }));
      return;
    }

    setIsSendingOtp(true);
    setOtpMessage(null);

    try {
      const result = await sendOtp(userInfo.mobile);
      if (result.success) {
        setOtpMessage({ type: "success", text: "OTP sent successfully!" });
        setShowOtpSection(true);
        startOtpTimer();
      } else {
        setOtpMessage({
          type: "error",
          text: result.error || "Failed to send OTP",
        });
      }
    } catch (error) {
      setOtpMessage({
        type: "error",
        text: "Failed to send OTP. Please try again.",
      });
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!userInfo.otp || userInfo.otp.length !== 6) {
      setFormErrors((prev) => ({
        ...prev,
        otp: "Please enter a valid 6-digit OTP",
      }));
      return;
    }

    setIsVerifyingOtp(true);
    setOtpMessage(null);

    try {
      const result = await verifyOtp(userInfo.mobile, userInfo.otp);
      if (result.success) {
        setOtpMessage({ type: "success", text: "OTP verified successfully!" });
        setIsOtpVerified(true);
        setShowPaymentSection(true);
        
        // Update user info with verified data
        if (result.user) {
          setUserInfo({
            name: result.user.name || userInfo.name,
            mobile: result.user.phone || userInfo.mobile,
            otp: "",
          });
        }
      } else {
        setOtpMessage({
          type: "error",
          text: result.error || "Invalid OTP",
        });
      }
    } catch (error) {
      setOtpMessage({
        type: "error",
        text: "Failed to verify OTP. Please try again.",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(60);
    const timer = setInterval(() => {
      setOtpTimer((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const validateForm = () => {
    const errors = {};

    if (!isAuthenticated && !isOtpVerified) {
      if (!userInfo.name.trim()) {
        errors.name = "Name is required";
      } else if (userInfo.name.trim().length < 2) {
        errors.name = "Name must be at least 2 characters long";
      }

      if (!userInfo.mobile.trim()) {
        errors.mobile = "Mobile number is required";
      } else if (!/^\d{10}$/.test(userInfo.mobile.trim())) {
        errors.mobile = "Please enter a valid 10-digit mobile number";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!selectedPaymentMethod) {
      alert("Please select a payment method.");
      return;
    }

    if (selectedPaymentMethod === "qr" && !isPaymentConfirmed) {
      alert("Please confirm your payment before placing the order.");
      return;
    }

    if (selectedPaymentMethod === "counter" && !isPaymentConfirmed) {
      alert("Please confirm that you understand you'll pay at the counter.");
      return;
    }

    if (!isAuthenticated && !isOtpVerified && !validateForm()) {
      return;
    }

    // Prepare final user data - use session data if available, otherwise use form data
    const finalUserInfo = {
      name: isAuthenticated ? user.name : userInfo.name,
      mobile: isAuthenticated ? user.phone : userInfo.mobile,
    };

    // Call parent submit handler
    await onSubmit(finalUserInfo, selectedPaymentMethod, isPaymentConfirmed);
  };

  // Expose submit function to parent
  useImperativeHandle(ref, () => ({
    handleSubmit
  }));

  // Show loading while checking session
  if (isCheckingSession) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>Checking session...</div>
      </div>
    );
  }

  return (
    <div className={styles.userForm}>
      {/* Show user status */}
      {isAuthenticated && (
        <div className={styles.userStatus}>
          <div className={styles.authenticatedBadge}>
            ✅ Logged in as: {user?.name} ({user?.phone})
          </div>
          <p className={styles.authenticatedText}>
            Your information is automatically filled from your login details.
          </p>
        </div>
      )}

      {/* User Info Fields - Only show if not authenticated */}
      {!isAuthenticated && (
        <>
          <div className={styles.formGroup}>
            <label htmlFor="name" className={styles.formLabel}>
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className={`${styles.formInput} ${
                formErrors.name ? styles.inputError : ""
              }`}
              placeholder="Enter your full name"
              value={userInfo.name}
              onChange={handleUserInfoChange}
              disabled={isOtpVerified || isSubmitting}
            />
            {formErrors.name && (
              <span className={styles.errorText}>{formErrors.name}</span>
            )}
          </div>

          {/* Mobile Number Field */}
          <div className={styles.formGroup}>
            <label htmlFor="mobile" className={styles.formLabel}>
              Mobile Number *
            </label>
            <div className={styles.mobileInputGroup}>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                className={`${styles.formInput} ${
                  formErrors.mobile ? styles.inputError : ""
                }`}
                placeholder="Enter your 10-digit mobile number"
                value={userInfo.mobile}
                onChange={handleUserInfoChange}
                maxLength="10"
                disabled={isOtpVerified || isSendingOtp || isSubmitting}
              />
              {!isOtpVerified && (
                <button
                  type="button"
                  className={styles.sendOtpButton}
                  onClick={handleSendOtp}
                  disabled={
                    !userInfo.mobile ||
                    userInfo.mobile.length !== 10 ||
                    isOtpVerified ||
                    isSendingOtp ||
                    isSubmitting
                  }
                >
                  {isSendingOtp ? "Sending..." : "Send OTP"}
                </button>
              )}
            </div>
            {formErrors.mobile && (
              <span className={styles.errorText}>{formErrors.mobile}</span>
            )}
          </div>

          {/* OTP Section */}
          {showOtpSection && !isOtpVerified && (
            <div className={styles.otpSection}>
              <div className={styles.formGroup}>
                <label htmlFor="otp" className={styles.formLabel}>
                  Enter OTP *
                </label>
                <div className={styles.otpInputGroup}>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    className={`${styles.formInput} ${
                      formErrors.otp ? styles.inputError : ""
                    }`}
                    placeholder="Enter 6-digit OTP"
                    value={userInfo.otp}
                    onChange={handleUserInfoChange}
                    maxLength="6"
                    disabled={isOtpVerified || isSubmitting}
                  />
                  <button
                    type="button"
                    className={styles.verifyOtpButton}
                    onClick={handleVerifyOtp}
                    disabled={
                      !userInfo.otp ||
                      userInfo.otp.length !== 6 ||
                      isVerifyingOtp ||
                      isOtpVerified ||
                      isSubmitting
                    }
                  >
                    {isVerifyingOtp ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
                {formErrors.otp && (
                  <span className={styles.errorText}>{formErrors.otp}</span>
                )}
                {otpMessage && (
                  <span
                    className={
                      otpMessage.type === "success"
                        ? styles.otpSuccess
                        : styles.otpError
                    }
                  >
                    {otpMessage.text}
                  </span>
                )}
                <div className={styles.otpResend}>
                  <span className={styles.otpTimer}>
                    {otpTimer > 0
                      ? `Resend OTP in ${otpTimer}s`
                      : "Didn't receive OTP?"}
                  </span>
                  {otpTimer === 0 && (
                    <button
                      type="button"
                      className={styles.resendOtpButton}
                      onClick={handleSendOtp}
                      disabled={isSendingOtp || isSubmitting}
                    >
                      {isSendingOtp ? "Sending..." : "Resend OTP"}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* OTP Verified Message */}
          {isOtpVerified && !isAuthenticated && (
            <div className={styles.otpVerified}>
              <div className={styles.verifiedBadge}>
                ✅ Mobile number verified
              </div>
              <p className={styles.verifiedText}>
                Your mobile number {userInfo.mobile} has been successfully verified.
              </p>
            </div>
          )}
        </>
      )}

      {/* Payment Section - Show when authenticated or OTP verified */}
      {(isAuthenticated || isOtpVerified) && (
        <PaymentSection
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
          isPaymentConfirmed={isPaymentConfirmed}
          setIsPaymentConfirmed={setIsPaymentConfirmed}
          total={total}
          restaurantID={restaurantID}
        />
      )}

      {/* Children (Order Review and Actions) */}
      {children && children({
        isSubmitting,
        userInfo: isAuthenticated ? user : userInfo,
        handleSubmit
      })}
    </div>
  );
});

export default UserInfoForm;