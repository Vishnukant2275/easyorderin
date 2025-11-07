import React, { useState, useEffect, useMemo } from "react";
import { useRestaurant } from "../context/RestaurantContext";
import api from "../services/api";
import { toast } from "react-toastify";
const PendingOrders = () => {
  const { orders, menuItems, loading, setRefreshTrigger, refreshTrigger } =
    useRestaurant();

  const [searchTerm, setSearchTerm] = useState("");
  const [elapsedTimes, setElapsedTimes] = useState({});
  const [ordersState, setOrders] = useState([]);
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await api.post("/restaurant/order/update", {
        orderId: orderId,
        status: status,
      });

    if (response.data.success) {
      // Refresh the data
      setRefreshTrigger((prev) => prev + 1);
      
      if (isPaid) {
        toast.success("Payment confirmed! You can now start preparing the order.");
      } else {
        toast.error("Payment status updated to not received.");
      }
    } else {
      toast.error("Failed to update payment status: " + response.data.error);
    }
  } catch (error) {
    console.error("Error updating payment status:", error);
    
  }
};

  // Enhanced order processing that matches your MongoDB schema
  const { pendingOrders, preparingOrders, servedOrders, cancelledOrders } =
    useMemo(() => {
      const result = {
        pendingOrders: [],
        preparingOrders: [],
        servedOrders: [],
        cancelledOrders: [],
      };

      (orders || []).forEach((order) => {
        if (!order?.status) return;

        // Create enhanced order with populated data
        const enhancedOrder = {
          ...order,
        };

        // Enhance menu items with names from menuItems context
        if (order.menuItems && menuItems && menuItems.length > 0) {
          enhancedOrder.menuItems = order.menuItems.map((orderItem) => {
            const menuItem = menuItems.find(
              (item) => item._id === orderItem.menuId
            );

            if (menuItem) {
              return {
                ...orderItem,
                name: menuItem.name,
                price: menuItem.price,
                menuId: orderItem.menuId,
              };
            }

            return {
              ...orderItem,
              name: "Menu Item",
              price: 0,
              menuId: orderItem.menuId,
            };
          });
        } else {
          enhancedOrder.menuItems = (order.menuItems || []).map((item) => ({
            ...item,
            name: item.name || "Loading...",
            price: item.price || 0,
          }));
        }

        // Categorize orders
        if (order.status === "pending")
          result.pendingOrders.push(enhancedOrder);
        else if (order.status === "preparing")
          result.preparingOrders.push(enhancedOrder);
        else if (order.status === "served")
          result.servedOrders.push(enhancedOrder);
        else if (order.status === "cancelled")
          result.cancelledOrders.push(enhancedOrder);
      });

      return result;
    }, [orders, menuItems]);
  // 🔹 Compute elapsed time since order creation (updated every minute)
  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date();
      const newElapsed = {};

      pendingOrders.forEach((order) => {
        if (!order?.createdAt) return;
        const diffMs = now - new Date(order.createdAt);
        newElapsed[order._id] = Math.floor(diffMs / 60000); // minutes
      });

      setElapsedTimes(newElapsed);
    };

    updateElapsed(); // initial run
    const interval = setInterval(updateElapsed, 60000);
    return () => clearInterval(interval);
  }, [pendingOrders]);

  // 🔹 Filtered orders based on search input
  const filteredOrders = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return pendingOrders;

    return pendingOrders.filter((order) => {
      const table = order?.tableNumber?.toString() || "";
      const id = order?._id?.toLowerCase() || "";
      const userName = order?.userId?.name?.toLowerCase() || "";
      const orderNumber = order?.formattedOrderNumber?.toLowerCase() || "";
      return (
        table.includes(search) ||
        id.includes(search) ||
        userName.includes(search) ||
        orderNumber.includes(search)
      );
    });
  }, [pendingOrders, searchTerm]);

  // 🔹 Utility functions
  const getTimeAlertClass = (minutes) => {
    if (minutes > 30) return "danger";
    if (minutes > 15) return "warning";
    return "success";
  };
  // Add this function to your component
  const handlePaymentConfirmation = async (orderId, isPaid) => {
    try {
      const response = await api.patch(`/restaurant/${orderId}/payment`, {
        isPaid: isPaid,
      });

      if (response.data.success) {
        // Refresh the data - this will reload the orders from the server
        
        if (isPaid) {
         setRefreshTrigger((prev) => prev + 1);
          toast.success("Payment status updated to received.");
        } else {
          alert("Payment status updated to not received.");
        }
      } else {
        alert("Failed to update payment status: " + response.data.error);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
      alert("Error updating payment status. Please try again.");
    }
  };
  const calculateOrderTotal = (order) => {
    if (order.totalPrice) return order.totalPrice;
    return (order?.menuItems || []).reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );
  };

  // 🔹 Render helpers
  const renderOrderCard = (order) => {
    const minutes = elapsedTimes[order._id] || 0;
    const timeClass = getTimeAlertClass(minutes);
    const total = calculateOrderTotal(order);

    return (
      <div key={order._id} className="col-md-6 col-lg-4">
        <div
          className={`card h-100 border-${timeClass}`}
          style={{ borderWidth: "2px" }}
        >
          <div className="card-header d-flex justify-content-between align-items-center">
            <div>
              <strong>
                {order.formattedOrderNumber ||
                  `Order #${order._id?.slice(0, 8)}`}
              </strong>
              <div className="small text-muted">
                <i className="bi bi-person me-1"></i>
                {order.userId?.name || "Customer"}
              </div>
              <div className="small text-muted">
                <i className="bi bi-telephone me-1"></i>
                {order.userId?.phone || "Phone not available"}
              </div>
            </div>
            <div className="text-end">
              <span className="badge bg-warning text-capitalize mb-1">
                {order.status}
              </span>
              <div>
                <span
                  className={`badge ${
                    order.isPaid ? "bg-success" : "bg-danger"
                  }`}
                >
                  <i
                    className={`bi ${
                      order.isPaid ? "bi-check-circle" : "bi-x-circle"
                    } me-1`}
                  ></i>
                  {order.isPaid ? "Paid" : "Not Paid"}
                </span>
              </div>
            </div>
          </div>

          <div className="card-body">
            <div className="d-flex justify-content-between mb-2">
              <span>
                <i className="bi bi-table me-2"></i>Table{" "}
                {order.tableNumber || "N/A"}
              </span>
              <span className="badge bg-light text-dark">
                {order.menuItems?.length || 0} items
              </span>
            </div>

            <div className="mb-3">
              <strong>Items:</strong>
              {(order.menuItems || []).map((item, idx) => (
                <div
                  key={idx}
                  className="d-flex justify-content-between small mt-1"
                >
                  <div>
                    {item.quantity}× {item.name}
                    {item.notes && (
                      <div className="text-muted">
                        <small>Note: {item.notes}</small>
                      </div>
                    )}
                  </div>
                  <span>₹{(item.quantity * item.price).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted d-block">
                  Ordered:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Unknown"}
                </small>
                <small className={`text-${timeClass}`}>
                  <i className="bi bi-clock me-1"></i>
                  {minutes} min ago
                </small>
              </div>
              <strong className="text-primary">₹{total.toFixed(2)}</strong>
            </div>
          </div>

          {/* Payment Verification Section */}
          {!order.isPaid && order.status === "pending" && (
            <div className="card-footer bg-light border-top">
              <div className="text-center mb-2">
                <small className="text-muted fw-bold">
                  PAYMENT VERIFICATION
                </small>
              </div>
              <div className="btn-group w-100">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => handlePaymentConfirmation(order._id, true)}
                >
                  <i className="bi bi-check-circle me-1"></i>
                  Payment Received
                </button>
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={() => handlePaymentConfirmation(order._id, false)}
                >
                  <i className="bi bi-x-circle me-1"></i>
                  Not Received
                </button>
              </div>
            </div>
          )}

          {/* Order Actions Section */}
          <div className="card-footer bg-transparent">
            <div className="btn-group w-100">
              <button
                className="btn btn-sm btn-primary"
                onClick={() => updateOrderStatus(order._id, "preparing")}
                disabled={!order.isPaid} // Disable if payment not confirmed
                title={
                  !order.isPaid
                    ? "Confirm payment first"
                    : "Start preparing order"
                }
              >
                <i className="bi bi-play-circle me-1"></i>
                Start Preparing
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() =>
                  window.confirm("Cancel this order?") &&
                  updateOrderStatus(order._id, "cancelled")
                }
              >
                <i className="bi bi-x-circle me-1"></i>
                Cancel
              </button>
            </div>

            {/* Status message for disabled button */}
            {!order.isPaid && (
              <div className="text-center mt-2">
                <small className="text-danger">
                  <i className="bi bi-info-circle me-1"></i>
                  Confirm payment before starting preparation
                </small>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // 🔹 Loading state - only show if still loading
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Loading orders...</p>
      </div>
    );
  }

  // 🔹 Empty state for pending orders
  // 🔹 Empty state for pending orders
  if (filteredOrders.length === 0) {
    return (
      <div className="container-fluid">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="mb-1">Pending Orders</h2>
            <p className="text-muted mb-0">
              {pendingOrders.length} waiting • {preparingOrders.length}{" "}
              preparing • {cancelledOrders.length} cancelled{" "}
              {/* Add cancelled count here */}
            </p>
          </div>
          <div className="input-group" style={{ width: "300px" }}>
            <span className="input-group-text">
              <i className="bi bi-search"></i>
            </span>
            <input
              type="text"
              className="form-control"
              placeholder="Search by table, order ID, or customer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="text-center py-5">
          <i
            className="bi bi-check-circle-fill text-success"
            style={{ fontSize: "3rem", margin: "0rem" }}
          ></i>
          <h4 className="mt-3 text-muted">
            {pendingOrders.length === 0
              ? "No pending orders"
              : "No orders match your search"}
          </h4>
          <p className="text-muted">
            {pendingOrders.length === 0
              ? "All orders are being processed!"
              : "Try a different search term"}
          </p>
        </div>

        {/* Currently Preparing Section */}
        {preparingOrders.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-3">Currently Preparing Orders</h4>
            <div className="list-group">
              {preparingOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="list-group-item list-group-item-info"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>
                        {order.formattedOrderNumber ||
                          `Order #${order._id.slice(0, 8)}`}
                      </strong>
                      <small className="text-muted ms-2">
                        (Table {order.tableNumber})
                      </small>
                      <div className="small text-muted">
                        Customer: {order.userId?.name || "Customer"}
                      </div>
                    </div>
                    <div className="text-end">
                      <strong className="text-primary">
                        ₹{(order.totalPrice || 0).toFixed(2)}
                      </strong>
                      <small className="text-muted d-block">
                        {order.updatedAt
                          ? new Date(order.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "Unknown"}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recently Served Section */}
        {servedOrders.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-3">Recently Served Orders</h4>
            <div className="list-group">
              {servedOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="list-group-item list-group-item-success"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>
                        {order.formattedOrderNumber ||
                          `Order #${order._id.slice(0, 8)}`}
                      </strong>
                      <small className="text-muted ms-2">
                        (Table {order.tableNumber})
                      </small>
                      <div className="small text-muted">
                        Customer: {order.userId?.name || "Customer"}
                      </div>
                    </div>
                    <div className="text-end">
                      <strong className="text-primary">
                        ₹{(order.totalPrice || 0).toFixed(2)}
                      </strong>
                      <small className="text-muted d-block">
                        {order.updatedAt
                          ? new Date(order.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "Unknown"}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ADD CANCELLED ORDERS SECTION HERE IN EMPTY STATE */}
        {cancelledOrders.length > 0 && (
          <div className="mt-5">
            <h4 className="mb-3">Recently Cancelled Orders</h4>
            <div className="list-group">
              {cancelledOrders.slice(0, 5).map((order) => (
                <div
                  key={order._id}
                  className="list-group-item list-group-item-danger"
                >
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>
                        {order.formattedOrderNumber ||
                          `Order #${order._id.slice(0, 8)}`}
                      </strong>
                      <small className="text-muted ms-2">
                        (Table {order.tableNumber})
                      </small>
                      <div className="small text-muted">
                        Customer: {order.userId?.name || "Customer"}
                      </div>
                      {order.cancellationReason && (
                        <div className="small text-muted">
                          Reason: {order.cancellationReason}
                        </div>
                      )}
                    </div>
                    <div className="text-end">
                      <strong className="text-primary">
                        ₹{(order.totalPrice || 0).toFixed(2)}
                      </strong>
                      <small className="text-muted d-block">
                        {order.updatedAt
                          ? new Date(order.updatedAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                              hour12: true,
                            })
                          : "Unknown"}
                      </small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Pending Orders</h2>
          <p className="text-muted mb-0">
            {pendingOrders.length} waiting • {preparingOrders.length} preparing
            • {cancelledOrders.length} cancelled
          </p>
        </div>
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by table, order ID, or customer..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="row g-3 mb-5">{filteredOrders.map(renderOrderCard)}</div>

      {/* Currently Preparing Section */}
      {preparingOrders.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">Currently Preparing Orders</h4>
          <div className="list-group">
            {preparingOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="list-group-item list-group-item-info"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>
                      {order.formattedOrderNumber ||
                        `Order #${order._id.slice(0, 8)}`}
                    </strong>
                    <small className="text-muted ms-2">
                      (Table {order.tableNumber})
                    </small>
                    <div className="small text-muted">
                      Customer: {order.userId?.name || "Customer"}
                    </div>
                  </div>
                  <div className="text-end">
                    <strong className="text-primary">
                      ₹{(order.totalPrice || 0).toFixed(2)}
                    </strong>
                    <small className="text-muted d-block">
                      {order.updatedAt
                        ? new Date(order.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "Unknown"}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recently Served Section */}
      {servedOrders.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">Recently Served Orders</h4>
          <div className="list-group">
            {servedOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="list-group-item list-group-item-success"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>
                      {order.formattedOrderNumber ||
                        `Order #${order._id.slice(0, 8)}`}
                    </strong>
                    <small className="text-muted ms-2">
                      (Table {order.tableNumber})
                    </small>
                    <div className="small text-muted">
                      Customer: {order.userId?.name || "Customer"}
                    </div>
                  </div>
                  <div className="text-end">
                    <strong className="text-primary">
                      ₹{(order.totalPrice || 0).toFixed(2)}
                    </strong>
                    <small className="text-muted d-block">
                      {order.updatedAt
                        ? new Date(order.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "Unknown"}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Cancelled Orders Section in Empty State */}
      {cancelledOrders.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">Recently Cancelled Orders</h4>
          <div className="list-group">
            {cancelledOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="list-group-item list-group-item-danger"
              >
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>
                      {order.formattedOrderNumber ||
                        `Order #${order._id.slice(0, 8)}`}
                    </strong>
                    <small className="text-muted ms-2">
                      (Table {order.tableNumber})
                    </small>
                    <div className="small text-muted">
                      Customer: {order.userId?.name || "Customer"}
                    </div>
                    {order.cancellationReason && (
                      <div className="small text-muted">
                        Reason: {order.cancellationReason}
                      </div>
                    )}
                  </div>
                  <div className="text-end">
                    <strong className="text-primary">
                      ₹{(order.totalPrice || 0).toFixed(2)}
                    </strong>
                    <small className="text-muted d-block">
                      {order.updatedAt
                        ? new Date(order.updatedAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "Unknown"}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
