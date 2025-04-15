import React, { useState } from 'react'
import PostingPets from './UserPostPets'
import AdoptingRequests from './AdoptionReq'
import AdoptedHistory from './UserHistory'
import ApprovedRequests from './UserApproved'
import LostPostingPets from './LostPostingPets'
import LostRequests from "./LostPetRequests"
import SubmittedReq from './SubmittedReq'
import UserProfile from './UserProfile'


const UserScreen = () => {
  const [screen, setScreen] = useState('postingPet')

  return (
    <div className='admin-screen-container'>
      <div className='admin-screen-left'>
        <div>
          <p onClick={() => setScreen('My Profile')}><strong>My Profile</strong></p>
          <p onClick={() => setScreen('postingPet')}>Adoption Posts</p>
          <p onClick={() => setScreen('adoptedHistory')}>Adoption History</p>
          <p onClick={() => setScreen('adoptingPet')}>Adoption Requests</p>
          <p onClick={() => setScreen('approvedRequests')}>My Approved Pets</p>
          <p onClick={() => setScreen('lostPostingPet')}>Lost Pet Posts</p>
          <p onClick={() => setScreen('lostImagePet')}>Lost Pet Requests</p>
          <p onClick={() => setScreen('submitted-req')}>My Submitted Requests</p>
          {/* <p onClick={() => setScreen('lostHistory')}>Lost Pet History</p>
          
          <p onClick={() => setScreen('approvedLostRequests')}>Approved Lost Pets</p> */}

        </div>
      </div>
      <div className='admin-screen-right'>
        {screen === 'My Profile' && <UserProfile />}
        {screen === 'postingPet' && <PostingPets />}
        {screen === 'adoptedHistory' && <AdoptedHistory />}
        {screen === 'adoptingPet' && <AdoptingRequests />}
        {screen === 'approvedRequests' && <ApprovedRequests />}
        {screen === 'lostPostingPet' && <LostPostingPets />}
        {screen === 'lostImagePet' && <LostRequests />}
        {screen === 'submitted-req' && <SubmittedReq />}
        {/* {screen === 'lostHistory' && <LostHistory />}
        
        {screen === 'approvedLostRequests' && <ApprovedLostRequests />} */}
      </div>
    </div>
  )
}

export default UserScreen