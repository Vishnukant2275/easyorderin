import React from "react";
import styles from "./UserCart.module.css";

const OrderSummary = ({ subtotal, tax, deliveryFee, total, totalItems }) => {
  return (
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
  );
};

export default OrderSummary;