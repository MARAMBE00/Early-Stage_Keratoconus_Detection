import React from 'react';
import { UserRole } from '../types/auth';
import { LogOut, ShieldCheck, Stethoscope, Scan, Eye, User } from 'lucide-react';
import '../styles/Navbar.css';

interface NavbarProps {
  role: UserRole;
  onLogout: () => void;
  username?: string;
}

const Navbar: React.FC<NavbarProps> = ({ role, onLogout, username }) => {
  const getRoleIcon = () => {
    switch (role) {
      case 'it':
        return <ShieldCheck size={24} />;
      case 'doctor':
        return <Stethoscope size={24} />;
      case 'topographer':
        return <Scan size={24} />;
      default:
        return <Eye size={24} />;
    }
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'it':
        return 'IT Department';
      case 'doctor':
        return 'Doctor Dashboard';
      case 'topographer':
        return 'Topographer Dashboard';
      default:
        return '';
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="navbar-brand">
          {getRoleIcon()}
          <h1>{getRoleTitle()}</h1>
        </div>
        <div className="navbar-actions">
          {username && (
            <div className="user-info">
              <User size={20} />
              <span>{username}</span> {/* Display Full Name */}
            </div>
          )}
          <button onClick={onLogout} className="logout-button">
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;