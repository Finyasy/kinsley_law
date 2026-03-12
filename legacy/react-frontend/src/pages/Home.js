import React from 'react';
import { Link } from 'react-router-dom';
import ValueAnimation from '../components/ValueAnimation';

const Home = () => {
  return (
    <div className="home">
      <div className="hero">
        <div className="hero-content">
          <ValueAnimation />
          <p className="hero-tagline">Providing professional legal services with uncompromising dedication to our clients' success.</p>
          <div className="hero-buttons">
            <Link to="/contact">
              <button className="cta-button primary">Contact Us</button>
            </Link>
            <Link to="/services">
              <button className="cta-button secondary">Our Services</button>
            </Link>
          </div>
        </div>
      </div>
      
      <section className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <span className="stat-number">15+</span>
            <span className="stat-label">Years Experience</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Cases Won</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">98%</span>
            <span className="stat-label">Client Satisfaction</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">12</span>
            <span className="stat-label">Expert Attorneys</span>
          </div>
        </div>
      </section>
      
      <section className="services-preview">
        <div className="section-heading">
          <h2>Our Practice Areas</h2>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">⚖️</div>
            <h3>Family Law</h3>
            <p>Expert guidance for divorce, custody, and family matters. We handle sensitive cases with compassion and discretion.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🏢</div>
            <h3>Corporate Law</h3>
            <p>Comprehensive legal solutions for businesses of all sizes, from startups to established corporations.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🏠</div>
            <h3>Real Estate</h3>
            <p>Professional legal services for property transactions, contracts, and dispute resolution.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">⚔️</div>
            <h3>Criminal Defense</h3>
            <p>Powerful and dedicated representation for all types of criminal cases and investigations.</p>
          </div>
        </div>
      </section>
      
      <section className="testimonials">
        <div className="section-heading">
          <h2>What Our Clients Say</h2>
        </div>
        <div className="testimonial-grid">
          <div className="testimonial">
            <p>"The team at Kinsley Law Advocates provided exceptional representation during my complex divorce case. Their attention to detail and compassionate approach made a difficult time much easier to navigate. I couldn't be more satisfied with the outcome."</p>
            <div className="testimonial-author">
              <div className="author-avatar">JS</div>
              <div className="author-info">
                <h4>John Smith</h4>
                <span className="author-title">Family Law Client</span>
              </div>
            </div>
          </div>
          <div className="testimonial">
            <p>"As a small business owner, I needed legal guidance that was both expert and accessible. The corporate law team at Kinsley exceeded all expectations, helping me navigate regulations while scaling my company. Their strategic advice has been invaluable."</p>
            <div className="testimonial-author">
              <div className="author-avatar">SJ</div>
              <div className="author-info">
                <h4>Sarah Johnson</h4>
                <span className="author-title">Corporate Client</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
