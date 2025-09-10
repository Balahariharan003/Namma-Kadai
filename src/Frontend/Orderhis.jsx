import React, { useState, useEffect } from "react";
import "./css/FarmerDash.css";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [expandedOrders, setExpandedOrders] = useState({});

  useEffect(() => {
    // ✅ Read the logged-in farmer from localStorage
    const farmer = JSON.parse(localStorage.getItem("farmer"));
    if (!farmer?._id) return;

    const fetchOrders = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/orders/farmer/${farmer._id}`);
        const data = await res.json();
        console.log("Fetched orders:", data); // Debug
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrders(prev => ({
      ...prev,
      [orderId]: !prev[orderId]
    }));
  };

  return (
    <div className="container">
      <h1>Order History</h1>
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="order-item">
            <div
              className={`customer-name ${expandedOrders[order._id] ? "active" : ""}`}
              onClick={() => toggleOrderDetails(order._id)}
            >
              {order.customerId?.name || "Unknown Customer"}
            </div>
            {expandedOrders[order._id] && (
              <div className="order-details-active">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Qty</th>
                      <th>Price</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.products.map((p, i) => (
                      <tr key={i}>
                        <td>{p.name}</td>
                        <td>{p.quantity}</td>
                        <td>₹{(p.price * p.quantity).toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <p><strong>Total:</strong> ₹{order.total.toFixed(2)}</p>
                <p><strong>Address:</strong> {order.address}</p>
                <p><strong>Payment:</strong> {order.paymentMethod}</p>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
