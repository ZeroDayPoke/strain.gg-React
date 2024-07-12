// src/components/forms/LoginForm.tsx

import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../store/userSlice';
import { useNavigate } from 'react-router-dom';
import { Spinner, Alert, Button } from 'react-bootstrap';

const LoginValidationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Required'),
  password: Yup.string().required('Required'),
});

const LoginForm: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (values, { setSubmitting, setFieldError }) => {
    try {
      const response = await dispatch(loginUser(values)).unwrap();
      if (response.success) {
        navigate('/home');
      } else {
        setFieldError('general', response.message || 'Login failed');
      }
    } catch (error) {
      setFieldError('general', error.message || 'An error occurred');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={{ email: '', password: '' }}
      validationSchema={LoginValidationSchema}
      onSubmit={handleLogin}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <div>
            <label htmlFor="email">Email</label>
            <Field
              id="email"
              name="email"
              type="email"
              placeholder="Email"
              autoComplete="email"
            />
            <ErrorMessage name="email" component="div" />
          </div>
          <div>
            <label htmlFor="password">Password</label>
            <Field
              id="password"
              name="password"
              type="password"
              placeholder="Password"
              autoComplete="current-password"
            />
            <ErrorMessage name="password" component="div" />
          </div>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? <Spinner animation="border" size="sm" /> : 'Login'}
          </Button>
          {errors.general && <Alert variant="danger">{errors.general}</Alert>}
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
