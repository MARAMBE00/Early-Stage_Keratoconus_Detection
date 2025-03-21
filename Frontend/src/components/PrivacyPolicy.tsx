import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText, FileLock ,Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import '../styles/PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "Feb 20, 2025";
  
  return (
    <div className="privacy-page">
      <div className="privacy-header">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1>Privacy Policy</h1>
          <p className="subtitlePP">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="privacy-content container">
        <div className="privacy-overview">
          <div className="overview-icon">
            <Shield size={40} />
          </div>
          <div>
            <h2>Our Commitment to Privacy</h2>
            <p>
              At Medical Facility, we take your privacy seriously. This Privacy Policy explains how we collect, 
              use, disclose, and safeguard your information when you visit our website or use our services.
              Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, 
              please do not access the site.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2>Information We Collect</h2>
          <div className="section-icon">
            <FileText size={24} />
          </div>
          <div className="section-content">
            <h3>Personal Data</h3>
            <p>
              We may collect personal identification information from you, including:
            </p>
            <ul>
              <li>Name, date of birth, and contact information</li>
              <li>Corneal topography images and diagnostic results</li>
            </ul>
          </div>
        </div>

        <div className="policy-section">
          <h2>How We Use Your Information</h2>
          <div className="section-icon">
            <Eye size={24} />
          </div>
          <div className="section-content">
            <p>
              We may use the information we collect from you for the following purposes:
            </p>
            <ul>
              <li>To provide and improve our medical services</li>
              <li>To personalize user experience</li>
              <li>To improve our website and service offerings</li>
              <li>To comply with legal and regulatory requirements</li>
              <li>For research and development of our AI diagnostic systems</li>
            </ul>
          </div>
        </div>

        <div className="policy-section">
          <h2>Data Security</h2>
          <div className="section-icon">
            <Lock size={24} />
          </div>
          <div className="section-content">
            <p>
              We implement a variety of security measures to maintain the safety of your personal information:
            </p>
            <ul>
              <li>Access to patient information is restricted to authorized personnel only</li>
              <li>Regular security audits and vulnerability assessments are conducted</li>
              <li>Staff undergo regular training on data privacy and security protocols</li>
            </ul>
          </div>
        </div>

        <div className="policy-section">
          <h2>Sharing Your Information</h2>
          <div className="section-icon">
            <FileLock size={24} />
          </div>
          <div className="section-content">
            <p>
              We do not sell, trade, or rent users' personal identification information to others.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2>Your Rights</h2>
          <div className="section-icon">
            <Scale size={24} />
          </div>
          <div className="section-content">
            <p>
              You may have certain rights regarding your personal information:
            </p>
            <ul>
              <li>The right to access your personal information</li>
              <li>The right to correct inaccurate information</li>
              <li>The right to request deletion of your information</li>
              <li>The right to restrict or object to processing</li>
              <li>The right to data portability</li>
              <li>The right to withdraw consent</li>
            </ul>
            <p>
              To exercise these rights, please contact us.
            </p>
          </div>
        </div>

      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;