// src/pages/Signup.tsx

import styled from 'styled-components';
import SignupForm from '../components/forms/SignupForm';
import { useNavigate } from 'react-router-dom';
import userApi from '../api/userApi';

const SignupContainer = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: auto;
`;

const Signup: React.FC = () => {
  const navigate = useNavigate();

  const handleSignupSubmit = async (values) => {
    try {
      const response = await userApi.signUp(values);
      if (response.success) {
        navigate('/login');
      } else {
        throw new Error(response.message || 'An unknown error occurred.');
      }
    } catch (error) {
      console.error('Signup Error:', error);
    }
  };

  return (
    <SignupContainer>
      <h1>Sign Up</h1>
      <SignupForm onSubmit={handleSignupSubmit} />
    </SignupContainer>
  );
};

export default Signup;
