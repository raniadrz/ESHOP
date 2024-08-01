/* eslint-disable no-unused-vars */
import React, { useContext } from 'react';
import Layout from '../../../components/layout/Layout';
import myContext from '../../../context/myContext';
import './Contact.css'; // Import CSS file for styling
import contactImage from './contactUs.png';
import mapImage from './loc.png';

function Contact() {
  const context = useContext(myContext);
  const { mode } = context;

  return (
    <Layout>
      {/* HeroSection */}
      <div className="Contact-hero">
        <img src={contactImage} alt="Contact" className="hero-image" />
      </div>
      <br />
      <div className="Contact-container">
        <div className="Contact-details">
          <h1>Contact us..</h1>
          <br />
          <h2 style={{ color: mode === 'dark' ? 'white' : '' }}>
            GUEST SUPPORT AND COFFEE QUESTIONS
          </h2>
          <a href="mailto:guestsupport@example.com">guestsupport@example.com</a>
          <h2 style={{ color: mode === 'dark' ? 'white' : '' }}>PRESS INQUIRIES</h2>
          <a href="mailto:press@example.com">press@example.com</a>
          <h2 style={{ color: mode === 'dark' ? 'white' : '' }}>
            BRAND PARTNERSHIP INQUIRIES
          </h2>
          <a href="mailto:partnerships@example.com">partnerships@example.com</a>
          <h2 style={{ color: mode === 'dark' ? 'white' : '' }}>
            TRADE SHOW INQUIRIES
          </h2>
          <a href="mailto:tradeshow@example.com">tradeshow@example.com</a>
          <h2 style={{ color: mode === 'dark' ? 'white' : '' }}>
            DONATION INQUIRIES
          </h2>
          <a href="mailto:donations@example.com">donations@example.com</a>
          <h2 style={{ color: mode === 'dark' ? 'white' : '' }}>
            CORPORATE GIFTING INQUIRIES
          </h2>
          <a href="mailto:corporategifting@example.com">
            corporategifting@example.com
          </a>
        </div>

        <div className="Contact-map">
          {/* Map image with address and phone numbers */}
          <img src={mapImage} alt="Map" className="map-image" />
          <div
            className="contact-info"
            style={{ color: mode === 'dark' ? 'white' : '' }}
          >
            <p>1234 Pet Street</p>
            <p>City, State, Zip Code</p>
            <p>Phone: 123-456-7890</p>
            <p>Email: contact@example.com</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Contact;
