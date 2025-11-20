const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Admin name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number']
  },

  // Admin Role & Permissions
  role: {
    type: String,
    enum: ['super_admin', 'admin', 'manager', 'support'],
    default: 'admin'
  },
  permissions: {
    restaurant_management: { type: Boolean, default: true },
    user_management: { type: Boolean, default: true },
    order_management: { type: Boolean, default: true },
    financial_management: { type: Boolean, default: true },
    invoice_generation: { type: Boolean, default: true },
    gst_management: { type: Boolean, default: true },
    system_settings: { type: Boolean, default: false }
  },

  // Profile Information
  profileImage: {
    type: String,
    default: null
  },
  department: {
    type: String,
    enum: ['operations', 'finance', 'support', 'management', 'technical'],
    default: 'operations'
  },

  // Security & Status
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },

  // Audit Trail
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for full name
adminSchema.virtual('fullName').get(function() {
  return this.name;
});

// Index for better query performance
adminSchema.index({ email: 1 });
adminSchema.index({ role: 1 });
adminSchema.index({ isActive: 1 });
adminSchema.index({ createdAt: -1 });




// Pre-save middleware to update updatedAt
adminSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Instance method to check if account is locked
adminSchema.methods.isLocked = function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
};

// Instance method to increment login attempts
adminSchema.methods.incrementLoginAttempts = async function() {
  // If we have a previous lock that has expired, restart at 1
  if (this.lockUntil && this.lockUntil < Date.now()) {
    return this.updateOne({
      $set: { loginAttempts: 1 },
      $unset: { lockUntil: 1 }
    });
  }

  // Otherwise we're incrementing
  const updates = { $inc: { loginAttempts: 1 } };

  // Lock the account if we've reached max attempts and it's not locked already
  if (this.loginAttempts + 1 >= 5 && !this.isLocked()) {
    updates.$set = { lockUntil: Date.now() + 2 * 60 * 60 * 1000 }; // 2 hours
  }

  return this.updateOne(updates);
};



// Instance method to change password
adminSchema.methods.changePassword = async function(currentPassword, newPassword) {
  // 1) Check if current password is correct
  if (!(await this.correctPassword(currentPassword, this.password))) {
    throw new Error('Your current password is incorrect.');
  }

  // 2) If so, update password
  this.password = newPassword;
  this.passwordChangedAt = Date.now();

  // 3) Reset login attempts if any
  this.loginAttempts = 0;
  this.lockUntil = undefined;

  return this.save();
};

// Static method to find admin by email
adminSchema.statics.findByEmail = function(email) {
  return this.findOne({ email: email.toLowerCase() });
};

// Static method to get admins by role
adminSchema.statics.findByRole = function(role) {
  return this.find({ role, isActive: true });
};

// Static method to get active admins
adminSchema.statics.getActiveAdmins = function() {
  return this.find({ isActive: true }).sort({ createdAt: -1 });
};

// Static method to create super admin (for initial setup)
adminSchema.statics.createSuperAdmin = async function(adminData) {
  const superAdminCount = await this.countDocuments({ role: 'super_admin' });
  
  if (superAdminCount > 0) {
    throw new Error('Super admin already exists');
  }

  adminData.role = 'super_admin';
  adminData.permissions = {
    restaurant_management: true,
    user_management: true,
    order_management: true,
    financial_management: true,
    invoice_generation: true,
    gst_management: true,
    system_settings: true
  };

  return this.create(adminData);
};

// Method to check permission
adminSchema.methods.hasPermission = function(permission) {
  if (this.role === 'super_admin') return true;
  return this.permissions[permission] === true;
};

