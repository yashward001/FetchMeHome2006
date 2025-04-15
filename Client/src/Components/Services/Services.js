import React from 'react';
import PostAdoptPets from './PostAdoptPets';
import ViewAdoptSection from './ViewAdoptSection';
import ViewFindSection from './ViewFindSection';
import PostLostPets from './PostLostPets';

const Services = () => {
  const user = localStorage.getItem("token"); // Check if user is logged in

  return (
    <div className="main-container">
      {user ? (
        // Show PostAdoptPets & PostLostPets when logged in
        <>
          <div className="post-pet">
            <PostAdoptPets />
          </div>
          <div className="post-lost-pet">
            <PostLostPets />
          </div>
        </>
      ) : (
        // Show ViewAdoptSection & ViewFindSection when NOT logged in
        <>
          <div className="adopt-pet">
            <ViewAdoptSection />
          </div>
          <div className="find-pet">
            <ViewFindSection />
          </div>
        </>
      )}
    </div>
  );
};

export default Services;
