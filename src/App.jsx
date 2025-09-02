import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profession from './client/Profession';
import CustomerAuth from './client/CustomerAuth';
import FarmerAuth from './client/FarmerAuth';
import FarmerDash from './client/FarmerDash';
import CustomerHome from './client/CustomerHome';
import ProductDetail from './client/ProductDetail';
import Cart from './client/Cart';
import Checkout from './client/Checkout';
import Profile from './client/CustomerProfile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Profession />} />
        <Route path="/customer/login" element={<CustomerAuth />} />
        <Route path="/farmer/login" element={<FarmerAuth/>} />
        <Route path="/farmer/dashboard" element={<FarmerDash />} />
        <Route path="/customer/dashboard" element={<CustomerHome/>}/>
        <Route path="/product/:id" element={<ProductDetail/>} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;