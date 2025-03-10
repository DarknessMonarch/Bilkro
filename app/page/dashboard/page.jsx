"use client";
import Image from "next/image";
import { useState } from "react";
import "@/app/styles/dashboard.module.css";
import { usePathname, useRouter } from "next/navigation";
import { BsCartPlus as CartIcon } from "react-icons/bs";
import { FaTrashAlt as DeleteIcon } from "react-icons/fa";

export default function Dashboard() {
  const dashboardData = {
    date: "08/21/2018",
    customers: {
      count: 45320,
      growthPercentage: 5.32,
      period: "Since last month"
    },
    orders: {
      count: 45320,
      growthPercentage: -1.23,
      period: "Since last month"
    },
    revenue: {
      current: 45320,
      target: 58610,
      monthlyData: [5000, 8000, 12000, 9000, 11000, 7000, 15000, 18542, 14000]
    },
    earnings: {
      amount: 7524,
      growthPercentage: 7.85,
      period: "Since last month"
    },
    growth: {
      percentage: 35.52,
      growthChange: 8.73,
      period: "Since last month"
    },
    topSellingProducts: [
      { name: "Pocket Drone 2.4G", date: "07 April 2018", price: 129.99, quantity: 32, amount: 4099.58 },
      { name: "Marco Lightweight Shirt", date: "15 March 2018", price: 55.99, quantity: 47, amount: 2689.73 },
      { name: "Lightweight Jacket", date: "10 March 2018", price: 73.99, quantity: 55, amount: 1989.57 },
      { name: "DJI Phantom 4 PRO", date: "07 March 2018", price: 499.99, quantity: 25, amount: 8489.05 },
      { name: "3T SwellPro Drone", date: "02 March 2018", price: 219.99, quantity: 12, amount: 2089.58 }
    ],
    totalSales: 834.35,
    outOfStockProducts: [
      { id: 1, name: "Wireless Earbuds Pro", sku: "WEP-001", lastStocked: "12 August 2018", price: 89.99, supplier: "AudioTech Inc." },
      { id: 2, name: "Ultra HD Action Camera", sku: "CAM-4K-X", lastStocked: "5 August 2018", price: 249.99, supplier: "TechVision Ltd." },
      { id: 3, name: "Smart Fitness Watch", sku: "SFW-200", lastStocked: "10 August 2018", price: 129.99, supplier: "FitGear Co." },
      { id: 4, name: "Foldable Mini Drone", sku: "FMD-101", lastStocked: "8 August 2018", price: 159.99, supplier: "SkyTech Innovations" }
    ]
  };
  
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  const [activeTab, setActiveTab] = useState('top-selling');
  
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Dashboard</h1>
        <div className="date-selector">
          <span>{dashboardData.date}</span>
          <button className="dropdown-button">▼</button>
        </div>
      </div>
      
      <div className="stats-container">
        {/* Customers Card */}
        <div className="stats-card">
          <h3>Customers</h3>
          <div className="stats-value">{dashboardData.customers.count.toLocaleString()}</div>
          <div className={`stats-change ${dashboardData.customers.growthPercentage >= 0 ? 'positive' : 'negative'}`}>
            {dashboardData.customers.growthPercentage >= 0 ? '↑' : '↓'} {Math.abs(dashboardData.customers.growthPercentage)}%
            <span className="period">{dashboardData.customers.period}</span>
          </div>
        </div>
        
        {/* Orders Card */}
        <div className="stats-card">
          <h3>Orders</h3>
          <div className="stats-value">{dashboardData.orders.count.toLocaleString()}</div>
          <div className={`stats-change ${dashboardData.orders.growthPercentage >= 0 ? 'positive' : 'negative'}`}>
            {dashboardData.orders.growthPercentage >= 0 ? '↑' : '↓'} {Math.abs(dashboardData.orders.growthPercentage)}%
            <span className="period">{dashboardData.orders.period}</span>
          </div>
        </div>
        
        {/* Earnings Card */}
        <div className="stats-card">
          <h3>Earnings</h3>
          <div className="stats-value">${dashboardData.earnings.amount.toLocaleString()}</div>
          <div className={`stats-change ${dashboardData.earnings.growthPercentage >= 0 ? 'positive' : 'negative'}`}>
            {dashboardData.earnings.growthPercentage >= 0 ? '↑' : '↓'} {Math.abs(dashboardData.earnings.growthPercentage)}%
            <span className="period">{dashboardData.earnings.period}</span>
          </div>
        </div>
        
        {/* Growth Card */}
        <div className="stats-card">
          <h3>Growth</h3>
          <div className="stats-value">+ {dashboardData.growth.percentage}%</div>
          <div className={`stats-change ${dashboardData.growth.growthChange >= 0 ? 'positive' : 'negative'}`}>
            {dashboardData.growth.growthChange >= 0 ? '↑' : '↓'} {Math.abs(dashboardData.growth.growthChange)}%
            <span className="period">{dashboardData.growth.period}</span>
          </div>
        </div>
      </div>
      
      <div className="charts-container">
        {/* Revenue Chart */}
        <div className="revenue-chart">
          <div className="chart-header">
            <h3>Revenue</h3>
            <div className="legend">
              <div className="legend-item">
                <span className="legend-color current"></span>
                <span className="legend-label">{dashboardData.revenue.current.toLocaleString()}</span>
              </div>
              <div className="legend-item">
                <span className="legend-color target"></span>
                <span className="legend-label">{dashboardData.revenue.target.toLocaleString()}</span>
              </div>
            </div>
          </div>
          
          <div className="chart-container">
            {/* Simplified representation of the line chart */}
            <div className="y-axis">
              <span>20,000</span>
              <span>15,000</span>
              <span>10,000</span>
              <span>5,000</span>
              <span>0</span>
            </div>
            <div className="chart-area">
              <div className="line-chart">
                <div className="chart-peak">$18,542</div>
                <svg className="curve" width="100%" height="150" viewBox="0 0 900 150">
                  <path d="M0,130 C50,120 100,80 150,100 C200,120 250,60 300,80 C350,100 400,40 450,20 C500,0 550,80 600,50 C650,20 700,120 750,80 C800,40 850,90 900,70" 
                        fill="none" stroke="var(--tertiary-color)" strokeWidth="3"/>
                </svg>
              </div>
              <div className="x-axis">
                {months.map((month, index) => (
                  <span key={index}>{month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Total Sales Chart */}
        <div className="total-sales">
          <h3>Total sales</h3>
          <div className="donut-chart-container">
            <div className="donut-chart">
              <div className="donut-inner">
                <span className="donut-value">$ {dashboardData.totalSales}</span>
                <span className="donut-label">Affiliate</span>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item">
                <span className="legend-color direct"></span>
                <span className="legend-label">Direct</span>
              </div>
              <div className="legend-item">
                <span className="legend-color affiliate"></span>
                <span className="legend-label">Affiliate</span>
              </div>
              <div className="legend-item">
                <span className="legend-color online"></span>
                <span className="legend-label">Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tables-container">
        <div className="tabs">
          <button 
            className={`tab ${activeTab === 'top-selling' ? 'active' : ''}`}
            onClick={() => setActiveTab('top-selling')}
          >
            Top Selling Products
          </button>
          <button 
            className={`tab ${activeTab === 'out-of-stock' ? 'active' : ''}`}
            onClick={() => setActiveTab('out-of-stock')}
          >
            Out of Stock Products
          </button>
          
          <button className="export-button">Export <span>↑</span></button>
        </div>
        
        <div className="table-content">
          {activeTab === 'top-selling' && (
            <table className="data-table">
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
                {dashboardData.topSellingProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.date}</td>
                    <td>${product.price}</td>
                    <td>{product.quantity}</td>
                    <td>${product.amount.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          
          {activeTab === 'out-of-stock' && (
            <table className="data-table">
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
                {dashboardData.outOfStockProducts.map((product, index) => (
                  <tr key={index}>
                    <td>{product.name}</td>
                    <td>{product.sku}</td>
                    <td>{product.lastStocked}</td>
                    <td>${product.price}</td>
                    <td>{product.supplier}</td>
                    <td>
                      <button className="restock-button">
                        <CartIcon /> Restock
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}