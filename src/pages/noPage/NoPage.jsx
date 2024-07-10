import React from 'react';
import imageSrc from './404-error-web-template-with-cute-dog.jpeg'; // Import your image
import './NoPage.css'; // Import CSS file for styling

function NoPage() {
  return (
    <div className="full-page">
      <img src={imageSrc} alt="No Page" /> {/* Insert your image here */}
    </div>
  );
}

export default NoPage;
