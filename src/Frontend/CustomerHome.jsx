import React, { useState, useEffect } from 'react';
import {
  FaSearch, FaShoppingCart, FaUser,
  FaFilter, FaStar, FaHeart, FaRegHeart,
  FaHome, FaFacebook, FaTwitter, FaInstagram,
  FaLinkedin, FaPhone, FaEnvelope, FaMapMarkerAlt
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './css/Customer.css';

// Mock data
const mockProducts = {
  1: {
    id: 1,
    name: 'Organic Apples',
    price: 120,
    image: '/Images/Apples.jpg',
    farmer: 'Fresh Farms Co.',
    rating: 4.5,
    description: 'Fresh organic apples from our orchards.',
    category: 'fruits',
    inStock: true,
    farmerLocation: 'Himachal Pradesh',
    deliveryTime: '1-2 days'
  },
  2: {
    id: 2,
    name: 'Fresh Tomatoes',
    price: 80,
    image: '/Images/Tomato.jpeg',
    farmer: 'Green Valley Farms',
    rating: 4.2,
    description: 'Juicy vine-ripened tomatoes.',
    category: 'vegetables',
    inStock: true,
    farmerLocation: 'Maharashtra',
    deliveryTime: '1 day'
  },
  3: {
    id: 3,
    name: 'Basmati Rice',
    price: 450,
    image: '/Images/Rice.jpg',
    farmer: 'Paddy Fields',
    rating: 4.7,
    description: 'Premium quality basmati rice.',
    category: 'grains',
    inStock: true,
    farmerLocation: 'Punjab',
    deliveryTime: '2-3 days'
  },4: {
    id: 4,
    name: 'Fresh Brinjal',
    price: 60,
    image: '/Images/brinjal.jpg',
    farmer: 'Organic Veggie Farms',
    rating: 4.3,
    description: 'Fresh and tender brinjals, perfect for curries and stir-fries.',
    category: 'vegetables',
    inStock: true,
    farmerLocation: 'Tamil Nadu',
    deliveryTime: '1-2 days'
  },
  5: {
    id: 5,
    name: 'Potatoes',
    price: 40,
    image: '/Images/potato.jpg',
    farmer: 'Root Harvest',
    rating: 4.6,
    description: 'Freshly harvested potatoes, great for all culinary uses.',
    category: 'vegetables',
    inStock: true,
    farmerLocation: 'Uttar Pradesh',
    deliveryTime: '1 day'
  },
  6: {
    id: 6,
    name: 'Organic Coriander Leaves',
    price: 20,
    image: '/Images/Coriander.jpg',
    farmer: 'Green Leaf Farms',
    rating: 4.4,
    description: 'Fresh organic coriander leaves with intense flavor and aroma.',
    category: 'green-leaves',
    inStock: true,
    farmerLocation: 'Karnataka',
    deliveryTime: '1 day'
  }
};

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

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const productsArray = Object.values(mockProducts);
        setProducts(productsArray);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingItem = cart.find(item => item.id === product.id);
    const updatedCart = existingItem
      ? cart.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];
    
    setCart(updatedCart);
  };


  const goToProductDetail = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const goToCart = () => {
    navigate('/cart');
  };

  const goToProfile = () => {
    navigate('/profile');
  };

  const goToHome = () => {
    navigate('/');
  };

  const buyNow = (product) => {
    addToCart(product);
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.farmer.toLowerCase().includes(searchTerm.toLowerCase());

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

    return matchesSearch && matchesCategory && matchesPrice && matchesRating && matchesStock;
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
      {/* Navigation Bar */}
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
            <div className="icon-container" onClick={goToHome}>
              <FaHome className="nav-icon" />
            </div>

            <div className="icon-container cart-icon-container" onClick={goToCart}>
              <FaShoppingCart className="nav-icon" />
              {totalCartItems > 0 && (
                <span className="cart-badge">{totalCartItems}</span>
              )}
            </div>

            <div className="icon-container" onClick={goToProfile}>
              <FaUser className="nav-icon" />
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="main-container">
        <div className="content-wrapper">
          <div className={`filters-sidebar ${showFilters ? 'show' : ''}`}>
            <div className="filters-header">
              <h3 className="filters-title">Filters</h3>
            </div>
            <div className="filter-group">
              <h4>Category</h4>
              <select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="filter-select"
              >
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
              <select
                name="priceRange"
                value={filters.priceRange}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="all">All Prices</option>
                <option value="under100">Under ₹100</option>
                <option value="100to500">₹100 - ₹500</option>
                <option value="over500">Over ₹500</option>
              </select>
            </div>
            <div className="filter-group">
              <h4>Rating</h4>
              <select
                name="rating"
                value={filters.rating}
                onChange={handleFilterChange}
                className="filter-select"
              >
                <option value="all">All Ratings</option>
                <option value="4+">4+ Stars</option>
                <option value="3+">3+ Stars</option>
              </select>
            </div>
            <button className="clear-filters" onClick={clearFilters}>
              Clear All
            </button>
          </div>

          {/* Products */}
          <div className="products-container">
            <div className="products-header">
              <h2>Fresh Farm Products</h2>
              <div className="products-header-actions">
                <span className="products-count">{filteredProducts.length} products found</span>
                <button
                  className="mobile-filter-button"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <FaFilter /> Filters
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="loading">
                <div className="spinner"></div>
                <p>Loading fresh products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="no-products">
                <p>No products match your search criteria</p>
              </div>
            ) : (
              <div className="products-grid">
                {filteredProducts.map(product => (
                  <div key={product.id} className="product-card">
                    <div className="product-image-container" onClick={() => goToProductDetail(product)}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="product-image"
                        loading="lazy"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/300x300?text=Image+Not+Available';
                        }}
                      />
                    </div>
                    <div className="product-details">
                      <h3 className="product-name" onClick={() => goToProductDetail(product)}>
                        {product.name}
                      </h3>
                      <p className="product-farmer">By {product.farmer}</p>
                      <div className="product-rating">
                        <div className="rating-stars">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`star-icon ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                            />
                          ))}
                          <span>{product.rating}</span>
                        </div>
                      </div>
                      <div style={{ "font-size": "20px" }} className="product-price">₹{product.price.toFixed(2)} / Per kg</div>
                      <div className="product-actions">
                        <button
                          className="add-to-cart-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(product);
                          }}
                          disabled={!product.inStock}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </button>
                        <button
                          className="buy-now-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            buyNow(product);
                          }}
                          disabled={!product.inStock}
                        >
                          Buy Now
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

      {/* Footer Section */}
      <footer className="customer-footer">
        <div className="footer-container">
          <div className="footer-section">
            <h3 className="footer-heading">About Namma Kadai</h3>
            <p className="footer-text">
              Connecting farmers directly with consumers to provide fresh, organic,
              and high-quality farm products at fair prices.
            </p>
            <div className="social-icons">
              <a href="https://facebook.com" aria-label="Facebook"><FaFacebook /></a>
              <a href="https://twitter.com" aria-label="Twitter"><FaTwitter /></a>
              <a href="https://instagram.com" aria-label="Instagram"><FaInstagram /></a>
              <a href="https://linkedin.com" aria-label="LinkedIn"><FaLinkedin /></a>
            </div>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Quick Links</h3>
            <ul className="footer-links">
              <li><a href="/">Home</a></li>
              <li><a href="/products">All Products</a></li>
              <li><a href="/farmers">Our Farmers</a></li>
              <li><a href="/about">About Us</a></li>
              <li><a href="/contact">Contact</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Customer Service</h3>
            <ul className="footer-links">
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/shipping">Shipping Policy</a></li>
              <li><a href="/returns">Return Policy</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms & Conditions</a></li>
            </ul>
          </div>

          <div className="footer-section">
            <h3 className="footer-heading">Contact Us</h3>
            <div className="contact-info">
              <p><FaMapMarkerAlt /> 123 Farm Road, Bangalore, Karnataka 560001</p>
              <p><FaPhone /> +91 9876543210</p>
              <p><FaEnvelope /> contact@nammakadai.com</p>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} Namma Kadai. All Rights Reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CustomerHome;