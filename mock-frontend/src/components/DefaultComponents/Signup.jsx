// ./src/components/Signup.jsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import { userApi } from '../../api';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store';

function SignupForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (event) => {
    event.preventDefault();
    const userData = { name, email, password, phone };
    try {
      const user = await userApi.signup(userData);
      dispatch(setUser({ roles: user.roles, userId: user.userId, email: user.email }));
      navigate('/');
    } catch (error) {
      setError(error.message);
    }
  };


  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formBasicName">
        <Form.Label>Name</Form.Label>
        <Form.Control type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicEmail">
        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicPassword">
        <Form.Label>Password</Form.Label>
        <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </Form.Group>

      <Form.Group controlId="formBasicPhone">
        <Form.Label>Phone</Form.Label>
        <Form.Control type="text" placeholder="Enter phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
      </Form.Group>

      {error && <Alert variant="danger">{error}</Alert>}

      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
}

export default SignupForm;
