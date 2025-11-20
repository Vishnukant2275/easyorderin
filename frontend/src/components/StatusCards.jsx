import { useEffect, useState } from "react";
import React from "react";
import { Link } from "react-router-dom";
import api from "../services/api";
import { useRestaurant } from "../context/RestaurantContext";

const StatusCards = () => {
  const { menuItems, table, orders, paymentQRCodes } = useRestaurant();
  const [orderStats, setOrderStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    totalRevenue: 0,
    loading: true,
    error: null,
  });

  // Fetch all orders from API
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setOrderStats((prev) => ({ ...prev, loading: true, error: null }));

        const response = await api.get("/restaurant/orders/all");

        if (response.data.success) {
          const allOrders = response.data.orders || [];

          // Calculate statistics from all orders
          const totalOrders = allOrders.length;

          const todayOrders = allOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            const today = new Date();
            return orderDate.toDateString() === today.toDateString();
          }).length;

          const totalRevenue = allOrders
            .filter((order) => order.status === "served" && order.isPaid)
            .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

          setOrderStats({
            totalOrders,
            todayOrders,
            totalRevenue,
            loading: false,
            error: null,
          });
        } else {
          setOrderStats((prev) => ({
            ...prev,
            loading: false,
            error: response.data.error || "Failed to fetch orders",
          }));
        }
      } catch (error) {
        console.error("Error fetching all orders:", error);
        setOrderStats((prev) => ({
          ...prev,
          loading: false,
          error: error.response?.data?.error || "Network error",
        }));
      }
    };

    fetchAllOrders();
  }, []); // Empty dependency array to fetch only once when component mounts

  // Rest of your existing calculations using today's orders from context
  const pendingOrdersCount = orders.filter(
    (order) => order?.status === "pending"
  ).length;
  const preparingOrdersCount = orders.filter(
    (order) => order?.status === "preparing"
  ).length;
  const servedOrdersCount = orders.filter(
    (order) => order?.status === "served"
  ).length;
  const cancelledOrdersCount = orders.filter(
    (order) => order?.status === "cancelled"
  ).length;

  const todayRevenue = orders
    .filter((order) => {
      if (order.status === "served") {
        const orderDate = new Date(order.createdAt);
        const today = new Date();
        return orderDate.toDateString() === today.toDateString();
      }
      return false;
    })
    .reduce((sum, order) => sum + (order.totalPrice || 0), 0);

  const availableTablesCount =
    table?.filter((t) => t.status === "available")?.length || 0;
  const qrCodesCount = paymentQRCodes?.length || 0;

  // Show loading state for total orders card
  const totalOrdersDisplay = orderStats.loading
    ? "..."
    : orderStats.error
    ? "Error"
    : orderStats.totalOrders;

  const todayOrdersBadge = orderStats.loading
    ? "..."
    : orderStats.error
    ? ""
    : `${orderStats.todayOrders} today`;

  // 🎨 Card data with loading states
  const cardData = [
    {
      title: "Pending Orders",
      value: pendingOrdersCount,
      gradient: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
      url: "/pending-orders",
      icon: "⏳",
    },
    {
      title: "Preparing Orders",
      value: preparingOrdersCount,
      gradient: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
      url: "/preparing",
      icon: "👨‍🍳",
    },
    {
      title: "Served Orders",
      value: servedOrdersCount,
      gradient: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)",
      url: "/served",
      icon: "✅",
    },
    {
      title: "Cancelled Orders",
      value: cancelledOrdersCount,
      gradient: "linear-gradient(135deg, #ff758c 0%, #ff7eb3 100%)",
      url: "/served",
      icon: "❌",
    },
    {
      title: "Today's Revenue",
      value: `₹${todayRevenue.toLocaleString()}`,
      gradient: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
      url: "/analytics",
      icon: "🏦",
    },
    {
      title: "Total Tables",
      value: table?.length || 0,
      gradient: "linear-gradient(135deg, #56d6a0 0%, #49b4f1 100%)",
      url: "/tables",
      icon: "🪑",
    },
    {
      title: "Menu Items",
      value: menuItems?.length || 0,
      gradient:
        "linear-gradient(135deg, #FF9A8B 0%, #FF6A88 50%, #FF99AC 100%)",
      url: "/menu",
      icon: "🍽️",
    },
    {
      title: "Total Orders till Now",
      value: totalOrdersDisplay,
      gradient: "linear-gradient(135deg, #c471f5 0%, #fa71cd 100%)",
      url: "/orders",
      icon: "📦",
      description: todayOrdersBadge,
      isLoading: orderStats.loading,
      hasError: orderStats.error,
    },
  ];

  return (
    <div className="row g-3">
      {cardData.map((card, index) => (
        <div key={index} className="col-xxl-3 col-xl-4 col-md-6 col-sm-6 col-6">
          <Link to={`/dashboard${card.url}`} className="text-decoration-none">
            <div
              className="card text-white shadow rounded-3 border-0 status-card position-relative"
              style={{
                background: card.gradient,
                transition: "all 0.3s ease",
                minHeight: "120px",
                opacity: card.isLoading ? 0.7 : 1,
              }}
            >
              <div className="card-body p-3 d-flex flex-column justify-content-center align-items-center text-center">
                {/* Loading spinner for total orders card */}
                {card.isLoading && (
                  <div className="position-absolute top-50 start-50 translate-middle">
                    <div
                      className="spinner-border spinner-border-sm"
                      role="status"
                    >
                      <span className="visually-hidden">Loading...</span>
                    </div>
                  </div>
                )}

                <div
                  className="card-icon mb-1"
                  style={{
                    fontSize: "1.8rem",
                    opacity: card.isLoading ? 0.3 : 1,
                  }}
                >
                  {card.icon}
                </div>

                <h6
                  className="card-title mb-1 fw-semibold small"
                  style={{ opacity: card.isLoading ? 0.3 : 1 }}
                >
                  {card.title}
                </h6>

                <h5
                  className="card-value fw-bold m-0"
                  style={{ opacity: card.isLoading ? 0.3 : 1 }}
                >
                  {card.value}
                </h5>

                {/* Badge for today's orders */}
                {card.description && !card.isLoading && (
                  <div className="position-absolute top-0 end-0 mt-2 me-2">
                    <span
                      className="badge bg-light text-dark px-2 py-1"
                      style={{ fontSize: "0.65rem", fontWeight: "600" }}
                    >
                      {card.description}
                    </span>
                  </div>
                )}

                {/* Error indicator */}
                {card.hasError && (
                  <div className="position-absolute top-0 start-0 mt-2 ms-2">
                    <span
                      className="badge bg-danger px-2 py-1"
                      style={{ fontSize: "0.6rem" }}
                      title={card.hasError}
                    >
                      !
                    </span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        </div>
      ))}

      {/* CSS Styles */}
      <style>
        {`
          .status-card {
            cursor: pointer;
            transform: translateY(0);
          }

          .status-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
          }

          /* Mobile-first responsive design */
          @media (max-width: 576px) {
            .status-card {
              min-height: 100px !important;
            }
            
            .card-icon {
              font-size: 1.5rem !important;
            }
            
            .card-title {
              font-size: 0.75rem !important;
              line-height: 1.2;
            }
            
            .card-value {
              font-size: 1rem !important;
            }
            
            .card-body {
              padding: 0.75rem !important;
            }

            .badge {
              font-size: 0.6rem !important;
              padding: 0.15rem 0.4rem !important;
            }
          }

          @media (min-width: 577px) and (max-width: 768px) {
            .status-card {
              min-height: 110px !important;
            }
            
            .card-icon {
              font-size: 1.6rem !important;
            }
            
            .card-title {
              font-size: 0.8rem !important;
            }
            
            .card-value {
              font-size: 1.1rem !important;
            }
          }

          @media (min-width: 769px) {
            .status-card {
              min-height: 120px !important;
            }
          }

          /* For very small screens */
          @media (max-width: 360px) {
            .col-6 {
              padding: 0.25rem !important;
            }
            
            .status-card {
              min-height: 90px !important;
            }
            
            .card-body {
              padding: 0.5rem !important;
            }
            
            .card-icon {
              font-size: 1.3rem !important;
            }
            
            .card-title {
              font-size: 0.7rem !important;
            }
            
            .card-value {
              font-size: 0.9rem !important;
            }

            .badge {
              font-size: 0.55rem !important;
              padding: 0.1rem 0.3rem !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default StatusCards;
