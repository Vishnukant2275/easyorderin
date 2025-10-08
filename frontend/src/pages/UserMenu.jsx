import React, { useState, useEffect, useMemo } from "react";
import { useParams } from "react-router-dom";
import "../styles/UserMenu.css";

const UserMenu = () => {
  const { tableId } = useParams();
  const [menuItems, setMenuItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showCategoryMenu, setShowCategoryMenu] = useState(false);
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  const categories = {
    "best-deals": { name: "Our Best Deals", icon: "🔥" },
    soups: { name: "Veg Soups", icon: "🥣", count: "6 items" },
    starters: { name: "Starters", icon: "🍢" },
    "main-course": { name: "Main Course", icon: "🍛" },
    beverages: { name: "Beverages", icon: "🥤" },
    desserts: { name: "Desserts", icon: "🍰" },
    sides: { name: "Side Dishes", icon: "🍟" },
  };

  useEffect(() => {
    setLoading(true);
    const mockMenu = [
      {
        id: 1,
        name: "Veg Noodles",
        price: 110,
        category: "best-deals",
        isVegetarian: true,
        popular: true,
      },
      {
        id: 2,
        name: "Aloo Tikki Burger",
        price: 70,
        category: "best-deals",
        isVegetarian: true,
      },
      {
        id: 3,
        name: "Per",
        price: 13,
        category: "best-deals",
        isVegetarian: true,
      },
      {
        id: 4,
        name: "Veg Clear Soup",
        description: "Vegetable stock with chopped vegetables",
        price: 110,
        category: "soups",
        isVegetarian: true,
      },
      {
        id: 5,
        name: "Lemon Coriander Soup",
        description: "Tangy lemon and fresh coriander",
        price: 110,
        category: "soups",
        isVegetarian: true,
      },
      {
        id: 6,
        name: "Cream Of Tomato Soup",
        price: 130,
        category: "soups",
        isVegetarian: true,
      },
      {
        id: 7,
        name: "Spring Rolls",
        price: 120,
        category: "starters",
        isVegetarian: true,
      },
      {
        id: 8,
        name: "Paneer Tikka",
        price: 180,
        category: "starters",
        isVegetarian: true,
      },
    ];
    setMenuItems(mockMenu);
    setLoading(false);
  }, [tableId]);

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
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
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

  const updateCart = (item, increment = true) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        if (increment) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
          );
        } else {
          return existing.quantity > 1
            ? prev.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity - 1 } : i
              )
            : prev.filter((i) => i.id !== item.id);
        }
      } else if (increment) {
        return [...prev, { ...item, quantity: 1 }];
      }
      return prev;
    });
  };

  const cartTotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const totalItems = cart.reduce((total, item) => total + item.quantity, 0);

  if (loading) {
    return (
      <div className="user-menu-loading">
        <div className="loading-spinner"></div>
        <p>Loading menu...</p>
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
            <span>Filtered by: {categories[selectedCategory]?.name}</span>
            <button className="clear-filter-btn" onClick={clearCategoryFilter}>
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Menu Items */}
      <main className="menu-items-section">
        {Object.entries(categories).map(([key, cat]) => {
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
                {cat.count && <span className="items-count">{cat.count}</span>}
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
                      }`}
                    >
                      {item.popular && (
                        <div className="popular-badge">🔥 Popular</div>
                      )}

                      {/* Menu Item Image */}
                      <div className="item-image">
                        <img
                          src={item.image || "/api/placeholder/300/200"}
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
                                  onClick={() => updateCart(item, false)}
                                >
                                  -
                                </button>
                                <span className="quantity-display">
                                  {quantity}
                                </span>
                                <button
                                  className="quantity-btn"
                                  onClick={() => updateCart(item, true)}
                                >
                                  +
                                </button>
                              </div>
                            ) : (
                              <button
                                className="add-to-cart-btn"
                                onClick={() => updateCart(item, true)}
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
            {Object.entries(categories).map(([key, cat]) => (
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
          <button className="view-cart-btn">
            View Cart
            <span className="arrow">→</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
