import { BrowserRouter, Route, Routes, useNavigate } from 'react-router-dom'
import './App.css'
import { Button } from './components/ui/button'
import Login from './pages/login'
import Signup from './pages/signup'
import Home from './pages/Home'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { connectSocket, getSocket } from './utils/Socket'
import useSocketListener from './hooks/useSocketListener'
import Profile from './pages/Profile'
import RedirectHandler from './AppComponents/RedirectHandler'


function App() {
  const user = useSelector((state) => state.auth.user);

  console.log("App component - user:", user);

  useEffect(() => {
    if(user && user?.id) {
      // console.log("Connecting socket for userId:", user?.id);
      connectSocket(user?.id);

      const socket = getSocket();

      socket?.on("connect", () => {
        console.log("Connected to socket server");
      });

      socket?.on("new-message", (message) => {
        console.log("Received new message:", message);
      });

      socket?.on("new-groupMessage", (message) => {
        console.log("Received new group message:", message);
      });

      socket?.on("disconnect", () => {
        console.log("Disconnected from socket server");
      });

      return () => {
        const socket = getSocket();
        if (socket) socket.disconnect();
      };

    }
  }, [user]);

  

   useSocketListener();

  return (
    <>
      <BrowserRouter>
        {/* <RedirectHandler user={user} /> */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path='/profile/:userId' element={<Profile />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
