"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import styles from "@/app/styles/receipt.module.css";
import { useRouter } from "next/navigation";
import { BsCartPlus as CartIcon } from "react-icons/bs";
import { FaCheckCircle, FaPrint, FaDownload, FaHome, FaTimes } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export function CheckoutReceipt({ orderData, customerInfo, onClose }) {
  const [showReceipt, setShowReceipt] = useState(true);
  const receiptRef = useRef(null);
  const router = useRouter();
  
  const formatDate = (date) => {
    const d = new Date(date || Date.now());
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  const handlePrint = () => {
    const printContent = receiptRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <html>
        <head>
          <title>Purchase Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .receipt-container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .receipt-header { text-align: center; margin-bottom: 20px; }
            .receipt-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .receipt-items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .receipt-items th, .receipt-items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .receipt-total { display: flex; flex-direction: column; align-items: flex-end; }
            .total-row { display: flex; justify-content: space-between; width: 200px; }
            .final-total { font-weight: bold; border-top: 1px solid #000; padding-top: 5px; }
          </style>
        </head>
        <body>
          <div class="receipt-container">
            ${printContent}
          </div>
        </body>
      </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
  };
  
  const handleDownload = () => {
    const receiptContent = receiptRef.current.outerHTML;
    const blob = new Blob([`
      <html>
        <head>
          <title>Purchase Receipt</title>
          <style>
            body { font-family: Arial, sans-serif; color: #333; }
            .receipt-container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .receipt-header { text-align: center; margin-bottom: 20px; }
            .receipt-info { display: flex; justify-content: space-between; margin-bottom: 20px; }
            .receipt-items { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .receipt-items th, .receipt-items td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .receipt-total { display: flex; flex-direction: column; align-items: flex-end; }
            .total-row { display: flex; justify-content: space-between; width: 200px; }
            .final-total { font-weight: bold; border-top: 1px solid #000; padding-top: 5px; }
          </style>
        </head>
        <body>
          ${receiptContent}
        </body>
      </html>
    `], { type: 'text/html' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `receipt-${orderData.reportId}.html`;
    link.click();
  };
  

  
  const handleContinueShopping = () => {
    setShowReceipt(false);
    if (onClose) {
      onClose();
      router.push('/page/inventory');
    }
  };
  
  if (!showReceipt) return null;
  
  return (
    <div className={styles.receiptOverlay}>
      <div className={styles.receiptContainer}>
      
        
        <div className={styles.receiptHeader}>
          <div className={styles.successIcon}>
            <FaCheckCircle />
          </div>
          <h1>Thank You for Your Purchase!</h1>
          <p>Your order has been successfully placed.</p>
        </div>
        
        <div className={styles.receiptContent} ref={receiptRef}>
          <div className={styles.receiptTitle}>
            <h2>Purchase Receipt</h2>
            <div className={styles.receiptMeta}>
              <p><strong>Order ID:</strong> {orderData.reportId}</p>
              <p><strong>Date:</strong> {formatDate()}</p>
            </div>
          </div>
          
          <div className={styles.receiptInfo}>
            <div className={styles.customerInfo}>
              <h3>Customer Information</h3>
              <p><strong>Name:</strong> {customerInfo.name}</p>
              {customerInfo.email && <p><strong>Email:</strong> {customerInfo.email}</p>}
              {customerInfo.phone && <p><strong>Phone:</strong> {customerInfo.phone}</p>}
              {customerInfo.address && (
                <div>
                  <p><strong>Shipping Address:</strong></p>
                  <p>{customerInfo.address}</p>
                </div>
              )}
            </div>
            
            <div className={styles.paymentInfo}>
              <h3>Payment Information</h3>
              <p><strong>Payment Method:</strong> {customerInfo.paymentMethod?.charAt(0).toUpperCase() + customerInfo.paymentMethod?.slice(1)}</p>
              <p><strong>Payment Status:</strong> <span className={styles.paidStatus}>Paid</span></p>
            </div>
          </div>
          
          <div className={styles.receiptItemsContainer}>
            <h3>Order Summary</h3>
            <table className={styles.receiptItems}>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity</th>
                  <th>Unit Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderData.items.map((item, index) => (
                  <tr key={index}>
                    <td className={styles.itemCell}>
                      <div className={styles.itemInfo}>
                        {item.image && (
                          <div className={styles.itemImageWrapper}>
                            <Image
                              src={item.image}
                              width={40}
                              height={40}
                              alt={item.name}
                              className={styles.itemImage}
                            />
                          </div>
                        )}
                        <div>
                          <span className={styles.itemName}>{item.name}</span>
                          <span className={styles.itemId}>ID: {item.productID}</span>
                        </div>
                      </div>
                    </td>
                    <td>{item.quantity} {item.unit}</td>
                    <td>${(item.price).toLocaleString()}</td>
                    <td>${(item.price * item.quantity).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className={styles.receiptTotal}>
            <div className={styles.totalRow}>
              <span>Subtotal:</span>
              <span>${orderData.subtotal.toLocaleString()}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Discount:</span>
              <span>${orderData.discount.toLocaleString()}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
              <span>Total:</span>
              <span>${orderData.total.toLocaleString()}</span>
            </div>
          </div>
          
          <div className={styles.receiptFooter}>
            <p>Thank you for your business!</p>
            <p className={styles.receiptNote}>Keep this receipt for your records. For any questions or concerns regarding your order, please contact our customer support.</p>
          </div>
        </div>
        
        <div className={styles.receiptActions}>
          <button className={styles.actionButton} onClick={handlePrint}>
            <FaPrint /> Print Receipt
          </button>
          <button className={styles.actionButton} onClick={handleDownload}>
            <FaDownload /> Download
          </button>
          <button className={styles.continueButton} onClick={handleContinueShopping}>
            <FaHome /> Continue Shopping
          </button>
        </div>
      </div>
    </div>
  );
}