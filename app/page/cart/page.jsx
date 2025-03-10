"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "@/app/styles/cart.module.css";
import { usePathname, useRouter } from "next/navigation";
import { BsCartPlus as CartIcon } from "react-icons/bs";
import { FaTrashAlt as DeleteIcon } from "react-icons/fa";

const itemsPerPage = 7;

const tableData = [
  {
    _id: "1",
    image: "https://iili.io/3fTdjLb.jpg",
    name: "Tires",
    productID: "WH-123",
    category: "tires",
    buyingPrice: 50,
    sellingPrice: 80,
    quantity: 100,
    unit: "pcs",
    supplierName: "Tech Suppliers Ltd.",
    supplierContact: "techsuppliers@example.com",
    reorderLevel: 10,
    maxStock: 200,
    qrCode: "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
    expiryDate: null,
    storageLocation: "Aisle 5, Shelf 3",
    description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
  },
  {
    _id: "2",
    image: "https://iili.io/3fTdjLb.jpg",
    name: "Tires",
    productID: "WH-123",
    category: "tires",
    buyingPrice: 50,
    sellingPrice: 80,
    quantity: 100,
    unit: "pcs",
    supplierName: "Tech Suppliers Ltd.",
    supplierContact: "techsuppliers@example.com",
    reorderLevel: 10,
    maxStock: 200,
    qrCode: "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
    expiryDate: null,
    storageLocation: "Aisle 5, Shelf 3",
    description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
  },
  {
    _id: "3",
    image: "https://iili.io/3fTdjLb.jpg",
    name: "Tires",
    productID: "WH-123",
    category: "tires",
    buyingPrice: 50,
    sellingPrice: 80,
    quantity: 100,
    unit: "pcs",
    supplierName: "Tech Suppliers Ltd.",
    supplierContact: "techsuppliers@example.com",
    reorderLevel: 10,
    maxStock: 200,
    qrCode: "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
    expiryDate: null,
    storageLocation: "Aisle 5, Shelf 3",
    description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
  },
  {
    _id: "4",
    image: "https://iili.io/3fTdjLb.jpg",
    name: "Tires",
    productID: "WH-123",
    category: "tires",
    buyingPrice: 50,
    sellingPrice: 80,
    quantity: 100,
    unit: "pcs",
    supplierName: "Tech Suppliers Ltd.",
    supplierContact: "techsuppliers@example.com",
    reorderLevel: 10,
    maxStock: 200,
    qrCode: "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
    expiryDate: null,
    storageLocation: "Aisle 5, Shelf 3",
    description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
  },
  {
    _id: "5",
    image: "https://iili.io/3fTdjLb.jpg",
    name: "Tires",
    productID: "WH-123",
    category: "tires",
    buyingPrice: 50,
    sellingPrice: 80,
    quantity: 100,
    unit: "pcs",
    supplierName: "Tech Suppliers Ltd.",
    supplierContact: "techsuppliers@example.com",
    reorderLevel: 10,
    maxStock: 200,
    qrCode: "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
    expiryDate: null,
    storageLocation: "Aisle 5, Shelf 3",
    description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
  },
  {
    _id: "6",
    image: "https://iili.io/3fTdjLb.jpg",
    name: "Tires",
    productID: "WH-123",
    category: "tires",
    buyingPrice: 50,
    sellingPrice: 80,
    quantity: 100,
    unit: "pcs",
    supplierName: "Tech Suppliers Ltd.",
    supplierContact: "techsuppliers@example.com",
    reorderLevel: 10,
    maxStock: 200,
    qrCode: "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
    expiryDate: null,
    storageLocation: "Aisle 5, Shelf 3",
    description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
  },
  {
    _id: "7",
    image: "https://iili.io/3fTdjLb.jpg",
    name: "Tires",
    productID: "WH-123",
    category: "tires",
    buyingPrice: 50,
    sellingPrice: 80,
    quantity: 100,
    unit: "pcs",
    supplierName: "Tech Suppliers Ltd.",
    supplierContact: "techsuppliers@example.com",
    reorderLevel: 10,
    maxStock: 200,
    qrCode: "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
    expiryDate: null,
    storageLocation: "Aisle 5, Shelf 3",
    description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
  },
  {
    _id: "8",
    image: "https://iili.io/3fTdjLb.jpg",
    name: "Tires",
    productID: "WH-123",
    category: "tires",
    buyingPrice: 50,
    sellingPrice: 80,
    quantity: 100,
    unit: "pcs",
    supplierName: "Tech Suppliers Ltd.",
    supplierContact: "techsuppliers@example.com",
    reorderLevel: 10,
    maxStock: 200,
    qrCode: "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
    expiryDate: null,
    storageLocation: "Aisle 5, Shelf 3",
    description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
  },
];

