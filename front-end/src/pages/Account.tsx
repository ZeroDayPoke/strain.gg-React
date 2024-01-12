import { useEffect, useState } from 'react';
import { User } from '@zerodaypoke/shared-types';
import userApi from '../api/userApi';

const Account = () => {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData: User = await userApi.getAccount();
        setUser(userData);
      } catch (error) {
        console.error(error);
        setError('An error occurred while fetching user information.');
      }
    };

    fetchUser();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      {error ? (
        <p>{error}</p>
      ) : user ? (
        <>
          <h1>Welcome, {user.name}</h1>
          <p>Your email: {user.email}</p>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Account;
