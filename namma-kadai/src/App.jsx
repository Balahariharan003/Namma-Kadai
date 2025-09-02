import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profession from './Frontend/Profession';
import CustomerAuth from './Frontend/CustomerAuth';
import FarmerAuth from './Frontend/FarmerAuth';
import FarmerDash from './Frontend/FarmerDash';
import CustomerHome from './Frontend/CustomerHome';
import ProductDetail from './Frontend/ProductDetail';
import Cart from './Frontend/Cart';
import Checkout from './Frontend/Checkout';
import Profile from './Frontend/CustomerProfile';

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