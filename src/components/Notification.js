// src/components/Notification.js

import React, { useEffect } from 'react';
import './Notification.css';

function Notification({ message, show, onClose }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // Notification duration

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  return (
    <div className={`notification ${show ? 'show' : ''}`}>
      <p>{message}</p>
    </div>
  );
}

export default Notification;
