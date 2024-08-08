import React from "react";
import './401-modern.css';

const Error401Modern = () => {
  const loadingStyle = {
    height: '50px',
    width: '100%',  
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop:"100px"
  };

  const spinnerStyle = {
    border: '4px solid rgba(0, 0, 0, 0.1)',
    borderTop: '4px solid #3498db',
    borderRadius: '50%',
    width: '70px',
    height: '70px',
    animation: 'spin 1s linear infinite',
  };

  const textStyle = {
    marginLeft: '10px',
  };

  return (
    <div style={loadingStyle}>
      <div style={spinnerStyle}></div>
      <p style={textStyle}>Please wait for authentication</p>
    </div>
  );
};

export default Error401Modern;
