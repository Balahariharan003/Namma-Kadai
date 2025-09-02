import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaStar, FaHeart, FaTruck, FaSpinner } from 'react-icons/fa';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './css/Customer.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Initialize cart from localStorage or location state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [product, setProduct] = useState(state?.product || null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);
  const [wishlisted, setWishlisted] = useState(false);

  // Sample reviews data
  const reviews = [
    {
      id: 1,
      user: 'Rahul Sharma',
      rating: 4,
      title: 'Fresh and Good Quality',
      text: 'The product was delivered fresh and as described. Will definitely order again from this farmer.',
      date: '2023-05-15'
    },
    {
      id: 2,
      user: 'Priya Patel',
      rating: 5,
      title: 'Excellent Organic Quality',
      text: 'Loved the freshness and taste. Worth every penny for organic produce!',
      date: '2023-06-02'
    }
  ];

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = () => {
    const existingItem = cart.find(item => item.id === product.id);
    const updatedCart = existingItem
      ? cart.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
      : [...cart, { ...product, quantity: 1 }];

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  };

  const buyNow = () => {
    // Add the product to cart with quantity 1 if not already in cart
    const existingItem = cart.find(item => item.id === product.id);
    const updatedCart = existingItem
      ? cart.map(item =>
        item.id === product.id ? item : item
      )
      : [...cart, { ...product, quantity: 1 }];

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));

    // Navigate to checkout with the cart
    navigate('/checkout', { state: { fromProductDetail: true } });
  };


  
  if (error) {
    return (
      <div className="error-container">
        <p>{error}</p>
        <button onClick={() => navigate('/')}>Go Back Home</button>
      </div>
    );
  }

  if (!product) {
    return null;
  }

  const productImages = [
    product.image,
  ];

  return (
    <div className="product-detail-container">
      <div className="product-detail-card">
        <div className="product-image-section">
          <div className="main-product-image">
            <img
              src={productImages[selectedImage]}
              alt={product.name}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/500x500?text=Image+Not+Available';
              }}
            />
            {!product.inStock && (
              <div className="out-of-stock">Out of Stock</div>
            )}
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-farmer">By {product.farmer}</p>

          <div className="product-rating">
            <div className="rating-stars">
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`star-icon ${i < Math.floor(product.rating) ? 'filled' : ''}`}
                />
              ))}
              <span style={{"color" : "bla"}}>{product.rating}</span>
            </div>
            <span className="reviews">({reviews.length} customer reviews)</span>
          </div>

          <div className="price-section">
            <div className="product-price">₹{product.price.toFixed(2)} / Per kg</div>
            <div className="original-price">₹{(product.price * 1.2).toFixed(2)}</div>
            <div className="discount">20% OFF</div>
          </div>

          <div className="delivery-info">
            <div className="delivery-option">
                <strong> <FaTruck  className="delivery-icon"/> Delivery</strong>
                <p>Get it by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
                <p className="delivery-location">Delivering to your location</p>
            </div>
          </div>

          <div className="product-highlights">
            <h3>Highlights</h3>
            <div>
              <span>Fresh from farm</span><br></br>
              <span>Organic certified</span><br></br>
              <span>No preservatives added</span><br></br>
              <span>Harvested within 3 days</span><br></br>
            </div>
          </div>

          <div className="product-actions">
            <button
              className="add-to-cart-button"
              onClick={addToCart}
              disabled={!product.inStock}
              aria-disabled={!product.inStock}
            >
              <FaShoppingCart /> Add to Cart
            </button>
            <button
              className="buy-now-button"
              onClick={buyNow}
              disabled={!product.inStock}
              aria-disabled={!product.inStock}
            >
              Buy Now
            </button>
          </div>

        </div>
      </div>
      <div className="product-details-tabs">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
            aria-selected={activeTab === 'description'}
          >
            Description
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
            aria-selected={activeTab === 'reviews'}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-content">
              <h3>Product Description</h3>
              <p>{product.description}</p>
              <p>This product is freshly harvested from our organic farms in {product.farmerLocation || 'India'}.
                It is grown without any chemical pesticides and is packed with natural goodness.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              <h3>Customer Reviews ({reviews.length})</h3>

              {/* Compact Rating Summary */}
              <div className="compact-rating-summary">
                <div className="average-rating-badge">
                  {product.rating.toFixed(1)}
                  <div className="rating-stars">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`star-icon ${i < Math.floor(product.rating) ? 'filled' : ''}`} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Compact Review List */}
              <div className="compact-review-list">
                {reviews.map(review => (
                  <div key={review.id} className="compact-review-item">
                    <div className="review-meta">
                      <div className="review-rating">
                        {[...Array(5)].map((_, i) => (
                          <FaStar key={i} className={`star-icon ${i < review.rating ? 'filled' : ''}`} />
                        ))}
                      </div>
                      <span className="review-date">
                        {new Date(review.date).toLocaleDateString('en-IN', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                    <div className="review-text">
                      {review.text.length > 120
                        ? `${review.text.substring(0, 120)}...`
                        : review.text}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;