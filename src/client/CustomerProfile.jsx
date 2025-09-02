import React, { useState, useEffect } from "react";
import {
  FaUserEdit,
  FaShoppingCart,
  FaBoxOpen,
  FaUserCog,
  FaCog,
  FaSignOutAlt,
  FaCamera
} from "react-icons/fa";
import Cart from "./Cart"; // Import the Cart component
import "./css/Customer.css";

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");

  const [profileData, setProfileData] = useState({
    fullName: "John Doe",
    email: "john.doe@example.com",
    phone: "",
    address: "",
    city: "",
    zip: ""
  });

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem("customerProfile");
    if (savedData) {
      const parsedData = JSON.parse(savedData);
      setProfileData(parsedData);
      if (parsedData.profileImage) {
        setProfileImage(parsedData.profileImage);
      }
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    const dataToSave = {
      ...profileData,
      profileImage: profileImage
    };
    localStorage.setItem("customerProfile", JSON.stringify(dataToSave));
    setIsEditing(false);
  };

  const handleLogout = () => {
    // Redirect to login page
    window.location.href = "/customer/login";
  };

  const renderContent = () => {
    if (activeTab === "personalInfo") {
      return (
        <div className="personal-info-customer">
          <h2>Personal Information</h2>
          {isEditing ? (
            <form onSubmit={handleSave}>
              <div className="profile-image-edit">
                <div className="image-container-customer">
                  <div className="image-wrapper">
                    <img src={profileImage} alt="Profile" />
                  </div>
                  <label className="camera-icon">
                    <FaCamera />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      style={{ display: 'none' }}
                    />
                  </label>
                </div>
              </div>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profileData.fullName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>City</label>
                <input
                  type="text"
                  name="city"
                  value={profileData.city}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Zip Code</label>
                <input
                  type="text"
                  name="zip"
                  value={profileData.zip}
                  onChange={handleInputChange}
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="save-btn-customer">Save Changes</button>
                <button
                  type="button"
                  className="cancel-btn-customer"
                  onClick={() => setIsEditing(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <div className="profile-image">
                <img src={profileImage} alt="Profile" />
              </div>
              <div className="info-display">
                <div className="info-item">
                  <span className="info-label">Full Name:</span>
                  <span className="info-value">{profileData.fullName}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Email:</span>
                  <span className="info-value">{profileData.email}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Phone:</span>
                  <span className="info-value">{profileData.phone || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Address:</span>
                  <span className="info-value">{profileData.address || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">City:</span>
                  <span className="info-value">{profileData.city || "Not provided"}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Zip Code:</span>
                  <span className="info-value">{profileData.zip || "Not provided"}</span>
                </div>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-btn-customer"
              >
                <FaUserEdit /> Edit Profile
              </button>
            </>
          )}
        </div>
      );
    }

    if (activeTab === "myCart") {
      return <Cart />; // Render the Cart component
    }

    if (activeTab === "myOrders") {
      return (
        <div className="tab-content">
          <h2>My Orders</h2>
          <p>You have no orders yet.</p>
        </div>
      );
    }

    if (activeTab === "settings") {
      return (
        <div className="tab-content">
          <h2>Settings</h2>
          <p>Account settings and preferences.</p>
        </div>
      );
    }
  };

  return (
    <div className="customer-profile-container">
      <div className="cutomer-profile-section">
        <div className="profile-greeting">
          <div className="profile-photo">
            <img src={profileImage} alt="Profile" />
          </div>
          <h1>Hello, {profileData.fullName.split(" ")[0]}!</h1>
        </div>
      </div>

      <div className="profile-layout">
        <aside className="sidebar">
          <nav className="menu">
            <button
              onClick={() => setActiveTab("personalInfo")}
              className={activeTab === "personalInfo" ? "active" : ""}
            >
              <FaUserCog /> Personal Information
            </button>
            <button
              onClick={() => setActiveTab("myCart")}
              className={activeTab === "myCart" ? "active" : ""}
            >
              <FaShoppingCart /> My Cart
            </button>
            <button
              onClick={() => setActiveTab("myOrders")}
              className={activeTab === "myOrders" ? "active" : ""}
            >
              <FaBoxOpen /> My Orders
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={activeTab === "settings" ? "active" : ""}
            >
              <FaCog /> Settings
            </button>
            <button className="logout" onClick={handleLogout}>
              <FaSignOutAlt /> Log Out
            </button>
          </nav>
        </aside>

        <main className="content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default CustomerProfile;