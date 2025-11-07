import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import styles from "./UserOrders.module.css";
import {useNavigate} from 'react-router-dom';
const UserOrders = () => {
  const { user, isAuthenticated, getUserOrders } = useUser();
  const [activeTab, setActiveTab] = useState("active");
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const pathParts = window.location.pathname.split("/");
  const restaurantId = pathParts[2]; // gets '123'
  const tableNumber = pathParts[4]; // gets '5'
  const navigate = useNavigate();
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserOrders();
    }
  }, [isAuthenticated, user]);

  const fetchUserOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getUserOrders(user._id);

      if (response.success) {
        setOrders(response.data || []);
      } else {
        setError(response.error || "Failed to fetch orders");
      }
    } catch (err) {
      setError("Failed to load orders");
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  // Categorize orders into active and past
  const categorizedOrders = {
    active: orders.filter((order) =>
      ["pending", "confirmed", "preparing", "ready","cancelled"].includes(order.status)
    ),
    past: orders.filter((order) =>
      ["completed", "cancelled", "served"].includes(order.status)
    ),
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "#FF9800",
      confirmed: "#2196F3",
      preparing: "#FF9800",
      ready: "#4CAF50",
      completed: "#4CAF50",
      served: "#4CAF50",
      cancelled: "#F44336",
    };
    return colors[status] || "#666";
  };

  const getStatusText = (status) => {
    const statusTexts = {
      pending: "Pending",
      confirmed: "Confirmed",
      preparing: "Being Prepared",
      ready: "Ready for Pickup",
      completed: "Completed",
      served: "Served",
      cancelled: "Cancelled",
    };
    return statusTexts[status] || status;
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: "⏳",
      confirmed: "📋",
      preparing: "👨‍🍳",
      ready: "✅",
      completed: "🎉",
      served: "🎉",
      cancelled: "❌",
    };
    return icons[status] || "📦";
  };

  const formatTime = (timeString) => {
    if (!timeString) return "N/A";
    return new Date(timeString).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const calculateProgress = (status) => {
    const progress = {
      pending: 10,
      confirmed: 25,
      preparing: 50,
      ready: 75,
      completed: 100,
      served: 100,
      cancelled: 100,
    };
    return progress[status] || 0;
  };

  const calculateTotal = (order) => {
    if (order.totalPrice || order.total) {
      return order.totalPrice || order.total;
    }

    // Calculate from menu items if total not available
    if (order.menuItems) {
      return order.menuItems.reduce((sum, item) => {
        const itemTotal = (item.quantity || 1) * (item.price || 0);
        return sum + itemTotal;
      }, 0);
    }

    return 0;
  };

  const getOrderItems = (order) => {
  if (order.menuItems && order.menuItems.length > 0) {
    return order.menuItems.map((item) => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
      notes: item.notes || ""
    }));
  }
  return [];
};

  const handleReorder = async (orderId) => {
    // Implement reorder logic here
    console.log("Reorder order:", orderId);
    // You might want to add items to cart or create a new order
    alert("Reorder functionality coming soon!");
  };

  const handleTrackOrder = (orderId) => {
    // Implement order tracking
    console.log("Track order:", orderId);
    alert("Order tracking coming soon!");
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.ordersContainer}>
        <div className={styles.authRequired}>
          <div className={styles.authIcon}>🔒</div>
          <h2>Authentication Required</h2>
          <p>Please log in to view your orders</p>
          <button
            className={styles.loginButton}
            onClick={() => navigate( `/restaurant/${restaurantId}/table/${tableNumber}/account`)}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={styles.ordersContainer}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.ordersContainer}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2>Error Loading Orders</h2>
          <p>{error}</p>
          <button className={styles.retryButton} onClick={fetchUserOrders}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.ordersContainer}>
      {/* Header */}
      <header className={styles.ordersHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Your Orders</h1>
          <div className={styles.orderStats}>
            <span className={styles.activeCount}>
              {categorizedOrders.active.length} Active
            </span>
            <span className={styles.totalCount}>{orders.length} Total</span>
          </div>
        </div>
      </header>

      {/* Order Tabs */}
     <div className={styles.orderTabs}>
  <button
    className={`${styles.tab} ${
      activeTab === "active" ? styles.activeTab : ""
    }`}
    onClick={() => setActiveTab("active")}
  >
    <span className={styles.tabIcon}>🕒</span>
    Active Orders
    {categorizedOrders.active.length > 0 && (
      <span className={styles.tabBadge}>
        {categorizedOrders.active.length}
      </span>
    )}
  </button>
  <button
    className={`${styles.tab} ${
      activeTab === "past" ? styles.activeTab : ""
    }`}
    onClick={() => setActiveTab("past")}
  >
    <span className={styles.tabIcon}>📋</span>
    Order History
    {categorizedOrders.past.length > 0 && (
      <span className={styles.tabBadge}>
        {categorizedOrders.past.length}
      </span>
    )}
  </button>
</div>

{/* Orders List */}
<main className={styles.ordersMain}>
  {categorizedOrders[activeTab].length === 0 ? (
    <div className={styles.emptyOrders}>
      <div className={styles.emptyIcon}>
        {activeTab === "active" ? "🕒" : "📋"}
      </div>
      <h2 className={styles.emptyTitle}>
        {activeTab === "active" ? "No Active Orders" : "No Order History"}
      </h2>
      <p className={styles.emptyText}>
        {activeTab === "active"
          ? "You don't have any active orders at the moment"
          : "Your order history will appear here"}
      </p>
      {activeTab === "active" && (
        <button
          className={styles.browseButton}
          onClick={() =>
            (window.location.href = `/restaurant/${restaurantId}/table/${tableNumber}/getMenu`)
          }
        >
          Browse Menu
        </button>
      )}
    </div>
  ) : (
    <div className={styles.ordersList}>
      {categorizedOrders[activeTab].map((order) => {
        const total = calculateTotal(order);
        const orderItems = getOrderItems(order);

        return (
          <div key={order._id} className={styles.orderCard}>
            {/* Restaurant Header */}
            {(order.restaurant || order.restaurantId) && (
              <div className={styles.restaurantHeader}>
                <div className={styles.restaurantInfo}>
                  <span className={styles.restaurantIcon}>🏪</span>
                  <div className={styles.restaurantDetails}>
                    <h4 className={styles.restaurantName}>
                      {order.restaurant?.name || 
                       order.restaurant?.restaurantName || 
                       order.restaurantId?.restaurantName || 
                       order.restaurantId?.name || 
                       "Restaurant"}
                    </h4>
                    {order.tableNumber && (
                      <span className={styles.tableInfo}>
                        Table {order.tableNumber}
                      </span>
                    )}
                  </div>
                </div>
                <div className={styles.orderMeta}>
                  <span className={styles.orderTime}>
                    {formatDate(order.createdAt)} at {formatTime(order.createdAt)}
                  </span>
                </div>
              </div>
            )}

            {/* Order Header */}
            <div className={styles.orderHeader}>
              <div className={styles.orderInfo}>
                <h3 className={styles.orderId}>
                  Order #{order._id?.slice(-6).toUpperCase() || "N/A"}
                </h3>
                <div
                  className={styles.orderStatus}
                  style={{ 
                    color: getStatusColor(order.status),
                    backgroundColor: `${getStatusColor(order.status)}15`
                  }}
                >
                  <span className={styles.statusIcon}>
                    {getStatusIcon(order.status)}
                  </span>
                  {getStatusText(order.status)}
                </div>
              </div>
            </div>

            {/* Order Progress (for active orders) */}
            {activeTab === "active" && order.status !== "cancelled" && (
              <div className={styles.orderProgress}>
                <div className={styles.progressBar}>
                  <div
                    className={styles.progressFill}
                    style={{
                      width: `${calculateProgress(order.status)}%`,
                      backgroundColor: getStatusColor(order.status)
                    }}
                  ></div>
                </div>
                <div className={styles.progressSteps}>
                  <span
                    className={`${styles.progressStep} ${
                      ["confirmed", "preparing", "ready", "completed", "served"].includes(order.status)
                        ? styles.completed
                        : styles.pending
                    }`}
                  >
                    Ordered
                  </span>
                  <span
                    className={`${styles.progressStep} ${
                      ["preparing", "ready", "completed", "served"].includes(order.status)
                        ? styles.completed
                        : styles.pending
                    }`}
                  >
                    Preparing
                  </span>
                  <span
                    className={`${styles.progressStep} ${
                      ["ready", "completed", "served"].includes(order.status)
                        ? styles.completed
                        : styles.pending
                    }`}
                  >
                    Ready
                  </span>
                  <span
                    className={`${styles.progressStep} ${
                      ["completed", "served"].includes(order.status)
                        ? styles.completed
                        : styles.pending
                    }`}
                  >
                    Completed
                  </span>
                </div>
              </div>
            )}

            {/* Order Items */}
            <div className={styles.orderItems}>
              <h4 className={styles.itemsTitle}>Order Items</h4>
              {orderItems.map((item, index) => (
                <div key={index} className={styles.orderItem}>
                  <div className={styles.itemMain}>
                    <span className={styles.itemQuantity}>
                      {item.quantity}x
                    </span>
                    <span className={styles.itemName}>{item.name}</span>
                  </div>
                  <span className={styles.itemPrice}>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            {/* Special Instructions */}
            {order.specialInstructions && (
              <div className={styles.specialInstructions}>
                <strong>Special Instructions:</strong> {order.specialInstructions}
              </div>
            )}

            {/* Payment Information */}
            <div className={styles.orderSummary}>
              <div className={styles.paymentInfo}>
                <span className={styles.paymentLabel}>Payment Method:</span>
                <span className={styles.paymentMethod}>
                  {order.paymentMethod === "qr"
                    ? "QR Payment"
                    : order.paymentMethod === "counter"
                    ? "Pay at Counter"
                    : order.paymentMethod}
                </span>
                <span
                  className={`${styles.paymentStatus} ${
                    order.paymentStatus === "paid" || order.isPaid
                      ? styles.paid
                      : styles.pending
                  }`}
                >
                  {order.paymentStatus === "paid" || order.isPaid ? "Paid" : "Pending"}
                </span>
              </div>
              
              <div className={styles.orderTotal}>
                <span className={styles.totalLabel}>Total Amount:</span>
                <span className={styles.totalAmount}>₹{total.toFixed(2)}</span>
              </div>
            </div>


            {/* Estimated Time (for active orders) */}
            {activeTab === "active" && order.status === "preparing" && (
              <div className={styles.estimatedTime}>
                <span className={styles.timeIcon}>⏱️</span>
                Your order is being prepared. Estimated time: 15-20 minutes
              </div>
            )}

            {activeTab === "active" && order.status === "ready" && (
              <div className={styles.readyNotification}>
                <span className={styles.readyIcon}>✅</span>
                Your order is ready for pickup!
              </div>
            )}
          </div>
        );
      })}
    </div>
  )}
</main>
    </div>
  );
};

export default UserOrders;
