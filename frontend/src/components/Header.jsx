import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const navItems = [
    { path: "/about#home", label: "Home", id: "home", icon: "🏠" },
    { path: "/about#features", label: "Features", id: "features", icon: "⚡" },
    { path: "/about#pricing", label: "Pricing", id: "pricing", icon: "💳" },
    { path: "/about#faqs", label: "FAQs", id: "faqs", icon: "💬" },
    { path: "/about#howitworks", label: "About", id: "about", icon: "👥" },
    {
      path: "/policy/privacy-policy",
      label: "Policy",
      id: "policy",
      icon: "📑",
    },
  ];

  const handleScrollNavigation = (path, e) => {
    if (path.includes("#")) {
      e.preventDefault();
      const [basePath, hash] = path.split("#");
      if (location.pathname === basePath || location.pathname === "/about") {
        const element = document.getElementById(hash);
        if (element) element.scrollIntoView({ behavior: "smooth" });
      } else {
        window.location.href = path;
      }
    }
    setIsMobileMenuOpen(false);
    setShowSearch(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery);
      setSearchQuery("");
      setShowSearch(false);
    }
  };

  return (
    <>
      {/* Desktop Header */}
      <header className="sticky-top bg-dark shadow-sm d-none d-lg-block">
        <div className="container d-flex align-items-center justify-content-between py-2">
          {/* Logo */}
          <Link
            to="/"
            className="d-flex align-items-center text-decoration-none me-5"
          >
            <img
              src={logo}
              alt="Logo"
              className="img-fluid"
              style={{ height: "45px", width: "auto" }}
            />
          </Link>

          {/* Navigation */}
          <ul className="nav me-auto">
            {navItems.map((item) => (
              <li key={item.id} className="nav-item">
                {item.path.includes("#") ? (
                  <a
                    href={item.path}
                    className="nav-link text-white px-3 hover-effect"
                    onClick={(e) => handleScrollNavigation(item.path, e)}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link
                    to={item.path}
                    className="nav-link text-white px-3 hover-effect"
                  >
                    {item.label}
                  </Link>
                )}
              </li>
            ))}
          </ul>

          {/* Search */}
          <form className="d-flex me-3" onSubmit={handleSearch}>
            <input
              type="search"
              className="form-control me-2 rounded-pill bg-dark text-white border-secondary"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: "220px" }}
            />
            <button
              type="submit"
              className="btn btn-outline-light rounded-pill"
              disabled={!searchQuery.trim()}
            >
              🔍
            </button>
          </form>

          {/* Auth Buttons */}
          <div className="d-flex gap-2">
            <Link
              to="/restaurant/login"
              className="btn btn-outline-light rounded-pill"
            >
              Login
            </Link>
            <Link
              to="/restaurant/signup"
              className="btn btn-warning rounded-pill"
            >
              Sign-up
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="d-lg-none sticky-top bg-dark bg-opacity-90 backdrop-blur-sm shadow-sm">
        <div className="container-fluid d-flex justify-content-between align-items-center py-2 px-3">
          {/* Logo */}
          <Link
            to="/"
            className="d-flex align-items-center text-decoration-none"
          >
            <img
              src={logo}
              alt="Logo"
              style={{ height: "35px", width: "auto" }}
            />
          </Link>

          {/* Right Icons */}
          <div className="d-flex align-items-center gap-2">
            {/* Search Toggle */}
            <button
              className="btn text-white p-1"
              onClick={() => setShowSearch(!showSearch)}
            >
              🔍
            </button>

            {/* Auth Buttons */}
            <Link
              to="/restaurant/login"
              className="btn btn-outline-light btn-sm"
            >
              Login
            </Link>
            <Link to="/restaurant/signup" className="btn btn-warning btn-sm">
              Sign-up
            </Link>

            {/* Menu Toggle */}
            <button
              className="btn text-white p-1"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Search Input */}
        {showSearch && (
          <div className="px-3 pb-2">
            <form onSubmit={handleSearch} className="d-flex gap-2">
              <input
                type="search"
                className="form-control bg-dark text-white border-secondary rounded-pill"
                placeholder="Search restaurants, menus..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <button
                type="submit"
                className="btn btn-outline-light rounded-pill"
                disabled={!searchQuery.trim()}
              >
                Search
              </button>
            </form>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="bg-dark bg-opacity-95 border-top border-secondary px-3 py-3">
            <div className="row g-2">
              {navItems.map((item) => (
                <div key={item.id} className="col-6">
                  {item.path.includes("#") ? (
                    <a
                      href={item.path}
                      onClick={(e) => handleScrollNavigation(item.path, e)}
                      className="btn btn-outline-light w-100 text-start py-2 rounded"
                    >
                      {item.icon} {item.label}
                    </a>
                  ) : (
                    <Link
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="btn btn-outline-light w-100 text-start py-2 rounded"
                    >
                      {item.icon} {item.label}
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </header>
    </>
  );
};

export default Header;
