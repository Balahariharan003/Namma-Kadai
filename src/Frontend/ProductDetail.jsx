import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaStar, FaTruck } from 'react-icons/fa';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import './css/Customer.css';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const [product, setProduct] = useState(state?.product || null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [selectedImage, setSelectedImage] = useState(0);

  // Sample reviews
  const reviews = [
    {
      id: 1,
      user: 'Rahul Sharma',
      rating: 4,
      text: 'The product was delivered fresh and as described.',
      date: '2023-05-15'
    },
    {
      id: 2,
      user: 'Priya Patel',
      rating: 5,
      text: 'Loved the freshness and taste!',
      date: '2023-06-02'
    }
  ];

  // ✅ Fetch product if not passed via state
  useEffect(() => {
    if (!product) {
      const fetchProduct = async () => {
        try {
          const res = await fetch(`http://localhost:8000/api/products/${id}`);
          if (!res.ok) throw new Error("Failed to fetch product");
          const data = await res.json();
          setProduct(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchProduct();
    }
  }, [id, product]);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = () => {
    const existingItem = cart.find(item => item._id === product._id);
    const updatedCart = existingItem
      ? cart.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      : [...cart, { ...product, quantity: 1 }];

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    alert(`${product.name} added to cart!`);
  };

  const buyNow = () => {
    const existingItem = cart.find(item => item._id === product._id);
    const updatedCart = existingItem
      ? cart
      : [...cart, { ...product, quantity: 1 }];

    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
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
    return <p>Loading product details...</p>;
  }

  const productImages = [
    product.imageUrl
      ? `http://localhost:8000${product.imageUrl}`
      : 'https://via.placeholder.com/500x500?text=Image+Not+Available'
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
            {!product.inStock && <div className="out-of-stock">Out of Stock</div>}
          </div>
        </div>

        <div className="product-info-section">
          <h1 className="product-name">{product.name}</h1>
          <p className="product-farmer">By {product.farmer?.name || "Unknown Farmer"}</p>

          <div className="product-rating">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`star-icon ${i < Math.floor(product.rating || 0) ? 'filled' : ''}`}
              />
            ))}
            <span>{product.rating || 0}</span>
          </div>

          <div className="price-section">
            <div className="product-price">₹{(product.price || 0).toFixed(2)} / Per kg</div>
            <div className="original-price">₹{((product.price || 0) * 1.2).toFixed(2)}</div>
            <div className="discount">20% OFF</div>
          </div>

          <div className="delivery-info">
            <strong><FaTruck className="delivery-icon" /> Delivery</strong>
            <p>Get it by {new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString()}</p>
            <p className="delivery-location">Delivering to your location</p>
          </div>

          
        </div>
      </div>

      <div className="product-details-tabs">
        <div className="tabs-header">
          <button
            className={`tab-btn ${activeTab === 'description' ? 'active' : ''}`}
            onClick={() => setActiveTab('description')}
          >
            Description
          </button>
          <button
            className={`tab-btn ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            Reviews ({reviews.length})
          </button>
        </div>

        <div className="tab-content">
          {activeTab === 'description' && (
            <div className="description-content">
              <h3>Product Description</h3>
              <p>{product.description}</p>
              <p>
                This product is freshly harvested from our organic farms in{" "}
                {product.farmer?.location || "India"}.
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="reviews-content">
              <h3>Customer Reviews ({reviews.length})</h3>
              {reviews.map(review => (
                <div key={review.id} className="review-item">
                  <div className="review-meta">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={`star-icon ${i < review.rating ? 'filled' : ''}`} />
                    ))}
                    <span>{review.user}</span>
                    <span>{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                  <p>{review.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
