import Chatbox from '@/AppComponents/Chatbox'
import ProfileBox from '@/AppComponents/ProfileBox'
import Sidebar from '@/AppComponents/Sidebar'

import React from 'react'

const Profile = () => {
  return (
    <div className='bg-slate-500 max-h-screen no-scrollbar p-10'>
        <div className='max-w-6xl mx-auto flex bg-slate-800 rounded-xl min-h-[90vh]'>
            <Sidebar/>
            <ProfileBox/> 
        </div>
    </div>
  )
}

export default Profile