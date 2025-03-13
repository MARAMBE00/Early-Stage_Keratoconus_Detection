import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="site-footer">
      <div className="footer-content">

        {/* KeratoScan AI */}
        <div className="footer-section">
          <h3>KeratoScan AI</h3>
          <p>Providing advanced eye care diagnostics and treatment with cutting-edge AI technology.</p>
        </div>

        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="quick-links">
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
          </ul>
        </div>
        
        {/* Contact Us */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="contact-list">
            <li>
              <Phone size={16} />
              <span>+94 (77) 123-4567</span>
            </li>
            <li>
              <Mail size={16} />
              <span>contact@keratoscanai.com</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>123 Wallewaththa, Colombo</span>
            </li>
          </ul>
        </div>
      </div>
      
      {/* All rights reserved */}
      <div className="footer-bottom">
        <p>© {currentYear} KeratoScan AI. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;