import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaLock, FaCity, FaHashtag } from 'react-icons/fa';
import './css/Auth.css';

const AuthForm = ({ userType = 'customer' }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    mobile: '',
    email: '',
    address: '',
    city: '',
    pincode: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

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
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));

      if (isLogin) {
        console.log('Logging in with:', {
          mobile: formData.mobile,
          password: formData.password
        });
        navigate(`/${userType}/dashboard`);
      } else {
        console.log('Registering with:', {
          name: formData.name,
          mobile: formData.mobile,
          email: formData.email || null, // Ensure email is included
          address: `${formData.address}, ${formData.city}, ${formData.pincode}`,
          password: formData.password
        });

        setSuccessMessage('Account created successfully! Please login.');
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMessage('');
          setFormData({
            name: '',
            mobile: '',
            email: '',
            address: '',
            city: '',
            pincode: '',
            password: '',
            confirmPassword: ''
          });
        }, 2000);
      }
    } catch (error) {
      setErrors({ api: error.message || 'An error occurred. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const title = userType === 'farmer' ? 'Farmer' : 'Customer';

  return (
    <div className="auth-container">
      <div className="auth-header">
        <h1>Namma Kadai</h1>
        <h2>{isLogin ? `${title} Login` : `${title} Registration`}</h2>
      </div>

      {successMessage && (
        <div className="alert alert-success">
          {successMessage}
        </div>
      )}

      {errors.api && (
        <div className="alert alert-error">
          {errors.api}
        </div>
      )}

      <form onSubmit={handleSubmit} className="auth-form">
        {!isLogin && (
          <>
            <div className={`form-group ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name">
              <FaUser className="input-icon" />
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope className="input-icon" />
                Email (Optional)
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@email.com"
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            <div className={`form-group ${errors.address ? 'error' : ''}`}>
              <label htmlFor="address">
                <FaMapMarkerAlt className="input-icon" />
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House No, Street, Area (e.g., Solangapalayam)"
                rows="2"
              />
              {errors.address && <span className="error-message">{errors.address}</span>}
            </div>

            <div className="address-details">
              <div className={`form-group ${errors.city ? 'error' : ''}`}>
                <label htmlFor="city">
                  <FaCity className="input-icon" />
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="E.g., Erode"
                />
                {errors.city && <span className="error-message">{errors.city}</span>}
              </div>

              <div className={`form-group ${errors.pincode ? 'error' : ''}`}>
                <label htmlFor="pincode">
                  <FaHashtag className="input-icon" />
                  Pincode
                </label>
                <input
                  type="text"
                  id="pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  maxLength="6"
                />
                {errors.pincode && <span className="error-message">{errors.pincode}</span>}
              </div>
            </div>
          </>
        )}

        <div className={`form-group ${errors.mobile ? 'error' : ''}`}>
          <label htmlFor="mobile">
            <FaPhone className="input-icon" />
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            placeholder="Enter 10-digit mobile number"
            maxLength="10"
          />
          {errors.mobile && <span className="error-message">{errors.mobile}</span>}
        </div>

        <div className={`form-group ${errors.password ? 'error' : ''}`}>
          <label htmlFor="password">
            <FaLock className="input-icon" />
            Password
          </label>
          <div className="password-input">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={togglePasswordVisibility}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
          {errors.password && <span className="error-message">{errors.password}</span>}
        </div>

        {!isLogin && (
          <div className={`form-group ${errors.confirmPassword ? 'error' : ''}`}>
            <label htmlFor="confirmPassword">
              <FaLock className="input-icon" />
              Confirm Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Confirm your password"
            />
            {errors.confirmPassword && (
              <span className="error-message">{errors.confirmPassword}</span>
            )}
          </div>
        )}

        <button
          type="submit"
          className="submit-btn"
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <span className="spinner"></span>
          ) : (
            isLogin ? 'Login' : 'Register'
          )}
        </button>
      </form>

      <div className="auth-footer">
        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button
            type="button"
            className="toggle-form-btn"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
          >
            {isLogin ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthForm;