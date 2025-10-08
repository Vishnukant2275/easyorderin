import React from "react";

const items = [
  { name: "Pizza", orders: 120 },
  { name: "Burger", orders: 95 },
  { name: "Pasta", orders: 80 },
];

const PopularMenu = () => {
  return (
    <div className="card shadow rounded-3">
      <div className="card-body">
        <h5 className="card-title">Popular Menu Items</h5>
        <ul className="list-group">
          {items.map((item, index) => (
            <li key={index} className="list-group-item d-flex justify-content-between">
              {item.name}
              <span className="badge bg-primary">{item.orders} Orders</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PopularMenu;
