import React, { useState, useEffect } from 'react';

const FarmerProfile = ({ farmer, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState(() => {
    return farmer || {
      name: 'Ravi Kumar',
      mobile: '9876543210',
      email: '', 
      address: '123 Green Farm Road',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641001',
      profileImage: defaultProfile,
    };
  });

  useEffect(() => {
    if (farmer) {
      setProfileData(farmer);
    }
  }, [farmer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateProfile) {
      onUpdateProfile(profileData);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileData((prev) => ({
          ...prev,
          profileImage: reader.result,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="farmer-profile-container">
      <div className="farmer-profile-card">
        <div className="profile-header">
          <h2>Farmer Profile</h2>
          {isEditing ? (
            <button className="save-btn" onClick={handleSave}>
              Save Changes
            </button>
          ) : (
            <button className="edit-btn" onClick={() => setIsEditing(true)}>
              Edit Profile
            </button>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-image-section">
            <img
              src={profileData.profileImage}
              alt="Farmer Profile"
              className="farmer-profile-pic"
            />
            {isEditing && (
              <>
                <input
                  type="file"
                  id="profileImageInput"
                  accept="image/*"
                  style={{ display: 'none' }}
                  onChange={handleImageChange}
                />
                <label htmlFor="profileImageInput" className="change-photo-btn">
                  Change Photo
                </label>
              </>
            )}
          </div>

          <div className="profile-details">
            {isEditing ? (
              <>
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    name="mobile"
                    value={profileData.mobile}
                    onChange={handleInputChange}
                  />
                </div>
                {/* Add email field in edit mode */}
                <div className="form-group">
                  <label>Email (Optional)</label>
                  <input
                    type="email"
                    name="email"
                    value={profileData.email || ''}
                    onChange={handleInputChange}
                    placeholder="example@email.com"
                  />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <textarea
                    name="address"
                    value={profileData.address}
                    onChange={handleInputChange}
                    rows="3"
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
                  <label>Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    value={profileData.pincode}
                    onChange={handleInputChange}
                  />
                </div>
              </>
            ) : (
              <>
                <h3 className="farmer-name">{profileData.name}</h3>
                <div className="info-item">
                  <span className="info-icon">📞</span>
                  <span className="info-text">{profileData.mobile}</span>
                </div>
                {/* Conditionally render email if it exists */}
                {profileData.email && (
                  <div className="info-item">
                    <span className="info-icon">✉️</span>
                    <span className="info-text">{profileData.email}</span>
                  </div>
                )}
                <div className="info-item">
                  <span className="info-icon">📍</span>
                  <span className="info-text">{profileData.address}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">🏙️</span>
                  <span className="info-text">{profileData.city}</span>
                </div>
                <div className="info-item">
                  <span className="info-icon">📮</span>
                  <span className="info-text">{profileData.pincode}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;