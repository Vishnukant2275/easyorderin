import React from "react";

const staff = [
  { name: "Ramesh", role: "Chef", status: "Online" },
  { name: "Sita", role: "Waiter", status: "Offline" },
  { name: "Ajay", role: "Waiter", status: "Online" },
];

const StaffOverview = () => {
  return (
    <div className="card shadow rounded-3">
      <div className="card-body">
        <h5 className="card-title">Staff Overview</h5>
        <ul className="list-group">
          {staff.map((member, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <strong>{member.name}</strong> <small>({member.role})</small>
              </div>
              <span className={`badge ${member.status === "Online" ? "bg-success" : "bg-secondary"}`}>
                {member.status}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default StaffOverview;
