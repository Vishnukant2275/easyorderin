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

const ModalActions = ({ onCancel, onConfirm, isSubmitting, isFormValid }) => {
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
        disabled={!isFormValid || isSubmitting}
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
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();
  const { user: contextUser, isAuthenticated } = useUser(); // From your UserContext

  // Extract user from session/localStorage on component mount
  useEffect(() => {
    const getUserFromSession = () => {
      // Try multiple sources for user data
      if (contextUser && isAuthenticated) {
        setCurrentUser(contextUser);
        return;
      }

      // Check localStorage
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
          return;
        } catch (error) {
          console.error("Error parsing stored user:", error);
        }
      }

      // Check sessionStorage
      const sessionUser = sessionStorage.getItem('currentUser');
      if (sessionUser) {
        try {
          setCurrentUser(JSON.parse(sessionUser));
          return;
        } catch (error) {
          console.error("Error parsing session user:", error);
        }
      }

      console.log("No user found in session");
    };

    getUserFromSession();
  }, [contextUser, isAuthenticated]);

  const handleFormSubmit = async (
    userInfo,
    selectedPaymentMethod,
    isPaymentConfirmed
  ) => {
    setIsSubmitting(true);

    try {
      // Use user from session OR from form if guest checkout
      const userToUse = currentUser || userInfo;
      
      if (!userToUse || !userToUse._id) {
        throw new Error("User not authenticated. Please log in.");
      }

      // Prepare order data according to new schema
      const menuItems = cartItems.map((item) => ({
        name: item.name,           // Store name directly
        price: item.price,         // Store price directly
        quantity: item.quantity,
        notes: item.notes || specialInstructions || "",
        menuId: item.id,           // Optional: keep reference
      }));

      const orderData = {
        restaurantId: restaurantID,
        tableNumber: parseInt(tableNumber),
        menuItems: menuItems,
        totalPrice: total,
        specialInstructions: specialInstructions || "",
        paymentMethod: selectedPaymentMethod,
        customerName: userToUse.name || userToUse.username || "Guest",
        customerPhone: userToUse.phone || userToUse.mobile || "",
        // Note: isPaid field will be handled by the backend based on payment method
      };

      console.log("Sending order data:", orderData);
      console.log("Using user ID:", userToUse._id);

      // Call the API with the authenticated user's ID
      const response = await api.post(
        `/user/${userToUse._id}/orders`,
        orderData
      );

      if (response.data.success) {
        // Clear cart and show success message
        if (selectedPaymentMethod === "qr") {
          alert("Order placed successfully! Your payment has been confirmed.");
        } else {
          alert(
            "Order placed successfully! Please pay at the counter when collecting your order."
          );
        }
        handleCloseModal();

        // Navigate to orders page
        navigate(`/restaurant/${restaurantID}/table/${tableNumber}/orders`);
        
        // Clear cart from localStorage
        localStorage.removeItem(`cart_${restaurantID}_${tableNumber}`);
        
      } else {
        alert("Failed to place order: " + (response.data.error || response.data.message));
      }
    } catch (error) {
      console.error("Error placing order:", error);
      if (error.response?.status === 401) {
        alert("Please log in to place an order.");
        navigate('/login');
      } else {
        alert("Failed to place order. Please try again. Error: " + (error.response?.data?.error || error.message));
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormValidityChange = (isValid) => {
    // If user is authenticated, form is always valid
    // If guest, depend on form validation
    setIsFormValid(currentUser ? true : isValid);
  };

  // Show login prompt if no user session
  if (!showUserForm) return null;

  if (!currentUser && !isAuthenticated) {
    return (
      <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
          <div className={styles.modalHeader}>
            <h2 className={styles.modalTitle}>Authentication Required</h2>
            <p className={styles.modalSubtitle}>
              Please log in to place an order
            </p>
          </div>
          <div className={styles.authPrompt}>
            <p>You need to be logged in to complete your order.</p>
            <div className={styles.modalActions}>
              <button
                className={styles.cancelButton}
                onClick={handleCloseModal}
              >
                Cancel
              </button>
              <button
                className={styles.confirmButton}
                onClick={() => navigate(`/restaurant/${restaurantID}/table/${tableNumber}/account`)}
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Complete Your Order</h2>
          <p className={styles.modalSubtitle}>
            {currentUser 
              ? `Ordering as ${currentUser.name || currentUser.username}`
              : "Please provide your details to place the order"
            }
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
          currentUser={currentUser} // Pass user data to form
        >
          {(formData) => (
            <>
              <OrderReview cartItems={cartItems} total={total} />
              <ModalActions
                onCancel={handleCloseModal}
                onConfirm={() => formData.handleSubmit()}
                isSubmitting={isSubmitting}
                isFormValid={isFormValid}
              />
            </>
          )}
        </UserInfoForm>
      </div>
    </div>
  );
};

export default CheckoutModal;