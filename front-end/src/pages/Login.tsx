// src/pages/Login.tsx

import React from 'react';
import styled from 'styled-components';
import LoginForm from '../components/forms/LoginForm';

const LoginContainer = styled.div`
  padding: 20px;
  max-width: 400px;
  margin: auto;
`;

const Login: React.FC = () => {
  return (
    <LoginContainer>
      <h1>Login</h1>
      <LoginForm />
    </LoginContainer>
  );
};

export default Login;
