import React, {
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from "react";
import { useUser } from "../../context/UserContext";
import styles from "./UserCart.module.css";
import PaymentSection from "./PaymentSection";
import api from "../../services ";

const UserInfoForm = forwardRef(
  (
    {
      restaurantID,
      tableNumber,
      cartItems,
      total,
      specialInstructions,
      onClose,
      onSubmit,
      onFormValidityChange,
      onPaymentConfirmationChange, // Add this new prop
      currentUser, // Pass current user from parent
      children,
    },
    ref
  ) => {
    const { user: contextUser, isAuthenticated } = useUser();

    const [userInfo, setUserInfo] = useState({
      name: "",
      mobile: "",
    });

    const [formErrors, setFormErrors] = useState({});
    const [showPaymentSection, setShowPaymentSection] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
    const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isBasicInfoComplete, setIsBasicInfoComplete] = useState(false);

    // Initialize form with current user data if available
    useEffect(() => {
      if (currentUser) {
        setUserInfo({
          name: currentUser.name || "",
          mobile: currentUser.phone || currentUser.mobile || "",
        });
        setIsBasicInfoComplete(true);
        setShowPaymentSection(true);
      } else if (isAuthenticated && contextUser) {
        setUserInfo({
          name: contextUser.name || "",
          mobile: contextUser.phone || contextUser.mobile || "",
        });
        setIsBasicInfoComplete(true);
        setShowPaymentSection(true);
      }
    }, [currentUser, isAuthenticated, contextUser]);

    // Check if basic info is complete and enable payment section
    useEffect(() => {
      const basicInfoComplete =
        userInfo.name.trim() && userInfo.mobile.trim().length === 10;
      setIsBasicInfoComplete(basicInfoComplete);

      if (basicInfoComplete && !showPaymentSection) {
        setShowPaymentSection(true);
      }
    }, [userInfo.name, userInfo.mobile, showPaymentSection]);

    // Calculate form validity
    const isFormValid =
      isBasicInfoComplete && selectedPaymentMethod && isPaymentConfirmed;

    // Notify parent about form validity changes
    useEffect(() => {
      onFormValidityChange && onFormValidityChange(isFormValid);
    }, [isFormValid, onFormValidityChange]);

    // Notify parent about payment confirmation changes
    useEffect(() => {
      onPaymentConfirmationChange &&
        onPaymentConfirmationChange(isPaymentConfirmed);
    }, [isPaymentConfirmed, onPaymentConfirmationChange]);

    const handleUserInfoChange = (e) => {
      const { name, value } = e.target;

      if (name === "mobile") {
        // Allow only numbers for mobile
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

      // Clear error when user starts typing
      if (formErrors[name]) {
        setFormErrors((prev) => ({
          ...prev,
          [name]: "",
        }));
      }
    };

    const validateForm = () => {
      const errors = {};

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

      if (!selectedPaymentMethod) {
        errors.payment = "Please select a payment method";
      }

      if (!isPaymentConfirmed) {
        errors.payment = "Please confirm your payment";
      }

      setFormErrors(errors);
      return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
      if (!validateForm()) {
        return;
      }

      if (!selectedPaymentMethod) {
        alert("Please select a payment method.");
        return;
      }

      if (selectedPaymentMethod === "razorpay" && !isPaymentConfirmed) {
        alert("Please complete your payment before placing the order.");
        return;
      }

      if (selectedPaymentMethod === "counter" && !isPaymentConfirmed) {
        alert("Please confirm that you understand you'll pay at the counter.");
        return;
      }

      setIsSubmitting(true);

      try {
        // Create user object from form data
        const guestUser = {
          _id: `guest_${Date.now()}`,
          name: userInfo.name.trim(),
          phone: userInfo.mobile.trim(),
          isGuest: true,
        };

        // Call parent submit handler
        await onSubmit(guestUser, selectedPaymentMethod, isPaymentConfirmed);
      } catch (error) {
        console.error("Error in form submission:", error);
      } finally {
        setIsSubmitting(false);
      }
    };

    // Expose submit function to parent
    useImperativeHandle(ref, () => ({
      handleSubmit,
    }));

    const handleEditInfo = () => {
      // Reset all states to show the form again
      setIsBasicInfoComplete(false);
      setShowPaymentSection(false);
      setSelectedPaymentMethod("");
      setIsPaymentConfirmed(false);
      setFormErrors({});

      // Clear the mobile number to prevent auto-rendering
      setUserInfo({
        name: userInfo.name, // Keep the name so user doesn't have to retype it
        mobile: "", // Clear mobile to prevent auto-completion
      });

      // Also notify parent that form is no longer valid
      onFormValidityChange && onFormValidityChange(false);
      onPaymentConfirmationChange && onPaymentConfirmationChange(false);
    };

    // Handle payment method change
    const handlePaymentMethodChange = (method) => {
      setSelectedPaymentMethod(method);
      // Reset payment confirmation when payment method changes
      setIsPaymentConfirmed(false);
    };

    // Handle payment confirmation change
    const handlePaymentConfirmationChange = (confirmed) => {
      setIsPaymentConfirmed(confirmed);
    };

    return (
      <div className={styles.userForm}>
        {/* Show user info card when basic info is complete */}
        {isBasicInfoComplete && (
          <div className={styles.userInfoCard}>
            <div className={styles.userInfoHeader}>
              <h4 className={styles.userInfoTitle}>Your Information</h4>
              <button
                type="button"
                className={styles.editButton}
                onClick={handleEditInfo}
                disabled={isSubmitting}
              >
                Edit
              </button>
            </div>
            <div className={styles.userInfoDetails}>
              <div className={styles.userInfoItem}>
                <span className={styles.userInfoLabel}>Name:</span>
                <span className={styles.userInfoValue}>{userInfo.name}</span>
              </div>
              <div className={styles.userInfoItem}>
                <span className={styles.userInfoLabel}>Mobile:</span>
                <span className={styles.userInfoValue}>{userInfo.mobile}</span>
              </div>
            </div>
          </div>
        )}

        {/* User Info Fields - Only show when basic info is not complete */}
        {!isBasicInfoComplete && (
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
                disabled={isSubmitting}
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
                disabled={isSubmitting}
              />
              {formErrors.mobile && (
                <span className={styles.errorText}>{formErrors.mobile}</span>
              )}
              <small className={styles.helperText}>
                We'll use this to notify you about your order status
              </small>
            </div>

            {/* Continue Button to manually proceed to payment */}
            {userInfo.name.trim() && userInfo.mobile.trim().length === 10 && (
              <div className={styles.continueButtonContainer}>
                <button
                  type="button"
                  className={styles.continueButton}
                  onClick={() => {
                    setIsBasicInfoComplete(true);
                    setShowPaymentSection(true);
                  }}
                  disabled={isSubmitting}
                >
                  Continue to Payment
                </button>
              </div>
            )}
          </>
        )}

        {/* Show payment section once basic info is complete */}
        {showPaymentSection && isBasicInfoComplete && (
          <>
            <div className={styles.sectionDivider}></div>
            <PaymentSection
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={handlePaymentMethodChange}
              isPaymentConfirmed={isPaymentConfirmed}
              setIsPaymentConfirmed={handlePaymentConfirmationChange}
              total={total}
              restaurantID={restaurantID}
              userInfo={userInfo} // Add this line to pass user information
            />
          </>
        )}

        {/* Show payment errors if any */}
        {formErrors.payment && (
          <div className={styles.paymentError}>
            <span className={styles.errorText}>{formErrors.payment}</span>
          </div>
        )}

        {/* Children (Order Review and Actions) */}
        {children &&
          children({
            isSubmitting,
            userInfo: userInfo,
            handleSubmit,
          })}
      </div>
    );
  }
);

export default UserInfoForm;
