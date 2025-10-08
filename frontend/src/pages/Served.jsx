import React, { useState } from 'react';

const Served = ({ allOrders = [], updateOrderStatus }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const readyOrders = (allOrders || []).filter(order => order.status === 'ready');
  const completedOrders = (allOrders || []).filter(order => order.status === 'completed');

  const filteredOrders = readyOrders.filter(order =>
    order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.tableNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Ready to Serve</h2>
          <p className="text-muted mb-0">
            {readyOrders.length} order{readyOrders.length !== 1 ? 's' : ''} ready for serving
          </p>
        </div>
        <div className="input-group" style={{ width: '300px' }}>
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search ready orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Ready Orders Grid */}
      <div className="row g-3 mb-5">
        {filteredOrders.length === 0 ? (
          <div className="col-12">
            <div className="text-center py-5">
              <i className="bi bi-truck text-warning" style={{ fontSize: '3rem' }}></i>
              <h4 className="mt-3 text-muted">No orders ready to serve</h4>
              <p className="text-muted">Mark orders as prepared in the preparing section</p>
            </div>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div key={order.id} className="col-md-6 col-lg-4">
              <div className="card h-100 border-success" style={{ borderWidth: '2px' }}>
                <div className="card-header d-flex justify-content-between align-items-center">
                  <strong>{order.orderNumber}</strong>
                  <span className="badge bg-success">Ready to Serve</span>
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
                    <small className="text-muted">
                      Prepared at: {new Date(order.orderTime).toLocaleTimeString()}
                    </small>
                    <strong className="text-primary">
                      ₹{order.totalAmount}
                    </strong>
                  </div>
                </div>

                <div className="card-footer bg-transparent">
                  <div className="btn-group w-100">
                    <button
                      className="btn btn-sm btn-success"
                      onClick={() => updateOrderStatus(order.id, 'completed')}
                    >
                      Mark as Served
                    </button>
                    <button
                      className="btn btn-sm btn-outline-info"
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                    >
                      Back to Preparing
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
          <h4 className="mb-3">Recently Served Orders</h4>
          <div className="list-group">
            {completedOrders.slice(-10).map((order) => (
              <div key={order.id} className="list-group-item list-group-item-success">
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{order.orderNumber}</strong> - {order.customerName} 
                    <small className="text-muted ms-2">({order.tableNumber})</small>
                    {order.specialInstructions && (
                      <small className="text-muted ms-2">• {order.specialInstructions}</small>
                    )}
                  </div>
                  <div>
                    <span className="badge bg-success me-2">Served</span>
                    <small className="text-muted">
                      ₹{order.totalAmount} • {new Date(order.orderTime).toLocaleTimeString()}
                    </small>
                  </div>
                </div>
                <div className="mt-1">
                  <small className="text-muted">
                    Items: {order.items.map(item => `${item.quantity}x ${item.name}`).join(', ')}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Served;