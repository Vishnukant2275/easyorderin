import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, LineElement, CategoryScale, LinearScale, PointElement } from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

const RevenueChart = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [1200, 1900, 3000, 2500, 4000, 3200, 5000],
        fill: false,
        borderColor: "#007bff",
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { display: false } },
  };

  return (
    <div className="card shadow rounded-3">
      <div className="card-body">
        <h5 className="card-title">Weekly Revenue</h5>
        <Line data={data} options={options} />
      </div>
    </div>
  );
};

export default RevenueChart;
