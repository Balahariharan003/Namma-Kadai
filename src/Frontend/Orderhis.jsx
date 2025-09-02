import React, { useState } from 'react';
import './css/FarmerDash.css';

const OrderHistory = () => {
  // Sample data with Indian farmer products and details
  const orderData = {
    today: [
      {
        id: 'today-order1',
        name: 'Rajesh Kumar',
        products: [
          { name: 'Tomato', quantity: 5, price: 20 },
          { name: 'Potato', quantity: 10, price: 30 },
          { name: 'Onion', quantity: 3, price: 25 }
        ],
        address: '123 MG Road, Bangalore, Karnataka - 560001',
        paymentMethod: 'UPI (*******@ybl)'
      },
      {
        id: 'today-order2',
        name: 'Priya Sharma',
        products: [
          { name: 'Brinjal', quantity: 4, price: 35 },
          { name: 'Lady Finger', quantity: 2, price: 40 },
          { name: 'Cucumber', quantity: 6, price: 15 }
        ],
        address: '456 Nehru Nagar, Mumbai, Maharashtra - 400025',
        paymentMethod: 'Credit Card (VISA ****4242)'
      }
    ],
    yesterday: [
      {
        id: 'yesterday-order1',
        name: 'Vikram Patel',
        products: [
          { name: 'Carrot', quantity: 8, price: 45 },
          { name: 'Beetroot', quantity: 5, price: 30 },
          { name: 'Radish', quantity: 7, price: 20 }
        ],
        address: '789 Gandhi Chowk, Ahmedabad, Gujarat - 380009',
        paymentMethod: 'Cash on Delivery'
      },
      {
        id: 'yesterday-order2',
        name: 'Ananya Reddy',
        products: [
          { name: 'Spinach', quantity: 3, price: 15 },
          { name: 'Coriander', quantity: 2, price: 10 },
          { name: 'Mint', quantity: 1, price: 20 }
        ],
        address: '321 Temple Road, Hyderabad, Telangana - 500013',
        paymentMethod: 'PhonePe'
      }
    ],
    month: [
      {
        id: 'month-order1',
        name: 'Arun Singh',
        products: [
          { name: 'Cauliflower', quantity: 5, price: 40 },
          { name: 'Cabbage', quantity: 3, price: 30 },
          { name: 'Green Peas', quantity: 2, price: 60 }
        ],
        address: '654 Hill Road, Pune, Maharashtra - 411001',
        paymentMethod: 'PayTM'
      },
      {
        id: 'month-order2',
        name: 'Meena Gupta',
        products: [
          { name: 'Bottle Gourd', quantity: 3, price: 35 },
          { name: 'Pumpkin', quantity: 2, price: 25 },
          { name: 'Ridge Gourd', quantity: 4, price: 30 }
        ],
        address: '987 River View, Kolkata, West Bengal - 700032',
        paymentMethod: 'Net Banking'
      },
      {
        id: 'month-order3',
        name: 'Suresh Iyer',
        products: [
          { name: 'Drumstick', quantity: 10, price: 20 },
          { name: 'Snake Gourd', quantity: 3, price: 35 },
          { name: 'Bitter Gourd', quantity: 5, price: 40 }
        ],
        address: '234 Beach Road, Chennai, Tamil Nadu - 600004',
        paymentMethod: 'Credit Card (HDFC ****7878)'
      }
    ]
  };

  // State for expanded sections
  const [expandedSections, setExpandedSections] = useState({
    today: false,
    yesterday: false,
    month: false
  });

  // State for expanded orders
  const [expandedOrders, setExpandedOrders] = useState({});

  // Toggle section visibility
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Toggle order details visibility
  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  // Calculate total for an order
  const calculateTotal = (products) => {
    return products.reduce((sum, product) => sum + (product.price * product.quantity), 0);
  };

  // Render order details table
  const renderOrderDetails = (order) => {
    return (
      <div className="order-details-active">
        <table>
          <thead>
            <tr>
              <th>Vegetable Name</th>
              <th>Quantity (kg)</th>
              <th>Price (₹)</th>
            </tr>
          </thead>
          <tbody>
            {order.products.map((product, index) => (
              <tr key={index}>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>₹{(product.price * product.quantity).toFixed(2)}</td>
              </tr>
            ))}
            <tr>
              <td colSpan="2"><strong>Total:</strong></td>
              <td><strong>₹{calculateTotal(order.products).toFixed(2)}</strong></td>
            </tr>
          </tbody>
        </table>
        <p><strong>Address:</strong> {order.address}</p>
        <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
      </div>
    );
  };

  // Render orders for a time period
    const renderOrders = (orders) => {
    return orders.map(order => (
      <div key={order.id} className="order-item">
        <div 
          className={`customer-name ${expandedOrders[order.id] ? 'active' : ''}`}
          onClick={() => toggleOrderDetails(order.id)}
        >
          {order.name}
        </div>
        {expandedOrders[order.id] && renderOrderDetails(order)}
      </div>
    ));
  };

  return (
    <div className="container">
      <h1>Order History</h1>

      {/* Today's Orders */}
      <div className="time-period">
        <h2 onClick={() => toggleSection('today')}>
          Today's Orders
          <span className={`arrow ${expandedSections.today ? 'rotate' : ''}`}>▶</span>
        </h2>
        {expandedSections.today && (
          <div className="order-list active">
            {renderOrders(orderData.today)}
          </div>
        )}
      </div>

      {/* Yesterday's Orders */}
      <div className="time-period">
        <h2 onClick={() => toggleSection('yesterday')}>
          Yesterday's Orders
          <span className={`arrow ${expandedSections.yesterday ? 'rotate' : ''}`}>▶</span>
        </h2>
        {expandedSections.yesterday && (
          <div className="order-list active">
            {renderOrders(orderData.yesterday)}
          </div>
        )}
      </div>

      {/* Month's Orders */}
      <div className="time-period">
        <h2 onClick={() => toggleSection('month')}>
          This Month's Orders
          <span className={`arrow ${expandedSections.month ? 'rotate' : ''}`}>▶</span>
        </h2>
        {expandedSections.month && (
          <div className="order-list active">
            {renderOrders(orderData.month)}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;