import React from 'react';
import './ProgressBar.css'

const ProgressBar = ({ title, value, key }) => {
  // Ensure the value is within the range [0, 10]
  const normalizedValue = Math.min(Math.max(value, 0), 10);

  // Calculate the width as a percentage
  const widthPercentage = (normalizedValue / 10) * 100;

  return (
    <>
    <div className='div-container'>
      <div>{title}</div>
      <div>{value}/10</div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${widthPercentage}%` }}
        ></div>
      </div>
    </div>
    
    </>
    
  );
};

export default ProgressBar;
