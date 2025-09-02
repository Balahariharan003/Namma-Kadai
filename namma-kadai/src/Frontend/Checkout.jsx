import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import './css/Customer.css';

const Checkout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    payment: 'credit'
  });

  // Get cart from localStorage and location state
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;
    
    const updatedCart = cart.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const removeItem = (id) => {
    const updatedCart = cart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setOrderConfirmed(true);
    // Clear cart from localStorage
    localStorage.removeItem('cart');
    setCart([]);
  };

  // Calculate subtotal properly
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  if (orderConfirmed) {
    return (
      <div className="order-confirmation">
        <FaCheckCircle className="success-icon" />
        <h1>Order Confirmed!</h1>
        <p>Thank you for your purchase. Your order has been placed successfully.</p>
        <p>A confirmation has been sent to {formData.email}</p>
        <button 
          className="continue-shopping"
          onClick={() => navigate('/customer/dashboard')}
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      <h1>Checkout</h1>
      
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button className="continue-shopping" onClick={() => navigate('/customer/dashboard')}>Continue Shopping</button>
        </div>
      ) : (
        <div className="checkout-content">
          <form onSubmit={handleSubmit} className="checkout-form">
            <h2>Shipping Information</h2>
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                name="email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Shipping Address</label>
              <textarea 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <h2>Payment Method</h2>
            <div className="form-group">
              <select 
                name="payment" 
                value={formData.payment} 
                onChange={handleChange}
                className="payment-select"
              >
                <option value="credit">Credit Card</option>
                <option value="debit">Debit Card</option>
                <option value="paypal">PayPal</option>
                <option value="cod">Cash on Delivery</option>
              </select>
            </div>
            
            <button type="submit" className="place-order-button">
              Place Order
            </button>
          </form>
          
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cart.map(item => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/100?text=Product';
                  }} />
                  <div className="item-details">
                    <h4>{item.name}</h4>
                    <p>₹{item.price.toFixed(2)} / Per kg</p>
                    <div className="quantity-control-checkout">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 0.5)} >-</button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 0.5)}>+</button>
                    </div>
                  </div>
                  <div className="item-total-checkout">
                    <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                    <button 
                      className="remove-item-checkout"
                      onClick={() => removeItem(item.id)}>
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="summary-totals">
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;