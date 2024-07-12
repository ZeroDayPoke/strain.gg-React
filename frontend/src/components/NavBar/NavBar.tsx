// ./src/components/NavBar/NavBar.tsx

import { NavLink } from 'react-router-dom';
import { Navbar } from 'react-bootstrap';
import { motion } from 'framer-motion';
import Logo from '../Logo/Logo';
import {
  StyledNavbar,
  StyledNav,
  StyledNavBrand,
  StyledNavLink,
} from './NavBarStyles';
import { NavBarProps } from '@zerodaypoke/shared-types';

const NavBar: React.FC<NavBarProps> = ({ items }) => {
  return (
    <StyledNavbar expand="lg">
      <StyledNavBrand href="/">
        <Logo />
      </StyledNavBrand>
      <Navbar.Toggle
        aria-controls="navbar-nav-dropdown"
        aria-label="Toggle navigation"
      />
      <Navbar.Collapse id="navbar-nav-dropdown">
        <StyledNav className="mr-auto">
          {items.map((item) => (
            <motion.div key={item.name}>
              <StyledNavLink
                as={NavLink}
                to={item.path}
                activeclassname="active"
              >
                {item.name}
              </StyledNavLink>
            </motion.div>
          ))}
        </StyledNav>
      </Navbar.Collapse>
    </StyledNavbar>
  );
};

export default NavBar;
