// ./src/pages/Admin.tsx

import { useEffect, useState } from 'react';
import { Card, Carousel } from 'react-bootstrap';
import { Home } from '@zerodaypoke/shared-types';

function Admin() {
  const [homes, setHomes] = useState<Home[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHomes = async () => {
      try {
        const response = await fetch(
          `${process.env.REACT_APP_API_URL}/homes/read`,
        );

        if (!response.ok) {
          throw new Error('Failed to fetch homes.');
        }

        const data: Home[] = await response.json();
        setHomes(data);
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching homes.');
      }
    };

    fetchHomes();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="HomesList">
      <h2>All Homes</h2>
      <Carousel>
        {homes.map((home, index) => (
          <Carousel.Item key={index}>
            <Card className="h-100">
              <Card.Body>
                <Card.Text>{home.street}</Card.Text>
                <Card.Text>
                  {home.city}, {home.state} {home.zipcode}
                  <h3>{home.squareFootage}</h3>
                  <h3>{home.yearBuilt}</h3>
                  <h3>{home.numberBathrooms}</h3>
                  <h3>{home.numberBedrooms}</h3>
                </Card.Text>
              </Card.Body>
            </Card>
          </Carousel.Item>
        ))}
      </Carousel>
    </div>
  );
}

export default Admin;
