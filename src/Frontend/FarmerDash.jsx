import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddProduct from './AddProduct';
import FarmerProfile from './Farmerprof';
import OrderHistory from './Orderhis'; // Import the OrderHistory component
// import defaultProfile from '../assets/Farmer.png';
import './css/Farmerdash.css';

const FarmerDash = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
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
          profileImage: defaultProfile,
        };
  });

  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/farmer/login');
  };

  const handleAddProduct = (newProduct) => {
    if (editingProduct !== null) {
      setProducts(products.map((product, index) =>
        index === editingProduct ? newProduct : product
      ));
      setEditingProduct(null);
    } else {
      setProducts([...products, { ...newProduct, id: Date.now() }]);
    }
    setActiveTab('overview');
  };

  const handleEditProduct = (index) => {
    setEditingProduct(index);
  };

  const handleDeleteProduct = (index) => {
    setProducts(products.filter((_, i) => i !== index));
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
  };

  // Save profile to localStorage when updated
  useEffect(() => {
    localStorage.setItem('farmerProfile', JSON.stringify(farmerProfile));
  }, [farmerProfile]);

  const Overview = () => (
    <div className="overview-container">
      <h2>Your Products</h2>
      {products.length === 0 ? (
        <p className="no-products">No products added yet.</p>
      ) : (
        <div className="products-grid-overview">
          {products.map((product, index) => (
            <div key={index} className="product-card-overview">
              {product.preview && (
                <div className="product-image-overview">
                  <img src={product.preview} alt={product.name} />
                </div>
              )}
              <div className="product-details-overview">
                <h3>{product.name}</h3>
                <p>Price: ₹{product.price} / Per Kg</p>
                <p>In Stock: {product.inStock} kg</p>
                <div className="product-actions">
                  <button
                    className="edit-btn-overview"
                    onClick={() => handleEditProduct(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn-overview"
                    onClick={() => handleDeleteProduct(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {editingProduct !== null && (
        <>
          <div className="edit-overlay"></div>
          <div className="edit-form-container">
            <div className="edit-form">
              <AddProduct
                onAddProduct={handleAddProduct}
                productToEdit={products[editingProduct]}
                onCancel={handleCancelEdit}
                isEditMode={true}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );

  return (
    <div className="farmer-dashboard">
      <header className="dashboard-header">
        <div className="brand-logo">
          <span>Namma</span><span style={{ color: 'WHITE' }}> kadai</span>
        </div>
        <div className="header-actions">
          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </header>

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
                setEditingProduct(null);
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
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'add-product' && (
            <AddProduct
              onAddProduct={handleAddProduct}
              onCancel={() => setActiveTab('overview')}
            />
          )}
          {activeTab === 'orders' && <OrderHistory />} {/* Use the OrderHistory component here */}
          {activeTab === 'profile' && (
            <FarmerProfile
              farmer={farmerProfile}
              onUpdateProfile={(updated) => setFarmerProfile(updated)}
            />
          )}
        </main>
      </div>
    </div>
  );
};

export default FarmerDash;