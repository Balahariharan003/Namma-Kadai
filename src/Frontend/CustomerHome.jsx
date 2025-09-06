import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaShoppingCart, FaUser, FaFilter, FaStar, FaHome
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './css/Customer.css';

const CustomerHome = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: 'all',
    priceRange: 'all',
    rating: 'all',
    inStock: false
  });
  const [isLoading, setIsLoading] = useState(true);

  const customer = JSON.parse(localStorage.getItem('user'));
  const customerPincode = customer?.pincode;
  console.log("Customer pincode:", customerPincode);

  useEffect(() => {
    if (!customerPincode) {
      alert("Please log in to view products");
      navigate('/customer/login');
      return;
    }

    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const res = await fetch('http://localhost:8000/api/products');
        const data = await res.json();
        console.log("Fetched products:", data);
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [navigate, customerPincode]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item._id === product._id);
    const updatedCart = existingItem
      ? cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];
    setCart(updatedCart);
  };

  // ✅ Fixed navigation with _id
  const goToProductDetail = (product) => {
    navigate(`/product/${product._id}`, { state: { product } });
  };

  const goToCart = () => navigate('/cart');
  const goToProfile = () => navigate('/profile');
  const goToHome = () => navigate('/');

  const buyNow = (product) => {
    addToCart(product);
    navigate(`/product/${product._id}`, { state: { product } });
  };

  // ✅ Filtering with farmer & customer pincode
  const filteredProducts = products.filter(product => {
    const matchesPincode = product.farmer?.pincode &&
      String(product.farmer.pincode) === String(customerPincode);

    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filters.category === 'all' || product.category === filters.category;

    let matchesPrice = true;
    if (filters.priceRange === 'under100') {
      matchesPrice = product.price < 100;
    } else if (filters.priceRange === '100to500') {
      matchesPrice = product.price >= 100 && product.price <= 500;
    } else if (filters.priceRange === 'over500') {
      matchesPrice = product.price > 500;
    }

    let matchesRating = true;
    if (filters.rating === '4+') {
      matchesRating = product.rating >= 4;
    } else if (filters.rating === '3+') {
      matchesRating = product.rating >= 3;
    }

    const matchesStock = !filters.inStock || product.inStock;

    return matchesPincode && matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
  });

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const clearFilters = () => {
    setFilters({
      category: 'all',
      priceRange: 'all',
      rating: 'all',
      inStock: false
    });
    setSearchTerm('');
  };

  const totalCartItems = cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="customer-home">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-brand">
            <h1 className="logo">Namma Kadai</h1>
            <span className="tagline">Direct from Indian Farmers</span>
          </div>
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for products or farmers..."
              className="search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="search-icon" />
          </div>
          <div className="nav-icons">
            <div className="icon-container" onClick={goToHome}><FaHome className="nav-icon" /></div>
            <div className="icon-container cart-icon-container" onClick={goToCart}>
              <FaShoppingCart className="nav-icon" />
              {totalCartItems > 0 && <span className="cart-badge">{totalCartItems}</span>}
            </div>
            <div className="icon-container" onClick={goToProfile}><FaUser className="nav-icon" /></div>
          </div>
        </div>
      </nav>

      <div className="main-container">
        <div className="content-wrapper">
          {/* Filters Sidebar */}
          <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header"><h3 className="filters-title">Filters</h3></div>
            <div className="filter-group">
              <h4>Category</h4>
              <select name="category" value={filters.category} onChange={handleFilterChange} className="filter-select">
                <option value="all">All Categories</option>
                <option value="fruits">Fruits</option>
                <option value="vegetables">Vegetables</option>
                <option value="dairy">Dairy</option>
                <option value="grains">Grains</option>
                <option value="green-leaves">Green Leaves</option>
              </select>
            </div>
            <div className="filter-group">
              <h4>Price Range (₹)</h4>
              <select name="priceRange" value={filters.priceRange} onChange={handleFilterChange} className="filter-select">
                <option value="all">All Prices</option>
                <option value="under100">Under ₹100</option>
                <option value="100to500">₹100 - ₹500</option>
                <option value="over500">Over ₹500</option>
              </select>
            </div>
            <div className="filter-group">
              <h4>Rating</h4>
              <select name="rating" value={filters.rating} onChange={handleFilterChange} className="filter-select">
                <option value="all">All Ratings</option>
                <option value="4+">4+ Stars</option>
                <option value="3+">3+ Stars</option>
              </select>
            </div>
            <button className="clear-filters" onClick={clearFilters}>Clear All</button>
          </div>

          {/* Products */}
          <div className="products-container">
            {isLoading ? (
              <div className="loading"><div className="spinner"></div><p>Loading fresh products...</p></div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products"><p>No products match your search criteria</p></div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product._id} className="product-card" onClick={() => goToProductDetail(product)}>
                    <div className="product-image-container">
                      <img
                        src={product.imageUrl ? `http://localhost:8000${product.imageUrl}` : 'https://via.placeholder.com/300x300?text=Image+Not+Available'}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                      />
                    </div>
                    <div className="product-details">
                      <h3 className="product-name">{product.name}</h3>
                      <p className="product-farmer">By {product.farmer?.name || 'Unknown'}</p>
                      <div className="product-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`star-icon ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`} />
                        ))}
                        <span>{product.rating || '0'}</span>
                      </div>
                      <div className="product-price">₹{(product.price || 0).toFixed(2)} / Per kg</div>
                      <div className="product-actions">
                        <button
                          className="add-to-cart-button"
                          onClick={(e) => { e.stopPropagation(); addToCart(product); }}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerHome;
