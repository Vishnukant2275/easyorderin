import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminHeader.css';
import { useEffect } from 'react';

const AdminHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', path: '/admin/dashboard', icon: '📊' },
    { name: 'Restaurants', path: '/admin/restaurants', icon: '🏪' },
    { name: 'Users', path: '/admin/users', icon: '📦' },
    { name: 'Revenue', path: '/admin/revenue', icon: '🍽️' },
    { name: 'Analytics', path: '/admin/analytics', icon: '📈' },
  ];

const handleLogout = async () => {
  try {
    // Make API call to logout endpoint
    const response = await fetch('/api/admin/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // or however you store your token
      }
    });

    const data = await response.json();

    if (data.success) {
      // Clear client-side storage
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      sessionStorage.removeItem('adminToken');
      
      // Clear any cookies if used
      document.cookie = 'adminToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login page
      window.location.href = '/admin/login';
    } else {
      console.error('Logout failed:', data.message);
      // Fallback: clear storage anyway and redirect
      localStorage.removeItem('adminToken');
      localStorage.removeItem('adminUser');
      window.location.href = '/admin/login';
    }
  } catch (error) {
    console.error('Logout error:', error);
    // Fallback: clear storage and redirect on error
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    window.location.href = '/admin/login';
  }
};

  const isActivePath = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <header className="admin-header">
      <div className="admin-header-container">
        {/* Logo Section */}
        <div className="admin-header-logo">
          <Link to="/admin/dashboard" className="logo-link">
            <div className="logo-icon">🍕</div>
            <span className="logo-text">EasyOrderIn Admin</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="admin-header-nav">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActivePath(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-text">{item.name}</span>
            </Link>
          ))}
        </nav>

        {/* User Section */}
        <div className="admin-header-user">
          <div className="user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <span className="user-name">Admin User</span>
              <span className="user-role">Administrator</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout}>
            <span className="logout-icon">🚪</span>
            <span className="logout-text">Logout</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="mobile-menu-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <span className="menu-icon">☰</span>
        </button>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="mobile-nav">
          {navigation.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`mobile-nav-link ${isActivePath(item.path) ? 'active' : ''}`}
              onClick={() => setIsMenuOpen(false)}
            >
              <span className="mobile-nav-icon">{item.icon}</span>
              <span className="mobile-nav-text">{item.name}</span>
            </Link>
          ))}
          <button className="mobile-logout-btn" onClick={handleLogout}>
            <span className="mobile-logout-icon">🚪</span>
            <span className="mobile-logout-text">Logout</span>
          </button>
        </div>
      )}
    </header>
  );
};

export default AdminHeader;