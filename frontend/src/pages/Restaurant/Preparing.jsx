import React, { useState, useEffect, useMemo } from "react";
import { useRestaurant } from "../../context/RestaurantContext";
import api from "../../services ";
import NotActive from "../../components/NotActive";
const Preparing = () => {
  const { orders, menuItems, loading, setRefreshTrigger, refreshTrigger } =
    useRestaurant();
  const [searchTerm, setSearchTerm] = useState("");
  const [elapsedTimes, setElapsedTimes] = useState({});
  const updateOrderStatus = async (orderId, status) => {
    try {
      const response = await api.post("/restaurant/order/update", {
        orderId: orderId,
        status: status,
      });

      if (response.data.success) {
        // Use the setter function to update refreshTrigger
        setRefreshTrigger((prev) => prev + 1);
      } else {
        console.error("Failed to update order status:", response.data.message);
        alert("Failed to update order status: " + response.data.message);
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Error updating order status: " + error.message);
    }
  };
  // Filter and enhance preparing orders
  const { preparingOrders, servedOrders } = useMemo(() => {
    const result = {
      preparingOrders: [],
      servedOrders: [],
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
          // Find the menu item by menuId
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

          // Fallback if menu item not found
          return {
            ...orderItem,
            name: "Menu Item",
            price: 0,
            menuId: orderItem.menuId,
          };
        });
      } else {
        // If no menuItems context, use basic info
        enhancedOrder.menuItems = (order.menuItems || []).map((item) => ({
          ...item,
          name: item.name || "Loading...",
          price: item.price || 0,
        }));
      }

      // Categorize orders
      if (order.status === "preparing")
        result.preparingOrders.push(enhancedOrder);
      else if (order.status === "served")
        result.servedOrders.push(enhancedOrder);
    });

    return result;
  }, [orders, menuItems]);

  // 🔹 Compute elapsed time since order creation (updated every minute)
  useEffect(() => {
    const updateElapsed = () => {
      const now = new Date();
      const newElapsed = {};

      preparingOrders.forEach((order) => {
        if (!order?.createdAt) return;
        const diffMs = now - new Date(order.createdAt);
        newElapsed[order._id] = Math.floor(diffMs / 60000); // minutes
      });

      setElapsedTimes(newElapsed);
    };

    updateElapsed(); // initial run
    const interval = setInterval(updateElapsed, 60000);
    return () => clearInterval(interval);
  }, [preparingOrders]);

  // 🔹 Filtered orders based on search input
  const filteredOrders = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return preparingOrders;

    return preparingOrders.filter((order) => {
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
  }, [preparingOrders, searchTerm]);

  // 🔹 Utility functions
  const getTimeAlertClass = (minutes) => {
    if (minutes > 30) return "danger";
    if (minutes > 15) return "warning";
    return "info";
  };

  const calculateOrderTotal = (order) => {
    if (order.totalPrice) return order.totalPrice;
    return (order?.menuItems || []).reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );
  };
  const handleCloseAlert = () => {
    console.log("User closed the inactive alert");
  };

  // 🔹 Render helpers
  const renderOrderCard = (order) => {
    const minutes = elapsedTimes[order._id] || 0;
    const timeClass = getTimeAlertClass(minutes);
    const total = calculateOrderTotal(order);

    return (
      <>
        {" "}
        <NotActive
          message="New orders are disabled while your account is inactive."
          variant="card"
          showRefreshButton={false}
          onClose={handleCloseAlert}
        />
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
                <span className="badge bg-info text-capitalize mb-1">
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

            <div className="card-footer bg-transparent">
              <div className="btn-group w-100">
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => updateOrderStatus(order._id, "served")}
                >
                  Mark as Served
                </button>
                <button
                  className="btn btn-sm btn-outline-warning"
                  onClick={() =>
                    window.confirm("Move this order back to pending?") &&
                    updateOrderStatus(order._id, "pending")
                  }
                >
                  Move to Pending
                </button>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // 🔹 Empty state for preparing orders
  if (filteredOrders.length === 0) {
    return (
      <>
        {" "}
        <NotActive
          message="New orders are disabled while your account is inactive."
          variant="card"
          showRefreshButton={false}
          onClose={handleCloseAlert}
        />
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Orders in Preparation</h2>
              <p className="text-muted mb-0">
                {preparingOrders.length} preparing
              </p>
            </div>
            <div className="input-group" style={{ width: "300px" }}>
              <span className="input-group-text">
                <i className="bi bi-search"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search preparing orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="text-center py-5">
            <i
              className="bi bi-egg-fried text-info"
              style={{ fontSize: "3rem" }}
            ></i>
            <h4 className="mt-3 text-muted">No orders in preparation</h4>
            <p className="text-muted">
              Start preparing orders from the pending section
            </p>
          </div>

          {/* Recently Served Orders */}
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
        </div>
      </>
    );
  }

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Orders in Preparation</h2>
          <p className="text-muted mb-0">
            {preparingOrders.length} order
            {preparingOrders.length !== 1 ? "s" : ""} being prepared
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

      {/* Recently Served Orders */}
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
    </div>
  );
};

export default Preparing;
