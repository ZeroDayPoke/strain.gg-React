// ./src/components/AdminPage.jsx

import { useEffect, useState } from 'react';
import { userApi } from '../../api';

function AdminPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const users = await userApi.getAllUsers();
        setUsers(users);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div>
      <h1>Admin Page</h1>
      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default AdminPage;
