import React from "react";
import lostPetImage from "./images/lostdog.png"; 
import { Link } from "react-router-dom";
import "../../Styles/ViewFind.css"

const ViewFindSection = () => {
  const scrollToTop = () => {
    window.scrollTo(0, 0);
  };

  return (
    <section className="find-section">
      <h2 className="section-title">Find a Lost Pet</h2>
      
      {/* Image Wrapper for Proper Layout */}
      <div className="find-image-container">
        <img src={lostPetImage} alt="Lost Pet Search" className="find-image" />
      </div>

      <p className="section-description">
        Losing a pet can be heartbreaking, but our platform helps bring hope by reuniting lost pets with their loving families.
      </p>

      <h3 className="section-subtitle">Benefits of Finding Lost Pets</h3>
      <ul className="section-list">
        <li>Reunite pets with their loving families</li>
        <li>Engage the community in helping lost pets</li>
        <li>Provide verified reports and updates on missing pets</li>
      </ul>

      <h3 className="section-subtitle">Steps to Report a Lost Pet</h3>
      <ol className="section-list numbered-list">
        <li>Submit a lost pet report with key details</li>
        <li>Check found pet listings for possible matches</li>
        <li>Spread awareness through local shelters and networks</li>
      </ol>

      <h3 className="section-subtitle">Responsibilities</h3>
      <p className="section-description">
        Helping lost pets means taking action. Report sightings, spread the word,
        and assist in connecting lost pets with their families.
      </p>

      {/* CTA Button for Lost Pet Reporting */}
      <Link to="/find">
        <button className="cta-button" onClick={scrollToTop}>Report a Lost Pet</button>
      </Link>
    </section>
  );
};

export default ViewFindSection;
