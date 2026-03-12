import React from 'react';

const Services = () => {
  return (
    <div className="services">
      <div className="page-header">
        <h1>Our Legal Services</h1>
        <p>Comprehensive legal solutions tailored to your needs</p>
      </div>
      
      <section className="services-grid-container">
        <div className="service-item">
          <h2>Family Law</h2>
          <ul>
            <li>Divorce and Separation</li>
            <li>Child Custody and Support</li>
            <li>Adoption</li>
            <li>Domestic Violence Protection</li>
            <li>Prenuptial Agreements</li>
          </ul>
          <p>Our family law attorneys provide compassionate guidance through life's most challenging personal matters.</p>
        </div>
        
        <div className="service-item">
          <h2>Corporate Law</h2>
          <ul>
            <li>Business Formation</li>
            <li>Contract Drafting and Review</li>
            <li>Mergers and Acquisitions</li>
            <li>Corporate Governance</li>
            <li>Regulatory Compliance</li>
          </ul>
          <p>We help businesses of all sizes navigate complex legal challenges and capitalize on opportunities.</p>
        </div>
        
        <div className="service-item">
          <h2>Real Estate</h2>
          <ul>
            <li>Residential and Commercial Transactions</li>
            <li>Landlord-Tenant Disputes</li>
            <li>Property Development</li>
            <li>Land Use and Zoning</li>
            <li>Title Issues</li>
          </ul>
          <p>Our real estate attorneys ensure smooth property transactions and protect your real estate investments.</p>
        </div>
        
        <div className="service-item">
          <h2>Criminal Defense</h2>
          <ul>
            <li>Felony Defense</li>
            <li>Misdemeanor Defense</li>
            <li>DUI/DWI</li>
            <li>White Collar Crime</li>
            <li>Juvenile Cases</li>
          </ul>
          <p>Our criminal defense team provides aggressive representation to protect your rights and freedom.</p>
        </div>
        
        <div className="service-item">
          <h2>Estate Planning</h2>
          <ul>
            <li>Wills and Trusts</li>
            <li>Probate</li>
            <li>Power of Attorney</li>
            <li>Healthcare Directives</li>
            <li>Estate Administration</li>
          </ul>
          <p>We help you plan for the future and protect your legacy for generations to come.</p>
        </div>
        
        <div className="service-item">
          <h2>Personal Injury</h2>
          <ul>
            <li>Auto Accidents</li>
            <li>Slip and Fall</li>
            <li>Medical Malpractice</li>
            <li>Workplace Injuries</li>
            <li>Wrongful Death</li>
          </ul>
          <p>Our personal injury attorneys fight for the compensation you deserve after an injury.</p>
        </div>
      </section>
      
      <section className="consultation-section">
        <h2>Schedule a Consultation</h2>
        <p>Contact us today to discuss your legal needs with our experienced attorneys.</p>
        <button className="cta-button">Contact Us</button>
      </section>
    </div>
  );
};

export default Services;
