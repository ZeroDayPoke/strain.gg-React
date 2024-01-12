// ./src/pages/Home.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

function Home() {
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipcode, setZipcode] = useState('');
  const [squareFootage, setSquareFootage] = useState(0);
  const [yearBuilt, setYearBuilt] = useState(1990);
  const [numberBathrooms, setNumberBathrooms] = useState(1);
  const [numberBedrooms, setNumberBedrooms] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // home object
    const newHome = {
      street,
      city,
      state,
      zipcode,
      squareFootage,
      yearBuilt,
      numberBathrooms,
      numberBedrooms,
    };

    try {
      // Send a POST request to the /homes endpoint
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/homes/create`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newHome),
          credentials: 'include',
        },
      );

      if (!response.ok) {
        throw new Error('Failed to create a new home.');
      }

      console.log('Home successfully created');
      navigate('/');
    } catch (error) {
      console.error('Error creating home:', error);
      setError('An error occurred while creating the home. Please try again.');
    }
  };

  return (
    <div className="Home">
      <h2 className="my-3">Add Home</h2>
      <form onSubmit={handleSubmit}>
        {error && <p>{error}</p>}
        <div className="mb-3">
          <label className="form-label">Street:</label>
          <input
            type="text"
            className="form-control"
            value={street}
            onChange={(e) => setStreet(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">City:</label>
          <input
            type="text"
            className="form-control"
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">State:</label>
          <input
            type="text"
            className="form-control"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Zipcode:</label>
          <input
            type="text"
            className="form-control"
            value={zipcode}
            onChange={(e) => setZipcode(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Square Footage:</label>
          <input
            type="number"
            className="form-control"
            value={squareFootage}
            onChange={(e) => setSquareFootage(Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Year Built:</label>
          <input
            type="number"
            className="form-control"
            value={yearBuilt}
            onChange={(e) => setYearBuilt(Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Bathrooms:</label>
          <input
            type="number"
            className="form-control"
            value={numberBathrooms}
            onChange={(e) => setNumberBathrooms(Number(e.target.value))}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Number of Bedrooms:</label>
          <input
            type="number"
            className="form-control"
            value={numberBedrooms}
            onChange={(e) => setNumberBedrooms(Number(e.target.value))}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          Add Home
        </button>
      </form>
    </div>
  );
}

export default Home;
