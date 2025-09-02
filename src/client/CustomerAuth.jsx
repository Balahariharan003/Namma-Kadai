import AuthForm from './AuthForm';
import './css/Auth.css';

const CustomerAuth = () => {
  return (
     <div className="auth-page customer-auth">
          <AuthForm userType="customer" />
    </div>
  );
};




export default CustomerAuth;