import React, { useState } from "react";
import { useRestaurant } from "../context/RestaurantContext";

const RecentOrders = () => {
  const { orders, menuItems } = useRestaurant();
  const [visibleCount, setVisibleCount] = useState(2);
  const [filter, setFilter] = useState("all");

  // Enhanced orders with menu item details
  const enhancedOrders =
    orders?.map((order) => {
      return {
        ...order,
        menuItems:
          order.menuItems?.map((orderItem) => {
            const menuItem = menuItems?.find((m) => m._id === orderItem.menuId);
            return {
              ...orderItem,
              name: menuItem?.name || "Unknown Item",
              price: menuItem?.price || 0,
            };
          }) || [],
      };
    }) || [];

  // Filter orders based on current filter
  const filteredOrders = enhancedOrders.filter(
    (order) => filter === "all" || order.status === filter
  );

  // Orders to display with pagination
  const displayedOrders = filteredOrders.slice(0, visibleCount);

  // Calculate total revenue only from served orders
  const totalRevenue = enhancedOrders
    .filter(order => order.status === "served")
    .reduce((sum, order) => sum + (order.totalPrice || order.total || 0), 0);

  const getStatusInfo = (status) => {
    switch (status) {
      case "pending":
        return { label: "Pending", color: "#FFC107", icon: "⏳" };
      case "preparing":
        return { label: "Preparing", color: "#0D6EFD", icon: "👨‍🍳" };
      case "served":
        return { label: "Served", color: "#198754", icon: "✅" };
      case "cancelled":
        return { label: "Cancelled", color: "#dc3545", icon: "❌" };
      default:
        return { label: "Unknown", color: "#6C757D", icon: "❓" };
    }
  };

  const handleFilterChange = (type) => {
    setFilter(type);
    setVisibleCount(2); // Reset to initial count when filter changes
  };

  return (
    <div className="recent-orders-card">
      {/* Header */}
      <div className="orders-header">
        <h5>Recent Orders</h5>
        <span className="total-count">{enhancedOrders.length}</span>
      </div>

      {/* Filter Buttons */}
      <div className="filter-bar">
        {["all", "pending", "preparing", "served"].map((type) => (
          <button
            key={type}
            className={`filter-btn ${filter === type ? "active" : ""}`}
            onClick={() => handleFilterChange(type)}
          >
            {type === "all" ? "All" : getStatusInfo(type).label}
          </button>
        ))}
      </div>

      {/* Mobile Card View */}
      <div className="mobile-list">
        {displayedOrders.length === 0 ? (
          <div className="empty-state">
            📝 <p>No {filter !== "all" ? filter : ""} orders found</p>
          </div>
        ) : (
          displayedOrders.map((order) => {
            const status = getStatusInfo(order.status);
            const orderId = order._id || order.id;
            const displayId = orderId ? orderId.slice(-6) : "N/A"; // Show last 6 chars of ID

            return (
              <div key={orderId} className="order-card">
                <div className="order-top">
                  <div>
                    <h6>Order #{displayId}</h6>
                    <small>
                      {order.time ||
                        new Date(order.createdAt).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                      • {order.duration || "-"}
                    </small>
                  </div>
                  <span
                    className="status-badge"
                    style={{ backgroundColor: status.color }}
                  >
                    {status.icon} {status.label}
                  </span>
                </div>

                <div className="order-info">
                  <div className="d-flex justify-content-between">
                    <strong>{order.userId?.name || "Guest"}</strong>
                    <span className="table-tag">
                      T-{order.table || order.tableNumber || "N/A"}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.menuItems.slice(0, 2).map((item, index) => (
                    <div key={index} className="item-row">
                      <span>
                        {item.quantity}x {item.name}
                      </span>
                      <span>₹{item.price}</span>
                    </div>
                  ))}
                  {order.menuItems.length > 2 && (
                    <small className="text-primary">
                      +{order.menuItems.length - 2} more items
                    </small>
                  )}
                </div>

                <div className="order-footer">
                  <strong>
                    {order.status === "served" ? (
                      <>Total: ₹{order.totalPrice || order.total || 0}</>
                    ) : (
                      <>Estimated: ₹{order.totalPrice || order.total || 0}</>
                    )}
                  </strong>
                  <button className="btn-sm">View Details</button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Load More */}
      {filteredOrders.length > visibleCount && (
        <div className="load-more">
          <button onClick={() => setVisibleCount((prev) => prev + 2)}>
            Load More ({filteredOrders.length - visibleCount} left)
          </button>
        </div>
      )}

      {/* Quick Stats */}
      <div className="quick-stats">
        <div>
          <small>Pending</small>
          <strong>
            {enhancedOrders.filter((o) => o.status === "pending").length}
          </strong>
        </div>
        <div>
          <small>Preparing</small>
          <strong>
            {enhancedOrders.filter((o) => o.status === "preparing").length}
          </strong>
        </div>
        <div>
          <small>Revenue</small>
          <strong>₹{totalRevenue.toLocaleString()}</strong>
        </div>
      </div>

      {/* CSS Styles */}
      <style>
        {`
          .recent-orders-card {
            background: white;
            border-radius: 12px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
          }

          .orders-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 15px;
          }

          .orders-header h5 {
            margin: 0;
            font-weight: 600;
          }

          .total-count {
            background: #e9ecef;
            color: #495057;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 0.875rem;
            font-weight: 600;
          }

          .filter-bar {
            display: flex;
            gap: 8px;
            margin-bottom: 20px;
            flex-wrap: wrap;
          }

          .filter-btn {
            padding: 6px 12px;
            border: 1px solid #dee2e6;
            background: white;
            border-radius: 20px;
            font-size: 0.875rem;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .filter-btn.active {
            background: #0d6efd;
            color: white;
            border-color: #0d6efd;
          }

          .filter-btn:hover:not(.active) {
            background: #f8f9fa;
          }

          .mobile-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .order-card {
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 15px;
            background: #f8f9fa;
          }

          .order-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 10px;
          }

          .order-top h6 {
            margin: 0;
            font-size: 0.9rem;
            font-weight: 600;
          }

          .order-top small {
            color: #6c757d;
            font-size: 0.75rem;
          }

          .status-badge {
            padding: 4px 8px;
            border-radius: 12px;
            color: white;
            font-size: 0.75rem;
            font-weight: 500;
          }

          .order-info {
            margin-bottom: 10px;
          }

          .table-tag {
            background: #6c757d;
            color: white;
            padding: 2px 8px;
            border-radius: 12px;
            font-size: 0.75rem;
          }

          .order-items {
            margin-bottom: 10px;
          }

          .item-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.875rem;
            margin-bottom: 4px;
          }

          .order-footer {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 10px;
            border-top: 1px solid #dee2e6;
          }

          .order-footer strong {
            color: #198754;
          }

          .btn-sm {
            padding: 4px 12px;
            background: #0d6efd;
            color: white;
            border: none;
            border-radius: 4px;
            font-size: 0.75rem;
            cursor: pointer;
          }

          .empty-state {
            text-align: center;
            padding: 40px 20px;
            color: #6c757d;
          }

          .load-more {
            text-align: center;
            margin: 20px 0;
          }

          .load-more button {
            padding: 8px 20px;
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 20px;
            cursor: pointer;
            transition: all 0.3s ease;
          }

          .load-more button:hover {
            background: #e9ecef;
          }

          .quick-stats {
            display: flex;
            justify-content: space-around;
            padding-top: 15px;
            border-top: 1px solid #e9ecef;
            text-align: center;
          }

          .quick-stats div {
            display: flex;
            flex-direction: column;
            gap: 4px;
          }

          .quick-stats small {
            color: #6c757d;
            font-size: 0.75rem;
          }

          .quick-stats strong {
            font-size: 1.1rem;
            color: #495057;
          }
        `}
      </style>
    </div>
  );
};

export default RecentOrders;