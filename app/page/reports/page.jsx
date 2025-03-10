"use client";

import { useState } from "react";
import { Line } from "recharts";
import { LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function Report() {
  const [timeframe, setTimeframe] = useState("Weekly");

  // Chart data
  const chartData = [
    { name: 'Sep', Revenue: 21000, Profit: 12000 },
    { name: 'Oct', Revenue: 38000, Profit: 23000 },
    { name: 'Nov', Revenue: 30000, Profit: 20000 },
    { name: 'Dec', Revenue: 45000, Profit: 30000 },
    { name: 'Jan', Revenue: 52000, Profit: 35000 },
    { name: 'Feb', Revenue: 42000, Profit: 28000 },
    { name: 'Mar', Revenue: 40000, Profit: 26000 },
  ];

  // Product data
  const productData = [
    { 
      product: "Hydraulic", 
      productId: "23567", 
      category: "Machine", 
      remainingQuantity: "225 kg",
      turnOver: "$17,000",
      increaseBy: "2.3%",
      increaseColor: "#10b981"
    },
    { 
      product: "Steering", 
      productId: "25831", 
      category: "Machine", 
      remainingQuantity: "200 kg",
      turnOver: "$12,000",
      increaseBy: "1.3%",
      increaseColor: "#10b981"
    },
    { 
      product: "Belt", 
      productId: "56841", 
      category: "Tool", 
      remainingQuantity: "",
      turnOver: "$10,000",
      increaseBy: "1.3%",
      increaseColor: "#10b981"
    },
    { 
      product: "Bearing", 
      productId: "23567", 
      category: "Spare parts", 
      remainingQuantity: "125 Packet",
      turnOver: "$9,000",
      increaseBy: "1%",
      increaseColor: "#10b981"
    },
  ];

  // Category data
  const categoryData = [
    { 
      category: "Machine", 
      turnOver: "$26,000", 
      increaseBy: "3.2%",
      increaseColor: "#10b981"
    },
    { 
      category: "Spare parts", 
      turnOver: "$22,000", 
      increaseBy: "2%",
      increaseColor: "#10b981"
    },
    { 
      category: "Tools", 
      turnOver: "$22,000", 
      increaseBy: "1.5%",
      increaseColor: "#10b981"
    },
  ];

  // Custom tooltip for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip">
          <p className="tooltip-label">{label}</p>
          <p className="tooltip-value">{payload[0].value.toLocaleString()}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="reportContainer">
      {/* Overview Section */}
      <div className="overviewSection">
        <div className="sectionHeader">
          <h2>Overview</h2>
        </div>
        <div className="overviewCards">
          <div className="overviewCard">
            <div className="cardValue">$21,190</div>
            <div className="cardLabel">Total Profit</div>
          </div>
          <div className="overviewCard">
            <div className="cardValue orange">$18,300</div>
            <div className="cardLabel orange">Revenue</div>
          </div>
          <div className="overviewCard">
            <div className="cardValue purple">$7,432</div>
            <div className="cardLabel purple">Sales</div>
          </div>
          <div className="overviewCard">
            <div className="cardValue">$117,432</div>
            <div className="cardLabel">Net purchase value</div>
          </div>
        </div>
        
      </div>

      {/* Chart Section */}
      <div className="chartSection">
        <div className="sectionHeader">
          <h2>Profit & Revenue</h2>
          <div className="timeframeToggle">
            <label className="timeframeLabel">
              <input
                type="checkbox"
                checked={timeframe === "Weekly"}
                onChange={() => setTimeframe(timeframe === "Weekly" ? "Monthly" : "Weekly")}
              />
              <span className="checkmark"></span>
              Weekly
            </label>
          </div>
        </div>
        <div className="chartContainer">
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                domain={[0, 'dataMax + 10000']}
                tickFormatter={(value) => `${value.toLocaleString()}`}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="Revenue"
                stroke="#3b82f6"
                dot={false}
                activeDot={{ r: 8, stroke: "#3b82f6", strokeWidth: 2, fill: "#fff" }}
                strokeWidth={3}
              />
              <Line
                type="monotone"
                dataKey="Profit"
                stroke="#a855f7"
                dot={false}
                activeDot={{ r: 8, stroke: "#a855f7", strokeWidth: 2, fill: "#fff" }}
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="chartLegend">
            <div className="legendItem">
              <div className="legendDot blue"></div>
              <span>Revenue</span>
            </div>
            <div className="legendItem">
              <div className="legendDot purple"></div>
              <span>Profit</span>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Categories */}
      <div className="tableSection">
        <div className="sectionHeader">
          <h2>Best selling category</h2>
        </div>
        <div className="tableContainer">
          <table className="dataTable">
            <thead>
              <tr>
                <th>Category</th>
                <th>Turn Over</th>
                <th>Increase By</th>
              </tr>
            </thead>
            <tbody>
              {categoryData.map((item, index) => (
                <tr key={index}>
                  <td>{item.category}</td>
                  <td>{item.turnOver}</td>
                  <td>
                    <span className="increaseValue" style={{ color: item.increaseColor }}>
                      {item.increaseBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="tableSection">
        <div className="sectionHeader">
          <h2>Best selling product</h2>
        </div>
        <div className="tableContainer">
          <table className="dataTable">
            <thead>
              <tr>
                <th>Product</th>
                <th>Product ID</th>
                <th>Category</th>
                <th>Remaining Quantity</th>
                <th>Turn Over</th>
                <th>Increase By</th>
              </tr>
            </thead>
            <tbody>
              {productData.map((item, index) => (
                <tr key={index}>
                  <td>{item.product}</td>
                  <td>{item.productId}</td>
                  <td>{item.category}</td>
                  <td>{item.remainingQuantity}</td>
                  <td>{item.turnOver}</td>
                  <td>
                    <span className="increaseValue" style={{ color: item.increaseColor }}>
                      {item.increaseBy}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        .reportContainer {
          padding: 10px;
          overflow: hidden;
          overflow-y: scroll; 
        }
        
        /* Common Section Styles */
        .overviewSection, .chartSection, .tableSection {
          background-color: #fff;
          border-radius: 8px;
          
          padding: 20px;
          margin-bottom: 24px;
        }
        
        .sectionHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 20px;
        }
        
        .sectionHeader h2 {
          font-size: 18px;
          font-weight: 600;
          color: #1f2937;
          margin: 0;
        }
        
        .seeAllLink {
          color: #3b82f6;
          font-size: 14px;
          text-decoration: none;
        }
        
        .seeAllLink:hover {
          text-decoration: underline;
        }
        
        /* Overview Section Styles */
        .overviewCards {
          display: flex;
          gap: 24px;
          margin-bottom: 20px;
        }
        
        .overviewCards.secondRow {
          margin-bottom: 0;
        }
        
        .overviewCard {
          flex: 1;
        }
        
        .cardValue {
          font-size: 20px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .cardValue.orange {
          color: #f59e0b;
        }
        
        .cardValue.purple {
          color: #8b5cf6;
        }
        
        .cardLabel {
          font-size: 14px;
          color: #6b7280;
        }
        
        .cardLabel.orange {
          color: #f59e0b;
        }
        
        .cardLabel.purple {
          color: #8b5cf6;
        }
        
        /* Chart Section Styles */
        .timeframeToggle {
          display: flex;
          align-items: center;
        }
        
        .timeframeLabel {
          display: flex;
          align-items: center;
          position: relative;
          padding-left: 24px;
          cursor: pointer;
          font-size: 14px;
          color: #6b7280;
        }
        
        .timeframeLabel input {
          position: absolute;
          opacity: 0;
          cursor: pointer;
          height: 0;
          width: 0;
        }
        
        .checkmark {
          position: absolute;
          left: 0;
          height: 18px;
          width: 18px;
          background-color: #fff;
          border: 1px solid #d1d5db;
          border-radius: 4px;
        }
        
        .timeframeLabel input:checked ~ .checkmark {
          background-color: #3b82f6;
          border-color: #3b82f6;
        }
        
        .checkmark:after {
          content: "";
          position: absolute;
          display: none;
        }
        
        .timeframeLabel input:checked ~ .checkmark:after {
          display: block;
          left: 6px;
          top: 2px;
          width: 5px;
          height: 10px;
          border: solid white;
          border-width: 0 2px 2px 0;
          transform: rotate(45deg);
        }
        
        .chartContainer {
          position: relative;
        }
        
        .custom-tooltip {
          background-color: #fff;
          border-radius: 8px;
          padding: 12px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          border: 1px solid #e5e7eb;
        }
        
        .tooltip-label {
          margin: 0 0 4px 0;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
        }
        
        .tooltip-value {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: #111827;
        }
        
        .chartLegend {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 16px;
        }
        
        .legendItem {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #6b7280;
        }
        
        .legendDot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
        }
        
        .legendDot.blue {
          background-color: #3b82f6;
        }
        
        .legendDot.purple {
          background-color: #a855f7;
        }
        
        /* Table Styles */
        .tableContainer {
          overflow-x: auto;
        }
        
        .dataTable {
          width: 100%;
          border-collapse: collapse;
        }
        
        .dataTable th {
          text-align: left;
          padding: 12px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .dataTable td {
          padding: 16px;
          font-size: 14px;
          color: #374151;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .increaseValue {
          color: #10b981;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}