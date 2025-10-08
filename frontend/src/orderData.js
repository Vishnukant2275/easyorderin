// src/ordersData.js
export const initialOrders = [
  {
    id: 1,
    orderNumber: 'ORD-001',
    customerName: 'John Doe',
    customerPhone: '+91 9876543210',
    tableNumber: 'T-05',
    items: [
      { id: 1, name: 'Paneer Butter Masala', quantity: 2, price: 250 },
      { id: 2, name: 'Garlic Naan', quantity: 4, price: 50 },
    ],
    totalAmount: 700,
    orderTime: new Date().toISOString(),
    status: 'pending',
    specialInstructions: 'Less spicy, extra butter',
  },
  {
    id: 2,
    orderNumber: 'ORD-002',
    customerName: 'Jane Smith',
    customerPhone: '+91 9876543211',
    tableNumber: 'T-12',
    items: [
      { id: 2, name: 'Chicken Tikka', quantity: 1, price: 300 },
      { id: 3, name: 'Coke', quantity: 2, price: 40 },
    ],
    totalAmount: 380,
    orderTime: new Date().toISOString(),
    status: 'pending',
    specialInstructions: '',
  },
  {
    id: 3,
    orderNumber: 'ORD-003',
    customerName: 'Mike Johnson',
    customerPhone: '+91 9876543212',
    tableNumber: 'T-08',
    items: [
      { id: 1, name: 'Paneer Butter Masala', quantity: 1, price: 250 },
      { id: 4, name: 'Veg Biryani', quantity: 2, price: 180 },
    ],
    totalAmount: 610,
    orderTime: new Date().toISOString(),
    status: 'preparing',
    specialInstructions: 'Pack separately',
  },
  {
    id: 4,
    orderNumber: 'ORD-004',
    customerName: 'Sarah Wilson',
    customerPhone: '+91 9876543213',
    tableNumber: 'T-03',
    items: [
      { id: 5, name: 'Butter Chicken', quantity: 1, price: 320 },
      { id: 6, name: 'Roti', quantity: 3, price: 30 },
    ],
    totalAmount: 410,
    orderTime: new Date().toISOString(),
    status: 'ready',
    specialInstructions: 'Extra gravy',
  },
  {
    id: 5,
    orderNumber: 'ORD-005',
    customerName: 'Robert Brown',
    customerPhone: '+91 9876543214',
    tableNumber: 'T-15',
    items: [
      { id: 7, name: 'Dal Makhani', quantity: 1, price: 200 },
      { id: 8, name: 'Rice', quantity: 2, price: 120 },
    ],
    totalAmount: 440,
    orderTime: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
    status: 'completed',
    specialInstructions: '',
  }
];