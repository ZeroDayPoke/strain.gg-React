// ./src/components/Logo/Logo.tsx

import React from 'react';
import styled from 'styled-components';
import logoImage from '../../assets/brand.png';

const StyledLogo = styled.img`
  margin-left: 1rem;
  width: 7rem;
  border-radius: 50%;
  border: 1px solid var(--primary-color);
  box-shadow: 0 0 8px 0 var(--secondary-color);
  transition: all 0.2s;
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 0 12px 0 var(--secondary-color);
  }
`;

const Logo: React.FC = () => {
  return <StyledLogo src={logoImage} alt="??? Logo" />;
};

export default Logo;
