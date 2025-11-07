import React from "react";
import styles from "./UserCart.module.css";
import { useCart } from "../../context/CartContext";

const CartItem = ({ item, onQuantityChange, onRemove }) => {
  return (
    <div className={styles.cartItem}>
      <div className={styles.itemImage}>
        {/* Image placeholder */}
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
              onClick={() => onQuantityChange(item.id, -1)}
            >
              -
            </button>
            <span className={styles.quantity}>{item.quantity}</span>
            <button
              className={styles.quantityBtn}
              onClick={() => onQuantityChange(item.id, 1)}
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
              onClick={() => onRemove(item.id)}
              title="Remove item"
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const CartItems = ({ cartItems }) => {
  const { updateQuantity, removeFromCart } = useCart();

  const handleQuantityChange = (id, change) => {
    updateQuantity(id, change);
  };

  const handleRemoveItem = (id) => {
    removeFromCart(id);
  };

  return (
    <div className={styles.cartItems}>
      {cartItems.map((item) => (
        <CartItem
          key={item.id}
          item={item}
          onQuantityChange={handleQuantityChange}
          onRemove={handleRemoveItem}
        />
      ))}
    </div>
  );
};

export default CartItems;