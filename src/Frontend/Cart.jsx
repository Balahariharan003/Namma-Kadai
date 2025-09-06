import React, { useState, useEffect } from 'react';
import { FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import './css/Customer.css';

const Cart = () => {
  const navigate = useNavigate();

  // Load cart from localStorage on mount
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  // Update localStorage whenever cart changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const removeFromCart = (productId) => {
    setCart(cart.filter(item => item._id !== productId && item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    setCart(cart.map(item =>
      (item._id === productId || item.id === productId)
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const proceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-container">
      <h1>Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button
            className="continue-shopping"
            onClick={() => navigate('/customer/dashboard')}
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map(item => (
              <div key={item._id || item.id} className="cart-item">
                <img
                  src={
                    item.imageUrl
                      ? `http://localhost:8000${item.imageUrl}`
                      : item.image || 'https://via.placeholder.com/100x100?text=No+Image'
                  }
                  alt={item.name}
                  className="cart-item-image"
                />
                <div className="cart-item-details">
                  <h3>{item.name}</h3>
                  <p>By {item.farmer?.name || item.farmer || 'Unknown'}</p>
                  <p>₹{item.price.toFixed(2)}</p>
                </div>
                <div className="quantity-control-cart">
                  <button onClick={() => updateQuantity(item._id || item.id, item.quantity - 0.5)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id || item.id, item.quantity + 0.5)}>+</button>
                </div>
                <button
                  className="remove-item-cart"
                  onClick={() => removeFromCart(item._id || item.id)}
                >
                  <FaTrash />
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <button
              className="checkout-button"
              onClick={proceedToCheckout}
            >
              Proceed to Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
