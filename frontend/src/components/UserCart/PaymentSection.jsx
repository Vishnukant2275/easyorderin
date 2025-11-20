import React, { useState, useEffect } from "react";
import styles from "./UserCart.module.css";
import api from "../../services/api";

const PaymentSection = ({
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  isPaymentConfirmed,
  setIsPaymentConfirmed,
  total,
  restaurantID,
  userInfo, // Add userInfo prop to get name and mobile number
}) => {
  const [loadingPayment, setLoadingPayment] = useState(false);

  // 🧾 Razorpay Payment Handler
  const handleRazorpayPayment = async () => {
    try {
      setLoadingPayment(true);

      // 1️⃣ Create order on backend
      const { data } = await api.post("/razorpay/create-order", {
        amount: total,
        currency: "INR",
        receipt: `receipt_${Date.now()}`,
      });

      if (!data?.orderId) {
        alert("Error creating Razorpay order");
        setLoadingPayment(false);
        return;
      }

      // 2️⃣ Initialize Razorpay payment with actual user data
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: data.currency,
        name: "Restaurant Payment",
        description: "Order Payment",
        order_id: data.orderId,
        handler: async function (response) {
          setIsPaymentConfirmed(true);

          // Optional: Send payment verification to backend
          // await api.post("/razorpay/verify-payment", response);
        },
        prefill: {
          name: userInfo?.name || "Customer",
          email: "customer@example.com", // You might want to get this from userInfo too
          contact: userInfo?.mobile || userInfo?.phone || "9999999999",
        },
        theme: {
          color: "#F37254",
        },
        modal: {
          ondismiss: function () {
            setLoadingPayment(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Error during Razorpay payment:", error);
      alert("Payment failed. Please try again.");
      setLoadingPayment(false);
    }
  };

  // Reset payment confirmation if method changes
  useEffect(() => {
    if (selectedPaymentMethod && isPaymentConfirmed) {
      setIsPaymentConfirmed(false);
    }
  }, [selectedPaymentMethod]);

  return (
    <div className={styles.paymentSection}>
      <div className={styles.sectionHeader}>
        <h4 className={styles.paymentTitle}>Payment Method</h4>
        <p className={styles.paymentSubtitle}>
          Choose how you would like to pay for your order
        </p>
      </div>

      {/* User Information Display */}
      {userInfo && (
        <div className={styles.userInfoDisplay}>
          <div className={styles.userInfoHeader}>
            <span className={styles.userInfoIcon}>👤</span>
            <span className={styles.userInfoTitle}>Ordering as</span>
          </div>
          <div className={styles.userInfoDetails}>
            <div className={styles.userInfoItem}>
              <span className={styles.userInfoLabel}>Name:</span>
              <span className={styles.userInfoValue}>{userInfo.name}</span>
            </div>
            <div className={styles.userInfoItem}>
              <span className={styles.userInfoLabel}>Mobile:</span>
              <span className={styles.userInfoValue}>
                {userInfo.mobile || userInfo.phone}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Payment Status Banner */}
      {isPaymentConfirmed && (
        <div className={styles.successBanner}>
          <div className={styles.successIcon}>✅</div>
          <div className={styles.successContent}>
            <div className={styles.successTitle}>Payment Confirmed!</div>
            <div className={styles.successText}>
              Your payment of ₹{total.toFixed(2)} has been processed
              successfully. Click "Place Order" to complete your order.
            </div>
          </div>
        </div>
      )}

      {/* Payment Options */}
      <div className={styles.paymentOptions}>
        <label
          className={`${styles.paymentOption} ${
            isPaymentConfirmed ? styles.disabledOption : ""
          }`}
        >
          <input
            type="radio"
            name="paymentMethod"
            value="razorpay"
            checked={selectedPaymentMethod === "razorpay"}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className={styles.radioInput}
            disabled={isPaymentConfirmed}
          />
          <span className={styles.radioCustom}></span>
          <div className={styles.optionContent}>
            <div className={styles.optionHeader}>
              <span className={styles.optionTitle}>Pay Online</span>
              <div className={styles.paymentBadge}>Recommended</div>
            </div>
            <span className={styles.optionDescription}>
              Secure payment via UPI, Credit/Debit Cards, Net Banking
            </span>
            <div className={styles.paymentIcons}>
              <span className={styles.paymentIcon}>💳</span>
              <span className={styles.paymentIcon}>📱</span>
              <span className={styles.paymentIcon}>🏦</span>
            </div>
          </div>
          {isPaymentConfirmed && <div className={styles.disabledOverlay}></div>}
        </label>
      </div>

      {/* Razorpay Payment Section */}
      {selectedPaymentMethod === "razorpay" && !isPaymentConfirmed && (
        <div className={styles.razorpaySection}>
          <div className={styles.razorpayCard}>
            <div className={styles.razorpayHeader}>
              <div className={styles.razorpayIcon}>🔒</div>
              <div className={styles.razorpayInfo}>
                <h5 className={styles.razorpayTitle}>Secure Online Payment</h5>
                <p className={styles.razorpaySubtitle}>
                  Protected by Razorpay • PCI DSS Certified
                </p>
              </div>
            </div>

            {/* Order Summary */}
            <div className={styles.orderSummary}>
              <div className={styles.summaryRow}>
                <span>Order Amount:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className={styles.summaryRow}>
                <span>Convenience Fee:</span>
                <span className={styles.freeText}>FREE</span>
              </div>
              <div className={styles.summaryDivider}></div>
              <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                <span>Total to Pay:</span>
                <span className={styles.totalAmount}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Customer Information Preview */}
            {userInfo && (
              <div className={styles.customerPreview}>
                <div className={styles.customerPreviewTitle}>
                  Customer Information
                </div>
                <div className={styles.customerPreviewDetails}>
                  <div className={styles.customerPreviewItem}>
                    <span>Name:</span>
                    <span>{userInfo.name}</span>
                  </div>
                  <div className={styles.customerPreviewItem}>
                    <span>Mobile:</span>
                    <span>{userInfo.mobile || userInfo.phone}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Payment Steps */}
            <div className={styles.paymentSteps}>
              <div className={styles.step}>
                <div className={styles.stepIndicator}>
                  <span className={styles.stepNumber}>1</span>
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>Initiate Payment</div>
                  <div className={styles.stepDescription}>
                    Click the payment button below
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepIndicator}>
                  <span className={styles.stepNumber}>2</span>
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>Complete Payment</div>
                  <div className={styles.stepDescription}>
                    Your details will be pre-filled for faster checkout
                  </div>
                </div>
              </div>

              <div className={styles.step}>
                <div className={styles.stepIndicator}>
                  <span className={styles.stepNumber}>3</span>
                </div>
                <div className={styles.stepContent}>
                  <div className={styles.stepTitle}>Automatic Confirmation</div>
                  <div className={styles.stepDescription}>
                    Payment verified instantly
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <div className={styles.paymentAction}>
              <button
                type="button"
                onClick={handleRazorpayPayment}
                className={styles.razorpayButton}
                disabled={loadingPayment}
              >
                {loadingPayment ? (
                  <>
                    <div className={styles.spinner}></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <div className={styles.buttonIcon}>💳</div>
                    <div className={styles.buttonContent}>
                      <div className={styles.buttonPrimary}>
                        Pay ₹{total.toFixed(2)}
                      </div>
                      <div className={styles.buttonSecondary}>
                        {userInfo?.name
                          ? `Pay as ${userInfo.name}`
                          : "Secure Payment • Razorpay"}
                      </div>
                    </div>
                    <div className={styles.arrowIcon}>→</div>
                  </>
                )}
              </button>

              <div className={styles.securityNote}>
                <span className={styles.lockIcon}>🔒</span>
                Your payment details are secured with 256-bit SSL encryption
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Accepted Payment Methods */}
      {selectedPaymentMethod === "razorpay" && !isPaymentConfirmed && (
        <div className={styles.acceptedMethods}>
          <div className={styles.methodsTitle}>We Accept</div>
          <div className={styles.methodsGrid}>
            <div className={styles.methodItem}>
              <span className={styles.methodIcon}>📱</span>
              <span>UPI</span>
            </div>
            <div className={styles.methodItem}>
              <span className={styles.methodIcon}>💳</span>
              <span>Cards</span>
            </div>
            <div className={styles.methodItem}>
              <span className={styles.methodIcon}>🏦</span>
              <span>Net Banking</span>
            </div>
            <div className={styles.methodItem}>
              <span className={styles.methodIcon}>💰</span>
              <span>Wallets</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;
