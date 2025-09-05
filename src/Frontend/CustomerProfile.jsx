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
import Cart from "./Cart"; // Import Cart component
import "./css/Customer.css";

const CustomerProfile = () => {
  const [activeTab, setActiveTab] = useState("personalInfo");
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("/default-avatar.png");
  const [imageFile, setImageFile] = useState(null);

  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    state: "",
    pincode: ""
  });

  // Fetch profile from backend on mount
useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  const mobile = user?.mobile;   // 👈 safer

  if (!mobile) return;

  const fetchProfile = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/customers/profile/${mobile}`);
      const data = await res.json();
      if (data) {
        setProfileData(data);
        if (data.profilePhoto) {
          setProfileImage(data.profilePhoto);
        }
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    }
  };

  fetchProfile();
}, []);


  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle profile image change
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // Save profile updates
  const handleSave = async (e) => {
    e.preventDefault();
    const mobile = profileData.mobile;
    if (!mobile) {
      alert("Customer mobile not found!");
      return;
    }

    const formData = new FormData();
    Object.keys(profileData).forEach((key) => {
      if (key !== "profilePhoto") formData.append(key, profileData[key]);
    });
    if (imageFile) formData.append("profilePhoto", imageFile);

    try {
      const res = await fetch(`http://localhost:8000/api/customers/profile/${mobile}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      setProfileData(data);
      if (data.profilePhoto) {
        setProfileImage(data.profilePhoto);
      }
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

const handleLogout = () => {
  localStorage.removeItem("user");
  localStorage.removeItem("customerMobile"); // if you use option 1
  window.location.href = "/customer/login";
};


  // Render different tabs
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
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              </div>

              {["name", "email", "mobile", "address", "city", "state", "pincode"].map((field) => (
                <div className="form-group" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    value={profileData[field] || ""}
                    onChange={handleInputChange}
                    disabled={field === "mobile"} // mobile shouldn't be editable
                    required={["name", "email", "address", "city", "state", "pincode"].includes(field)}
                  />
                </div>
              ))}

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
                {["name", "email", "mobile", "address", "city", "state", "pincode"].map((field) => (
                  <div className="info-item" key={field}>
                    <span className="info-label">{field.charAt(0).toUpperCase() + field.slice(1)}:</span>
                    <span className="info-value">{profileData[field] || "Not provided"}</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setIsEditing(true)} className="edit-btn-customer">
                <FaUserEdit /> Edit Profile
              </button>
            </>
          )}
        </div>
      );
    }

    if (activeTab === "myCart") {
      return <Cart />;
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
          <h1>Hello, {profileData.name ? profileData.name.split(" ")[0] : "Customer"}!</h1>
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

        <main className="content">{renderContent()}</main>
      </div>
    </div>
  );
};

export default CustomerProfile;
