"use client";

import { useState } from "react";
import Image from "next/image";
import { BsCartPlus as CartIcon } from "react-icons/bs";
import { FaTrashAlt as DeleteIcon } from "react-icons/fa";
import { FiFilter as FilterIcon } from "react-icons/fi";

export default function Sales() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;
  const totalPages = Math.ceil(salesData.length / itemsPerPage);
  
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = salesData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const handleDelete = (id) => {
    console.log(`Deleting product with id: ${id}`);
  };

  const addToCart = (e) => {
    e.stopPropagation();
    console.log("Product added to cart");
  };

  return (
    <div className="salesContainer">
      {/* Sales Overview Summary */}
      <div className="overviewSummary">
        <h1>Sales Overview</h1>
        
        <div className="summaryCards">
          <div className="summaryCard">
            <h2 className="summaryTitle">Total Sales</h2>
            <div className="summaryValue">37</div>
            <div className="summaryPeriod">Last 7 days</div>
          </div>
          
          <div className="summaryCard">
            <h2 className="summaryTitle">Total Received</h2>
            <div className="summaryValue">32</div>
            <div className="summaryPeriod">Last 7 days</div>
            <div className="summaryLabel">Revenue</div>
          </div>
          
          <div className="summaryCard">
            <h2 className="summaryTitle">Total Returned</h2>
            <div className="summaryValue">5</div>
            <div className="summaryPeriod">Last 7 days</div>
          </div>
          
          <div className="summaryCard">
            <h2 className="summaryTitle">&nbsp;</h2>
            <div className="summaryValue">$2500</div>
            <div className="summaryPeriod">Cost</div>
          </div>
        </div>
      </div>

      {/* Sales Detail Table */}
      <div className="salesTableContainer">
        <div className="tableHeader">
          <h1>Sales Overview</h1>
          <button className="filterBtn">
            <FilterIcon className="filterIcon" />
            <span>Filters by date</span>
          </button>
        </div>
        
        <div className="tableContainer">
          <div className="tableContainerInner">
            <table className="salesTable">
              <thead>
                <tr>
                  <th>Total Sales</th>
                  <th>Purchase date</th>
                  <th>Total Received</th>
                  <th>Status</th>
                  <th>Total Returned</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {salesData.map((sale, index) => (
                  <tr key={index}>
                    <td>
                      <div className="salesInfo">
                        <span className="salesID">{sale.id}</span>
                        <span className="salesPeriod">{sale.period}</span>
                      </div>
                    </td>
                    <td>{sale.purchaseDate}</td>
                    <td>
                      <div className="salesInfo">
                        <span className="salesValue">{sale.received}</span>
                        <span className="salesPeriod">{sale.receivedPeriod}</span>
                      </div>
                    </td>
                    <td>
                      <span className={`statusBadge ${sale.status.toLowerCase()}`}>
                        {sale.status}
                      </span>
                    </td>
                    <td>
                      <div className="salesInfo">
                        <span className="salesValue">{sale.returned}</span>
                        <span className="salesPeriod">{sale.returnedPeriod}</span>
                      </div>
                    </td>
                    <td className="actionButtons">
                      <button className="viewBtn">View</button>
                      <button className="reportBtn">Report</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="tableFooter">
            <button 
              className="paginationBtn"
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              Previous
            </button>
            <div className="pageInfo">
              Page {currentPage} of {totalPages}
            </div>
            <button 
              className="paginationBtn"
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              Next
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .salesContainer {
          padding: 24px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        /* Sales Overview Summary Styles */
        .overviewSummary {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 24px;
          margin-bottom: 24px;
        }
        
        .overviewSummary h1 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0 0 20px 0;
        }
        
        .summaryCards {
          display: flex;
          gap: 24px;
        }
        
        .summaryCard {
          flex: 1;
        }
        
        .summaryTitle {
          font-size: 14px;
          font-weight: 500;
          color: #3b82f6;
          margin: 0 0 8px 0;
        }
        
        .summaryValue {
          font-size: 24px;
          font-weight: 600;
          color: #111827;
          margin-bottom: 4px;
        }
        
        .summaryPeriod, .summaryLabel {
          font-size: 12px;
          color: #6b7280;
        }
        
        /* Sales Table Styles */
        .salesTableContainer {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 24px;
          margin-bottom: 24px;
        }
        
        .tableHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
        }
        
        .tableHeader h1 {
          font-size: 18px;
          font-weight: 600;
          color: #333;
          margin: 0;
        }
        
        .filterBtn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #fff;
          color: #6b7280;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .filterBtn:hover {
          background-color: #f9fafb;
        }
        
        .filterIcon {
          font-size: 16px;
        }
        
        .tableContainer {
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .tableContainerInner {
          overflow-x: auto;
        }
        
        .salesTable {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        
        .salesTable thead {
          background-color: #f9fafb;
        }
        
        .salesTable th {
          text-align: left;
          padding: 16px;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .salesTable td {
          padding: 16px;
          color: #333;
          border-bottom: 1px solid #e5e7eb;
        }
        
        .salesInfo {
          display: flex;
          flex-direction: column;
        }
        
        .salesID, .salesValue {
          font-weight: 500;
          color: #111827;
        }
        
        .salesPeriod {
          font-size: 12px;
          color: #6b7280;
        }
        
        .statusBadge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 4px;
          font-size: 13px;
          font-weight: 500;
        }
        
        .statusBadge.sold {
          background-color: #e6f7ff;
          color: #0369a1;
        }
        
        .statusBadge.returned {
          background-color: #fef2f2;
          color: #ef4444;
        }
        
        .actionButtons {
          display: flex;
          gap: 8px;
        }
        
        .viewBtn, .reportBtn {
          padding: 6px 12px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .viewBtn {
          background-color: #3b82f6;
          color: white;
          border: none;
        }
        
        .viewBtn:hover {
          background-color: #2563eb;
        }
        
        .reportBtn {
          background-color: #10b981;
          color: white;
          border: none;
        }
        
        .reportBtn:hover {
          background-color: #059669;
        }
        
        .tableFooter {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 16px;
          background-color: #f9fafb;
          border-top: 1px solid #e5e7eb;
        }
        
        .pageInfo {
          margin: 0 16px;
          font-size: 14px;
          color: #6b7280;
        }
        
        .paginationBtn {
          background-color: white;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: #374151;
          cursor: pointer;
          transition: all 0.2s;
        }
        
        .paginationBtn:hover:not(:disabled) {
          background-color: #f3f4f6;
        }
        
        .paginationBtn:disabled {
          background-color: #f3f4f6;
          color: #9ca3af;
          cursor: not-allowed;
        }
        
        /* Product Table Styles */
        .cartContainer {
          background-color: #fff;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          padding: 24px;
          margin-bottom: 24px;
        }
        
        .inventoryNavBtn {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #5f6caf;
          color: white;
          border: none;
          border-radius: 6px;
          padding: 10px 16px;
          font-size: 14px;
          font-weight: 500;
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        .inventoryNavBtn:hover {
          background-color: #4a56a0;
        }
        
        .addIcon {
          font-size: 16px;
        }
        
        .productTable {
          width: 100%;
          border-collapse: collapse;
          font-size: 14px;
        }
        
        .productTable thead {
          background-color: #f8f9fb;
        }
        
        .productTable th {
          text-align: left;
          padding: 16px;
          font-weight: 600;
          color: #6b7280;
          border-bottom: 1px solid #eaedf3;
        }
        
        .productTable td {
          padding: 16px;
          color: #333;
          border-bottom: 1px solid #eaedf3;
        }
        
        .productCell {
          min-width: 220px;
        }
        
        .productInfo {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .productImageWrapper {
          width: 35px;
          height: 35px;
          border-radius: 6px;
          overflow: hidden;
          background-color: #f3f4f6;
        }
        
        .productImage {
          object-fit: cover;
        }
        
        .productName {
          font-weight: 500;
        }
        
        .deleteBtn {
          background: none;
          border: none;
          color: #9ca3af;
          cursor: pointer;
          padding: 6px;
          border-radius: 4px;
          transition: background-color 0.2s, color 0.2s;
        }
        
        .deleteBtn:hover {
          background-color: #fee2e2;
          color: #ef4444;
        }
        
        .deleteIcon {
          font-size: 16px;
        }
        
        .noData {
          text-align: center;
          color: #6b7280;
          padding: 32px 0;
        }
      `}</style>
    </div>
  );
}

// Sample data for sales table
const salesData = [
  {
    id: "37",
    subId: "9798",
    period: "Last 7 days",
    purchaseDate: "11/12/22",
    received: "32",
    receivedPeriod: "Last 7 days",
    status: "Sold",
    returned: "5",
    returnedPeriod: "Last 7 days",
    cost: "$2500"
  },
  {
    id: "5724",
    period: "",
    purchaseDate: "21/12/22",
    received: "",
    receivedPeriod: "",
    status: "Sold",
    returned: "",
    returnedPeriod: "",
    cost: ""
  },
  {
    id: "2775",
    period: "",
    purchaseDate: "5/12/22",
    received: "",
    receivedPeriod: "",
    status: "Returned",
    returned: "",
    returnedPeriod: "",
    cost: ""
  },
  {
    id: "2275",
    period: "",
    purchaseDate: "8/12/22",
    received: "",
    receivedPeriod: "",
    status: "Sold",
    returned: "",
    returnedPeriod: "",
    cost: ""
  }
];

// Sample data for product table
const productData = [
  {
    _id: "1",
    image: "https://iili.io/3fTdjLb.jpg",
    name: "Tires",
    productID: "WH-123",
    sellingPrice: 80,
    quantity: 100,
    unit: "pcs",
  }
];