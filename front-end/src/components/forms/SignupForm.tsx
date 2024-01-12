// src/components/forms/SignupForm.tsx

import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Button, Alert, Spinner } from 'react-bootstrap';

const SignupSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .min(6, 'Password must be at least 6 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required'),
  phone: Yup.string().optional(),
});

const SignupForm: React.FC<{ onSubmit: (values: any) => void }> = ({
  onSubmit,
}) => {
  return (
    <Formik
      initialValues={{
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: '',
      }}
      validationSchema={SignupSchema}
      onSubmit={(values, actions) => {
        const { confirmPassword, ...submitValues } = values;
        onSubmit(submitValues);
        actions.setSubmitting(false);
      }}
    >
      {({ isSubmitting, errors }) => (
        <Form>
          <Field name="name" type="text" placeholder="Name" />
          <ErrorMessage name="name" component="div" />
          <Field name="email" type="email" placeholder="Email" />
          <ErrorMessage name="email" component="div" />
          <Field name="password" type="password" placeholder="Password" />
          <ErrorMessage name="password" component="div" />
          <Field
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
          />
          <ErrorMessage name="confirmPassword" component="div" />
          <Field name="phone" type="tel" placeholder="Phone" />
          <ErrorMessage name="phone" component="div" />
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Spinner animation="border" size="sm" />
            ) : (
              'Sign Up'
            )}
          </Button>
          {errors.general && <Alert variant="danger">{errors.general}</Alert>}
        </Form>
      )}
    </Formik>
  );
};

export default SignupForm;
