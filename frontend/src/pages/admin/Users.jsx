import React, { useState, useEffect } from "react";
import { useAdminUser } from "../../context/AdminUserContext";
import styles from "./Users.module.css";

const Users = () => {
  const { users, loading, error, toggleUserStatus, refreshUsers } =
    useAdminUser();

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("joinDate");
  const [updatingId, setUpdatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(""), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const filteredUsers = users
    .filter((user) => {
      const matchesSearch =
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || user.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "totalOrders":
          return b.totalOrders - a.totalOrders;
        case "totalSpent":
          return b.totalSpent - a.totalSpent;
        case "joinDate":
        default:
          return new Date(b.joinDate) - new Date(a.joinDate);
      }
    });

  const getUserInitials = (name) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const getStatusColor = (status) => {
    return status === "active" ? "#48bb78" : "#e53e3e";
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "No orders";
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const handleToggleStatus = async (userId) => {
    setUpdatingId(userId);
    const result = await toggleUserStatus(userId);
    setUpdatingId(null);

    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      console.error(result.message);
    }
  };

  if (loading && users.length === 0) {
    return (
      <div className={styles.users}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.users}>
      <div className={styles.usersHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.usersTitle}>User Management</h1>
          <p className={styles.usersSubtitle}>
            Manage all registered users and their activities
            {users.length > 0 && ` (${users.length} total)`}
          </p>
        </div>
        <div className={styles.headerStats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>{users.length}</span>
            <span className={styles.statLabel}>Total Users</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>
              {users.filter((u) => u.status === "active").length}
            </span>
            <span className={styles.statLabel}>Active Users</span>
          </div>
          <button
            className={styles.refreshBtn}
            onClick={refreshUsers}
            disabled={loading}
          >
            {loading ? "🔄 Refreshing..." : "🔄 Refresh"}
          </button>
        </div>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button onClick={refreshUsers}>Retry</button>
        </div>
      )}

      {successMessage && (
        <div className={styles.successBanner}>
          <span>✅ {successMessage}</span>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          <span className={styles.searchIcon}>🔍</span>
        </div>

        <div className={styles.filters}>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">All Status ({users.length})</option>
            <option value="active">
              Active ({users.filter((u) => u.status === "active").length})
            </option>
            <option value="inactive">
              Inactive ({users.filter((u) => u.status === "inactive").length})
            </option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="joinDate">Sort by Join Date</option>
            <option value="name">Sort by Name</option>
            <option value="totalOrders">Sort by Orders</option>
            <option value="totalSpent">Sort by Total Spent</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className={styles.usersTable}>
        <div className={styles.tableHeader}>
          <div className={styles.tableRow}>
            <div className={styles.colUser}>User</div>
            <div className={styles.colContact}>Contact</div>
            <div className={styles.colStats}>Statistics</div>
            <div className={styles.colFavorite}>Favorite</div>
            <div className={styles.colStatus}>Status</div>
            <div className={styles.colActions}>Actions</div>
          </div>
        </div>

        <div className={styles.tableBody}>
          {filteredUsers.map((user) => (
            <div key={user._id} className={styles.tableRow}>
              <div className={styles.colUser}>
                <div className={styles.userAvatar}>
                  {getUserInitials(user.name)}
                </div>
                <div className={styles.userInfo}>
                  <h4 className={styles.userName}>{user.name}</h4>
                  <p className={styles.userEmail}>{user.email}</p>
                  <span className={styles.joinDate}>
                    Joined:{" "}
                    {new Date(user.joinDate).toLocaleDateString("en-IN")}
                  </span>
                </div>
              </div>

              <div className={styles.colContact}>
                <div className={styles.contactInfo}>
                  <span className={styles.phone}>{user.phone}</span>
                </div>
              </div>

              <div className={styles.colStats}>
                <div className={styles.userStats}>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>{user.totalOrders}</span>
                    <span className={styles.statLabel}>Orders</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {formatCurrency(user.totalSpent)}
                    </span>
                    <span className={styles.statLabel}>Spent</span>
                  </div>
                  <div className={styles.statItem}>
                    <span className={styles.statValue}>
                      {formatDate(user.lastOrder)}
                    </span>
                    <span className={styles.statLabel}>Last Order</span>
                  </div>
                </div>
              </div>

              <div className={styles.colFavorite}>
                <span className={styles.favoriteRestaurant}>
                  {user.favoriteRestaurant}
                </span>
              </div>

              <div className={styles.colStatus}>
                <span
                  className={styles.statusBadge}
                  style={{
                    backgroundColor: getStatusColor(user.status) + "20",
                    color: getStatusColor(user.status),
                  }}
                >
                  {user.status}
                </span>
              </div>

              <div className={styles.colActions}>
                <div className={styles.actionButtons}>
                  <button className={styles.viewBtn}>View</button>
                  <button className={styles.ordersBtn}>Orders</button>
                  <button
                    className={`${styles.statusToggleBtn} ${
                      updatingId === user._id ? styles.loading : ""
                    } ${user.status === "inactive" ? styles.inactive : ""}`}
                    onClick={() => handleToggleStatus(user._id)}
                    disabled={updatingId === user._id}
                  >
                    {updatingId === user._id
                      ? "..."
                      : user.status === "active"
                      ? "Disable"
                      : "Enable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {filteredUsers.length === 0 && !loading && (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>👥</div>
          <h3>No users found</h3>
          <p>
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No users have been registered yet"}
          </p>
        </div>
      )}
    </div>
  );
};

export default Users;
