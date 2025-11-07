import React from "react";
import { Line } from "react-chartjs-2";
import { 
  Chart as ChartJS, 
  LineElement, 
  CategoryScale, 
  LinearScale, 
  PointElement,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const RevenueChart = () => {
  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Revenue (₹)",
        data: [1200, 1900, 3000, 2500, 4000, 3200, 5000],
        fill: true,
        backgroundColor: "rgba(0, 123, 255, 0.1)",
        borderColor: "#007bff",
        tension: 0.3,
        pointBackgroundColor: "#007bff",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 4,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { 
      legend: { 
        display: false 
      },
      tooltip: {
        mode: 'index',
        intersect: false,
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          maxRotation: 0,
          minRotation: 0
        }
      },
      y: {
        beginAtZero: true,
        grid: {
          color: "rgba(0,0,0,0.1)"
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'nearest'
    }
  };

  return (
    <div className="card responsive-card">
      <div className="card-header compact-header">
        <h6 className="card-title mb-0">Weekly Revenue</h6>
      </div>
      <div className="card-body compact-body p-2">
        <div style={{ height: '250px' }}>
          <Line data={data} options={options} />
        </div>
      </div>
      
      <style jsx>{`
        @media (max-width: 768px) {
          .card-body.compact-body {
            padding: 0.5rem !important;
          }
          
          .card-body.compact-body > div {
            height: 200px !important;
          }
        }
        
        @media (max-width: 576px) {
          .card-body.compact-body > div {
            height: 180px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default RevenueChart;