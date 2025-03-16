import React, { useState } from 'react';
import { UserRole, LoginCredentials } from '../types/auth';
import '../styles/LoginForm.css';
import { KeyRound, User, ArrowLeft, Eye, Computer, Stethoscope, Camera } from 'lucide-react';
import { validateUser } from '../database/userService';

interface LoginFormProps {
  role: UserRole;
  onLogin: (user: { username: string; firstName: string; lastName: string; role: UserRole }) => void;
  onBack: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onLogin, onBack }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    console.log("Logging in with:", username, password, "Role:", role);

    const user = await validateUser(username, password, role);
    if (user) {
      console.log("Login successful:", user);
      onLogin(user);
      setError('');
    } else {
      console.error("Login failed for:", username);
      setError('Invalid username, password, or role');
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
        <div className="login-header">
          <h1>KeratoScan AI</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <button type="button" onClick={onBack} className="back-button">
            <ArrowLeft size={20} />
            <span>Back</span>
          </button>
          
          <div className="role-header">
            {getRoleIcon()}
            <h2>{getRoleTitle()}</h2>
          </div>
          
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