export default function TableComponent() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const openMore = (id) => {
    router.push(`tenants/tenant/${id}`);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tableData.slice(startIndex, endIndex);

  const totalPages = Math.ceil(tableData.length / itemsPerPage);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const addToCart = (e) => {
    e.stopPropagation();

    // Since toast is not defined in the original code, let's assume it's imported
    // We would add: import { toast } from 'react-toastify'; at the top

    // For demo purposes, we'll use a sample product
    const sampleProduct = tableData[0];
    const { _id, productID, name, sellingPrice, image, quantity, unit } =
      sampleProduct;
    const orderQuantity = 1; // Default order quantity

    if (quantity <= 0) {
      console.error("Product is out of stock");
      // toast.error("Product is out of stock");
      return;
    }

    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = existingCart.findIndex(
      (item) => item.productID === productID
    );

    if (existingProductIndex > -1) {
      existingCart[existingProductIndex].quantity += orderQuantity;
    } else {
      existingCart.push({
        _id: _id,
        productID: productID,
        name: name,
        price: sellingPrice,
        image: image,
        quantity: orderQuantity,
        unit: unit || "pcs",
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    setAddedToCart(true);
    console.log("Product added to cart");
    // toast.success("Product added to cart");

    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  const handleDelete = (id) => {
    // Implement delete functionality
    console.log(`Deleting product with id: ${id}`);
    // In a real app, you would update the tableData state
  };

  return (
    <div className={styles.cartContainer}>
      <div className={styles.tableHeader}>
        <h1>Carts</h1>
        <button className={styles.inventoryNavBtn} onClick={addToCart}>
          <CartIcon className={styles.addIcon} />
          <span>Checkout</span>
        </button>
      </div>
      <div className={styles.tableContainer}>
        <div className={styles.tableContainerInner}>
          <table className={styles.productTable}>
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentData.length > 0 ? (
                currentData.map((data, index) => (
                  <tr key={index}>
                    <td className={styles.productCell}>
                      <div className={styles.productInfo}>
                        <div className={styles.productImageWrapper}>
                          <Image
                            src={data.image}
                            height={35}
                            width={35}
                            alt="product image"
                            priority
                            className={styles.productImage}
                          />
                        </div>
                        <span className={styles.productName}>{data.name}</span>
                      </div>
                    </td>
                    <td>${data.sellingPrice.toFixed(2)}</td>
                    <td>
                      {data.quantity} {data.unit}
                    </td>
                    <td>
                      <button
                        className={styles.deleteBtn}
                        onClick={() => handleDelete(data._id)}
                        aria-label="Delete product"
                      >
                        <DeleteIcon className={styles.deleteIcon} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className={styles.noData}>
                    No products available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className={styles.tableFooter}>
          <h2>
            Page {currentPage} of {totalPages}
          </h2>
          <div className={styles.tableFooterBtnContain}>
            <button
              className={styles.tableFooterBtn}
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <button
              className={styles.tableFooterBtn}
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
