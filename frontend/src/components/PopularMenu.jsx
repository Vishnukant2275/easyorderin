import React, { useState, useEffect } from "react";
import api from "../services";
import { useRestaurant } from "../context/RestaurantContext";

// Helper for progress bar color
const getProgressBarColor = (index) => {
  const colors = [
    "#007bff",
    "#28a745",
    "#ffc107",
    "#dc3545",
    "#6f42c1",
    "#e83e8c",
    "#fd7e14",
    "#20c997",
    "#17a2b8",
    "#6c757d",
  ];
  return colors[index % colors.length];
};

const PopularMenu = () => {
  const { menuItems } = useRestaurant();
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    fetchPopularItems();
  }, []);

  const fetchPopularItems = async () => {
    try {
      setLoading(true);
      const response = await api.get("/restaurant/orders/all");

      if (response.data.success) {
        const orders = response.data.orders || [];
        calculatePopularItems(orders);
      }
    } catch (error) {
      console.error("Error fetching orders for popular items:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculatePopularItems = (orders) => {
    const itemCounts = {};

    // Count orders for each menu item
    orders.forEach((order) => {
      order.menuItems?.forEach((orderItem) => {
        const menuItemId = orderItem.menuId;
        const menuItem = menuItems?.find((item) => item._id === menuItemId);

        if (menuItem) {
          const itemName = menuItem.name;
          const quantity = orderItem.quantity || 1;
          const price = menuItem.price || 0;

          if (!itemCounts[itemName]) {
            itemCounts[itemName] = {
              orders: 0,
              totalQuantity: 0,
              revenue: 0,
              price: price,
            };
          }

          itemCounts[itemName].orders += 1;
          itemCounts[itemName].totalQuantity += quantity;
          itemCounts[itemName].revenue += quantity * price;
        }
      });
    });

    // Convert to array and sort by order count
    const itemsArray = Object.entries(itemCounts)
      .map(([name, data]) => ({
        name,
        orders: data.orders,
        totalQuantity: data.totalQuantity,
        revenue: data.revenue,
        price: data.price,
        growth: calculateGrowth(data.orders), // Mock growth for now
      }))
      .sort((a, b) => b.orders - a.orders);

    setPopularItems(itemsArray);
  };

  // Mock growth calculation - in real app, compare with previous period
  const calculateGrowth = (orders) => {
    const growthRates = [
      "+12%",
      "+8%",
      "+15%",
      "+5%",
      "+20%",
      "+10%",
      "+18%",
      "+7%",
    ];
    return growthRates[Math.floor(Math.random() * growthRates.length)];
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="card responsive-card">
        <div className="card-header compact-header">
          <h6 className="card-title mb-0">Popular Items</h6>
        </div>
        <div className="card-body text-center py-4">
          <div
            className="spinner-border spinner-border-sm text-primary"
            role="status"
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <small className="text-muted ms-2">Loading popular items...</small>
        </div>
      </div>
    );
  }

  const totalOrders = popularItems.reduce((sum, item) => sum + item.orders, 0);
  const visibleItems = showAll ? popularItems : popularItems.slice(0, 5);

  if (popularItems.length === 0) {
    return (
      <div className="card responsive-card">
        <div className="card-header compact-header">
          <h6 className="card-title mb-0">Popular Items</h6>
        </div>
        <div className="card-body text-center py-4">
          <div className="text-muted">
            <i className="bi bi-bar-chart fs-1 d-block mb-2"></i>
            No order data available
          </div>
          <small>Popular items will appear here as orders come in</small>
        </div>
      </div>
    );
  }

  return (
    <div className="card responsive-card">
      {/* Header */}
      <div className="card-header compact-header d-flex justify-content-between align-items-center">
        <h6 className="card-title mb-0">Popular Items</h6>
        <small className="text-muted">{totalOrders} total orders</small>
      </div>

      {/* List */}
      <div className="card-body compact-body p-0">
        <div className="list-group list-group-flush">
          {visibleItems.map((item, index) => {
            const percentage =
              totalOrders > 0
                ? ((item.orders / totalOrders) * 100).toFixed(1)
                : 0;
            return (
              <div key={index} className="list-group-item border-0 px-3 py-2">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <div className="d-flex align-items-center">
                    <span className="badge rank-badge me-2">{index + 1}</span>
                    <div>
                      <h6 className="mb-0 fw-medium item-name">{item.name}</h6>
                      <small className="text-muted">
                        {formatCurrency(item.price)}
                      </small>
                    </div>
                  </div>
                  <div className="text-end">
                    <strong className="d-block">{item.orders} orders</strong>
                    <small className="text-success">{item.growth}</small>
                  </div>
                </div>

                {/* Additional info */}
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small className="text-muted">
                    {item.totalQuantity} items sold
                  </small>
                  <small className="text-primary fw-bold">
                    {formatCurrency(item.revenue)}
                  </small>
                </div>

                {/* Progress bar */}
                <div className="progress mt-2" style={{ height: "8px" }}>
                  <div
                    className="progress-bar"
                    style={{
                      width: `${percentage}%`,
                      backgroundColor: getProgressBarColor(index),
                    }}
                  ></div>
                </div>
                <small className="text-muted d-block mt-1">
                  {percentage}% of total orders
                </small>
              </div>
            );
          })}
        </div>

        {/* Show More / Less */}
        {popularItems.length > 5 && (
          <div className="text-center border-top py-2">
            <button
              className="btn btn-link text-primary small"
              onClick={() => setShowAll(!showAll)}
            >
              {showAll
                ? "Show Less ▲"
                : `Show More ▼ (${popularItems.length - 5} more)`}
            </button>
          </div>
        )}

        {/* Mobile Quick Stats */}
        <div className="d-md-none p-3 border-top quick-stats">
          <div className="row text-center">
            <div className="col-4 border-end">
              <div className="fw-bold text-primary">
                {popularItems[0]?.orders || 0}
              </div>
              <small className="text-muted">Top Item</small>
            </div>
            <div className="col-4 border-end">
              <div className="fw-bold text-success">{popularItems.length}</div>
              <small className="text-muted">Items</small>
            </div>
            <div className="col-4">
              <div className="fw-bold text-info">
                {formatCurrency(
                  popularItems.reduce((sum, item) => sum + item.revenue, 0)
                )}
              </div>
              <small className="text-muted">Revenue</small>
            </div>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .list-group-item {
          transition: background-color 0.2s;
        }
        .list-group-item:hover {
          background-color: #f8f9fa;
        }
        .rank-badge {
          background: #f0f2f5;
          color: #333;
          font-weight: 500;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .item-name {
          font-size: 0.95rem;
        }
        .progress-bar {
          transition: width 0.3s ease;
        }

        /* ✅ Mobile Optimizations */
        @media (max-width: 576px) {
          .card-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 4px;
          }
          .item-name {
            font-size: 0.9rem;
          }
          .list-group-item {
            padding: 0.8rem 1rem;
          }
          .rank-badge {
            width: 26px;
            height: 26px;
            font-size: 0.8rem;
          }
          .progress {
            height: 10px !important;
          }
          .quick-stats small {
            font-size: 0.75rem;
          }
        }
      `}</style>
    </div>
  );
};

export default PopularMenu;
