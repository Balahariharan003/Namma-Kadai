import { useState } from 'react';
import './css/AddProduct.css';

const AddProduct = () => {
  const [productData, setProductData] = useState({
    name: '',
    price: '',
    inStock: '',
    preview: '',
    file: null, // actual file for upload
  });
  const [showForm, setShowForm] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = 'http://localhost:8000/api/products';

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProductData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProductData(prev => ({
          ...prev,
          preview: reader.result,
          file: file
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!productData.name) newErrors.name = 'Product name is required';
    if (!productData.price) newErrors.price = 'Price is required';
    if (!productData.inStock) newErrors.inStock = 'Quantity is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  if (!validateForm()) return;    

  setIsSubmitting(true);
  setErrors({});
  setSuccessMessage('');

  try {
    const formDataToSend = new FormData();
    formDataToSend.append('productName', productData.name);
    formDataToSend.append('rate', productData.price);
    formDataToSend.append('kg', productData.inStock);
    if (productData.file) formDataToSend.append('photo', productData.file);

    const response = await fetch(`${API_BASE_URL}/add`, {   // ✅ FIXED
      method: 'POST',
      body: formDataToSend,
    });

    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Failed to add product');

    setSuccessMessage('✅ Product added successfully!');
    setProductData({ name: '', price: '', inStock: '', preview: '', file: null });
    setShowForm(false);
  } catch (err) {
    console.error('Error adding product:', err);
    setErrors({ api: err.message });
  } finally {
    setIsSubmitting(false);
  }
};


  const handleCancel = () => {
    setShowForm(false);
    setProductData({ name: '', price: '', inStock: '', preview: '', file: null });
  };

  if (showForm) {
    return (
      <div className="add-product-container">
        <div className="add-product-form-container">
          <form className="add-product-form" onSubmit={handleSubmit}>
            <h2>Add New Product</h2>

            {errors.api && <div className="alert alert-error">{errors.api}</div>}
            {successMessage && <div className="alert alert-success">{successMessage}</div>}

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
              {errors.name && <span className="error-message">{errors.name}</span>}
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
              {errors.price && <span className="error-message">{errors.price}</span>}
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
              {errors.inStock && <span className="error-message">{errors.inStock}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="photo">Product Image</label>
              <input
                type="file"
                id="photo"
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
              <button type="button" className="cancel-btn" onClick={handleCancel}>
                Cancel
              </button>
              <button type="submit" className="submit-btn" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="add-product-container-plus">
      <div className="add-product-placeholder" onClick={() => setShowForm(true)}>
        <div className="plus-symbol">+</div>
        <p>Click to add a new product</p>
      </div>
    </div>
  );
};

export default AddProduct;