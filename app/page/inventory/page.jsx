"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import debounce from "lodash.debounce";
import { IoAdd } from "react-icons/io5";
import Filter from "@/app/components/Filter";
import Nothing from "@/app/components/Nothing";
import ProductCard from "@/app/components/cards/ProductCard";
import styles from "@/app/styles/inventory.module.css";
import EmptyProductImg from "@/public/assets/empty.png";

export default function Inventory() {
  const emptyCardCount = 20;
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const productsData = useMemo(
    () => [
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
        qrCode:
          "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
        expiryDate: null,
        storageLocation: "Aisle 5, Shelf 3",
        description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
      },

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
        qrCode:
          "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
        expiryDate: null,
        storageLocation: "Aisle 5, Shelf 3",
        description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
      },
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
        qrCode:
          "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
        expiryDate: null,
        storageLocation: "Aisle 5, Shelf 3",
        description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
      },
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
        qrCode:
          "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
        expiryDate: null,
        storageLocation: "Aisle 5, Shelf 3",
        description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
      },
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
        qrCode:
          "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
        expiryDate: null,
        storageLocation: "Aisle 5, Shelf 3",
        description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
      },
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
        qrCode:
          "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
        expiryDate: null,
        storageLocation: "Aisle 5, Shelf 3",
        description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
      },
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
        qrCode:
          "https://i.postimg.cc/nrhgf11z/Screenshot-2025-03-09-081740.png",
        expiryDate: null,
        storageLocation: "Aisle 5, Shelf 3",
        description: "Noise-canceling wireless headphones with Bluetooth 5.0.",
      },
    ],
    []
  );

  const filterOptions = useMemo(() => {
    const categories = [
      ...new Set(productsData.map((product) => product.category)),
    ];
    return [
      { value: "all", label: "All" },
      ...categories.map((cat) => ({
        value: cat,
        label: cat.charAt(0).toUpperCase() + cat.slice(1),
      })),
    ];
  }, [productsData]);

  const filterKey = searchParams.get("filter") || "all";
  const [selectedFilter, setSelectedFilter] = useState(filterKey);

  useEffect(() => {
    setSelectedFilter(filterKey);
  }, [filterKey]);

  const filteredProducts = useMemo(() => {
    return productsData.filter(
      (product) =>
        selectedFilter === "all" ||
        product.category.toLowerCase() === selectedFilter
    );
  }, [productsData, selectedFilter]);

  const updateQueryParams = useMemo(
    () =>
      debounce((filterValue) => {
        const params = new URLSearchParams(searchParams);
        if (filterValue && filterValue !== "all") {
          params.set("filter", filterValue);
        } else {
          params.delete("filter");
        }
        router.replace(`${pathname}?${params.toString()}`);
      }, 300),
    [searchParams, router, pathname]
  );

  useEffect(() => {
    updateQueryParams(selectedFilter);
    return () => updateQueryParams.cancel();
  }, [selectedFilter, updateQueryParams]);

  const renderEmptyCards = () =>
    Array(emptyCardCount)
      .fill(0)
      .map((_, index) => (
        <div
          className={`${styles.emptyCard} skeleton`}
          key={`empty-${index}`}
        />
      ));

  const addProduct = () => router.push("inventory/add", { scroll: false });

  const handleCardClick = (id) => {
    router.push(`${pathname}/${id}`, { scroll: false });
  };

  const shouldShowNothing = filteredProducts.length === 0;

  return (
    <div className={styles.inventoryContainer}>
      <div className={styles.inventoryNavbar}>
        <h1>Products</h1>
        <div className={styles.inventoryNavBtnWrapper}>
          <button className={styles.inventoryNavBtn} onClick={addProduct}>
            <IoAdd className={styles.addIcon} />
            <span> Add Product</span>
          </button>
          <Filter
            options={filterOptions}
            onSelect={setSelectedFilter}
            dropPlaceHolder="Filter by"
            value={selectedFilter}
          />
        </div>
      </div>
      <div className={styles.mainContent}>
        {shouldShowNothing ? (
          <Nothing
            Alt="No product found"
            NothingImage={EmptyProductImg}
            Text="No products available"
          />
        ) : (
          <div className={styles.content}>
            {filteredProducts.map((data) => (
              <ProductCard
                key={data._id}
                {...data}
                onClick={() => handleCardClick(data._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
