import React from "react";

const orders = [
  { id: 1, customer: "Rahul", table: 4, items: "Pizza, Coke", status: "Pending" },
  { id: 2, customer: "Sneha", table: 2, items: "Burger, Fries", status: "Preparing" },
  { id: 3, customer: "Amit", table: 6, items: "Pasta", status: "Served" },
  { id: 4, customer: "Priya", table: 1, items: "Salad, Juice", status: "Pending" },
];

const RecentOrders = () => {
  return (
    <div className="card shadow rounded-3">
      <div className="card-body">
        <h5 className="card-title">Recent Orders</h5>
        <table className="table table-hover">
          <thead>
            <tr>
              <th>#</th>
              <th>Customer</th>
              <th>Table</th>
              <th>Items</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.customer}</td>
                <td>{order.table}</td>
                <td>{order.items}</td>
                <td>
                  <span className={`badge ${
                    order.status === "Pending"
                      ? "bg-warning"
                      : order.status === "Preparing"
                      ? "bg-primary"
                      : "bg-success"
                  }`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrders;
