import React, { useState, useEffect } from 'react';
import styles from './HardcopyRegister.module.css';

const HardcopyRegister = () => {
  const [activeTab, setActiveTab] = useState('sales');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  // Sample data - in real app, this would come from API
  const [registers, setRegisters] = useState({
    sales: [
      {
        id: 1,
        invoiceNo: 'INV-20240320-001',
        date: '2024-03-20',
        restaurant: 'Biryani Blues',
        gstin: '07AABCU9603R1ZM',
        taxableValue: 15000,
        cgst: 1350,
        sgst: 1350,
        igst: 0,
        total: 17700,
        status: 'Paid'
      },
      {
        id: 2,
        invoiceNo: 'INV-20240319-002',
        date: '2024-03-19',
        restaurant: 'Pizza Palace',
        gstin: '29AABCP1234N1Z2',
        taxableValue: 12000,
        cgst: 1080,
        sgst: 1080,
        igst: 0,
        total: 14160,
        status: 'Pending'
      }
    ],
    purchase: [
      {
        id: 1,
        invoiceNo: 'PUR-20240315-001',
        date: '2024-03-15',
        supplier: 'Cloud Kitchen Pvt Ltd',
        gstin: '07AABCC1234N1Z3',
        taxableValue: 5000,
        cgst: 450,
        sgst: 450,
        igst: 0,
        total: 5900,
        itcEligible: true,
        itcClaimed: 900
      }
    ],
    expense: [
      {
        id: 1,
        billNo: 'EXP-20240301-001',
        date: '2024-03-01',
        category: 'Office Rent',
        vendor: 'Property Owner',
        amount: 25000,
        paymentMode: 'Bank Transfer',
        description: 'Monthly office rent'
      }
    ],
    payments: [
      {
        id: 1,
        date: '2024-03-20',
        type: 'Received',
        from: 'Biryani Blues',
        amount: 17700,
        paymentMode: 'UPI',
        reference: 'UTR123456789',
        status: 'Completed'
      },
      {
        id: 2,
        date: '2024-03-18',
        type: 'Paid',
        to: 'AWS Services',
        amount: 5000,
        paymentMode: 'Credit Card',
        reference: 'TXN987654321',
        status: 'Completed'
      }
    ],
    commission: [
      {
        id: 1,
        month: 'March 2024',
        restaurant: 'Biryani Blues',
        totalOrders: 284,
        totalSales: 847000,
        commissionRate: 15,
        commissionAmount: 127050,
        gstOnCommission: 22869,
        netCommission: 104181
      },
      {
        id: 2,
        month: 'March 2024',
        restaurant: 'Pizza Palace',
        totalOrders: 198,
        totalSales: 678900,
        commissionRate: 12,
        commissionAmount: 81468,
        gstOnCommission: 14664,
        netCommission: 66804
      }
    ],
    gstr: [
      {
        id: 1,
        month: 'February 2024',
        type: 'GSTR-1',
        filingDate: '2024-03-11',
        dueDate: '2024-03-11',
        status: 'Filed',
        taxableValue: 450000,
        taxLiability: 81000,
        penalty: 0
      },
      {
        id: 2,
        month: 'February 2024',
        type: 'GSTR-3B',
        filingDate: '2024-03-20',
        dueDate: '2024-03-20',
        status: 'Filed',
        taxableValue: 450000,
        taxLiability: 81000,
        itcClaimed: 18000,
        netTax: 63000,
        penalty: 0
      }
    ]
  });

  const tabs = [
    { id: 'sales', name: '1. Sales Register', icon: '📊' },
    { id: 'purchase', name: '2. Purchase Register', icon: '🛒' },
    { id: 'expense', name: '3. Expense Register', icon: '💸' },
    { id: 'payments', name: '4. Payment Register', icon: '💰' },
    { id: 'commission', name: '5. Commission Report', icon: '📈' },
    { id: 'gstr', name: '6. GSTR Records', icon: '📑' }
  ];

  const calculateTotals = (data) => {
    return data.reduce((acc, item) => {
      acc.taxableValue += item.taxableValue || 0;
      acc.cgst += item.cgst || 0;
      acc.sgst += item.sgst || 0;
      acc.igst += item.igst || 0;
      acc.total += item.total || item.amount || 0;
      acc.commissionAmount += item.commissionAmount || 0;
      return acc;
    }, { taxableValue: 0, cgst: 0, sgst: 0, igst: 0, total: 0, commissionAmount: 0 });
  };

  const renderSalesRegister = () => {
    const totals = calculateTotals(registers.sales);
    
    return (
      <div className={styles.registerSection}>
        <div className={styles.sectionHeader}>
          <h3>Sales Register - Outward Supplies</h3>
          <span className={styles.recordCount}>{registers.sales.length} invoices</span>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.registerTable}>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Restaurant</th>
                <th>GSTIN</th>
                <th>Taxable Value</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {registers.sales.map(record => (
                <tr key={record.id}>
                  <td className={styles.invoiceNo}>{record.invoiceNo}</td>
                  <td>{record.date}</td>
                  <td className={styles.restaurant}>{record.restaurant}</td>
                  <td className={styles.gstin}>{record.gstin}</td>
                  <td className={styles.amount}>₹{record.taxableValue.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.cgst.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.sgst.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.igst.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.total.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.status} ${styles[record.status.toLowerCase()]}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalsRow}>
                <td colSpan="4"><strong>Grand Total</strong></td>
                <td><strong>₹{totals.taxableValue.toLocaleString()}</strong></td>
                <td><strong>₹{totals.cgst.toLocaleString()}</strong></td>
                <td><strong>₹{totals.sgst.toLocaleString()}</strong></td>
                <td><strong>₹{totals.igst.toLocaleString()}</strong></td>
                <td><strong>₹{totals.total.toLocaleString()}</strong></td>
                <td></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderPurchaseRegister = () => {
    const totals = calculateTotals(registers.purchase);
    
    return (
      <div className={styles.registerSection}>
        <div className={styles.sectionHeader}>
          <h3>Purchase Register - Inward Supplies (ITC)</h3>
          <span className={styles.recordCount}>{registers.purchase.length} invoices</span>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.registerTable}>
            <thead>
              <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Supplier</th>
                <th>GSTIN</th>
                <th>Taxable Value</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>IGST</th>
                <th>Total</th>
                <th>ITC Eligible</th>
                <th>ITC Claimed</th>
              </tr>
            </thead>
            <tbody>
              {registers.purchase.map(record => (
                <tr key={record.id}>
                  <td className={styles.invoiceNo}>{record.invoiceNo}</td>
                  <td>{record.date}</td>
                  <td className={styles.restaurant}>{record.supplier}</td>
                  <td className={styles.gstin}>{record.gstin}</td>
                  <td className={styles.amount}>₹{record.taxableValue.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.cgst.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.sgst.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.igst.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.total.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.status} ${record.itcEligible ? styles.yes : styles.no}`}>
                      {record.itcEligible ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className={styles.amount}>₹{record.itcClaimed.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalsRow}>
                <td colSpan="4"><strong>Grand Total</strong></td>
                <td><strong>₹{totals.taxableValue.toLocaleString()}</strong></td>
                <td><strong>₹{totals.cgst.toLocaleString()}</strong></td>
                <td><strong>₹{totals.sgst.toLocaleString()}</strong></td>
                <td><strong>₹{totals.igst.toLocaleString()}</strong></td>
                <td><strong>₹{totals.total.toLocaleString()}</strong></td>
                <td></td>
                <td><strong>₹{registers.purchase.reduce((sum, item) => sum + item.itcClaimed, 0).toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderExpenseRegister = () => {
    const totals = calculateTotals(registers.expense);
    
    return (
      <div className={styles.registerSection}>
        <div className={styles.sectionHeader}>
          <h3>Expense Register - Non-GST Bills</h3>
          <span className={styles.recordCount}>{registers.expense.length} expenses</span>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.registerTable}>
            <thead>
              <tr>
                <th>Bill No</th>
                <th>Date</th>
                <th>Category</th>
                <th>Vendor</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {registers.expense.map(record => (
                <tr key={record.id}>
                  <td className={styles.invoiceNo}>{record.billNo}</td>
                  <td>{record.date}</td>
                  <td className={styles.category}>{record.category}</td>
                  <td className={styles.restaurant}>{record.vendor}</td>
                  <td className={styles.amount}>₹{record.amount.toLocaleString()}</td>
                  <td>{record.paymentMode}</td>
                  <td className={styles.description}>{record.description}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalsRow}>
                <td colSpan="4"><strong>Total Expenses</strong></td>
                <td><strong>₹{totals.total.toLocaleString()}</strong></td>
                <td colSpan="2"></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderPaymentRegister = () => {
    const received = registers.payments.filter(p => p.type === 'Received').reduce((sum, p) => sum + p.amount, 0);
    const paid = registers.payments.filter(p => p.type === 'Paid').reduce((sum, p) => sum + p.amount, 0);
    const net = received - paid;
    
    return (
      <div className={styles.registerSection}>
        <div className={styles.sectionHeader}>
          <h3>Payment Register - Cash Flow</h3>
          <div className={styles.paymentSummary}>
            <span className={styles.summaryItem}>Received: <strong>₹{received.toLocaleString()}</strong></span>
            <span className={styles.summaryItem}>Paid: <strong>₹{paid.toLocaleString()}</strong></span>
            <span className={styles.summaryItem}>Net: <strong className={net >= 0 ? styles.positive : styles.negative}>₹{net.toLocaleString()}</strong></span>
          </div>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.registerTable}>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Party</th>
                <th>Amount</th>
                <th>Payment Mode</th>
                <th>Reference</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {registers.payments.map(record => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td>
                    <span className={`${styles.paymentType} ${styles[record.type.toLowerCase()]}`}>
                      {record.type}
                    </span>
                  </td>
                  <td className={styles.restaurant}>{record.from || record.to}</td>
                  <td className={styles.amount}>₹{record.amount.toLocaleString()}</td>
                  <td>{record.paymentMode}</td>
                  <td className={styles.reference}>{record.reference}</td>
                  <td>
                    <span className={`${styles.status} ${styles[record.status.toLowerCase()]}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderCommissionReport = () => {
    const totals = calculateTotals(registers.commission);
    
    return (
      <div className={styles.registerSection}>
        <div className={styles.sectionHeader}>
          <h3>Commission Report - Restaurant-wise</h3>
          <span className={styles.recordCount}>Total Commission: ₹{totals.commissionAmount.toLocaleString()}</span>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.registerTable}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Restaurant</th>
                <th>Total Orders</th>
                <th>Total Sales</th>
                <th>Commission Rate</th>
                <th>Commission Amount</th>
                <th>GST on Commission</th>
                <th>Net Commission</th>
              </tr>
            </thead>
            <tbody>
              {registers.commission.map(record => (
                <tr key={record.id}>
                  <td>{record.month}</td>
                  <td className={styles.restaurant}>{record.restaurant}</td>
                  <td className={styles.number}>{record.totalOrders}</td>
                  <td className={styles.amount}>₹{record.totalSales.toLocaleString()}</td>
                  <td className={styles.number}>{record.commissionRate}%</td>
                  <td className={styles.amount}>₹{record.commissionAmount.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.gstOnCommission.toLocaleString()}</td>
                  <td className={styles.amount}><strong>₹{record.netCommission.toLocaleString()}</strong></td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalsRow}>
                <td colSpan="2"><strong>Total</strong></td>
                <td><strong>{registers.commission.reduce((sum, item) => sum + item.totalOrders, 0)}</strong></td>
                <td><strong>₹{registers.commission.reduce((sum, item) => sum + item.totalSales, 0).toLocaleString()}</strong></td>
                <td></td>
                <td><strong>₹{totals.commissionAmount.toLocaleString()}</strong></td>
                <td><strong>₹{registers.commission.reduce((sum, item) => sum + item.gstOnCommission, 0).toLocaleString()}</strong></td>
                <td><strong>₹{registers.commission.reduce((sum, item) => sum + item.netCommission, 0).toLocaleString()}</strong></td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    );
  };

  const renderGSTRRecords = () => {
    return (
      <div className={styles.registerSection}>
        <div className={styles.sectionHeader}>
          <h3>GSTR Filing Records</h3>
          <span className={styles.recordCount}>{registers.gstr.length} filings</span>
        </div>
        
        <div className={styles.tableContainer}>
          <table className={styles.registerTable}>
            <thead>
              <tr>
                <th>Month</th>
                <th>Return Type</th>
                <th>Filing Date</th>
                <th>Due Date</th>
                <th>Taxable Value</th>
                <th>Tax Liability</th>
                <th>ITC Claimed</th>
                <th>Net Tax</th>
                <th>Penalty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {registers.gstr.map(record => (
                <tr key={record.id}>
                  <td>{record.month}</td>
                  <td className={styles.gstrType}>{record.type}</td>
                  <td>{record.filingDate}</td>
                  <td>{record.dueDate}</td>
                  <td className={styles.amount}>₹{record.taxableValue.toLocaleString()}</td>
                  <td className={styles.amount}>₹{record.taxLiability.toLocaleString()}</td>
                  <td className={styles.amount}>
                    {record.itcClaimed ? `₹${record.itcClaimed.toLocaleString()}` : '-'}
                  </td>
                  <td className={styles.amount}>
                    {record.netTax ? `₹${record.netTax.toLocaleString()}` : '-'}
                  </td>
                  <td className={styles.amount}>₹{record.penalty.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.status} ${styles[record.status.toLowerCase()]}`}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'sales': return renderSalesRegister();
      case 'purchase': return renderPurchaseRegister();
      case 'expense': return renderExpenseRegister();
      case 'payments': return renderPaymentRegister();
      case 'commission': return renderCommissionReport();
      case 'gstr': return renderGSTRRecords();
      default: return renderSalesRegister();
    }
  };

  return (
    <div className={styles.hardcopyRegister}>
      <div className={styles.header}>
        <h1 className={styles.title}>Hardcopy Register</h1>
        <p className={styles.subtitle}>Maintain complete financial records for GST compliance</p>
      </div>

      {/* Date Range Filter */}
      <div className={styles.filters}>
        <div className={styles.dateRange}>
          <label>Date Range:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
            className={styles.dateInput}
          />
          <span>to</span>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
            className={styles.dateInput}
          />
        </div>
        <button className={styles.exportBtn}>📥 Export to Excel</button>
      </div>

      {/* Tabs */}
      <div className={styles.tabs}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            className={`${styles.tab} ${activeTab === tab.id ? styles.active : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className={styles.tabIcon}>{tab.icon}</span>
            <span className={styles.tabName}>{tab.name}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className={styles.content}>
        {renderContent()}
      </div>
    </div>
  );
};

export default HardcopyRegister;