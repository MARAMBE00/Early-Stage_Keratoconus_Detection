import React from 'react';
import { ArrowLeft, Award, Users, HeartPulse, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import '../styles/AboutUs.css';
import ourStory from '../images/ourStory.jpg';
import ourApproach from '../images/ourApproach.jpg';

const AboutUs: React.FC = () => {
  return (
    <div className="about-page">
      <div className="about-header">
        <div className="container">
          <Link to="/" className="back-link">
            <ArrowLeft size={20} />
            <span>Back to Home</span>
          </Link>
          <h1>About Our Medical Facility</h1>
          <p className="subtitle">Leading the way in advanced eye care diagnostics</p>
        </div>
      </div>

      <div className="about-content container">
        <section className="about-section">
          <div className="section-image">
            <img 
              src={ourStory} 
              alt="Modern medical facility" 
            />
          </div>
          <div className="section-content">
            <h2>Our Story</h2>
            <p>
              Founded in 2025, our software project is dedicated to revolutionizing early-stage keratoconus detection 
              through the power of artificial intelligence. What began as a research-driven initiative has evolved 
              into an advanced diagnostic tool, leveraging corneal topography images and NASNet to enhance precision and 
              accessibility in ophthalmology.
            </p>
            <p>
              Our journey started when a team of AI researchers and medical imaging specialists came together with a shared 
              vision: to develop an intelligent, automated system that assists clinicians in the early detection of keratoconus. 
              By integrating deep learning with ophthalmic diagnostics, our software aims to provide faster, more accurate, and 
              accessible screening solutions, ultimately improving patient outcomes and advancing the future of AI-powered eye care.
            </p>
          </div>
        </section>

        <section className="values-section">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <HeartPulse size={32} />
              </div>
              <h3>Patient-Centered Care</h3>
              <p>We place our patients at the center of everything we do, ensuring personalized care that addresses individual needs.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Microscope size={32} />
              </div>
              <h3>Innovation</h3>
              <p>We continuously explore new technologies and methodologies to improve diagnosis accuracy and treatment outcomes.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Award size={32} />
              </div>
              <h3>Excellence</h3>
              <p>We strive for excellence in all aspects of our service, from clinical care to administrative processes.</p>
            </div>
            <div className="value-card">
              <div className="value-icon">
                <Users size={32} />
              </div>
              <h3>Collaboration</h3>
              <p>We believe in the power of multidisciplinary collaboration between healthcare professionals, technologists, and patients.</p>
            </div>
          </div>
        </section>

        <section className="about-section reverse">
          <div className="section-image">
            <img 
              src={ourApproach}
              alt="Medical professionals collaborating" 
            />
          </div>
          <div className="section-content">
            <h2>Our Approach</h2>
            <p>
              At our facility, we combine cutting-edge AI technology with the expertise of 
              experienced ophthalmologists to provide the most accurate diagnoses for our patients.
            </p>
            <p>
              Our proprietary AI system has been trained on thousands of corneal topography 
              images, enabling it to detect subtle patterns that might indicate early stages 
              of keratoconus.
            </p>
            <p>
              This technology-enhanced approach allows us to intervene earlier, potentially 
              slowing disease progression and preserving vision for longer periods.
            </p>
          </div>
        </section>

      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;