// ./src/pages/Logout.tsx

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { logoutUser } from '../store/userSlice';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(logoutUser()).unwrap();
        navigate('/');
      } catch (error) {
        console.error('There was a problem with the logout operation: ', error);
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return <div>Logging out...</div>;
};

export default Logout;
