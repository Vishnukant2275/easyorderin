import React from "react";
import styles from "./UserCart.module.css";

const OrderSummary = ({ subtotal, sgst,cgst, deliveryFee, total, GST,totalItems }) => {
  return (
    <div className={styles.orderSummary}>
      <h3 className={styles.summaryTitle}>Order Summary</h3>
    <div className={styles.summaryRow}>
        <span>GST Number</span>
        <span>{GST}</span>
      </div>
      <div className={styles.summaryRow}>
        <span>Subtotal ({totalItems} items)</span>
        <span>₹{subtotal}</span>
      </div>

      <div className={styles.summaryRow}>
        <span>State Govt (SGST) (2.5%)</span>
        <span>₹{sgst.toFixed(2)}</span>
      </div>

      <div className={styles.summaryRow}>
        <span>Central Govt (CSGT) (2.5%)</span>
        <span>₹{cgst.toFixed(2)}</span>
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