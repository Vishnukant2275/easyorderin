import React, { useState, useEffect } from 'react';
import { useRestaurant } from '../../context/AdminRestaurantContext';
import styles from './Restaurants.module.css';

const Restaurants = () => {
  const { 
    restaurants, 
    loading, 
    error,
    toggleRestaurantStatus, 
    updateCommission, 
    updatePaymentMethod,
    refreshRestaurants 
  } = useRestaurant();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [updatingId, setUpdatingId] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(''), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Filter restaurants based on search and status
  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.
restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.ownerName?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleToggleStatus = async (restaurantId) => {
    setUpdatingId(restaurantId);
    const result = await toggleRestaurantStatus(restaurantId);
    setUpdatingId(null);
    
    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      // Handle error (you might want to show an error toast)
      console.error(result.message);
    }
  };

  const handleCommissionUpdate = async (restaurantId, newCommission) => {
    if (newCommission < 0 || newCommission > 30) return;
    
    setUpdatingId(restaurantId);
    const result = await updateCommission(restaurantId, newCommission);
    setUpdatingId(null);
    
    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      console.error(result.message);
    }
  };

  const handlePaymentMethodUpdate = async (restaurantId, newPaymentMethod) => {
    setUpdatingId(restaurantId);
    const result = await updatePaymentMethod(restaurantId, newPaymentMethod);
    setUpdatingId(null);
    
    if (result.success) {
      setSuccessMessage(result.message);
    } else {
      console.error(result.message);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  if (loading && restaurants.length === 0) {
    return (
      <div className={styles.restaurants}>
        <div className={styles.loadingState}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading restaurants...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.restaurants}>
      <div className={styles.restaurantsHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.restaurantsTitle}>Restaurant Management</h1>
          <p className={styles.restaurantsSubtitle}>
            Manage all registered restaurants and their settings
            {restaurants.length > 0 && ` (${restaurants.length} total)`}
          </p>
        </div>
        <button 
          className={styles.addRestaurantBtn}
          onClick={refreshRestaurants}
          disabled={loading}
        >
          <span className={styles.btnIcon}>🔄</span>
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      {/* Error and Success Messages */}
      {error && (
        <div className={styles.errorBanner}>
          <span>⚠️ {error}</span>
          <button onClick={refreshRestaurants}>Retry</button>
        </div>
      )}

      {successMessage && (
        <div className={styles.successBanner}>
          <span>✅ {successMessage}</span>
        </div>
      )}

      {/* Filters and Search */}
      <div className={styles.controls}>
        <div className={styles.searchBox}>
          <input
            type="text"
            placeholder="Search restaurants or owners..."
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
            <option value="all">All Status ({restaurants.length})</option>
            <option value="active">Active ({restaurants.filter(r => r.status === 'active').length})</option>
            <option value="inactive">Inactive ({restaurants.filter(r => r.status === 'inactive').length})</option>
          </select>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className={styles.restaurantsGrid}>
        {filteredRestaurants.map(restaurant => (
          <div key={restaurant._id} className={styles.restaurantCard}>
            <div className={styles.cardHeader}>
              <div className={styles.restaurantBasic}>
                <h3 className={styles.restaurantName}>{restaurant.restaurantName}</h3>
                <span className={`${styles.status} ${styles[restaurant.status]}`}>
                  {restaurant.status}
                </span>
              </div>
              <div className={styles.rating}>
                ⭐ {restaurant.rating?.toFixed(1) || 'N/A'}
              </div>
            </div>

            <div className={styles.restaurantInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Owner:</span>
                <span className={styles.infoValue}>{restaurant?.ownerName || 'N/A'}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Contact:</span>
                <span className={styles.infoValue}>{restaurant.
contactNumber}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{restaurant.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Registered:</span>
                <span className={styles.infoValue}>{formatDate(restaurant.createdAt)}</span>
              </div>
              {restaurant.gstin && (
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>GSTIN:</span>
                  <span className={styles.infoValue}>{restaurant.gstin}</span>
                </div>
              )}
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{restaurant.totalOrders || 0}</span>
                <span className={styles.statLabel}>Orders</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{formatCurrency(restaurant.totalRevenue || 0)}</span>
                <span className={styles.statLabel}>Revenue</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{restaurant.commissionRate || 15}%</span>
                <span className={styles.statLabel}>Commission</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button 
                className={`${styles.statusBtn} ${styles[restaurant.status]} ${updatingId === restaurant._id ? styles.loading : ''}`}
                onClick={() => handleToggleStatus(restaurant._id)}
                disabled={updatingId === restaurant._id}
              >
                {updatingId === restaurant._id ? 'Updating...' : restaurant.status === 'active' ? 'Disable' : 'Enable'}
              </button>
              
              <div className={styles.commissionControl}>
                <label className={styles.commissionLabel}>Commission:</label>
                <input
                  type="number"
                  value={restaurant.commissionRate || 15}
                  onChange={(e) => handleCommissionUpdate(restaurant._id, parseInt(e.target.value))}
                  className={styles.commissionInput}
                  min="0"
                  max="30"
                  disabled={updatingId === restaurant._id}
                />
                <span className={styles.percent}>%</span>
              </div>
              
              <select 
                value={restaurant.paymentMethod || 'razorpay'}
                onChange={(e) => handlePaymentMethodUpdate(restaurant._id, e.target.value)}
                className={styles.paymentSelect}
                disabled={updatingId === restaurant._id}
              >
                <option value="razorpay">Razorpay</option>
                <option value="stripe">Stripe</option>
                <option value="paypal">PayPal</option>
                <option value="bank">Bank Transfer</option>
              </select>

              <button className={styles.viewBtn}>View Details</button>
              <button className={styles.editBtn}>Edit</button>
            </div>
          </div>
        ))}
      </div>

      {filteredRestaurants.length === 0 && !loading && (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🏪</div>
          <h3>No restaurants found</h3>
          <p>
            {searchTerm || statusFilter !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'No restaurants have been registered yet'
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default Restaurants;