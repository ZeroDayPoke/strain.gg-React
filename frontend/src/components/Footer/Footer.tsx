// ./src/components/Footer/Footer.tsx

import React from 'react';
import {
  StyledFooter,
  StyledFooterContent,
  FooterSection,
  SocialMediaIcons,
} from './FooterStyles';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTwitter,
  faFacebook,
  faInstagram,
} from '@fortawesome/free-brands-svg-icons';

const Footer: React.FC = () => {
  return (
    <StyledFooter>
      <StyledFooterContent>
        <FooterSection>
          <h5>About</h5>
          <p>Discover</p>
        </FooterSection>
        <FooterSection>
          <h5>Contact Us</h5>
          <p>Email: info@???.com</p>
        </FooterSection>
        <FooterSection>
          <h5>Follow Us</h5>
          <SocialMediaIcons>
            <a href="https://twitter.com">
              <FontAwesomeIcon icon={faTwitter} />
            </a>
            <a href="https://facebook.com">
              <FontAwesomeIcon icon={faFacebook} />
            </a>
            <a href="https://instagram.com">
              <FontAwesomeIcon icon={faInstagram} />
            </a>
          </SocialMediaIcons>
        </FooterSection>
      </StyledFooterContent>
      <p>&copy; {new Date().getFullYear()} DPH</p>
    </StyledFooter>
  );
};

export default Footer;
