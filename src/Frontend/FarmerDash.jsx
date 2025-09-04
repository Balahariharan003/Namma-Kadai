import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProduct from './AddProduct';
import Overview from './Overview';
import FarmerProfile from './Farmerprof';
import OrderHistory from './Orderhis';
import './css/Farmerdash.css';

const FarmerDash = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [farmerProfile, setFarmerProfile] = useState(() => {
    const stored = localStorage.getItem('farmerProfile');
    return stored
      ? JSON.parse(stored)
      : {
          name: 'Ravi Kumar',
          mobile: '9876543210',
          address: '123 Green Farm Road',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641001',
          profileImage: '',
        };
  });

  const navigate = useNavigate();
  const API_BASE_URL = 'http://localhost:8000/api/products';

  // Logout handler
  const handleLogout = () => navigate('/farmer/login');

  // Fetch products from backend
  const fetchProducts = async () => {
    try {
      const res = await fetch(API_BASE_URL);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAddProduct = async (productData) => {
    try {
      const formData = new FormData();
      formData.append('productName', productData.name);
      formData.append('rate', productData.price);
      formData.append('kg', productData.inStock);
      if (productData.file) formData.append('photo', productData.file);

      const res = await fetch(`${API_BASE_URL}/add`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to add product');

      setProducts((prev) => [...prev, data.product]);
      setActiveTab('overview');
    } catch (err) {
      console.error('Error adding product:', err);
    }
  };

  // Update product
  const handleUpdateProduct = async (updatedProduct) => {
    try {
      const formData = new FormData();
      formData.append('productName', updatedProduct.name);
      formData.append('rate', updatedProduct.price);
      formData.append('kg', updatedProduct.inStock);
      if (updatedProduct.file) formData.append('photo', updatedProduct.file);

      const res = await fetch(`${API_BASE_URL}/update/${updatedProduct._id}`, {
        method: 'PUT',
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update product');

      // Update in local state
      setProducts((prev) =>
        prev.map((p) => (p._id === updatedProduct._id ? data.product : p))
      );
      setEditingProductId(null);
    } catch (err) {
      console.error('Error updating product:', err);
    }
  };

  // Delete product
  const handleDeleteProduct = async (id) => {
    try {
      const res = await fetch(`${API_BASE_URL}/delete/${id}`, { method: 'DELETE' });
      if (res.status === 204) {
        setProducts((prev) => prev.filter((p) => p._id !== id));
        return;
      }
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete product');
    } catch (err) {
      console.error('Error deleting product:', err);
    }
  };

  // Save farmer profile in localStorage
  useEffect(() => {
    localStorage.setItem('farmerProfile', JSON.stringify(farmerProfile));
  }, [farmerProfile]);

  return (
    <div className="farmer-dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="brand-logo">
          Namma <span style={{ color: 'WHITE' }}>kadai</span>
        </div>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

      {/* Sidebar + Content */}
      <div className="dashboard-container">
        <nav className="dashboard-sidebar">
          <ul>
            <li
              className={activeTab === 'overview' ? 'active' : ''}
              onClick={() => setActiveTab('overview')}
            >
              Overview
            </li>
            <li
              className={activeTab === 'add-product' ? 'active' : ''}
              onClick={() => {
                setEditingProductId(null);
                setActiveTab('add-product');
              }}
            >
              Add Product
            </li>
            <li
              className={activeTab === 'orders' ? 'active' : ''}
              onClick={() => setActiveTab('orders')}
            >
              Orders
            </li>
            <li
              className={activeTab === 'profile' ? 'active' : ''}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </li>
          </ul>
        </nav>

        <main className="dashboard-content">
          {activeTab === 'overview' && (
            <Overview
              products={products}
              editingProductId={editingProductId}
              setEditingProductId={setEditingProductId}
              handleUpdateProduct={handleUpdateProduct}
              handleDeleteProduct={handleDeleteProduct}
            />
          )}

          {activeTab === 'add-product' && (
            <AddProduct
              onAddProduct={handleAddProduct}
              onCancel={() => setActiveTab('overview')}
            />
          )}

          {activeTab === 'orders' && <OrderHistory />}

          {activeTab === 'profile' && (
            <FarmerProfile farmer={farmerProfile} onUpdateProfile={setFarmerProfile} />
          )}
        </main>
      </div>
    </div>
  );
};

export default FarmerDash;
