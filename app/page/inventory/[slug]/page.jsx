"use client";

import Image from "next/image";
import { toast } from "sonner";
import { useState } from "react";
import { MdOutlineEdit as EditIcon } from "react-icons/md";
import { useParams, useRouter } from "next/navigation";
import {
  IoIosArrowBack as BackArrow,
  IoMdAdd as AddIcon,
  IoIosRemove as RemoveIcon,
} from "react-icons/io";
import { FiDownload as DownloadIcon } from "react-icons/fi";
import { BsCartPlus as CartIcon } from "react-icons/bs";
import styles from "@/app/styles/singleProductCard.module.css";

export default function Inventory() {
  const router = useRouter();
  const { slug } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  const productsData = [
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
      description: "High-quality rubber tires for vehicles.",
      weight: "10kg",
      color: "Black",
    },
    {
      _id: "2",
      image: "https://iili.io/3fTdjLb.jpg",
      name: "Brakes",
      productID: "BK-456",
      category: "brakes",
      buyingPrice: 70,
      sellingPrice: 120,
      quantity: 50,
      unit: "pcs",
      supplierName: "Auto Parts Ltd.",
      supplierContact: "autoparts@example.com",
      reorderLevel: 5,
      maxStock: 100,
      qrCode: "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
      storageLocation: "Aisle 2, Shelf 1",
      description: "Durable disc brakes for modern vehicles.",
      warranty: "2 years",
    },
  ];

  const product = productsData.find((item) => item._id === slug);

  const editProduct = () => router.push(`edit/${slug}`);
  const goBack = () => router.back();

  const downloadQRCode = () => {
    if (!product.qrCode) return;

    const link = document.createElement("a");
    link.href = product.qrCode;
    link.download = `${product.name.replace(/\s+/g, "-")}_${
      product.productID
    }_QRCode.png`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const addToCart = () => {
    const existingCart = JSON.parse(localStorage.getItem("cart") || "[]");
    const existingProductIndex = existingCart.findIndex(
      (item) => item.productID === product.productID
    );

    if (existingProductIndex > -1) {
      existingCart[existingProductIndex].quantity += quantity;
    } else {
      existingCart.push({
        _id: product._id,
        productID: product.productID,
        name: product.name,
        price: product.sellingPrice,
        image: product.image,
        quantity: quantity,
        unit: product.unit || "pcs",
      });
    }

    localStorage.setItem("cart", JSON.stringify(existingCart));

    setAddedToCart(true);
    toast.success("Product added to cart");

    setTimeout(() => {
      setAddedToCart(false);
    }, 3000);
  };

  if (product.quantity === 0) {
    toast.error("Product is out of stock");
  }

  const standardFields = [
    { label: "Category", key: "category" },
    { label: "Product ID", key: "productID" },
    { label: "Selling Price", key: "sellingPrice", format: (val) => `$${val}` },
    {
      label: "Quantity",
      key: "quantity",
      format: (val) => `${val} ${product.unit || ""}`,
    },
    { label: "Supplier", key: "supplierName" },
    { label: "Supplier Contact", key: "supplierContact" },
    { label: "Storage Location", key: "storageLocation" },
    { label: "Description", key: "description" },
  ];

  return (
    <div className={styles.mainContent}>
      <div className={styles.singleBtnContainer}>
        <button onClick={goBack} className={styles.backButton}>
          <BackArrow
            className={styles.backButtonIcon}
            aria-label="back icon"
            alt="back icon"
          />
          <span>Go Back</span>
        </button>
        <button className={styles.inventoryNavBtn} onClick={downloadQRCode}>
          <DownloadIcon className={styles.downloadIcon} />
          <span>QR</span>
        </button>
        <button className={styles.inventoryNavBtn} onClick={editProduct}>
          <EditIcon
            className={styles.editIcon}
            aria-label="edit icon"
            alt="edit icon"
          />
          <span>Edit</span>
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.cardImage}>
          <Image
            className={styles.productImage}
            src={product.image}
            alt={product.name}
            fill
            sizes="100%"
            objectFit="contain"
            priority={true}
          />
          <div className={styles.productName}>
            <h2>{product.name}</h2>
          </div>
          <div className={styles.addToCartSection}>
            <div className={styles.quantityControls}>
              <button
                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                className={styles.quantityBtn}
              >
                <RemoveIcon
                  className={styles.quantityIcon}
                  aria-label="remove icon"
                  alt="remove icon"
                />
              </button>
              <input
                type="text"
                min="1"
                max={product.quantity}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(
                      product.quantity,
                      Math.max(1, parseInt(e.target.value) || 1)
                    )
                  )
                }
                className={styles.quantityInput}
              />
              <button
                onClick={() =>
                  setQuantity((prev) => Math.min(product.quantity, prev + 1))
                }
                className={styles.quantityBtn}
              >
                <AddIcon
                  className={styles.quantityIcon}
                  aria-label="add icon"
                  alt="add icon"
                />
              </button>
            </div>
            <button
              onClick={addToCart}
              className={styles.backButton}
              disabled={product.quantity <= 0}
            >
              <CartIcon
                className={styles.backButtonIcon}
                aria-label="cart icon"
                alt="cart icon"
              />
            </button>
          </div>
        </div>

        <div className={styles.cardBottom}>
          <div className={styles.productDetails}>
            {standardFields.map(({ label, key, format }) =>
              product[key] ? (
                <div className={styles.productDetailsInfo} key={key}>
                  <h1>{label}</h1>
                  <span>{format ? format(product[key]) : product[key]}</span>
                </div>
              ) : null
            )}

            {Object.entries(product).map(([key, value]) => {
              if (
                standardFields.some((field) => field.key === key) ||
                ["_id", "image", "qrCode", "unit"].includes(key)
              ) {
                return null;
              }

              return (
                <div className={styles.productDetailsInfo} key={key}>
                  <h1>
                    {key
                      .replace(/([A-Z])/g, " $1")
                      .replace(/^./, (str) => str.toUpperCase())}
                  </h1>
                  <span>{value}</span>
                </div>
              );
            })}
          </div>
          {product.qrCode && (
            <div className={styles.qrCode}>
              <Image
                src={product.qrCode}
                alt={`QR Code for ${product.name}`}
                width={100}
                height={100}
                className={styles.qrImage}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
