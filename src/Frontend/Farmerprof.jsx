import React, { useState, useEffect } from "react";
import "./css/Farmerdash.css";

const FarmerProfile = () => {
  const [farmer, setFarmer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const mobile = localStorage.getItem("farmerMobile");
      if (!mobile) return;

      try {
        const res = await fetch(`http://localhost:8000/api/farmers/profile/${mobile}`);
        const data = await res.json();
        setFarmer(data);
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    fetchProfile();
  }, []);

  if (!farmer) return <p>Loading profile...</p>;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFarmer((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFarmer((prev) => ({ ...prev, profilePhoto: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    const mobile = farmer.mobile;
    const formData = new FormData();
    Object.keys(farmer).forEach((key) => {
      if (key !== "profilePhoto") formData.append(key, farmer[key]);
    });
    if (imageFile) formData.append("profilePhoto", imageFile);

    try {
      const res = await fetch(`http://localhost:8000/api/farmers/profile/${mobile}`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      setFarmer(data);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <div className="farmer-profile-container">
      <div className="farmer-profile-card">
        <div className="profile-header">
          <h2>Farmer Profile</h2>
          {isEditing ? (
            <button onClick={handleSave}>Save Changes</button>
          ) : (
            <button onClick={() => setIsEditing(true)}>Edit Profile</button>
          )}
        </div>

        <div className="profile-content">
          <div className="profile-image-section">
            <img
              src={farmer.profilePhoto || "/default-avatar.png"}
              alt="Profile"
              className="farmer-profile-pic"
            />
            {isEditing && (
              <>
                <input type="file" style={{ display: "none" }} id="profileImageInput" onChange={handleImageChange} />
                <label htmlFor="profileImageInput">Change Photo</label>
              </>
            )}
          </div>

          <div className="profile-details">
            {["name", "email", "address", "city", "pincode"].map((field) => (
              <div key={field} className="form-group-profile">
                <label>
                  {field === "email" && "✉ "}
                  {field === "address" && "📍 "}
                  {field === "city" && "🏙 "}
                  {field === "pincode" && "📮 "}
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                {isEditing ? (
                  field === "address" ? (
                    <textarea name={field} value={farmer[field]} onChange={handleInputChange} rows="3" />
                  ) : (
                    <input type="text" name={field} value={farmer[field]} onChange={handleInputChange} />
                  )
                ) : (
                  <p>{farmer[field]}</p>
                )}
              </div>
            ))}
            <div className="form-group-profile">
              <label>📞 Mobile</label>
              <p>{farmer.mobile}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FarmerProfile;
