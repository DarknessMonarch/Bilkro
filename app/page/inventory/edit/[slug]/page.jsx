"use client";

import { toast } from "sonner";
import Image from "next/image";
import styles from "@/app/styles/form.module.css";
import { useState, useRef, useEffect } from "react";
import { IoAdd, IoClose } from "react-icons/io5";
import { CiSaveUp2 as SaveIcon } from "react-icons/ci";
import { BsCameraFill as CameraIcon } from "react-icons/bs";
import { IoIosArrowBack as BackArrow } from "react-icons/io";
import FormDropdown from "@/app/components/Form/FormDropdown";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

const FileInput = ({ onChange, idImage, label, required }) => {
  const fileInputRef = useRef(null);

  const handleIconClick = () => {
    fileInputRef.current.click();
  };

  useEffect(() => {
    return () => {
      if (idImage && idImage.startsWith("blob:")) {
        URL.revokeObjectURL(idImage);
      }
    };
  }, [idImage]);

  return (
    <div className={styles.formInputWrapper}>
      <label>
        {label} {required && <span className={styles.required}>*</span>}
      </label>
      <div
        className={`${styles.formChangeUpload} ${
          idImage ? styles.imageUploaded : ""
        }`}
        onClick={handleIconClick}
      >
        <input
          type="file"
          accept="image/*"
          onChange={onChange}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {idImage ? (
          <Image
            src={idImage}
            alt={`Uploaded ${label}`}
            className={styles.IdImage}
            fill
            sizes="100%"
            quality={100}
            objectFit="contain"
            priority
          />
        ) : (
          <CameraIcon
            className={styles.CameraIcon}
            alt="Camera Icon"
            width={30}
            height={30}
          />
        )}
      </div>
    </div>
  );
};

const categoryOptions = [
  { value: "tires", label: "Tires" },
  { value: "electronics", label: "Electronics" },
  { value: "accessories", label: "Accessories" },
  { value: "parts", label: "Parts" },
  { value: "tools", label: "Tools" },
];

const unitOptions = [
  { value: "pcs", label: "Pieces" },
  { value: "kg", label: "Kilograms" },
  { value: "boxes", label: "Boxes" },
  { value: "liters", label: "Liters" },
  { value: "sets", label: "Sets" },
];

// Function to prepare form data for submission
const prepareFormData = (formData, imageFile, customFields) => {
  const formDataObj = new FormData();

  Object.entries(formData).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formDataObj.append(key, String(value));
    }
  });

  // Add custom fields
  if (customFields.length > 0) {
    formDataObj.append("customFields", JSON.stringify(customFields));
  }

  // Add image if exists
  if (imageFile instanceof File) {
    formDataObj.append("image", imageFile);
  }

  return formDataObj;
};

