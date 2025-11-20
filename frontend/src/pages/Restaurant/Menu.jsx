import React, { useState, useEffect, useContext } from "react";
import api from "../../services/api";
import { useRestaurant } from "../../context/RestaurantContext";
import { toast } from "react-toastify";

const foodCategories = ["starter", "main", "dessert", "beverage", "side"];

const Menu = () => {
  const { menuItems, setMenuItems, setRefreshTrigger } = useRestaurant();
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterVegetarian, setFilterVegetarian] = useState("All");
  const [viewMode, setViewMode] = useState("mobile"); // 'mobile' or 'desktop'

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    isVegetarian: true,
    foodCategory: "",
    keyIngredients: "",
    image: null,
    isAvailable: true,
  });

  // Filter menu items based on search and filters
  const filteredMenuItems = menuItems
    ? menuItems.filter((item) => {
        const name = item.name?.toLowerCase() || "";
        const description = item.description?.toLowerCase() || "";
        const matchesSearch =
          name.includes(searchTerm.toLowerCase()) ||
          description.includes(searchTerm.toLowerCase());
        const matchesCategory =
          filterCategory === "All" || item.foodCategory === filterCategory;
        const matchesVegetarian =
          filterVegetarian === "All" ||
          (filterVegetarian === "Vegetarian" && item.isVegetarian) ||
          (filterVegetarian === "Non-Vegetarian" && !item.isVegetarian);

        return matchesSearch && matchesCategory && matchesVegetarian;
      })
    : [];

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    setFormData({
      ...formData,
      [name]:
        type === "checkbox" ? checked : type === "file" ? files[0] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        name: formData.name,
        description: formData.description,
        price: formData.price,
        isVegetarian: formData.isVegetarian,
        foodCategory: formData.foodCategory,
        keyIngredients: formData.keyIngredients,
        isAvailable: formData.isAvailable,
      };

      if (editingId) {
        // UPDATE EXISTING ITEM
        const response = await api.put(
          `/restaurant/menu/${editingId}`,
          payload
        );

        if (response.data.msg || response.data._id) {
          setMenuItems((prev) =>
            prev.map((item) =>
              item._id === editingId ? { ...item, ...payload } : item
            )
          );
          resetForm();
          toast.success("Menu item updated successfully!");
        } else {
          toast.error(response.data.error || "Update failed");
        }
      } else {
        // For new items, still use FormData if you need image upload
        const formPayload = new FormData();
        Object.keys(payload).forEach((key) => {
          formPayload.append(key, payload[key]);
        });

        if (formData.image) {
          formPayload.append("image", formData.image);
        }

        const response = await api.post(
          "/restaurant/upload/menu",
          formPayload,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        if (response.data.msg) {
          setMenuItems((prev) => [
            ...prev,
            { ...payload, _id: response.data._id || Date.now() },
          ]);
          resetForm();
          toast.info(response.data.msg);
        } else {
          toast.warn(response.data.error || "Upload failed");
        }
      }
    } catch (error) {
      console.error(error);
      toast.warn(error?.response?.data?.message || "An error occurred" );
    }
    setRefreshTrigger((prev) => prev + 1);
  };

  const handleEdit = (item) => {
    setFormData({
      name: item.name,
      description: item.description,
      price: item.price,
      isVegetarian: item.isVegetarian,
      foodCategory: item.foodCategory,
      keyIngredients: item.keyIngredients,
      image: item.image,
      isAvailable: item.isAvailable,
    });
    setEditingId(item._id);
  };

  const handleDelete = async (itemId) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/restaurant/menu/${itemId}`);
      setMenuItems((prev) => prev.filter((item) => item._id !== itemId));
    } catch (err) {
      console.error("Error deleting item:", err);
    }
  };

  const toggleAvailability = async (itemId) => {
    try {
      await api.patch(`/restaurant/menu/${itemId}/toggle`);
      setMenuItems((prev) =>
        prev.map((item) =>
          item._id === itemId
            ? { ...item, isAvailable: !item.isAvailable }
            : item
        )
      );
    } catch (err) {
      console.error("Error toggling availability:", err);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      price: "",
      isVegetarian: true,
      foodCategory: "",
      keyIngredients: "",
      image: null,
      isAvailable: true,
    });
    setEditingId(null);
  };

  const cancelEdit = () => {
    resetForm();
  };

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Menu List Section */}
        <div className="col-md-8 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2>Menu Items</h2>
            <div className="d-flex align-items-center gap-3">
              {/* View Mode Toggle */}
              <div className="view-mode-toggle">
                <button
                  className={`toggle-btn ${
                    viewMode === "mobile" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("mobile")}
                  title="Mobile View"
                >
                  📱
                </button>
                <button
                  className={`toggle-btn ${
                    viewMode === "desktop" ? "active" : ""
                  }`}
                  onClick={() => setViewMode("desktop")}
                  title="Desktop View"
                >
                  💻
                </button>
              </div>
              <span className="badge bg-primary">
                {filteredMenuItems.length} items
              </span>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="row mb-4">
            <div className="col-md-4">
              <input
                type="text"
                className="form-control"
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {foodCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <select
                className="form-select"
                value={filterVegetarian}
                onChange={(e) => setFilterVegetarian(e.target.value)}
              >
                <option value="All">All Types</option>
                <option value="Vegetarian">Vegetarian</option>
                <option value="Non-Vegetarian">Non-Vegetarian</option>
              </select>
            </div>
          </div>

          {/* Menu Table */}
          {/* Menu Table */}
          <div className="menu-table-wrapper">
            {/* Desktop Table - Show when viewMode is desktop OR on large screens */}
            {viewMode === "desktop" ? (
              <div>
                <table className="table table-striped table-hover">
                  <thead className="table-dark">
                    <tr>
                      <th>Name</th>
                      <th>Price</th>
                      <th>Category</th>
                      <th>Type</th>
                      <th>Availability</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMenuItems.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="text-center text-muted py-4">
                          No menu items found
                        </td>
                      </tr>
                    ) : (
                      filteredMenuItems.map((item) => (
                        <tr
                          key={item._id}
                          className={!item.isAvailable ? "table-secondary" : ""}
                        >
                          <td>
                            <strong>{item.name}</strong>
                            {item.description && (
                              <small className="d-block text-muted">
                                {item.description}
                              </small>
                            )}
                          </td>
                          <td>₹{item.price}</td>
                          <td>
                            <span className="badge bg-info">
                              {item.foodCategory}
                            </span>
                          </td>
                          <td>
                            <span
                              className={`badge ${
                                item.isVegetarian ? "bg-success" : "bg-danger"
                              }`}
                            >
                              {item.isVegetarian ? "Vegetarian" : "Non-Veg"}
                            </span>
                          </td>
                          <td>
                            <div className="form-check form-switch">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                checked={item.isAvailable}
                                onChange={() => toggleAvailability(item._id)}
                              />
                              <label className="form-check-label small">
                                {item.isAvailable ? "Available" : "Unavailable"}
                              </label>
                            </div>
                          </td>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-warning me-2"
                              onClick={() => handleEdit(item)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(item._id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Mobile Cards - Show when viewMode is mobile */
              <div className="mobile-menu-list">
                {filteredMenuItems.map((item) => (
                  <div key={item._id} className="mobile-menu-card">
                    {/* Header with name, price, and veg/non-veg indicator */}
                    <div className="menu-card-header">
                      <div className="menu-title-section">
                        <h6 className="menu-item-name">{item.name}</h6>
                        {item.description && (
                          <p className="menu-item-desc">{item.description}</p>
                        )}
                      </div>
                      <div className="menu-price-section">
                        <span className="menu-price">₹{item.price}</span>
                        <div
                          className={`veg-indicator ${
                            item.isVegetarian ? "veg" : "non-veg"
                          }`}
                        >
                          {item.isVegetarian ? "Veg🟢" : "Non-Veg🔴"}
                        </div>
                      </div>
                    </div>

                    {/* Category and status */}
                    <div className="menu-card-meta">
                      <span className="category-badge">
                        {item.foodCategory}
                      </span>
                      {/* Availability Toggle */}
                      <div className="availability-toggle">
                        <div
                          className={`toggle-switch ${
                            item.isAvailable ? "available" : "unavailable"
                          }`}
                          onClick={() => toggleAvailability(item._id)}
                        >
                          <div className="toggle-slider"></div>
                          <span className="toggle-text">
                            {item.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="menu-card-actions">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(item)}
                      >
                        <span>✏️</span>
                        Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item._id)}
                      >
                        <span>🗑️</span>
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Form Section */}
        <div className="col-md-4 bg-light p-4">
          <h2>{editingId ? "Edit Menu Item" : "Add New Menu Item"}</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Name *</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="description"
                rows="2"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Price (₹) *</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  min="0"
                  step="1"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Food Category *</label>
                <select
                  className="form-select"
                  name="foodCategory"
                  value={formData.foodCategory}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  {foodCategories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Vegetarian</label>
                <select
                  className="form-select"
                  name="isVegetarian"
                  value={formData.isVegetarian}
                  onChange={handleChange}
                >
                  <option value={true}>Yes</option>
                  <option value={false}>No</option>
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Availability</label>
                <select
                  className="form-select"
                  name="isAvailable"
                  value={formData.isAvailable}
                  onChange={handleChange}
                >
                  <option value={true}>Available</option>
                  <option value={false}>Unavailable</option>
                </select>
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Key Ingredients</label>
              <input
                type="text"
                className="form-control"
                name="keyIngredients"
                placeholder="Comma separated ingredients"
                value={formData.keyIngredients}
                onChange={handleChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                name="image"
                accept="image/*"
                onChange={handleChange}
              />
            </div>

            <div className="d-grid gap-2">
              <button type="submit" className="btn btn-primary">
                {editingId ? "Update Menu Item" : "Add Menu Item"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={cancelEdit}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* View Mode Toggle Styles */}
      <style jsx>{`
        .view-mode-toggle {
          display: flex;
          background: #f8f9fa;
          border-radius: 12px;
          padding: 0.25rem;
          border: 1px solid #dee2e6;
        }

        .toggle-btn {
          background: transparent;
          border: none;
          padding: 0.5rem 0.75rem;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.1rem;
          transition: all 0.2s ease;
        }

        .toggle-btn.active {
          background: #007bff;
          color: white;
        }

        .toggle-btn:hover:not(.active) {
          background: #e9ecef;
        }

        /* Mobile Card Styles */
        .mobile-menu-list {
          padding: 0.5rem;
        }

        .mobile-menu-card {
          background: #fff;
          border-radius: 16px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
          border: 1px solid #f0f0f0;
          transition: all 0.2s ease;
        }

        .mobile-menu-card:active {
          transform: scale(0.98);
        }

        .menu-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }

        .menu-title-section {
          flex: 1;
          margin-right: 0.5rem;
        }

        .menu-item-name {
          font-size: 1rem;
          font-weight: 600;
          color: #2d3748;
          margin: 0 0 0.25rem 0;
          line-height: 1.3;
        }

        .menu-item-desc {
          font-size: 0.8rem;
          color: #718096;
          margin: 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .menu-price-section {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 0.25rem;
        }

        .menu-price {
          font-size: 1.1rem;
          font-weight: 700;
          color: #2d3748;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .veg-indicator {
          font-size: 0.7rem;
          padding: 0.1rem 0.4rem;
          border-radius: 8px;
          background: #e5e9ec;
        }

        .menu-card-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.5rem 0;
          border-top: 1px solid #f7fafc;
          border-bottom: 1px solid #f7fafc;
        }

        .category-badge {
          background: #ebf8ff;
          color: #3182ce;
          padding: 0.3rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .availability-toggle {
          display: flex;
          align-items: center;
        }

        .toggle-switch {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.65rem;
          border-radius: 25px;
          cursor: pointer;
          transition: all 0.3s ease;
          border: 2px solid transparent;
          min-width: 100px;
          margin-bottom: 5px;
          justify-content: space-between;
        }

        .toggle-switch.available {
          background: #dcfce7;
          border-color: #22c55e;
        }

        .toggle-switch.unavailable {
          background: #fee2e2;
          border-color: #ef4444;
        }

        .toggle-slider {
          width: 40px;
          height: 20px;
          background: #fff;
          border-radius: 20px;
          position: relative;
          transition: all 0.3s ease;
          border: 1px solid #d1d5db;
        }

        .toggle-slider::before {
          content: "";
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          top: 1px;
          left: 2px;
          transition: all 0.3s ease;
          background: #6b7280;
        }

        .toggle-switch.available .toggle-slider::before {
          transform: translateX(20px);
          background: #22c55e;
        }

        .toggle-switch.unavailable .toggle-slider::before {
          transform: translateX(0);
          background: #ef4444;
        }

        .toggle-text {
          font-size: 0.7rem;
          font-weight: 600;
          min-width: 58px;
        }

        .toggle-switch.available .toggle-text {
          color: #166534;
        }

        .toggle-switch.unavailable .toggle-text {
          color: #991b1b;
        }

        .toggle-switch:active {
          transform: scale(0.95);
        }

        .menu-card-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-edit,
        .btn-delete {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: none;
          border-radius: 12px;
          font-size: 0.85rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .btn-edit {
          background: #fff7ed;
          color: #ed8936;
          border: 1px solid #fed7aa;
        }

        .btn-edit:active {
          background: #feebc8;
          transform: scale(0.95);
        }

        .btn-delete {
          background: #fed7d7;
          color: #e53e3e;
          border: 1px solid #feb2b2;
        }

        .btn-delete:active {
          background: #feb2b2;
          transform: scale(0.95);
        }

        @media (max-width: 360px) {
          .menu-card-header {
            flex-direction: column;
            gap: 0.5rem;
          }

          .menu-price-section {
            flex-direction: row;
            align-items: center;
            width: 100%;
            justify-content: space-between;
          }

          .menu-card-actions {
            flex-direction: column;
            gap: 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Menu;
