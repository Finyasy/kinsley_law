import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/KLA_logo.jpg';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <div className="footer-logo">
            <Link to="/">
              <img src={logo} alt="Kinsley Law Advocates Logo" className="footer-logo-image" />
            </Link>
          </div>
          <p className="footer-tagline">Excellence in legal representation since 2010.</p>
          <div className="footer-social">
            <a href="#" className="social-icon">
              <i className="fab fa-facebook-f">f</i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-twitter">t</i>
            </a>
            <a href="#" className="social-icon">
              <i className="fab fa-linkedin-in">in</i>
            </a>
          </div>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-heading">Our Location</h3>
          <p className="footer-contact-item">
            <span className="contact-icon">📍</span>
            123 Legal Street, Suite 500<br />
            Nairobi, Kenya
          </p>
          <p className="footer-contact-item">
            <span className="contact-icon">📞</span>
            (123) 456-7890
          </p>
          <p className="footer-contact-item">
            <span className="contact-icon">✉️</span>
            info@kinsleylaw.com
          </p>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-heading">Quick Links</h3>
          <ul className="footer-links">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/about">About Us</Link></li>
            <li><Link to="/services">Practice Areas</Link></li>
            <li><Link to="/contact">Contact</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h3 className="footer-heading">Practice Areas</h3>
          <ul className="footer-links">
            <li><Link to="/services">Family Law</Link></li>
            <li><Link to="/services">Corporate Law</Link></li>
            <li><Link to="/services">Real Estate</Link></li>
            <li><Link to="/services">Criminal Defense</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {new Date().getFullYear()} Kinsley Law Advocates. All rights reserved.</p>
          <div className="footer-legal-links">
            <a href="#">Privacy Policy</a>
            <span className="footer-divider">•</span>
            <a href="#">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
