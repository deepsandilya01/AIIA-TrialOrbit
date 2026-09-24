import React from 'react';
import './PublicPages.css';
import { Mail, Phone, MapPin } from 'lucide-react';

const Contact = () => {
  return (
    <div className="public-page">
      <h1 className="page-title">Contact Us</h1>
      <p className="page-subtitle">Get in touch with the CTMS Support Team.</p>
      
      <div className="contact-container">
        <div className="contact-info card">
          <h2>Clinical Research / CTMS Support</h2>
          
          <div className="contact-item">
            <Mail className="contact-icon" />
            <div>
              <h3>Email</h3>
              <p>ctms-support@example.org</p>
              <span className="placeholder-note">(Placeholder for demonstration)</span>
            </div>
          </div>
          
          <div className="contact-item">
            <Phone className="contact-icon" />
            <div>
              <h3>Phone</h3>
              <p>+91 11 2695 0401</p>
            </div>
          </div>
          
          <div className="contact-item">
            <MapPin className="contact-icon" />
            <div>
              <h3>Address</h3>
              <p>
                All India Institute of Ayurveda (AIIA)<br/>
                Mathura Road, Gautampuri<br/>
                Sarita Vihar, New Delhi - 110076
              </p>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container card">
          <h2>Send a Message</h2>
          <form className="contact-form" onSubmit={(e) => e.preventDefault()}>
            <div className="form-group">
              <label>Name</label>
              <input type="text" placeholder="Your Name" />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Your Email" />
            </div>
            <div className="form-group">
              <label>Subject</label>
              <input type="text" placeholder="Subject" />
            </div>
            <div className="form-group">
              <label>Message</label>
              <textarea rows="5" placeholder="Your Message"></textarea>
            </div>
            <button type="button" className="btn btn-primary" onClick={() => alert('Demo contact form submitted.')}>Send Message</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
