import React, { useState } from 'react';
import { UserRole, LoginCredentials } from '../types/auth';
import '../styles/LoginForm.css';
import { KeyRound, User, ArrowLeft, Eye, Computer, Stethoscope, Camera } from 'lucide-react';
import axios from 'axios';

interface LoginFormProps {
  role: UserRole;
  onLogin: (credentials: LoginCredentials) => void;
  onBack: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
  
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        username,
        password,
        role,  // Ensure role is sent to backend
      });
  
      const { token, user } = response.data;

       // Prevent non-IT users from logging in
      if (user.role !== role) {
        setError("Invalid credentials for this role.");
        return;
      }

      localStorage.setItem('token', token); // Save token for authentication
      onLogin(user);
    } catch (err) {
      setError((err as any).response?.data?.message || "Login failed");
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'it':
        return 'IT Department';
      case 'doctor':
        return 'Doctor Login';
      case 'topographer':
        return 'Topographer Login';
      default:
        return 'Login';
    }
  };

  const getRoleIcon = () => {
    switch (role) {
      case 'it':
        return <Computer size={32} className="role-icon-login it-icon" />;
      case 'doctor':
        return <Stethoscope size={32} className="role-icon-login doctor-icon" />;
      case 'topographer':
        return <Camera size={32} className="role-icon-login topographer-icon" />;
      default:
        return <User size={32} className="role-icon-login" />;
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        {/* Login header */}
        <div className="login-header">
          <h1>KeratoScan AI</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          {/* Back button */}
          <button type="button" onClick={onBack} className="back-button">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          {/* Role header */}
          <div className="role-header">
            {getRoleIcon()}
            <h2>{getRoleTitle()}</h2>
          </div>
          
          {/* Username and password inputs */}
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              required
            />
          </div>
          
          <div className="input-group">
            <KeyRound className="input-icon" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
            />
            <button 
              type="button" 
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              <Eye size={18} />
            </button>
          </div>
          
          {/* Error message */}
          {error && <div className="error-message">{error}</div>}
          
          <div className="form-footer">
            <button type="submit">Login</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;