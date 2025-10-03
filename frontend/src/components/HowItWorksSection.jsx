import React from "react";

function HowItWorksSection() {
  return (
    <div className="container px-4 py-5" id="featured-3">
      <h2 className="pb-2 border-bottom text-center fw-bold">How It Works</h2>
      <div className="row g-4 py-5 row-cols-1 row-cols-lg-3">
        {/* Step 1 */}
        <div className="feature col text-center">
          <div
            className="feature-icon bg-primary bg-gradient d-inline-flex align-items-center justify-content-center fs-2 mb-3 rounded-circle"
            style={{ width: "70px", height: "70px" }}
          >
            <i
              className="bi bi-qr-code"
              style={{ fontSize: "2rem", color: "white" }}
            ></i>
          </div>
          <h3 className="fs-4">Scan Your QR</h3>
          <p>
            Customers scan a unique QR code placed on each table to instantly
            access the restaurant’s digital menu.
          </p>
          <a href="#video" className="icon-link">
            Learn more <i className="bi bi-chevron-right"></i>
          </a>
        </div>

        {/* Step 2 */}
        <div className="feature col text-center">
          <div
            className="feature-icon bg-primary bg-gradient d-inline-flex align-items-center justify-content-center fs-2 mb-3 rounded-circle"
            style={{ width: "70px", height: "70px" }}
          >
            <i
              className="bi bi-cart-check"
              style={{ fontSize: "2rem", color: "white" }}
            ></i>
          </div>
          <h3 className="fs-4">Place Your Order</h3>
          <p>
            Browse the menu, customize your order, and submit it directly from
            your phone—no waiting for a waiter.
          </p>
          <a href="#video" className="icon-link">
            Learn more <i className="bi bi-chevron-right"></i>
          </a>
        </div>

        {/* Step 3 */}
        <div className="feature col text-center">
          <div
            className="feature-icon bg-primary bg-gradient d-inline-flex align-items-center justify-content-center fs-2 mb-3 rounded-circle"
            style={{ width: "70px", height: "70px" }}
          >
            <i
              className="bi bi-graph-up-arrow"
              style={{ fontSize: "2rem", color: "white" }}
            ></i>
          </div>
          <h3 className="fs-4">Track & Grow</h3>
          <p>
            Restaurants receive real-time orders, generate reports, and analyze
            customer preferences to improve sales.
          </p>
          <a href="#video" className="icon-link">
            Learn more <i className="bi bi-chevron-right"></i>
          </a>
        </div>
      </div>
    </div>
  );
}

export default HowItWorksSection;
