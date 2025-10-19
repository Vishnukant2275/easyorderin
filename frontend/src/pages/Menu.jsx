import React, { useState, useEffect, useContext } from "react";

import api from "../services/api";
import { useRestaurant } from "../context/RestaurantContext";
import { toast } from "react-toastify";

const foodCategories = ["starter", "main", "dessert", "beverage", "side"];

const Menu = () => {
  // const [menuItems, setMenuItems] = useState([]);

  const { menuItems, setMenuItems, setRefreshTrigger } = useRestaurant();
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterVegetarian, setFilterVegetarian] = useState("All");

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
      toast.warn("Something went wrong");
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
            <span className="badge bg-primary">
              {/* {filteredMenuItems.length} items */}
            </span>
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
          <div className="table-responsive">
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
                        <div>
                          <strong>{item.name}</strong>
                          {item.description && (
                            <small className="d-block text-muted">
                              {item.description}
                            </small>
                          )}
                        </div>
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
    </div>
  );
};

export default Menu;
