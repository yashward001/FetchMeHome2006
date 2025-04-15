import React from 'react';

const FindPetButton = ({ onClick, size }) => {
  // Define button sizes
  const buttonSize = size === 'large' ? 'btn-large' : size === 'small' ? 'btn-small' : '';
  
  // PawPrint SVG inline to avoid external imports
  const PawPrintIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path d="M8.5,2C9.33,2 10,2.67 10,3.5C10,4.33 9.33,5 8.5,5C7.67,5 7,4.33 7,3.5C7,2.67 7.67,2 8.5,2M14.5,2C15.33,2 16,2.67 16,3.5C16,4.33 15.33,5 14.5,5C13.67,5 13,4.33 13,3.5C13,2.67 13.67,2 14.5,2M18.5,7C19.33,7 20,7.67 20,8.5C20,9.33 19.33,10 18.5,10C17.67,10 17,9.33 17,8.5C17,7.67 17.67,7 18.5,7M4.5,7C5.33,7 6,7.67 6,8.5C6,9.33 5.33,10 4.5,10C3.67,10 3,9.33 3,8.5C3,7.67 3.67,7 4.5,7M11.5,11C13.43,11 15,12.57 15,14.5C15,16.43 13.43,18 11.5,18C9.57,18 8,16.43 8,14.5C8,12.57 9.57,11 11.5,11Z" />
    </svg>
  );
  
  return (
    <div className="find-pet-button-container">
      <button 
        onClick={onClick} 
        className={`find-pet-button ${buttonSize}`}
      >
        <span>Find a Pet</span>
        <span className="button-icon">
          <PawPrintIcon />
        </span>
      </button>
    </div>
  );
};

export default FindPetButton;