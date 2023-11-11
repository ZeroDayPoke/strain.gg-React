// ./src/hooks/useForm.jsx
import { useState } from 'react';

export const useForm = (initialState, id, submitAction) => {
  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const updatedFormData = new FormData();
    Object.keys(formData).forEach(key => {
      updatedFormData.append(key, formData[key]);
    });

    submitAction(id, updatedFormData, {
      headers: { "Content-Type": "multipart/form-data" },
    }).then(() => {
      setFormData(initialState);
      setErrors({});
    }).catch(error => console.error(error));
  };

  return {
    formData,
    setFormData,
    handleInputChange,
    handleSubmit,
    errors
  };
};
