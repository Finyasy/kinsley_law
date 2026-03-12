import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    // Here you would typically send the data to your backend
    alert('Thank you for contacting us. We will get back to you shortly.');
    setFormData({
      name: '',
      email: '',
      phone: '',
      service: '',
      message: ''
    });
  };

  return (
    <div className="contact">
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Get in touch with our legal team</p>
      </div>
      
      <div className="contact-container">
        <div className="contact-info">
          <h2>Our Office</h2>
          <div className="info-item">
            <h3>Address</h3>
            <p>123 Legal Street</p>
            <p>Suite 101</p>
            <p>City, State 12345</p>
          </div>
          
          <div className="info-item">
            <h3>Phone</h3>
            <p>(123) 456-7890</p>
          </div>
          
          <div className="info-item">
            <h3>Email</h3>
            <p>info@kinsleylaw.com</p>
          </div>
          
          <div className="info-item">
            <h3>Hours</h3>
            <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
            <p>Saturday - Sunday: Closed</p>
          </div>
        </div>
        
        <div className="contact-form">
          <h2>Send Us a Message</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="service">Service Needed</label>
              <select
                id="service"
                name="service"
                value={formData.service}
                onChange={handleChange}
                required
              >
                <option value="">Select a Service</option>
                <option value="family">Family Law</option>
                <option value="corporate">Corporate Law</option>
                <option value="realestate">Real Estate</option>
                <option value="criminal">Criminal Defense</option>
                <option value="estate">Estate Planning</option>
                <option value="injury">Personal Injury</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label htmlFor="message">Your Message</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows="5"
                required
              ></textarea>
            </div>
            
            <button type="submit" className="submit-button">Send Message</button>
          </form>
        </div>
      </div>
      
      <div className="map-section">
        <h2>Find Us</h2>
        <div className="map-placeholder">
          {/* Map will be integrated here */}
          <p>Map goes here</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;