export default function InventoryForm() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const formType = searchParams.get("form") || "Add";
  const productId = searchParams.get("id");
  const isEditMode = formType === "Edit";

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const [customFields, setCustomFields] = useState([]);
  const [newFieldKey, setNewFieldKey] = useState("");
  const [newFieldValue, setNewFieldValue] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    productID: "",
    category: "",
    buyingPrice: "",
    sellingPrice: "",
    quantity: "",
    unit: "pcs",
    supplierName: "",
    supplierContact: "",
    reorderLevel: "",
    maxStock: "",
    storageLocation: "",
    description: "",
    expiryDate: "",
  });

  useEffect(() => {
    if (isEditMode && productId) {
      const mockProduct = {
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
        description: "High-quality tires for all weather conditions.",
        customFields: [
          { key: "Manufacturer", value: "GoodYear" },
          { key: "Size", value: "205/55R16" },
        ],
      };

      setFormData({
        name: mockProduct.name || "",
        productID: mockProduct.productID || "",
        category: mockProduct.category || "",
        buyingPrice: mockProduct.buyingPrice?.toString() || "",
        sellingPrice: mockProduct.sellingPrice?.toString() || "",
        quantity: mockProduct.quantity?.toString() || "",
        unit: mockProduct.unit || "pcs",
        supplierName: mockProduct.supplierName || "",
        supplierContact: mockProduct.supplierContact || "",
        reorderLevel: mockProduct.reorderLevel?.toString() || "",
        maxStock: mockProduct.maxStock?.toString() || "",
        storageLocation: mockProduct.storageLocation || "",
        description: mockProduct.description || "",
        expiryDate: mockProduct.expiryDate || "",
      });

      setImageUrl(mockProduct.image || null);

      if (mockProduct.customFields && Array.isArray(mockProduct.customFields)) {
        setCustomFields(mockProduct.customFields);
      }
    }
  }, [isEditMode, productId]);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload only image files");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("Image size should be less than 5MB");
      return;
    }

    setImageFile(file);
    const newImageUrl = URL.createObjectURL(file);
    setImageUrl(newImageUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleDropdownChange = (selected, field) => {
    if (selected) {
      setFormData((prev) => ({
        ...prev,
        [field]: selected.value,
      }));
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: null }));
      }
    }
  };

  // Handle adding a new custom field
  const handleAddCustomField = () => {
    if (!newFieldKey.trim()) {
      toast.error("Field name cannot be empty");
      return;
    }

    // Check if this field already exists
    if (customFields.some((field) => field.key === newFieldKey.trim())) {
      toast.error("Field name already exists");
      return;
    }

    setCustomFields([
      ...customFields,
      { key: newFieldKey.trim(), value: newFieldValue.trim() },
    ]);
    setNewFieldKey("");
    setNewFieldValue("");
  };

  // Handle removing a custom field
  const handleRemoveCustomField = (index) => {
    const updatedFields = [...customFields];
    updatedFields.splice(index, 1);
    setCustomFields(updatedFields);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isEditMode) {
      const requiredFields = [
        "name",
        "productID",
        "category",
        "buyingPrice",
        "sellingPrice",
        "quantity",
      ];
      requiredFields.forEach((field) => {
        if (!formData[field]) {
          newErrors[field] = `${
            field.charAt(0).toUpperCase() + field.slice(1)
          } is required`;
        }
      });

      if (!imageFile && !imageUrl) {
        newErrors.image = "Product image is required";
      }
    }

    // Validate number fields
    const numberFields = [
      "buyingPrice",
      "sellingPrice",
      "quantity",
      "reorderLevel",
      "maxStock",
    ];
    numberFields.forEach((field) => {
      if (formData[field] && isNaN(Number(formData[field]))) {
        newErrors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } must be a number`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors before submitting");
      return;
    }

    setIsLoading(true);

    try {
      const formDataObj = prepareFormData(formData, imageFile, customFields);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you would call your API here
      // let result;
      // if (isEditMode && productId) {
      //   result = await updateProduct(productId, formDataObj);
      // } else {
      //   result = await createProduct(formDataObj);
      // }

      toast.success(`Product ${isEditMode ? "updated" : "added"} successfully`);
    } catch (error) {
      console.error("Form submission error:", error);
      toast.error(error.message || "Failed to submit product data");
    } finally {
      setIsLoading(false);
    }
  };

  const goBack = () => router.back();

  return (
    <div className={styles.formMain}>
      <div className={styles.formHeader}>
        <h1>Edit Product</h1>
        <div className={styles.formNavBtnWrapper}>
          <button onClick={goBack} className={styles.backButton}>
            <BackArrow
              className={styles.backButtonIcon}
              aria-label="back icon"
              alt="back icon"
            />
            <span>go Back</span>
          </button>
          <button onClick={handleSubmit} className={styles.saveButton}>
            <SaveIcon
              className={styles.saveButtonIcon}
              aria-label="save icon"
              alt="save icon"
            />
            Save
          </button>
        </div>
      </div>
      <form className={styles.formContainer}>
        <div className={styles.formContainerInner}>
          <div className={styles.formImageContainer}>
            <FileInput
              onChange={handleImageUpload}
              idImage={imageUrl}
              label="Product Image"
              required={!isEditMode}
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Product Name{" "}
              {!isEditMode && <span className={styles.required}>*</span>}
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Product Name"
              className={`${styles.inputField} ${
                errors.name ? styles.errorInput : ""
              }`}
              required={!isEditMode}
            />
            {errors.name && (
              <span className={styles.errorText}>{errors.name}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Product ID{" "}
              {!isEditMode && <span className={styles.required}>*</span>}
            </label>
            <input
              type="text"
              name="productID"
              value={formData.productID}
              onChange={handleChange}
              placeholder="Product ID"
              className={`${styles.inputField} ${
                errors.productID ? styles.errorInput : ""
              }`}
              required={!isEditMode}
            />
            {errors.productID && (
              <span className={styles.errorText}>{errors.productID}</span>
            )}
          </div>

          <div className={styles.formInputContainer}>
            <label>
              Category{" "}
              {!isEditMode && <span className={styles.required}>*</span>}
            </label>
            <FormDropdown
              options={categoryOptions}
              value={categoryOptions.find(
                (option) => option.value === formData.category
              )}
              onSelect={(selected) =>
                handleDropdownChange(selected, "category")
              }
              dropPlaceHolder="Select Category"
            />
            {errors.category && (
              <span className={styles.errorText}>{errors.category}</span>
            )}
          </div>

          <div className={styles.formGridContainer}>
            <div className={styles.formInputContainer}>
              <label>
                Buying Price{" "}
                {!isEditMode && <span className={styles.required}>*</span>}
              </label>
              <input
                type="number"
                name="buyingPrice"
                value={formData.buyingPrice}
                onChange={handleChange}
                placeholder="Buying Price"
                className={`${styles.inputField} ${
                  errors.buyingPrice ? styles.errorInput : ""
                }`}
                required={!isEditMode}
                min="0"
                step="0.01"
              />
              {errors.buyingPrice && (
                <span className={styles.errorText}>{errors.buyingPrice}</span>
              )}
            </div>

            <div className={styles.formInputContainer}>
              <label>
                Selling Price{" "}
                {!isEditMode && <span className={styles.required}>*</span>}
              </label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                placeholder="Selling Price"
                className={`${styles.inputField} ${
                  errors.sellingPrice ? styles.errorInput : ""
                }`}
                required={!isEditMode}
                min="0"
                step="0.01"
              />
              {errors.sellingPrice && (
                <span className={styles.errorText}>{errors.sellingPrice}</span>
              )}
            </div>
          </div>

          <div className={styles.formGridContainer}>
            <div className={styles.formInputContainer}>
              <label>
                Quantity{" "}
                {!isEditMode && <span className={styles.required}>*</span>}
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                placeholder="Quantity"
                className={`${styles.inputField} ${
                  errors.quantity ? styles.errorInput : ""
                }`}
                required={!isEditMode}
                min="0"
              />
              {errors.quantity && (
                <span className={styles.errorText}>{errors.quantity}</span>
              )}
            </div>

            <div className={styles.formInputContainer}>
              <label>Unit</label>
              <FormDropdown
                options={unitOptions}
                value={unitOptions.find(
                  (option) => option.value === formData.unit
                )}
                onSelect={(selected) => handleDropdownChange(selected, "unit")}
                dropPlaceHolder="Select Unit"
              />
            </div>
          </div>

          <div className={styles.formGridContainer}>
            <div className={styles.formInputContainer}>
              <label>Reorder Level</label>
              <input
                type="number"
                name="reorderLevel"
                value={formData.reorderLevel}
                onChange={handleChange}
                placeholder="Reorder Level"
                className={`${styles.inputField} ${
                  errors.reorderLevel ? styles.errorInput : ""
                }`}
                min="0"
              />
              {errors.reorderLevel && (
                <span className={styles.errorText}>{errors.reorderLevel}</span>
              )}
            </div>

            <div className={styles.formInputContainer}>
              <label>Maximum Stock</label>
              <input
                type="number"
                name="maxStock"
                value={formData.maxStock}
                onChange={handleChange}
                placeholder="Maximum Stock"
                className={`${styles.inputField} ${
                  errors.maxStock ? styles.errorInput : ""
                }`}
                min="0"
              />
              {errors.maxStock && (
                <span className={styles.errorText}>{errors.maxStock}</span>
              )}
            </div>
          </div>

          <div className={styles.formInputContainer}>
            <label>Supplier Name</label>
            <input
              type="text"
              name="supplierName"
              value={formData.supplierName}
              onChange={handleChange}
              placeholder="Supplier Name"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>Supplier Contact</label>
            <input
              type="text"
              name="supplierContact"
              value={formData.supplierContact}
              onChange={handleChange}
              placeholder="Supplier Contact"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>Storage Location</label>
            <input
              type="text"
              name="storageLocation"
              value={formData.storageLocation}
              onChange={handleChange}
              placeholder="Storage Location"
              className={styles.inputField}
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>Expiry Date</label>
            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className={styles.inputField}
            />
          </div>

          <div className={styles.formInputContainer}>
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product Description"
              className={`${styles.inputField} ${styles.textareaField}`}
              rows={4}
            ></textarea>
          </div>

          <div className={styles.formInputContainer}>
            <label>Additional Fields</label>
            <div className={styles.addCustomFieldContainer}>
              <div className={styles.customFieldInputs}>
                <input
                  type="text"
                  value={newFieldKey}
                  onChange={(e) => setNewFieldKey(e.target.value)}
                  placeholder="Field Name"
                  className={styles.inputField}
                />
                <input
                  type="text"
                  value={newFieldValue}
                  onChange={(e) => setNewFieldValue(e.target.value)}
                  placeholder="Field Value"
                  className={styles.inputField}
                />
              </div>
              <button
                type="button"
                onClick={handleAddCustomField}
                className={styles.addCustomFieldBtn}
              >
                <IoAdd className={styles.addIcon} />
              </button>
            </div>

            {/* Display existing custom fields */}
            {customFields.length > 0 && (
              <div className={styles.customFieldsList}>
                {customFields.map((field, index) => (
                  <div key={index} className={styles.customFieldItem}>
                    <div className={styles.customFieldInfo}>
                     <strong>{field.key} :</strong> <span>{field.value}</span> 
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveCustomField(index)}
                      className={styles.removeCustomFieldBtn}
                    >
                      <IoClose className={styles.removeIcon}/>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
