import React from 'react';
import PostAdoptPets from './PostAdoptPets';
import ViewAdoptSection from './ViewAdoptSection';
import ViewFindSection from './ViewFindSection';
import PostLostPets from './PostLostPets';
import '../../Styles/Services.css';

const Services = () => {
  const user = localStorage.getItem("token"); // Check if user is logged in

  if (user) {
    // User is logged in - show posting forms side by side
    return (
      <div className="services-container">
        <div className="services-header">
          <h1>Pet Services</h1>
          <p>Post your pets for adoption or report lost pets</p>
        </div>
        
        <div className="services-tabs">
          <div className="services-columns">
            <div className="services-column">
              <div className="service-card adoption-service">
                <h2>Post a Pet for Adoption</h2>
                <PostAdoptPets />
              </div>
            </div>
            
            <div className="services-column">
              <div className="service-card lost-service">
                <h2>Report a Lost Pet</h2>
                <PostLostPets />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  } else {
    // User is not logged in - show view sections
    return (
      <div className="services-container">
        <div className="services-header">
          <h1>Pet Services</h1>
          <p>Learn about our adoption and lost pet services</p>
          <div className="login-prompt">
            <p>Please <a href="/login">log in</a> or <a href="/register">register</a> to post pets for adoption or report lost pets</p>
          </div>
        </div>
        
        <div className="services-tabs">
          <div className="services-columns">
            <div className="services-column">
              <div className="service-card adoption-service">
                <ViewAdoptSection />
              </div>
            </div>
            
            <div className="services-column">
              <div className="service-card lost-service">
                <ViewFindSection />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
};

export default Services;