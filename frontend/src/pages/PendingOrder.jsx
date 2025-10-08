import React, { useState, useEffect } from 'react';

const PendingOrders = ({ allOrders = [], updateOrderStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [timeElapsed, setTimeElapsed] = useState({});

  // Safe filtering with default empty array
  const pendingOrders = (allOrders || []).filter(order => order.status === 'pending');
  const completedOrders = (allOrders || []).filter(order => order.status === 'completed');

  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeElapsed = {};
      pendingOrders.forEach(order => {
        const orderTime = new Date(order.orderTime);
        const now = new Date();
        const diffMs = now - orderTime;
        const diffMins = Math.floor(diffMs / 60000);
        newTimeElapsed[order.id] = diffMins;
      });
      setTimeElapsed(newTimeElapsed);
    }, 60000);

    return () => clearInterval(interval);
  }, [pendingOrders]);

  const filteredOrders = pendingOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTimeAlertClass = (minutes) => {
    if (minutes > 30) return 'danger';
    if (minutes > 15) return 'warning';
    return 'success';
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Pending Orders</h2>
          <p className="text-muted mb-0">
            {pendingOrders.length} order{pendingOrders.length !== 1 ? 's' : ''} waiting
          </p>
        </div>
        <div className="input-group" style={{ width: '300px' }}>
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search pending orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Pending Orders Grid */}
      <div className="row g-3 mb-5">
        {filteredOrders.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3 text-muted">No pending orders</h4>
              <p className="text-muted">All orders are being processed!</p>
            </div>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="col-md-6 col-lg-4">
              <div 
                className={`card h-100 border-${getTimeAlertClass(timeElapsed[order.id] || 0)}`}
                style={{ borderWidth: '2px' }}
              >
                <div className="card-header d-flex justify-content-between align-items-center">
                  <strong>{order.orderNumber}</strong>
                  <span className="badge bg-warning">Pending</span>
                </div>
                
                <div className="card-body">
                  <div className="mb-3">
                    <div className="d-flex justify-content-between">
                      <span>
                        <i className="bi bi-person me-2"></i>
                        {order.customerName}
                      </span>
                      <span className="badge bg-light text-dark">
                        {order.tableNumber}
                      </span>
                    </div>
                    {order.customerPhone && (
                      <small className="text-muted">
                        <i className="bi bi-phone me-1"></i>
                        {order.customerPhone}
                      </small>
                    )}
                  </div>

                  <div className="mb-3">
                    <strong>Items:</strong>
                    {order.items.map((item, index) => (
                      <div key={index} className="d-flex justify-content-between small">
                        <span>
                          {item.quantity}x {item.name}
                        </span>
                        <span>₹{item.quantity * item.price}</span>
                      </div>
                    ))}
                  </div>

                  {order.specialInstructions && (
                    <div className="mb-2">
                      <small className="text-muted">
                        <strong>Note: </strong>
                        {order.specialInstructions}
                      </small>
                    </div>
                  )}

                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <small className="text-muted d-block">
                        Ordered: {new Date(order.orderTime).toLocaleTimeString()}
                      </small>
                      <small className={`text-${getTimeAlertClass(timeElapsed[order.id] || 0)}`}>
                        <i className="bi bi-clock me-1"></i>
                        {timeElapsed[order.id] || 0} min ago
                      </small>
                    </div>
                    <strong className="text-primary">
                      ₹{order.totalAmount}
                    </strong>
                  </div>
                </div>

                <div className="card-footer bg-transparent">
                  <div className="btn-group w-100">
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      Start Preparing
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => {
                        if (window.confirm('Are you sure you want to cancel this order?')) {
                          updateOrderStatus(order.id, 'cancelled');
                        }
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Completed Orders List */}
      {completedOrders.length > 0 && (
        <div className="mt-5">
          <h4 className="mb-3">Recently Completed Orders</h4>
          <div className="list-group">
            {completedOrders.slice(-5).map((order) => (
              <div key={order.id} className="list-group-item list-group-item-success">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{order.orderNumber}</strong> - {order.customerName} 
                    <small className="text-muted ms-2">({order.tableNumber})</small>
                  </div>
                  <div>
                    <span className="badge bg-success me-2">Completed</span>
                    <small className="text-muted">
                      ₹{order.totalAmount} • {new Date(order.orderTime).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;