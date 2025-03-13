import React from 'react';
import { ArrowLeft, Award, Users, HeartPulse, Microscope } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from './Footer';
import '../styles/AboutUs.css';

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
              src="https://images.unsplash.com/photo-1581595219315-a187dd40c322?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Modern medical facility" 
            />
          </div>
          <div className="section-content">
            <h2>Our Story</h2>
            <p>
              Founded in 2015, our medical facility has been at the forefront of integrating 
              artificial intelligence with ophthalmology. What began as a small research project 
              has grown into a comprehensive eye care center that serves thousands of patients annually.
            </p>
            <p>
              Our journey started when a team of ophthalmologists and AI researchers came together 
              with a shared vision: to make early detection of keratoconus and other corneal 
              conditions more accessible, accurate, and efficient.
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
              src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
              alt="Medical professionals collaborating" 
            />
          </div>
          <div className="section-content">
            <h2>Our Approach</h2>
            <p>
              At our facility, we combine cutting-edge AI technology with the expertise of 
              experienced ophthalmologists to provide the most accurate diagnoses and effective 
              treatment plans for our patients.
            </p>
            <p>
              Our proprietary AI system has been trained on thousands of corneal topography 
              images, enabling it to detect subtle patterns that might indicate early stages 
              of keratoconus and other corneal abnormalities with remarkable precision.
            </p>
            <p>
              This technology-enhanced approach allows us to intervene earlier, potentially 
              slowing disease progression and preserving vision for longer periods.
            </p>
          </div>
        </section>

        <section className="team-section">
          <h2>Our Leadership Team</h2>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img 
                  src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Dr. Sarah Johnson" 
                />
              </div>
              <h3>Dr. Sarah Johnson</h3>
              <p className="member-title">Chief Medical Officer</p>
              <p>Board-certified ophthalmologist with over 15 years of experience in corneal disorders.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img 
                  src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Dr. Michael Chen" 
                />
              </div>
              <h3>Dr. Michael Chen</h3>
              <p className="member-title">Director of AI Research</p>
              <p>PhD in Computer Science with specialization in medical image processing and machine learning.</p>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img 
                  src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80" 
                  alt="Dr. Emily Rodriguez" 
                />
              </div>
              <h3>Dr. Emily Rodriguez</h3>
              <p className="member-title">Head of Clinical Operations</p>
              <p>Experienced healthcare administrator focused on optimizing patient care workflows.</p>
            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;