"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "@/app/styles/checkout.module.css";
import { useCartStore } from "@/app/store/Cart";
import { toast } from "sonner";

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, loading, checkout } = useCartStore();
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Customer information state
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle payment method selection
  const handlePaymentMethodChange = (e) => {
    setPaymentMethod(e.target.value);
  };

  // Handle checkout submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!customerInfo.name || !customerInfo.phone) {
      toast.error("Please provide at least your name and phone number");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const result = await checkout(paymentMethod, customerInfo);
      
      if (result.success) {
        toast.success("Checkout completed successfully!");
        router.push(`/order-confirmation?saleId=${result.data.saleId}`);
      } else {
        // Handle unavailable items
        if (result.unavailableItems && result.unavailableItems.length > 0) {
          const itemsList = result.unavailableItems
            .map(item => `${item.name} (requested: ${item.requested}, available: ${item.available})`)
            .join(", ");
          
          toast.error(`Some items are no longer available: ${itemsList}`);
        } else {
          toast.error(result.message || "Failed to complete checkout");
        }
      }
    } catch (error) {
      toast.error("An error occurred during checkout");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Calculate cart totals
  const subtotal = cart?.subtotal || 0;
  const discount = cart?.discount || 0;
  const total = cart?.total || 0;

  // Redirect if cart is empty
  if (!loading && (!cart || !cart.items || cart.items.length === 0)) {
    return (
      <div className={styles.emptyCartMessage}>
        <h2>Your cart is empty</h2>
        <button 
          className={styles.returnToShopBtn}
          onClick={() => router.push("/products")}
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className={styles.checkoutContainer}>
      <h1 className={styles.pageTitle}>Checkout</h1>
      
      <div className={styles.checkoutLayout}>
        <div className={styles.customerInfoSection}>
          <h2>Customer Information</h2>
          <form onSubmit={handleSubmit} className={styles.checkoutForm}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={customerInfo.name}
                onChange={handleInputChange}
                required
                placeholder="Enter your full name"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={customerInfo.email}
                onChange={handleInputChange}
                placeholder="Enter your email address"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="phone">Phone *</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={customerInfo.phone}
                onChange={handleInputChange}
                required
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className={styles.formGroup}>
              <label htmlFor="address">Shipping Address</label>
              <textarea
                id="address"
                name="address"
                value={customerInfo.address}
                onChange={handleInputChange}
                placeholder="Enter your shipping address"
                rows={3}
              />
            </div>
            
            <div className={styles.formGroup}>
              <label>Payment Method</label>
              <div className={styles.paymentOptions}>
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={handlePaymentMethodChange}
                  />
                  <span>Cash</span>
                </label>
                
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="card"
                    checked={paymentMethod === "card"}
                    onChange={handlePaymentMethodChange}
                  />
                  <span>Credit/Debit Card</span>
                </label>
                
                <label className={styles.paymentOption}>
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === "bank"}
                    onChange={handlePaymentMethodChange}
                  />
                  <span>Bank Transfer</span>
                </label>
              </div>
            </div>
            
            <div className={styles.formActions}>
              <button
                type="button"
                className={styles.backButton}
                onClick={() => router.push("/cart")}
              >
                Back to Cart
              </button>
              
              <button
                type="submit"
                className={styles.checkoutButton}
                disabled={isSubmitting || loading}
              >
                {isSubmitting ? "Processing..." : "Complete Purchase"}
              </button>
            </div>
          </form>
        </div>
        
        <div className={styles.orderSummary}>
          <h2>Order Summary</h2>
          <div className={styles.orderItems}>
            {cart?.items?.map(item => (
              <div key={item._id} className={styles.orderItem}>
                <div className={styles.itemInfo}>
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemQuantity}>x{item.quantity}</span>
                </div>
                <span className={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className={styles.orderTotals}>
            <div className={styles.totalRow}>
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className={styles.totalRow}>
              <span>Discount</span>
              <span>${discount.toFixed(2)}</span>
            </div>
            <div className={`${styles.totalRow} ${styles.finalTotal}`}>
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}