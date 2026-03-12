import React from 'react';

const About = () => {
  return (
    <div className="about">
      <div className="page-header">
        <h1>About Our Firm</h1>
      </div>
      
      <section className="about-content">
        <div className="about-text">
          <h2>Our Story</h2>
          <p>Kinsley Law Advocates was founded in 2010 with a vision to provide exceptional legal services with integrity and dedication. Over the years, we have grown into a trusted legal partner for individuals and businesses alike.</p>
          
          <h2>Our Mission</h2>
          <p>Our mission is to deliver high-quality legal representation while maintaining the highest ethical standards. We strive to ensure access to justice for all our clients and build long-lasting relationships based on trust and results.</p>
        </div>
        
        <div className="about-image">
          {/* Placeholder for firm image */}
          <div className="image-placeholder">Firm Image</div>
        </div>
      </section>
      
      <section className="team-section">
        <h2>Our Legal Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <div className="member-image">Image</div>
            <h3>Jane Kinsley</h3>
            <h4>Founding Partner</h4>
            <p>Specializing in corporate law with over 20 years of experience.</p>
          </div>
          <div className="team-member">
            <div className="member-image">Image</div>
            <h3>Robert Johnson</h3>
            <h4>Senior Partner</h4>
            <p>Expert in family law and civil litigation.</p>
          </div>
          <div className="team-member">
            <div className="member-image">Image</div>
            <h3>Amanda Lewis</h3>
            <h4>Associate</h4>
            <p>Specializing in real estate and property law.</p>
          </div>
          <div className="team-member">
            <div className="member-image">Image</div>
            <h3>Michael Chen</h3>
            <h4>Associate</h4>
            <p>Criminal defense and civil rights advocate.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
