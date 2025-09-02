import AuthForm from './AuthForm';
import './css/Auth.css';

const FarmerAuth = () => {
  return (
    <div className="auth-page farmer-auth">
          <AuthForm userType="farmer" />
    </div>
  );
};

export default FarmerAuth;