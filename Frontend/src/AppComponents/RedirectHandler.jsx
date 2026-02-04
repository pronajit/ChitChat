// RedirectHandler.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";

const RedirectHandler = ({ user }) => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = document.cookie
      .split('; ')
      .find(row => row.startsWith('token='))
      ?.split('=')[1];

    if (token) {
      try {
        const decoded = jwtDecode(token);
        const now = Date.now() / 1000;
        if (decoded.exp < now) {
          navigate('/login');
        }
      } catch {
        navigate('/login');
      }
    } else {
      navigate('/login');
    }
  }, [navigate, user]);

  return null;   // doesn’t render anything, just handles redirects
};

export default RedirectHandler;
