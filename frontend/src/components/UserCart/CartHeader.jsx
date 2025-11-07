import React from "react";
import styles from "./UserCart.module.css";

const CartHeader = ({ restaurantID, tableNumber, cartItems, clearCart, navigate }) => {
  return (
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
              onClick={clearCart}
            >
              Clear All
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default CartHeader;