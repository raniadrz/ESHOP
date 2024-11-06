/* eslint-disable no-unused-vars */
import React from 'react';
import HeroSection from '../../../components/heroSection/HeroSection';
import Layout from '../../../components/layout/Layout';
import './About.css'; // Import CSS file for styling

function About() {
  return (
    <Layout>
      <HeroSection />
      <div className="About-container">
        <h1>About Us</h1>
        <p>Welcome to our <b> Pet Paradise</b>, where we celebrate the love and companionship that pets bring to our lives!</p>
        <p>At <b>Pet Paradise</b>, we understand the unique bond between pets and their owners. That's why we're dedicated to providing top-quality products and services to enhance the well-being of your furry friends.</p>
        <p>Our mission is to create a one-stop destination for all your pet needs, whether it's premium pet food, stylish accessories, comfortable bedding, or expert advice on pet care.</p>
        <p>With a team of passionate pet lovers and industry experts, we strive to exceed your expectations and make every shopping experience enjoyable and convenient.</p>
        <p>Thank you for choosing <strong>Pet Paradise</strong> as your trusted partner in pet care. Together, let's create a happier and healthier life for our beloved pets!</p>
      </div>
    </Layout>
  );
}

export default About;
