"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { BsCartPlus as CartIcon } from "react-icons/bs";
import { FaTrashAlt as DeleteIcon } from "react-icons/fa";
import styles from "@/app/styles/dashboard.module.css";
import { useDashboardStore } from "@/app/store/Dashboard";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const { 
    loading, 
    error, 
    dashboardData, 
    fetchDashboardData
  } = useDashboardStore();
  
  const [activeTab, setActiveTab] = useState('top-selling');
  
  // Fetch dashboard data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const result = await fetchDashboardData();
        
        if (!result.success) {
          toast.error('Failed to load dashboard data');
        }
      } catch (err) {
        toast.error('Error loading dashboard data');
        console.error(err);
      }
    };
    
    loadDashboardData();
  }, [fetchDashboardData]);
  
  // Handle restock action
  const handleRestock = async (productId) => {
    toast.success(`Added product #${productId} to restock list`);
    // This would typically add the product to the cart or a restock queue
  };
  
  // Display loading state
  if (loading && !dashboardData) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }
  
  // If we have an error but no data
  if (error && !dashboardData) {
    return (
      <div className={styles.errorContainer}>
        <p>Error loading dashboard data. Please try again later.</p>
        <button 
          className={styles.retryButton}
          onClick={() => fetchDashboardData()}
        >
          Retry
        </button>
      </div>
    );
  }
  
  // Use fallback data if no dashboard data is available
  const data = dashboardData || {
    date: new Date().toLocaleDateString('en-US'),
    customers: { count: 0, growthPercentage: 0, period: "Since last month" },
    orders: { count: 0, growthPercentage: 0, period: "Since last month" },
    revenue: { 
      current: 0, 
      target: 0, 
      monthlyData: Array(9).fill().map((_, i) => ({ name: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'][i], Revenue: 0, Profit: 0 }))
    },
    earnings: { amount: 0, growthPercentage: 0, period: "Since last month" },
    growth: { percentage: 0, growthChange: 0, period: "Since last month" },
    topSellingProducts: [],
    outOfStockProducts: [],
    totalSales: 0
  };
  
  return (
    <div className={styles.dashboardContainer}>
      <div className={styles.dashboardHeader}>
        <h1>Dashboard</h1>
        <div className={styles.dateSelector}>
          <span>{data.date}</span>
          <button className={styles.dropdownButton}>▼</button>
        </div>
      </div>
      
      <div className={styles.statsContainer}>
        {/* Customers Card */}
        <div className={styles.statsCard}>
          <h3>Customers</h3>
          <div className={styles.statsValue}>{data.customers.count.toLocaleString()}</div>
          <div className={`${styles.statsChange} ${data.customers.growthPercentage >= 0 ? styles.positive : styles.negative}`}>
            {data.customers.growthPercentage >= 0 ? '↑' : '↓'} {Math.abs(data.customers.growthPercentage).toFixed(2)}%
            <span className={styles.period}>{data.customers.period}</span>
          </div>
        </div>
        
        {/* Orders Card */}
        <div className={styles.statsCard}>
          <h3>Orders</h3>
          <div className={styles.statsValue}>{data.orders.count.toLocaleString()}</div>
          <div className={`${styles.statsChange} ${data.orders.growthPercentage >= 0 ? styles.positive : styles.negative}`}>
            {data.orders.growthPercentage >= 0 ? '↑' : '↓'} {Math.abs(data.orders.growthPercentage).toFixed(2)}%
            <span className={styles.period}>{data.orders.period}</span>
          </div>
        </div>
        
        {/* Earnings Card */}
        <div className={styles.statsCard}>
          <h3>Earnings</h3>
          <div className={styles.statsValue}>${data.earnings.amount.toLocaleString()}</div>
          <div className={`${styles.statsChange} ${data.earnings.growthPercentage >= 0 ? styles.positive : styles.negative}`}>
            {data.earnings.growthPercentage >= 0 ? '↑' : '↓'} {Math.abs(data.earnings.growthPercentage).toFixed(2)}%
            <span className={styles.period}>{data.earnings.period}</span>
          </div>
        </div>
        
        {/* Growth Card */}
        <div className={styles.statsCard}>
          <h3>Growth</h3>
          <div className={styles.statsValue}>+ {data.growth.percentage.toFixed(2)}%</div>
          <div className={`${styles.statsChange} ${data.growth.growthChange >= 0 ? styles.positive : styles.negative}`}>
            {data.growth.growthChange >= 0 ? '↑' : '↓'} {Math.abs(data.growth.growthChange).toFixed(2)}%
            <span className={styles.period}>{data.growth.period}</span>
          </div>
        </div>
      </div>
      
      <div className={styles.chartsContainer}>
        {/* Revenue Chart */}
        <div className={styles.revenueChart}>
          <div className={styles.chartHeader}>
            <h3>Revenue</h3>
            <div className={styles.legend}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.current}`}></span>
                <span className={styles.legendLabel}>${data.revenue.current.toLocaleString()}</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.target}`}></span>
                <span className={styles.legendLabel}>${data.revenue.target.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className={styles.chartContainer}>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={data.revenue.monthlyData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(value) => `${value.toLocaleString()}`}
                />
                <Tooltip 
                  formatter={(value) => [`$${value.toLocaleString()}`, '']}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Line 
                  type="monotone" 
                  dataKey="Revenue" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
                />
                <Line 
                  type="monotone" 
                  dataKey="Profit" 
                  stroke="#a855f7" 
                  strokeWidth={3}
                  dot={false}
                  activeDot={{ r: 8, stroke: "#a855f7", strokeWidth: 2, fill: "#fff" }}
                />
              </LineChart>
            </ResponsiveContainer>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.blue}`}></div>
                <span>Revenue</span>
              </div>
              <div className={styles.legendItem}>
                <div className={`${styles.legendDot} ${styles.purple}`}></div>
                <span>Profit</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Total Sales Chart */}
        <div className={styles.totalSales}>
          <h3>Total sales</h3>
          <div className={styles.donutChartContainer}>
            <div className={styles.donutChart}>
              <div className={styles.donutInner}>
                <span className={styles.donutValue}>$ {data.totalSales}</span>
                <span className={styles.donutLabel}>Affiliate</span>
              </div>
            </div>
            <div className={styles.chartLegend}>
              <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.direct}`}></span>
                <span className={styles.legendLabel}>Direct</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.affiliate}`}></span>
                <span className={styles.legendLabel}>Affiliate</span>
              </div>
              <div className={styles.legendItem}>
                <span className={`${styles.legendColor} ${styles.online}`}></span>
                <span className={styles.legendLabel}>Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className={styles.tablesContainer}>
        <div className={styles.tabs}>
          <button 
            className={`${styles.tab} ${activeTab === 'top-selling' ? styles.active : ''}`}
            onClick={() => setActiveTab('top-selling')}
          >
            Top Selling Products
          </button>
          <button 
            className={`${styles.tab} ${activeTab === 'out-of-stock' ? styles.active : ''}`}
            onClick={() => setActiveTab('out-of-stock')}
          >
            Out of Stock Products
          </button>
          
          <button className={styles.exportButton}>Export <span>↑</span></button>
        </div>
        
        <div className={styles.tableContent}>
          {activeTab === 'top-selling' && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>PRODUCT NAME</th>
                  <th>DATE</th>
                  <th>PRICE</th>
                  <th>QUANTITY</th>
                  <th>AMOUNT</th>
                </tr>
              </thead>
              <tbody>
                {data.topSellingProducts.length > 0 ? (
                  data.topSellingProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.date}</td>
                      <td>${parseFloat(product.price).toLocaleString()}</td>
                      <td>{product.quantity}</td>
                      <td>${parseFloat(product.amount).toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className={styles.noData}>No product sales data available</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
          
          {activeTab === 'out-of-stock' && (
            <table className={styles.dataTable}>
              <thead>
                <tr>
                  <th>PRODUCT NAME</th>
                  <th>SKU</th>
                  <th>LAST STOCKED</th>
                  <th>PRICE</th>
                  <th>SUPPLIER</th>
                  <th>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {data.outOfStockProducts.length > 0 ? (
                  data.outOfStockProducts.map((product, index) => (
                    <tr key={index}>
                      <td>{product.name}</td>
                      <td>{product.sku}</td>
                      <td>{product.lastStocked}</td>
                      <td>${product.price.toLocaleString()}</td>
                      <td>{product.supplier}</td>
                      <td>
                        <button 
                          className={styles.restockButton}
                          onClick={() => handleRestock(product.id)}
                        >
                          <CartIcon /> Restock
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className={styles.noData}>No out of stock products</td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}