import React, { useState, useEffect, useMemo } from "react";
import { useRestaurant } from "../context/RestaurantContext";

const PendingOrders = ({ updateOrderStatus }) => {
  const { orders } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState("");
  const [elapsedTimes, setElapsedTimes] = useState({});

  // 🔹 Categorize orders once (memoized for performance)
  const { pendingOrders, preparingOrders, servedOrders } = useMemo(() => {
    const result = {
      pendingOrders: [],
      preparingOrders: [],
      servedOrders: [],
    };

    (orders || []).forEach((order) => {
      if (!order?.status) return;
      if (order.status === "pending") result.pendingOrders.push(order);
      else if (order.status === "preparing") result.preparingOrders.push(order);
      else if (order.status === "served") result.servedOrders.push(order);
    });

    return result;
  }, [orders]);

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
      return table.includes(search) || id.includes(search);
    });
  }, [pendingOrders, searchTerm]);

  // 🔹 Utility functions
  const getTimeAlertClass = (minutes) => {
    if (minutes > 30) return "danger";
    if (minutes > 15) return "warning";
    return "success";
  };

  const calculateOrderTotal = (order) =>
    (order?.menuItems || []).reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );

  // 🔹 Render helpers
  const renderOrderCard = (order) => {
    const minutes = elapsedTimes[order._id] || 0;
    const timeClass = getTimeAlertClass(minutes);
    const total =
      order?.totalPrice || calculateOrderTotal(order);

    return (
      <div key={order._id} className="col-md-6 col-lg-4">
        <div
          className={`card h-100 border-${timeClass}`}
          style={{ borderWidth: "2px" }}
        >
          <div className="card-header d-flex justify-content-between align-items-center">
            <strong>Order #{order._id?.slice(0, 8)}</strong>
            <span className="badge bg-warning text-capitalize">
              {order.status}
            </span>
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
                  <span>
                    ₹{(item.quantity * item.price).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted d-block">
                  Ordered:{" "}
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleTimeString()
                    : "Unknown"}
                </small>
                <small className={`text-${timeClass}`}>
                  <i className="bi bi-clock me-1"></i>
                  {minutes} min ago
                </small>
              </div>
              <strong className="text-primary">
                ₹{total.toFixed(2)}
              </strong>
            </div>

            {order.isPaid && (
              <div className="mt-2">
                <span className="badge bg-success">
                  <i className="bi bi-check-circle me-1"></i>Paid
                </span>
              </div>
            )}
          </div>

          <div className="card-footer bg-transparent">
            <div className="btn-group w-100">
              <button
                className="btn btn-sm btn-primary"
                onClick={() =>
                  updateOrderStatus(order._id, "preparing")
                }
              >
                Start Preparing
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() =>
                  window.confirm("Cancel this order?") &&
                  updateOrderStatus(order._id, "cancelled")
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 🔹 Empty state
  if (filteredOrders.length === 0) {
    return (
      <div className="text-center py-5">
        <i
          className="bi bi-check-circle-fill text-success"
          style={{ fontSize: "3rem" }}
        ></i>
        <h4 className="mt-3 text-muted">No pending orders</h4>
        <p className="text-muted">All orders are being processed!</p>
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
          </p>
        </div>
        <div className="input-group" style={{ width: "300px" }}>
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by table number or order ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Orders Grid */}
      <div className="row g-3 mb-5">
        {filteredOrders.map(renderOrderCard)}
      </div>

      {/* Recently Served */}
      {servedOrders.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">Recently Served Orders</h4>
          <div className="list-group">
            {servedOrders.slice(0, 5).map((order) => (
              <div
                key={order._id}
                className="list-group-item list-group-item-success"
              >
                <div className="d-flex justify-content-between">
                  <div>
                    <strong>Order #{order._id.slice(0, 8)}</strong>
                    <small className="text-muted ms-2">
                      (Table {order.tableNumber})
                    </small>
                  </div>
                  <small className="text-muted">
                    ₹{(order.totalPrice || 0).toFixed(2)} •{" "}
                    {order.updatedAt
                      ? new Date(order.updatedAt).toLocaleTimeString()
                      : "Unknown"}
                  </small>
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
