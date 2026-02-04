
import Chatbox from '@/AppComponents/Chatbox'
import Sidebar from '../AppComponents/Sidebar'
import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import ProfileBox from '@/AppComponents/ProfileBox'
import { jwtDecode } from 'jwt-decode'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const {user , selectedprofile} = useSelector((state)=>state.auth);

  const navigate = useNavigate();

  // useEffect(()=>{
  //   if(!user) navigate('/login');

  //   const token = document.cookie
  //     .split('; ')
  //     .find(row => row.startsWith('token='))
  //     ?.split('=')[1];

  //   if (token) {
  //     try {
  //       const decoded = jwtDecode(token);
  //       const now = Date.now() / 1000;
  //       if (decoded.exp < now) {
  //         navigate('/login');
  //       }
  //     } catch {
  //       navigate('/login');
  //     }
  //   } else {
  //     navigate('/login');
  //   }
  // }, [navigate, user]);

  return (

    <div className='bg-slate-500 max-h-screen no-scrollbar p-10'>
        <div className='max-w-7xl mx-auto flex bg-slate-800 rounded-xl h-[92vh]'>
            <Sidebar/>
            <Chatbox/> 
            {selectedprofile && <ProfileBox />}
        </div>
    </div>
  )
}

export default Home
