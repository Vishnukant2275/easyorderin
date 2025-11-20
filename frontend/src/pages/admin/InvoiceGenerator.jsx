import React, { useState, useEffect } from 'react';
import styles from './InvoiceGenerator.module.css';

const InvoiceGenerator = () => {
  const [invoices, setInvoices] = useState([]);
  const [restaurants, setRestaurants] = useState([
    { id: 1, name: 'Biryani Blues', gstin: '07AABCU9603R1ZM', address: 'Connaught Place, New Delhi' },
    { id: 2, name: 'Pizza Palace', gstin: '29AABCP1234N1Z2', address: 'MG Road, Bangalore' },
    { id: 3, name: 'Burger Hub', gstin: '24AACCC1576M1Z3', address: 'Bandra West, Mumbai' }
  ]);
  
  const [selectedRestaurant, setSelectedRestaurant] = useState('');
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split('T')[0]);
  const [invoiceNumber, setInvoiceNumber] = useState('');
  const [items, setItems] = useState([
    { description: 'Platform Commission', quantity: 1, rate: 0, amount: 0, gstRate: 18 }
  ]);
  const [notes, setNotes] = useState('');

  // Generate invoice number
  useEffect(() => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    setInvoiceNumber(`INV-${year}${month}${day}-${random}`);
  }, []);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0, gstRate: 18 }]);
  };

  const updateItem = (index, field, value) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  const calculateTotals = () => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const gstAmount = items.reduce((sum, item) => {
      const itemGst = (item.amount * item.gstRate) / 100;
      return sum + itemGst;
    }, 0);
    const total = subtotal + gstAmount;
    
    return { subtotal, gstAmount, total };
  };

  const generateInvoice = () => {
    if (!selectedRestaurant) {
      alert('Please select a restaurant');
      return;
    }

    const restaurant = restaurants.find(r => r.id === parseInt(selectedRestaurant));
    const { subtotal, gstAmount, total } = calculateTotals();

    const newInvoice = {
      id: Date.now(),
      invoiceNumber,
      restaurant: restaurant.name,
      restaurantGstin: restaurant.gstin,
      date: invoiceDate,
      subtotal,
      gstAmount,
      total,
      items: [...items],
      notes,
      status: 'generated',
      createdAt: new Date().toISOString()
    };

    setInvoices([newInvoice, ...invoices]);
    
    // Reset form
    setItems([{ description: 'Platform Commission', quantity: 1, rate: 0, amount: 0, gstRate: 18 }]);
    setNotes('');
    alert('Invoice generated successfully!');
  };

  const downloadInvoice = (invoice) => {
    // In a real app, this would generate a PDF
    const invoiceData = {
      ...invoice,
      downloadDate: new Date().toLocaleString()
    };
    console.log('Downloading invoice:', invoiceData);
    alert(`Invoice ${invoice.invoiceNumber} download started!`);
  };

  const deleteInvoice = (invoiceId) => {
    if (window.confirm('Are you sure you want to delete this invoice?')) {
      setInvoices(invoices.filter(inv => inv.id !== invoiceId));
    }
  };

  const { subtotal, gstAmount, total } = calculateTotals();

  return (
    <div className={styles.invoiceGenerator}>
      <div className={styles.header}>
        <h1 className={styles.title}>Invoice Generator</h1>
        <p className={styles.subtitle}>Generate daily invoices for restaurants and maintain GST records</p>
      </div>

      <div className={styles.content}>
        {/* Invoice Form */}
        <div className={styles.invoiceForm}>
          <div className={styles.formSection}>
            <h2 className={styles.sectionTitle}>Create New Invoice</h2>
            
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Restaurant</label>
                <select 
                  value={selectedRestaurant} 
                  onChange={(e) => setSelectedRestaurant(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select Restaurant</option>
                  {restaurants.map(restaurant => (
                    <option key={restaurant.id} value={restaurant.id}>
                      {restaurant.name} - {restaurant.gstin}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Invoice Date</label>
                <input
                  type="date"
                  value={invoiceDate}
                  onChange={(e) => setInvoiceDate(e.target.value)}
                  className={styles.input}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label className={styles.label}>Invoice Number</label>
                <input
                  type="text"
                  value={invoiceNumber}
                  readOnly
                  className={styles.input}
                />
              </div>
            </div>

            {/* Invoice Items */}
            <div className={styles.itemsSection}>
              <div className={styles.itemsHeader}>
                <h3 className={styles.itemsTitle}>Invoice Items</h3>
                <button onClick={addItem} className={styles.addItemBtn}>
                  + Add Item
                </button>
              </div>
              
              <div className={styles.itemsTable}>
                <div className={styles.tableHeader}>
                  <div className={styles.colDescription}>Description</div>
                  <div className={styles.colQuantity}>Qty</div>
                  <div className={styles.colRate}>Rate (₹)</div>
                  <div className={styles.colGst}>GST %</div>
                  <div className={styles.colAmount}>Amount (₹)</div>
                  <div className={styles.colAction}>Action</div>
                </div>
                
                <div className={styles.tableBody}>
                  {items.map((item, index) => (
                    <div key={index} className={styles.tableRow}>
                      <div className={styles.colDescription}>
                        <input
                          type="text"
                          value={item.description}
                          onChange={(e) => updateItem(index, 'description', e.target.value)}
                          className={styles.input}
                          placeholder="Item description"
                        />
                      </div>
                      <div className={styles.colQuantity}>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 0)}
                          className={styles.input}
                          min="1"
                        />
                      </div>
                      <div className={styles.colRate}>
                        <input
                          type="number"
                          value={item.rate}
                          onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                          className={styles.input}
                          step="0.01"
                        />
                      </div>
                      <div className={styles.colGst}>
                        <select
                          value={item.gstRate}
                          onChange={(e) => updateItem(index, 'gstRate', parseInt(e.target.value))}
                          className={styles.select}
                        >
                          <option value={0}>0%</option>
                          <option value={5}>5%</option>
                          <option value={12}>12%</option>
                          <option value={18}>18%</option>
                          <option value={28}>28%</option>
                        </select>
                      </div>
                      <div className={styles.colAmount}>
                        <span className={styles.amount}>₹{item.amount.toFixed(2)}</span>
                      </div>
                      <div className={styles.colAction}>
                        {items.length > 1 && (
                          <button 
                            onClick={() => removeItem(index)}
                            className={styles.removeBtn}
                          >
                            🗑️
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Totals */}
            <div className={styles.totalsSection}>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Subtotal:</span>
                <span className={styles.totalValue}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>GST Amount:</span>
                <span className={styles.totalValue}>₹{gstAmount.toFixed(2)}</span>
              </div>
              <div className={styles.totalRow}>
                <span className={styles.totalLabel}>Grand Total:</span>
                <span className={styles.grandTotal}>₹{total.toFixed(2)}</span>
              </div>
            </div>

            {/* Notes */}
            <div className={styles.formGroup}>
              <label className={styles.label}>Notes</label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className={styles.textarea}
                placeholder="Additional notes or terms..."
                rows="3"
              />
            </div>

            {/* Generate Button */}
            <button 
              onClick={generateInvoice}
              className={styles.generateBtn}
              disabled={!selectedRestaurant}
            >
              Generate Invoice
            </button>
          </div>
        </div>

        {/* Invoice History */}
        <div className={styles.invoiceHistory}>
          <div className={styles.historyHeader}>
            <h2 className={styles.sectionTitle}>Invoice History</h2>
            <div className={styles.historyStats}>
              <span className={styles.stat}>Total: {invoices.length}</span>
              <span className={styles.stat}>
                This Month: {invoices.filter(inv => {
                  const invDate = new Date(inv.date);
                  const now = new Date();
                  return invDate.getMonth() === now.getMonth() && invDate.getFullYear() === now.getFullYear();
                }).length}
              </span>
            </div>
          </div>

          {invoices.length === 0 ? (
            <div className={styles.noInvoices}>
              <div className={styles.noInvoicesIcon}>📄</div>
              <h3>No Invoices Generated</h3>
              <p>Create your first invoice to get started</p>
            </div>
          ) : (
            <div className={styles.invoicesList}>
              {invoices.map(invoice => (
                <div key={invoice.id} className={styles.invoiceCard}>
                  <div className={styles.invoiceHeader}>
                    <div className={styles.invoiceInfo}>
                      <h4 className={styles.invoiceNumber}>{invoice.invoiceNumber}</h4>
                      <span className={styles.restaurantName}>{invoice.restaurant}</span>
                    </div>
                    <div className={styles.invoiceAmount}>
                      <span className={styles.amount}>₹{invoice.total.toFixed(2)}</span>
                      <span className={styles.date}>{invoice.date}</span>
                    </div>
                  </div>
                  
                  <div className={styles.invoiceDetails}>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>GSTIN:</span>
                      <span className={styles.detailValue}>{invoice.restaurantGstin}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>Subtotal:</span>
                      <span className={styles.detailValue}>₹{invoice.subtotal.toFixed(2)}</span>
                    </div>
                    <div className={styles.detailItem}>
                      <span className={styles.detailLabel}>GST:</span>
                      <span className={styles.detailValue}>₹{invoice.gstAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <div className={styles.invoiceActions}>
                    <button 
                      onClick={() => downloadInvoice(invoice)}
                      className={styles.downloadBtn}
                    >
                      📥 Download
                    </button>
                    <button 
                      onClick={() => deleteInvoice(invoice.id)}
                      className={styles.deleteBtn}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InvoiceGenerator;