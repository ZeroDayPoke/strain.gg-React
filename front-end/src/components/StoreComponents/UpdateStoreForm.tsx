// ./src/components/UpdateStoreForm.jsx

import axios from 'axios';
import { useState, useEffect } from 'react';

function UpdateStoreForm({ storeId }) {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    axios.get(`/stores/${storeId}`)
      .then(response => {
        const store = response.data;
        setName(store.name);
        setLocation(store.location);
        setPhone(store.phone);
        setEmail(store.email);
        setDescription(store.description);
      })
      .catch(error => console.error(error));
  }, [storeId]);

  const handleSubmit = event => {
    event.preventDefault();

    // Basic form validation
    const validationErrors = {};

    if (!name.trim()) {
      validationErrors.name = 'Name is required';
    }

    if (!location.trim()) {
      validationErrors.location = 'Location is required';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    const updatedStore = {
      name,
      location,
      phone,
      email,
      description,
    };

    axios.put(`/stores/${storeId}`, updatedStore)
      .then(response => {
        console.log('Store updated:', response.data);
        // Reset the form
        setName('');
        setLocation('');
        setPhone('');
        setEmail('');
        setDescription('');
        setErrors({});
      })
      .catch(error => console.error(error));
  };

  return (
    <div>
      <h2>Update Store</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          {errors.name && <p>{errors.name}</p>}
        </label>
        <label>
          Location:
          <input
            type="text"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
          {errors.location && <p>{errors.location}</p>}
        </label>
        <label>
          Phone:
          <input
            type="text"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>
        <label>
          Email:
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>
        <label>
          Description:
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
          ></textarea>
        </label>
        <button type="submit">Update Store</button>
      </form>
    </div>
  );
}

export default UpdateStoreForm;
