import { useState, useEffect } from 'react';
import './css/AddProduct.css';

const AddProduct = ({ onAddProduct, productToEdit, onCancel, isEditMode }) => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    inStock: '',
    preview: ''
  });
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setProductData({
        name: productToEdit.name,
        price: productToEdit.price,
        inStock: productToEdit.inStock,
        preview: productToEdit.preview || ''
      });
      setShowForm(true);
    } else {
      setProductData({
        name: '',
        price: '',
        inStock: '',
        preview: ''
      });
      // Don't reset showForm here to maintain state between renders
    }
  }, [productToEdit]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData(prev => ({
          ...prev,
          preview: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onAddProduct(productData);
    if (!isEditMode) {
      // Reset form after submission only for add mode
      setProductData({
        name: '',
        price: '',
        inStock: '',
        preview: ''
      });
      setShowForm(false);
    }
  };

  const handleCancel = () => {
    if (isEditMode) {
      onCancel(); // For edit mode, use the passed cancel handler
    } else {
      // For add mode, just hide the form
      setShowForm(false);
      setProductData({
        name: '',
        price: '',
        inStock: '',
        preview: ''
      });
    }
  };

  // If in edit mode or form should be shown, display the form
  if (isEditMode || showForm) {
    return (
      <div className={`add-product-container ${isEditMode ? 'edit-mode' : ''}`}>
        <div className="add-product-form-container">
          <form className="add-product-form" onSubmit={handleSubmit}>
            <h2>{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
            
            <div className="form-group">
              <label htmlFor="name">Product Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={productData.name}
                onChange={handleInputChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="price">Price (₹/kg)</label>
              <input
                type="number"
                id="price"
                name="price"
                value={productData.price}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="inStock">Quantity Available (kg)</label>
              <input
                type="number"
                id="inStock"
                name="inStock"
                value={productData.inStock}
                onChange={handleInputChange}
                required
                min="1"
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="image">Product Image</label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
              />
              {productData.preview && (
                <div className="image-preview">
                  <img src={productData.preview} alt="Preview" />
                </div>
              )}
            </div>
            
            <div className="form-actions">
              <button
                type="button"
                className="cancel-btn"
                onClick={handleCancel}
              >
                Cancel
              </button>
              <button type="submit" className="submit-btn">
                {isEditMode ? 'Update Product' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Show the plus symbol placeholder when not in edit mode and form is hidden
  return (
    <div className="add-product-container-plus">
      <div 
        className="add-product-placeholder"
        onClick={() => setShowForm(true)}
      >
        <div className="plus-symbol">+</div>
        <p>Click to add a new product</p>
      </div>
    </div>
  );
};

export default AddProduct;