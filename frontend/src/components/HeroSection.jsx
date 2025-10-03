import React from "react";
import { NavLink } from "react-router-dom";
function HeroSection() {
  return (
    <div className="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
      <div className="col-lg-7 p-3 p-lg-5 pt-lg-3">
        <h1 className="display-4 fw-bold lh-1">
          Transform Your Restaurant's Digital Presence
        </h1>
        <p className="lead">
          Join thousands of successful restaurants who have revolutionized their
          business with our digital ordering platform. Streamline your
          operations, increase customer satisfaction, and boost your revenue
          with our easy-to-use system. Get started today with seamless
          integration, real-time order management, and comprehensive analytics
          tools.
        </p>
        <div className="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
          <NavLink
            to="/restaurant/signup"
            className="btn btn-primary btn-lg px-4 me-md-2 fw-bold"
          >
            Register Now
          </NavLink>
          <NavLink
            to="/restaurant/login"
            className="btn btn-outline-secondary btn-lg px-4"
          >
            Already Registered
          </NavLink>
        </div>
      </div>
      <div className="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
        <img
          className="rounded-lg-3"
          src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=720"
          alt="Restaurant interior with ambient lighting"
          width="720"
        />
      </div>
    </div>
  );
}

export default HeroSection;
