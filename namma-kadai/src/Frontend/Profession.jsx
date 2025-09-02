import React from 'react';
import { useNavigate } from 'react-router-dom';
import './css/Profession.css';

const Profession = () => {
  const navigate = useNavigate();

  const handleSelection = (profession) => {
    console.log(`Attempting to navigate to: /${profession}/login`);
    navigate(`/${profession}/login`);
  };

  return (
    <div className="profession-selection-container">
      <div className="profession-header">
        <h1>Welcome to Namma Kadai</h1>
        <p>Please select your profession to continue</p>
      </div>

      <div className="profession-cards">
        <div className="profession-card" onClick={() => handleSelection('farmer')}>
          <div className="profession-icon">👨‍🌾</div>
          <h2>I'm a Farmer</h2>
          <p>Sell your fresh produce directly to customers</p>
          <button className="profession-button farmer-button">Continue as Farmer</button>
        </div>

        <div className="profession-card" onClick={() => handleSelection('customer')}>
          <div className="profession-icon">👨‍💼</div>
          <h2>I'm a Customer</h2>
          <p>Buy fresh farm products directly from farmers</p>
          <button className="profession-button customer-button">Continue as Customer</button>
        </div>
      </div>

      <div className="profession-footer">
        <p>Connecting farmers directly with consumers</p>
      </div>
    </div>
  );
};

export default Profession;