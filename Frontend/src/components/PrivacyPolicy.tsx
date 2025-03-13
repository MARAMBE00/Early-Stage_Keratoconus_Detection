import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import '../styles/PrivacyPolicy.css';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = "June 15, 2024";
  
  return (
    <div className="privacy-page">
      <div className="privacy-header">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1>Privacy Policy</h1>
          <p className="subtitle">Last Updated: {lastUpdated}</p>
        </div>
      </div>

      <div className="privacy-content container">
        <div className="privacy-overview">
          <div className="overview-icon">
            <Shield size={48} />
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
              We may collect personal identification information from you in a variety of ways, including, but not limited to:
            </p>
            <ul>
              <li>Name, date of birth, and contact information</li>
              <li>Medical history and insurance information</li>
              <li>Corneal topography images and diagnostic results</li>
              <li>Treatment records and prescriptions</li>
              <li>Payment details and billing information</li>
            </ul>

            <h3>Non-Personal Data</h3>
            <p>
              We may also collect non-personal identification information about users whenever they interact with our site. 
              This may include:
            </p>
            <ul>
              <li>Browser name and type</li>
              <li>Technical information about users' means of connection to our site</li>
              <li>Operating system and the Internet service providers utilized</li>
              <li>Other similar information</li>
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
              <li>To process payments and billing</li>
              <li>To communicate with you about appointments, treatments, and follow-ups</li>
              <li>To comply with legal and regulatory requirements</li>
              <li>For research and development of our AI diagnostic systems (using de-identified data)</li>
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
              <li>All supplied sensitive information is transmitted via Secure Socket Layer (SSL) technology</li>
              <li>All patient data is stored in HIPAA-compliant databases with encryption at rest and in transit</li>
              <li>Access to patient information is restricted to authorized personnel only</li>
              <li>Regular security audits and vulnerability assessments are conducted</li>
              <li>Staff undergo regular training on data privacy and security protocols</li>
            </ul>
          </div>
        </div>

        <div className="policy-section">
          <h2>Sharing Your Information</h2>
          <div className="section-content">
            <p>
              We do not sell, trade, or rent users' personal identification information to others. We may share generic 
              aggregated demographic information not linked to any personal identification information regarding visitors 
              and users with our business partners, trusted affiliates, and advertisers for the purposes outlined above.
            </p>
            <p>
              We may share your information with:
            </p>
            <ul>
              <li>Healthcare providers directly involved in your care</li>
              <li>Insurance companies for billing purposes</li>
              <li>Third-party service providers who assist us in operating our website and conducting our business</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </div>
        </div>

        <div className="policy-section">
          <h2>Your Rights</h2>
          <div className="section-content">
            <p>
              Depending on your location, you may have certain rights regarding your personal information:
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
              To exercise these rights, please contact us using the information provided at the end of this policy.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2>Changes to This Privacy Policy</h2>
          <div className="section-content">
            <p>
              Medical Facility has the discretion to update this privacy policy at any time. When we do, we will revise 
              the updated date at the top of this page. We encourage users to frequently check this page for any changes 
              to stay informed about how we are helping to protect the personal information we collect.
            </p>
          </div>
        </div>

        <div className="policy-section">
          <h2>Contact Us</h2>
          <div className="section-content">
            <p>
              If you have any questions about this Privacy Policy, the practices of this site, or your dealings with this site, 
              please contact us at:
            </p>
            <div className="contact-info">
              <p>Medical Facility</p>
              <p>123 Medical Center Dr, Healthcare City</p>
              <p>Email: privacy@medicalfacility.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicy;