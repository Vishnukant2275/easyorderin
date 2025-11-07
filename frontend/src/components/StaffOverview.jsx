import React from "react";

const staffMembers = [
  { 
    name: "Aarav Sharma", 
    role: "Head Chef", 
    status: "Active", 
    shifts: "Morning", 
    orders: 45,
    rating: 4.8,
    image: "👨‍🍳"
  },
  { 
    name: "Priya Patel", 
    role: "Server", 
    status: "Active", 
    shifts: "Evening", 
    orders: 38,
    rating: 4.9,
    image: "👩‍💼"
  },
  { 
    name: "Rohan Kumar", 
    role: "Bartender", 
    status: "Break", 
    shifts: "Evening", 
    orders: 28,
    rating: 4.7,
    image: "🍸"
  },
  { 
    name: "Sneha Gupta", 
    role: "Manager", 
    status: "Active", 
    shifts: "Full Day", 
    orders: 15,
    rating: 4.9,
    image: "👩‍💼"
  },
];

const StaffOverview = () => {
  const activeStaff = staffMembers.filter(staff => staff.status === "Active").length;
  const totalOrders = staffMembers.reduce((sum, staff) => sum + staff.orders, 0);

  return (
    <div className="card responsive-card">
      <div className="card-header compact-header d-flex justify-content-between align-items-center">
        <h6 className="card-title mb-0">Staff Overview</h6>
        <div className="d-flex gap-2">
          <span className="badge bg-success">{activeStaff} Active</span>
          <span className="badge bg-secondary">{staffMembers.length} Total</span>
        </div>
      </div>
      <div className="card-body compact-body p-0">
        
        {/* Stats Summary */}
        <div className="row g-0 text-center border-bottom">
          <div className="col-4 border-end py-2">
            <div className="fw-bold text-primary fs-5">{totalOrders}</div>
            <small className="text-muted">Today's Orders</small>
          </div>
          <div className="col-4 border-end py-2">
            <div className="fw-bold text-success fs-5">{activeStaff}/{staffMembers.length}</div>
            <small className="text-muted">On Duty</small>
          </div>
          <div className="col-4 py-2">
            <div className="fw-bold text-info fs-5">4.8</div>
            <small className="text-muted">Avg Rating</small>
          </div>
        </div>

        {/* Staff List */}
        <div className="list-group list-group-flush">
          {staffMembers.map((staff, index) => (
            <div key={index} className="list-group-item border-0 px-3 py-2">
              <div className="d-flex align-items-center">
                {/* Staff Avatar */}
                <div 
                  className="flex-shrink-0 me-3 d-none d-sm-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: getStatusColor(staff.status),
                    fontSize: '1.2rem'
                  }}
                >
                  {staff.image}
                </div>
                
                <div className="flex-grow-1">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h6 className="mb-0 fw-medium">{staff.name}</h6>
                      <small className="text-muted">{staff.role}</small>
                    </div>
                    <div className="text-end">
                      <span className={`badge ${getStatusBadgeClass(staff.status)}`}>
                        {staff.status}
                      </span>
                      <div className="mt-1">
                        <small className="text-warning">
                          ⭐ {staff.rating}
                        </small>
                      </div>
                    </div>
                  </div>
                  
                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <span className="badge bg-light text-dark">
                      {staff.shifts}
                    </span>
                    <small className="text-muted">
                      <strong>{staff.orders}</strong> orders
                    </small>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile Summary */}
        <div className="d-md-none p-3 border-top bg-light">
          <div className="d-grid gap-2">
            <button className="btn btn-sm btn-outline-primary">
              View Schedule
            </button>
            <button className="btn btn-sm btn-outline-success">
              Add Staff Member
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .list-group-item {
          transition: background-color 0.2s;
        }
        
        .list-group-item:hover {
          background-color: #f8f9fa;
        }
        
        @media (max-width: 576px) {
          .card-body .row > div {
            padding: 0.5rem 0.25rem;
          }
          
          .fs-5 {
            font-size: 1.1rem !important;
          }
          
          h6 {
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
};

// Helper functions
const getStatusBadgeClass = (status) => {
  switch (status) {
    case "Active":
      return "bg-success";
    case "Break":
      return "bg-warning text-dark";
    case "Offline":
      return "bg-secondary";
    default:
      return "bg-light text-dark";
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case "Active":
      return "#d4edda";
    case "Break":
      return "#fff3cd";
    case "Offline":
      return "#e2e3e5";
    default:
      return "#f8f9fa";
  }
};

export default StaffOverview;