// Method to get admin dashboard stats
// Simple dashboard stats method (use this if other models aren't ready)
adminSchema.statics.getDashboardStats = async function() {
  try {
    // Basic counts - you can expand these as you create more models
    const totalRestaurants = await mongoose.model('Restaurant').countDocuments() || 0;
    const activeRestaurants = await mongoose.model('Restaurant').countDocuments({ status: 'active' }) || 0;
    const totalUsers = await mongoose.model('User').countDocuments({ role: 'customer' }) || 0;
    const totalOrders = await mongoose.model('Order').countDocuments() || 0;

    // Sample data for development
    return {
      // Real data
      totalRestaurants,
      activeRestaurants,
      inactiveRestaurants: totalRestaurants - activeRestaurants,
      totalUsers,
      totalOrders,
      
      // Sample data (replace with real data as you build your models)
      pendingOrders: Math.floor(totalOrders * 0.2),
      completedOrders: Math.floor(totalOrders * 0.7),
      totalRevenue: totalOrders * 500, // Sample revenue calculation
      
      // Previous period stats (sample data)
      previousTotalRestaurants: Math.max(0, totalRestaurants - 5),
      previousTotalUsers: Math.max(0, totalUsers - 10),
      previousTotalOrders: Math.max(0, totalOrders - 25),
      previousTotalRevenue: Math.max(0, (totalOrders - 25) * 450),
      
      // Sample recent activities
      recentActivities: [
        {
          id: 1,
          activity: 'New restaurant "Spice Garden" registered',
          time: '2 mins ago',
          type: 'restaurant'
        },
        {
          id: 2,
          activity: 'Order #2847 completed successfully',
          time: '15 mins ago',
          type: 'order'
        }
      ],
      
      // Sample top restaurants
      topRestaurants: [
        {
          name: 'Biryani Blues',
          orders: 284,
          revenue: '₹84,567',
          rating: 4.8
        },
        {
          name: 'Pizza Palace',
          orders: 198,
          revenue: '₹67,890',
          rating: 4.6
        }
      ]
    };
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    
    // Return sample data if there's an error
    return getSampleStats();
  }
};

// Sample stats for development
const getSampleStats = () => ({
  totalRestaurants: 156,
  activeRestaurants: 148,
  inactiveRestaurants: 8,
  totalUsers: 1234,
  totalOrders: 2847,
  pendingOrders: 342,
  completedOrders: 2450,
  totalRevenue: 2845670,
  previousTotalRestaurants: 139,
  previousTotalUsers: 1003,
  previousTotalOrders: 2711,
  previousTotalRevenue: 2474500,
  recentActivities: [
    {
      id: 1,
      activity: 'New restaurant "Spice Garden" registered',
      time: '2 mins ago',
      type: 'restaurant'
    },
    {
      id: 2,
      activity: 'Order #2847 completed successfully',
      time: '15 mins ago',
      type: 'order'
    },
    {
      id: 3,
      activity: 'User John Doe placed a new order',
      time: '28 mins ago',
      type: 'user'
    }
  ],
  topRestaurants: [
    {
      name: 'Biryani Blues',
      orders: 284,
      revenue: '₹84,567',
      rating: 4.8
    },
    {
      name: 'Pizza Palace',
      orders: 198,
      revenue: '₹67,890',
      rating: 4.6
    },
    {
      name: 'Burger Hub',
      orders: 167,
      revenue: '₹45,678',
      rating: 4.5
    }
  ]
});
// Method to update admin profile
adminSchema.methods.updateProfile = async function(updateData) {
  const allowedUpdates = ['name', 'phone', 'profileImage', 'department'];
  const updates = {};

  Object.keys(updateData).forEach(key => {
    if (allowedUpdates.includes(key)) {
      updates[key] = updateData[key];
    }
  });

  Object.assign(this, updates);
  return this.save();
};

// Method to deactivate admin
adminSchema.methods.deactivate = function() {
  this.isActive = false;
  this.updatedAt = Date.now();
  return this.save();
};

// Method to reactivate admin
adminSchema.methods.reactivate = function() {
  this.isActive = true;
  this.updatedAt = Date.now();
  return this.save();
};

// Export the model
module.exports = mongoose.model('Admin', adminSchema);