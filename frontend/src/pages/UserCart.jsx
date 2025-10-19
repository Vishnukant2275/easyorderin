import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UserCart.module.css";
import api from "../services/api";
import { useCart } from "../context/CartContext";
import { useUser } from "../context/UserContext"; // Import user context

const UserCart = () => {
  const { restaurantID, tableNumber } = useParams();
  const navigate = useNavigate();
  const [specialInstructions, setSpecialInstructions] = useState("");
  const [restaurantInfo, setRestaurantInfo] = useState(null);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showOtpSection, setShowOtpSection] = useState(false);
  const [isOtpVerified, setIsOtpVerified] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpTimer, setOtpTimer] = useState(0);
  const [otpMessage, setOtpMessage] = useState(null);

  const [userInfo, setUserInfo] = useState({
    name: "",
    mobile: "",
    otp: "",
  });
  const [formErrors, setFormErrors] = useState({});

  const {
    cart: cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    getCartTotal,
    getTotalItems,
  } = useCart();

  const { user, isLoggedIn } = useUser(); // Get user from context

  // Check if user is already logged in and pre-fill user info
  useEffect(() => {
    if (isLoggedIn && user) {
      setUserInfo({
        name: user.name || "",
        mobile: user.phone || "",
        otp: "",
      });
      setIsOtpVerified(true); // User is already verified via session
    }
  }, [isLoggedIn, user]);

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
      const response = await api.get(`/user/send-otp?phone=${userInfo.mobile}`);

      if (response.data.success) {
        setOtpMessage({ type: "success", text: "OTP sent successfully!" });
        setShowOtpSection(true);
        startOtpTimer();
      } else {
        setOtpMessage({
          type: "error",
          text: response.data.message || "Failed to send OTP",
        });
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      setOtpMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to send OTP. Please try again.",
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
      const response = await api.post("/user/verify-otp", {
        phone: userInfo.mobile,
        otp: userInfo.otp,
      });

      if (response.data.success) {
        setOtpMessage({ type: "success", text: "OTP verified successfully!" });
        setIsOtpVerified(true);
      } else {
        setOtpMessage({
          type: "error",
          text: response.data.message || "Invalid OTP",
        });
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpMessage({
        type: "error",
        text:
          error.response?.data?.message ||
          "Failed to verify OTP. Please try again.",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const startOtpTimer = () => {
    setOtpTimer(60); // 60 seconds
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

  const handleUserInfoChange = (e) => {
    const { name, value } = e.target;

    // Only allow numbers for mobile and OTP
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

    // Clear errors when user types
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }

    // Clear OTP message when user changes mobile
    if (name === "mobile" && otpMessage) {
      setOtpMessage(null);
      setShowOtpSection(false);
      setIsOtpVerified(false);
      setUserInfo((prev) => ({ ...prev, otp: "" }));
    }
  };

  useEffect(() => {
    const fetchRestaurantInfo = async () => {
      try {
        const res = await api.get(`/restaurant/${restaurantID}`);
        if (res.data.success) {
          setRestaurantInfo(res.data.restaurant);
        }
      } catch (error) {
        console.error("Error fetching restaurant info:", error);
      }
    };

    fetchRestaurantInfo();
  }, [restaurantID]);

  const handleQuantityChange = (id, change) => {
    updateQuantity(id, change);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  const handleClearCart = () => {
    clearCart();
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

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Direct checkout for logged-in users
  const handleDirectCheckout = async () => {
    if (!isLoggedIn || !user) {
      setShowUserForm(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await handleCheckout(user._id);
    } catch (error) {
      console.error("Error in direct checkout:", error);
      alert("Failed to place order. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleUserInfoSubmit = async (e) => {
    e.preventDefault();

    // If user is already logged in, use direct checkout
    if (isLoggedIn && user) {
      await handleDirectCheckout();
      return;
    }

    setIsSubmitting(true);

    if (!validateForm()) {
      setIsSubmitting(false);
      return;
    }

    try {
      // First, create or check user
      const userResponse = await api.post("/user", {
        name: userInfo.name.trim(),
        phone: userInfo.mobile.trim(),
      });

      if (userResponse.data.success) {
        // User created or exists, now place the order
        await handleCheckout(userResponse.data.data._id);
      } else {
        // Handle specific user creation errors
        if (
          userResponse.data.error ===
          "User already exists with this phone number"
        ) {
          // User exists, use the provided userId to place order
          await handleCheckout(userResponse.data.userId);
        } else {
          alert("Failed to create user: " + userResponse.data.error);
          setIsSubmitting(false);
        }
      }
    } catch (error) {
      console.error("Error in user creation:", error);

      if (
        error.response?.data?.error ===
        "User already exists with this phone number"
      ) {
        // If user exists, use the provided userId
        await handleCheckout(error.response.data.userId);
      } else if (
        error.response?.data?.error === "Phone number already registered"
      ) {
        // Handle duplicate phone error
        alert(
          "This phone number is already registered. Please use a different number."
        );
        setIsSubmitting(false);
      } else if (error.response?.data?.error) {
        alert("Failed to create user: " + error.response.data.error);
        setIsSubmitting(false);
      } else {
        alert("Failed to create user. Please try again.");
        setIsSubmitting(false);
      }
    }
  };

  const handleCheckout = async (userId = null) => {
    try {
      // Transform cart items to match the API expected format
      const menuItems = cartItems.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
        notes: specialInstructions,
      }));

      const orderData = {
        menuItems,
        specialInstructions,
        customerName: userInfo.name.trim(),
        customerPhone: userInfo.mobile.trim(),
        userId: userId, // Include userId in order data if available
      };

      const res = await api.post(
        `/restaurant/${restaurantID}/table/${tableNumber}/placeOrder`,
        orderData
      );

      if (res.data.success) {
        // Clear cart on successful order
        clearCart();
        // Navigate to orders page or show success message
        navigate(`/restaurant/${restaurantID}/table/${tableNumber}/orders`);
      } else {
        alert("Failed to place order: " + res.data.message);
        setShowUserForm(false); // Close the form on error
      }
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again.");
      setShowUserForm(false); // Close the form on error
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  };

  const handleProceedToCheckout = () => {
    // If user is already logged in, proceed directly to checkout
    if (isLoggedIn && user) {
      handleDirectCheckout();
    } else {
      // Show user form for guest users
      setShowUserForm(true);
    }
  };

  const subtotal = getCartTotal();
  const tax = subtotal * 0.05; // 5% tax
  const deliveryFee = 40;
  const total = subtotal + tax + deliveryFee;
  const totalItems = getTotalItems();

  return (
    <div className={styles.cartContainer}>
      {/* Header */}
      <header className={styles.cartHeader}>
        <div className={styles.headerContent}>
          {cartItems.length > 0 && (
            <button
              className={styles.backButton}
              onClick={() =>
                navigate(
                  `/restaurant/${restaurantID}/table/${tableNumber}/getMenu`
                )
              }
            >
              ← Back to Menu
            </button>
          )}
          <h1 className={styles.headerTitle}>Your Cart</h1>
          <div className={styles.cartStats}>
            <span className={styles.itemCount}>{cartItems.length} items</span>
            {cartItems.length > 0 && (
              <button
                className={styles.clearCartButton}
                onClick={handleClearCart}
              >
                Clear All
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Restaurant Info */}
      {restaurantInfo && (
        <div className={styles.restaurantInfo}>
          <h3 className={styles.restaurantName}>
            {restaurantInfo.restaurantName}
          </h3>
          <p className={styles.tableInfo}>Table {tableNumber}</p>
          {isLoggedIn && (
            <div className={styles.userBadge}>👋 Welcome, {user?.name}</div>
          )}
        </div>
      )}

      {/* Cart Items */}
      <main className={styles.cartMain}>
        {cartItems.length === 0 ? (
          <div className={styles.emptyCart}>
            <div className={styles.emptyIcon}>🛒</div>
            <h2 className={styles.emptyTitle}>Your cart is empty</h2>
            <p className={styles.emptyText}>
              Add some delicious items from the menu
            </p>
            <button
              className={styles.browseButton}
              onClick={() =>
                navigate(
                  `/restaurant/${restaurantID}/table/${tableNumber}/getMenu`
                )
              }
            >
              Browse Menu
            </button>
          </div>
        ) : (
          <>
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <div className={styles.itemImage}>
                    {/* <img
                      src={
                        item.image
                          ? `${window.location.origin}/uploads/${item.image}`
                          : "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23666'%3E🍽️%3C/text%3E%3C/svg%3E"
                      }
                      alt={item.name}
                      onError={(e) => {
                        e.target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' viewBox='0 0 80 80'%3E%3Crect width='80' height='80' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='12' fill='%23666'%3E🍽️%3C/text%3E%3C/svg%3E";
                      }}
                    /> */}
                  </div>

                  <div className={styles.itemDetails}>
                    <div className={styles.itemHeader}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <span
                        className={`${styles.itemType} ${
                          item.isVegetarian ? styles.veg : styles.nonveg
                        }`}
                      >
                        {item.isVegetarian ? "🥬 Veg" : "🍗 Non-Veg"}
                      </span>
                    </div>

                    <div className={styles.itemControls}>
                      <div className={styles.quantityControls}>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => handleQuantityChange(item.id, -1)}
                        >
                          -
                        </button>
                        <span className={styles.quantity}>{item.quantity}</span>
                        <button
                          className={styles.quantityBtn}
                          onClick={() => handleQuantityChange(item.id, 1)}
                        >
                          +
                        </button>
                      </div>

                      <div className={styles.priceSection}>
                        <span className={styles.itemPrice}>
                          ₹{item.price * item.quantity}
                        </span>
                        <span className={styles.unitPrice}>
                          (₹{item.price} each)
                        </span>
                        <button
                          className={styles.removeBtn}
                          onClick={() => handleRemoveItem(item.id)}
                          title="Remove item"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <h3 className={styles.summaryTitle}>Order Summary</h3>

              <div className={styles.summaryRow}>
                <span>Subtotal ({totalItems} items)</span>
                <span>₹{subtotal}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Tax (5%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </div>

              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>₹{deliveryFee}</span>
              </div>

              <div className={styles.summaryDivider}></div>

              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Special Instructions */}
            <div className={styles.specialInstructions}>
              <h4 className={styles.instructionsTitle}>Special Instructions</h4>
              <textarea
                className={styles.instructionsInput}
                placeholder="Any special requests or dietary restrictions?"
                rows="3"
                value={specialInstructions}
                onChange={(e) => setSpecialInstructions(e.target.value)}
              />
            </div>
          </>
        )}
      </main>

      {/* Checkout Footer */}
      {cartItems.length > 0 && (
        <footer className={styles.checkoutFooter}>
          <div className={styles.footerContent}>
            <div className={styles.totalSection}>
              <span className={styles.totalLabel}>Total</span>
              <span className={styles.totalAmount}>₹{total.toFixed(2)}</span>
            </div>
            <button
              className={styles.checkoutButton}
              onClick={handleProceedToCheckout}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Processing..." : "Proceed to Checkout"}
              {isLoggedIn && " (Logged In)"}
            </button>
          </div>
        </footer>
      )}

      {/* User Information Modal - Only show for guest users */}
      {showUserForm && !isLoggedIn && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>Complete Your Order</h2>
              <p className={styles.modalSubtitle}>
                Please provide your details to place the order
              </p>
            </div>

            <form onSubmit={handleUserInfoSubmit} className={styles.userForm}>
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
                </div>
                {formErrors.mobile && (
                  <span className={styles.errorText}>{formErrors.mobile}</span>
                )}
              </div>

              {/* OTP Verification Section */}
              {showOtpSection && (
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

              <div className={styles.orderReview}>
                <h4 className={styles.reviewTitle}>Order Review</h4>
                <div className={styles.reviewItems}>
                  {cartItems.map((item) => (
                    <div key={item.id} className={styles.reviewItem}>
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className={styles.reviewTotal}>
                  <strong>Total: ₹{total.toFixed(2)}</strong>
                </div>
              </div>

              <div className={styles.modalActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setShowUserForm(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={styles.confirmButton}
                  disabled={!isOtpVerified || isSubmitting}
                >
                  {isSubmitting ? "Placing Order..." : "Place Order"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCart;
