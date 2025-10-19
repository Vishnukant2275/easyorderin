import React, { useState, useEffect } from "react";
import { useUser } from "../context/UserContext";
import api from "../services/api";
import styles from "./UserAccount.module.css";
import { toast } from "react-toastify";
const UserAccount = () => {
  const [activeTab, setActiveTab] = useState("profile");
  const [orderHistory, setOrderHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const { user, updateUser, loginWithOtp, logout, isAuthenticated } = useUser();

  // --- Login form state ---
  const [phone, setPhone] = useState("");
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
    try {
      if (user?._id) {
        const response = await api.get(`/users/${user._id}/orders`);
        setOrderHistory(response.data.data || []);
      }
    } catch (error) {
      console.error("Error loading order history:", error);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await updateUser(formData);

      if (response.success) {
        setEditing(false);
      toast.success("Profile updated successfully!");
      } else {
       toast.error(response.error || "Failed to update profile");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (orderId) => {
    try {
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
        // Reload order history to show the new order
        loadOrderHistory();
      }
    } catch (error) {
      console.error("Error reordering:", error);
      toast.errorr("Failed to place order. Please try again.");
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
      alert(`Setting ${enabled ? 'enabled' : 'disabled'} successfully!`);
    } catch (error) {
      console.error("Error updating setting:", error);
      alert("Failed to update setting. Please try again.");
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      logout();
      alert("Logged out successfully!");
    }
  };

  const getOrderStatusBadge = (status) => {
    const statusConfig = {
      pending: { class: styles.statusPending, text: "Pending" },
      confirmed: { class: styles.statusConfirmed, text: "Confirmed" },
      preparing: { class: styles.statusPreparing, text: "Preparing" },
      ready: { class: styles.statusReady, text: "Ready" },
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

  // --- LOGIN HANDLERS ---
  const handleSendOtp = async () => {
    if (!phone.match(/^[6-9]\d{9}$/)) {
     toast.info("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/send-otp", { phone });

      if (response.data.success) {
        setOtpSent(true);
       toast.success("OTP sent successfully!");
        console.log("Debug OTP:", response.data.debugOtp); // Remove in production
      } else {
        toast.error(response.data.message || "Failed to send OTP");
      }
    } catch (error) {
      console.error("Error sending OTP:", error);
      if (error.response?.data?.message) {
       toast.error(error.response.data.message);
      } else {
        toast.error("Error sending OTP. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.warn("Please enter the OTP");
      return;
    }

    if (!otp.match(/^\d{6}$/)) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post("/auth/verify-otp", { phone, otp });

      if (response.data.success) {
        // Store token and user data
        localStorage.setItem("userToken", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));

        // Update context using loginWithOtp
        if (loginWithOtp) {
          await loginWithOtp(response.data.user, response.data.token);
        }

       toast.success("Login successful!");
        // Reset form
        setPhone("");
        setOtp("");
        setOtpSent(false);
      } else {
        toast.warn(response.data.message || "Invalid OTP");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        alert("Verification failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- LOGIN VIEW ---
  if (!isAuthenticated || !user) {
    return (
      <div className={styles.loginContainer}>
        <h2>Login to Your Account</h2>

        <div className={styles.loginForm}>
          <div className={styles.formGroup}>
            <label>Mobile Number</label>
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
    );
  }

  // --- USER ACCOUNT VIEW ---
  const userData = {
    name: user.name,
    email: user.email || "Not provided",
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
                    <label>Full Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      required
                      disabled={loading}
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
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      required
                      disabled={loading}
                    />
                  </div>
                  <div className={styles.formActions}>
                    <button 
                      type="submit" 
                      disabled={loading}
                      className={styles.saveButton}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditing(false)}
                      disabled={loading}
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
            <h2>Order History</h2>

            {orderHistory.length === 0 ? (
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
                        <h4>Order #{order.orderNumber || order._id.slice(-6)}</h4>
                        <span className={styles.orderDate}>
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {getOrderStatusBadge(order.status)}
                    </div>

                    <div className={styles.orderDetails}>
                      <span>
                        {order.items?.reduce(
                          (total, item) => total + (item.quantity || 0),
                          0
                        ) || 0}{" "}
                        items
                      </span>
                      <span>₹{order.totalAmount || 0}</span>
                    </div>

                    {order.items?.slice(0, 2).map((item, index) => (
                      <div key={index} className={styles.orderItemPreview}>
                        {item.quantity}x {item.menuItem?.name || item.name || "Item"}
                      </div>
                    ))}
                    {order.items?.length > 2 && (
                      <div className={styles.moreItems}>
                        +{order.items.length - 2} more items
                      </div>
                    )}

                    <div className={styles.orderActions}>
                      <button className={styles.viewButton}>View Details</button>
                      {order.status === "completed" && (
                        <button 
                          onClick={() => handleReorder(order._id)}
                          className={styles.reorderButton}
                        >
                          Reorder
                        </button>
                      )}
                    </div>
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
              <button 
                onClick={handleLogout}
                className={styles.logoutButton}
              >
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