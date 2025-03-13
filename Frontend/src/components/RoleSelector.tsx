import React from 'react';
import { UserRole } from '../types/auth';
import '../styles/RoleSelector.css';
import { Computer, Stethoscope, Camera } from 'lucide-react';

interface RoleSelectorProps {
  onRoleSelect: (role: UserRole) => void;
}

const RoleSelector: React.FC<RoleSelectorProps> = ({ onRoleSelect }) => {
  return (
    <div className="role-selector">

      {/* Header */}
      <div className="login-header">
        <h1>KeratoScan AI</h1>
        <p className="tagline">Advanced Keratoconus Detection & Management System</p>
        <div className="description">
          <p>A comprehensive platform for ophthalmologists, topographers, and IT staff to collaborate on early detection and management of keratoconus using AI-powered corneal topography analysis.</p>
        </div>
      </div>
      
      {/* Roles */}
      <div className="role-container">
        <h2>Select Your Role</h2>
        <div className="role-buttons">

          {/* IT Department role */}
          <button onClick={() => onRoleSelect('it')} className="role-button">
            <div className="role-icon it-icon">
              <Computer size={30} />
            </div>
            <span>IT Department</span>
            <p className="role-description">System administration and user management</p>
          </button>

          {/* Doctor role */}
          <button onClick={() => onRoleSelect('doctor')} className="role-button">
            <div className="role-icon doctor-icon">
              <Stethoscope size={30} />
            </div>
            <span>Doctor</span>
            <p className="role-description">Review patient scans and diagnoses</p>
          </button>

          {/* Topographer role */}
          <button onClick={() => onRoleSelect('topographer')} className="role-button">
            <div className="role-icon topographer-icon">
              <Camera size={30} />
            </div>
            <span>Topographer</span>
            <p className="role-description">Upload and process corneal scans</p>
          </button>
        </div>
      </div>
    </div>
  );
}

export default RoleSelector;