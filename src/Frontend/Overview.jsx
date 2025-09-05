import React, { useState } from "react";
import "./css/Overview.css";

const Overview = ({ products, setProducts }) => {
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    inStock: "",
    preview: "",
    file: null,
  });

  // ================= Edit Button Click =================
  const handleEditClick = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price,
      inStock: product.inStock,
      preview: "", // reset preview for new edit
      file: null,
    });
  };

  // ================= Save Edited Product =================
  const handleSaveClick = async () => {
    if (editingProduct) {
      const updatedData = new FormData();
      updatedData.append("name", formData.name);
      updatedData.append("price", formData.price);
      updatedData.append("inStock", formData.inStock);
      if (formData.file) {
        updatedData.append("image", formData.file);
      }

      try {
        const res = await fetch(
          `http://localhost:8000/api/products/${editingProduct._id}`,
          {
            method: "PUT",
            body: updatedData,
          }
        );

        if (!res.ok) throw new Error("Failed to update product");
        const updatedProduct = await res.json();

        // ✅ Update UI
        setProducts((prev) =>
          prev.map((p) => (p._id === updatedProduct._id ? updatedProduct : p))
        );

        console.log("✅ Product updated:", updatedProduct);
      } catch (err) {
        console.error("❌ Error updating product:", err);
      }

      setEditingProduct(null);
    }
  };

  // ================= Delete Product =================
  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(
        `http://localhost:8000/api/products/${id}`,
        { method: "DELETE" }
      );

      if (!res.ok) throw new Error("Failed to delete product");

      // ✅ Remove from UI
      setProducts((prev) => prev.filter((p) => p._id !== id));

      console.log("✅ Product deleted:", id);
    } catch (err) {
      console.error("❌ Error deleting product:", err);
    }
  };

  return (
    <div className="overview-container-overview">
      <h2 className="title-overview">Your Products</h2>

      {products.length === 0 ? (
        <p className="no-products-overview">No products added yet.</p>
      ) : (
        <div className="products-grid-overview">
          {products.map((product) => (
            <div key={product._id} className="product-card-overview">
              <div className="product-image-overview">
                {product.imageUrl && (
                  <img
                    src={`http://localhost:8000${product.imageUrl}`}
                    alt={product.name}
                    className="product-img-overview"
                  />
                )}
              </div>

              <div className="product-details-overview">
                <h3 className="product-name-overview">{product.name}</h3>
                <p className="product-price-overview">
                  Price: ₹{product.price} / Kg
                </p>
                <p className="product-stock-overview">
                  In Stock: {product.inStock} Kg
                </p>
                <div className="product-actions-overview">
                  <button
                    className="edit-btn-overview"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn-overview"
                    onClick={() => handleDeleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= EDIT MODAL ================= */}
      {editingProduct && (
        <div className="edit-form-overlay">
          <div className="edit-form-overview">
            <h2>Edit Product</h2>

            <div className="form-group">
              <label htmlFor="editName">Product Name</label>
              <input
                type="text"
                id="editName"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="editPrice">Price (₹/kg)</label>
              <input
                type="number"
                id="editPrice"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="editStock">Quantity Available (kg)</label>
              <input
                type="number"
                id="editStock"
                value={formData.inStock}
                onChange={(e) =>
                  setFormData({ ...formData, inStock: e.target.value })
                }
                required
                min="1"
              />
            </div>

            <div className="form-group">
              <label htmlFor="editPhoto">Product Image</label>
              <input
                type="file"
                id="editPhoto"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      setFormData((prev) => ({
                        ...prev,
                        preview: reader.result,
                        file: file,
                      }));
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
              {/* Show preview (new upload OR existing product image) */}
              {(formData.preview || editingProduct.imageUrl) && (
                <div className="image-preview">
                  <img
                    src={
                      formData.preview
                        ? formData.preview
                        : `http://localhost:8000${editingProduct.imageUrl}`
                    }
                    alt="Preview"
                  />
                </div>
              )}
            </div>

            <div className="edit-form-actions">
              <button
                className="cancel-btn-overview"
                onClick={() => setEditingProduct(null)}
              >
                Cancel
              </button>
              <button
                className="save-btn-overview"
                onClick={handleSaveClick}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Overview;