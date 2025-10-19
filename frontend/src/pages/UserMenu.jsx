import React, { useState, useEffect, useMemo } from "react";
import "../styles/UserMenu.css";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import { useCart } from "../context/CartContext";

const UserMenu = () => {
  const { restaurantID, tableNumber } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const { cart, addToCart, updateQuantity, getCartTotal, getTotalItems } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [restaurantInfo, setRestaurantInfo] = useState(null);

  // Define categories - you might want to make this dynamic based on actual menu categories
  const categories = {
    "best-deals": { name: "Our Best Deals", icon: "🔥" },
    soups: { name: "Veg Soups", icon: "🥣" },
    starters: { name: "Starters", icon: "🍢" },
    "main-course": { name: "Main Course", icon: "🍛" },
    beverages: { name: "Beverages", icon: "🥤" },
    desserts: { name: "Desserts", icon: "🍰" },
    sides: { name: "Side Dishes", icon: "🍟" },
  };

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        setError(null);

        if (!restaurantID || !tableNumber) {
          setError("Restaurant ID or Table Number is missing");
          setLoading(false);
          return;
        }

        const res = await api.get(
          `/restaurant/${restaurantID}/table/${tableNumber}/getMenu`
        );

        console.log("Table Menu response:", res.data);

        if (res.data.success) {
          // Set restaurant info
          setRestaurantInfo({
            name: res.data.restaurant.name,
            type: res.data.restaurant.type,
          });

          // Set menu items - assuming the API returns menu items in the expected format
          // You might need to transform the data to match your component's expected structure
          const menuData = res.data.menu || [];
          setMenuItems(
            menuData.map((item) => ({
              id: item._id || item.id,
              name: item.name,
              price: item.price,
              category: item.category || "main-course", // default category if not provided
              isVegetarian: item.isVegetarian || false,
              description: item.description,
              image: item.image,
              isAvailable: item.isAvailable,
              popular: item.popular || false,
              // Add any other properties your component expects
            }))
          );
        } else {
          setError(res.data.message || "Failed to fetch menu");
          setMenuItems([]);
        }
      } catch (err) {
        console.error("Error fetching menu:", err);
        setError(
          err.response?.data?.message ||
            "Failed to load menu. Please try again."
        );
        setMenuItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, [restaurantID, tableNumber]);

  // Dynamically generate categories from actual menu items
  const dynamicCategories = useMemo(() => {
    const categorySet = new Set();
    menuItems.forEach((item) => {
      if (item.category) {
        categorySet.add(item.category);
      }
    });

    // Merge predefined categories with actual categories from menu
    const mergedCategories = { ...categories };

    Array.from(categorySet).forEach((category) => {
      if (!mergedCategories[category]) {
        // Create a default category entry if it doesn't exist
        mergedCategories[category] = {
          name:
            category.charAt(0).toUpperCase() +
            category.slice(1).replace("-", " "),
          icon: "🍽️", // default icon
        };
      }
    });

    return mergedCategories;
  }, [menuItems]);

  const groupedItems = useMemo(() => {
    const filtered = menuItems.filter((item) => {
      const matchesSearch =
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesType =
        filterType === "all" ||
        (filterType === "veg" && item.isVegetarian) ||
        (filterType === "nonveg" && !item.isVegetarian);

      const matchesCategory =
        selectedCategory === "" || item.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });

    return filtered.reduce((acc, item) => {
      const category = item.category || "uncategorized";
      if (!acc[category]) acc[category] = [];
      acc[category].push(item);
      return acc;
    }, {});
  }, [menuItems, searchTerm, filterType, selectedCategory]);

  const scrollToCategory = (category) => {
    const element = document.getElementById(`category-${category}`);
    if (element) element.scrollIntoView({ behavior: "smooth" });
    setSelectedCategory(category);
    setShowCategoryMenu(false);
  };

  const handleCategoryFilter = (category) => {
    setSelectedCategory(category);
    setShowCategoryFilter(false);

    // Scroll to the selected category if it exists in current items
    setTimeout(() => {
      const element = document.getElementById(`category-${category}`);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const clearCategoryFilter = () => {
    setSelectedCategory("");
    setShowCategoryFilter(false);
  };

  const cartTotal = getCartTotal();
  const totalItems = getTotalItems();
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="user-menu-loading">
        <div className="loading-spinner"></div>
        <p>Loading menu...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="user-menu-error">
        <div className="error-icon">❌</div>
        <h3>Table No. {tableNumber} is already Occupied</h3>
        <p>{error}</p>
        <button
          className="retry-btn bg-blue-500 hover:bg-blue-600 text-white px-5 py-2 rounded-xl shadow transition-all duration-300 flex items-center justify-center gap-2"
          onClick={() => {
            const ua = navigator.userAgent.toLowerCase();
            if (ua.includes("android")) {
              // Try Android intent (works on some devices)
              window.location.href =
                "intent://scan/#Intent;scheme=google.lens;package=com.google.ar.lens;end";
              // Fallback if intent fails
              setTimeout(() => {
                window.open("https://lens.google/", "_blank");
              }, 1500);
            } else {
              // Non-Android fallback
              window.open("https://lens.google/", "_blank");
            }
          }}
        >
          Try another Table
        </button>
      </div>
    );
  }

  return (
    <div className="user-menu-container">
      {/* Search Section */}
      <div className="search-section">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search dishes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Filter Chips */}
      <div className="filter-section">
        <div className="filter-chips">
          {[
            { key: "all", label: "All" },
            { key: "veg", label: "🥬 Veg" },
            { key: "nonveg", label: "🍗 Non-Veg" },
          ].map((type) => (
            <button
              key={type.key}
              className={`filter-chip ${
                filterType === type.key ? "active" : ""
              }`}
              onClick={() => setFilterType(type.key)}
            >
              {type.label}
            </button>
          ))}
        </div>
      </div>

      {/* Category Filter Indicator */}
      {selectedCategory && (
        <div className="active-filter-section">
          <div className="active-filter">
            <span>
              Filtered by: {dynamicCategories[selectedCategory]?.name}
            </span>
            <button className="clear-filter-btn" onClick={clearCategoryFilter}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <main className="menu-items-section">
        {Object.entries(dynamicCategories).map(([key, cat]) => {
          const items = groupedItems[key];
          if (!items?.length) return null;

          return (
            <section
              key={key}
              id={`category-${key}`}
              className="category-section"
            >
              <div className="category-header">
                <div className="category-title-wrapper">
                  <span className="category-icon">{cat.icon}</span>
                  <h2 className="category-title">{cat.name}</h2>
                </div>
                <span className="items-count">
                  {items.length} item{items.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="items-grid">
                {items.map((item) => {
                  const cartItem = cart.find((i) => i.id === item.id);
                  const quantity = cartItem ? cartItem.quantity : 0;

                  return (
                    <div
                      key={item.id}
                      className={`menu-item-card ${
                        item.popular ? "popular" : ""
                      } ${!item.isAvailable ? "unavailable" : ""}`}
                    >
                      {item.popular && (
                        <div className="popular-badge">🔥 Popular</div>
                      )}

                      {!item.isAvailable && (
                        <div className="unavailable-badge">Unavailable</div>
                      )}

                      {/* Menu Item Image */}
                      <div className="item-image">
                        <img
                          src={
                            item.image
                              ? `${window.location.origin}/uploads/${item.image}`
                              : ""
                          }
                          alt={item.name}
                          className="menu-img"
                          onError={(e) => {
                            e.target.src =
                              "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='200' viewBox='0 0 300 200'%3E%3Crect width='300' height='200' fill='%23f8f9fa'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='16' fill='%23666'%3E🍽️ Menu Image%3C/text%3E%3C/svg%3E";
                          }}
                        />
                        <div className="image-overlay"></div>
                      </div>
                      <div className="item-content">
                        <div className="item-info">
                          <div className="item-header">
                            <h3 className="item-name">{item.name}</h3>
                            <span
                              className={`item-type ${
                                item.isVegetarian ? "veg" : "nonveg"
                              }`}
                            >
                              {item.isVegetarian ? "🥬 Veg" : "🍗 Non-Veg"}
                            </span>
                          </div>

                          {item.description && (
                            <p className="item-description">
                              {item.description}
                            </p>
                          )}

                          {/* Rating and Prep Time */}
                          <div className="item-meta">
                            <div className="rating">
                              <span className="star">⭐</span>
                              <span className="rating-value">4.5</span>
                            </div>
                            <div className="prep-time">
                              <span className="time-icon">⏱️</span>
                              <span className="time-value">15-20 min</span>
                            </div>
                          </div>

                          <div className="item-footer">
                            <div className="price-section">
                              <span className="item-price">₹{item.price}</span>
                              {item.originalPrice && (
                                <span className="original-price">
                                  ₹{item.originalPrice}
                                </span>
                              )}
                            </div>

                            {quantity > 0 ? (
                              <div className="cart-controls">
                                <button
                                  className="quantity-btn"
                                  onClick={() => updateQuantity(item.id, -1)}
                                >
                                  -
                                </button>
                                <span className="quantity-display">
                                  {quantity}
                                </span>
                                <button
                                  className="quantity-btn"
                                  onClick={() => addToCart(item)}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                className="add-to-cart-btn"
                                onClick={() => addToCart(item)}
                                disabled={!item.isAvailable}
                              >
                                <span className="btn-icon">+</span>
                                Add
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })}

        {!Object.keys(groupedItems).length && (
          <div className="no-items-found">
            <div className="no-items-icon">🍽️</div>
            <p>No items found</p>
            <p className="subtext">Try different search or filters</p>
          </div>
        )}
      </main>

      {/* Floating Category Filter Button */}
      <button
        className="floating-category-btn"
        onClick={() => setShowCategoryFilter(!showCategoryFilter)}
      >
        <span className="filter-icon">☰</span>
        <span className="filter-text">Category</span>
      </button>

      {/* Category Filter Panel */}
      {showCategoryFilter && (
        <div className="category-filter-panel">
          <div className="filter-panel-header">
            <h3>Filter by Category</h3>
            <button
              className="close-filter-btn"
              onClick={() => setShowCategoryFilter(false)}
            >
              ✕
            </button>
          </div>
          <div className="filter-categories-grid">
            <button
              className={`filter-category-btn ${
                selectedCategory === "" ? "active" : ""
              }`}
              onClick={clearCategoryFilter}
            >
              <span className="filter-category-icon">📋</span>
              <span className="filter-category-name">All Categories</span>
            </button>
            {Object.entries(dynamicCategories).map(([key, cat]) => (
              <button
                key={key}
                className={`filter-category-btn ${
                  selectedCategory === key ? "active" : ""
                }`}
                onClick={() => handleCategoryFilter(key)}
              >
                <span className="filter-category-icon">{cat.icon}</span>
                <span className="filter-category-name">{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Overlay for when filter panel is open */}
      {showCategoryFilter && (
        <div
          className="filter-overlay"
          onClick={() => setShowCategoryFilter(false)}
        />
      )}

      {/* Floating Cart Summary */}
      {cart.length > 0 && (
        <div className="floating-cart-summary">
          <div className="cart-info">
            <div className="cart-count-badge">{totalItems}</div>
            <div className="cart-details">
              <span className="cart-total-label">Total</span>
              <span className="cart-total">₹{cartTotal}</span>
            </div>
          </div>
          <button
            className="view-cart-btn"
            onClick={() =>
              navigate(`/restaurant/${restaurantID}/table/${tableNumber}/cart`)
            }
          >
            View Cart <span className="arrow">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;