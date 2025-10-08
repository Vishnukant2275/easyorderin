import React, { useState, useEffect } from 'react';

const Preparing = ({ allOrders = [], updateOrderStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [prepStartTime, setPrepStartTime] = useState({});

  const preparingOrders = (allOrders || []).filter(order => order.status === 'preparing');
  const completedOrders = (allOrders || []).filter(order => order.status === 'completed');

  useEffect(() => {
    const startTimes = {};
    preparingOrders.forEach(order => {
      if (!prepStartTime[order.id]) {
        startTimes[order.id] = new Date();
      }
    });
    if (Object.keys(startTimes).length > 0) {
      setPrepStartTime(prev => ({ ...prev, ...startTimes }));
    }
  }, [preparingOrders]);

  const filteredOrders = preparingOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPrepTime = (orderId) => {
    if (!prepStartTime[orderId]) return 0;
    const startTime = new Date(prepStartTime[orderId]);
    const now = new Date();
    return Math.floor((now - startTime) / 60000);
  };

  const getPrepTimeAlert = (minutes) => {
    if (minutes > 25) return 'danger';
    if (minutes > 15) return 'warning';
    return 'info';
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Orders in Preparation</h2>
          <p className="text-muted mb-0">
            {preparingOrders.length} order{preparingOrders.length !== 1 ? 's' : ''} being prepared
          </p>
        </div>
        <div className="input-group" style={{ width: '300px' }}>
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search preparing orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Preparing Orders Grid */}
      <div className="row g-3 mb-5">
        {filteredOrders.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-egg-fried text-info" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3 text-muted">No orders in preparation</h4>
              <p className="text-muted">Start preparing orders from the pending section</p>
            </div>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="col-md-6 col-lg-4">
              <div 
                className={`card h-100 border-${getPrepTimeAlert(getPrepTime(order.id))}`}
                style={{ borderWidth: '2px' }}
              >
                <div className="card-header d-flex justify-content-between align-items-center">
                  <strong>{order.orderNumber}</strong>
                  <span className="badge bg-info">Preparing</span>
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
                        Started: {prepStartTime[order.id] ? new Date(prepStartTime[order.id]).toLocaleTimeString() : 'Just now'}
                      </small>
                      <small className={`text-${getPrepTimeAlert(getPrepTime(order.id))}`}>
                        <i className="bi bi-clock me-1"></i>
                        {getPrepTime(order.id)} min in preparation
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
                      className="btn btn-sm btn-success"
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                    >
                      Mark as Prepared
                    </button>
                    <button
                      className="btn btn-sm btn-outline-warning"
                      onClick={() => updateOrderStatus(order.id, 'pending')}
                    >
                      Move Back to Pending
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

export default Preparing;