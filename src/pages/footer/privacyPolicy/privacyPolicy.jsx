/* eslint-disable no-unused-vars */
// example for Privacy Policy page
import React from 'react';
import Layout from '../../../components/layout/Layout';
import './PrivacyPolicy.css'; // Import CSS file for styling

function PrivacyPolicy() {
  return (
    <Layout>
    <div className="privacy-policy-container">
      <h1>Privacy Policy</h1>
      <p>
        Welcome to Pet Paradise! We are committed to protecting your privacy and ensuring the security of your personal information. This privacy policy outlines how we collect, use, share, and protect your information when you use our website.
      </p>

      <h2>1. Types of Information Collected:</h2>
      <p>
        We collect two types of information:
        <ul>
          <li>Personal information: This includes your name, address, email address, phone number, and payment details.</li>
          <li>Non-personal information: This includes your IP address, browser type, device information, and website usage data.</li>
        </ul>
      </p>

      <h2>2. Collection Methods:</h2>
      <p>
        We collect information:
        <ul>
          <li>Directly from you when you register an account, place an order, or contact us.</li>
          <li>Automatically through cookies and similar technologies when you use our website.</li>
        </ul>
      </p>

      {/* Add more sections for Use of Collected Information, Data Sharing and Disclosure, etc. */}

      <h2>10. Compliance with Regulations:</h2>
      <p>
        We comply with relevant data protection laws and regulations, including GDPR and CCPA.
      </p>

      <h2>11. Contact Information:</h2>
      <p>
        If you have any questions or concerns about our privacy practices, please contact us at <a href="mailto:contact@email.com">contact@email.com</a>.
      </p>
    </div>
    </Layout>
  );
}

export default PrivacyPolicy;
