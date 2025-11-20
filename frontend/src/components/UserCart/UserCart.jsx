import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./UserCart.module.css";
import { useCart } from "../../context/CartContext";
import { useUserCart } from "./hooks/useUserCart";
import CartHeader from "./CartHeader";
import CartItems from "./CartItems";
import OrderSummary from "./OrderSummary";
import CheckoutModal from "./CheckoutModal";

const UserCart = () => {
  const { restaurantID, tableNumber } = useParams();
  const navigate = useNavigate();
  
  const {
    cart: cartItems,
    clearCart,
    getCartTotal,
    getTotalItems,
  } = useCart();

  const {
    restaurantInfo,
    showUserForm,
    specialInstructions,
    setSpecialInstructions,
    handleProceedToCheckout,
    handleCloseModal,
    isSubmitting,
  } = useUserCart(restaurantID, tableNumber);

  const subtotal = getCartTotal();
  const sgst = subtotal * 0.025;
  const cgst = subtotal * 0.025;
  const deliveryFee = 0;
  const total = subtotal + sgst + cgst + deliveryFee;
  const totalItems = getTotalItems();
  const GST = restaurantInfo?.GST || null ;

  if (!restaurantInfo) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.cartContainer}>
      <CartHeader 
        restaurantID={restaurantID}
        tableNumber={tableNumber}
        cartItems={cartItems}
        clearCart={clearCart}
        navigate={navigate}
      />

      {restaurantInfo && (
        <div className={styles.restaurantInfo}>
          <h3 className={styles.restaurantName}>
            {restaurantInfo.restaurantName}
          </h3>
          <p className={styles.tableInfo}>Table {tableNumber}</p>
        </div>
      )}

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
            <CartItems cartItems={cartItems} />
            
            <OrderSummary 
              subtotal={subtotal}
              sgst={sgst}
              cgst={cgst}
              deliveryFee={deliveryFee}
              total={total}
              totalItems={totalItems}
              GST={GST||"Not available"}
            />

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
            </button>
          </div>
        </footer>
      )}

      <CheckoutModal 
        showUserForm={showUserForm}
        handleCloseModal={handleCloseModal}
        restaurantID={restaurantID}
        tableNumber={tableNumber}
        cartItems={cartItems}
        total={total}
        specialInstructions={specialInstructions}
      />
    </div>
  );
};

export default UserCart;