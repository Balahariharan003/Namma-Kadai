import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Profession from './Frontend/Profession';
import CustomerAuthform from './Frontend/CustomerAuthform';
import FarmerAuthform from './Frontend/FarmerAuthform';
import FarmerDash from './Frontend/FarmerDash';
import CustomerHome from './Frontend/CustomerHome';
import ProductDetail from './Frontend/ProductDetail';
import Cart from './Frontend/Cart';
import Checkout from './Frontend/Checkout';
import Profile from './Frontend/CustomerProfile';
import Overview from './Frontend/Overview';
import FarmerProfile from './Frontend/Farmerprof';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Profession />} />
        <Route path="/customer/login" element={<CustomerAuthform />} />
        <Route path="/farmer/login" element={<FarmerAuthform />} />
        <Route path="/farmer/dashboard" element={<FarmerDash />} />
        <Route path="/customer/dashboard" element={<CustomerHome />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
