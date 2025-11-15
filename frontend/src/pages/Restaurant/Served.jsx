import React, { useState, useMemo } from "react";
import { useRestaurant } from "../../context/RestaurantContext";

const Served = ({ updateOrderStatus }) => {
  const { orders, menuItems } = useRestaurant();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter and enhance served and cancelled orders
  const { servedOrders, cancelledOrders } = useMemo(() => {
    const result = {
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
      if (order.status === "served") result.servedOrders.push(enhancedOrder);
      else if (order.status === "cancelled")
        result.cancelledOrders.push(enhancedOrder);
    });

    // Sort by most recent first
    result.servedOrders.sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    );
    result.cancelledOrders.sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) -
        new Date(a.updatedAt || a.createdAt)
    );

    return result;
  }, [orders, menuItems]);

  // Filter served orders based on search input
  const filteredServedOrders = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();
    if (!search) return servedOrders;

    return servedOrders.filter((order) => {
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
  }, [servedOrders, searchTerm]);

  const calculateOrderTotal = (order) => {
    if (order.totalPrice) return order.totalPrice;
    return (order?.menuItems || []).reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.price || 0),
      0
    );
  };

  // Render served order card
  const renderServedOrderCard = (order) => {
    const total = calculateOrderTotal(order);

    return (
      <div key={order._id} className="col-md-6 col-lg-4">
        <div
          className="card h-100 border-success"
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
            </div>
            <span className="badge bg-success">Served</span>
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
                  Served:{" "}
                  {order.updatedAt
                    ? new Date(order.updatedAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })
                    : "Unknown"}
                </small>
                <small className="text-muted">
                  <i className="bi bi-clock me-1"></i>
                  {order.createdAt
                    ? Math.floor(
                        (new Date(order.updatedAt || order.createdAt) -
                          new Date(order.createdAt)) /
                          60000
                      ) + " min total"
                    : "Time unknown"}
                </small>
              </div>
              <strong className="text-primary">₹{total.toFixed(2)}</strong>
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
                className="btn btn-sm btn-outline-warning"
                onClick={() => updateOrderStatus(order._id, "preparing")}
              >
                Move Back to Preparing
              </button>
              <button
                className="btn btn-sm btn-outline-info"
                onClick={() => updateOrderStatus(order._id, "pending")}
              >
                Move to Pending
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="container-fluid">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Served Orders</h2>
          <p className="text-muted mb-0">
            {servedOrders.length} served • {cancelledOrders.length} cancelled
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

      {/* Served Orders Grid */}
      <div className="row g-3 mb-5">
        {filteredServedOrders.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i
                className="bi bi-check-circle text-success"
                style={{ fontSize: "3rem" }}
              ></i>
              <h4 className="mt-3 text-muted">
                {servedOrders.length === 0
                  ? "No served orders"
                  : "No orders match your search"}
              </h4>
              <p className="text-muted">
                {servedOrders.length === 0
                  ? "Orders will appear here after they are served"
                  : "Try a different search term"}
              </p>
            </div>
          </div>
        ) : (
          filteredServedOrders.map(renderServedOrderCard)
        )}
      </div>

      {/* Cancelled Orders Section */}
      {cancelledOrders.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">Cancelled Orders</h4>
          <div className="list-group">
            {cancelledOrders.slice(0, 10).map((order) => (
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
                <div className="mt-1">
                  <small className="text-muted">
                    Items:{" "}
                    {(order.menuItems || [])
                      .map((item) => `${item.quantity}x ${item.name}`)
                      .join(", ")}
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

export default Served;
