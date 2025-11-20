import React, { useState, useEffect } from 'react';

const NotActive = ({ 
  message = "This restaurant is currently inactive. Please contact support to activate your account.",
  showRefreshButton = true,
  showContactButton = true,
  onClose,
  reappearInterval = 5 * 60 * 1000, // 5 minutes default
  variant = "card" // 'card' or 'alert'
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [lastChecked, setLastChecked] = useState(new Date());

  // Check restaurant status
  const checkRestaurantStatus = async () => {
    try {
      const response = await fetch("/api/restaurant/status/current", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setLastChecked(new Date());
        
        if (data.success && data.status !== "active") {
          setIsVisible(true);
          return true;
        } else {
          setIsVisible(false);
          return false;
        }
      }
    } catch (error) {
      console.error("Error checking restaurant status:", error);
    }
    return false;
  };

  // Initial check and set up interval
  useEffect(() => {
    checkRestaurantStatus();

    const interval = setInterval(() => {
      checkRestaurantStatus();
    }, reappearInterval);

    return () => clearInterval(interval);
  }, [reappearInterval]);

  // Also check when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkRestaurantStatus();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleContactSupport = () => {
    // Customize support contact methods
    window.open('tel:+919876543210', '_self');
    // Or: window.location.href = 'mailto:support@restaurant.com';
  };

  const handleRefresh = () => {
    checkRestaurantStatus();
  };

  const handleClose = () => {
    setIsVisible(false);
    if (onClose) {
      onClose();
    }
  };

  if (!isVisible) {
    return null;
  }

  if (variant === "alert") {
    return (
      <div className="alert alert-warning alert-dismissible fade show mb-4" role="alert">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h5 className="alert-heading mb-2">
              <i className="fas fa-exclamation-triangle me-2"></i>
              Account Status: Inactive
            </h5>
            <p className="mb-1">{message}</p>
            <small className="text-muted">
              Last checked: {lastChecked.toLocaleTimeString()}
            </small>
          </div>
          <div className="d-flex align-items-center gap-2">
            {showContactButton && (
              <button 
                className="btn btn-warning btn-sm"
                onClick={handleContactSupport}
              >
                <i className="fas fa-phone me-1"></i>
                Contact Support
              </button>
            )}
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
              aria-label="Close"
            ></button>
          </div>
        </div>
      </div>
    );
  }

  // Default card variant
  return (
    <div className="card border-warning mb-4">
      <div className="card-header bg-warning text-dark d-flex justify-content-between align-items-center">
        <strong>
          <i className="fas fa-exclamation-circle me-2"></i>
          Account Status: Inactive
        </strong>
        <button
          type="button"
          className="btn-close"
          onClick={handleClose}
          aria-label="Close"
        ></button>
      </div>
      <div className="card-body">
        <div className="row align-items-center">
          <div className="col-md-8">
            <h6 className="card-title text-warning mb-2">Action Required</h6>
            <p className="card-text mb-2">{message}</p>
            <small className="text-muted">
              Last checked: {lastChecked.toLocaleTimeString()} • 
              This alert will reappear every {reappearInterval / 60000} minutes until activated.
            </small>
          </div>
          <div className="col-md-4 text-end">
            {showContactButton && (
              <button 
                className="btn btn-warning btn-sm me-2"
                onClick={handleContactSupport}
              >
                <i className="fas fa-phone me-1"></i>
                Contact Support
              </button>
            )}
            {showRefreshButton && (
              <button 
                className="btn btn-outline-secondary btn-sm"
                onClick={handleRefresh}
              >
                <i className="fas fa-sync-alt me-1"></i>
                Refresh Status
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotActive;