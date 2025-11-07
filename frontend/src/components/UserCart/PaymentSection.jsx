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
}) => {
  const [paymentQRCodes, setPaymentQRCodes] = useState([]);

  useEffect(() => {
    fetchPaymentQRCodes();
  }, []);

  const fetchPaymentQRCodes = async () => {
    try {
      const response = await api.get(
        `/restaurant/${restaurantID}/payment-qrcodes`
      );
      if (response.data.success) {
        setPaymentQRCodes(response.data.qrCodes || []);
      }
    } catch (error) {
      console.error("Error fetching payment QR codes:", error);
    }
  };

  const handlePaymentConfirmation = () => {
    setIsPaymentConfirmed(true);
    alert("Thank you! Your payment confirmation has been recorded.");
  };

  return (
    <div className={styles.paymentSection}>
      <h4 className={styles.paymentTitle}>Payment Method</h4>
      <p className={styles.paymentSubtitle}>
        Choose how you would like to pay for your order
      </p>
      
      {/* Payment Instructions */}
     <div className={styles.paymentInstructions}>
  <div className={styles.instructionIcon}>⚠️</div>
  <div className={styles.instructionContent}>
    <div className={styles.instructionHeading}>Payment Verification Required</div>
    <div className={styles.instructionText}>
      Your order will be confirmed only after the payment is verified by the restaurant. 
      Please keep your payment receipt ready for verification.
    </div>
  </div>
</div>
      
      <div className={styles.paymentOptions}>
        <label className={styles.paymentOption}>
          <input
            type="radio"
            name="paymentMethod"
            value="counter"
            checked={selectedPaymentMethod === "counter"}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className={styles.radioInput}
          />
          <span className={styles.radioCustom}></span>
          <div className={styles.optionContent}>
            <span className={styles.optionTitle}>Pay at Counter</span>
            <span className={styles.optionDescription}>
              Pay now at the restaurant counter to start the preparation of your order
            </span>
          </div>
        </label>

        <label className={styles.paymentOption}>
          <input
            type="radio"
            name="paymentMethod"
            value="qr"
            checked={selectedPaymentMethod === "qr"}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className={styles.radioInput}
          />
          <span className={styles.radioCustom}></span>
          <div className={styles.optionContent}>
            <span className={styles.optionTitle}>Pay Now with QR Code</span>
            <span className={styles.optionDescription}>
              Scan QR code to pay instantly using UPI
            </span>
          </div>
        </label>
      </div>

      {/* QR Code Payment Section */}
      {selectedPaymentMethod === "qr" && (
        <div className={styles.qrPaymentSection}>
          <div className={styles.qrPaymentHeader}>
            <h5 className={styles.qrPaymentTitle}>Scan to Pay</h5>
            <p className={styles.qrPaymentSubtitle}>
              Use any UPI app to scan the QR code and complete your payment
            </p>
          </div>
          
          {/* QR Payment Instructions */}
          <div className={styles.qrInstructions}>
            <div className={styles.steps}>
              <div className={styles.step}>
                <span className={styles.stepNumber}>1</span>
                <span className={styles.stepText}>Scan the QR code with your UPI app</span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>2</span>
                <span className={styles.stepText}>Enter the total amount: <strong>₹{total.toFixed(2)}</strong></span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>3</span>
                <span className={styles.stepText}>Complete the payment</span>
              </div>
              <div className={styles.step}>
                <span className={styles.stepNumber}>4</span>
                <span className={styles.stepText}>Click "I Have Paid" below</span>
              </div>
            </div>
            <div className={styles.warningNote}>
  <span className={styles.noteIcon}>⚠️</span>
  <div className={styles.noteContent}>
    <strong>Note:</strong> Order confirmation is subject to payment verification by the restaurant.
  </div>
</div>
          </div>
          
          <div className={styles.paymentMethods}>
            {paymentQRCodes.length > 0 ? (
              <div className={styles.qrCodesGrid}>
                {paymentQRCodes.map((qrCode) => (
                  <div key={qrCode._id} className={styles.qrCodeItem}>
                    <div className={styles.qrCodeHeader}>
                      <span className={styles.paymentMethodName}>
                        {qrCode.paymentMethod}
                      </span>
                      {qrCode.upiId && (
                        <span className={styles.upiId}>UPI: {qrCode.upiId}</span>
                      )}
                    </div>
                    
                    <div className={styles.qrCodeImageContainer}>
                      <img 
                        src={qrCode.imageBase64} 
                        alt={`${qrCode.paymentMethod} QR Code`}
                        className={styles.qrCodeImage}
                        onError={(e) => {
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }}
                      />
                      <div className={styles.qrCodeFallback}>
                        <span>📷</span>
                        <p>QR Code Image</p>
                      </div>
                    </div>
                    
                    {qrCode.note && (
                      <p className={styles.qrCodeNote}>{qrCode.note}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={styles.noQRCodes}>
                <p>No payment QR codes are available at the moment. Please select the pay at counter option.</p>
              </div>
            )}
          </div>

          <div className={styles.paymentConfirmation}>
            <label className={styles.paymentCheckbox}>
              <input
                type="checkbox"
                checked={isPaymentConfirmed}
                onChange={(e) => setIsPaymentConfirmed(e.target.checked)}
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxLabel}>
                I have completed the payment via QR code
              </span>
            </label>
            
            <button
              type="button"
              className={styles.confirmPaymentButton}
              onClick={handlePaymentConfirmation}
              disabled={isPaymentConfirmed}
            >
              {isPaymentConfirmed ? "✅ Payment Confirmed" : "📱 I Have Paid"}
            </button>
          </div>
        </div>
      )}

      {/* Pay at Counter Confirmation */}
      {selectedPaymentMethod === "counter" && (
        <div className={styles.counterPaymentSection}>
          <div className={styles.counterPaymentInfo}>
            <div className={styles.counterIcon}>💳</div>
            <h5 className={styles.counterTitle}>Pay at Counter</h5>
            <p className={styles.counterDescription}>
              You can pay using cash, card, or UPI when you collect your order at the restaurant counter.
            </p>
            
            {/* Counter Payment Instructions */}
            <div className={styles.counterInstructions}>
              <div className={styles.instructionSteps}>
                <div className={styles.instructionStep}>
                  <span className={styles.stepIndicator}>①</span>
                  <span>Make the payment at counter</span>
                </div>
                <div className={styles.instructionStep}>
                  <span className={styles.stepIndicator}>②</span>
                  <span>Place the order and Show your payment receipt to Manager </span>
                </div>
                <div className={styles.instructionStep}>
                  <span className={styles.stepIndicator}>③</span>
                  <span>Ask the manager to confirm your order</span>
                </div>
                <div className={styles.instructionStep}>
                  <span className={styles.stepIndicator}>④</span>
                  <span>Wait for order preparation</span>
                </div>
              </div>
              
              <div className={styles.importantNote}>
                <strong>Important:</strong> Your order will be prepared after payment is done. 
                Please proceed to the counter to pay and order collection.
              </div>
            </div>
          </div>
          
          <div className={styles.counterConfirmation}>
            <label className={styles.paymentCheckbox}>
              <input
                type="checkbox"
                checked={isPaymentConfirmed}
                onChange={(e) => setIsPaymentConfirmed(e.target.checked)}
                className={styles.checkboxInput}
              />
              <span className={styles.checkboxLabel}>
                I understand that I will pay at the counter then my order preparation will be started 
              </span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentSection;