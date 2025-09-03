import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLock, FaCity, FaHashtag, FaImage } from 'react-icons/fa';
import './css/FarmerAuth.css';

const FarmerAuthform = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });
  const [profilePhoto, setProfilePhoto] = useState(null); // ✅ store selected file
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const API_BASE_URL = 'http://localhost:8000';

  const validateField = (name, value) => {
    switch (name) {
      case 'mobile':
        if (!/^\d{10}$/.test(value)) return 'Mobile must be 10 digits';
        break;
      case 'password':
        if (value.length < 8) return 'Password must be at least 8 characters';
        if (!/[0-9]/.test(value) || !/[a-zA-Z]/.test(value)) return 'Password must contain letters and numbers';
        break;
      case 'confirmPassword':
        if (value !== formData.password) return 'Passwords do not match';
        break;
      case 'email':
        if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        break;
      case 'pincode':
        if (!/^\d{6}$/.test(value)) return 'Pincode must be 6 digits';
        break;
      case 'state':
        if (!value && !isLogin) return 'State is required';
        break;
      default:
        if (!value && name !== 'email') return 'This field is required';
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e) => {
    setProfilePhoto(e.target.files[0]);
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    if (isLogin) {
      const mobileError = validateField('mobile', formData.mobile);
      const passwordError = validateField('password', formData.password);
      if (mobileError) {
        newErrors.mobile = mobileError;
        isValid = false;
      }
      if (passwordError) {
        newErrors.password = passwordError;
        isValid = false;
      }
    } else {
      Object.keys(formData).forEach(key => {
        if (key !== 'email' && key !== 'confirmPassword') {
          const error = validateField(key, formData[key]);
          if (error) {
            newErrors[key] = error;
            isValid = false;
          }
        }
      });
      if (formData.password && formData.confirmPassword) {
        const confirmError = validateField('confirmPassword', formData.confirmPassword);
        if (confirmError) {
          newErrors.confirmPassword = confirmError;
          isValid = false;
        }
      }

      // ✅ require profile photo for signup
      if (!profilePhoto) {
        newErrors.profilePhoto = "Profile photo is required";
        isValid = false;
      }
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setErrors({});

    try {
      if (isLogin) {
        // 🔹 LOGIN API CALL
        const response = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            mobile: formData.mobile,
            password: formData.password,
          }),
        });

        let data;
        try {
          data = await response.json();
        } catch (err) {
          throw new Error("Invalid JSON response from server");
        }

        console.log("Login response:", data);

        if (!response.ok) {
          throw new Error(data.message || `Login failed with status ${response.status}`);
        }
        console.log("✅ Signup successful:", data);
        setSuccessMessage("Login successful!");
        setTimeout(() => {
          setSuccessMessage("");
          navigate("/farmer/dashboard"); 
        }, 2000);
        
      }
      else {
        const formDataToSend = new FormData();
        formDataToSend.append("name", formData.name);
        formDataToSend.append("mobile", formData.mobile);
        formDataToSend.append("email", formData.email || "");
        formDataToSend.append("address", formData.address);
        formDataToSend.append("city", formData.city);
        formDataToSend.append("state", formData.state);
        formDataToSend.append("pincode", formData.pincode);
        formDataToSend.append("password", formData.password);

        if (profilePhoto) {
          formDataToSend.append("profilePhoto", profilePhoto);
        }

        console.log("Making request to:", `${API_BASE_URL}/signup`);
        const response = await fetch(`${API_BASE_URL}/signup`, {
          method: "POST",
          body: formDataToSend,
        });

        const data = await response.json();
        console.log("Response from backend:", data);

        if (!response.ok) {
          let errorMessage = data.message || "Registration failed";
          if (Array.isArray(data.errors)) {
            errorMessage = data.errors.join(", ");
          }
          throw new Error(errorMessage);
        }

        setSuccessMessage("Farmer account created successfully! Login functionality will be available soon.");
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMessage("");
          setFormData({
            name: "",
            mobile: "",
            email: "",
            address: "",
            city: "",
            state: "",
            pincode: "",
            password: "",
            confirmPassword: ""
          });
          setProfilePhoto(null); // ✅ reset file input
        }, 3000);
      }
    } catch (error) {
      console.error(`Error during ${isLogin ? "login" : "signup"}:`, error);
      setErrors({ api: error.message || "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Namma Kadai</h1>
        <h2>{isLogin ? 'Farmer Login' : 'Farmer Registration'}</h2>
      </div>

      {successMessage && <div className="alert alert-success">{successMessage}</div>}
      {errors.api && <div className="alert alert-error">{errors.api}</div>}

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <>
            <div className={`form-group ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name"><FaUser className="input-icon" />Full Name</label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} placeholder="Enter your full name" />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email"><FaEnvelope className="input-icon" />Email (Optional)</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="example@email.com" />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className={`form-group ${errors.profilePhoto ? 'error' : ''}`}>
              <label htmlFor="profilePhoto"><FaImage className="input-icon" />Profile Photo</label>
              <input type="file" id="profilePhoto" name="profilePhoto" accept="image/*" onChange={handleFileChange} />
              {errors.profilePhoto && <span className="error-message">{errors.profilePhoto}</span>}
            </div>

            <div className={`form-group ${errors.address ? 'error' : ''}`}>
              <label htmlFor="address"><FaMapMarkerAlt className="input-icon" />Address</label>
              <textarea id="address" name="address" value={formData.address} onChange={handleChange} placeholder="House No, Street, Area" rows="2" />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="address-details">
              <div className={`form-group ${errors.city ? 'error' : ''}`}>
                <label htmlFor="city"><FaCity className="input-icon" />City</label>
                <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="E.g., Erode" />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className={`form-group ${errors.state ? 'error' : ''}`}>
                <label htmlFor="state"><FaMapMarkerAlt className="input-icon" />State</label>
                <input type="text" id="state" name="state" value={formData.state} onChange={handleChange} placeholder="E.g., Tamil Nadu" />
                {errors.state && <span className="error-message">{errors.state}</span>}
              </div>

              <div className={`form-group ${errors.pincode ? 'error' : ''}`}>
                <label htmlFor="pincode"><FaHashtag className="input-icon" />Pincode</label>
                <input type="text" id="pincode" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6-digit pincode" maxLength="6" />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>
          </>
        )}

        <div className={`form-group ${errors.mobile ? 'error' : ''}`}>
          <label htmlFor="mobile"><FaPhone className="input-icon" />Mobile Number</label>
          <input type="tel" id="mobile" name="mobile" value={formData.mobile} onChange={handleChange} placeholder="Enter 10-digit mobile number" maxLength="10" />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>

        <div className={`form-group ${errors.password ? 'error' : ''}`}>
          <label htmlFor="password"><FaLock className="input-icon" />Password</label>
          <div className="password-input">
            <input type={showPassword ? 'text' : 'password'} id="password" name="password" value={formData.password} onChange={handleChange} placeholder="Enter your password" />
            <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        {!isLogin && (
          <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
            <label htmlFor="confirmPassword"><FaLock className="input-icon" />Confirm Password</label>
            <input type={showPassword ? 'text' : 'password'} id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="Confirm your password" />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
        )}

        <button type="submit" className="submit-btn-farmer" disabled={isSubmitting}>
          {isSubmitting ? <span className="spinner"></span> : isLogin ? 'Login' : 'Register'}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button type="button" className="toggle-form-btn-farmer" onClick={() => { setIsLogin(!isLogin); setErrors({}); }}>
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default FarmerAuthform;
