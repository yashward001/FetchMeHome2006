import React, { useState } from 'react'
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
        </div>
      </div>
      <div className='admin-screen-right'>
        {screen === 'reported-listing' && <ReportedListing />}
        {screen === 'reported-users' && <ReportedUsers />}
      </div>
    </div>
  )
}

export default AdminScreen
