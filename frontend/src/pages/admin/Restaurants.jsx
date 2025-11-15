import React, { useState } from 'react';
import styles from './Restaurants.module.css';

const Restaurants = () => {
  const [restaurants, setRestaurants] = useState([
    {
      id: 1,
      name: 'Biryani Blues',
      owner: 'Rajesh Kumar',
      email: 'rajesh@biryanishub.com',
      phone: '+91 9876543210',
      status: 'active',
      registrationDate: '2024-01-15',
      totalOrders: 284,
      revenue: '₹84,567',
      rating: 4.8,
      paymentMethod: 'razorpay',
      commission: 15
    },
    {
      id: 2,
      name: 'Pizza Palace',
      owner: 'Priya Sharma',
      email: 'priya@pizzapalace.com',
      phone: '+91 9876543211',
      status: 'active',
      registrationDate: '2024-01-20',
      totalOrders: 198,
      revenue: '₹67,890',
      rating: 4.6,
      paymentMethod: 'stripe',
      commission: 12
    },
    {
      id: 3,
      name: 'Burger Hub',
      owner: 'Amit Verma',
      email: 'amit@burgerhub.com',
      phone: '+91 9876543212',
      status: 'inactive',
      registrationDate: '2024-02-01',
      totalOrders: 167,
      revenue: '₹45,678',
      rating: 4.5,
      paymentMethod: 'razorpay',
      commission: 18
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const toggleRestaurantStatus = (id) => {
    setRestaurants(restaurants.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, status: restaurant.status === 'active' ? 'inactive' : 'active' }
        : restaurant
    ));
  };

  const updateCommission = (id, newCommission) => {
    setRestaurants(restaurants.map(restaurant => 
      restaurant.id === id 
        ? { ...restaurant, commission: newCommission }
        : restaurant
    ));
  };

  const filteredRestaurants = restaurants.filter(restaurant => {
    const matchesSearch = restaurant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         restaurant.owner.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || restaurant.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className={styles.restaurants}>
      <div className={styles.restaurantsHeader}>
        <div className={styles.headerContent}>
          <h1 className={styles.restaurantsTitle}>Restaurant Management</h1>
          <p className={styles.restaurantsSubtitle}>Manage all registered restaurants and their settings</p>
        </div>
        <button className={styles.addRestaurantBtn}>
          <span className={styles.btnIcon}>+</span>
          Add New Restaurant
        </button>
      </div>

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
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Restaurants Grid */}
      <div className={styles.restaurantsGrid}>
        {filteredRestaurants.map(restaurant => (
          <div key={restaurant.id} className={styles.restaurantCard}>
            <div className={styles.cardHeader}>
              <div className={styles.restaurantBasic}>
                <h3 className={styles.restaurantName}>{restaurant.name}</h3>
                <span className={`${styles.status} ${styles[restaurant.status]}`}>
                  {restaurant.status}
                </span>
              </div>
              <div className={styles.rating}>
                ⭐ {restaurant.rating}
              </div>
            </div>

            <div className={styles.restaurantInfo}>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Owner:</span>
                <span className={styles.infoValue}>{restaurant.owner}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Contact:</span>
                <span className={styles.infoValue}>{restaurant.phone}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Email:</span>
                <span className={styles.infoValue}>{restaurant.email}</span>
              </div>
              <div className={styles.infoItem}>
                <span className={styles.infoLabel}>Registered:</span>
                <span className={styles.infoValue}>{restaurant.registrationDate}</span>
              </div>
            </div>

            <div className={styles.stats}>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{restaurant.totalOrders}</span>
                <span className={styles.statLabel}>Orders</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{restaurant.revenue}</span>
                <span className={styles.statLabel}>Revenue</span>
              </div>
              <div className={styles.stat}>
                <span className={styles.statNumber}>{restaurant.commission}%</span>
                <span className={styles.statLabel}>Commission</span>
              </div>
            </div>

            <div className={styles.actions}>
              <button 
                className={`${styles.statusBtn} ${styles[restaurant.status]}`}
                onClick={() => toggleRestaurantStatus(restaurant.id)}
              >
                {restaurant.status === 'active' ? 'Disable' : 'Enable'}
              </button>
              
              <div className={styles.commissionControl}>
                <label className={styles.commissionLabel}>Commission:</label>
                <input
                  type="number"
                  value={restaurant.commission}
                  onChange={(e) => updateCommission(restaurant.id, parseInt(e.target.value))}
                  className={styles.commissionInput}
                  min="0"
                  max="30"
                />
                <span className={styles.percent}>%</span>
              </div>
              
              <select 
                value={restaurant.paymentMethod}
                onChange={(e) => {
                  const updatedMethod = e.target.value;
                  setRestaurants(restaurants.map(r => 
                    r.id === restaurant.id ? { ...r, paymentMethod: updatedMethod } : r
                  ));
                }}
                className={styles.paymentSelect}
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

      {filteredRestaurants.length === 0 && (
        <div className={styles.noResults}>
          <div className={styles.noResultsIcon}>🏪</div>
          <h3>No restaurants found</h3>
          <p>Try adjusting your search or filter criteria</p>
        </div>
      )}
    </div>
  );
};

export default Restaurants;