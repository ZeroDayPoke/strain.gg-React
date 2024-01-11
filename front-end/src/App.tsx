// ./src/App.tsx

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { checkSession } from './store/userSlice';
import NavBar from './components/NavBar/NavBar';
import Footer from './components/Footer/Footer';
import getNavItems from './utils/getNavItems';
import Home from './pages/Home';
import About from './pages/About';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Logout from './pages/Logout';

const App: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const isLoggedIn = !!user;
  const isAdmin = user?.isAdmin;

  useEffect(() => {
    dispatch(checkSession());
  }, [dispatch]);

  const navItems = getNavItems(isLoggedIn, isAdmin);

  return (
    <Router>
      <NavBar items={navItems} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
      </Routes>
      <Footer />
    </Router>
  );
};

export default App;
