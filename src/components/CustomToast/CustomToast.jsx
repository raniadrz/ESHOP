import React, { useEffect } from 'react';
import './CustomToast.css';

const CustomToast = ({ type, message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (onClose) {
        onClose();
      }
    }, 80);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`custom-toast ${type}`}>
      <div className="toast-left-bar"></div>
      <div className="toast-content">
        <div className="toast-header">
          <div className="toast-icon">
            {type === 'success' ? (
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="#4CAF50"
                  d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path
                  fill="#F44336"
                  d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z"
                />
              </svg>
            )}
          </div>
          <h3>{type === 'success' ? 'Success' : 'Error'}</h3>
        </div>
        <p>{message}</p>
      </div>
      <button 
        className="toast-close" 
        onClick={onClose}
        aria-label="Close notification"
      >
        CLOSE
      </button>
    </div>
  );
};

export default CustomToast;