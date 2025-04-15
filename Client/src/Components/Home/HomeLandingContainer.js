import React from "react";
import girlHoldingADog from "./images/girlHoldingADog.png";
import homepageDog from "./images/homepageDog.png";
import footPrint from "./images/footPrint.png";
import { Link } from "react-router-dom";
import "../../Styles/Home.css"

const HomeLandingContainer = (props) => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };
  return (
    <div className="home-container">
      <div className="homeContainer-left">
        <div>
          <p className="home-title">
            <div className="home-titlePlusPng">
            <p>Your Pets </p><img src={homepageDog} alt="Dog sitting"/>
            </div>
            Are Our
            <br />
            Priority
          </p>
          <p className="home-second-para">
          Make sure you're ready to give a loving home to an adopted pet or help reunite a lost pet with its family.
          </p>
        </div>

        <div classname="adopt-btn" style={{ display: "flex", justifyContent: "left", alignItems: "center", gap: "20px", marginTop: "10px" }}>
          <Link to='./pets' style={{ textDecoration: "none" }}>
            <button className="Home-button" style={{ width: "180px" }} onClick={scrollToTop}>
              <p>Adopt a Pet</p><img src={footPrint} alt="footprint" />
            </button>
          </Link>
          <Link to='./find' style={{ textDecoration: "none" }}>
            <button className="Home-button" style={{ width: "180px" }} onClick={scrollToTop}>
              <p>Find a Pet</p><img src={footPrint} alt="footprint" />
            </button>
          </Link>
        </div>
      </div>
      <div className="homeContainer-right">
        <img src={girlHoldingADog} alt='Girl holding a Dog'/>
      </div>
    </div>
  );
};

export default HomeLandingContainer;
