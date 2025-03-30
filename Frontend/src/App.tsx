import React, { useState, useRef, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserRole, LoginCredentials, AuthState } from './types/auth';
import LoginForm from './components/LoginForm';
import RoleSelector from './components/RoleSelector';
import ITDashboard from './components/ITDashboard';
import TopographerDashboard from './components/TopographerDashboard';
import DoctorDashboard from './components/DoctorDashboard';
import AboutUs from './components/AboutUs';
import PrivacyPolicy from './components/PrivacyPolicy';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import './index.css';
import './styles/transitions.css';

function App() {
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [auth, setAuth] = useState<AuthState>({
    isAuthenticated: false,
    role: null,
    username: null,
    firstName: null, 
    lastName: null, 
  });  
  
  // Add refs for CSSTransition
  const nodeRef = useRef(null);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
  };

  const handleLogin = (user: { username: string; firstName: string; lastName: string; role: UserRole }) => {
    const userData = {
      isAuthenticated: true,
      role: user.role,
      username: user.username,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    setAuth(userData);
    localStorage.setItem('auth', JSON.stringify(userData)); // Save to localStorage
  };

  useEffect(() => {
    const storedAuth = localStorage.getItem('auth');
    if (storedAuth) {
      setAuth(JSON.parse(storedAuth));
    }
  }, []);
  

  const handleBack = () => {
    setSelectedRole(null);
  };

  const handleLogout = () => {
    setAuth({
      isAuthenticated: false,
      role: null,
      username: null,
      firstName: null,
      lastName: null,
    });
    setSelectedRole(null);
    localStorage.removeItem('auth'); // Remove from localStorage
  };
  
  const renderContent = () => {
    if (auth.isAuthenticated) {
      switch (auth.role) {
        case 'it':
          return <ITDashboard onLogout={handleLogout} />;
        case 'doctor':
          return <DoctorDashboard onLogout={handleLogout} />;
        case 'topographer':
          return <TopographerDashboard onLogout={handleLogout} />;
        default:
          return null;
      }
    }

    return selectedRole ? (
      <LoginForm 
        role={selectedRole} 
        onLogin={handleLogin} 
        onBack={handleBack}
      />
    ) : (
      <RoleSelector onRoleSelect={handleRoleSelect} />
    );
  };

  const getKey = () => {
    if (auth.isAuthenticated) return `dashboard-${auth.role}`;
    return selectedRole ? `login-${selectedRole}` : 'role-selector';
  };

  const showFooter = !auth.isAuthenticated;

  return (
    <Router>
      <div className="min-h-screen bg-gray-100 flex flex-col">
      {auth.isAuthenticated && (
          <Navbar 
            role={auth.role as UserRole} 
            onLogout={handleLogout} 
            username={`${auth.firstName} ${auth.lastName}`}
          />
        )}

        <Routes>
          <Route path="/about" element={<AboutUs />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/" element={
            <div className="flex-grow">
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={getKey()}
                  timeout={300}
                  classNames="page-transition"
                  unmountOnExit
                  nodeRef={nodeRef}
                >
                  {(state) => (
                    <div ref={nodeRef}>
                      {renderContent()}
                    </div>
                  )}
                </CSSTransition>
              </SwitchTransition>
              {showFooter && <Footer />}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
