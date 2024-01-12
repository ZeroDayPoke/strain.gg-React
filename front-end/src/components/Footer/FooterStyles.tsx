// ./src/components/Footer/FooterStyles.tsx

import styled from 'styled-components';

export const StyledFooter = styled.footer`
  background-color: var(--primary-color);
  color: var(--secondary-color);
  padding: 20px;
  text-align: center;
`;

export const StyledFooterContent = styled.div`
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
`;

export const FooterSection = styled.div`
  // Style for each footer section
`;

export const SocialMediaIcons = styled.div`
  a {
    color: var(--secondary-color);
    margin: 0 10px;
    font-size: 1.5rem;

    &:hover {
      color: var(--accent-color-1);
    }
  }
`;
