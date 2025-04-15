import React from "react";
import { Link } from "react-router-dom";
import "../../Styles/Home.css";

// Import images with proper paths
import heroImage from "./images/girlHoldingADog.png";
import footPrint from "./images/footPrint.png";

const HomeLandingContainer = (props) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  
  return (
    <div className="hero-section">
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            Finding Forever Homes <span className="highlight">Together</span>
          </h1>
          <p className="hero-subtitle">
            Whether you're looking to adopt a new companion or reunite with a lost friend,
            we're here to make the journey simple, supportive, and joyful.
          </p>
          <div className="hero-buttons">
            <Link to="/pets" className="primary-button" onClick={scrollToTop}>
              <span>Adopt a Pet</span>
              <img src={footPrint} alt="footprint" className="button-icon" />
            </Link>
            <Link to="/find" className="secondary-button" onClick={scrollToTop}>
              <span>Find a Pet</span>
              <img src={footPrint} alt="footprint" className="button-icon" />
            </Link>
          </div>
        </div>
        <div className="hero-image">
          <img 
            src={heroImage} 
            alt="Happy pet and owner" 
            className="bounce-animation"
          />
        </div>
      </div>
      <div className="hero-scrolldown">
        <div className="mouse">
          <div className="wheel"></div>
        </div>
        <div>
          <span className="scroll-arrows">
            ↓
          </span>
        </div>
      </div>
    </div>
  );
};

export default HomeLandingContainer;