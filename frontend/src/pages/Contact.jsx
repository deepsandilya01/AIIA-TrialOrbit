import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle2 } from 'lucide-react';
import Button from '../components/common/Button';
import DemoBadge from '../components/common/DemoBadge';
import { useToast } from '../context/ToastContext';
import './PublicPages.css';

const Contact = () => {
  const { success, error } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      error('Please complete all required contact fields.');
      return;
    }
    setSubmitted(true);
    success('Your inquiry has been logged with the CTMS Administration Desk.');
  };

  return (
    <div className="public-page">
      <div className="flex items-center gap-2 mb-1">
        <h1 className="page-title">Investigator & Participant Support</h1>
        <DemoBadge />
      </div>
      <p className="page-subtitle">Get in touch with the AIIA Clinical Trial Secretariat, Pharmacovigilance Helpdesk, or Technical Team.</p>
      
      <div className="contact-container">
        <div className="contact-info card p-5">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Clinical Trial Oversight Secretariat</h2>
          
          <div className="contact-item">
            <Mail className="contact-icon" />
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Official Email</h3>
              <p className="text-sm">ctms.support@aiia.gov.in</p>
              <span className="text-xs text-muted">24-hour SLA for Pharmacovigilance queries</span>
            </div>
          </div>
          
          <div className="contact-item">
            <Phone className="contact-icon" />
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Secretariat Helpline</h3>
              <p className="text-sm">+91 11 2695 0401 / Ext. 214</p>
              <span className="text-xs text-muted">Mon–Fri: 09:00 – 17:30 IST</span>
            </div>
          </div>
          
          <div className="contact-item">
            <MapPin className="contact-icon" />
            <div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Campus Address</h3>
              <p className="text-sm text-secondary">
                All India Institute of Ayurveda (AIIA)<br/>
                Clinical Research Unit, Academic Block<br/>
                Mathura Road, Gautampuri, Sarita Vihar<br/>
                New Delhi - 110076, India
              </p>
            </div>
          </div>
        </div>
        
        <div className="contact-form-container card p-5">
          <h2 style={{ fontSize: '1.25rem', marginBottom: '1.25rem' }}>Transmit Official Inquiry</h2>
          {submitted ? (
            <div className="p-4 bg-secondary rounded text-center">
              <CheckCircle2 size={36} className="text-success mb-2" style={{ margin: '0 auto' }} />
              <h3 style={{ fontSize: '1.1rem' }}>Inquiry Submitted Successfully</h3>
              <p className="text-xs text-secondary mt-1">Reference Ticket #CRU-2026-9481 generated. An investigator liaison will contact you shortly.</p>
              <Button variant="outline" size="sm" className="mt-3" onClick={() => setSubmitted(false)}>
                Send Another Message
              </Button>
            </div>
          ) : (
            <form className="contact-form flex flex-col gap-3" onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="text-xs font-semibold uppercase text-secondary block mb-1">Your Full Name <span className="text-danger">*</span></label>
                <input 
                  type="text" 
                  placeholder="Prof. / Dr. / Shri Name" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-semibold uppercase text-secondary block mb-1">Institutional Email <span className="text-danger">*</span></label>
                <input 
                  type="email" 
                  placeholder="name@institution.ac.in" 
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required 
                />
              </div>

              <div className="form-group">
                <label className="text-xs font-semibold uppercase text-secondary block mb-1">Inquiry Domain</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                >
                  <option value="Protocol Submission">New Protocol IEC Evaluation</option>
                  <option value="Site Accreditation">Multi-Centre Site Onboarding</option>
                  <option value="Pharmacovigilance">Pharmacovigilance / SAE Reporting</option>
                  <option value="Technical Support">Platform Technical Support</option>
                </select>
              </div>

              <div className="form-group">
                <label className="text-xs font-semibold uppercase text-secondary block mb-1">Inquiry Details <span className="text-danger">*</span></label>
                <textarea 
                  rows="4" 
                  placeholder="Provide protocol numbers, site IDs, or detailed description..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required
                ></textarea>
              </div>

              <Button type="submit" variant="primary" icon={<Send size={15} />}>
                Transmit Inquiry
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contact;
