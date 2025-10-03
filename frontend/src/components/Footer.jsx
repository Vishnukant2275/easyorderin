import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div>
      <footer className="py-3 my-4">
        {" "}
        <ul className="nav justify-content-center border-bottom pb-3 mb-3">
          {" "}
          <li className="nav-item">
            <a href="/about/#home" className="nav-link px-2 text-body-secondary">
              Home
            </a>
          </li>{" "}
          <li className="nav-item">
            <a href="/about/#features" className="nav-link px-2 text-body-secondary">
              Features
            </a>
          </li>{" "}
          <li className="nav-item">
            <a href="/about/#pricing" className="nav-link px-2 text-body-secondary">
              Pricing
            </a>
          </li>{" "}
          <li className="nav-item">
            <a href="/about/#faqs" className="nav-link px-2 text-body-secondary">
              FAQs
            </a>
          </li>{" "}
          <li className="nav-item">
            <a href="/about/#about" className="nav-link px-2 text-body-secondary">
              About
            </a>
          </li>{" "}
        </ul>{" "}
        <p className="text-center text-body-secondary">© 2025 EasyOrderIn, Inc</p>{" "}
      </footer>
    </div>
  );
};

export default Footer;
