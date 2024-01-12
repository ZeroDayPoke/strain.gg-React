// ./src/components/NavBar/NavBarStyles.tsx

import styled from 'styled-components';
import { Navbar, Nav } from 'react-bootstrap';

export const StyledNavbar = styled(Navbar)`
  background-color: var(--secondary-color);
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.1);
  .navbar-toggler {
    border-color: var(--accent-color-1);
  }
  .navbar-brand,
  .navbar-nav .nav-link {
    color: var(--primary-color);
    transition: color 0.3s ease-in-out;
  }
`;

export const StyledNav = styled(Nav)`
  flex-grow: 1;
  justify-content: flex-end;
`;

export const StyledNavBrand = styled(Navbar.Brand)`
  font-family: var(--font-primary);
  font-size: 1.5rem;
  &:hover {
    color: var(--accent-color-2);
  }
`;

export const StyledNavLink = styled(Nav.Link)`
  color: var(--primary-color);
  padding: 0.5rem 1rem;
  margin: 10px 10px 10px 10px;
  border-radius: 0.25rem;
  text-decoration: none;
  transition: background-color 0.3s ease-in-out, color 0.3s ease-in-out;

  &:hover,
  &:focus {
    color: var(--primary-color);
    background-color: var(--accent-color-1);
  }

  &.active {
    color: var(--neutral-color);
    background-color: var(--primary-color);
    border-bottom: 2px solid var(--accent-color-2);
    text-decoration: none;
  }
`;
