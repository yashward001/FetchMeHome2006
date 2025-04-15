import React, { useState, useEffect } from 'react';
import PostingPets from './UserPostPets';
import AdoptingRequests from './AdoptionReq';
import AdoptedHistory from './UserHistory';
import ApprovedRequests from './UserApproved';
import LostPostingPets from './LostPostingPets';
import LostRequests from "./LostPetRequests";
import SubmittedReq from './SubmittedReq';
import UserProfile from './UserProfile';
import SavedPets from './SavedPets';
import "../../Styles/UserPanel.css";

const UserScreen = () => {
  const [screen, setScreen] = useState('My Profile');
  const [activeSection, setActiveSection] = useState('profile');

  useEffect(() => {
    // Map screen states to section categories
    const sectionMap = {
      'My Profile': 'profile',
      'savedPets': 'profile',
      'postingPet': 'adoption',
      'adoptedHistory': 'adoption',
      'adoptingPet': 'adoption',
      'approvedRequests': 'adoption',
      'lostPostingPet': 'lost',
      'lostImagePet': 'lost',
      'submitted-req': 'lost'
    };
    
    setActiveSection(sectionMap[screen] || 'profile');
  }, [screen]);

  return (
    <div className='user-screen-container'>
      <div className='user-screen-sidebar'>
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Profile</h3>
          <ul className="sidebar-menu">
            <li className={screen === 'My Profile' ? 'active' : ''}>
              <button onClick={() => setScreen('My Profile')}>
                <i className="fa fa-user"></i> My Profile
              </button>
            </li>
            <li className={screen === 'savedPets' ? 'active' : ''}>
              <button onClick={() => setScreen('savedPets')}>
                <i className="fa fa-heart"></i> Saved Pets
              </button>
            </li>
          </ul>
        </div>
        
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Adoption Management</h3>
          <ul className="sidebar-menu">
            <li className={screen === 'postingPet' ? 'active' : ''}>
              <button onClick={() => setScreen('postingPet')}>
                <i className="fa fa-paw"></i> My Adoption Posts
              </button>
            </li>
            <li className={screen === 'adoptingPet' ? 'active' : ''}>
              <button onClick={() => setScreen('adoptingPet')}>
                <i className="fa fa-inbox"></i> Adoption Requests
              </button>
            </li>
            <li className={screen === 'approvedRequests' ? 'active' : ''}>
              <button onClick={() => setScreen('approvedRequests')}>
                <i className="fa fa-check-circle"></i> Approved Pets
              </button>
            </li>
            <li className={screen === 'adoptedHistory' ? 'active' : ''}>
              <button onClick={() => setScreen('adoptedHistory')}>
                <i className="fa fa-history"></i> Adoption History
              </button>
            </li>
          </ul>
        </div>
        
        <div className="sidebar-section">
          <h3 className="sidebar-heading">Lost Pets</h3>
          <ul className="sidebar-menu">
            <li className={screen === 'lostPostingPet' ? 'active' : ''}>
              <button onClick={() => setScreen('lostPostingPet')}>
                <i className="fa fa-search"></i> My Lost Pet Posts
              </button>
            </li>
            <li className={screen === 'lostImagePet' ? 'active' : ''}>
              <button onClick={() => setScreen('lostImagePet')}>
                <i className="fa fa-bell"></i> Found Pet Notifications
              </button>
            </li>
            <li className={screen === 'submitted-req' ? 'active' : ''}>
              <button onClick={() => setScreen('submitted-req')}>
                <i className="fa fa-paper-plane"></i> My Submitted Reports
              </button>
            </li>
          </ul>
        </div>
      </div>
      
      <div className='user-screen-content'>
        {screen === 'My Profile' && <UserProfile />}
        {screen === 'savedPets' && <SavedPets />}
        {screen === 'postingPet' && <PostingPets />}
        {screen === 'adoptedHistory' && <AdoptedHistory />}
        {screen === 'adoptingPet' && <AdoptingRequests />}
        {screen === 'approvedRequests' && <ApprovedRequests />}
        {screen === 'lostPostingPet' && <LostPostingPets />}
        {screen === 'lostImagePet' && <LostRequests />}
        {screen === 'submitted-req' && <SubmittedReq />}
      </div>
    </div>
  );
};

export default UserScreen;