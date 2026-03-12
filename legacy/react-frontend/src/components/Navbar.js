import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/images/KLA_logo.jpg';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
      <div className="header-container">
        <div className="logo-brand">
          <Link to="/" className="logo-container">
            <img src={logo} alt="Kinsley Law Advocates Logo" className="logo-image" />
            <div className="brand-name">
              <span className="brand-text">KINSLEY LAW ADVOCATES</span>
            </div>
          </Link>
        </div>

        <div className="nav-container">
          <div className={`hamburger-menu ${mobileMenuOpen ? 'active' : ''}`} onClick={toggleMobileMenu}>
            <span className="bar"></span>
            <span className="bar"></span>
            <span className="bar"></span>
          </div>

          <nav className={`main-nav ${mobileMenuOpen ? 'mobile-open' : ''}`}>
            <ul className="nav-links">
              <li><Link to="/" onClick={() => setMobileMenuOpen(false)}>Home</Link></li>
              <li><Link to="/about" onClick={() => setMobileMenuOpen(false)}>About</Link></li>
              <li><Link to="/services" onClick={() => setMobileMenuOpen(false)}>Services</Link></li>
              <li><Link to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Navbar;