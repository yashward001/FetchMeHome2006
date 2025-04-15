import React, { useState } from 'react'
// import PostingPets from './PostingPets'
import AdoptingRequests from './AdoptingRequests'
import AdoptedHistory from './AdoptedHistory'
import ApprovedRequests from './ApprovedRequests'
import ReportedListing from './ReportedListing'
import ReportedUsers from './ReportedUsers'


const AdminScreen = () => {
  const [screen, setScreen] = useState('postingPet')

  return (
    <div className='admin-screen-container'>
      <div className='admin-screen-left'>
        <div>
          <p onClick={() => setScreen('reported-listing')}>Reported Listings</p>
          <p onClick={() => setScreen('reported-users')}>Reported Users</p>
          {/* <p onClick={() => setScreen('approvedRequests')}>Approved Pets</p>
          <p onClick={() => setScreen('adoptingPet')}>Adoption Requests</p>
          <p onClick={() => setScreen('adoptedHistory')}>Adopted History</p> */}

        </div>
      </div>
      <div className='admin-screen-right'>
        {screen === 'reported-listing' && <ReportedListing />}
        {screen === 'reported-users' && <ReportedUsers />}
        {screen === 'approvedRequests' && <ApprovedRequests />}
        {screen === 'adoptingPet' && <AdoptingRequests />}
        {screen === 'adoptedHistory' && <AdoptedHistory />}
      </div>
    </div>
  )
}

export default AdminScreen
