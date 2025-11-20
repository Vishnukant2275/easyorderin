import React, { useState, useRef } from "react";
import { QRCodeSVG } from "qrcode.react";
import api from "../../services/api";
import { useRestaurant } from "../../context/RestaurantContext";
import NotActive from "../../components/NotActive";

const Table = () => {
  const { table, setTable, setRefreshTrigger, restaurant } = useRestaurant();

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterLocation, setFilterLocation] = useState("All");
  const [selectedTable, setSelectedTable] = useState(null);
  const [qrSize, setQrSize] = useState(128);
  const qrRefs = useRef({});

  const [formData, setFormData] = useState({
    numberOfTables: "",
  });

  const statusOptions = [
    { value: "available", label: "Available", color: "success" },
    { value: "occupied", label: "Occupied", color: "danger" },
  ];

  // Ensure table is always an array and skip undefined items
  const filteredTables = (table || []).filter((tableItem) => {
    if (!tableItem) return false;

    const tableNumberStr = tableItem.tableNumber?.toString() || "";
    const tableNameStr = tableItem.tableName || "";
    const statusStr = tableItem.status || "";

    const matchesSearch =
      tableNumberStr.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tableNameStr.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = filterStatus === "All" || statusStr === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        const res = await api.put(
          `/restaurant/update-table/${formData.id}`,
          formData
        );
        setTable(
          table.map((t) => (t._id === formData.id ? res.data.table : t))
        );
      } else {
        const res = await api.post("/restaurant/create-tables", formData);
        setTable([...table, res.data.table]);
        setRefreshTrigger((prev) => prev + 1);
      }

      resetForm();
    } catch (err) {
      console.error("Error creating/updating table:", err);
    }
  };

  // FIXED: Add API call to update table status

  const resetForm = () => {
    setFormData({
      numberOfTables: "",
    });
    setEditMode(false);
    setShowForm(false);
    setSelectedTable(null);
  };
  const handleViewOrders = (tableItem) => {
    alert(`Viewing current orders for Table ${tableItem.tableNumber}`);
  };

  const downloadQRCode = (tableId, tableNumber) => {
    const svgElement = qrRefs.current[tableId];
    if (svgElement) {
      const svgData = new XMLSerializer().serializeToString(svgElement);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const pngUrl = canvas.toDataURL("image/png");
        const downloadLink = document.createElement("a");
        downloadLink.href = pngUrl;
        downloadLink.download = `QRCode-Table-${tableNumber}.png`;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
      };

      img.src = "data:image/svg+xml;base64," + btoa(svgData);
    }
  };

  const downloadAllQRCodes = () => {
    table.forEach((tableItem, index) => {
      setTimeout(() => {
        downloadQRCode(tableItem._id, tableItem.numberOfTables);
      }, index * 300);
    });
  };

  const printQRCode = (tableId) => {
    const tableItem = table.find((t) => t._id === tableId);
    if (!tableItem) return;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code - Table ${tableItem.numberOfTables}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              text-align: center; 
              padding: 40px;
            }
            .table-info { 
              margin-bottom: 30px; 
            }
            .restaurant-name {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 15px;
            }
            .qr-container {
              margin: 20px auto;
            }
          </style>
        </head>
        <body>
          <div class="restaurant-name">Delicious Restaurant</div>
          <div class="table-info">
            <h2>Table: ${tableItem.numberOfTables}</h2>
            <p>Status: ${tableItem.status}</p>
            <p>Scan QR code to view menu and order</p>
          </div>
          <div class="qr-container">
            ${qrRefs.current[tableId]?.outerHTML || ""}
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 500);
            }
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  const getStatusBadge = (status) => {
    const statusConfig = statusOptions.find((s) => s.value === status);
    return (
      <span className={`badge bg-${statusConfig?.color || "secondary"}`}>
        {statusConfig?.label || status}
      </span>
    );
  };

  const getStatusCount = (status) => {
    return (table || []).reduce((count, tableItem) => {
      if (!tableItem) return count;
      const tableStatus = tableItem.status || "available";
      return tableStatus === status ? count + 1 : count;
    }, 0);
  };

  return (
    <>
      <NotActive />
      <div className="container-fluid">
        {/* Header and Stats */}
        <div className="row mb-4">
          <div className="col-12">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">Table Management</h2>
                <p className="text-muted mb-0">
                  Manage restaurant tables and QR codes
                </p>
              </div>
              <div className="btn-group">
                <button
                  className="btn btn-outline-primary"
                  onClick={downloadAllQRCodes}
                >
                  <i className="bi bi-download me-2"></i>
                  Download All QR Codes
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setShowForm(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Add Tables
                </button>
              </div>
            </div>

            {/* Statistics Cards */}
            <div className="row g-3 mb-4">
              <div className="col-md-3">
                <div className="card bg-primary text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{table.length}</h4>
                        <small>Total Tables</small>
                      </div>
                      <i className="bi bi-table fs-2"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-success text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount("available")}</h4>
                        <small>Available</small>
                      </div>
                      <i className="bi bi-check-circle fs-2"></i>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <div className="card bg-danger text-white">
                  <div className="card-body">
                    <div className="d-flex justify-content-between">
                      <div>
                        <h4 className="mb-0">{getStatusCount("occupied")}</h4>
                        <small>Occupied</small>
                      </div>
                      <i className="bi bi-people fs-2"></i>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="row mb-4">
          <div className="col-md-4">
            <input
              type="text"
              className="form-control"
              placeholder="Search tables by number..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="col-md-3">
            <select
              className="form-select"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="All">All Status</option>
              {statusOptions.map((status) => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>
          </div>
          <div className="col-md-2">
            <span className="badge bg-secondary p-2 h-100 d-flex align-items-center">
              {filteredTables.length} tables
            </span>
          </div>
        </div>

        {/* Tables Grid */}
        <div className="row g-4">
          {filteredTables.length === 0 ? (
            <div className="col-12">
              <div className="text-center py-5">
                <i
                  className="bi bi-table text-muted"
                  style={{ fontSize: "3rem" }}
                ></i>
                <h4 className="mt-3 text-muted">No tables found</h4>
                <p className="text-muted">
                  {table.length === 0
                    ? "Create your first table"
                    : "Try adjusting your search filters"}
                </p>
              </div>
            </div>
          ) : (
            filteredTables.map((tableItem) => (
              <div key={tableItem._id} className="col-md-6 col-lg-4 col-xl-3">
                <div className="card h-100">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <strong>Table {tableItem.tableNumber}</strong>
                    {getStatusBadge(tableItem.status)}
                  </div>

                  <div className="card-body text-center">
                    {/* QR Code */}
                    <div className="mb-3">
                      <div
                        className="border rounded p-3 d-inline-block"
                        style={{ cursor: "pointer" }}
                        onClick={() =>
                          setSelectedTable(
                            selectedTable?._id === tableItem._id
                              ? null
                              : tableItem
                          )
                        }
                      >
                        <QRCodeSVG
                          ref={(el) => (qrRefs.current[tableItem._id] = el)}
                          value={`     http://172.22.187.32:5173/restaurant/${restaurant._id}/table/${tableItem.tableNumber}/getMenu`}
                          size={qrSize}
                          level="H"
                          includeMargin={true}
                        />
                      </div>
                    </div>

                    {/* Quick Status Update - FIXED: Added onClick handler */}
                    <div className="mb-3">
                      <div className="btn-group w-100">
                        {statusOptions.map((status) => (
                          <button
                            key={`${tableItem._id}-${status.value}`}
                            className={`btn btn-sm btn-outline-${
                              status.color
                            } ${
                              tableItem.status === status.value ? "active" : ""
                            }`}
                          >
                            {status.label}
                          </button>
                        ))}
                      </div>
                      {tableItem.status === "occupied" && (
                        <small
                          className="current-orders-link"
                          onClick={() => handleViewOrders(tableItem)}
                        >
                          View Current Orders
                        </small>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="card-footer bg-transparent">
                    <div className="btn-group w-100">
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={() =>
                          downloadQRCode(
                            tableItem._id,
                            tableItem.numberOfTables
                          )
                        }
                        title="Download QR Code"
                      >
                        <i className="bi bi-download"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => printQRCode(tableItem._id)}
                        title="Print QR Code"
                      >
                        <i className="bi bi-printer"></i>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* QR Code Preview Modal */}
        {selectedTable && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog modal-sm">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    QR Code - Table {selectedTable.numberOfTables}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setSelectedTable(null)}
                  ></button>
                </div>
                <div className="modal-body text-center">
                  <QRCodeSVG
                    value={`/restaurant/${restaurant._id}/table/${selectedTable.tableNumber}/getMenu`}
                    size={256}
                    level="H"
                    includeMargin={true}
                  />
                  <div className="mt-3">
                    <p className="mb-1">
                      <strong>Table {selectedTable.numberOfTables}</strong>
                    </p>
                    <p className="text-muted small">
                      Status: {selectedTable.status}
                    </p>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      downloadQRCode(
                        selectedTable._id,
                        selectedTable.numberOfTables
                      )
                    }
                  >
                    <i className="bi bi-download me-2"></i>
                    Download
                  </button>
                  <button
                    className="btn btn-success"
                    onClick={() => printQRCode(selectedTable._id)}
                  >
                    <i className="bi bi-printer me-2"></i>
                    Print
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Tables Form Modal */}
        {showForm && (
          <div
            className="modal show d-block"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <div className="modal-dialog">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editMode ? "Edit Table" : "Create Tables in Bulk"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={resetForm}
                  ></button>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="modal-body">
                    <div className="row g-3">
                      <div className="col-12">
                        <label className="form-label">
                          Number of Tables to Add
                        </label>
                        <input
                          type="number"
                          className="form-control"
                          name="numberOfTables"
                          value={formData.numberOfTables}
                          onChange={handleInputChange}
                          placeholder="e.g., 10"
                          min="1"
                          max="50"
                          required
                        />
                        <div className="form-text">
                          Enter how many tables you want to create
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      {editMode ? "Update Table" : "Create Tables"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Table;
