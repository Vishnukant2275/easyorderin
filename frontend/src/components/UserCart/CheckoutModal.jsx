import React, { useState, useEffect } from "react";
import styles from "./UserCart.module.css";
import UserInfoForm from "./UserInfoForm";
import api from "../../services/api";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../context/UserContext";

const OrderReview = ({ cartItems, total }) => {
  return (
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
  );
};

const ModalActions = ({
  onCancel,
  onConfirm,
  isSubmitting,
  isFormValid,
  isPaymentConfirmed,
}) => {
  return (
    <div className={styles.modalActions}>
      <button
        type="button"
        className={styles.cancelButton}
        onClick={onCancel}
        disabled={isSubmitting}
      >
        Cancel
      </button>
      <button
        type="button"
        className={styles.confirmButton}
        onClick={onConfirm}
        disabled={isSubmitting || !isFormValid || !isPaymentConfirmed}
      >
        {isSubmitting ? "Placing Order..." : "Place Order"}
      </button>
    </div>
  );
};

const CheckoutModal = ({
  showUserForm,
  handleCloseModal,
  restaurantID,
  tableNumber,
  cartItems,
  total,
  specialInstructions,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);
  const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { user: contextUser, isAuthenticated } = useUser();

  // Extract user from session/localStorage on component mount
  useEffect(() => {
    const getUserFromSession = () => {
      if (contextUser && isAuthenticated) {
        setCurrentUser(contextUser);
        return;
      }

      const storedUser = localStorage.getItem("currentUser");
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
          return;
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }

      const sessionUser = sessionStorage.getItem("currentUser");
      if (sessionUser) {
        try {
          setCurrentUser(JSON.parse(sessionUser));
          return;
        } catch (error) {
          console.error("Error parsing session user:", error);
        }
      }

      setCurrentUser(null);
    };

    getUserFromSession();
  }, [contextUser, isAuthenticated]);

  const handleFormSubmit = async (
    userInfo,
    selectedPaymentMethod,
    paymentConfirmed
  ) => {
    setIsSubmitting(true);

    try {
      // Prepare order data for the new merged route
      const menuItems = cartItems.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
        notes: item.notes || "",
      }));

      const orderData = {
        name: userInfo.name,
        phone: userInfo.mobile || userInfo.phone,
        menuItems: menuItems,
        specialInstructions: specialInstructions || "",
        paymentMethod: selectedPaymentMethod,
      };

   

      // Call the new merged API route
      const response = await api.post(
        `/restaurant/${restaurantID}/table/${tableNumber}/placeOrder`,
        orderData
      );

      if (response.data.success) {
        // Clear cart and show success message
        if (selectedPaymentMethod === "razorpay") {
          alert("Order placed successfully! Your payment has been confirmed.");
        } else {
          alert(
            "Order placed successfully! Please pay at the counter when collecting your order."
          );
        }

        handleCloseModal();

        // Navigate to orders page
        window.location.href = `/restaurant/${restaurantID}/table/${tableNumber}/orders`;

        // Clear cart from localStorage
        localStorage.removeItem(`cart_${restaurantID}_${tableNumber}`);

        // Store user info in localStorage for future orders
        if (response.data.user) {
          localStorage.setItem(
            "currentUser",
            JSON.stringify({
              _id: response.data.user._id,
              name: response.data.user.name,
              phone: response.data.user.phone,
            })
          );
        }
      } else {
        alert(
          "Failed to place order: " +
            (response.data.message || response.data.error)
        );
      }
    } catch (error) {
      console.error("Error placing order:", error);

      // Handle specific error cases
      if (error.response?.status === 409) {
        alert(
          "This phone number is already registered. Please use a different number or contact support."
        );
      } else if (error.response?.status === 400) {
        alert(
          "Invalid data provided: " +
            (error.response.data.message || "Please check your information")
        );
      } else if (error.response?.status === 403) {
        alert(
          "Cannot place order: " +
            (error.response.data.message || "Table is not available")
        );
      } else if (error.response?.status === 404) {
        alert("Restaurant or table not found. Please try again.");
      } else {
        alert(
          "Failed to place order. Please try again. Error: " +
            (error.response?.data?.message || error.message)
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormValidityChange = (isValid) => {
    // Form is valid if we have user info (from context or form) and payment is confirmed
    setIsFormValid(isValid);
  };

  // Handle payment confirmation state from UserInfoForm
  const handlePaymentConfirmationChange = (confirmed) => {
    setIsPaymentConfirmed(confirmed);
  };

  if (!showUserForm) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Complete Your Order</h2>
          <p className={styles.modalSubtitle}>
            {currentUser
              ? `Ordering as ${currentUser.name}`
              : "Please provide your details to place the order"}
          </p>
        </div>

        <UserInfoForm
          restaurantID={restaurantID}
          tableNumber={tableNumber}
          cartItems={cartItems}
          total={total}
          specialInstructions={specialInstructions}
          onClose={handleCloseModal}
          onSubmit={handleFormSubmit}
          onFormValidityChange={handleFormValidityChange}
          onPaymentConfirmationChange={handlePaymentConfirmationChange}
          currentUser={currentUser}
        >
          {(formData) => (
            <>
              <OrderReview cartItems={cartItems} total={total} />
              <ModalActions
                onCancel={handleCloseModal}
                onConfirm={() => formData.handleSubmit()}
                isSubmitting={isSubmitting}
                isFormValid={isFormValid}
                isPaymentConfirmed={isPaymentConfirmed}
              />
            </>
          )}
        </UserInfoForm>
      </div>
    </div>
  );
};

export default CheckoutModal;
