import React, { useState } from 'react';

const Staff = () => {
  const [staffMembers, setStaffMembers] = useState([
    {
      id: 1,
      name: 'Rajesh Kumar',
      email: 'rajesh@restaurant.com',
      phone: '+91 9876543210',
      role: 'Chef',
      department: 'Kitchen',
      salary: 45000,
      joinDate: '2023-01-15',
      shift: 'Morning',
      isActive: true,
      address: '123 Main Street, Mumbai',
      emergencyContact: '+91 9876543211',
    },
    {
      id: 2,
      name: 'Priya Sharma',
      email: 'priya@restaurant.com',
      phone: '+91 9876543212',
      role: 'Wait Staff',
      department: 'Service',
      salary: 25000,
      joinDate: '2023-03-20',
      shift: 'Evening',
      isActive: true,
      address: '456 Park Avenue, Delhi',
      emergencyContact: '+91 9876543213',
    },
    {
      id: 3,
      name: 'Amit Patel',
      email: 'amit@restaurant.com',
      phone: '+91 9876543214',
      role: 'Manager',
      department: 'Management',
      salary: 60000,
      joinDate: '2022-11-10',
      shift: 'General',
      isActive: true,
      address: '789 Cross Road, Bangalore',
      emergencyContact: '+91 9876543215',
    },
    {
      id: 4,
      name: 'Sneha Gupta',
      email: 'sneha@restaurant.com',
      phone: '+91 9876543216',
      role: 'Cashier',
      department: 'Front Desk',
      salary: 22000,
      joinDate: '2023-06-05',
      shift: 'Morning',
      isActive: false,
      address: '321 Lake View, Chennai',
      emergencyContact: '+91 9876543217',
    }
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    department: '',
    salary: '',
    joinDate: '',
    shift: 'Morning',
    isActive: true,
    address: '',
    emergencyContact: ''
  });

  const departments = ['All', 'Kitchen', 'Service', 'Management', 'Front Desk', 'Cleaning'];
  const roles = {
    'Kitchen': ['Head Chef', 'Sous Chef', 'Line Cook', 'Prep Cook', 'Dishwasher'],
    'Service': ['Wait Staff', 'Host/Hostess', 'Bartender', 'Server'],
    'Management': ['Manager', 'Assistant Manager', 'Supervisor'],
    'Front Desk': ['Cashier', 'Receptionist'],
    'Cleaning': ['Cleaner', 'Housekeeping']
  };
  const shifts = ['Morning', 'Evening', 'Night', 'General'];

  const filteredStaff = staffMembers.filter(staff => {
    const matchesSearch = 
      staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      staff.role.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === 'All' || staff.department === filterDepartment;
    const matchesStatus = filterStatus === 'All' || 
                         (filterStatus === 'Active' && staff.isActive) ||
                         (filterStatus === 'Inactive' && !staff.isActive);
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (editMode) {
      // Update existing staff
      setStaffMembers(staffMembers.map(staff =>
        staff.id === formData.id ? formData : staff
      ));
    } else {
      // Add new staff
      const newStaff = {
        ...formData,
        id: Math.max(...staffMembers.map(s => s.id), 0) + 1
      };
      setStaffMembers([...staffMembers, newStaff]);
    }
    
    resetForm();
  };

  const handleEdit = (staff) => {
    setFormData(staff);
    setEditMode(true);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this staff member?')) {
      setStaffMembers(staffMembers.filter(staff => staff.id !== id));
    }
  };

  const toggleStatus = (id) => {
    setStaffMembers(staffMembers.map(staff =>
      staff.id === id ? { ...staff, isActive: !staff.isActive } : staff
    ));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      role: '',
      department: '',
      salary: '',
      joinDate: '',
      shift: 'Morning',
      isActive: true,
      address: '',
      emergencyContact: ''
    });
    setEditMode(false);
    setShowForm(false);
  };

  const getDepartmentStats = () => {
    const stats = {};
    departments.forEach(dept => {
      if (dept !== 'All') {
        stats[dept] = staffMembers.filter(staff => staff.department === dept).length;
      }
    });
    return stats;
  };

  const departmentStats = getDepartmentStats();

  return (
    <div className="container-fluid">
      {/* Header and Stats */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Staff Management</h2>
              <p className="text-muted mb-0">Manage your restaurant staff efficiently</p>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setShowForm(true)}
            >
              <i className="bi bi-person-plus me-2"></i>
              Add New Staff
            </button>
          </div>

          {/* Statistics Cards */}
          <div className="row g-3 mb-4">
            <div className="col-md-3">
              <div className="card bg-primary text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{staffMembers.length}</h4>
                      <small>Total Staff</small>
                    </div>
                    <i className="bi bi-people fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-success text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{staffMembers.filter(s => s.isActive).length}</h4>
                      <small>Active Staff</small>
                    </div>
                    <i className="bi bi-person-check fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-info text-white">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{Math.round(staffMembers.reduce((sum, staff) => sum + staff.salary, 0) / 1000)}K</h4>
                      <small>Monthly Salary</small>
                    </div>
                    <i className="bi bi-currency-rupee fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3">
              <div className="card bg-warning text-dark">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <div>
                      <h4 className="mb-0">{staffMembers.filter(s => !s.isActive).length}</h4>
                      <small>Inactive Staff</small>
                    </div>
                    <i className="bi bi-person-x fs-2"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Search staff by name, email, or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="All">All Departments</option>
            {departments.filter(dept => dept !== 'All').map(dept => (
              <option key={dept} value={dept}>{dept}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All Status</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
        <div className="col-md-2">
          <span className="badge bg-secondary p-2 h-100 d-flex align-items-center">
            {filteredStaff.length} staff members
          </span>
        </div>
      </div>

      {/* Department Stats */}
      <div className="row mb-4">
        <div className="col-12">
          <h5>Department Overview</h5>
          <div className="d-flex gap-2 flex-wrap">
            {Object.entries(departmentStats).map(([dept, count]) => (
              <span key={dept} className="badge bg-light text-dark p-2">
                {dept}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Staff Table */}
      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped table-hover">
              <thead className="table-dark">
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Department</th>
                  <th>Contact</th>
                  <th>Salary</th>
                  <th>Shift</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4 text-muted">
                      No staff members found
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((staff) => (
                    <tr key={staff.id} className={!staff.isActive ? 'table-secondary' : ''}>
                      <td>
                        <div>
                          <strong>{staff.name}</strong>
                          <br />
                          <small className="text-muted">{staff.email}</small>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-info">{staff.role}</span>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{staff.department}</span>
                      </td>
                      <td>
                        <div>
                          <small>{staff.phone}</small>
                          <br />
                          <small className="text-muted">Join: {new Date(staff.joinDate).toLocaleDateString()}</small>
                        </div>
                      </td>
                      <td>
                        <strong>₹{staff.salary.toLocaleString()}</strong>
                      </td>
                      <td>
                        <span className={`badge ${
                          staff.shift === 'Morning' ? 'bg-warning text-dark' :
                          staff.shift === 'Evening' ? 'bg-primary' :
                          staff.shift === 'Night' ? 'bg-dark' : 'bg-secondary'
                        }`}>
                          {staff.shift}
                        </span>
                      </td>
                      <td>
                        <div className="form-check form-switch">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            checked={staff.isActive}
                            onChange={() => toggleStatus(staff.id)}
                          />
                          <label className="form-check-label">
                            {staff.isActive ? 'Active' : 'Inactive'}
                          </label>
                        </div>
                      </td>
                      <td>
                        <div className="btn-group">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => handleEdit(staff)}
                          >
                            <i className="bi bi-pencil"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-info"
                            onClick={() => {
                              // View details - you can implement a modal here
                              alert(`Details for ${staff.name}\nAddress: ${staff.address}\nEmergency: ${staff.emergencyContact}`);
                            }}
                          >
                            <i className="bi bi-eye"></i>
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(staff.id)}
                          >
                            <i className="bi bi-trash"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add/Edit Staff Form Modal */}
      {showForm && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {editMode ? 'Edit Staff Member' : 'Add New Staff Member'}
                </h5>
                <button type="button" className="btn-close" onClick={resetForm}></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Email *</label>
                      <input
                        type="email"
                        className="form-control"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Phone *</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Department *</label>
                      <select
                        className="form-select"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Department</option>
                        {departments.filter(dept => dept !== 'All').map(dept => (
                          <option key={dept} value={dept}>{dept}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Role *</label>
                      <select
                        className="form-select"
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        required
                      >
                        <option value="">Select Role</option>
                        {formData.department && roles[formData.department]?.map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Salary (₹) *</label>
                      <input
                        type="number"
                        className="form-control"
                        name="salary"
                        value={formData.salary}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Join Date *</label>
                      <input
                        type="date"
                        className="form-control"
                        name="joinDate"
                        value={formData.joinDate}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Shift *</label>
                      <select
                        className="form-select"
                        name="shift"
                        value={formData.shift}
                        onChange={handleInputChange}
                        required
                      >
                        {shifts.map(shift => (
                          <option key={shift} value={shift}>{shift}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-12">
                      <label className="form-label">Address</label>
                      <textarea
                        className="form-control"
                        name="address"
                        rows="2"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Emergency Contact</label>
                      <input
                        type="tel"
                        className="form-control"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleInputChange}
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label">Status</label>
                      <select
                        className="form-select"
                        name="isActive"
                        value={formData.isActive}
                        onChange={handleInputChange}
                      >
                        <option value={true}>Active</option>
                        <option value={false}>Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={resetForm}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editMode ? 'Update Staff' : 'Add Staff'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Staff;