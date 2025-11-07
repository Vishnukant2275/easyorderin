import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import api from "../services/api";
import styles from "./UserAccount.module.css";
import { toast } from "react-toastify";

const UserAccount = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(false);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const { user, updateUser, loginWithOtp, logout, isAuthenticated } = useUser();

  // Login form state
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const settings = [
    {
      id: "notifications",
      icon: "🔔",
      label: "Push Notifications",
      enabled: true,
    },
    { id: "email", icon: "📧", label: "Email Notifications", enabled: false },
    { id: "darkMode", icon: "🌙", label: "Dark Mode", enabled: false },
  ];

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
      });
      loadOrderHistory();
    }
  }, [user]);

  const loadOrderHistory = async () => {
    if (!user?._id) {
      console.log("❌ No user ID available");
      return;
    }

    try {
      setOrdersLoading(true);
      const response = await api.get(`/user/${user._id}/orders`);
      console.log("📦 RAW ORDER DATA:", response.data);

      // Handle different response structures
      const orders = response.data.data || response.data.orders || [];
      console.log("📦 Processed orders:", orders);

      setOrderHistory(orders);
    } catch (error) {
      console.error("❌ Error loading order history:", error);
      console.error("Error details:", error.response?.data);
      toast.error("Failed to load order history");
      setOrderHistory([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Please enter your name");
      return;
    }

    if (!formData.phone || formData.phone.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setProfileLoading(true);
      const response = await updateUser(formData);

      if (response?.success) {
        setEditing(false);
        toast.success("Profile updated successfully!");
      } else {
        toast.error(response?.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setProfileLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    try {
      setLoading(true);
      const orderResponse = await api.get(`/orders/${orderId}`);
      const order = orderResponse.data.data;

      const newOrder = {
        items: order.items.map((item) => ({
          menuItem: item.menuItem._id,
          quantity: item.quantity,
          specialInstructions: item.specialInstructions,
        })),
        user: user._id,
        totalAmount: order.totalAmount,
      };

      const response = await api.post("/orders", newOrder);

      if (response.data.success) {
        toast.success("Order placed successfully!");
        loadOrderHistory();
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      console.error("Error reordering:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSettingToggle = async (settingId, enabled) => {
    try {
      await updateUser({
        preferences: {
          ...user.preferences,
          [settingId]: enabled,
        },
      });
      toast.success(`Setting ${enabled ? "enabled" : "disabled"} successfully!`);
    } catch (error) {
      console.error("Error updating setting:", error);
      toast.error("Failed to update setting. Please try again.");
    }
  };

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await api.post("/auth/logout");
        logout();
        toast.success("Logged out successfully!");
      } catch (error) {
        console.error("Logout error:", error);
        logout();
        toast.success("Logged out successfully!");
      }
    }
  };

  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: styles.statusPending, text: "Pending" },
      preparing: { class: styles.statusPreparing, text: "Preparing" },
      served: { class: styles.statusCompleted, text: "Completed" },
      completed: { class: styles.statusCompleted, text: "Completed" },
      cancelled: { class: styles.statusCancelled, text: "Cancelled" },
    };

    const config = statusConfig[status] || statusConfig.pending;
    return (
      <span className={`${styles.statusBadge} ${config.class}`}>
        {config.text}
      </span>
    );
  };

  // Login Handlers
  const handleSendOtp = async () => {
    

    if (!phone.match(/^[6-9]\d{9}$/)) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/send-otp", { phone, name });

      if (response.data.success) {
        setOtpSent(true);
        toast.success("OTP sent successfully!");
        console.log("Debug OTP:", response.data.debugOtp); // Remove in production
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      toast.error(error.response?.data?.message || "Error sending OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.match(/^\d{6}$/)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/verify-otp", { phone, otp, name });

    if (response.data.success) {
  // Store token and user data
  localStorage.setItem("userToken", response.data.token);
  localStorage.setItem("userData", JSON.stringify(response.data.user));

  // Update context
  if (loginWithOtp) {
    await loginWithOtp(response.data.user, response.data.token);
  }

  toast.success("Login successful!");
  
  // Reset form
  setName("");
  setPhone("");
  setOtp("");
  setOtpSent(false);
  
  // Refresh the page after a short delay to ensure context is updated
  setTimeout(() => {
    window.location.reload();
  }, 100);
} else {
        toast.error(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      toast.error(error.response?.data?.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Login View
  if (!isAuthenticated || !user) {
    return (
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <h2>Login to Your Account</h2>

          <div className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label>Name(Optional)</label>
              <input
                type="text"
                placeholder="Enter Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading || otpSent}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Mobile Number*</label>
              <input
                type="tel"
                placeholder="Enter 10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                maxLength="10"
                disabled={otpSent || loading}
              />
            </div>

            {otpSent && (
              <div className={styles.formGroup}>
                <label>Enter OTP</label>
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength="6"
                  disabled={loading}
                />
                <div className={styles.otpHint}>OTP sent to +91 {phone}</div>
              </div>
            )}

            <button
              onClick={otpSent ? handleVerifyOtp : handleSendOtp}
              disabled={loading}
              className={styles.otpButton}
            >
              {loading ? (
                <div className={styles.loadingSpinner}></div>
              ) : otpSent ? (
                "Verify OTP"
              ) : (
                "Send OTP"
              )}
            </button>

            {otpSent && (
              <button
                type="button"
                onClick={() => {
                  setOtpSent(false);
                  setOtp("");
                }}
                className={styles.changeNumberButton}
                disabled={loading}
              >
                Change Phone Number
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // User Account View
  const userData = {
    name: user.name,
    email: user.email || "Email Not Available",
    phone: user.phone,
    joinDate: new Date(user.createdAt || Date.now()).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    }),
    totalOrders: orderHistory.length,
    favoriteItems: user.preferences?.favoriteItems || [],
  };

  return (
    <div className={styles.accountContainer}>
      {/* Header */}
      <header className={styles.accountHeader}>
        <div className={styles.headerContent}>
          <div className={styles.userAvatar}>
            <span className={styles.avatarText}>
              {userData.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase()}
            </span>
          </div>
          <div className={styles.userInfo}>
            <h1 className={styles.userName}>{userData.name}</h1>
            <p className={styles.userEmail}>{userData.email}</p>
            <div className={styles.userStats}>
              <span className={styles.stat}>
                <strong>{userData.totalOrders}</strong> Orders
              </span>
              <span className={styles.stat}>
                Member since <strong>{userData.joinDate}</strong>
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className={styles.accountTabs}>
        {["profile", "orders", "settings"].map((tab) => (
          <button
            key={tab}
            className={`${styles.tab} ${
              activeTab === tab ? styles.activeTab : ""
            }`}
            onClick={() => setActiveTab(tab)}
          >
            <span className={styles.tabIcon}>
              {tab === "profile" ? "👤" : tab === "orders" ? "📦" : "⚙️"}
            </span>
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </nav>

      {/* Main Content */}
      <main className={styles.accountMain}>
        {activeTab === "profile" && (
          <div className={styles.tabContent}>
            <div className={styles.profileSection}>
              <div className={styles.sectionHeader}>
                <h2>Personal Information</h2>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className={styles.editButton}
                  >
                    Edit Profile
                  </button>
                )}
              </div>

              {editing ? (
                <form onSubmit={handleUpdateProfile}>
                  <div className={styles.formGroup}>
                    <label>Full Name *</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={profileLoading}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      disabled={profileLoading}
                    />
                  </div>
                 
                  <div className={styles.formActions}>
                    <button
                      type="submit"
                      disabled={profileLoading}
                      className={styles.saveButton}
                    >
                      {profileLoading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          name: user.name || "",
                          email: user.email || "",
                          phone: user.phone || "",
                        });
                      }}
                      disabled={profileLoading}
                      className={styles.cancelButton}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <div className={styles.infoCard}>
                  <div className={styles.infoRow}>
                    <span>Full Name</span>
                    <span>{userData.name}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Email</span>
                    <span>{userData.email}</span>
                  </div>
                  <div className={styles.infoRow}>
                    <span>Phone</span>
                    <span>{userData.phone}</span>
                  </div>
                </div>
              )}
            </div>

            <div className={styles.profileSection}>
              <h2>Favorite Items</h2>
              <div className={styles.favoritesGrid}>
                {userData.favoriteItems.length > 0 ? (
                  userData.favoriteItems.map((item, index) => (
                    <div key={index} className={styles.favoriteItem}>
                      ❤️ {item}
                    </div>
                  ))
                ) : (
                  <p className={styles.noItems}>No favorite items yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className={styles.tabContent}>
            <div className={styles.sectionHeader}>
              <h2>Order History</h2>
              <button 
                onClick={loadOrderHistory} 
                className={styles.refreshButton}
                disabled={ordersLoading}
              >
                {ordersLoading ? "Refreshing..." : "Refresh"}
              </button>
            </div>

            {ordersLoading ? (
              <div className={styles.loadingState}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading orders...</p>
              </div>
            ) : orderHistory.length === 0 ? (
              <div className={styles.emptyState}>
                <div className={styles.emptyIcon}>📦</div>
                <h3>No Orders Yet</h3>
                <p>Your order history will appear here</p>
                <button className={styles.browseButton}>Browse Menu</button>
              </div>
            ) : (
              <div className={styles.ordersList}>
                {orderHistory.map((order) => (
                  <div key={order._id} className={styles.orderCard}>
                    <div className={styles.orderHeader}>
                      <div>
                        <h4>
                          Order #
                          {order.orderNumber ||
                            order._id?.slice(-6).toUpperCase() ||
                            "N/A"}
                        </h4>
                        <span className={styles.orderDate}>
                          {order.createdAt
                            ? new Date(order.createdAt).toLocaleDateString()
                            : "Date not available"}
                        </span>
                      </div>
                      {getOrderStatusBadge(order.status)}
                    </div>

                    {order.restaurant && (
                      <div className={styles.restaurantInfo}>
                        <span className={styles.restaurantIcon}>🏪</span>
                        <span className={styles.restaurantName}>
                          {order.restaurant.name ||
                            order.restaurant.restaurantName ||
                            "Restaurant"}
                        </span>
                      </div>
                    )}

                    <div className={styles.orderDetails}>
                      <span>
                        {order.menuItems?.reduce(
                          (total, item) => total + (item.quantity || 0),
                          0
                        ) || 0}{" "}
                        items
                      </span>
                      <span>₹{order.totalPrice || order.totalAmount || 0}</span>
                    </div>

                    {order.menuItems?.slice(0, 2).map((item, index) => (
                      <div key={index} className={styles.orderItemPreview}>
                        {item.quantity}x {item.name || "Unknown Item"} - ₹{item.price || 0}
                      </div>
                    ))}
                    {order.menuItems && order.menuItems.length > 2 && (
                      <div className={styles.moreItems}>
                        +{order.menuItems.length - 2} more items
                      </div>
                    )}

                    
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "settings" && (
          <div className={styles.tabContent}>
            <h2>App Settings</h2>

            <div className={styles.settingsList}>
              {settings.map((setting) => (
                <div key={setting.id} className={styles.settingItem}>
                  <div className={styles.settingInfo}>
                    <span className={styles.settingIcon}>{setting.icon}</span>
                    <div className={styles.settingText}>
                      <span>{setting.label}</span>
                    </div>
                  </div>

                  <label className={styles.toggleSwitch}>
                    <input
                      type="checkbox"
                      checked={setting.enabled}
                      onChange={(e) =>
                        handleSettingToggle(setting.id, e.target.checked)
                      }
                    />
                    <span className={styles.slider}></span>
                  </label>
                </div>
              ))}
            </div>

            <div className={styles.logoutSection}>
              <button onClick={handleLogout} className={styles.logoutButton}>
                🚪 Log Out
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UserAccount;